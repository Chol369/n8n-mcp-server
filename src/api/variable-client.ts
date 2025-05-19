/**
 * Variable Management API Client
 * 
 * This module provides client methods for interacting with n8n's variable management endpoints.
 * According to the official n8n API, only the following operations are supported:
 * - variable:list
 * - variable:create
 * - variable:delete
 */

import { AxiosInstance } from 'axios';
import { N8nApiClient } from './client.js';
import { handleAxiosError } from '../errors/index.js';
import { 
  Variable, 
  VariableType, 
  VariableCreateParams
} from '../types/variable.js';

/**
 * Variable API client class
 */
export class VariableClient {
  private client: AxiosInstance;

  /**
   * Creates a new instance of the VariableClient
   * 
   * @param apiClient The N8nApiClient instance
   */
  constructor(private apiClient: N8nApiClient) {
    this.client = apiClient.getAxiosInstance();
  }

  /**
   * List all variables
   * 
   * @param projectId Optional project ID to filter by
   * @param type Optional variable type to filter by
   * @param includeSystem Whether to include system variables
   * @param includeValues Whether to include variable values in the response
   * @param limit Optional limit of results to return
   * @param offset Optional offset for pagination
   * @returns List of variables
   */
  async listVariables(
    projectId?: string,
    type?: VariableType,
    includeSystem?: boolean,
    includeValues?: boolean,
    limit?: number,
    offset?: number
  ): Promise<Variable[]> {
    try {
      const params: Record<string, any> = {};
      
      if (projectId) {
        params.projectId = projectId;
      }
      
      if (type) {
        params.type = type;
      }
      
      if (includeSystem !== undefined) {
        params.includeSystem = includeSystem;
      }
      
      if (includeValues !== undefined) {
        params.includeValues = includeValues;
      }
      
      if (limit) {
        params.limit = limit;
      }
      
      if (offset) {
        params.offset = offset;
      }
      
      const response = await this.client.get('/variables', { params });
      return response.data.data || [];
    } catch (error) {
      // Handle license limitations gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 
          'status' in error.response && error.response.status === 403) {
        console.warn('Variable operations limited by license or permissions');
        return [];
      }
      
      console.error('Error getting variables:', error);
      throw handleAxiosError(error, 'Failed to get variables');
    }
  }



  /**
   * Create a new variable
   * 
   * @param params Variable creation parameters
   * @returns Created variable
   */
  async createVariable(params: VariableCreateParams): Promise<Variable> {
    try {
      // The n8n API doesn't allow setting the type directly
      // Let's create a sanitized copy without the 'type' field
      const sanitizedParams = { ...params };
      
      // Remove the 'type' field if it exists
      if ('type' in sanitizedParams) {
        console.warn('Variable type is read-only in n8n API, removing from request');
        delete sanitizedParams.type;
      }
      
      const response = await this.client.post('/variables', sanitizedParams);
      return response.data;
    } catch (error) {
      // Handle license limitations gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object') {
        
        // Handle 400 errors related to type being read-only
        if ('status' in error.response && error.response.status === 400 &&
            'data' in error.response && error.response.data &&
            typeof error.response.data === 'object' &&
            'message' in error.response.data &&
            typeof error.response.data.message === 'string' &&
            error.response.data.message.includes('type is read-only')) {
          console.warn('Variable type is read-only:', error.response.data.message);
          throw new Error('Variable type cannot be set via the API');
        }
        
        // Handle license limitations
        if ('status' in error.response && error.response.status === 403) {
          console.warn('Variable creation limited by license or permissions');
          throw new Error('Variable creation not available in current license or permission level');
        }
      }
      
      console.error('Error creating variable:', error);
      throw handleAxiosError(error, 'Failed to create variable');
    }
  }



  /**
   * Delete a variable by ID
   * 
   * @param id Variable ID
   * @returns Success message
   */
  async deleteVariableById(id: string): Promise<{ success: boolean }> {
    try {
      await this.client.delete(`/variables/${id}`);
      return { success: true };
    } catch (error) {
      // Handle license limitations gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 
          'status' in error.response && error.response.status === 403) {
        console.warn('Variable deletion limited by license or permissions');
        throw new Error('Variable deletion not available in current license or permission level');
      }
      
      console.error(`Error deleting variable ${id}:`, error);
      throw handleAxiosError(error, `Failed to delete variable ${id}`);
    }
  }


}

/**
 * Create a new VariableClient instance
 * 
 * @param apiClient The N8nApiClient instance
 * @returns VariableClient instance
 */
export function createVariableClient(apiClient: N8nApiClient): VariableClient {
  return new VariableClient(apiClient);
}
