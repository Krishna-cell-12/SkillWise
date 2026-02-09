/**
 * SkillWise Testimonials Module
 * Star rating and review slider functionality with strict TypeScript typing
 */

import type { StarRating, StarClassName, ReviewSlideState, Nullable } from './types';

// ============================================================
// Constants
// ============================================================

const STAR_CLASS_MAP: Record<StarRating, StarClassName> = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five'
};

const AUTO_SLIDE_INTERVAL = 3000;

// ============================================================
// DOM Element Accessors
// ============================================================

function getStars(): HTMLCollectionOf<Element> {
    return document.getElementsByClassName('star');
}

function getOutputElement(): Nullable<HTMLElement> {
    return document.getElementById('output');
}

function getRatingForm(): Nullable<HTMLFormElement> {
    return document.getElementById('ratingForm') as Nullable<HTMLFormElement>;
}

function getPopupElement(): Nullable<HTMLElement> {
    return document.getElementById('popup');
}

function getReviewInput(): Nullable<HTMLTextAreaElement> {
    return document.getElementById('reviewInput') as Nullable<HTMLTextAreaElement>;
}

function getSlideButtons(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>('.btn');
}

function getSlideRow(): Nullable<HTMLElement> {
    return document.getElementById('slide-row');
}

function getMainElement(): Nullable<HTMLElement> {
    return document.querySelector<HTMLElement>('main');
}

// ============================================================
// Star Rating Functions
// ============================================================

/**
 * Check if rating is valid StarRating type
 */
export function isValidRating(n: number): n is StarRating {
    return n >= 1 && n <= 5 && Number.isInteger(n);
}

/**
 * Get star class name for rating
 */
export function getStarClassName(rating: StarRating): StarClassName {
    return STAR_CLASS_MAP[rating];
}

/**
 * Remove all star styling classes
 */
export function removeStarStyles(stars: HTMLCollectionOf<Element>): void {
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (star !== undefined) {
            star.className = 'star';
        }
    }
}

/**
 * Apply star rating styling
 */
export function applyStarRating(
    stars: HTMLCollectionOf<Element>,
    rating: StarRating
): void {
    removeStarStyles(stars);

    const className = getStarClassName(rating);

    for (let i = 0; i < rating; i++) {
        const star = stars[i];
        if (star !== undefined) {
            star.className = `star ${className}`;
        }
    }
}

/**
 * Update rating output text
 */
export function updateRatingOutput(
    output: HTMLElement,
    rating: StarRating
): void {
    output.innerText = `Rating is: ${rating}/5`;
}

/**
 * Set rating (combined function for external use)
 */
export function setRating(
    rating: number,
    stars: HTMLCollectionOf<Element>,
    output: Nullable<HTMLElement>
): void {
    if (!isValidRating(rating)) {
        return;
    }

    applyStarRating(stars, rating);

    if (output !== null) {
        updateRatingOutput(output, rating);
    }
}

/**
 * gfg - Main rating update function (preserving original name for compatibility)
 */
export function gfg(n: number): void {
    const stars = getStars();
    const output = getOutputElement();

    if (!isValidRating(n)) {
        return;
    }

    setRating(n, stars, output);
}

/**
 * remove - Remove star styling (preserving original name for compatibility)
 */
export function remove(): void {
    const stars = getStars();
    removeStarStyles(stars);
}

// ============================================================
// Rating Validation
// ============================================================

/**
 * Parse current rating from output text
 */
export function parseCurrentRating(outputText: string): number {
    if (outputText === '' || outputText.trim() === '') {
        return 0;
    }

    const parts = outputText.split('/')[0];
    if (parts === undefined) {
        return 0;
    }

    const ratingParts = parts.split(': ')[1];
    if (ratingParts === undefined) {
        return 0;
    }

    const rating = parseInt(ratingParts, 10);
    return isNaN(rating) ? 0 : rating;
}

/**
 * Validate that at least 1 star is selected
 */
export function validateRating(output: Nullable<HTMLElement>): boolean {
    if (output === null) {
        return false;
    }

    const rating = parseCurrentRating(output.innerText);

    if (rating < 1) {
        gfg(1); // Select 1 star if no rating selected
        return true;
    }

    return rating >= 1;
}

// ============================================================
// Form Submission
// ============================================================

/**
 * Show success popup temporarily
 */
export function showSuccessPopup(
    popup: HTMLElement,
    duration: number = 2000
): Promise<void> {
    return new Promise((resolve): void => {
        popup.style.display = 'block';
        setTimeout((): void => {
            popup.style.display = 'none';
            resolve();
        }, duration);
    });
}

/**
 * Reset rating form
 */
export function resetRatingForm(
    stars: HTMLCollectionOf<Element>,
    output: Nullable<HTMLElement>,
    reviewInput: Nullable<HTMLTextAreaElement>
): void {
    removeStarStyles(stars);

    if (output !== null) {
        output.innerText = '';
    }

    if (reviewInput !== null) {
        reviewInput.value = '';
    }
}

// ============================================================
// Review Slider Functions
// ============================================================

/**
 * Create initial slide state
 */
export function createSlideState(): ReviewSlideState {
    return {
        currentIndex: 0,
        intervalId: null
    };
}

/**
 * Calculate slide translation value
 */
export function calculateSlideTranslation(
    currentIndex: number,
    mainWidth: number
): number {
    return currentIndex * -mainWidth;
}

/**
 * Update slide position
 */
export function updateSlidePosition(
    slideRow: HTMLElement,
    translateValue: number
): void {
    slideRow.style.transform = `translateX(${translateValue}px)`;
}

/**
 * Update button active states
 */
export function updateButtonActiveStates(
    buttons: NodeListOf<HTMLElement>,
    currentIndex: number
): void {
    buttons.forEach((btn: HTMLElement, index: number): void => {
        btn.classList.toggle('active', index === currentIndex);
    });
}

/**
 * Update slide display
 */
export function updateSlide(
    slideRow: Nullable<HTMLElement>,
    mainElement: Nullable<HTMLElement>,
    buttons: NodeListOf<HTMLElement>,
    currentIndex: number
): void {
    if (slideRow === null || mainElement === null) {
        return;
    }

    const mainWidth = mainElement.offsetWidth;
    const translateValue = calculateSlideTranslation(currentIndex, mainWidth);

    updateSlidePosition(slideRow, translateValue);
    updateButtonActiveStates(buttons, currentIndex);
}

/**
 * Get next slide index
 */
export function getNextSlideIndex(
    currentIndex: number,
    totalSlides: number
): number {
    return (currentIndex + 1) % totalSlides;
}

// ============================================================
// Initialization
// ============================================================

/**
 * Initialize star rating functionality
 */
export function initStarRating(): void {
    const form = getRatingForm();
    const output = getOutputElement();
    const popup = getPopupElement();
    const reviewInput = getReviewInput();
    const stars = getStars();

    if (form !== null) {
        form.addEventListener('submit', (e: Event): void => {
            e.preventDefault();

            if (validateRating(output) && popup !== null) {
                void showSuccessPopup(popup).then((): void => {
                    resetRatingForm(stars, output, reviewInput);
                });
            }
        });
    }
}

/**
 * Initialize review slider
 */
export function initReviewSlider(): ReviewSlideState {
    const buttons = getSlideButtons();
    const slideRow = getSlideRow();
    const main = getMainElement();

    const state = createSlideState();

    // Set up button click handlers
    buttons.forEach((btn: HTMLElement, index: number): void => {
        btn.addEventListener('click', (): void => {
            state.currentIndex = index;
            updateSlide(slideRow, main, buttons, state.currentIndex);
        });
    });

    // Handle window resize
    window.addEventListener('resize', (): void => {
        updateSlide(slideRow, main, buttons, state.currentIndex);
    });

    // Start auto-slide
    state.intervalId = setInterval((): void => {
        state.currentIndex = getNextSlideIndex(state.currentIndex, buttons.length);
        updateSlide(slideRow, main, buttons, state.currentIndex);
    }, AUTO_SLIDE_INTERVAL);

    return state;
}

/**
 * Initialize testimonials module
 */
export function initTestimonials(): void {
    initStarRating();
    initReviewSlider();
}

// Export constants for testing
export { STAR_CLASS_MAP, AUTO_SLIDE_INTERVAL };
