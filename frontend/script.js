import { initI18n, setLanguage, getTranslation } from './i18n.js';
import { initTheme, cycleTheme, setTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        navTabs: document.querySelectorAll('.nav-tab'),
        tabContents: document.querySelectorAll('.tab-content'),
        langToggle: document.getElementById('lang-toggle'),
        themeToggle: document.getElementById('theme-toggle'),
        createForm: document.getElementById('create-form'),
        createButton: document.getElementById('create-button'),
        createResult: document.getElementById('create-result'),
        shareUrlInput: document.getElementById('share-url'),
        viewButton: document.getElementById('view-button'),
        loadingSection: document.getElementById('loading-section'),
        passwordSection: document.getElementById('password-section'),
        passwordForm: document.getElementById('password-form'),
        passwordInput: document.getElementById('password-input'),
        decryptButton: document.getElementById('decrypt-button'),
        passwordError: document.getElementById('password-error'),
        contentSection: document.getElementById('content-section'),
        pasteContent: document.getElementById('paste-content'),
        copyButton: document.getElementById('copy-button'),
        newButton: document.getElementById('new-button'),
        errorSection: document.getElementById('error-section'),
        errorMessageText: document.getElementById('error-message-text'),
        homeButton: document.getElementById('home-button'),
        toast: document.getElementById('toast-notification'),
    };

    const API_BASE = '/api';
    let currentShareId = null;
    let toastTimeout;

    function showToast(key, type = 'success') {
        const message = getTranslation(key);
        clearTimeout(toastTimeout);
        elements.toast.textContent = message;
        elements.toast.className = `toast show ${type}`;
        toastTimeout = setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 3000);
    }

    function switchTab(targetId) {
        elements.tabContents.forEach(content => content.classList.toggle('active', content.id === targetId));
        elements.navTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.tab === targetId.replace('-tab', '')));
        window.location.hash = targetId.replace('-tab', '');
    }

    function displayViewResult(sectionToShow) {
        ['loadingSection', 'passwordSection', 'contentSection', 'errorSection'].forEach(id => {
            if (elements[id]) elements[id].classList.add('hidden');
        });
        if (elements[sectionToShow]) {
            elements[sectionToShow].classList.remove('hidden');
        }
    }

    async function createPaste() {
        const form = elements.createForm;
        const content = form.querySelector('#content').value.trim();
        if (!content) {
            showToast('toast_no_content', 'error');
            return;
        }

        elements.createButton.innerHTML = `<span class="spinner"></span> ${getTranslation('creatingButton')}`;
        elements.createButton.disabled = true;

        const formData = new FormData(form);
        const data = {
            content: formData.get('content'),
            expire_hours: parseInt(formData.get('expire_hours')),
            max_views: parseInt(formData.get('max_views')),
            password: formData.get('password') || null
        };

        try {
            const response = await fetch(`${API_BASE}/create`, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }, 
                body: JSON.stringify(data), 
                mode: 'cors' 
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || getTranslation('toast_create_failed'));
            
            const pasteUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}#view?id=${result.unique_id}`;
            elements.createResult.innerHTML = `
                <div class="card">
                    <h3 data-i18n="resultHeader">${getTranslation('resultHeader')}</h3>
                    <div class="input-group">
                        <input type="text" id="new-paste-url" value="${pasteUrl}" readonly>
                        <button id="copy-new-url" class="btn btn-secondary">${getTranslation('copyButton')}</button>
                    </div>
                </div>
            `;
            elements.createResult.classList.remove('hidden');
            document.getElementById('copy-new-url').addEventListener('click', () => {
                navigator.clipboard.writeText(pasteUrl);
                showToast('toast_link_copied');
            });
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            elements.createButton.innerHTML = getTranslation('createButton');
            elements.createButton.disabled = false;
        }
    }

    async function viewPaste(shareId) {
        currentShareId = shareId;
        elements.shareUrlInput.value = shareId;
        displayViewResult('loadingSection');

        try {
            const response = await fetch(`${API_BASE}/get/${shareId}`);
            const result = await response.json();
            if (!response.ok) {
                if (result.detail && result.detail.includes('密码')) {
                    displayViewResult('passwordSection');
                } else {
                    throw new Error(result.detail || getTranslation('toast_view_failed'));
                }
                return;
            }
            elements.pasteContent.textContent = result.content;
            displayViewResult('contentSection');
        } catch (error) {
            elements.errorMessageText.textContent = error.message;
            displayViewResult('errorSection');
        }
    }

    async function viewWithPassword() {
        const password = elements.passwordInput.value;
        if (!password) {
            showToast('toast_no_password', 'error');
            return;
        }

        const originalButtonHTML = elements.decryptButton.innerHTML;
        elements.decryptButton.innerHTML = `<span class="spinner"></span> ${getTranslation('decryptingButton')}`;
        elements.decryptButton.disabled = true;

        try {
            const response = await fetch(`${API_BASE}/get/${currentShareId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.detail || 'Password incorrect');
            
            elements.pasteContent.textContent = result.content;
            displayViewResult('contentSection');
        } catch (error) {
            elements.passwordError.textContent = error.message;
            elements.passwordError.classList.remove('hidden');
            setTimeout(() => elements.passwordError.classList.add('hidden'), 3000);
        } finally {
            elements.decryptButton.innerHTML = originalButtonHTML;
            elements.decryptButton.disabled = false;
        }
    }

    function bindEvents() {
        elements.navTabs.forEach(tab => tab.addEventListener('click', e => { e.preventDefault(); switchTab(tab.getAttribute('href').substring(1) + '-tab'); }));
        elements.langToggle.addEventListener('click', () => setLanguage(document.documentElement.lang === 'zh' ? 'en' : 'zh'));
        elements.themeToggle.addEventListener('click', cycleTheme);
        elements.createForm.addEventListener('submit', e => { e.preventDefault(); createPaste(); });
        elements.passwordForm.addEventListener('submit', e => { e.preventDefault(); viewWithPassword(); });
        elements.viewButton.addEventListener('click', () => {
            const input = elements.shareUrlInput.value.trim();
            const shareId = (input.split('id=')[1] || input.split('/').pop() || '').split('#')[0];
            if (shareId) viewPaste(shareId); else showToast('toast_invalid_link', 'error');
        });
        elements.copyButton.addEventListener('click', () => { navigator.clipboard.writeText(elements.pasteContent.textContent); showToast('toast_copied'); });
        elements.newButton.addEventListener('click', () => switchTab('create-tab'));
        elements.homeButton.addEventListener('click', () => switchTab('create-tab'));
    }

    function init() {
        initI18n();
        initTheme();
        bindEvents();
        const handleUrl = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#view?id=')) {
                const shareId = hash.split('id=')[1];
                switchTab('view-tab');
                viewPaste(shareId);
            } else if (hash) {
                const tabId = hash.substring(1) + '-tab';
                if (document.getElementById(tabId)) switchTab(tabId);
            } else {
                switchTab('create-tab');
            }
        };
        window.addEventListener('hashchange', handleUrl);
        handleUrl();
    }

    init();
});
