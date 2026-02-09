/**
 * Tests for scriptfaq.ts - FAQ Module
 */

import {
    getFAQItemComponents,
    closeFAQItem,
    openFAQItem,
    closeAllFAQItems,
    toggleFAQItem,
    createShowMoreState,
    toggleShowMore,
    applyShowMoreVisibility,
    updateShowMoreButtonText,
    itemMatchesQuery,
    filterFAQItems,
    resetFAQItems
} from '../scriptfaq';

// Helper to create FAQ item DOM structure
function createFAQItem(title: string, content: string): HTMLElement {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
    <div class="FAQ-title">${title}</div>
    <div class="FAQ-content">${content}</div>
    <span class="expand" style="display: flex;"></span>
    <span class="revert" style="display: none;"></span>
  `;
    return item;
}

describe('getFAQItemComponents', () => {
    test('should extract all components from FAQ item', () => {
        const item = createFAQItem('Test Title', 'Test Content');

        const components = getFAQItemComponents(item);

        expect(components.item).toBe(item);
        expect(components.title).not.toBeNull();
        expect(components.content).not.toBeNull();
        expect(components.expandIcon).not.toBeNull();
        expect(components.revertIcon).not.toBeNull();
    });

    test('should return null for missing elements', () => {
        const emptyItem = document.createElement('div');

        const components = getFAQItemComponents(emptyItem);

        expect(components.title).toBeNull();
        expect(components.content).toBeNull();
        expect(components.expandIcon).toBeNull();
        expect(components.revertIcon).toBeNull();
    });
});

describe('closeFAQItem', () => {
    test('should remove selected class', () => {
        const item = createFAQItem('Title', 'Content');
        item.classList.add('selected');
        const components = getFAQItemComponents(item);

        closeFAQItem(components);

        expect(item.classList.contains('selected')).toBe(false);
    });

    test('should hide content', () => {
        const item = createFAQItem('Title', 'Content');
        const content = item.querySelector('.FAQ-content') as HTMLElement;
        content.classList.add('show');
        const components = getFAQItemComponents(item);

        closeFAQItem(components);

        expect(content.classList.contains('show')).toBe(false);
    });

    test('should show expand icon', () => {
        const item = createFAQItem('Title', 'Content');
        const expand = item.querySelector('.expand') as HTMLElement;
        expand.style.display = 'none';
        const components = getFAQItemComponents(item);

        closeFAQItem(components);

        expect(expand.style.display).toBe('flex');
    });

    test('should hide revert icon', () => {
        const item = createFAQItem('Title', 'Content');
        const revert = item.querySelector('.revert') as HTMLElement;
        revert.style.display = 'flex';
        const components = getFAQItemComponents(item);

        closeFAQItem(components);

        expect(revert.style.display).toBe('none');
    });
});

describe('openFAQItem', () => {
    test('should add selected class', () => {
        const item = createFAQItem('Title', 'Content');
        const components = getFAQItemComponents(item);

        openFAQItem(components);

        expect(item.classList.contains('selected')).toBe(true);
    });

    test('should show content', () => {
        const item = createFAQItem('Title', 'Content');
        const components = getFAQItemComponents(item);

        openFAQItem(components);

        const content = item.querySelector('.FAQ-content');
        expect(content?.classList.contains('show')).toBe(true);
    });

    test('should hide expand icon', () => {
        const item = createFAQItem('Title', 'Content');
        const components = getFAQItemComponents(item);

        openFAQItem(components);

        const expand = item.querySelector('.expand') as HTMLElement;
        expect(expand.style.display).toBe('none');
    });

    test('should show revert icon', () => {
        const item = createFAQItem('Title', 'Content');
        const components = getFAQItemComponents(item);

        openFAQItem(components);

        const revert = item.querySelector('.revert') as HTMLElement;
        expect(revert.style.display).toBe('flex');
    });
});

describe('closeAllFAQItems', () => {
    test('should close all items', () => {
        document.body.innerHTML = `
      <div class="item selected"><div class="FAQ-content show"></div><span class="expand"></span><span class="revert"></span></div>
      <div class="item selected"><div class="FAQ-content show"></div><span class="expand"></span><span class="revert"></span></div>
      <div class="item selected"><div class="FAQ-content show"></div><span class="expand"></span><span class="revert"></span></div>
    `;
        const items = document.querySelectorAll<HTMLElement>('.item');

        closeAllFAQItems(items);

        items.forEach(item => {
            expect(item.classList.contains('selected')).toBe(false);
        });
    });
});

describe('toggleFAQItem', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('should open closed item', () => {
        const item = createFAQItem('Title', 'Content');
        document.body.appendChild(item);
        const allItems = document.querySelectorAll<HTMLElement>('.item');

        toggleFAQItem(item, allItems);

        expect(item.classList.contains('selected')).toBe(true);
    });

    test('should close open item', () => {
        const item = createFAQItem('Title', 'Content');
        item.classList.add('selected');
        document.body.appendChild(item);
        const allItems = document.querySelectorAll<HTMLElement>('.item');

        toggleFAQItem(item, allItems);

        expect(item.classList.contains('selected')).toBe(false);
    });

    test('should close other open items when opening new one', () => {
        const item1 = createFAQItem('Title 1', 'Content 1');
        const item2 = createFAQItem('Title 2', 'Content 2');
        item1.classList.add('selected');
        document.body.appendChild(item1);
        document.body.appendChild(item2);
        const allItems = document.querySelectorAll<HTMLElement>('.item');

        toggleFAQItem(item2, allItems);

        expect(item1.classList.contains('selected')).toBe(false);
        expect(item2.classList.contains('selected')).toBe(true);
    });
});

describe('createShowMoreState', () => {
    test('should create state with default values', () => {
        const state = createShowMoreState();

        expect(state.showMore).toBe(false);
        expect(state.defaultVisible).toBe(4);
    });

    test('should use custom defaultVisible', () => {
        const state = createShowMoreState(6);

        expect(state.defaultVisible).toBe(6);
    });
});

describe('toggleShowMore', () => {
    test('should toggle from false to true', () => {
        const state = createShowMoreState();

        const newState = toggleShowMore(state);

        expect(newState.showMore).toBe(true);
        expect(state.showMore).toBe(false); // Original unchanged
    });

    test('should toggle from true to false', () => {
        const state = { showMore: true, defaultVisible: 4 };

        const newState = toggleShowMore(state);

        expect(newState.showMore).toBe(false);
    });

    test('should preserve defaultVisible', () => {
        const state = { showMore: false, defaultVisible: 10 };

        const newState = toggleShowMore(state);

        expect(newState.defaultVisible).toBe(10);
    });
});

describe('applyShowMoreVisibility', () => {
    beforeEach(() => {
        document.body.innerHTML = `
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
      <div class="item"></div>
    `;
    });

    test('should show only defaultVisible items when showMore is false', () => {
        const items = document.querySelectorAll<HTMLElement>('.item');
        const state = { showMore: false, defaultVisible: 4 };

        applyShowMoreVisibility(items, state);

        expect((items[0] as HTMLElement).style.display).toBe('block');
        expect((items[3] as HTMLElement).style.display).toBe('block');
        expect((items[4] as HTMLElement).style.display).toBe('none');
        expect((items[5] as HTMLElement).style.display).toBe('none');
    });

    test('should show all items when showMore is true', () => {
        const items = document.querySelectorAll<HTMLElement>('.item');
        const state = { showMore: true, defaultVisible: 4 };

        applyShowMoreVisibility(items, state);

        items.forEach(item => {
            expect(item.style.display).toBe('block');
        });
    });
});

describe('updateShowMoreButtonText', () => {
    test('should show "Show Less" when showMore is true', () => {
        const button = document.createElement('button');

        updateShowMoreButtonText(button, true);

        expect(button.textContent).toBe('Show Less');
    });

    test('should show "Show More" when showMore is false', () => {
        const button = document.createElement('button');

        updateShowMoreButtonText(button, false);

        expect(button.textContent).toBe('Show More');
    });
});

describe('itemMatchesQuery', () => {
    test('should match title', () => {
        const item = createFAQItem('JavaScript Basics', 'Learn variables');

        expect(itemMatchesQuery(item, 'javascript')).toBe(true);
    });

    test('should match content', () => {
        const item = createFAQItem('JS Basics', 'Learn about variables and functions');

        expect(itemMatchesQuery(item, 'functions')).toBe(true);
    });

    test('should be case insensitive', () => {
        const item = createFAQItem('TypeScript', 'Static typing');

        expect(itemMatchesQuery(item, 'TYPESCRIPT')).toBe(true);
        expect(itemMatchesQuery(item, 'STATIC')).toBe(true);
    });

    test('should return false for non-matching query', () => {
        const item = createFAQItem('Python', 'Dynamic language');

        expect(itemMatchesQuery(item, 'javascript')).toBe(false);
    });

    test('should handle empty query', () => {
        const item = createFAQItem('Title', 'Content');

        expect(itemMatchesQuery(item, '')).toBe(true);
    });
});

describe('filterFAQItems', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        document.body.appendChild(createFAQItem('JavaScript Tutorial', 'Learn JS basics'));
        document.body.appendChild(createFAQItem('Python Guide', 'Python programming'));
        document.body.appendChild(createFAQItem('TypeScript Intro', 'Static types for JS'));
    });

    test('should show matching items and hide others', () => {
        const items = document.querySelectorAll<HTMLElement>('.item');

        const matchCount = filterFAQItems(items, 'js');

        expect(matchCount).toBe(2); // JavaScript and TypeScript
        expect((items[0] as HTMLElement).style.display).toBe('block');
        expect((items[1] as HTMLElement).style.display).toBe('none');
        expect((items[2] as HTMLElement).style.display).toBe('block');
    });

    test('should show all items for empty query', () => {
        const items = document.querySelectorAll<HTMLElement>('.item');

        const matchCount = filterFAQItems(items, '');

        expect(matchCount).toBe(3);
    });

    test('should trim whitespace from query', () => {
        const items = document.querySelectorAll<HTMLElement>('.item');

        const matchCount = filterFAQItems(items, '  python  ');

        expect(matchCount).toBe(1);
    });
});

describe('resetFAQItems', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        for (let i = 0; i < 6; i++) {
            document.body.appendChild(createFAQItem(`Item ${i}`, `Content ${i}`));
        }
    });

    test('should show first 4 items by default', () => {
        const items = document.querySelectorAll<HTMLElement>('.item');

        resetFAQItems(items);

        expect((items[0] as HTMLElement).style.display).toBe('block');
        expect((items[3] as HTMLElement).style.display).toBe('block');
        expect((items[4] as HTMLElement).style.display).toBe('none');
        expect((items[5] as HTMLElement).style.display).toBe('none');
    });

    test('should use custom defaultVisible', () => {
        const items = document.querySelectorAll<HTMLElement>('.item');

        resetFAQItems(items, 2);

        expect((items[0] as HTMLElement).style.display).toBe('block');
        expect((items[1] as HTMLElement).style.display).toBe('block');
        expect((items[2] as HTMLElement).style.display).toBe('none');
    });
});
