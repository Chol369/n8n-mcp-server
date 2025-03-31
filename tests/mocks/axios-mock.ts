/**
 * Axios mock utilities for n8n MCP Server tests
 */

import { jest } from '@jest/globals'; // Import jest
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface MockResponse {
  data: any;
  status: number;
  statusText: string;
  headers?: Record<string, string>;
  config?: AxiosRequestConfig;
}

export const createMockAxiosResponse = (options: Partial<MockResponse> = {}): AxiosResponse => {
  return {
    data: options.data ?? {},
    status: options.status ?? 200,
    statusText: options.statusText ?? 'OK',
    headers: options.headers ?? {},
    config: options.config ?? {},
  } as AxiosResponse;
};

/**
 * Create a mock axios instance for testing
 */
export const createMockAxiosInstance = () => {
  const mockRequests: Record<string, any[]> = {};
  const mockResponses: Record<string, (MockResponse | Error)[]> = {}; // Allow Error type

  const mockInstance = {
    get: jest.fn<any>(), // Add type hint for mock function
    post: jest.fn<any>(), // Add type hint for mock function
    put: jest.fn<any>(), // Add type hint for mock function
    delete: jest.fn<any>(), // Add type hint for mock function
    interceptors: {
      request: {
        use: jest.fn<any>(), // Add type hint for mock function
      },
      response: {
        use: jest.fn<any>(), // Add type hint for mock function
      },
    },
    defaults: {},

    // Helper method to add mock response
    addMockResponse(method: string, url: string, response: MockResponse | Error) {
      const key = `${method}:${url}`;
      if (!mockResponses[key]) {
        mockResponses[key] = [];
      }
      mockResponses[key].push(response);
    },

    // Helper method to get request history
    getRequestHistory(method: string, url: string) {
      const key = `${method}:${url}`;
      return mockRequests[key] || [];
    },

    // Reset all mocks
    reset() {
      Object.keys(mockRequests).forEach(key => {
        delete mockRequests[key];
      });

      Object.keys(mockResponses).forEach(key => {
        delete mockResponses[key];
      });

      mockInstance.get.mockReset();
      mockInstance.post.mockReset();
      mockInstance.put.mockReset();
      mockInstance.delete.mockReset();
      mockInstance.interceptors.request.use.mockReset();
      mockInstance.interceptors.response.use.mockReset();
    }
  };

  // Setup method implementations
  ['get', 'post', 'put', 'delete'].forEach((method) => { // Remove explicit type annotation
    (mockInstance as any)[method].mockImplementation(async (url: string, data?: any) => { // Keep cast for dynamic access
      const requestKey = `${method}:${url}`;

      if (!mockRequests[requestKey]) {
        mockRequests[requestKey] = [];
      }

      mockRequests[requestKey].push(data);

      if (mockResponses[requestKey] && mockResponses[requestKey].length > 0) {
        const response = mockResponses[requestKey].shift(); // shift() can return undefined

        if (response instanceof Error) {
          throw response;
        }
        
        if (response) { // Check if response is defined
            return createMockAxiosResponse(response);
        }
      }

      throw new Error(`No mock response defined for ${method.toUpperCase()} ${url}`);
    });
  });

  return mockInstance;
};

export default {
  createMockAxiosResponse,
  createMockAxiosInstance,
};
