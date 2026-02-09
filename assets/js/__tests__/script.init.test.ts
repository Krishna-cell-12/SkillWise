import {
    initPreloader,
    initNavbar,
    initHeader,
    initFooterYear,
    initFeedback,
    initializeApp
} from '../script';

function setScrollY(value: number): void {
    Object.defineProperty(window, 'scrollY', {
        value,
        writable: true,
        configurable: true
    });
}

function setupFeedbackDOM(): void {
    document.body.innerHTML = `
        <button id="feedbackButton">Open</button>
        <button id="closeModal">Close</button>
        <button id="nextToFeedback">Next Feedback</button>
        <button id="nextToEmail">Next Email</button>
        <button id="backToEmoji">Back Emoji</button>
        <button id="backToFeedback">Back Feedback</button>

        <div id="feedbackModal" style="display:none"></div>
        <form id="feedbackForm"></form>

        <div id="step1" style="display:block"></div>
        <div id="step2" style="display:none"></div>
        <div id="step3" style="display:none"></div>

        <div class="emojis"></div>
        <div id="emoji-not-selected"></div>
        <span class="emoji" data-value="happy">H</span>
        <span class="emoji" data-value="sad">S</span>

        <textarea id="feedback"></textarea>

        <div class="selectEmotionPopUp" style="transform: translate(120%)"></div>
        <div class="feedbackRequestPopUp" style="transform: translate(120%)"></div>
        <div class="feedbackPopUpSuccess" style="transform: translate(120%)"></div>
    `;
}

describe('script init modules', () => {
    test('initPreloader should mark preloader/body loaded on window load', () => {
        document.body.innerHTML = `
            <div data-preloader></div>
            <div data-circle style="animation: spin 1s linear infinite"></div>
        `;

        initPreloader();
        window.dispatchEvent(new Event('load'));

        const preloader = document.querySelector('[data-preloader]') as HTMLElement;
        const circle = document.querySelector('[data-circle]') as HTMLElement;

        expect(preloader.classList.contains('loaded')).toBe(true);
        expect(circle.style.animation).toBe('none');
        expect(document.body.classList.contains('loaded')).toBe(true);
    });

    test('initNavbar should toggle navbar, overlay and body classes', () => {
        document.body.innerHTML = `
            <nav data-navbar></nav>
            <div data-overlay></div>
            <button data-nav-toggler>Toggle 1</button>
            <button data-nav-toggler>Toggle 2</button>
        `;

        initNavbar();

        const navbar = document.querySelector('[data-navbar]') as HTMLElement;
        const overlay = document.querySelector('[data-overlay]') as HTMLElement;
        const togglers = document.querySelectorAll('[data-nav-toggler]');

        (togglers[0] as HTMLElement).click();
        expect(navbar.classList.contains('active')).toBe(true);
        expect(overlay.classList.contains('active')).toBe(true);
        expect(document.body.classList.contains('nav-active')).toBe(true);

        (togglers[1] as HTMLElement).click();
        expect(navbar.classList.contains('active')).toBe(false);
        expect(overlay.classList.contains('active')).toBe(false);
        expect(document.body.classList.contains('nav-active')).toBe(false);
    });

    test('initHeader should toggle header active class based on scroll', () => {
        document.body.innerHTML = '<header data-header></header>';

        initHeader();

        const header = document.querySelector('[data-header]') as HTMLElement;

        setScrollY(150);
        window.dispatchEvent(new Event('scroll'));
        expect(header.classList.contains('active')).toBe(true);

        setScrollY(10);
        window.dispatchEvent(new Event('scroll'));
        expect(header.classList.contains('active')).toBe(false);
    });

    test('initFooterYear should set current year text', () => {
        document.body.innerHTML = '<span id="year"></span>';

        initFooterYear();

        const year = document.getElementById('year');
        expect(year?.textContent).toBe(new Date().getFullYear().toString());
    });

    test('initFeedback should handle modal open/close and step navigation', () => {
        jest.useFakeTimers();
        setupFeedbackDOM();

        initFeedback();

        const modal = document.getElementById('feedbackModal') as HTMLElement;
        const open = document.getElementById('feedbackButton') as HTMLElement;
        const close = document.getElementById('closeModal') as HTMLElement;
        const nextToFeedback = document.getElementById('nextToFeedback') as HTMLElement;
        const nextToEmail = document.getElementById('nextToEmail') as HTMLElement;
        const backToEmoji = document.getElementById('backToEmoji') as HTMLElement;
        const backToFeedback = document.getElementById('backToFeedback') as HTMLElement;
        const step1 = document.getElementById('step1') as HTMLElement;
        const step2 = document.getElementById('step2') as HTMLElement;
        const step3 = document.getElementById('step3') as HTMLElement;
        const feedbackInput = document.getElementById('feedback') as HTMLTextAreaElement;

        open.click();
        expect(modal.style.display).toBe('flex');
        close.click();
        expect(modal.style.display).toBe('none');

        // No emoji selected -> show popup
        nextToFeedback.click();
        jest.advanceTimersByTime(100);
        const emotionPopup = document.querySelector('.selectEmotionPopUp') as HTMLElement;
        expect(emotionPopup.style.transform).toBe('translate(0)');

        // Select emoji then proceed to step 2
        const emoji = document.querySelector('.emoji') as HTMLElement;
        emoji.click();
        nextToFeedback.click();
        expect(step1.style.display).toBe('none');
        expect(step2.style.display).toBe('block');

        // Empty feedback -> request popup
        nextToEmail.click();
        jest.advanceTimersByTime(100);
        const feedbackPopup = document.querySelector('.feedbackRequestPopUp') as HTMLElement;
        expect(feedbackPopup.style.transform).toBe('translate(0)');

        // Provide feedback -> step 3
        feedbackInput.value = 'Great platform';
        nextToEmail.click();
        expect(step2.style.display).toBe('none');
        expect(step3.style.display).toBe('block');

        // Back navigation
        backToFeedback.click();
        expect(step3.style.display).toBe('none');
        expect(step2.style.display).toBe('block');

        backToEmoji.click();
        expect(step2.style.display).toBe('none');
        expect(step1.style.display).toBe('block');

        jest.useRealTimers();
    });

    test('initializeApp should run without throwing with required DOM nodes', () => {
        document.body.innerHTML = `
            <div data-preloader></div>
            <div data-circle></div>
            <nav data-navbar></nav>
            <div data-overlay></div>
            <button data-nav-toggler>Toggle</button>
            <header data-header></header>
            <span id="year"></span>

            <button id="feedbackButton"></button>
            <button id="closeModal"></button>
            <button id="nextToFeedback"></button>
            <button id="nextToEmail"></button>
            <button id="backToEmoji"></button>
            <button id="backToFeedback"></button>
            <div id="feedbackModal"></div>
            <form id="feedbackForm"></form>
            <div id="step1"></div>
            <div id="step2"></div>
            <div id="step3"></div>
            <div class="emojis"></div>
            <div id="emoji-not-selected"></div>
            <span class="emoji" data-value="happy"></span>
            <textarea id="feedback"></textarea>
        `;

        expect(() => initializeApp()).not.toThrow();
    });
});
