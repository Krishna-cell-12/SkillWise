/**
 * Jest Test Setup
 * Global configuration and mocks for testing
 */
// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: jest.fn((key) => {
        return localStorageMock.store[key] ?? null;
    }),
    setItem: jest.fn((key, value) => {
        localStorageMock.store[key] = value;
    }),
    removeItem: jest.fn((key) => {
        delete localStorageMock.store[key];
    }),
    clear: jest.fn(() => {
        localStorageMock.store = {};
    }),
    get length() {
        return Object.keys(localStorageMock.store).length;
    },
    key: jest.fn((index) => {
        const keys = Object.keys(localStorageMock.store);
        return keys[index] ?? null;
    })
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});
// Mock sessionStorage
const sessionStorageMock = {
    store: {},
    getItem: jest.fn((key) => {
        return sessionStorageMock.store[key] ?? null;
    }),
    setItem: jest.fn((key, value) => {
        sessionStorageMock.store[key] = value;
    }),
    removeItem: jest.fn((key) => {
        delete sessionStorageMock.store[key];
    }),
    clear: jest.fn(() => {
        sessionStorageMock.store = {};
    }),
    get length() {
        return Object.keys(sessionStorageMock.store).length;
    },
    key: jest.fn((index) => {
        const keys = Object.keys(sessionStorageMock.store);
        return keys[index] ?? null;
    })
};
Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
});
// Mock IntersectionObserver
class MockIntersectionObserver {
    constructor(callback) {
        this.root = null;
        this.rootMargin = '';
        this.thresholds = [];
        this.callback = callback;
    }
    observe(_target) {
        // No-op for testing
    }
    unobserve(_target) {
        // No-op for testing
    }
    disconnect() {
        // No-op for testing
    }
    takeRecords() {
        return [];
    }
    // Helper for triggering intersection in tests
    trigger(entries) {
        this.callback(entries, this);
    }
}
Object.defineProperty(window, 'IntersectionObserver', {
    value: MockIntersectionObserver,
    writable: true
});
// Mock requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
    value: (callback) => {
        return window.setTimeout(() => callback(Date.now()), 0);
    }
});
// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
    value: jest.fn()
});
// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.store = {};
    sessionStorageMock.store = {};
    document.body.innerHTML = '';
    document.head.innerHTML = '';
});
// Export mocks for use in tests
export { localStorageMock, sessionStorageMock, MockIntersectionObserver };
