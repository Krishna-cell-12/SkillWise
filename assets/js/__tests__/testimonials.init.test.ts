import {
    gfg,
    remove,
    showSuccessPopup,
    updateSlide,
    initStarRating,
    initReviewSlider,
    initTestimonials
} from '../testimonials';

function setupStarsAndOutput(): void {
    document.body.innerHTML = `
        <span class="star"></span>
        <span class="star"></span>
        <span class="star"></span>
        <span class="star"></span>
        <span class="star"></span>
        <div id="output"></div>
    `;
}

describe('testimonials init and integration paths', () => {
    test('gfg and remove should update and reset star classes', () => {
        setupStarsAndOutput();

        gfg(4);

        const stars = document.getElementsByClassName('star');
        const output = document.getElementById('output') as HTMLElement;

        expect(stars[0]?.className).toBe('star four');
        expect(stars[3]?.className).toBe('star four');
        expect(stars[4]?.className).toBe('star');
        expect(output.innerText).toBe('Rating is: 4/5');

        remove();
        expect(stars[0]?.className).toBe('star');
        expect(stars[3]?.className).toBe('star');
    });

    test('showSuccessPopup should show then hide after duration', async () => {
        jest.useFakeTimers();

        const popup = document.createElement('div');
        popup.style.display = 'none';

        const promise = showSuccessPopup(popup, 500);
        expect(popup.style.display).toBe('block');

        jest.advanceTimersByTime(500);
        await promise;

        expect(popup.style.display).toBe('none');

        jest.useRealTimers();
    });

    test('updateSlide should no-op when required elements are missing', () => {
        document.body.innerHTML = '<button class="btn"></button>';
        const buttons = document.querySelectorAll<HTMLElement>('.btn');

        expect(() => updateSlide(null, null, buttons, 0)).not.toThrow();
    });

    test('initStarRating should validate, show popup, and reset form', async () => {
        jest.useFakeTimers();

        document.body.innerHTML = `
            <form id="ratingForm"></form>
            <div id="output"></div>
            <div id="popup" style="display:none"></div>
            <textarea id="reviewInput">Great</textarea>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
        `;

        initStarRating();

        const form = document.getElementById('ratingForm') as HTMLFormElement;
        const output = document.getElementById('output') as HTMLElement;
        const popup = document.getElementById('popup') as HTMLElement;
        const reviewInput = document.getElementById('reviewInput') as HTMLTextAreaElement;
        output.innerText = '';

        form.dispatchEvent(new Event('submit'));

        // validateRating should auto-select 1 when empty
        expect(output.innerText).toBe('Rating is: 1/5');
        expect(popup.style.display).toBe('block');

        jest.advanceTimersByTime(2000);
        await Promise.resolve();

        expect(popup.style.display).toBe('none');
        expect(output.innerText).toBe('');
        expect(reviewInput.value).toBe('');

        jest.useRealTimers();
    });

    test('initReviewSlider should respond to clicks, resize and auto-slide', () => {
        jest.useFakeTimers();

        document.body.innerHTML = `
            <main id="main"></main>
            <div id="slide-row"></div>
            <button class="btn"></button>
            <button class="btn"></button>
            <button class="btn"></button>
        `;

        const main = document.querySelector('main') as HTMLElement;
        Object.defineProperty(main, 'offsetWidth', {
            value: 500,
            configurable: true
        });

        const slideRow = document.getElementById('slide-row') as HTMLElement;
        const buttons = document.querySelectorAll<HTMLElement>('.btn');

        const state = initReviewSlider();

        buttons[1]?.click();
        expect(state.currentIndex).toBe(1);
        expect(slideRow.style.transform).toBe('translateX(-500px)');
        expect(buttons[1]?.classList.contains('active')).toBe(true);

        window.dispatchEvent(new Event('resize'));
        expect(slideRow.style.transform).toBe('translateX(-500px)');

        jest.advanceTimersByTime(3000);
        expect(state.currentIndex).toBe(2);
        expect(slideRow.style.transform).toBe('translateX(-1000px)');

        if (state.intervalId !== null) {
            clearInterval(state.intervalId);
        }

        jest.useRealTimers();
    });

    test('initTestimonials should initialize both rating and slider flows', () => {
        jest.useFakeTimers();

        document.body.innerHTML = `
            <form id="ratingForm"></form>
            <div id="output"></div>
            <div id="popup" style="display:none"></div>
            <textarea id="reviewInput"></textarea>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>
            <span class="star"></span>

            <main id="main"></main>
            <div id="slide-row"></div>
            <button class="btn"></button>
            <button class="btn"></button>
        `;

        const main = document.querySelector('main') as HTMLElement;
        Object.defineProperty(main, 'offsetWidth', {
            value: 400,
            configurable: true
        });

        expect(() => initTestimonials()).not.toThrow();

        const buttons = document.querySelectorAll<HTMLElement>('.btn');
        buttons[1]?.click();

        const slideRow = document.getElementById('slide-row') as HTMLElement;
        expect(slideRow.style.transform).toBe('translateX(-400px)');

        jest.useRealTimers();
    });
});
