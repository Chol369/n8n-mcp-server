/**
 * Source Control API Client
 * 
 * This module provides a client for interacting with the n8n Source Control API.
 */

import { N8nApiClient } from './client.js';
import { handleAxiosError } from '../errors/index.js';
import { SourceControlPullResult } from '../types/source-control.js';

/**
 * Source Control API client class
 */
export class SourceControlClient {
  private client: N8nApiClient;
  
  /**
   * Create a new source control API client
   * 
   * @param client The base n8n API client
   */
  constructor(client: N8nApiClient) {
    this.client = client;
  }
  
  /**
   * Pull changes from the remote repository
   * 
   * @param force Whether to force pull (discard local changes)
   * @returns Pull operation result
   */
  async pullChanges(force = false): Promise<SourceControlPullResult> {
    try {
      const response = await this.client.getAxiosInstance().post('/source-control/pull', { force });
      return response.data;
    } catch (error) {
      throw handleAxiosError(error, 'Failed to pull changes from source control');
    }
  }
  

}

/**
 * Create a new source control API client
 * 
 * @param client The base n8n API client
 * @returns Source control API client
 */
export function createSourceControlClient(client: N8nApiClient): SourceControlClient {
  return new SourceControlClient(client);
}
