/**
 * SkillWise FAQ Module
 * FAQ accordion functionality with strict TypeScript typing
 */

import type { Nullable } from './types';

// ============================================================
// DOM Element Accessors
// ============================================================

function getShowMoreButton(): Nullable<HTMLElement> {
    return document.getElementById('showMoreBtn');
}

function getSearchInput(): Nullable<HTMLInputElement> {
    return document.getElementById('searchInput') as Nullable<HTMLInputElement>;
}

function getAllFAQItems(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>('.item');
}

// ============================================================
// FAQ Item Operations
// ============================================================

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
export function getFAQItemComponents(item: HTMLElement): FAQItemComponents {
    return {
        item,
        title: item.querySelector<HTMLElement>('.FAQ-title'),
        content: item.querySelector<HTMLElement>('.FAQ-content'),
        expandIcon: item.querySelector<HTMLElement>('.expand'),
        revertIcon: item.querySelector<HTMLElement>('.revert')
    };
}

/**
 * Close a single FAQ item
 */
export function closeFAQItem(components: FAQItemComponents): void {
    const { item, content, expandIcon, revertIcon } = components;

    item.classList.remove('selected');

    if (content !== null) {
        content.classList.remove('show');
    }
    if (expandIcon !== null) {
        expandIcon.style.display = 'flex';
    }
    if (revertIcon !== null) {
        revertIcon.style.display = 'none';
    }
}

/**
 * Open a single FAQ item
 */
export function openFAQItem(components: FAQItemComponents): void {
    const { item, content, expandIcon, revertIcon } = components;

    item.classList.add('selected');

    if (content !== null) {
        content.classList.add('show');
    }
    if (expandIcon !== null) {
        expandIcon.style.display = 'none';
    }
    if (revertIcon !== null) {
        revertIcon.style.display = 'flex';
    }
}

/**
 * Close all FAQ items
 */
export function closeAllFAQItems(items: NodeListOf<HTMLElement>): void {
    items.forEach((item: HTMLElement): void => {
        const components = getFAQItemComponents(item);
        closeFAQItem(components);
    });
}

/**
 * Toggle FAQ item open/closed
 */
export function toggleFAQItem(
    item: HTMLElement,
    allItems: NodeListOf<HTMLElement>
): void {
    const isOpen = item.classList.contains('selected');
    const components = getFAQItemComponents(item);

    closeAllFAQItems(allItems);

    if (!isOpen) {
        openFAQItem(components);
    }
}

// ============================================================
// Show More/Less Functionality
// ============================================================

export interface ShowMoreState {
    showMore: boolean;
    defaultVisible: number;
}

/**
 * Create initial show more state
 */
export function createShowMoreState(defaultVisible: number = 4): ShowMoreState {
    return {
        showMore: false,
        defaultVisible
    };
}

/**
 * Toggle show more state
 */
export function toggleShowMore(state: ShowMoreState): ShowMoreState {
    return {
        ...state,
        showMore: !state.showMore
    };
}

/**
 * Apply visibility based on show more state
 */
export function applyShowMoreVisibility(
    items: NodeListOf<HTMLElement>,
    state: ShowMoreState
): void {
    const itemsToShow = state.showMore ? items.length : state.defaultVisible;

    items.forEach((item: HTMLElement, index: number): void => {
        item.style.display = index < itemsToShow ? 'block' : 'none';
    });
}

/**
 * Update show more button text
 */
export function updateShowMoreButtonText(
    button: HTMLElement,
    showMore: boolean
): void {
    button.textContent = showMore ? 'Show Less' : 'Show More';
}

// ============================================================
// Search Functionality
// ============================================================

/**
 * Check if FAQ item matches search query
 */
export function itemMatchesQuery(
    item: HTMLElement,
    query: string
): boolean {
    const title = item.querySelector<HTMLElement>('.FAQ-title');
    const content = item.querySelector<HTMLElement>('.FAQ-content');

    const titleText = title?.textContent?.toLowerCase() ?? '';
    const contentText = content?.textContent?.toLowerCase() ?? '';
    const normalizedQuery = query.toLowerCase();

    return titleText.includes(normalizedQuery) || contentText.includes(normalizedQuery);
}

/**
 * Filter FAQ items by search query
 */
export function filterFAQItems(
    items: NodeListOf<HTMLElement>,
    query: string
): number {
    const normalizedQuery = query.toLowerCase().trim();
    let matchCount = 0;

    items.forEach((item: HTMLElement): void => {
        if (normalizedQuery === '' || itemMatchesQuery(item, normalizedQuery)) {
            item.style.display = 'block';
            matchCount++;
        } else {
            item.style.display = 'none';
        }
    });

    return matchCount;
}

/**
 * Reset FAQ items to initial state
 */
export function resetFAQItems(
    items: NodeListOf<HTMLElement>,
    defaultVisible: number = 4
): void {
    items.forEach((item: HTMLElement, index: number): void => {
        item.style.display = index < defaultVisible ? 'block' : 'none';
    });
}

// ============================================================
// Initialization
// ============================================================

/**
 * Initialize FAQ module
 */
export function initFAQ(): void {
    const items = getAllFAQItems();
    const showMoreBtn = getShowMoreButton();
    const searchInput = getSearchInput();

    let showMoreState = createShowMoreState();

    // Set up click handlers for each FAQ item
    items.forEach((item: HTMLElement): void => {
        const components = getFAQItemComponents(item);

        if (components.title !== null) {
            components.title.addEventListener('click', (): void => {
                toggleFAQItem(item, items);
            });
        }
    });

    // Set up show more button
    if (showMoreBtn !== null) {
        showMoreBtn.addEventListener('click', (): void => {
            showMoreState = toggleShowMore(showMoreState);
            applyShowMoreVisibility(items, showMoreState);
            updateShowMoreButtonText(showMoreBtn, showMoreState.showMore);
        });
    }

    // Set up search functionality
    if (searchInput !== null) {
        searchInput.addEventListener('input', (e: Event): void => {
            const target = e.target as HTMLInputElement;
            const query = target.value;

            if (query === '') {
                resetFAQItems(items, showMoreState.defaultVisible);
            } else {
                filterFAQItems(items, query);
            }
        });
    }

    // Initially show only first 4 items
    resetFAQItems(items);
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', (): void => {
    initFAQ();
});
