const themes = ['light', 'dark', 'system'];
let currentThemeIndex = 0; // 0: light, 1: dark, 2: system

function applyTheme(theme) {
    // Determine the actual theme to apply (light or dark)
    const effectiveTheme = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
    
    document.body.dataset.theme = effectiveTheme;

    // Update the icon visibility to reflect the selected mode (light, dark, or system)
    document.querySelectorAll('#theme-toggle .icon').forEach(icon => {
        icon.style.display = 'none';
    });
    const iconToShow = document.querySelector(`#theme-toggle .icon-${theme}`);
    if (iconToShow) {
        iconToShow.style.display = 'block';
    }
}

function setTheme(theme) {
    currentThemeIndex = themes.indexOf(theme);
    if (currentThemeIndex === -1) currentThemeIndex = 2; // Default to system
    
    localStorage.setItem('theme', theme);
    applyTheme(theme);
}

function cycleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[currentThemeIndex];
    setTheme(nextTheme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (themes[currentThemeIndex] === 'system') {
            applyTheme('system');
        }
    });
}

export { initTheme, cycleTheme, setTheme };
