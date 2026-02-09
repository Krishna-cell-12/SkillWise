/**
 * Tests for counter.ts - Counter Animation Module
 */

import {
    parseCountTarget,
    calculateIncrement,
    startCounter,
    headerActive,
    DEFAULT_COUNTER_CONFIG
} from '../counter';

describe('parseCountTarget', () => {
    test('should parse valid data-count attribute', () => {
        const element = document.createElement('div');
        element.setAttribute('data-count', '100');

        expect(parseCountTarget(element)).toBe(100);
    });

    test('should return 0 for missing attribute', () => {
        const element = document.createElement('div');

        expect(parseCountTarget(element)).toBe(0);
    });

    test('should return 0 for non-numeric value', () => {
        const element = document.createElement('div');
        element.setAttribute('data-count', 'abc');

        expect(parseCountTarget(element)).toBe(0);
    });

    test('should handle negative numbers', () => {
        const element = document.createElement('div');
        element.setAttribute('data-count', '-50');

        expect(parseCountTarget(element)).toBe(-50);
    });

    test('should handle decimal strings (parseInt behavior)', () => {
        const element = document.createElement('div');
        element.setAttribute('data-count', '42.7');

        expect(parseCountTarget(element)).toBe(42);
    });

    test('should handle empty string', () => {
        const element = document.createElement('div');
        element.setAttribute('data-count', '');

        expect(parseCountTarget(element)).toBe(0);
    });
});

describe('calculateIncrement', () => {
    test('should calculate correct increment', () => {
        // target: 100, duration: 3000ms, interval: 100ms
        // increments = 3000/100 = 30
        // increment per step = 100/30 = 3.33...
        const result = calculateIncrement(100, 3000, 100);
        expect(result).toBeCloseTo(3.333, 2);
    });

    test('should return target for zero duration', () => {
        expect(calculateIncrement(100, 0, 100)).toBe(100);
    });

    test('should return target for zero interval', () => {
        expect(calculateIncrement(100, 3000, 0)).toBe(100);
    });

    test('should handle large numbers', () => {
        const result = calculateIncrement(1000000, 5000, 50);
        expect(result).toBeCloseTo(10000, 0);
    });

    test('should handle small increments', () => {
        const result = calculateIncrement(10, 10000, 100);
        expect(result).toBeCloseTo(0.1, 2);
    });
});

describe('startCounter', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should animate counter from 0 to target', () => {
        const counter = document.createElement('h1');
        counter.setAttribute('data-count', '100');

        startCounter(counter, { duration: 1000, updateInterval: 100 });

        // After 500ms (5 intervals), should be approximately 50
        jest.advanceTimersByTime(500);
        const midValue = parseInt(counter.textContent?.replace('+', '') ?? '0', 10);
        expect(midValue).toBeGreaterThan(40);
        expect(midValue).toBeLessThan(60);

        // After 1000ms, should be 100
        jest.advanceTimersByTime(500);
        expect(counter.textContent).toBe('100+');
    });

    test('should return null for non-positive target', () => {
        const counter = document.createElement('h1');
        counter.setAttribute('data-count', '0');

        const result = startCounter(counter);
        expect(result).toBeNull();
    });

    test('should return null for missing target', () => {
        const counter = document.createElement('h1');

        const result = startCounter(counter);
        expect(result).toBeNull();
    });

    test('should use default config when not provided', () => {
        const counter = document.createElement('h1');
        counter.setAttribute('data-count', '30');

        const intervalId = startCounter(counter);
        expect(intervalId).not.toBeNull();

        // With default config (3000ms duration, 100ms interval)
        jest.advanceTimersByTime(3000);
        expect(counter.textContent).toBe('30+');

        if (intervalId !== null) {
            clearInterval(intervalId);
        }
    });

    test('should clear interval when target is reached', () => {
        const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
        const counter = document.createElement('h1');
        counter.setAttribute('data-count', '10');

        startCounter(counter, { duration: 500, updateInterval: 100 });

        // Run until completion
        jest.advanceTimersByTime(600);

        expect(clearIntervalSpy).toHaveBeenCalled();
    });

    test('should append + suffix', () => {
        const counter = document.createElement('h1');
        counter.setAttribute('data-count', '50');

        startCounter(counter, { duration: 200, updateInterval: 100 });

        jest.advanceTimersByTime(100);
        expect(counter.textContent).toContain('+');
    });
});

describe('headerActive', () => {
    test('should add active class when scroll > 100', () => {
        document.body.innerHTML = '<header data-header></header>';
        Object.defineProperty(window, 'scrollY', { value: 150, writable: true });

        headerActive();

        const header = document.querySelector('[data-header]');
        expect(header?.classList.contains('active')).toBe(true);
    });

    test('should remove active class when scroll <= 100', () => {
        document.body.innerHTML = '<header data-header class="active"></header>';
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });

        headerActive();

        const header = document.querySelector('[data-header]');
        expect(header?.classList.contains('active')).toBe(false);
    });

    test('should handle exactly 100 scroll', () => {
        document.body.innerHTML = '<header data-header class="active"></header>';
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });

        headerActive();

        const header = document.querySelector('[data-header]');
        expect(header?.classList.contains('active')).toBe(false);
    });

    test('should handle missing header element', () => {
        document.body.innerHTML = '';
        Object.defineProperty(window, 'scrollY', { value: 200, writable: true });

        expect(() => headerActive()).not.toThrow();
    });

    test('should handle zero scroll', () => {
        document.body.innerHTML = '<header data-header class="active"></header>';
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

        headerActive();

        const header = document.querySelector('[data-header]');
        expect(header?.classList.contains('active')).toBe(false);
    });
});

describe('DEFAULT_COUNTER_CONFIG', () => {
    test('should have expected default values', () => {
        expect(DEFAULT_COUNTER_CONFIG.duration).toBe(3000);
        expect(DEFAULT_COUNTER_CONFIG.updateInterval).toBe(100);
    });
});
