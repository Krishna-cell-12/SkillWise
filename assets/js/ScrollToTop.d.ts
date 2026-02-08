/**
 * SkillWise Scroll To Top Module
 * Back to top button functionality with strict TypeScript typing
 */
import type { ScrollToTopConfig, Nullable } from './types';
export declare const DEFAULT_SCROLL_CONFIG: ScrollToTopConfig;
/**
 * Generate SVG markup for button
 */
export declare function generateSvgMarkup(): string;
/**
 * Apply styles to button element
 */
export declare function applyButtonStyles(button: HTMLElement, config: ScrollToTopConfig): void;
/**
 * Apply styles to SVG element
 */
export declare function applySvgStyles(svg: Element, config: ScrollToTopConfig): void;
/**
 * Apply styles to SVG path
 */
export declare function applyPathStyles(path: Element, config: ScrollToTopConfig): void;
/**
 * Check if page should show scroll button
 */
export declare function shouldShowScrollButton(scrollThreshold?: number): boolean;
/**
 * Smooth scroll to top of page
 */
export declare function smoothScrollToTop(): void;
/**
 * Create the scroll to top button
 */
export declare function createButton(config: ScrollToTopConfig, pageSimulator?: Nullable<HTMLElement>): HTMLElement;
/**
 * Initialize scroll to top functionality
 */
export declare function initScrollToTop(config?: ScrollToTopConfig): void;
//# sourceMappingURL=ScrollToTop.d.ts.map