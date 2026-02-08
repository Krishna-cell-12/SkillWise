/**
 * SkillWise Dark Mode Module
 * Theme toggle functionality with strict TypeScript typing
 */
import type { Theme } from './types';
declare const LIGHT_THEME_PATH = "./assets/css/style.css";
declare const DARK_THEME_PATH = "./assets/css/darkmode.css";
declare const LIGHT_ICON = "sunny-outline";
declare const DARK_ICON = "moon-outline";
/**
 * Detect current theme based on stylesheet href
 */
export declare function detectCurrentTheme(stylesheetPath: string): Theme;
/**
 * Get the opposite theme
 */
export declare function getOppositeTheme(currentTheme: Theme): Theme;
/**
 * Get stylesheet path for theme
 */
export declare function getThemeStylesheetPath(theme: Theme): string;
/**
 * Get icon name for theme
 */
export declare function getThemeIconName(theme: Theme): string;
/**
 * Apply theme to DOM elements
 */
export declare function applyTheme(theme: Theme, styleElement: HTMLLinkElement, iconElement: HTMLElement): void;
/**
 * Toggle theme and return new theme
 */
export declare function toggleTheme(styleElement: HTMLLinkElement, iconElement: HTMLElement): Theme;
/**
 * Initialize dark mode toggle
 */
export declare function initDarkMode(): void;
export { LIGHT_THEME_PATH, DARK_THEME_PATH, LIGHT_ICON, DARK_ICON };
//# sourceMappingURL=dark.d.ts.map