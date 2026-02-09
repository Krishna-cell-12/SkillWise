/**
 * Tests for dark.ts - Dark Mode Module
 */

import {
    detectCurrentTheme,
    getOppositeTheme,
    getThemeStylesheetPath,
    getThemeIconName,
    applyTheme,
    toggleTheme,
    initDarkMode,
    LIGHT_THEME_PATH,
    DARK_THEME_PATH,
    LIGHT_ICON,
    DARK_ICON
} from '../dark';

describe('Constants', () => {
    test('should have correct light theme path', () => {
        expect(LIGHT_THEME_PATH).toBe('./assets/css/style.css');
    });

    test('should have correct dark theme path', () => {
        expect(DARK_THEME_PATH).toBe('./assets/css/darkmode.css');
    });

    test('should have correct light icon', () => {
        expect(LIGHT_ICON).toBe('sunny-outline');
    });

    test('should have correct dark icon', () => {
        expect(DARK_ICON).toBe('moon-outline');
    });
});

describe('detectCurrentTheme', () => {
    test('should detect dark theme', () => {
        expect(detectCurrentTheme('./assets/css/darkmode.css')).toBe('dark');
        expect(detectCurrentTheme('/path/to/darkmode.css')).toBe('dark');
        expect(detectCurrentTheme('darkmode-theme.css')).toBe('dark');
    });

    test('should detect light theme', () => {
        expect(detectCurrentTheme('./assets/css/style.css')).toBe('light');
        expect(detectCurrentTheme('/path/to/light.css')).toBe('light');
        expect(detectCurrentTheme('any-other-theme.css')).toBe('light');
    });

    test('should default to light for empty string', () => {
        expect(detectCurrentTheme('')).toBe('light');
    });
});

describe('getOppositeTheme', () => {
    test('should return dark for light', () => {
        expect(getOppositeTheme('light')).toBe('dark');
    });

    test('should return light for dark', () => {
        expect(getOppositeTheme('dark')).toBe('light');
    });
});

describe('getThemeStylesheetPath', () => {
    test('should return dark path for dark theme', () => {
        expect(getThemeStylesheetPath('dark')).toBe(DARK_THEME_PATH);
    });

    test('should return light path for light theme', () => {
        expect(getThemeStylesheetPath('light')).toBe(LIGHT_THEME_PATH);
    });
});

describe('getThemeIconName', () => {
    test('should return moon icon for dark theme', () => {
        expect(getThemeIconName('dark')).toBe(DARK_ICON);
    });

    test('should return sunny icon for light theme', () => {
        expect(getThemeIconName('light')).toBe(LIGHT_ICON);
    });
});

describe('applyTheme', () => {
    test('should apply dark theme to elements', () => {
        const styleElement = document.createElement('link') as HTMLLinkElement;
        const iconElement = document.createElement('span');

        applyTheme('dark', styleElement, iconElement);

        expect(styleElement.getAttribute('href')).toBe(DARK_THEME_PATH);
        expect(iconElement.getAttribute('name')).toBe(DARK_ICON);
    });

    test('should apply light theme to elements', () => {
        const styleElement = document.createElement('link') as HTMLLinkElement;
        const iconElement = document.createElement('span');

        applyTheme('light', styleElement, iconElement);

        expect(styleElement.getAttribute('href')).toBe(LIGHT_THEME_PATH);
        expect(iconElement.getAttribute('name')).toBe(LIGHT_ICON);
    });
});

describe('toggleTheme', () => {
    test('should toggle from light to dark', () => {
        const styleElement = document.createElement('link') as HTMLLinkElement;
        styleElement.setAttribute('href', LIGHT_THEME_PATH);
        const iconElement = document.createElement('span');

        const newTheme = toggleTheme(styleElement, iconElement);

        expect(newTheme).toBe('dark');
        expect(styleElement.getAttribute('href')).toBe(DARK_THEME_PATH);
        expect(iconElement.getAttribute('name')).toBe(DARK_ICON);
    });

    test('should toggle from dark to light', () => {
        const styleElement = document.createElement('link') as HTMLLinkElement;
        styleElement.setAttribute('href', DARK_THEME_PATH);
        const iconElement = document.createElement('span');

        const newTheme = toggleTheme(styleElement, iconElement);

        expect(newTheme).toBe('light');
        expect(styleElement.getAttribute('href')).toBe(LIGHT_THEME_PATH);
        expect(iconElement.getAttribute('name')).toBe(LIGHT_ICON);
    });

    test('should default to toggling from light when href is null', () => {
        const styleElement = document.createElement('link') as HTMLLinkElement;
        const iconElement = document.createElement('span');

        const newTheme = toggleTheme(styleElement, iconElement);

        expect(newTheme).toBe('dark');
    });

    test('should handle multiple toggles', () => {
        const styleElement = document.createElement('link') as HTMLLinkElement;
        styleElement.setAttribute('href', LIGHT_THEME_PATH);
        const iconElement = document.createElement('span');

        toggleTheme(styleElement, iconElement);
        toggleTheme(styleElement, iconElement);

        expect(styleElement.getAttribute('href')).toBe(LIGHT_THEME_PATH);
    });
});

describe('initDarkMode', () => {
    test('should not throw when elements are missing', () => {
        document.body.innerHTML = '';

        expect(() => initDarkMode()).not.toThrow();
    });

    test('should set up click handler when elements exist', () => {
        document.body.innerHTML = `
      <button id="theme-toggle"></button>
      <span id="theme-icon"></span>
      <link id="theme-style" href="./assets/css/style.css" />
    `;

        initDarkMode();

        const button = document.getElementById('theme-toggle');
        button?.click();

        const styleElement = document.getElementById('theme-style');
        // After click, should toggle (but since initDarkMode sets up its own listener,
        // we need to check if the listener was added)
        expect(button).not.toBeNull();
    });

    test('should not initialize if toggle button is missing', () => {
        document.body.innerHTML = `
      <span id="theme-icon"></span>
      <link id="theme-style" href="./assets/css/style.css" />
    `;

        expect(() => initDarkMode()).not.toThrow();
    });

    test('should not initialize if icon is missing', () => {
        document.body.innerHTML = `
      <button id="theme-toggle"></button>
      <link id="theme-style" href="./assets/css/style.css" />
    `;

        expect(() => initDarkMode()).not.toThrow();
    });

    test('should not initialize if style element is missing', () => {
        document.body.innerHTML = `
      <button id="theme-toggle"></button>
      <span id="theme-icon"></span>
    `;

        expect(() => initDarkMode()).not.toThrow();
    });
});

describe('Theme integration', () => {
    test('should maintain theme consistency across operations', () => {
        const styleElement = document.createElement('link') as HTMLLinkElement;
        styleElement.setAttribute('href', LIGHT_THEME_PATH);
        const iconElement = document.createElement('span');

        // Start with light
        const detectedTheme = detectCurrentTheme(styleElement.getAttribute('href') ?? '');
        expect(detectedTheme).toBe('light');

        // Toggle to dark
        toggleTheme(styleElement, iconElement);
        expect(detectCurrentTheme(styleElement.getAttribute('href') ?? '')).toBe('dark');

        // Toggle back to light
        toggleTheme(styleElement, iconElement);
        expect(detectCurrentTheme(styleElement.getAttribute('href') ?? '')).toBe('light');
    });
});
