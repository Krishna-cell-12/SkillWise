/**
 * Tests for script.ts - Main Script Module
 */

import {
    addEventOnElements,
    showAndHidePopUp,
    ProgressManager
} from '../script';

describe('addEventOnElements', () => {
    test('should add event listener to all elements', () => {
        // Setup
        document.body.innerHTML = `
      <button class="test-btn">1</button>
      <button class="test-btn">2</button>
      <button class="test-btn">3</button>
    `;
        const elements = document.querySelectorAll('.test-btn');
        const callback = jest.fn();

        // Execute
        addEventOnElements(elements, 'click', callback);

        // Verify - click each button
        elements.forEach((el) => {
            (el as HTMLElement).click();
        });

        expect(callback).toHaveBeenCalledTimes(3);
    });

    test('should handle empty NodeList', () => {
        const elements = document.querySelectorAll('.nonexistent');
        const callback = jest.fn();

        expect(() => {
            addEventOnElements(elements, 'click', callback);
        }).not.toThrow();
    });

    test('should work with HTMLCollection', () => {
        document.body.innerHTML = `
      <span class="item">1</span>
      <span class="item">2</span>
    `;
        const elements = document.getElementsByClassName('item');
        const callback = jest.fn();

        addEventOnElements(elements, 'mouseover', callback);

        const event = new Event('mouseover');
        elements[0]?.dispatchEvent(event);
        elements[1]?.dispatchEvent(event);

        expect(callback).toHaveBeenCalledTimes(2);
    });
});

describe('showAndHidePopUp', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should show and hide popup with default timing', () => {
        document.body.innerHTML = '<div class="testPopup" style="transform: translate(120%)"></div>';
        const popup = document.querySelector('.testPopup') as HTMLElement;

        showAndHidePopUp('.testPopup');

        // Initial state
        expect(popup.style.transform).toBe('translate(120%)');

        // After show delay (100ms default)
        jest.advanceTimersByTime(100);
        expect(popup.style.transform).toBe('translate(0)');

        // After hide delay (3000ms default)
        jest.advanceTimersByTime(3000);
        expect(popup.style.transform).toBe('translate(120%)');
    });

    test('should use custom timing', () => {
        document.body.innerHTML = '<div class="customPopup"></div>';
        const popup = document.querySelector('.customPopup') as HTMLElement;

        showAndHidePopUp('.customPopup', 50, 500);

        jest.advanceTimersByTime(50);
        expect(popup.style.transform).toBe('translate(0)');

        jest.advanceTimersByTime(500);
        expect(popup.style.transform).toBe('translate(120%)');
    });

    test('should use custom transforms', () => {
        document.body.innerHTML = '<div class="animPopup"></div>';
        const popup = document.querySelector('.animPopup') as HTMLElement;

        showAndHidePopUp('.animPopup', 0, 100, 'scale(1)', 'scale(0)');

        jest.advanceTimersByTime(0);
        expect(popup.style.transform).toBe('scale(1)');

        jest.advanceTimersByTime(100);
        expect(popup.style.transform).toBe('scale(0)');
    });

    test('should handle non-existent element gracefully', () => {
        expect(() => {
            showAndHidePopUp('.nonexistent');
            jest.advanceTimersByTime(5000);
        }).not.toThrow();
    });
});

describe('ProgressManager', () => {
    describe('constructor', () => {
        test('should initialize with empty progress', () => {
            const manager = new ProgressManager();
            expect(manager.getProgress()).toEqual({});
        });

        test('should load existing progress from localStorage', () => {
            const existingData = {
                'course-1': { completedAt: '2024-01-01T00:00:00.000Z', status: 'completed' }
            };
            localStorage.setItem('skillwise_user_progress', JSON.stringify(existingData));

            const manager = new ProgressManager();
            expect(manager.getProgress()).toEqual(existingData);
        });

        test('should handle invalid JSON in localStorage', () => {
            localStorage.setItem('skillwise_user_progress', 'invalid-json');

            const manager = new ProgressManager();
            expect(manager.getProgress()).toEqual({});
        });
    });

    describe('generateId', () => {
        test('should convert title to lowercase kebab-case', () => {
            const manager = new ProgressManager();

            expect(manager.generateId('Hello World')).toBe('hello-world');
            expect(manager.generateId('  Multiple   Spaces  ')).toBe('multiple-spaces');
            expect(manager.generateId('Special@#$Characters!')).toBe('special-characters-');
        });

        test('should handle empty string', () => {
            const manager = new ProgressManager();
            expect(manager.generateId('')).toBe('');
        });

        test('should handle numbers', () => {
            const manager = new ProgressManager();
            expect(manager.generateId('Course 101')).toBe('course-101');
        });
    });

    describe('toggleCourse', () => {
        test('should add course when marking as completed', () => {
            const manager = new ProgressManager();

            manager.toggleCourse('test-course', true);

            const progress = manager.getProgress();
            expect(progress['test-course']).toBeDefined();
            expect(progress['test-course']?.status).toBe('completed');
            expect(progress['test-course']?.completedAt).toBeDefined();
        });

        test('should remove course when unmarking as completed', () => {
            localStorage.setItem('skillwise_user_progress', JSON.stringify({
                'test-course': { completedAt: '2024-01-01', status: 'completed' }
            }));

            const manager = new ProgressManager();
            manager.toggleCourse('test-course', false);

            expect(manager.getProgress()['test-course']).toBeUndefined();
        });

        test('should save progress to localStorage', () => {
            const manager = new ProgressManager();

            manager.toggleCourse('saved-course', true);

            const stored = localStorage.getItem('skillwise_user_progress');
            expect(stored).not.toBeNull();
            const parsed = JSON.parse(stored as string);
            expect(parsed['saved-course']).toBeDefined();
        });
    });

    describe('createToggleElement', () => {
        test('should create checkbox container', () => {
            const manager = new ProgressManager();
            const card = document.createElement('div');
            card.innerHTML = '<div><h3>Test Course</h3></div>';

            manager.createToggleElement(card, 'test-course');

            const container = card.querySelector('.progress-toggle-container');
            expect(container).not.toBeNull();

            const checkbox = card.querySelector('.progress-checkbox') as HTMLInputElement;
            expect(checkbox).not.toBeNull();
            expect(checkbox.type).toBe('checkbox');
            expect(checkbox.checked).toBe(false);
        });

        test('should check box for completed course', () => {
            localStorage.setItem('skillwise_user_progress', JSON.stringify({
                'completed-course': { completedAt: '2024-01-01', status: 'completed' }
            }));

            const manager = new ProgressManager();
            const card = document.createElement('div');

            manager.createToggleElement(card, 'completed-course');

            const checkbox = card.querySelector('.progress-checkbox') as HTMLInputElement;
            expect(checkbox.checked).toBe(true);
            expect(card.classList.contains('course-completed')).toBe(true);
        });

        test('should not add duplicate container', () => {
            const manager = new ProgressManager();
            const card = document.createElement('div');

            manager.createToggleElement(card, 'test-course');
            manager.createToggleElement(card, 'test-course');

            const containers = card.querySelectorAll('.progress-toggle-container');
            expect(containers.length).toBe(1);
        });

        test('should toggle course on checkbox change', () => {
            const manager = new ProgressManager();
            const card = document.createElement('div');

            manager.createToggleElement(card, 'toggle-test');

            const checkbox = card.querySelector('.progress-checkbox') as HTMLInputElement;
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));

            expect(manager.getProgress()['toggle-test']).toBeDefined();
        });
    });

    describe('triggerConfetti', () => {
        test('should add and remove confetti element', () => {
            jest.useFakeTimers();

            const manager = new ProgressManager();
            const element = document.createElement('div');
            document.body.appendChild(element);

            manager.triggerConfetti(element);

            expect(element.querySelector('.completion-confetti')).not.toBeNull();

            jest.advanceTimersByTime(1000);

            expect(element.querySelector('.completion-confetti')).toBeNull();

            jest.useRealTimers();
        });
    });

    describe('injectStyles', () => {
        test('should add style element to head', () => {
            const manager = new ProgressManager();

            manager.injectStyles();

            const styleElement = document.getElementById('progress-manager-styles');
            expect(styleElement).not.toBeNull();
            expect(styleElement?.tagName).toBe('STYLE');
        });

        test('should not duplicate style element', () => {
            const manager = new ProgressManager();

            manager.injectStyles();
            manager.injectStyles();

            const styleElements = document.querySelectorAll('#progress-manager-styles');
            expect(styleElements.length).toBe(1);
        });

        test('should contain required CSS rules', () => {
            const manager = new ProgressManager();

            manager.injectStyles();

            const styleContent = document.getElementById('progress-manager-styles')?.textContent ?? '';
            expect(styleContent).toContain('.progress-toggle-container');
            expect(styleContent).toContain('.progress-checkbox');
            expect(styleContent).toContain('.course-completed');
        });
    });

    describe('loadProgress', () => {
        test('should return empty object for null storage', () => {
            const manager = new ProgressManager();
            expect(manager.loadProgress()).toEqual({});
        });

        test('should parse valid JSON', () => {
            const data = { course1: { completedAt: '2024-01-01', status: 'completed' } };
            localStorage.setItem('skillwise_user_progress', JSON.stringify(data));

            const manager = new ProgressManager();
            expect(manager.loadProgress()).toEqual(data);
        });
    });

    describe('saveProgress', () => {
        test('should stringify and save to localStorage', () => {
            const manager = new ProgressManager();
            manager.toggleCourse('save-test', true);

            const stored = localStorage.getItem('skillwise_user_progress');
            expect(stored).not.toBeNull();

            const parsed = JSON.parse(stored as string);
            expect(parsed['save-test']).toBeDefined();
        });
    });
});
