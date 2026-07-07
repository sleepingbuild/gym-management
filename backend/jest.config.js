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
        // 👇 Xử lý uuid ESM
        "^uuid$": "<rootDir>/node_modules/uuid/dist/index.js",
    },
    transformIgnorePatterns: [
        // 👇 Cho phép transform uuid
        "node_modules/(?!(uuid)/)",
    ],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/server.ts",
        "!src/**/index.ts",
    ],
    verbose: true,
    testTimeout: 30000,
};
