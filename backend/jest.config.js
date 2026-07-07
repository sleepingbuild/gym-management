module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    testMatch: ["**/*.test.ts"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.json",
            },
        ],
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        // 👇 Mock uuid để tránh lỗi ESM
        "^uuid$": "<rootDir>/tests/__mocks__/uuid.js",
    },
    transformIgnorePatterns: [],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/server.ts",
        "!src/**/index.ts",
    ],
    verbose: true,
    testTimeout: 30000,
};
