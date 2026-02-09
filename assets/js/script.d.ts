/**
 * SkillWise Main Script
 * Core functionality with strict TypeScript typing
 */
import type { EventCallback, ProgressData } from './types';
/**
 * Add event listener to multiple elements
 */
export declare function addEventOnElements(elements: NodeListOf<Element> | HTMLCollectionOf<Element>, eventType: string, callback: EventCallback): void;
export declare function initPreloader(): void;
export declare function initNavbar(): void;
export declare function initHeader(): void;
export declare function initFooterYear(): void;
export declare function showAndHidePopUp(selector: string, delayShow?: number, delayHide?: number, showTranslate?: string, hideTranslate?: string): void;
export declare function selectFeedbackRequestPopUp(): void;
export declare function feedbackPopUpSuccessDisplay(): void;
export declare function selectEmotionPopUpDisplay(): void;
export declare function initFeedback(): void;
export declare class ProgressManager {
    private readonly storageKey;
    private progress;
    constructor();
    loadProgress(): ProgressData;
    saveProgress(): void;
    generateId(title: string): string;
    toggleCourse(id: string, isCompleted: boolean): void;
    createToggleElement(card: HTMLElement, courseId: string): void;
    triggerConfetti(element: HTMLElement): void;
    init(): void;
    injectStyles(): void;
    getProgress(): ProgressData;
}
export declare function initializeApp(): void;
//# sourceMappingURL=script.d.ts.map