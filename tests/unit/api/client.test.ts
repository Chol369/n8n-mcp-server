/**
 * Test Script for Base API Client
 * 
 * This script tests the core N8nApiClient class that handles the low-level HTTP 
 * communication with the n8n API.
 */

import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import axios from 'axios';
import { N8nApiClient } from '../../../src/api/client';
import { EnvConfig } from '../../../src/config/environment';
import { N8nApiError } from '../../../src/errors';

// Mock axios
jest.mock('axios');

describe('N8nApiClient', () => {
  // Mock configuration
  const mockConfig: EnvConfig = {
    n8nApiUrl: 'https://n8n.example.com/api/v1',
    n8nApiKey: 'test-api-key',
    n8nWebhookUsername: 'webhook-user',
    n8nWebhookPassword: 'webhook-password',
    debug: false
  };
  
  // Test objects
  let mockAxiosInstance: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock axios instance with basic methods
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    };
    
    // Setup axios mock
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
  });
  
  describe('constructor', () => {
    it('should create an axios instance with correct config', () => {
      // Execute
      new N8nApiClient(mockConfig);
      
      // Assert
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: mockConfig.n8nApiUrl,
        headers: {
          'X-N8N-API-KEY': mockConfig.n8nApiKey,
          'Accept': 'application/json',
        },
        timeout: 10000,
      });
    });
    
    it('should set up debug interceptors when debug is true', () => {
      // Setup
      const debugConfig = { ...mockConfig, debug: true };
      
      // Execute
      new N8nApiClient(debugConfig);
      
      // Assert
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
    
    it('should not set up debug interceptors when debug is false', () => {
      // Execute
      new N8nApiClient(mockConfig);
      
      // Assert
      expect(mockAxiosInstance.interceptors.request.use).not.toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).not.toHaveBeenCalled();
    });
  });
  
  describe('checkConnectivity', () => {
    it('should return true on successful connectivity check', async () => {
      // Setup
      const client = new N8nApiClient(mockConfig);
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: { success: true },
      });
      
      // Execute & Assert
      await expect(client.checkConnectivity()).resolves.not.toThrow();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/workflows');
    });
    
    it('should throw error on failed connection', async () => {
      // Setup
      const client = new N8nApiClient(mockConfig);
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Connection failed'));
      
      // Execute & Assert
      await expect(client.checkConnectivity()).rejects.toThrow(N8nApiError);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/workflows');
    });
  });
  
  // Testing workflow operations
  // Testing error handling
  describe('error handling', () => {
    it('should handle API errors properly', async () => {
      // Setup
      const client = new N8nApiClient(mockConfig);
      const workflowId = '999';
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'Workflow not found' },
        },
      };
      
      // Mock the axios get method to reject with our error
      mockAxiosInstance.get.mockRejectedValueOnce(errorResponse);
      
      // Execute and Assert - test through client method not direct axios call
      // This will use the client's error handling wrapper
      await expect(client.getWorkflow(workflowId)).rejects.toThrow();
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/workflows/${workflowId}`);
    });
  });
  
  describe('getWorkflows', () => {
    it('should get workflows', async () => {
      // Setup
      const client = new N8nApiClient(mockConfig);
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: { data: [] },
      });
      
      // Execute
      await client.getWorkflows();
      
      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/workflows');
    });
  });
  
  describe('getWorkflow', () => {
    it('should get a single workflow', async () => {
      // Setup
      const client = new N8nApiClient(mockConfig);
      const workflowId = 'test-workflow-1';
      const mockWorkflow = { id: workflowId, name: 'Test Workflow' };
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: mockWorkflow,
      });
      
      // Execute
      const result = await client.getWorkflow(workflowId);
      
      // Assert
      expect(result).toEqual(mockWorkflow);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/workflows/${workflowId}`);
    });
  });
  
  describe('createWorkflow', () => {
    it('should create a workflow successfully', async () => {
      // Setup
      const client = new N8nApiClient(mockConfig);
      const newWorkflow = {
        name: 'New Test Workflow',
        nodes: [],
        connections: {},
      };
      const mockResponse = { id: '1', name: 'New Test Workflow' };
      
      mockAxiosInstance.post.mockResolvedValueOnce({
        status: 200,
        data: mockResponse,
      });
      
      // Execute
      const result = await client.createWorkflow(newWorkflow);
      
      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/workflows', newWorkflow);
    });
  });
  
  describe('getExecutions', () => {
    it('should return executions array on success', async () => {
      // Setup
      const client = new N8nApiClient(mockConfig);
      const mockExecutions = { data: [{ id: '1', workflowId: 'w1' }] };
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: mockExecutions,
      });
      
      // Execute
      const result = await client.getExecutions();
      
      // Assert
      expect(result).toEqual(mockExecutions.data);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/executions');
    });
    
    it('should get executions', async () => {
      // Setup
      const client = new N8nApiClient(mockConfig);
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: { data: [] },
      });
      
      // Execute
      await client.getExecutions();
      
      // Assert
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/executions');
    });
  });
  
  describe('getExecution', () => {
    it('should get a single execution', async () => {
      // Setup
      const client = new N8nApiClient(mockConfig);
      const executionId = 'test-execution-1';
      const mockResponse = { id: executionId, workflowId: 'w1', finished: true };
      
      mockAxiosInstance.get.mockResolvedValueOnce({
        status: 200,
        data: mockResponse,
      });
      
      // Execute
      const result = await client.getExecution(executionId);
      
      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(`/executions/${executionId}`);
    });
  });
  
  describe('deleteExecution', () => {
    it('should delete an execution', async () => {
      // Setup
      const client = new N8nApiClient(mockConfig);
      const executionId = 'test-execution-1';
      const mockResponse = { success: true };
      
      mockAxiosInstance.delete.mockResolvedValueOnce({
        status: 200,
        data: mockResponse,
      });
      
      // Execute
      const result = await client.deleteExecution(executionId);
      
      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/executions/${executionId}`);
    });
  });
  

});
