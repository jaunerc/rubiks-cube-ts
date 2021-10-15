module.exports = {
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testMatch: ["**/?(*.)+(spec|test).+(ts|tsx|js)"],
    testPathIgnorePatterns: ["/lib/", "/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverage: true,
};
