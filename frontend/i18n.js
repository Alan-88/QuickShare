const translations = {
    en: {
        // Header & Nav
        createTab: 'Create',
        viewTab: 'View',
        aboutTab: 'About',

        // Home Tab (更改)
        homeHeader: 'Securely share text and code snippets. Your content is encrypted and self-destructs.',
        homeButton: 'Create a Link',

        // Create Tab
        createHeader: 'Share Content',
        createPlaceholder: 'Paste any text or code here...',
        expireLabel: 'Expiration Time',
        expire_1h: '1 Hour',
        expire_6h: '6 Hours',
        expire_1d: '1 Day',
        expire_3d: '3 Days',
        expire_7d: '1 Week',
        expire_0: 'Never',
        viewsLabel: 'Max Views',
        views_1: '1 View (Burn after read)',
        views_3: '3 Views',
        views_10: '10 Views',
        views_0: 'Unlimited',
        passwordLabel: 'Optional Password',
        passwordPlaceholder: 'Leave blank for no password',
        createButton: 'Create Share Link',
        creatingButton: 'Creating...',

        // Create Result
        resultHeader: 'Share Link Created',
        copyButton: 'Copy',

        // View Tab
        viewHeader: 'Share Link or ID',
        viewPlaceholder: 'Paste share link or enter ID',
        viewButton: 'View Content',

        // View Result
        encryptedHeader: 'Content Encrypted',
        encryptedMessage: 'A password is required to view this content.',
        decryptButton: 'Decrypt',
        decryptingButton: 'Decrypting...',
        contentHeader: 'Shared Content',
        copyContentButton: 'Copy Content',
        newShareButton: 'Create New Share',
        errorHeader: 'Unable to Access Content',
        homeButton: 'Share a Text',

        // About Tab
        aboutHeader: 'About QuickShare',
        aboutP1: 'A minimal, secure, and privacy-focused tool for sharing text.',
        feature1: 'Stored encrypted to protect privacy',
        feature2: 'Burn-after-read by views or time',
        feature3: 'Lightweight and fast, no unnecessary tracking or ads',
        feature4: 'Simple interface, focused on core sharing experience',
        techStack: 'Tech Stack',
        techStackContent: 'Backend: Python (FastAPI) | Frontend: Vanilla JavaScript | Database: PostgreSQL / SQLite',

        // 新增
        aboutAuthorHeader: 'About Author',
        aboutAuthorP1: 'Hello, I\'m Alan.',
        aboutAuthorP2: 'A developer passionate about building simple, practical tools. Feel free to connect with me.',

        // Toasts
        toast_copied: 'Copied to clipboard',
        toast_link_copied: 'Link copied to clipboard',
        toast_no_content: 'Content cannot be empty',
        toast_invalid_link: 'Invalid link or ID',
        toast_no_password: 'Password is required',
        toast_create_failed: 'Failed to create share',
        toast_view_failed: 'Failed to retrieve content',
    },
    zh: {
        // Header & Nav
        createTab: '创建',
        viewTab: '查看',
        aboutTab: '关于',

        // Home Tab (更改)
        homeHeader: '安全地分享文本和代码片段。您的内容将被加密并自动销毁。',
        homeButton: '创建分享',

        // Create Tab
        createHeader: '分享内容',
        createPlaceholder: '在此粘贴任何文本或代码...',
        expireLabel: '过期时间',
        expire_1h: '1 小时',
        expire_6h: '6 小时',
        expire_1d: '1 天',
        expire_3d: '3 天',
        expire_7d: '1 周',
        expire_0: '永不',
        viewsLabel: '最大查看次数',
        views_1: '1 次 (阅后即焚)',
        views_3: '3 次',
        views_10: '10 次',
        views_0: '不限',
        passwordLabel: '可选密码',
        passwordPlaceholder: '留空则无需密码',
        createButton: '创建分享链接',
        creatingButton: '创建中...',

        // Create Result
        resultHeader: '分享链接已创建',
        copyButton: '复制',

        // View Tab
        viewHeader: '分享链接或 ID',
        viewPlaceholder: '粘贴分享链接或输入ID',
        viewButton: '查看内容',

        // View Result
        encryptedHeader: '内容已加密',
        encryptedMessage: '需要密码才能查看此分享。',
        decryptButton: '解密',
        decryptingButton: '解密中...',
        contentHeader: '分享内容',
        copyContentButton: '复制内容',
        newShareButton: '创建新分享',
        errorHeader: '无法访问内容',
        homeButton: '分享文本',

        // About Tab
        aboutHeader: '关于 QuickShare',
        aboutP1: '一个极简、安全、注重隐私的文本分享工具。',
        feature1: '存储加密，保障内容隐私',
        feature2: '阅后即焚，支持按次数或时间销毁',
        feature3: '轻量快速，无任何不必要的追踪或广告',
        feature4: '界面简洁，专注于核心分享体验',
        techStack: '技术栈',
        techStackContent: '后端: Python (FastAPI) | 前端: Vanilla JavaScript | 数据库: PostgreSQL / SQLite',

        // 新增 (使用你提供的文本)
        aboutAuthorHeader: '关于作者',
        aboutAuthorP1: '你好，我是 Alan.',
        aboutAuthorP2: '一个热衷于构建简洁、实用工具的开发者，欢迎通过以下方式与我联系。',

        // Toasts
        toast_copied: '已复制到剪贴板',
        toast_link_copied: '链接已复制到剪贴板',
        toast_no_content: '分享内容不能为空',
        toast_invalid_link: '无效的链接或ID',
        toast_no_password: '请输入密码',
        toast_create_failed: '创建失败',
        toast_view_failed: '获取内容失败',
    }
};

let currentLanguage = 'zh';

function setLanguage(lang) {
    if (lang.startsWith('en')) {
        currentLanguage = 'en';
    } else {
        currentLanguage = 'zh';
    }
    
    document.documentElement.lang = currentLanguage;
    localStorage.setItem('language', currentLanguage);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[currentLanguage][key]) {
            // Handle different element types
            if (el.placeholder !== undefined) {
                el.placeholder = translations[currentLanguage][key];
            } else {
                el.textContent = translations[currentLanguage][key];
            }
        }
    });
}

function getTranslation(key) {
    return translations[currentLanguage][key] || key;
}

function initI18n() {
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language;
    const lang = savedLang || browserLang || 'zh';
    setLanguage(lang);
}

export { setLanguage, initI18n, getTranslation };
