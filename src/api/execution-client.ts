/**
 * Execution Management API Client
 * 
 * This module provides client methods for interacting with n8n's execution management endpoints.
 * According to the official n8n API, the following operations are supported:
 * - execution:read
 * - execution:list
 * - execution:delete
 */

import { AxiosInstance } from 'axios';
import { N8nApiClient } from './client.js';
import { handleAxiosError } from '../errors/index.js';
import { Execution } from '../types/index.js';

/**
 * Execution API client class
 */
export class ExecutionClient {
  private client: AxiosInstance;

  /**
   * Creates a new instance of the ExecutionClient
   * 
   * @param apiClient The N8nApiClient instance
   */
  constructor(private apiClient: N8nApiClient) {
    this.client = apiClient.getAxiosInstance();
  }

  /**
   * List workflow executions
   * 
   * @param workflowId Optional workflow ID to filter by
   * @param status Optional status to filter by
   * @param limit Optional limit of results to return
   * @param offset Optional offset for pagination
   * @returns List of executions
   */
  async listExecutions(
    workflowId?: string,
    status?: string,
    limit?: number,
    offset?: number
  ): Promise<Execution[]> {
    try {
      const params: Record<string, any> = {};
      
      if (workflowId) {
        params.workflowId = workflowId;
      }
      
      if (status) {
        params.status = status;
      }
      
      if (limit) {
        params.limit = limit;
      }
      
      if (offset) {
        params.offset = offset;
      }
      
      const response = await this.client.get('/executions', { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Error listing executions:', error);
      throw handleAxiosError(error, 'Failed to list executions');
    }
  }

  /**
   * Read a specific execution by ID
   * 
   * @param id Execution ID
   * @returns Execution object
   */
  async readExecution(id: string): Promise<Execution> {
    try {
      const response = await this.client.get(`/executions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error reading execution ${id}:`, error);
      throw handleAxiosError(error, `Failed to read execution ${id}`);
    }
  }

  /**
   * Delete an execution
   * 
   * @param id Execution ID
   * @returns Deleted execution or success message
   */
  async deleteExecution(id: string): Promise<any> {
    try {
      const response = await this.client.delete(`/executions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting execution ${id}:`, error);
      throw handleAxiosError(error, `Failed to delete execution ${id}`);
    }
  }

  /**
   * Stop a running execution
   * 
   * @param id Execution ID
   * @returns Stop result
   */
  async stopExecution(id: string): Promise<any> {
    try {
      const response = await this.client.post(`/executions/${id}/stop`);
      return response.data;
    } catch (error) {
      console.error(`Error stopping execution ${id}:`, error);
      throw handleAxiosError(error, `Failed to stop execution ${id}`);
    }
  }
}

/**
 * Create a new ExecutionClient instance
 * 
 * @param apiClient The N8nApiClient instance
 * @returns ExecutionClient instance
 */
export function createExecutionClient(apiClient: N8nApiClient): ExecutionClient {
  return new ExecutionClient(apiClient);
}
