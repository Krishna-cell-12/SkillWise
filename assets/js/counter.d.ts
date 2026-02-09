/**
 * SkillWise Counter Animation Module
 * Handles animated counters with strict TypeScript typing
 */
import type { CounterConfig } from './types';
declare const DEFAULT_COUNTER_CONFIG: CounterConfig;
/**
 * Parse data-count attribute to number
 */
export declare function parseCountTarget(counter: Element): number;
/**
 * Calculate increment per interval
 */
export declare function calculateIncrement(target: number, duration: number, interval: number): number;
/**
 * Start counter animation on a single element
 */
export declare function startCounter(counter: Element, config?: CounterConfig): ReturnType<typeof setInterval> | null;
/**
 * Create intersection observer for counters
 */
export declare function createCounterObserver(config?: CounterConfig): IntersectionObserver;
/**
 * Initialize counter module
 */
export declare function initCounters(config?: CounterConfig): void;
export declare function headerActive(): void;
export { DEFAULT_COUNTER_CONFIG };
//# sourceMappingURL=counter.d.ts.map