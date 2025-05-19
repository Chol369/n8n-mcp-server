/**
 * User API Client
 * 
 * This module provides a client for interacting with the n8n User API.
 */

import { N8nApiClient } from './client.js';
import { handleAxiosError } from '../errors/index.js';
import { 
  User, 
  CreateUserRequest, 
  ChangeUserRoleRequest 
} from '../types/user.js';

/**
 * User API client class
 */
export class UserClient {
  private client: N8nApiClient;
  
  /**
   * Create a new user API client
   * 
   * @param client The base n8n API client
   */
  constructor(client: N8nApiClient) {
    this.client = client;
  }
  
  /**
   * Get a user by ID
   * 
   * @param id User ID
   * @returns User object
   */
  async getUser(id: string): Promise<User> {
    try {
      const response = await this.client.getAxiosInstance().get(`/users/${id}`);
      
      // Properly extract the user data based on n8n API response format
      // Handle both formats: { data: User } and { data: { data: User } }
      const userData = response.data.data || response.data;
      return userData;
    } catch (error) {
      throw handleAxiosError(error, `Failed to get user ${id}`);
    }
  }
  
  /**
   * List all users
   * 
   * @returns Array of users
   */
  async listUsers(): Promise<User[]> {
    try {
      const response = await this.client.getAxiosInstance().get('/users');
      return response.data.data;
    } catch (error) {
      throw handleAxiosError(error, 'Failed to list users');
    }
  }
  
  /**
   * Create a new user
   * 
   * @param userData User data for creation
   * @returns Created user
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await this.client.getAxiosInstance().post('/users', userData);
      return response.data.data;
    } catch (error) {
      throw handleAxiosError(error, 'Failed to create user');
    }
  }
  
  /**
   * Change a user's role
   * 
   * @param id User ID
   * @param roleData Role data
   * @returns Updated user
   */
  async changeUserRole(id: string, roleData: ChangeUserRoleRequest): Promise<User> {
    try {
      const response = await this.client.getAxiosInstance().patch(`/users/${id}/role`, roleData);
      return response.data.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to change role for user ${id}`);
    }
  }
  
  /**
   * Delete a user
   * 
   * @param id User ID
   * @returns Success response
   */
  async deleteUser(id: string): Promise<any> {
    try {
      const response = await this.client.getAxiosInstance().delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to delete user ${id}`);
    }
  }
}

/**
 * Create a new user API client
 * 
 * @param client The base n8n API client
 * @returns User API client
 */
export function createUserClient(client: N8nApiClient): UserClient {
  return new UserClient(client);
}
