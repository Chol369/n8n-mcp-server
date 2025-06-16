/**
 * Workflow Management API Client
 * 
 * This module provides client methods for interacting with n8n's workflow management endpoints.
 * According to the official n8n API, the following operations are supported:
 * - workflow:list
 * - workflow:read
 * - workflow:create
 * - workflow:update
 * - workflow:delete
 * - workflow:move
 * - workflow:activate
 * - workflow:deactivate
 */

import { AxiosInstance } from 'axios';
import { N8nApiClient } from './client.js';
import { handleAxiosError } from '../errors/index.js';
import { Workflow } from '../types/index.js';

/**
 * Workflow API client class
 */
export class WorkflowClient {
  private client: AxiosInstance;

  /**
   * Creates a new instance of the WorkflowClient
   * 
   * @param apiClient The N8nApiClient instance
   */
  constructor(private apiClient: N8nApiClient) {
    this.client = apiClient.getAxiosInstance();
  }

  /**
   * List all workflows
   * 
   * @param tagId Optional tag ID to filter by
   * @param search Optional search term
   * @param limit Optional limit of results to return
   * @param offset Optional offset for pagination
   * @returns List of workflows
   */
  async listWorkflows(
    tagId?: string,
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<Workflow[]> {
    try {
      const params: Record<string, any> = {};
      
      if (tagId) {
        params.tags = tagId;
      }
      
      if (search) {
        params.search = search;
      }
      
      if (limit) {
        params.limit = limit;
      }
      
      if (offset) {
        params.offset = offset;
      }
      
      const response = await this.client.get('/workflows', { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Error listing workflows:', error);
      throw handleAxiosError(error, 'Failed to list workflows');
    }
  }

  /**
   * Read a specific workflow by ID
   * 
   * @param id Workflow ID
   * @returns Workflow object
   */
  async readWorkflow(id: string): Promise<Workflow> {
    try {
      const response = await this.client.get(`/workflows/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error reading workflow ${id}:`, error);
      throw handleAxiosError(error, `Failed to read workflow ${id}`);
    }
  }

  /**
   * Create a new workflow
   * 
   * @param workflow Workflow object to create
   * @returns Created workflow
   */
  async createWorkflow(workflow: Record<string, any>): Promise<Workflow> {
    try {
      // Make sure settings property is present
      if (!workflow.settings) {
        workflow.settings = {
          saveExecutionProgress: true,
          saveManualExecutions: true,
          saveDataErrorExecution: 'all',
          saveDataSuccessExecution: 'all',
          executionTimeout: 3600,
          timezone: 'UTC'
        };
      }
      
      // Remove read-only properties that cause issues
      const workflowToCreate = { ...workflow };
      delete workflowToCreate.active; // Remove active property as it's read-only
      delete workflowToCreate.id; // Remove id property if it exists
      delete workflowToCreate.createdAt; // Remove createdAt property if it exists
      delete workflowToCreate.updatedAt; // Remove updatedAt property if it exists
      delete workflowToCreate.tags; // Remove tags property as it's read-only
      
      const response = await this.client.post('/workflows', workflowToCreate);
      return response.data;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw handleAxiosError(error, 'Failed to create workflow');
    }
  }

  /**
   * Update an existing workflow
   * 
   * @param id Workflow ID
   * @param workflow Updated workflow object
   * @returns Updated workflow
   */
  async updateWorkflow(id: string, workflow: Record<string, any>): Promise<Workflow> {
    try {
      // First, get the current workflow to ensure we have all required fields
      const currentWorkflow = await this.readWorkflow(id);
      
      // Filter settings to only include API-allowed properties
      // Based on n8n API docs, these are the allowed settings properties
      const filterSettings = (settings: any) => {
        if (!settings || typeof settings !== 'object') return {};
        
        const allowedSettingsKeys = [
          'executionOrder',
          'saveExecutionProgress', 
          'saveManualExecutions',
          'saveDataErrorExecution',
          'saveDataSuccessExecution',
          'executionTimeout',
          'timezone'
        ];
        
        const filtered: any = {};
        for (const key of allowedSettingsKeys) {
          if (settings[key] !== undefined) {
            filtered[key] = settings[key];
          }
        }
        return filtered;
      };
      
      // Create update object with all required fields
      // According to n8n OpenAPI spec, name, nodes, connections, and settings are required
      const updateData: Record<string, any> = {
        name: workflow.name !== undefined ? workflow.name : currentWorkflow.name,
        nodes: workflow.nodes !== undefined ? workflow.nodes : currentWorkflow.nodes,
        connections: workflow.connections !== undefined ? workflow.connections : currentWorkflow.connections,
        settings: workflow.settings !== undefined ? 
          filterSettings(workflow.settings) : 
          filterSettings(currentWorkflow.settings)
      };
      
      // Add optional fields if provided
      if (workflow.active !== undefined) updateData.active = workflow.active;
      
      // Send complete workflow structure to satisfy API requirements
      const response = await this.client.put(`/workflows/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating workflow ${id}:`, error);
      throw handleAxiosError(error, `Failed to update workflow ${id}`);
    }
  }

  /**
   * Delete a workflow
   * 
   * @param id Workflow ID
   * @returns Deleted workflow or success message
   */
  async deleteWorkflow(id: string): Promise<any> {
    try {
      const response = await this.client.delete(`/workflows/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting workflow ${id}:`, error);
      throw handleAxiosError(error, `Failed to delete workflow ${id}`);
    }
  }

  /**
   * Transfer workflow to a different project (Enterprise feature)
   * 
   * @param id Workflow ID
   * @param destinationProjectId ID of the destination project
   * @returns Transfer result
   */
  async transferWorkflowToProject(id: string, destinationProjectId: string): Promise<any> {
    try {
      const response = await this.client.put(`/workflows/${id}/transfer`, { 
        destinationProjectId 
      });
      return response.data;
    } catch (error) {
      console.error(`Error transferring workflow ${id} to project ${destinationProjectId}:`, error);
      throw handleAxiosError(error, `Failed to transfer workflow ${id} to project ${destinationProjectId}`);
    }
  }

  /**
   * Activate a workflow
   * 
   * @param id Workflow ID
   * @returns Activated workflow
   */
  async activateWorkflow(id: string): Promise<Workflow> {
    try {
      const response = await this.client.post(`/workflows/${id}/activate`);
      return response.data;
    } catch (error) {
      console.error(`Error activating workflow ${id}:`, error);
      throw handleAxiosError(error, `Failed to activate workflow ${id}`);
    }
  }

  /**
   * Deactivate a workflow
   * 
   * @param id Workflow ID
   * @returns Deactivated workflow
   */
  async deactivateWorkflow(id: string): Promise<Workflow> {
    try {
      const response = await this.client.post(`/workflows/${id}/deactivate`);
      return response.data;
    } catch (error) {
      console.error(`Error deactivating workflow ${id}:`, error);
      throw handleAxiosError(error, `Failed to deactivate workflow ${id}`);
    }
  }

}

/**
 * Create a new WorkflowClient instance
 * 
 * @param apiClient The N8nApiClient instance
 * @returns WorkflowClient instance
 */
export function createWorkflowClient(apiClient: N8nApiClient): WorkflowClient {
  return new WorkflowClient(apiClient);
}
