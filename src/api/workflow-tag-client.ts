/**
 * Workflow Tags Management API Client
 * 
 * This module provides client methods for interacting with n8n's workflow tags endpoints.
 * According to the official n8n API, only the following operations are supported:
 * - workflowTags:list
 * - workflowTags:update
 */

import { AxiosInstance } from 'axios';
import { N8nApiClient } from './client.js';
import { handleAxiosError } from '../errors/index.js';
import { Tag } from '../types/tag.js';

/**
 * Workflow Tags API client class
 */
export class WorkflowTagClient {
  private client: AxiosInstance;

  /**
   * Creates a new instance of the WorkflowTagClient
   * 
   * @param apiClient The N8nApiClient instance
   */
  constructor(private apiClient: N8nApiClient) {
    this.client = apiClient.getAxiosInstance();
  }

  /**
   * List all tags for a specific workflow
   * 
   * @param workflowId Workflow ID to get tags for
   * @returns List of tags assigned to the workflow
   */
  async listWorkflowTags(workflowId: string): Promise<Tag[]> {
    try {
      const response = await this.client.get(`/workflows/${workflowId}/tags`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error getting tags for workflow ${workflowId}:`, error);
      throw handleAxiosError(error, `Failed to get tags for workflow ${workflowId}`);
    }
  }

  /**
   * Update tags for a specific workflow
   * 
   * @param workflowId Workflow ID to update tags for
   * @param tagIds Array of tag IDs to assign to the workflow
   * @returns Updated list of tags assigned to the workflow
   */
  async updateWorkflowTags(workflowId: string, tagIds: string[]): Promise<Tag[]> {
    try {
      // According to n8n OpenAPI spec, the API expects an array of objects with 'id' property
      // Format: [{ id: "tagId1" }, { id: "tagId2" }]
      const formattedTagIds = tagIds.map(tagId => ({ id: tagId }));
      
      const response = await this.client.put(`/workflows/${workflowId}/tags`, formattedTagIds);
      return response.data.data || [];
    } catch (error) {
      // Handle validation errors gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' &&
          'status' in error.response && error.response.status === 400 &&
          'data' in error.response && error.response.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data &&
          typeof error.response.data.message === 'string') {
        console.warn(`Workflow tags update validation error for workflow ${workflowId}:`, error.response.data.message);
        throw new Error(`Workflow tags update failed due to validation: ${error.response.data.message}`);
      }
      
      console.error(`Error updating tags for workflow ${workflowId}:`, error);
      throw handleAxiosError(error, `Failed to update tags for workflow ${workflowId}`);
    }
  }
}

/**
 * Create a new WorkflowTagClient instance
 * 
 * @param apiClient The N8nApiClient instance
 * @returns WorkflowTagClient instance
 */
export function createWorkflowTagClient(apiClient: N8nApiClient): WorkflowTagClient {
  return new WorkflowTagClient(apiClient);
}
