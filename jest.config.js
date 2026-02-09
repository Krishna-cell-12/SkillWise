/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/assets/js'],
    testMatch: [
        '**/__tests__/**/*.test.ts',
        '**/__tests__/**/*.spec.ts',
        '**/*.test.ts',
        '**/*.spec.ts'
    ],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: {
                strict: true,
                target: 'ES2020',
                lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                module: 'CommonJS',
                esModuleInterop: true,
                skipLibCheck: true,
                noImplicitAny: true,
                strictNullChecks: true
            }
        }]
    },
    collectCoverageFrom: [
        'assets/js/**/*.ts',
        '!assets/js/**/*.d.ts',
        '!assets/js/types.ts',
        '!assets/js/**/*.test.ts',
        '!assets/js/**/*.spec.ts',
        '!assets/js/**/__tests__/**'
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
    coverageDirectory: '<rootDir>/coverage',
    moduleFileExtensions: ['ts', 'js', 'json'],
    verbose: true,
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: ['<rootDir>/assets/js/__tests__/setup.ts']
};

module.exports = config;
