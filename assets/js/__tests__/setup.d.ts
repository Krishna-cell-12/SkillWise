/**
 * Jest Test Setup
 * Global configuration and mocks for testing
 */
declare const localStorageMock: {
    store: Record<string, string>;
    getItem: jest.Mock<string | null, [key: string], any>;
    setItem: jest.Mock<void, [key: string, value: string], any>;
    removeItem: jest.Mock<void, [key: string], any>;
    clear: jest.Mock<void, [], any>;
    readonly length: number;
    key: jest.Mock<string | null, [index: number], any>;
};
declare const sessionStorageMock: {
    store: Record<string, string>;
    getItem: jest.Mock<string | null, [key: string], any>;
    setItem: jest.Mock<void, [key: string, value: string], any>;
    removeItem: jest.Mock<void, [key: string], any>;
    clear: jest.Mock<void, [], any>;
    readonly length: number;
    key: jest.Mock<string | null, [index: number], any>;
};
declare class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null;
    readonly rootMargin: string;
    readonly thresholds: readonly number[];
    private callback;
    constructor(callback: IntersectionObserverCallback);
    observe(_target: Element): void;
    unobserve(_target: Element): void;
    disconnect(): void;
    takeRecords(): IntersectionObserverEntry[];
    trigger(entries: IntersectionObserverEntry[]): void;
}
export { localStorageMock, sessionStorageMock, MockIntersectionObserver };
//# sourceMappingURL=setup.d.ts.map