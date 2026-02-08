/**
 * Jest Test Setup
 * Global configuration and mocks for testing
 */

// Mock localStorage
const localStorageMock = {
    store: {} as Record<string, string>,
    getItem: jest.fn((key: string): string | null => {
        return localStorageMock.store[key] ?? null;
    }),
    setItem: jest.fn((key: string, value: string): void => {
        localStorageMock.store[key] = value;
    }),
    removeItem: jest.fn((key: string): void => {
        delete localStorageMock.store[key];
    }),
    clear: jest.fn((): void => {
        localStorageMock.store = {};
    }),
    get length(): number {
        return Object.keys(localStorageMock.store).length;
    },
    key: jest.fn((index: number): string | null => {
        const keys = Object.keys(localStorageMock.store);
        return keys[index] ?? null;
    })
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
    store: {} as Record<string, string>,
    getItem: jest.fn((key: string): string | null => {
        return sessionStorageMock.store[key] ?? null;
    }),
    setItem: jest.fn((key: string, value: string): void => {
        sessionStorageMock.store[key] = value;
    }),
    removeItem: jest.fn((key: string): void => {
        delete sessionStorageMock.store[key];
    }),
    clear: jest.fn((): void => {
        sessionStorageMock.store = {};
    }),
    get length(): number {
        return Object.keys(sessionStorageMock.store).length;
    },
    key: jest.fn((index: number): string | null => {
        const keys = Object.keys(sessionStorageMock.store);
        return keys[index] ?? null;
    })
};

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
});

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: readonly number[] = [];

    private callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
    }

    observe(_target: Element): void {
        // No-op for testing
    }

    unobserve(_target: Element): void {
        // No-op for testing
    }

    disconnect(): void {
        // No-op for testing
    }

    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }

    // Helper for triggering intersection in tests
    trigger(entries: IntersectionObserverEntry[]): void {
        this.callback(entries, this);
    }
}

Object.defineProperty(window, 'IntersectionObserver', {
    value: MockIntersectionObserver,
    writable: true
});

// Mock requestAnimationFrame
Object.defineProperty(window, 'requestAnimationFrame', {
    value: (callback: FrameRequestCallback): number => {
        return window.setTimeout(() => callback(Date.now()), 0);
    }
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
    value: jest.fn()
});

// Reset mocks before each test
beforeEach((): void => {
    jest.clearAllMocks();
    localStorageMock.store = {};
    sessionStorageMock.store = {};
    document.body.innerHTML = '';
    document.head.innerHTML = '';
});

// Export mocks for use in tests
export { localStorageMock, sessionStorageMock, MockIntersectionObserver };
