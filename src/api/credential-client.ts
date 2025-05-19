/**
 * Credential Management API Client
 * 
 * This module provides client methods for interacting with n8n's credential management endpoints.
 * According to the official n8n API, the following operations are supported:
 * - credential:create
 * - credential:move
 * - credential:delete
 */

import { AxiosInstance } from 'axios';
import { N8nApiClient } from './client.js';
import { handleAxiosError } from '../errors/index.js';

/**
 * Credential API client class
 */
export class CredentialClient {
  private client: AxiosInstance;

  /**
   * Creates a new instance of the CredentialClient
   * 
   * @param apiClient The N8nApiClient instance
   */
  constructor(private apiClient: N8nApiClient) {
    this.client = apiClient.getAxiosInstance();
  }

  // No credential type operations as they are not officially supported by the n8n API

  /**
   * Create a new credential
   * 
   * @param credential Credential object to create
   * @returns Created credential
   */
  async createCredential(credential: Record<string, any>): Promise<any> {
    try {
      const response = await this.client.post('/credentials', credential);
      return response.data;
    } catch (error) {
      console.error('Error creating credential:', error);
      throw handleAxiosError(error, 'Failed to create credential');
    }
  }

  /**
   * Move/share a credential with a user
   * 
   * @param id Credential ID
   * @param newOwnerId ID of the user to share with
   * @returns Updated credential or success message
   */
  async moveCredential(id: string, newOwnerId: string): Promise<any> {
    try {
      const response = await this.client.post(`/credentials/${id}/share`, { shareWithId: newOwnerId });
      return response.data;
    } catch (error) {
      console.error(`Error moving credential ${id}:`, error);
      throw handleAxiosError(error, `Failed to move credential ${id}`);
    }
  }

  /**
   * Delete a credential
   * 
   * @param id Credential ID
   * @returns Success message
   */
  async deleteCredential(id: string): Promise<any> {
    try {
      const response = await this.client.delete(`/credentials/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting credential ${id}:`, error);
      throw handleAxiosError(error, `Failed to delete credential ${id}`);
    }
  }
}

/**
 * Create a new CredentialClient instance
 * 
 * @param apiClient The N8nApiClient instance
 * @returns CredentialClient instance
 */
export function createCredentialClient(apiClient: N8nApiClient): CredentialClient {
  return new CredentialClient(apiClient);
}
