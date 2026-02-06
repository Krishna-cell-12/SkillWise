'use strict';

/**
 * add eventListener on multiple elements
 */
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

/**
 * PRELOADER
 */
const preloader = document.querySelector("[data-preloader]");
const circle = document.querySelector("[data-circle]");

window.addEventListener("load", function () {
  if (preloader) {
    preloader.classList.add("loaded");
    circle.style.animation = "none";
    document.body.classList.add("loaded");
  }
});

/**
 * NAVBAR TOGGLER FOR MOBILE
 */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = () => {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

navTogglers.forEach(toggler => toggler.addEventListener("click", toggleNavbar));

if (document.querySelector("[data-nav-toggler]")) {
  document.querySelector("[data-nav-toggler]").addEventListener("click", function() {
    document.body.classList.toggle("nav-active");
  });
}

/**
 * HEADER
 */
const header = document.querySelector("[data-header]");

const headerActive = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
}

// dynamically updating year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

window.addEventListener("scroll", headerActive);


// Feedback Section
let selectedEmotion = '';

const feedbackBtn = document.getElementById('feedbackButton');
if (feedbackBtn) {
    feedbackBtn.onclick = function() {
        document.getElementById('feedbackModal').style.display = 'flex';
    }
}

const closeCtx = document.getElementById('closeModal');
if (closeCtx) {
    closeCtx.onclick = function() {
        document.getElementById('feedbackModal').style.display = 'none';
    }
}

const nextToFeed = document.getElementById('nextToFeedback');
if (nextToFeed) {
    nextToFeed.onclick = function() {
        const selectedEmoji = document.querySelector('.emoji.selected');
        if (!selectedEmoji) {
            selectEmotionPopUpDisplay()
            return;
        }
        selectedEmotion = selectedEmoji.dataset.value;
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
    }
}

document.querySelectorAll('.emoji').forEach(emoji => {
    emoji.onclick = function() {
        document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
        emoji.classList.add('selected');
        const notSelectedMsg = document.getElementById('emoji-not-selected');
        if(notSelectedMsg) notSelectedMsg.hidden= true;
        const emojisDiv = document.getElementsByClassName('emojis')[0];
        if(emojisDiv) emojisDiv.style.margin="20px 0";
    }
});

const nextToEmail = document.getElementById('nextToEmail');
if (nextToEmail) {
    nextToEmail.onclick = function() {
        if (!document.getElementById('feedback').value) {
            selectFeedbackRequestPopUp()
            return;
        }
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
    }
}

const backToEmoji = document.getElementById('backToEmoji');
if(backToEmoji) {
    backToEmoji.onclick = function() {
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step1').style.display = 'block';
    }
}

const backToFeedback = document.getElementById('backToFeedback');
if(backToFeedback) {
    backToFeedback.onclick = function() {
        document.getElementById('step3').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
    }
}

window.addEventListener('load', () => {
  if (sessionStorage.getItem('showPopUp') === 'true') {
      feedbackPopUpSuccessDisplay()
      sessionStorage.removeItem('showPopUp'); 
  }
});

const feedbackForm = document.getElementById('feedbackForm');
if(feedbackForm) {
    feedbackForm.onsubmit = function(event) {
        event.preventDefault();
        document.getElementById('feedbackForm').reset();
        document.getElementById('feedbackModal').style.display = 'none';

        sessionStorage.setItem('showPopUp', 'true'); 
        window.location.reload(); 
    };
}

const showAndHidePopUp = (selector, delayShow = 100, delayHide = 3000, showTranslate = 'translate(0)', hideTranslate = 'translate(120%)') => {
  setTimeout(() => {
    const element = document.querySelector(selector)
    if (element) {
      element.style.transform = showTranslate
      setTimeout(() => {
        element.style.transform = hideTranslate
      }, delayHide)
    }
  }, delayShow)
}

const selectFeedbackRequestPopUp = () => {
  showAndHidePopUp('.feedbackRequestPopUp', 100, 3000)
}

const feedbackPopUpSuccessDisplay = () => {
  showAndHidePopUp('.feedbackPopUpSuccess', 100, 3000)
}

const selectEmotionPopUpDisplay = () => {
  showAndHidePopUp('.selectEmotionPopUp', 100, 3000)
}

/* =========================================
   SKILLWISE PROGRESS TRACKING ENGINE
   Implements Issue #10: Persistent Progress
   ========================================= */

class ProgressManager {
  constructor() {
    this.storageKey = 'skillwise_user_progress';
    this.progress = this.loadProgress();
    this.init();
  }

  // Load progress from browser storage
  loadProgress() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  // Save progress to browser storage
  saveProgress() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
  }

  // Create a unique ID from the course title
  generateId(title) {
    return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  }

  // Handle the logic when a user clicks the checkbox
  toggleCourse(id, isCompleted) {
    if (isCompleted) {
      this.progress[id] = {
        completedAt: new Date().toISOString(),
        status: 'completed'
      };
    } else {
      delete this.progress[id];
    }
    this.saveProgress();
  }

  // Inject the "Mark as Completed" checkbox into a card
  createToggleElement(card, courseId) {
    if (card.querySelector('.progress-toggle-container')) return;

    const container = document.createElement('div');
    container.className = 'progress-toggle-container';
    
    const isCompleted = !!this.progress[courseId];
    if (isCompleted) card.classList.add('course-completed');

    const label = document.createElement('label');
    label.className = 'progress-checkbox-label';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted;
    checkbox.className = 'progress-checkbox';
    
    const span = document.createElement('span');
    span.textContent = isCompleted ? 'Completed' : 'Mark as Completed';
    
    checkbox.addEventListener('change', (e) => {
      const checked = e.target.checked;
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
    
    // Attempt to insert after the text content, before the pricing/button
    // We look for the div that holds the text (usually the 2nd child)
    const textDiv = card.querySelector('div:nth-child(2)');
    if (textDiv) {
        textDiv.appendChild(container);
    } else {
        // Fallback: append to the end of the card
        card.appendChild(container);
    }
  }

  triggerConfetti(element) {
    const celebration = document.createElement('span');
    celebration.textContent = '🎉';
    celebration.className = 'completion-confetti';
    element.appendChild(celebration);
    setTimeout(() => celebration.remove(), 1000);
  }

  init() {
    this.injectStyles();
    // Target both course-card (courses) and card (events/books if applicable)
    const courseCards = document.querySelectorAll('.course-card, .card');
    
    courseCards.forEach(card => {
      // Look for any header that looks like a title
      const titleEl = card.querySelector('.title-lg, .course-title, h3');
      if (!titleEl) return;
      
      const title = titleEl.textContent;
      // Skip if title is empty or too short
      if(!title || title.trim().length < 2) return;

      const id = this.generateId(title);
      this.createToggleElement(card, id);
    });
  }

  injectStyles() {
    if (document.getElementById('progress-manager-styles')) return;
    
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
}

// Start the engine safely
document.addEventListener('DOMContentLoaded', () => {
  new ProgressManager();
});