module.exports = {
  // Use commonjs style export
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      {
        plugins: ['@babel/plugin-transform-modules-commonjs']
      }
    ]
  },
  // Allow src and test folders to resolve imports properly
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    // Handle mock imports without extension
    '^../../mocks/(.*)$': '<rootDir>/tests/mocks/$1.ts',
    // Mock all modelcontextprotocol SDK imports
    '^@modelcontextprotocol/sdk$': '<rootDir>/tests/mocks/modelcontextprotocol-sdk-mock.ts',
    '^@modelcontextprotocol/sdk/types.js$': '<rootDir>/tests/mocks/modelcontextprotocol-sdk-mock.ts',
    '^@modelcontextprotocol/sdk/(.*)$': '<rootDir>/tests/mocks/modelcontextprotocol-sdk-mock.ts'
  },
  // Transform the modelcontextprotocol SDK modules - empty array means transform everything
  transformIgnorePatterns: [],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testMatch: ['**/tests/**/*.test.ts'],
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],
  setupFilesAfterEnv: ['<rootDir>/tests/test-setup.ts'],
  // Ensure tests have enough time to run
  testTimeout: 30000
};
