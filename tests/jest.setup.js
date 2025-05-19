/**
 * Global test setup for n8n MCP Server tests
 */

// Make jest available globally for this file (CommonJS format)
const jest = global.jest;

// Set up initial environment variables for testing
process.env.NODE_ENV = 'test';
process.env.N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678/api/v1';
process.env.N8N_API_KEY = process.env.N8N_API_KEY || 'test-api-key';

// Only run mock if jest is available (prevents errors when running TypeScript compiler)
if (typeof jest !== 'undefined') {
  // Mock axios
  jest.mock('axios', () => {
    return {
      create: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ data: {} })),
        post: jest.fn(() => Promise.resolve({ data: {} })),
        put: jest.fn(() => Promise.resolve({ data: {} })),
        patch: jest.fn(() => Promise.resolve({ data: {} })),
        delete: jest.fn(() => Promise.resolve({ data: {} })),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      })),
      get: jest.fn(() => Promise.resolve({ data: {} })),
      post: jest.fn(() => Promise.resolve({ data: {} })),
      put: jest.fn(() => Promise.resolve({ data: {} })),
      patch: jest.fn(() => Promise.resolve({ data: {} })),
      delete: jest.fn(() => Promise.resolve({ data: {} })),
      request: jest.fn(() => Promise.resolve({ data: {} }))
    };
  });
}
