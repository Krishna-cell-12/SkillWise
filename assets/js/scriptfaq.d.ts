/**
 * SkillWise FAQ Module
 * FAQ accordion functionality with strict TypeScript typing
 */
import type { Nullable } from './types';
/**
 * Get FAQ item components
 */
export interface FAQItemComponents {
    readonly item: HTMLElement;
    readonly title: Nullable<HTMLElement>;
    readonly content: Nullable<HTMLElement>;
    readonly expandIcon: Nullable<HTMLElement>;
    readonly revertIcon: Nullable<HTMLElement>;
}
/**
 * Extract components from FAQ item
 */
export declare function getFAQItemComponents(item: HTMLElement): FAQItemComponents;
/**
 * Close a single FAQ item
 */
export declare function closeFAQItem(components: FAQItemComponents): void;
/**
 * Open a single FAQ item
 */
export declare function openFAQItem(components: FAQItemComponents): void;
/**
 * Close all FAQ items
 */
export declare function closeAllFAQItems(items: NodeListOf<HTMLElement>): void;
/**
 * Toggle FAQ item open/closed
 */
export declare function toggleFAQItem(item: HTMLElement, allItems: NodeListOf<HTMLElement>): void;
export interface ShowMoreState {
    showMore: boolean;
    defaultVisible: number;
}
/**
 * Create initial show more state
 */
export declare function createShowMoreState(defaultVisible?: number): ShowMoreState;
/**
 * Toggle show more state
 */
export declare function toggleShowMore(state: ShowMoreState): ShowMoreState;
/**
 * Apply visibility based on show more state
 */
export declare function applyShowMoreVisibility(items: NodeListOf<HTMLElement>, state: ShowMoreState): void;
/**
 * Update show more button text
 */
export declare function updateShowMoreButtonText(button: HTMLElement, showMore: boolean): void;
/**
 * Check if FAQ item matches search query
 */
export declare function itemMatchesQuery(item: HTMLElement, query: string): boolean;
/**
 * Filter FAQ items by search query
 */
export declare function filterFAQItems(items: NodeListOf<HTMLElement>, query: string): number;
/**
 * Reset FAQ items to initial state
 */
export declare function resetFAQItems(items: NodeListOf<HTMLElement>, defaultVisible?: number): void;
/**
 * Initialize FAQ module
 */
export declare function initFAQ(): void;
//# sourceMappingURL=scriptfaq.d.ts.map