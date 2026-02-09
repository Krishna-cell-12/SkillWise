/**
 * SkillWise Type Definitions
 * Centralized type definitions for strict typing across the application
 */
export interface HTMLElementWithDataset extends HTMLElement {
    dataset: DOMStringMap;
}
export interface CourseCardElement extends HTMLElement {
    querySelector: <T extends Element = Element>(selectors: string) => T | null;
    classList: DOMTokenList;
}
export interface ScrollToTopConfig {
    readonly buttonD: string;
    readonly buttonT: string;
    readonly shadowSize: string;
    readonly roundnessSize: string;
    readonly buttonDToBottom: string;
    readonly buttonDToRight: string;
    readonly selectedBackgroundColor: string;
    readonly selectedIconColor: string;
    readonly buttonWidth: string;
    readonly buttonHeight: string;
    readonly svgWidth: string;
    readonly svgHeight: string;
}
export interface BlogEntry {
    readonly title: string;
    readonly description: string;
    readonly image: string;
    readonly link: string;
}
export interface CourseProgress {
    readonly completedAt: string;
    readonly status: 'completed' | 'in-progress' | 'not-started';
}
export interface ProgressData {
    [courseId: string]: CourseProgress | undefined;
}
export interface ProgressManagerInterface {
    loadProgress(): ProgressData;
    saveProgress(): void;
    generateId(title: string): string;
    toggleCourse(id: string, isCompleted: boolean): void;
    createToggleElement(card: HTMLElement, courseId: string): void;
    triggerConfetti(element: HTMLElement): void;
    init(): void;
    injectStyles(): void;
}
export type CounterElement = HTMLElement;
export interface CounterConfig {
    readonly duration: number;
    readonly updateInterval: number;
}
export interface FAQItemComponents {
    readonly item: HTMLElement;
    readonly expandIcon: HTMLElement | null;
    readonly revertIcon: HTMLElement | null;
    readonly content: HTMLElement | null;
    readonly title: HTMLElement | null;
}
export type StarRating = 1 | 2 | 3 | 4 | 5;
export type StarClassName = 'one' | 'two' | 'three' | 'four' | 'five';
export interface ReviewSlideState {
    currentIndex: number;
    intervalId: ReturnType<typeof setInterval> | null;
}
export type Theme = 'light' | 'dark';
export interface ThemeState {
    currentTheme: Theme;
}
export interface FeedbackState {
    selectedEmotion: string;
    step: 1 | 2 | 3;
}
export type FeedbackEmotion = 'sad' | 'neutral' | 'happy' | 'excited' | 'love';
export interface PopupConfig {
    readonly delayShow: number;
    readonly delayHide: number;
    readonly showTranslate: string;
    readonly hideTranslate: string;
}
export type EventCallback = (event: Event) => void;
export type ScrollCallback = () => void;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export interface StorageService {
    getItem<T>(key: string): T | null;
    setItem<T>(key: string, value: T): void;
    removeItem(key: string): void;
}
export interface CoreModuleExports {
    readonly addEventOnElements: (elements: NodeListOf<Element> | HTMLCollectionOf<Element>, eventType: string, callback: EventCallback) => void;
    readonly toggleNavbar: () => void;
    readonly headerActive: () => void;
    readonly showAndHidePopUp: (selector: string, delayShow?: number, delayHide?: number, showTranslate?: string, hideTranslate?: string) => void;
}
//# sourceMappingURL=types.d.ts.map