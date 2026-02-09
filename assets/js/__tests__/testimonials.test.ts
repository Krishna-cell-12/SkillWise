/**
 * Tests for testimonials.ts - Testimonials Module
 */

import {
    isValidRating,
    getStarClassName,
    removeStarStyles,
    applyStarRating,
    updateRatingOutput,
    setRating,
    parseCurrentRating,
    validateRating,
    resetRatingForm,
    createSlideState,
    calculateSlideTranslation,
    updateSlidePosition,
    updateButtonActiveStates,
    getNextSlideIndex,
    STAR_CLASS_MAP,
    AUTO_SLIDE_INTERVAL
} from '../testimonials';

// Helper to create star elements
function createStars(): HTMLCollectionOf<Element> {
    document.body.innerHTML = `
    <span class="star"></span>
    <span class="star"></span>
    <span class="star"></span>
    <span class="star"></span>
    <span class="star"></span>
  `;
    return document.getElementsByClassName('star');
}

describe('Constants', () => {
    test('STAR_CLASS_MAP should have all ratings', () => {
        expect(STAR_CLASS_MAP[1]).toBe('one');
        expect(STAR_CLASS_MAP[2]).toBe('two');
        expect(STAR_CLASS_MAP[3]).toBe('three');
        expect(STAR_CLASS_MAP[4]).toBe('four');
        expect(STAR_CLASS_MAP[5]).toBe('five');
    });

    test('AUTO_SLIDE_INTERVAL should be 3000ms', () => {
        expect(AUTO_SLIDE_INTERVAL).toBe(3000);
    });
});

describe('isValidRating', () => {
    test('should return true for valid ratings 1-5', () => {
        expect(isValidRating(1)).toBe(true);
        expect(isValidRating(2)).toBe(true);
        expect(isValidRating(3)).toBe(true);
        expect(isValidRating(4)).toBe(true);
        expect(isValidRating(5)).toBe(true);
    });

    test('should return false for 0', () => {
        expect(isValidRating(0)).toBe(false);
    });

    test('should return false for negative numbers', () => {
        expect(isValidRating(-1)).toBe(false);
    });

    test('should return false for numbers > 5', () => {
        expect(isValidRating(6)).toBe(false);
    });

    test('should return false for non-integers', () => {
        expect(isValidRating(3.5)).toBe(false);
    });
});

describe('getStarClassName', () => {
    test('should return correct class for each rating', () => {
        expect(getStarClassName(1)).toBe('one');
        expect(getStarClassName(2)).toBe('two');
        expect(getStarClassName(3)).toBe('three');
        expect(getStarClassName(4)).toBe('four');
        expect(getStarClassName(5)).toBe('five');
    });
});

describe('removeStarStyles', () => {
    test('should reset all stars to base class', () => {
        const stars = createStars();
        (stars[0] as Element).className = 'star one';
        (stars[2] as Element).className = 'star three';

        removeStarStyles(stars);

        for (let i = 0; i < stars.length; i++) {
            expect(stars[i]?.className).toBe('star');
        }
    });

    test('should handle empty collection', () => {
        document.body.innerHTML = '';
        const stars = document.getElementsByClassName('star');

        expect(() => removeStarStyles(stars)).not.toThrow();
    });
});

describe('applyStarRating', () => {
    test('should apply class to correct number of stars', () => {
        const stars = createStars();

        applyStarRating(stars, 3);

        expect(stars[0]?.className).toBe('star three');
        expect(stars[1]?.className).toBe('star three');
        expect(stars[2]?.className).toBe('star three');
        expect(stars[3]?.className).toBe('star');
        expect(stars[4]?.className).toBe('star');
    });

    test('should apply rating 1 correctly', () => {
        const stars = createStars();

        applyStarRating(stars, 1);

        expect(stars[0]?.className).toBe('star one');
        expect(stars[1]?.className).toBe('star');
    });

    test('should apply rating 5 correctly', () => {
        const stars = createStars();

        applyStarRating(stars, 5);

        for (let i = 0; i < 5; i++) {
            expect(stars[i]?.className).toBe('star five');
        }
    });
});

describe('updateRatingOutput', () => {
    test('should update output text', () => {
        const output = document.createElement('div');

        updateRatingOutput(output, 4);

        expect(output.innerText).toBe('Rating is: 4/5');
    });

    test('should handle all ratings', () => {
        const output = document.createElement('div');

        updateRatingOutput(output, 1);
        expect(output.innerText).toBe('Rating is: 1/5');

        updateRatingOutput(output, 5);
        expect(output.innerText).toBe('Rating is: 5/5');
    });
});

describe('setRating', () => {
    test('should set rating with stars and output', () => {
        const stars = createStars();
        const output = document.createElement('div');
        document.body.appendChild(output);

        setRating(3, stars, output);

        expect(stars[0]?.className).toBe('star three');
        expect(stars[2]?.className).toBe('star three');
        expect(output.innerText).toBe('Rating is: 3/5');
    });

    test('should handle null output', () => {
        const stars = createStars();

        expect(() => setRating(3, stars, null)).not.toThrow();
        expect(stars[0]?.className).toBe('star three');
    });

    test('should ignore invalid ratings', () => {
        const stars = createStars();
        const output = document.createElement('div');
        output.innerText = 'Original';

        setRating(10, stars, output);

        expect(output.innerText).toBe('Original');
    });
});

describe('parseCurrentRating', () => {
    test('should parse valid rating text', () => {
        expect(parseCurrentRating('Rating is: 3/5')).toBe(3);
        expect(parseCurrentRating('Rating is: 5/5')).toBe(5);
        expect(parseCurrentRating('Rating is: 1/5')).toBe(1);
    });

    test('should return 0 for invalid format', () => {
        expect(parseCurrentRating('')).toBe(0);
        expect(parseCurrentRating('Invalid')).toBe(0);
    });

    test('should return 0 for missing rating', () => {
        expect(parseCurrentRating('Rating is: ')).toBe(0);
    });
});

describe('validateRating', () => {
    test('should return true for valid rating >= 1', () => {
        const output = document.createElement('div');
        output.innerText = 'Rating is: 3/5';

        expect(validateRating(output)).toBe(true);
    });

    test('should return false for null output', () => {
        expect(validateRating(null)).toBe(false);
    });

    test('should return true when rating is valid', () => {
        const output = document.createElement('div');
        output.innerText = 'Rating is: 4/5';

        const result = validateRating(output);

        expect(result).toBe(true);
    });
});

describe('resetRatingForm', () => {
    test('should reset all form elements', () => {
        const stars = createStars();
        (stars[0] as Element).className = 'star three';
        const output = document.createElement('div');
        output.innerText = 'Rating is: 3/5';
        const reviewInput = document.createElement('textarea') as HTMLTextAreaElement;
        reviewInput.value = 'Great product!';

        resetRatingForm(stars, output, reviewInput);

        expect(stars[0]?.className).toBe('star');
        expect(output.innerText).toBe('');
        expect(reviewInput.value).toBe('');
    });

    test('should handle null output', () => {
        const stars = createStars();
        const reviewInput = document.createElement('textarea') as HTMLTextAreaElement;

        expect(() => resetRatingForm(stars, null, reviewInput)).not.toThrow();
    });

    test('should handle null reviewInput', () => {
        const stars = createStars();
        const output = document.createElement('div');

        expect(() => resetRatingForm(stars, output, null)).not.toThrow();
    });
});

describe('createSlideState', () => {
    test('should create initial state', () => {
        const state = createSlideState();

        expect(state.currentIndex).toBe(0);
        expect(state.intervalId).toBeNull();
    });
});

describe('calculateSlideTranslation', () => {
    test('should calculate correct translation', () => {
        // -0 and 0 are the same value but Object.is(-0, 0) is false
        // Use a comparison that treats them as equal
        const result0 = calculateSlideTranslation(0, 1000);
        expect(result0 === 0 || Object.is(result0, -0)).toBe(true);
        expect(calculateSlideTranslation(1, 1000)).toBe(-1000);
        expect(calculateSlideTranslation(2, 500)).toBe(-1000);
        expect(calculateSlideTranslation(3, 300)).toBe(-900);
    });

    test('should handle zero width', () => {
        const result = calculateSlideTranslation(5, 0);
        // -0 and 0 are treated as equal in normal comparisons
        expect(result === 0 || Object.is(result, -0)).toBe(true);
    });
});

describe('updateSlidePosition', () => {
    test('should set transform style', () => {
        const slideRow = document.createElement('div');

        updateSlidePosition(slideRow, -500);

        expect(slideRow.style.transform).toBe('translateX(-500px)');
    });

    test('should handle positive values', () => {
        const slideRow = document.createElement('div');

        updateSlidePosition(slideRow, 0);

        expect(slideRow.style.transform).toBe('translateX(0px)');
    });
});

describe('updateButtonActiveStates', () => {
    test('should add active class to current button', () => {
        document.body.innerHTML = `
      <button class="btn"></button>
      <button class="btn"></button>
      <button class="btn"></button>
    `;
        const buttons = document.querySelectorAll<HTMLElement>('.btn');

        updateButtonActiveStates(buttons, 1);

        expect(buttons[0]?.classList.contains('active')).toBe(false);
        expect(buttons[1]?.classList.contains('active')).toBe(true);
        expect(buttons[2]?.classList.contains('active')).toBe(false);
    });

    test('should remove active from previous button', () => {
        document.body.innerHTML = `
      <button class="btn active"></button>
      <button class="btn"></button>
    `;
        const buttons = document.querySelectorAll<HTMLElement>('.btn');

        updateButtonActiveStates(buttons, 1);

        expect(buttons[0]?.classList.contains('active')).toBe(false);
        expect(buttons[1]?.classList.contains('active')).toBe(true);
    });
});

describe('getNextSlideIndex', () => {
    test('should increment index', () => {
        expect(getNextSlideIndex(0, 5)).toBe(1);
        expect(getNextSlideIndex(2, 5)).toBe(3);
    });

    test('should wrap around at end', () => {
        expect(getNextSlideIndex(4, 5)).toBe(0);
        expect(getNextSlideIndex(2, 3)).toBe(0);
    });

    test('should handle single slide', () => {
        expect(getNextSlideIndex(0, 1)).toBe(0);
    });
});

describe('Star rating integration', () => {
    test('should handle complete rating flow', () => {
        const stars = createStars();
        const output = document.createElement('div');
        output.id = 'output';
        document.body.appendChild(output);

        // Set rating to 4
        setRating(4, stars, output);
        expect(parseCurrentRating(output.innerText)).toBe(4);

        // Validate
        expect(validateRating(output)).toBe(true);

        // Reset
        const reviewInput = document.createElement('textarea') as HTMLTextAreaElement;
        reviewInput.value = 'Test review';
        resetRatingForm(stars, output, reviewInput);

        expect(reviewInput.value).toBe('');
        expect(output.innerText).toBe('');
    });
});

describe('Slider integration', () => {
    test('should handle complete slide navigation', () => {
        document.body.innerHTML = `
      <main style="width: 400px;">
        <div id="slide-row"></div>
      </main>
      <button class="btn"></button>
      <button class="btn"></button>
      <button class="btn"></button>
    `;
        const slideRow = document.getElementById('slide-row') as HTMLElement;
        const buttons = document.querySelectorAll<HTMLElement>('.btn');

        let currentIndex = 0;

        // Navigate through slides
        currentIndex = getNextSlideIndex(currentIndex, 3);
        expect(currentIndex).toBe(1);

        const translation = calculateSlideTranslation(currentIndex, 400);
        expect(translation).toBe(-400);

        updateSlidePosition(slideRow, translation);
        expect(slideRow.style.transform).toBe('translateX(-400px)');

        updateButtonActiveStates(buttons, currentIndex);
        expect(buttons[1]?.classList.contains('active')).toBe(true);
    });
});
