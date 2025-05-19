/**
 * Test Script for Execution Operations
 * 
 * This script tests the n8n execution operations after client refactoring.
 */

import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { ExecutionClient } from '../../../src/api/execution-client';
import { N8nApiClient } from '../../../src/api/client';

// Mock necessary dependencies
jest.mock('../../../src/api/client');

describe('ExecutionClient', () => {
  // Mock objects
  let mockAxiosInstance: any;
  let mockApiClient: any;
  let executionClient: ExecutionClient;


  // Test data
  const testExecutionId = 'test-execution-123';
  const testExecution = {
    id: testExecutionId,
    workflowId: 'wf-1',
    status: 'success',
    startedAt: '2023-01-01T00:00:00.000Z',
    finishedAt: '2023-01-01T00:01:00.000Z',
    data: {
      resultData: {
        runData: {}
      }
    }
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    


    // Create mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };

    // Create mock API client
    mockApiClient = {
      getAxiosInstance: jest.fn().mockReturnValue(mockAxiosInstance)
    };

    // Create execution client with mock API client
    executionClient = new ExecutionClient(mockApiClient as unknown as N8nApiClient);
  });

  describe('listExecutions', () => {
    it('should return a list of executions', async () => {
      // Mock response
      const mockExecutions = [testExecution];
      const mockResponse = { data: { data: mockExecutions } };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      // Call method
      const result = await executionClient.listExecutions();

      // Assert
      expect(result).toEqual(mockExecutions);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/executions', { params: {} });
    });

    it('should handle filter parameters', async () => {
      // Mock response
      const mockExecutions = [testExecution];
      const mockResponse = { data: { data: mockExecutions } };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      // Call method with parameters - passing only permitted parameters
      const result = await executionClient.listExecutions('wf-1', 'success');

      // Assert
      expect(result).toEqual(mockExecutions);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/executions', { 
        params: { 
          workflowId: 'wf-1',
          status: 'success'
        } 
      });
    });

    it('should handle errors', async () => {
      // Mock error
      const mockError = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValueOnce(mockError);

      // Call method and assert error
      await expect(executionClient.listExecutions()).rejects.toThrow();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/executions', { params: {} });
    });
  });

  describe('readExecution', () => {
    it('should return a execution by id', async () => {
      // Mock response
      const mockResponse = { data: testExecution };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      // Call method
      const result = await executionClient.readExecution(testExecutionId);

      // Assert
      expect(result).toEqual(testExecution);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/executions/${testExecutionId}`);
    });

    it('should handle errors', async () => {
      // Mock error
      const mockError = new Error('Not found');
      mockAxiosInstance.get.mockRejectedValueOnce(mockError);

      // Call method and assert error
      await expect(executionClient.readExecution(testExecutionId)).rejects.toThrow();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/executions/${testExecutionId}`);
    });
  });

  describe('deleteExecution', () => {
    it('should delete an execution', async () => {
      // Mock response
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);

      // Call method
      const result = await executionClient.deleteExecution(testExecutionId);

      // Assert
      expect(result).toEqual({ success: true });
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/executions/${testExecutionId}`);
    });

    it('should handle errors', async () => {
      // Mock error
      const mockError = new Error('Not found');
      mockAxiosInstance.delete.mockRejectedValueOnce(mockError);

      // Call method and assert error
      await expect(executionClient.deleteExecution(testExecutionId)).rejects.toThrow();
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/executions/${testExecutionId}`);
    });
  });
});
