/**
 * Mock implementation of the N8nApiClient
 * 
 * This file provides a standardized mock for the N8nApiClient class
 * to be used across all tests.
 */

import { jest } from '@jest/globals';
import { createMockAxiosInstance } from './axios-mock.js';

/**
 * Creates a consistent mock implementation of N8nApiClient for tests
 */
export const createMockN8nApiClient = () => {
  const mockAxiosInstance = createMockAxiosInstance();
  
  return {
    // Basic HTTP methods
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    
    // Method to get axios instance
    getAxiosInstance: jest.fn().mockReturnValue(mockAxiosInstance),
    
    // Common client methods
    getBaseUrl: jest.fn().mockReturnValue('https://n8n.example.com/api/v1'),
    getApiKey: jest.fn().mockReturnValue('test-api-key'),
    
    // Reset all mocks
    resetMocks: () => {
      jest.clearAllMocks();
    }
  };
};
