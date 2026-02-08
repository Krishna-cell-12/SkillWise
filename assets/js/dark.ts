/**
 * SkillWise Dark Mode Module
 * Theme toggle functionality with strict TypeScript typing
 */

import type { Theme, Nullable } from './types';

// ============================================================
// Constants
// ============================================================

const LIGHT_THEME_PATH = './assets/css/style.css';
const DARK_THEME_PATH = './assets/css/darkmode.css';
const LIGHT_ICON = 'sunny-outline';
const DARK_ICON = 'moon-outline';

// ============================================================
// DOM Element Accessors
// ============================================================

function getThemeToggleButton(): Nullable<HTMLElement> {
    return document.getElementById('theme-toggle');
}

function getThemeIcon(): Nullable<HTMLElement> {
    return document.getElementById('theme-icon');
}

function getThemeStyle(): Nullable<HTMLLinkElement> {
    return document.getElementById('theme-style') as Nullable<HTMLLinkElement>;
}

// ============================================================
// Theme Detection Functions
// ============================================================

/**
 * Detect current theme based on stylesheet href
 */
export function detectCurrentTheme(stylesheetPath: string): Theme {
    if (stylesheetPath.includes('darkmode')) {
        return 'dark';
    }
    return 'light';
}

/**
 * Get the opposite theme
 */
export function getOppositeTheme(currentTheme: Theme): Theme {
    return currentTheme === 'light' ? 'dark' : 'light';
}

/**
 * Get stylesheet path for theme
 */
export function getThemeStylesheetPath(theme: Theme): string {
    return theme === 'dark' ? DARK_THEME_PATH : LIGHT_THEME_PATH;
}

/**
 * Get icon name for theme
 */
export function getThemeIconName(theme: Theme): string {
    return theme === 'dark' ? DARK_ICON : LIGHT_ICON;
}

// ============================================================
// Theme Toggle Logic
// ============================================================

/**
 * Apply theme to DOM elements
 */
export function applyTheme(
    theme: Theme,
    styleElement: HTMLLinkElement,
    iconElement: HTMLElement
): void {
    const stylePath = getThemeStylesheetPath(theme);
    const iconName = getThemeIconName(theme);

    styleElement.setAttribute('href', stylePath);
    iconElement.setAttribute('name', iconName);
}

/**
 * Toggle theme and return new theme
 */
export function toggleTheme(
    styleElement: HTMLLinkElement,
    iconElement: HTMLElement
): Theme {
    const currentPath = styleElement.getAttribute('href') ?? LIGHT_THEME_PATH;
    const currentTheme = detectCurrentTheme(currentPath);
    const newTheme = getOppositeTheme(currentTheme);

    applyTheme(newTheme, styleElement, iconElement);

    return newTheme;
}

// ============================================================
// Initialization
// ============================================================

/**
 * Initialize dark mode toggle
 */
export function initDarkMode(): void {
    const themeToggleButton = getThemeToggleButton();
    const themeIcon = getThemeIcon();
    const themeStyle = getThemeStyle();

    if (themeToggleButton === null || themeIcon === null || themeStyle === null) {
        // Required elements not found, skip initialization
        return;
    }

    themeToggleButton.addEventListener('click', (): void => {
        const iconEl = getThemeIcon();
        const styleEl = getThemeStyle();

        if (iconEl !== null && styleEl !== null) {
            toggleTheme(styleEl, iconEl);
        }
    });
}

// Auto-initialize when script loads
const toggleButton = getThemeToggleButton();
const icon = getThemeIcon();
const style = getThemeStyle();

if (toggleButton !== null && icon !== null && style !== null) {
    toggleButton.addEventListener('click', (): void => {
        const iconEl = getThemeIcon();
        const styleEl = getThemeStyle();

        if (iconEl !== null && styleEl !== null) {
            toggleTheme(styleEl, iconEl);
        }
    });
}

// Export constants for testing
export {
    LIGHT_THEME_PATH,
    DARK_THEME_PATH,
    LIGHT_ICON,
    DARK_ICON
};
