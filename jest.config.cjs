module.exports = {
  preset: 'ts-jest/presets/default-esm', // Use ESM preset for ts-jest
  testEnvironment: 'node',
  transform: {
    // Use ts-jest transformer with ESM support and point to tests tsconfig
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, tsconfig: 'tests/tsconfig.json' }], 
  },
  extensionsToTreatAsEsm: ['.ts'], // Treat .ts as ESM
  moduleNameMapper: { 
    // Recommended mapper for ts-jest ESM support: map extensionless paths to .js
    '^(\\.{1,2}/.*)$': '$1.js', 
  },
  // Handle the modelcontextprotocol SDK and other potential ESM dependencies
  transformIgnorePatterns: [
    "/node_modules/(?!(@modelcontextprotocol/sdk|axios|another-esm-dep)/)" // Adjust as needed
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testMatch: ['**/tests/**/*.test.ts'],
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.ts']
};
