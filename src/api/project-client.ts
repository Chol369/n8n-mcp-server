/**
 * Project Management API Client
 * 
 * This module provides client methods for interacting with n8n's project management endpoints.
 * According to the official n8n API, only the following operations are supported:
 * - project:list
 * - project:create
 * - project:update
 * - project:delete
 */

import { AxiosInstance } from 'axios';
import { N8nApiClient } from './client.js';
import { handleAxiosError } from '../errors/index.js';
import { 
  Project, 
  ProjectStatus, 
  ProjectCreateParams, 
  ProjectUpdateParams
} from '../types/project.js';

/**
 * Project API client class
 */
export class ProjectClient {
  private client: AxiosInstance;

  /**
   * Creates a new instance of the ProjectClient
   * 
   * @param apiClient The N8nApiClient instance
   */
  constructor(private apiClient: N8nApiClient) {
    this.client = apiClient.getAxiosInstance();
  }

  /**
   * List all projects
   * 
   * @param status Optional status to filter by
   * @param ownerId Optional owner ID to filter by
   * @param limit Optional limit of results to return
   * @param offset Optional offset for pagination
   * @returns List of projects
   */
  async listProjects(
    status?: ProjectStatus,
    ownerId?: string,
    limit?: number,
    offset?: number
  ): Promise<Project[]> {
    try {
      const params: Record<string, any> = {};
      
      if (status) {
        params.status = status;
      }
      
      if (ownerId) {
        params.ownerId = ownerId;
      }
      
      if (limit) {
        params.limit = limit;
      }
      
      if (offset) {
        params.offset = offset;
      }
      
      const response = await this.client.get('/projects', { params });
      return response.data.data || [];
    } catch (error) {
      // If this is a 403 error related to licensing, return an empty array
      // instead of throwing an error to make the client more robust
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 
          'status' in error.response && error.response.status === 403 && 
          'data' in error.response && error.response.data && 
          typeof error.response.data === 'object' && 
          'message' in error.response.data && 
          typeof error.response.data.message === 'string' && 
          error.response.data.message.includes('license')) {
        console.warn('Project operations limited by license: ' + 
          (error.response.data.message || 'License restriction'));
        return [];
      }
      
      console.error('Error getting projects:', error);
      throw handleAxiosError(error, 'Failed to get projects');
    }
  }



  /**
   * Create a new project
   * 
   * @param params Project creation parameters
   * @returns Created project
   */
  async createProject(params: ProjectCreateParams): Promise<Project> {
    try {
      // According to n8n OpenAPI spec, projects only support 'name' property for creation
      // Properties like 'description', 'status', 'metadata' are not supported
      const allowedParams: { name: string } = {
        name: params.name
      };
      
      const response = await this.client.post('/projects', allowedParams);
      return response.data;
    } catch (error) {
      // Handle license limitation error gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 
          'status' in error.response && error.response.status === 403 && 
          'data' in error.response && error.response.data && 
          typeof error.response.data === 'object' && 
          'message' in error.response.data && 
          typeof error.response.data.message === 'string' && 
          error.response.data.message.includes('license')) {
        console.warn('Project creation limited by license: ' + 
          (error.response.data.message || 'License restriction'));
        throw new Error('Project creation not available in current license tier');
      }
      
      // Handle validation errors gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' &&
          'status' in error.response && error.response.status === 400 &&
          'data' in error.response && error.response.data &&
          typeof error.response.data === 'object' &&
          'message' in error.response.data &&
          typeof error.response.data.message === 'string') {
        console.warn('Project creation validation error:', error.response.data.message);
        throw new Error(`Project creation failed due to validation: ${error.response.data.message}`);
      }
      
      console.error('Error creating project:', error);
      throw handleAxiosError(error, 'Failed to create project');
    }
  }

  /**
   * Update a project
   * 
   * @param id Project ID
   * @param params Project update parameters
   * @returns Updated project
   */
  async updateProject(id: string, params: ProjectUpdateParams): Promise<Project> {
    try {
      const response = await this.client.patch(`/projects/${id}`, params);
      return response.data;
    } catch (error) {
      // Handle license limitation error gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 
          'status' in error.response && error.response.status === 403 && 
          'data' in error.response && error.response.data && 
          typeof error.response.data === 'object' && 
          'message' in error.response.data && 
          typeof error.response.data.message === 'string' && 
          error.response.data.message.includes('license')) {
        console.warn('Project update limited by license: ' + 
          (error.response.data.message || 'License restriction'));
        throw new Error('Project update not available in current license tier');
      }
      
      console.error(`Error updating project ${id}:`, error);
      throw handleAxiosError(error, `Failed to update project ${id}`);
    }
  }

  /**
   * Delete a project
   * 
   * @param id Project ID
   * @param force Whether to force delete the project and all its resources
   * @returns Success message
   */
  async deleteProject(id: string, force = false): Promise<{ success: boolean }> {
    try {
      const params: Record<string, any> = {};
      
      if (force) {
        params.force = true;
      }
      
      await this.client.delete(`/projects/${id}`, { params });
      return { success: true };
    } catch (error) {
      // Handle license limitation error gracefully
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 
          'status' in error.response && error.response.status === 403 && 
          'data' in error.response && error.response.data && 
          typeof error.response.data === 'object' && 
          'message' in error.response.data && 
          typeof error.response.data.message === 'string' && 
          error.response.data.message.includes('license')) {
        console.warn('Project deletion limited by license: ' + 
          (error.response.data.message || 'License restriction'));
        throw new Error('Project deletion not available in current license tier');
      }
      
      console.error(`Error deleting project ${id}:`, error);
      throw handleAxiosError(error, `Failed to delete project ${id}`);
    }
  }


}

/**
 * Create a new ProjectClient instance
 * 
 * @param apiClient The N8nApiClient instance
 * @returns ProjectClient instance
 */
export function createProjectClient(apiClient: N8nApiClient): ProjectClient {
  return new ProjectClient(apiClient);
}
