/**
 * SkillWise Counter Animation Module
 * Handles animated counters with strict TypeScript typing
 */

import type { CounterConfig, Nullable } from './types';

// ============================================================
// Configuration
// ============================================================

const DEFAULT_COUNTER_CONFIG: CounterConfig = {
    duration: 3000,
    updateInterval: 100
};

// ============================================================
// Counter Functions
// ============================================================

/**
 * Parse data-count attribute to number
 */
export function parseCountTarget(counter: Element): number {
    const countAttr = counter.getAttribute('data-count');
    if (countAttr === null) {
        return 0;
    }
    const parsed = parseInt(countAttr, 10);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculate increment per interval
 */
export function calculateIncrement(
    target: number,
    duration: number,
    interval: number
): number {
    if (duration <= 0 || interval <= 0) {
        return target;
    }
    return target / (duration / interval);
}

/**
 * Start counter animation on a single element
 */
export function startCounter(
    counter: Element,
    config: CounterConfig = DEFAULT_COUNTER_CONFIG
): ReturnType<typeof setInterval> | null {
    const target = parseCountTarget(counter);
    if (target <= 0) {
        return null;
    }

    const increment = calculateIncrement(
        target,
        config.duration,
        config.updateInterval
    );
    let count = 0;

    const updateCounter = setInterval((): void => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(updateCounter);
        }
        counter.textContent = `${Math.floor(count)}+`;
    }, config.updateInterval);

    return updateCounter;
}

/**
 * Create intersection observer for counters
 */
export function createCounterObserver(
    config: CounterConfig = DEFAULT_COUNTER_CONFIG
): IntersectionObserver {
    const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
            entries.forEach((entry: IntersectionObserverEntry): void => {
                if (entry.isIntersecting) {
                    const counter = entry.target.querySelector<HTMLElement>('h1');
                    if (counter !== null) {
                        startCounter(counter, config);
                        observer.unobserve(entry.target);
                    }
                }
            });
        },
        { threshold: 0.2 }
    );

    return observer;
}

/**
 * Initialize counter module
 */
export function initCounters(
    config: CounterConfig = DEFAULT_COUNTER_CONFIG
): void {
    const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
            entries.forEach((entry: IntersectionObserverEntry): void => {
                if (entry.isIntersecting) {
                    const counter = entry.target.querySelector<HTMLElement>('h1');
                    if (counter !== null) {
                        startCounter(counter, config);
                        observer.unobserve(entry.target);
                    }
                }
            });
        },
        { threshold: 0.2 }
    );

    document.querySelectorAll<HTMLElement>('.box').forEach((box: HTMLElement): void => {
        observer.observe(box);
    });
}

// ============================================================
// Header Active Function (imported dependency)
// ============================================================

function getHeader(): Nullable<HTMLElement> {
    return document.querySelector<HTMLElement>('[data-header]');
}

export function headerActive(): void {
    const header = getHeader();
    if (header === null) {
        return;
    }

    if (window.scrollY > 100) {
        header.classList.add('active');
    } else {
        header.classList.remove('active');
    }
}

// ============================================================
// Initialization
// ============================================================

// Add scroll listener for header
window.addEventListener('scroll', headerActive);

// Initialize counters when DOM is ready
document.addEventListener('DOMContentLoaded', (): void => {
    initCounters();
});

// Export for testing
export { DEFAULT_COUNTER_CONFIG };
