module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "@vue/vue2-jest",
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(.+/?))"],
  collectCoverageFrom: [
    "src/**/*.{js,ts,vue}",
    "!src/**/*.d.ts",
    "!src/main.ts",
    "!src/router/index.ts",
    "!**/node_modules/**",
  ],
  coverageReporters: ["text", "html", "lcov", "json-summary"],
  coverageDirectory: "coverage",
};
