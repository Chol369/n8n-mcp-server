/**
 * Test Script for Workflow Run Operations
 * 
 * This file tests workflow run operations, which are part of
 * the core n8n API functionality.
 */

import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { N8nApiService } from '../../../src/api/n8n-client';
import { N8nApiClient } from '../../../src/api/client';
import { EnvConfig } from '../../../src/config/environment';
import { createMockN8nApiClient } from '../../mocks/n8n-api-client-mock.js';

// Mock N8nApiClient
jest.mock('../../../src/api/client');

describe('Workflow Run Client Operations', () => {
  // Mock configuration
  const mockConfig: EnvConfig = {
    n8nApiUrl: 'https://n8n.example.com/api/v1',
    n8nApiKey: 'test-api-key',
    n8nWebhookUsername: 'webhook-user',
    n8nWebhookPassword: 'webhook-password',
    debug: false
  };
  
  // Test objects
  let apiService: N8nApiService;
  let mockApiClient: any;
  
  beforeEach(() => {
    // Reset mocks and create fresh instances
    jest.clearAllMocks();
    
    // Create a mock API client with our standardized mock
    mockApiClient = createMockN8nApiClient();
    (N8nApiClient as jest.Mock).mockImplementation(() => mockApiClient);
    
    // Create a new instance of the API service for each test
    apiService = new N8nApiService(mockConfig);
  });
  
  // Test workflow run operations
  describe('workflow run operations', () => {
    describe('runWorkflow', () => {
      it('should run a workflow by ID with provided data', async () => {
        // Setup
        const workflowId = 'test-workflow-1';
        const runData = { inputData: { field1: 'value1' } };
        const mockResponse = { executionId: 'exec-123', status: 'running' };
        
        mockApiClient.getAxiosInstance().post.mockResolvedValueOnce({
          data: mockResponse
        });
        
        // Execute
        const result = await apiService.runWorkflow(workflowId, runData);
        
        // Assert
        expect(result).toEqual(mockResponse);
        expect(mockApiClient.getAxiosInstance().post).toHaveBeenCalledWith(`/workflows/${workflowId}/run`, runData);
      });
      
      it('should run a workflow by ID without data', async () => {
        // Setup
        const workflowId = 'test-workflow-1';
        const mockResponse = { executionId: 'exec-123', status: 'running' };
        
        mockApiClient.getAxiosInstance().post.mockResolvedValueOnce({
          data: mockResponse
        });
        
        // Execute
        const result = await apiService.runWorkflow(workflowId);
        
        // Assert
        expect(result).toEqual(mockResponse);
        expect(mockApiClient.getAxiosInstance().post).toHaveBeenCalledWith(`/workflows/${workflowId}/run`, {});
      });
      
      it('should handle errors when running a workflow', async () => {
        // Setup
        const workflowId = 'nonexistent-workflow';
        const errorResponse = new Error('Workflow not found');
        
        mockApiClient.getAxiosInstance().post.mockRejectedValueOnce(errorResponse);
        
        // Execute & Assert
        await expect(apiService.runWorkflow(workflowId)).rejects.toThrow();
      });
    });
    
    describe('getWorkflowRunStatus', () => {
      it('should get the status of a workflow execution', async () => {
        // Setup
        const executionId = 'exec-123';
        const mockResponse = { id: executionId, status: 'completed', data: { result: [{ json: { success: true } }] } };
        
        mockApiClient.getAxiosInstance().get.mockResolvedValueOnce({
          data: mockResponse
        });
        
        // Execute
        const result = await apiService.getWorkflowRunStatus(executionId);
        
        // Assert
        expect(result).toEqual(mockResponse);
        expect(mockApiClient.getAxiosInstance().get).toHaveBeenCalledWith(`/executions/${executionId}`);
      });
      
      it('should handle errors when getting execution status', async () => {
        // Setup
        const executionId = 'nonexistent-execution';
        const errorResponse = new Error('Execution not found');
        
        mockApiClient.getAxiosInstance().get.mockRejectedValueOnce(errorResponse);
        
        // Execute & Assert
        await expect(apiService.getWorkflowRunStatus(executionId)).rejects.toThrow();
      });
    });
    
    describe('cancelWorkflowRun', () => {
      it('should cancel a running workflow execution', async () => {
        // Setup
        const executionId = 'exec-123';
        const mockResponse = { success: true };
        
        mockApiClient.getAxiosInstance().post.mockResolvedValueOnce({
          data: mockResponse
        });
        
        // Execute
        const result = await apiService.cancelWorkflowRun(executionId);
        
        // Assert
        expect(result).toEqual(mockResponse);
        expect(mockApiClient.getAxiosInstance().post).toHaveBeenCalledWith(`/executions/${executionId}/cancel`, {});
      });
      
      it('should handle errors when canceling a workflow', async () => {
        // Setup
        const executionId = 'nonexistent-execution';
        const errorResponse = new Error('Execution not found');
        
        mockApiClient.getAxiosInstance().post.mockRejectedValueOnce(errorResponse);
        
        // Execute & Assert
        await expect(apiService.cancelWorkflowRun(executionId)).rejects.toThrow();
      });
    });
  });
});
