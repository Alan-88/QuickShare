// QuickShare 查看页面 JavaScript

// API 基础地址
const API_BASE = '/api';

// 页面元素
const loadingSection = document.getElementById('loading-section');
const passwordSection = document.getElementById('password-section');
const contentSection = document.getElementById('content-section');
const errorSection = document.getElementById('error-section');

const passwordForm = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const passwordError = document.getElementById('password-error');

const pasteContent = document.getElementById('paste-content');
const expireInfo = document.getElementById('expire-info');
const viewsInfo = document.getElementById('views-info');
const destroyWarning = document.getElementById('destroy-warning');

const copyButton = document.getElementById('copy-button');
const newButton = document.getElementById('new-button');
const retryButton = document.getElementById('retry-button');
const homeButton = document.getElementById('home-button');

const errorMessage = document.getElementById('error-message');
const copyToast = document.getElementById('copy-toast');
const copyMessage = document.getElementById('copy-message');

// 当前分享数据
let currentPaste = null;
let uniqueId = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从 URL 获取 unique_id
    const urlParams = new URLSearchParams(window.location.search);
    uniqueId = urlParams.get('id') || window.location.pathname.split('/').pop();
    
    if (!uniqueId || uniqueId === 'view.html') {
        showError('无效的分享链接');
        return;
    }
    
    // 绑定事件
    passwordForm.addEventListener('submit', handlePasswordSubmit);
    copyButton.addEventListener('click', copyContent);
    newButton.addEventListener('click', goToHome);
    retryButton.addEventListener('click', loadPaste);
    homeButton.addEventListener('click', goToHome);
    
    // 加载内容
    loadPaste();
});

// 加载分享内容
async function loadPaste() {
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/get/${uniqueId}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '获取内容失败');
        }
        
        const data = await response.json();
        currentPaste = data;
        
        if (data.requires_password) {
            showPasswordSection();
        } else {
            showContent(data);
        }
        
    } catch (error) {
        console.error('加载内容失败:', error);
        showError(error.message || '网络错误，请稍后重试');
    }
}

// 处理密码提交
async function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const password = passwordInput.value.trim();
    if (!password) {
        showPasswordError('请输入密码');
        return;
    }
    
    const decryptButton = document.getElementById('decrypt-button');
    const originalText = decryptButton.innerHTML;
    decryptButton.innerHTML = '<i class="icon">🔓</i> 解密中...';
    decryptButton.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/get/${uniqueId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '密码错误');
        }
        
        const data = await response.json();
        currentPaste = data;
        showContent(data);
        
    } catch (error) {
        console.error('解密失败:', error);
        showPasswordError(error.message || '密码错误，请重试');
        decryptButton.innerHTML = originalText;
        decryptButton.disabled = false;
    }
}

// 显示加载状态
function showLoading() {
    hideAllSections();
    loadingSection.style.display = 'block';
}

// 显示密码输入界面
function showPasswordSection() {
    hideAllSections();
    passwordSection.style.display = 'block';
    passwordInput.value = '';
    passwordError.style.display = 'none';
    passwordInput.focus();
}

// 显示内容
function showContent(data) {
    hideAllSections();
    contentSection.style.display = 'block';
    
    // 显示内容
    pasteContent.textContent = data.content;
    
    // 显示元信息
    updateMetaInfo(data);
    
    // 显示自毁警告
    if (data.will_destroy) {
        destroyWarning.style.display = 'block';
    } else {
        destroyWarning.style.display = 'none';
    }
    
    // 添加淡入动画
    contentSection.classList.add('fade-in');
}

// 更新元信息
function updateMetaInfo(data) {
    // 过期时间信息
    if (data.expires_at) {
        const expireDate = new Date(data.expires_at);
        const now = new Date();
        const timeDiff = expireDate - now;
        
        if (timeDiff > 0) {
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            
            if (hours > 0) {
                expireInfo.textContent = `⏰ ${hours}小时${minutes}分钟后过期`;
            } else {
                expireInfo.textContent = `⏰ ${minutes}分钟后过期`;
            }
        } else {
            expireInfo.textContent = '⏰ 已过期';
        }
    } else {
        expireInfo.textContent = '⏰ 永不过期';
    }
    
    // 查看次数信息
    if (data.max_views) {
        viewsInfo.textContent = `👁️ ${data.view_count}/${data.max_views} 次查看`;
    } else {
        viewsInfo.textContent = '👁️ 无限制查看';
    }
}

// 显示错误信息
function showError(message) {
    hideAllSections();
    errorSection.style.display = 'block';
    errorMessage.textContent = message;
}

// 显示密码错误
function showPasswordError(message) {
    passwordError.textContent = message;
    passwordError.style.display = 'block';
    passwordInput.focus();
    passwordInput.select();
}

// 隐藏所有区域
function hideAllSections() {
    loadingSection.style.display = 'none';
    passwordSection.style.display = 'none';
    contentSection.style.display = 'none';
    errorSection.style.display = 'none';
}

// 复制内容到剪贴板
async function copyContent() {
    try {
        await navigator.clipboard.writeText(currentPaste.content);
        showToast('内容已复制到剪贴板');
    } catch (error) {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = currentPaste.content;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('内容已复制到剪贴板');
        } catch (error) {
            showToast('复制失败，请手动复制');
        }
        
        document.body.removeChild(textArea);
    }
}

// 显示提示消息
function showToast(message) {
    copyMessage.textContent = message;
    copyToast.style.display = 'flex';
    
    setTimeout(() => {
        copyToast.style.display = 'none';
    }, 3000);
}

// 返回首页
function goToHome() {
    window.location.href = '/';
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl+C 或 Cmd+C 复制内容
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && currentPaste) {
        e.preventDefault();
        copyContent();
    }
    
    // Esc 返回首页
    if (e.key === 'Escape') {
        goToHome();
    }
    
    // 在密码输入界面按 Enter 提交密码
    if (e.key === 'Enter' && passwordSection.style.display === 'block') {
        passwordForm.dispatchEvent(new Event('submit'));
    }
});

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && currentPaste && currentPaste.will_destroy) {
        // 如果页面重新可见且内容会自毁，提醒用户
        console.log('页面重新可见，内容可能已被销毁');
    }
});

// 页面卸载前的处理
window.addEventListener('beforeunload', function(e) {
    if (currentPaste && currentPaste.will_destroy) {
        // 如果内容会自毁，提醒用户
        const message = '此内容将在访问后自动销毁，确定要离开吗？';
        e.returnValue = message;
        return message;
    }
});

// 定期更新过期时间显示
let updateInterval = null;

function startMetaUpdate() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    updateInterval = setInterval(() => {
        if (currentPaste && contentSection.style.display === 'block') {
            updateMetaInfo(currentPaste);
        }
    }, 60000); // 每分钟更新一次
}

function stopMetaUpdate() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

// 页面加载时启动元信息更新
startMetaUpdate();

// 页面卸载时停止更新
window.addEventListener('unload', stopMetaUpdate);

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    if (!currentPaste) {
        showError('页面加载出错，请刷新重试');
    }
});

// 网络状态监听
window.addEventListener('online', function() {
    if (!currentPaste) {
        loadPaste();
    }
});

window.addEventListener('offline', function() {
    if (currentPaste) {
        showToast('网络连接已断开');
    } else {
        showError('网络连接已断开，请检查网络后重试');
    }
});
