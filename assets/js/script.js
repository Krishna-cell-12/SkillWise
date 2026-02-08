/**
 * SkillWise Main Script
 * Core functionality with strict TypeScript typing
 */
// ============================================================
// Utility Functions
// ============================================================
/**
 * Add event listener to multiple elements
 */
export function addEventOnElements(elements, eventType, callback) {
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
function getElement(selector) {
    return document.querySelector(selector);
}
/**
 * Safely get an element by ID with type assertion
 */
function getElementById(id) {
    return document.getElementById(id);
}
// ============================================================
// Preloader Module
// ============================================================
export function initPreloader() {
    const preloader = getElement('[data-preloader]');
    const circle = getElement('[data-circle]');
    window.addEventListener('load', () => {
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
export function initNavbar() {
    const navbar = getElement('[data-navbar]');
    const navTogglers = document.querySelectorAll('[data-nav-toggler]');
    const overlay = getElement('[data-overlay]');
    const toggleNavbar = () => {
        if (navbar !== null) {
            navbar.classList.toggle('active');
        }
        if (overlay !== null) {
            overlay.classList.toggle('active');
        }
        document.body.classList.toggle('nav-active');
    };
    navTogglers.forEach((toggler) => {
        toggler.addEventListener('click', toggleNavbar);
    });
}
// ============================================================
// Header Module
// ============================================================
export function initHeader() {
    const header = getElement('[data-header]');
    const headerActive = () => {
        if (header === null) {
            return;
        }
        if (window.scrollY > 100) {
            header.classList.add('active');
        }
        else {
            header.classList.remove('active');
        }
    };
    window.addEventListener('scroll', headerActive);
}
// ============================================================
// Footer Year Module
// ============================================================
export function initFooterYear() {
    const yearEl = getElementById('year');
    if (yearEl !== null) {
        yearEl.textContent = new Date().getFullYear().toString();
    }
}
// ============================================================
// Popup Utility Module
// ============================================================
const DEFAULT_POPUP_CONFIG = {
    delayShow: 100,
    delayHide: 3000,
    showTranslate: 'translate(0)',
    hideTranslate: 'translate(120%)'
};
export function showAndHidePopUp(selector, delayShow = DEFAULT_POPUP_CONFIG.delayShow, delayHide = DEFAULT_POPUP_CONFIG.delayHide, showTranslate = DEFAULT_POPUP_CONFIG.showTranslate, hideTranslate = DEFAULT_POPUP_CONFIG.hideTranslate) {
    setTimeout(() => {
        const element = getElement(selector);
        if (element !== null) {
            element.style.transform = showTranslate;
            setTimeout(() => {
                element.style.transform = hideTranslate;
            }, delayHide);
        }
    }, delayShow);
}
export function selectFeedbackRequestPopUp() {
    showAndHidePopUp('.feedbackRequestPopUp');
}
export function feedbackPopUpSuccessDisplay() {
    showAndHidePopUp('.feedbackPopUpSuccess');
}
export function selectEmotionPopUpDisplay() {
    showAndHidePopUp('.selectEmotionPopUp');
}
// ============================================================
// Feedback Module
// ============================================================
export function initFeedback() {
    let selectedEmotion = '';
    const feedbackBtn = getElementById('feedbackButton');
    const closeCtx = getElementById('closeModal');
    const nextToFeed = getElementById('nextToFeedback');
    const nextToEmail = getElementById('nextToEmail');
    const backToEmoji = getElementById('backToEmoji');
    const backToFeedback = getElementById('backToFeedback');
    const feedbackForm = getElementById('feedbackForm');
    const feedbackModal = getElementById('feedbackModal');
    if (feedbackBtn !== null && feedbackModal !== null) {
        feedbackBtn.onclick = () => {
            feedbackModal.style.display = 'flex';
        };
    }
    if (closeCtx !== null && feedbackModal !== null) {
        closeCtx.onclick = () => {
            feedbackModal.style.display = 'none';
        };
    }
    if (nextToFeed !== null) {
        nextToFeed.onclick = () => {
            const selectedEmoji = getElement('.emoji.selected');
            if (selectedEmoji === null) {
                selectEmotionPopUpDisplay();
                return;
            }
            selectedEmotion = selectedEmoji.dataset['value'] ?? '';
            const step1 = getElementById('step1');
            const step2 = getElementById('step2');
            if (step1 !== null) {
                step1.style.display = 'none';
            }
            if (step2 !== null) {
                step2.style.display = 'block';
            }
        };
    }
    // Emoji selection
    document.querySelectorAll('.emoji').forEach((emoji) => {
        emoji.onclick = () => {
            document.querySelectorAll('.emoji').forEach((e) => {
                e.classList.remove('selected');
            });
            emoji.classList.add('selected');
            const notSelectedMsg = getElementById('emoji-not-selected');
            if (notSelectedMsg !== null) {
                notSelectedMsg.hidden = true;
            }
            const emojisDiv = document.getElementsByClassName('emojis')[0];
            if (emojisDiv !== undefined) {
                emojisDiv.style.margin = '20px 0';
            }
        };
    });
    if (nextToEmail !== null) {
        nextToEmail.onclick = () => {
            const feedbackInput = getElementById('feedback');
            if (feedbackInput === null || feedbackInput.value === '') {
                selectFeedbackRequestPopUp();
                return;
            }
            const step2 = getElementById('step2');
            const step3 = getElementById('step3');
            if (step2 !== null) {
                step2.style.display = 'none';
            }
            if (step3 !== null) {
                step3.style.display = 'block';
            }
        };
    }
    if (backToEmoji !== null) {
        backToEmoji.onclick = () => {
            const step2 = getElementById('step2');
            const step1 = getElementById('step1');
            if (step2 !== null) {
                step2.style.display = 'none';
            }
            if (step1 !== null) {
                step1.style.display = 'block';
            }
        };
    }
    if (backToFeedback !== null) {
        backToFeedback.onclick = () => {
            const step3 = getElementById('step3');
            const step2 = getElementById('step2');
            if (step3 !== null) {
                step3.style.display = 'none';
            }
            if (step2 !== null) {
                step2.style.display = 'block';
            }
        };
    }
    // Check for popup on load
    window.addEventListener('load', () => {
        if (sessionStorage.getItem('showPopUp') === 'true') {
            feedbackPopUpSuccessDisplay();
            sessionStorage.removeItem('showPopUp');
        }
    });
    if (feedbackForm !== null && feedbackModal !== null) {
        feedbackForm.onsubmit = (event) => {
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
    constructor() {
        this.storageKey = 'skillwise_user_progress';
        this.progress = this.loadProgress();
        this.init();
    }
    loadProgress() {
        const data = localStorage.getItem(this.storageKey);
        if (data === null) {
            return {};
        }
        try {
            return JSON.parse(data);
        }
        catch {
            return {};
        }
    }
    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }
    generateId(title) {
        return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    }
    toggleCourse(id, isCompleted) {
        if (isCompleted) {
            const courseProgress = {
                completedAt: new Date().toISOString(),
                status: 'completed'
            };
            this.progress[id] = courseProgress;
        }
        else {
            // Use destructuring to remove the key instead of delete
            const { [id]: _removed, ...rest } = this.progress;
            this.progress = rest;
        }
        this.saveProgress();
    }
    createToggleElement(card, courseId) {
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
        checkbox.addEventListener('change', (e) => {
            const target = e.target;
            const checked = target.checked;
            this.toggleCourse(courseId, checked);
            span.textContent = checked ? 'Completed' : 'Mark as Completed';
            if (checked) {
                card.classList.add('course-completed');
                this.triggerConfetti(container);
            }
            else {
                card.classList.remove('course-completed');
            }
        });
        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
        const textDiv = card.querySelector('div:nth-child(2)');
        if (textDiv !== null) {
            textDiv.appendChild(container);
        }
        else {
            card.appendChild(container);
        }
    }
    triggerConfetti(element) {
        const celebration = document.createElement('span');
        celebration.textContent = '🎉';
        celebration.className = 'completion-confetti';
        element.appendChild(celebration);
        setTimeout(() => {
            celebration.remove();
        }, 1000);
    }
    init() {
        this.injectStyles();
        const courseCards = document.querySelectorAll('.course-card, .card');
        courseCards.forEach((card) => {
            const titleEl = card.querySelector('.title-lg, .course-title, h3');
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
    injectStyles() {
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
    getProgress() {
        return { ...this.progress };
    }
}
// ============================================================
// Initialization
// ============================================================
export function initializeApp() {
    initPreloader();
    initNavbar();
    initHeader();
    initFooterYear();
    initFeedback();
}
// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    new ProgressManager();
});
