/**
 * Tests for ScrollToTop.ts - Scroll To Top Module
 */

import {
    generateSvgMarkup,
    applyButtonStyles,
    applySvgStyles,
    shouldShowScrollButton,
    smoothScrollToTop,
    createButton,
    DEFAULT_SCROLL_CONFIG
} from '../ScrollToTop';

describe('DEFAULT_SCROLL_CONFIG', () => {
    test('should have all required properties', () => {
        expect(DEFAULT_SCROLL_CONFIG.buttonD).toBeDefined();
        expect(DEFAULT_SCROLL_CONFIG.buttonT).toBeDefined();
        expect(DEFAULT_SCROLL_CONFIG.shadowSize).toBe('none');
        expect(DEFAULT_SCROLL_CONFIG.roundnessSize).toBe('12px');
        expect(DEFAULT_SCROLL_CONFIG.buttonDToBottom).toBe('32px');
        expect(DEFAULT_SCROLL_CONFIG.buttonDToRight).toBe('32px');
        expect(DEFAULT_SCROLL_CONFIG.selectedBackgroundColor).toBe('#FF8086');
        expect(DEFAULT_SCROLL_CONFIG.selectedIconColor).toBe('#000');
        expect(DEFAULT_SCROLL_CONFIG.buttonWidth).toBe('40px');
        expect(DEFAULT_SCROLL_CONFIG.buttonHeight).toBe('40px');
        expect(DEFAULT_SCROLL_CONFIG.svgWidth).toBe('32px');
        expect(DEFAULT_SCROLL_CONFIG.svgHeight).toBe('32px');
    });
});

describe('generateSvgMarkup', () => {
    test('should return valid SVG string', () => {
        const svg = generateSvgMarkup();

        expect(svg).toContain('<svg');
        expect(svg).toContain('</svg>');
        expect(svg).toContain('class="back-to-top-button-svg"');
        expect(svg).toContain('class="back-to-top-button-img"');
    });

    test('should include width and height', () => {
        const svg = generateSvgMarkup();

        expect(svg).toContain('width="32"');
        expect(svg).toContain('height="32"');
    });

    test('should include viewBox', () => {
        const svg = generateSvgMarkup();

        expect(svg).toContain('viewBox="0 0 32 32"');
    });
});

describe('applyButtonStyles', () => {
    test('should apply all style properties', () => {
        const button = document.createElement('span');

        applyButtonStyles(button, DEFAULT_SCROLL_CONFIG);

        expect(button.style.width).toBe('40px');
        expect(button.style.height).toBe('40px');
        expect(button.style.marginRight).toBe('32px');
        expect(button.style.marginBottom).toBe('32px');
        expect(button.style.borderRadius).toBe('12px');
        expect(button.style.boxShadow).toBe('none');
        expect(button.style.backgroundColor).toBe('rgb(255, 128, 134)');
        expect(button.style.position).toBe('fixed');
        expect(button.style.cursor).toBe('pointer');
        expect(button.style.bottom).toBe('0px');
        expect(button.style.right).toBe('0px');
    });

    test('should apply custom config', () => {
        const button = document.createElement('span');
        const customConfig = {
            ...DEFAULT_SCROLL_CONFIG,
            buttonWidth: '60px',
            buttonHeight: '60px',
            roundnessSize: '50%'
        };

        applyButtonStyles(button, customConfig);

        expect(button.style.width).toBe('60px');
        expect(button.style.height).toBe('60px');
        expect(button.style.borderRadius).toBe('50%');
    });
});

describe('applySvgStyles', () => {
    test('should apply styles to SVG element', () => {
        const svg = document.createElement('svg') as unknown as HTMLElement;

        applySvgStyles(svg, DEFAULT_SCROLL_CONFIG);

        expect(svg.style.verticalAlign).toBe('middle');
        expect(svg.style.margin).toBe('auto');
        expect(svg.style.width).toBe('32px');
        expect(svg.style.height).toBe('32px');
    });

    test('should handle non-HTMLElement gracefully', () => {
        const div = { style: undefined } as unknown as Element;

        expect(() => applySvgStyles(div, DEFAULT_SCROLL_CONFIG)).not.toThrow();
    });
});

describe('shouldShowScrollButton', () => {
    test('should return true when body scroll > threshold', () => {
        Object.defineProperty(document.body, 'scrollTop', { value: 50, writable: true });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });

        expect(shouldShowScrollButton(20)).toBe(true);
    });

    test('should return true when documentElement scroll > threshold', () => {
        Object.defineProperty(document.body, 'scrollTop', { value: 0, writable: true });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 50, writable: true });

        expect(shouldShowScrollButton(20)).toBe(true);
    });

    test('should return false when scroll <= threshold', () => {
        Object.defineProperty(document.body, 'scrollTop', { value: 10, writable: true });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 10, writable: true });

        expect(shouldShowScrollButton(20)).toBe(false);
    });

    test('should use default threshold of 20', () => {
        Object.defineProperty(document.body, 'scrollTop', { value: 21, writable: true });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });

        expect(shouldShowScrollButton()).toBe(true);
    });

    test('should return false at exactly threshold', () => {
        Object.defineProperty(document.body, 'scrollTop', { value: 20, writable: true });
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });

        expect(shouldShowScrollButton(20)).toBe(false);
    });
});

describe('smoothScrollToTop', () => {
    beforeEach(() => {
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 100, writable: true });
        Object.defineProperty(document.body, 'scrollTop', { value: 0, writable: true });
    });

    test('should call window.scrollTo', () => {
        const scrollToSpy = jest.spyOn(window, 'scrollTo');

        smoothScrollToTop();

        expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
    });

    test('should request animation frame when scroll > 0', () => {
        const rafSpy = jest.spyOn(window, 'requestAnimationFrame');

        smoothScrollToTop();

        expect(rafSpy).toHaveBeenCalled();
    });

    test('should not request animation frame when scroll is 0', () => {
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
        Object.defineProperty(document.body, 'scrollTop', { value: 0, writable: true });
        const rafSpy = jest.spyOn(window, 'requestAnimationFrame');

        smoothScrollToTop();

        expect(rafSpy).not.toHaveBeenCalled();
    });
});

describe('createButton', () => {
    test('should create button element', () => {
        const button = createButton(DEFAULT_SCROLL_CONFIG);

        expect(button).not.toBeNull();
        expect(button.tagName).toBe('SPAN');
        expect(button.id).toBe('softr-back-to-top-button');
        expect(button.classList.contains('softr-back-to-top-button')).toBe(true);
    });

    test('should append button to body', () => {
        createButton(DEFAULT_SCROLL_CONFIG);

        const button = document.getElementById('softr-back-to-top-button');
        expect(button).not.toBeNull();
    });

    test('should contain SVG', () => {
        const button = createButton(DEFAULT_SCROLL_CONFIG);

        const svg = button.querySelector('.back-to-top-button-svg');
        expect(svg).not.toBeNull();
    });

    test('should start hidden', () => {
        const button = createButton(DEFAULT_SCROLL_CONFIG);

        expect(button.style.display).toBe('none');
    });

    test('should set up scroll event', () => {
        const button = createButton(DEFAULT_SCROLL_CONFIG);

        // Simulate scroll past threshold
        Object.defineProperty(document.body, 'scrollTop', { value: 50, writable: true });
        window.onscroll?.(new Event('scroll'));

        expect(button.style.display).toBe('block');
    });

    test('should set up click handler', () => {
        const scrollToSpy = jest.spyOn(window, 'scrollTo');
        Object.defineProperty(document.documentElement, 'scrollTop', { value: 100, writable: true });

        const button = createButton(DEFAULT_SCROLL_CONFIG);
        button.click();

        expect(scrollToSpy).toHaveBeenCalled();
    });

    test('should append to pageSimulator when provided', () => {
        const simulator = document.createElement('div');
        document.body.appendChild(simulator);

        const button = createButton(DEFAULT_SCROLL_CONFIG, simulator);

        expect(simulator.contains(button)).toBe(true);
        expect(button.style.position).toBe('absolute');
    });

    test('should not set up scroll handler when pageSimulator is provided', () => {
        const simulator = document.createElement('div');
        document.body.appendChild(simulator);
        const originalOnScroll = window.onscroll;

        createButton(DEFAULT_SCROLL_CONFIG, simulator);

        // onscroll should not be overwritten
        expect(window.onscroll).toBe(originalOnScroll);
    });
});

describe('Button visibility toggle', () => {
    test('button starts hidden', () => {
        const button = createButton(DEFAULT_SCROLL_CONFIG);
        expect(button.style.display).toBe('none');
    });
});
