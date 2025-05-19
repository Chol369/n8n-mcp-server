/**
 * Axios mock utilities for n8n MCP Server tests
 */

import { jest } from '@jest/globals';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

// Jest mocks need proper type casting to handle axios methods

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
  const mockResponses: Record<string, MockResponse[]> = {};
  
  // Helper function to handle request logic (defined outside mock implementations to avoid repeating code)
  function handleRequest(method: string, url: string, data?: any) {
    const requestKey = `${method}:${url}`;
    
    if (!mockRequests[requestKey]) {
      mockRequests[requestKey] = [];
    }
    
    mockRequests[requestKey].push(data);
    
    if (mockResponses[requestKey] && mockResponses[requestKey].length > 0) {
      const response = mockResponses[requestKey].shift();
      
      if (response instanceof Error) {
        throw response;
      }
      
      return createMockAxiosResponse(response);
    }
    
    throw new Error(`No mock response defined for ${method.toUpperCase()} ${url}`);
  }
  
  const mockInstance = {
    // @ts-expect-error - Jest mock typing issues with function parameter compatibility
    get: jest.fn().mockImplementation((url: string) => handleRequest('get', url)),
    // @ts-expect-error - Jest mock typing issues with function parameter compatibility
    post: jest.fn().mockImplementation((url: string, data?: any) => handleRequest('post', url, data)),
    // @ts-expect-error - Jest mock typing issues with function parameter compatibility
    put: jest.fn().mockImplementation((url: string, data?: any) => handleRequest('put', url, data)),
    // @ts-expect-error - Jest mock typing issues with function parameter compatibility
    delete: jest.fn().mockImplementation((url: string) => handleRequest('delete', url)),
    
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    
    defaults: {},
    
    // Helper method to add mock response
    addMockResponse(method: string, url: string, response: MockResponse | Error) {
      if (!mockResponses[`${method}:${url}`]) {
        mockResponses[`${method}:${url}`] = [];
      }
      
      if (response instanceof Error) {
        mockResponses[`${method}:${url}`].push(response as any);
      } else {
        mockResponses[`${method}:${url}`].push(response);
      }
    },
    
    // Helper method to get request history
    getRequestHistory(method: string, url: string) {
      return mockRequests[`${method}:${url}`] || [];
    },
    
    // Reset all mocks
    reset() {
      Object.keys(mockRequests).forEach(key => {
        delete mockRequests[key];
      });
      
      Object.keys(mockResponses).forEach(key => {
        delete mockResponses[key];
      });
      
      mockInstance.get.mockClear();
      mockInstance.post.mockClear();
      mockInstance.put.mockClear();
      mockInstance.delete.mockClear();
    }
  };
  
  return mockInstance;
};

export default {
  createMockAxiosResponse,
  createMockAxiosInstance,
};
