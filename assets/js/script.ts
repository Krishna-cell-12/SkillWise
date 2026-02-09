/**
 * SkillWise Main Script
 * Core functionality with strict TypeScript typing
 */

import type {
    EventCallback,
    ProgressData,
    CourseProgress,
    Nullable,
    PopupConfig
} from './types';

// ============================================================
// Utility Functions
// ============================================================

/**
 * Add event listener to multiple elements
 */
export function addEventOnElements(
    elements: NodeListOf<Element> | HTMLCollectionOf<Element>,
    eventType: string,
    callback: EventCallback
): void {
    for (let i = 0, len = elements.length; i < len; i++) {
        const element = elements[i];
        if (element !== undefined) {
            element.addEventListener(eventType, callback);
        }
    }
}

/**
 * Safely get an element by selector with type assertion
 */
function getElement<T extends Element>(selector: string): Nullable<T> {
    return document.querySelector<T>(selector);
}

/**
 * Safely get an element by ID with type assertion
 */
function getElementById<T extends HTMLElement>(id: string): Nullable<T> {
    return document.getElementById(id) as Nullable<T>;
}

// ============================================================
// Preloader Module
// ============================================================

export function initPreloader(): void {
    const preloader = getElement<HTMLElement>('[data-preloader]');
    const circle = getElement<HTMLElement>('[data-circle]');

    window.addEventListener('load', (): void => {
        if (preloader !== null) {
            preloader.classList.add('loaded');
            if (circle !== null) {
                circle.style.animation = 'none';
            }
            document.body.classList.add('loaded');
        }
    });
}

// ============================================================
// Navbar Module
// ============================================================

export function initNavbar(): void {
    const navbar = getElement<HTMLElement>('[data-navbar]');
    const navTogglers = document.querySelectorAll<HTMLElement>('[data-nav-toggler]');
    const overlay = getElement<HTMLElement>('[data-overlay]');

    const toggleNavbar = (): void => {
        if (navbar !== null) {
            navbar.classList.toggle('active');
        }
        if (overlay !== null) {
            overlay.classList.toggle('active');
        }
        document.body.classList.toggle('nav-active');
    };

    navTogglers.forEach((toggler: HTMLElement): void => {
        toggler.addEventListener('click', toggleNavbar);
    });
}

// ============================================================
// Header Module
// ============================================================

export function initHeader(): void {
    const header = getElement<HTMLElement>('[data-header]');

    const headerActive = (): void => {
        if (header === null) {
            return;
        }

        if (window.scrollY > 100) {
            header.classList.add('active');
        } else {
            header.classList.remove('active');
        }
    };

    window.addEventListener('scroll', headerActive);
}

// ============================================================
// Footer Year Module
// ============================================================

export function initFooterYear(): void {
    const yearEl = getElementById<HTMLElement>('year');
    if (yearEl !== null) {
        yearEl.textContent = new Date().getFullYear().toString();
    }
}

// ============================================================
// Popup Utility Module
// ============================================================

const DEFAULT_POPUP_CONFIG: PopupConfig = {
    delayShow: 100,
    delayHide: 3000,
    showTranslate: 'translate(0)',
    hideTranslate: 'translate(120%)'
};

export function showAndHidePopUp(
    selector: string,
    delayShow: number = DEFAULT_POPUP_CONFIG.delayShow,
    delayHide: number = DEFAULT_POPUP_CONFIG.delayHide,
    showTranslate: string = DEFAULT_POPUP_CONFIG.showTranslate,
    hideTranslate: string = DEFAULT_POPUP_CONFIG.hideTranslate
): void {
    setTimeout((): void => {
        const element = getElement<HTMLElement>(selector);
        if (element !== null) {
            element.style.transform = showTranslate;
            setTimeout((): void => {
                element.style.transform = hideTranslate;
            }, delayHide);
        }
    }, delayShow);
}

export function selectFeedbackRequestPopUp(): void {
    showAndHidePopUp('.feedbackRequestPopUp');
}

export function feedbackPopUpSuccessDisplay(): void {
    showAndHidePopUp('.feedbackPopUpSuccess');
}

export function selectEmotionPopUpDisplay(): void {
    showAndHidePopUp('.selectEmotionPopUp');
}

// ============================================================
// Feedback Module
// ============================================================

export function initFeedback(): void {
    let selectedEmotion = '';

    const feedbackBtn = getElementById<HTMLElement>('feedbackButton');
    const closeCtx = getElementById<HTMLElement>('closeModal');
    const nextToFeed = getElementById<HTMLElement>('nextToFeedback');
    const nextToEmail = getElementById<HTMLElement>('nextToEmail');
    const backToEmoji = getElementById<HTMLElement>('backToEmoji');
    const backToFeedback = getElementById<HTMLElement>('backToFeedback');
    const feedbackForm = getElementById<HTMLFormElement>('feedbackForm');
    const feedbackModal = getElementById<HTMLElement>('feedbackModal');

    if (feedbackBtn !== null && feedbackModal !== null) {
        feedbackBtn.onclick = (): void => {
            feedbackModal.style.display = 'flex';
        };
    }

    if (closeCtx !== null && feedbackModal !== null) {
        closeCtx.onclick = (): void => {
            feedbackModal.style.display = 'none';
        };
    }

    if (nextToFeed !== null) {
        nextToFeed.onclick = (): void => {
            const selectedEmoji = getElement<HTMLElement>('.emoji.selected');
            if (selectedEmoji === null) {
                selectEmotionPopUpDisplay();
                return;
            }
            selectedEmotion = selectedEmoji.dataset['value'] ?? '';

            const step1 = getElementById<HTMLElement>('step1');
            const step2 = getElementById<HTMLElement>('step2');
            if (step1 !== null) {
                step1.style.display = 'none';
            }
            if (step2 !== null) {
                step2.style.display = 'block';
            }
        };
    }

    // Emoji selection
    document.querySelectorAll<HTMLElement>('.emoji').forEach((emoji: HTMLElement): void => {
        emoji.onclick = (): void => {
            document.querySelectorAll<HTMLElement>('.emoji').forEach((e: HTMLElement): void => {
                e.classList.remove('selected');
            });
            emoji.classList.add('selected');

            const notSelectedMsg = getElementById<HTMLElement>('emoji-not-selected');
            if (notSelectedMsg !== null) {
                notSelectedMsg.hidden = true;
            }

            const emojisDiv = document.getElementsByClassName('emojis')[0] as HTMLElement | undefined;
            if (emojisDiv !== undefined) {
                emojisDiv.style.margin = '20px 0';
            }
        };
    });

    if (nextToEmail !== null) {
        nextToEmail.onclick = (): void => {
            const feedbackInput = getElementById<HTMLTextAreaElement>('feedback');
            if (feedbackInput === null || feedbackInput.value === '') {
                selectFeedbackRequestPopUp();
                return;
            }

            const step2 = getElementById<HTMLElement>('step2');
            const step3 = getElementById<HTMLElement>('step3');
            if (step2 !== null) {
                step2.style.display = 'none';
            }
            if (step3 !== null) {
                step3.style.display = 'block';
            }
        };
    }

    if (backToEmoji !== null) {
        backToEmoji.onclick = (): void => {
            const step2 = getElementById<HTMLElement>('step2');
            const step1 = getElementById<HTMLElement>('step1');
            if (step2 !== null) {
                step2.style.display = 'none';
            }
            if (step1 !== null) {
                step1.style.display = 'block';
            }
        };
    }

    if (backToFeedback !== null) {
        backToFeedback.onclick = (): void => {
            const step3 = getElementById<HTMLElement>('step3');
            const step2 = getElementById<HTMLElement>('step2');
            if (step3 !== null) {
                step3.style.display = 'none';
            }
            if (step2 !== null) {
                step2.style.display = 'block';
            }
        };
    }

    // Check for popup on load
    window.addEventListener('load', (): void => {
        if (sessionStorage.getItem('showPopUp') === 'true') {
            feedbackPopUpSuccessDisplay();
            sessionStorage.removeItem('showPopUp');
        }
    });

    if (feedbackForm !== null && feedbackModal !== null) {
        feedbackForm.onsubmit = (event: Event): void => {
            event.preventDefault();
            feedbackForm.reset();
            feedbackModal.style.display = 'none';
            sessionStorage.setItem('showPopUp', 'true');
            window.location.reload();
        };
    }

    // Use selectedEmotion to avoid unused variable warning
    void selectedEmotion;
}

// ============================================================
// Progress Manager Class
// ============================================================

export class ProgressManager {
    private readonly storageKey: string = 'skillwise_user_progress';
    private progress: ProgressData;

    constructor() {
        this.progress = this.loadProgress();
        this.init();
    }

    public loadProgress(): ProgressData {
        const data = localStorage.getItem(this.storageKey);
        if (data === null) {
            return {};
        }
        try {
            return JSON.parse(data) as ProgressData;
        } catch {
            return {};
        }
    }

    public saveProgress(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    public generateId(title: string): string {
        return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    }

    public toggleCourse(id: string, isCompleted: boolean): void {
        if (isCompleted) {
            const courseProgress: CourseProgress = {
                completedAt: new Date().toISOString(),
                status: 'completed'
            };
            this.progress[id] = courseProgress;
        } else {
            // Use destructuring to remove the key instead of delete
            const { [id]: _removed, ...rest } = this.progress;
            this.progress = rest;
        }
        this.saveProgress();
    }

    public createToggleElement(card: HTMLElement, courseId: string): void {
        if (card.querySelector('.progress-toggle-container') !== null) {
            return;
        }

        const container = document.createElement('div');
        container.className = 'progress-toggle-container';

        const isCompleted = this.progress[courseId] !== undefined;
        if (isCompleted) {
            card.classList.add('course-completed');
        }

        const label = document.createElement('label');
        label.className = 'progress-checkbox-label';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isCompleted;
        checkbox.className = 'progress-checkbox';

        const span = document.createElement('span');
        span.textContent = isCompleted ? 'Completed' : 'Mark as Completed';

        checkbox.addEventListener('change', (e: Event): void => {
            const target = e.target as HTMLInputElement;
            const checked = target.checked;
            this.toggleCourse(courseId, checked);
            span.textContent = checked ? 'Completed' : 'Mark as Completed';
            if (checked) {
                card.classList.add('course-completed');
                this.triggerConfetti(container);
            } else {
                card.classList.remove('course-completed');
            }
        });

        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);

        const textDiv = card.querySelector<HTMLElement>('div:nth-child(2)');
        if (textDiv !== null) {
            textDiv.appendChild(container);
        } else {
            card.appendChild(container);
        }
    }

    public triggerConfetti(element: HTMLElement): void {
        const celebration = document.createElement('span');
        celebration.textContent = '🎉';
        celebration.className = 'completion-confetti';
        element.appendChild(celebration);
        setTimeout((): void => {
            celebration.remove();
        }, 1000);
    }

    public init(): void {
        this.injectStyles();
        const courseCards = document.querySelectorAll<HTMLElement>('.course-card, .card');

        courseCards.forEach((card: HTMLElement): void => {
            const titleEl = card.querySelector<HTMLElement>('.title-lg, .course-title, h3');
            if (titleEl === null) {
                return;
            }

            const title = titleEl.textContent;
            if (title === null || title.trim().length < 2) {
                return;
            }

            const id = this.generateId(title);
            this.createToggleElement(card, id);
        });
    }

    public injectStyles(): void {
        if (document.getElementById('progress-manager-styles') !== null) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'progress-manager-styles';
        style.textContent = `
      .progress-toggle-container {
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px dashed #e0e0e0;
      }
      .progress-checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-weight: 600;
        color: #555;
        font-size: 0.9rem;
        user-select: none;
      }
      .progress-checkbox-label:hover {
        color: #28a745;
      }
      .progress-checkbox {
        accent-color: #28a745;
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
      .course-completed {
        border: 2px solid #28a745 !important;
        background: linear-gradient(to bottom right, #ffffff, #f0fff4) !important;
        position: relative;
      }
      .course-completed::after {
        content: '✓';
        position: absolute;
        top: -10px;
        right: -10px;
        background: #28a745;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10;
        animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .completion-confetti {
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: 2rem;
        pointer-events: none;
        animation: floatUp 1s ease-out forwards;
      }
      @keyframes floatUp {
        0% { transform: translate(-50%, 0) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -100px) scale(1.5); opacity: 0; }
      }
      @keyframes popIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }
    `;
        document.head.appendChild(style);
    }

    // Getter for testing purposes
    public getProgress(): ProgressData {
        return { ...this.progress };
    }
}

// ============================================================
// Initialization
// ============================================================

export function initializeApp(): void {
    initPreloader();
    initNavbar();
    initHeader();
    initFooterYear();
    initFeedback();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', (): void => {
    initializeApp();
    new ProgressManager();
});
