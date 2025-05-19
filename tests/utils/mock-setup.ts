/**
 * Test Utilities for Mock Setup
 * 
 * Provides common mock utilities for tests to prevent code duplication.
 */

import { EnvConfig } from '../../src/config/environment.js';

/**
 * Creates a mock environment configuration
 * 
 * @returns Mock environment configuration object for tests
 */
export function createMockConfig(): EnvConfig {
  return {
    n8nApiUrl: 'https://n8n.example.com/api/v1',
    n8nApiKey: 'test-api-key',
    n8nWebhookUsername: 'webhook-user',
    n8nWebhookPassword: 'webhook-password',
    debug: false
  };
}

/**
 * Creates a mock axios instance for testing
 * 
 * @returns Mock axios instance with common HTTP methods
 */
export function createMockAxiosInstance() {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  };
}

/**
 * Creates a mock N8nApiClient for testing
 * 
 * @param mockAxiosInstance Optional mock axios instance to use
 * @returns Mock N8nApiClient instance
 */
export function createMockApiClient(mockAxiosInstance?: any) {
  const axiosInstance = mockAxiosInstance || createMockAxiosInstance();
  
  return {
    getAxiosInstance: jest.fn().mockReturnValue(axiosInstance),
    checkConnectivity: jest.fn()
  };
}
