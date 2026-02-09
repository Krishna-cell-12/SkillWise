/**
 * SkillWise Counter Animation Module
 * Handles animated counters with strict TypeScript typing
 */
// ============================================================
// Configuration
// ============================================================
const DEFAULT_COUNTER_CONFIG = {
    duration: 3000,
    updateInterval: 100
};
// ============================================================
// Counter Functions
// ============================================================
/**
 * Parse data-count attribute to number
 */
export function parseCountTarget(counter) {
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
export function calculateIncrement(target, duration, interval) {
    if (duration <= 0 || interval <= 0) {
        return target;
    }
    return target / (duration / interval);
}
/**
 * Start counter animation on a single element
 */
export function startCounter(counter, config = DEFAULT_COUNTER_CONFIG) {
    const target = parseCountTarget(counter);
    if (target <= 0) {
        return null;
    }
    const increment = calculateIncrement(target, config.duration, config.updateInterval);
    let count = 0;
    const updateCounter = setInterval(() => {
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
export function createCounterObserver(config = DEFAULT_COUNTER_CONFIG) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('h1');
                if (counter !== null) {
                    startCounter(counter, config);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.2 });
    return observer;
}
/**
 * Initialize counter module
 */
export function initCounters(config = DEFAULT_COUNTER_CONFIG) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('h1');
                if (counter !== null) {
                    startCounter(counter, config);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.box').forEach((box) => {
        observer.observe(box);
    });
}
// ============================================================
// Header Active Function (imported dependency)
// ============================================================
function getHeader() {
    return document.querySelector('[data-header]');
}
export function headerActive() {
    const header = getHeader();
    if (header === null) {
        return;
    }
    if (window.scrollY > 100) {
        header.classList.add('active');
    }
    else {
        header.classList.remove('active');
    }
}
// ============================================================
// Initialization
// ============================================================
// Add scroll listener for header
window.addEventListener('scroll', headerActive);
// Initialize counters when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initCounters();
});
// Export for testing
export { DEFAULT_COUNTER_CONFIG };
