/**
 * SkillWise FAQ Module
 * FAQ accordion functionality with strict TypeScript typing
 */
// ============================================================
// DOM Element Accessors
// ============================================================
function getShowMoreButton() {
    return document.getElementById('showMoreBtn');
}
function getSearchInput() {
    return document.getElementById('searchInput');
}
function getAllFAQItems() {
    return document.querySelectorAll('.item');
}
/**
 * Extract components from FAQ item
 */
export function getFAQItemComponents(item) {
    return {
        item,
        title: item.querySelector('.FAQ-title'),
        content: item.querySelector('.FAQ-content'),
        expandIcon: item.querySelector('.expand'),
        revertIcon: item.querySelector('.revert')
    };
}
/**
 * Close a single FAQ item
 */
export function closeFAQItem(components) {
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
export function openFAQItem(components) {
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
export function closeAllFAQItems(items) {
    items.forEach((item) => {
        const components = getFAQItemComponents(item);
        closeFAQItem(components);
    });
}
/**
 * Toggle FAQ item open/closed
 */
export function toggleFAQItem(item, allItems) {
    const isOpen = item.classList.contains('selected');
    const components = getFAQItemComponents(item);
    closeAllFAQItems(allItems);
    if (!isOpen) {
        openFAQItem(components);
    }
}
/**
 * Create initial show more state
 */
export function createShowMoreState(defaultVisible = 4) {
    return {
        showMore: false,
        defaultVisible
    };
}
/**
 * Toggle show more state
 */
export function toggleShowMore(state) {
    return {
        ...state,
        showMore: !state.showMore
    };
}
/**
 * Apply visibility based on show more state
 */
export function applyShowMoreVisibility(items, state) {
    const itemsToShow = state.showMore ? items.length : state.defaultVisible;
    items.forEach((item, index) => {
        item.style.display = index < itemsToShow ? 'block' : 'none';
    });
}
/**
 * Update show more button text
 */
export function updateShowMoreButtonText(button, showMore) {
    button.textContent = showMore ? 'Show Less' : 'Show More';
}
// ============================================================
// Search Functionality
// ============================================================
/**
 * Check if FAQ item matches search query
 */
export function itemMatchesQuery(item, query) {
    const title = item.querySelector('.FAQ-title');
    const content = item.querySelector('.FAQ-content');
    const titleText = title?.textContent?.toLowerCase() ?? '';
    const contentText = content?.textContent?.toLowerCase() ?? '';
    const normalizedQuery = query.toLowerCase();
    return titleText.includes(normalizedQuery) || contentText.includes(normalizedQuery);
}
/**
 * Filter FAQ items by search query
 */
export function filterFAQItems(items, query) {
    const normalizedQuery = query.toLowerCase().trim();
    let matchCount = 0;
    items.forEach((item) => {
        if (normalizedQuery === '' || itemMatchesQuery(item, normalizedQuery)) {
            item.style.display = 'block';
            matchCount++;
        }
        else {
            item.style.display = 'none';
        }
    });
    return matchCount;
}
/**
 * Reset FAQ items to initial state
 */
export function resetFAQItems(items, defaultVisible = 4) {
    items.forEach((item, index) => {
        item.style.display = index < defaultVisible ? 'block' : 'none';
    });
}
// ============================================================
// Initialization
// ============================================================
/**
 * Initialize FAQ module
 */
export function initFAQ() {
    const items = getAllFAQItems();
    const showMoreBtn = getShowMoreButton();
    const searchInput = getSearchInput();
    let showMoreState = createShowMoreState();
    // Set up click handlers for each FAQ item
    items.forEach((item) => {
        const components = getFAQItemComponents(item);
        if (components.title !== null) {
            components.title.addEventListener('click', () => {
                toggleFAQItem(item, items);
            });
        }
    });
    // Set up show more button
    if (showMoreBtn !== null) {
        showMoreBtn.addEventListener('click', () => {
            showMoreState = toggleShowMore(showMoreState);
            applyShowMoreVisibility(items, showMoreState);
            updateShowMoreButtonText(showMoreBtn, showMoreState.showMore);
        });
    }
    // Set up search functionality
    if (searchInput !== null) {
        searchInput.addEventListener('input', (e) => {
            const target = e.target;
            const query = target.value;
            if (query === '') {
                resetFAQItems(items, showMoreState.defaultVisible);
            }
            else {
                filterFAQItems(items, query);
            }
        });
    }
    // Initially show only first 4 items
    resetFAQItems(items);
}
// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
});
