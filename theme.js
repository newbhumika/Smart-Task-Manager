// Theme toggling (light / dark)
(function () {
    const THEME_KEY = 'stm-theme';

    function getPreferredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark') return stored;

        if (window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        updateToggleUI(theme);
    }

    function updateToggleUI(theme) {
        const btn = document.getElementById('themeToggle');
        const label = document.getElementById('themeToggleLabel');
        const icon = document.getElementById('themeToggleIcon');
        if (!btn || !label || !icon) return;

        if (theme === 'dark') {
            label.textContent = 'Dark mode';
            icon.textContent = '🌙';
        } else {
            label.textContent = 'Light mode';
            icon.textContent = '☀️';
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const current = getPreferredTheme();
        applyTheme(current);

        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.addEventListener('click', () => {
                const next = document.body.getAttribute('data-theme') === 'dark'
                    ? 'light'
                    : 'dark';
                applyTheme(next);
            });
        }
    });
})();


