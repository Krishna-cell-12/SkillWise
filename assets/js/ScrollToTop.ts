/**
 * SkillWise Scroll To Top Module
 * Back to top button functionality with strict TypeScript typing
 */

import type { ScrollToTopConfig, Nullable } from './types';

// ============================================================
// Configuration
// ============================================================

export const DEFAULT_SCROLL_CONFIG: ScrollToTopConfig = {
    buttonD: 'M8 18.568L10.8 21.333 16 16.198 21.2 21.333 24 18.568 16 10.667z',
    buttonT: 'translate(-1148 -172) translate(832 140) translate(32 32) translate(284)',
    shadowSize: 'none',
    roundnessSize: '12px',
    buttonDToBottom: '32px',
    buttonDToRight: '32px',
    selectedBackgroundColor: '#FF8086',
    selectedIconColor: '#000',
    buttonWidth: '40px',
    buttonHeight: '40px',
    svgWidth: '32px',
    svgHeight: '32px'
};

// ============================================================
// Utility Functions
// ============================================================

/**
 * Generate SVG markup for button
 */
export function generateSvgMarkup(): string {
    return `<svg class="back-to-top-button-svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <g fill="none" fill-rule="evenodd">
      <path d="M0 0H32V32H0z" transform="translate(-1028 -172) translate(832 140) translate(32 32) translate(164) matrix(1 0 0 -1 0 32)" />
      <path class="back-to-top-button-img" fill-rule="nonzero" d="M11.384 13.333h9.232c.638 0 .958.68.505 1.079l-4.613 4.07c-.28.246-.736.246-1.016 0l-4.613-4.07c-.453-.399-.133-1.079.505-1.079z" transform="translate(-1028 -172) translate(832 140) translate(32 32) translate(164) matrix(1 0 0 -1 0 32)" />
    </g>
  </svg>`;
}

/**
 * Apply styles to button element
 */
export function applyButtonStyles(
    button: HTMLElement,
    config: ScrollToTopConfig
): void {
    button.style.width = config.buttonWidth;
    button.style.height = config.buttonHeight;
    button.style.marginRight = config.buttonDToRight;
    button.style.marginBottom = config.buttonDToBottom;
    button.style.borderRadius = config.roundnessSize;
    button.style.boxShadow = config.shadowSize;
    button.style.color = config.selectedBackgroundColor;
    button.style.backgroundColor = config.selectedBackgroundColor;
    button.style.position = 'fixed';
    button.style.outline = 'none';
    button.style.bottom = '0px';
    button.style.right = '0px';
    button.style.cursor = 'pointer';
    button.style.textAlign = 'center';
    button.style.border = 'solid 2px currentColor';
}

/**
 * Apply styles to SVG element
 */
export function applySvgStyles(
    svg: Element,
    config: ScrollToTopConfig
): void {
    if (svg instanceof HTMLElement) {
        svg.style.verticalAlign = 'middle';
        svg.style.margin = 'auto';
        svg.style.justifyContent = 'center';
        svg.style.width = config.svgWidth;
        svg.style.height = config.svgHeight;
    }
}

/**
 * Apply styles to SVG path
 */
export function applyPathStyles(
    path: Element,
    config: ScrollToTopConfig
): void {
    if (path instanceof SVGElement) {
        path.style.fill = config.selectedIconColor;
    }
    path.setAttribute('d', config.buttonD);
    path.setAttribute('transform', config.buttonT);
}

// ============================================================
// Scroll Functions
// ============================================================

/**
 * Check if page should show scroll button
 */
export function shouldShowScrollButton(scrollThreshold: number = 20): boolean {
    const bodyScroll = document.body.scrollTop;
    const documentScroll = document.documentElement.scrollTop;
    return bodyScroll > scrollThreshold || documentScroll > scrollThreshold;
}

/**
 * Smooth scroll to top of page
 */
export function smoothScrollToTop(): void {
    const currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;

    if (currentScroll > 0) {
        window.requestAnimationFrame(smoothScrollToTop);
        window.scrollTo(0, 0);
    }
}

// ============================================================
// Button Creation
// ============================================================

/**
 * Create the scroll to top button
 */
export function createButton(
    config: ScrollToTopConfig,
    pageSimulator: Nullable<HTMLElement> = null
): HTMLElement {
    const body = document.querySelector('body');
    if (body === null) {
        throw new Error('Document body not found');
    }

    const backToTopButton = document.createElement('span');
    backToTopButton.classList.add('softr-back-to-top-button');
    backToTopButton.id = 'softr-back-to-top-button';

    if (pageSimulator !== null) {
        pageSimulator.appendChild(backToTopButton);
    } else {
        body.appendChild(backToTopButton);
    }

    applyButtonStyles(backToTopButton, config);

    // Override position for simulator mode
    if (pageSimulator !== null) {
        backToTopButton.style.position = 'absolute';
    }

    backToTopButton.innerHTML = generateSvgMarkup();

    const backToTopButtonSvg = backToTopButton.querySelector('.back-to-top-button-svg');
    if (backToTopButtonSvg !== null) {
        applySvgStyles(backToTopButtonSvg, config);

        const backToTopButtonImg = backToTopButtonSvg.querySelector('.back-to-top-button-img');
        if (backToTopButtonImg !== null) {
            applyPathStyles(backToTopButtonImg, config);
        }
    }

    if (pageSimulator === null) {
        backToTopButton.style.display = 'none';

        window.onscroll = (): void => {
            if (shouldShowScrollButton()) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        };

        backToTopButton.onclick = (): void => {
            smoothScrollToTop();
        };
    }

    return backToTopButton;
}

// ============================================================
// Initialization
// ============================================================

/**
 * Initialize scroll to top functionality
 */
export function initScrollToTop(
    config: ScrollToTopConfig = DEFAULT_SCROLL_CONFIG
): void {
    createButton(config, null);
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', (): void => {
    initScrollToTop(DEFAULT_SCROLL_CONFIG);
});
