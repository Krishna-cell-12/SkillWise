/**
 * SkillWise Testimonials Module
 * Star rating and review slider functionality with strict TypeScript typing
 */
import type { StarRating, StarClassName, ReviewSlideState, Nullable } from './types';
declare const STAR_CLASS_MAP: Record<StarRating, StarClassName>;
declare const AUTO_SLIDE_INTERVAL = 3000;
/**
 * Check if rating is valid StarRating type
 */
export declare function isValidRating(n: number): n is StarRating;
/**
 * Get star class name for rating
 */
export declare function getStarClassName(rating: StarRating): StarClassName;
/**
 * Remove all star styling classes
 */
export declare function removeStarStyles(stars: HTMLCollectionOf<Element>): void;
/**
 * Apply star rating styling
 */
export declare function applyStarRating(stars: HTMLCollectionOf<Element>, rating: StarRating): void;
/**
 * Update rating output text
 */
export declare function updateRatingOutput(output: HTMLElement, rating: StarRating): void;
/**
 * Set rating (combined function for external use)
 */
export declare function setRating(rating: number, stars: HTMLCollectionOf<Element>, output: Nullable<HTMLElement>): void;
/**
 * gfg - Main rating update function (preserving original name for compatibility)
 */
export declare function gfg(n: number): void;
/**
 * remove - Remove star styling (preserving original name for compatibility)
 */
export declare function remove(): void;
/**
 * Parse current rating from output text
 */
export declare function parseCurrentRating(outputText: string): number;
/**
 * Validate that at least 1 star is selected
 */
export declare function validateRating(output: Nullable<HTMLElement>): boolean;
/**
 * Show success popup temporarily
 */
export declare function showSuccessPopup(popup: HTMLElement, duration?: number): Promise<void>;
/**
 * Reset rating form
 */
export declare function resetRatingForm(stars: HTMLCollectionOf<Element>, output: Nullable<HTMLElement>, reviewInput: Nullable<HTMLTextAreaElement>): void;
/**
 * Create initial slide state
 */
export declare function createSlideState(): ReviewSlideState;
/**
 * Calculate slide translation value
 */
export declare function calculateSlideTranslation(currentIndex: number, mainWidth: number): number;
/**
 * Update slide position
 */
export declare function updateSlidePosition(slideRow: HTMLElement, translateValue: number): void;
/**
 * Update button active states
 */
export declare function updateButtonActiveStates(buttons: NodeListOf<HTMLElement>, currentIndex: number): void;
/**
 * Update slide display
 */
export declare function updateSlide(slideRow: Nullable<HTMLElement>, mainElement: Nullable<HTMLElement>, buttons: NodeListOf<HTMLElement>, currentIndex: number): void;
/**
 * Get next slide index
 */
export declare function getNextSlideIndex(currentIndex: number, totalSlides: number): number;
/**
 * Initialize star rating functionality
 */
export declare function initStarRating(): void;
/**
 * Initialize review slider
 */
export declare function initReviewSlider(): ReviewSlideState;
/**
 * Initialize testimonials module
 */
export declare function initTestimonials(): void;
export { STAR_CLASS_MAP, AUTO_SLIDE_INTERVAL };
//# sourceMappingURL=testimonials.d.ts.map