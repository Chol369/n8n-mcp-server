/**
 * Tag Management API Client
 * 
 * This module provides client methods for interacting with n8n's tag management endpoints.
 * According to the official n8n API, only the following operations are supported:
 * - tag:list
 * - tag:read
 * - tag:create
 * - tag:update
 * - tag:delete
 */

import { AxiosInstance } from 'axios';
import { N8nApiClient } from './client.js';
import { handleAxiosError } from '../errors/index.js';
import { 
  Tag, 
  TagCreateParams, 
  TagUpdateParams
} from '../types/tag.js';
import { Workflow } from '../types/index.js';

/**
 * Tag API client class
 */
export class TagClient {
  private client: AxiosInstance;

  /**
   * Creates a new instance of the TagClient
   * 
   * @param apiClient The N8nApiClient instance
   */
  constructor(private apiClient: N8nApiClient) {
    this.client = apiClient.getAxiosInstance();
  }

  /**
   * List all tags
   * 
   * @param search Optional search term to filter tags
   * @param limit Optional limit of results to return
   * @param offset Optional offset for pagination
   * @returns List of tags
   */
  async listTags(
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<Tag[]> {
    try {
      const params: Record<string, any> = {};
      
      if (search) {
        params.search = search;
      }
      
      if (limit) {
        params.limit = limit;
      }
      
      if (offset) {
        params.offset = offset;
      }
      
      const response = await this.client.get('/tags', { params });
      return response.data.data || [];
    } catch (error) {
      console.error('Error getting tags:', error);
      throw handleAxiosError(error, 'Failed to get tags');
    }
  }

  /**
   * Read a specific tag by ID
   * 
   * @param id Tag ID
   * @returns Tag details
   */
  async readTag(id: string): Promise<Tag> {
    try {
      const response = await this.client.get(`/tags/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting tag ${id}:`, error);
      throw handleAxiosError(error, `Failed to get tag ${id}`);
    }
  }

  /**
   * Create a new tag
   * 
   * @param params Tag creation parameters
   * @returns Created tag
   */
  async createTag(params: TagCreateParams): Promise<Tag> {
    try {
      // The n8n API only accepts specific properties for tag creation
      // Create a sanitized version with only the accepted properties
      const sanitizedParams: { name: string; color?: string } = {
        name: params.name
      };
      
      // Add color only if it's provided and valid
      if (params.color && typeof params.color === 'string') {
        sanitizedParams.color = params.color;
      }
      
      const response = await this.client.post('/tags', sanitizedParams);
      return response.data;
    } catch (error) {
      // Handle validation errors gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' &&
          'status' in error.response && error.response.status === 400 &&
          'data' in error.response && error.response.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data &&
          typeof error.response.data.message === 'string') {
        console.warn('Tag creation validation error:', error.response.data.message);
        throw new Error(`Tag creation failed due to validation: ${error.response.data.message}`);
      }
      
      console.error('Error creating tag:', error);
      throw handleAxiosError(error, 'Failed to create tag');
    }
  }

  /**
   * Update a tag
   * 
   * @param id Tag ID
   * @param params Tag update parameters
   * @returns Updated tag
   */
  async updateTag(id: string, params: Partial<TagUpdateParams>): Promise<Tag> {
    try {
      // Use PUT instead of PATCH as the n8n API doesn't support PATCH for tag updates
      const response = await this.client.put(`/tags/${id}`, params);
      return response.data;
    } catch (error) {
      // Handle method not allowed error gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' &&
          'status' in error.response && error.response.status === 405) {
        console.warn(`Method not allowed for updating tag ${id}. The n8n API may not support tag updates.`);
        throw new Error(`Tag update operation not supported by the n8n API`);
      }
      
      // Handle conflict (tag already exists) error gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' &&
          'status' in error.response && error.response.status === 409 &&
          'data' in error.response && error.response.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data &&
          typeof error.response.data.message === 'string' &&
          error.response.data.message.includes('already exists')) {
        console.warn(`Tag update conflict for tag ${id}:`, error.response.data.message);
        throw new Error(`Tag update failed: ${error.response.data.message}`);
      }
      
      // Handle validation errors gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' &&
          'status' in error.response && error.response.status === 400 &&
          'data' in error.response && error.response.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data &&
          typeof error.response.data.message === 'string') {
        console.warn(`Tag update validation error for tag ${id}:`, error.response.data.message);
        throw new Error(`Tag update failed due to validation: ${error.response.data.message}`);
      }
      
      console.error(`Error updating tag ${id}:`, error);
      throw handleAxiosError(error, `Failed to update tag ${id}`);
    }
  }

  /**
   * Delete a tag
   * 
   * @param id Tag ID
   * @returns Success message
   */
  async deleteTag(id: string): Promise<{ success: boolean }> {
    try {
      await this.client.delete(`/tags/${id}`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting tag ${id}:`, error);
      throw handleAxiosError(error, `Failed to delete tag ${id}`);
    }
  }


}

/**
 * Create a new TagClient instance
 * 
 * @param apiClient The N8nApiClient instance
 * @returns TagClient instance
 */
export function createTagClient(apiClient: N8nApiClient): TagClient {
  return new TagClient(apiClient);
}
