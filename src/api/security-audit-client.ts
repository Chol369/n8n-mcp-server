/**
 * Security Audit API Client
 * 
 * This module provides client methods for interacting with n8n's security audit endpoints.
 */

import { AxiosInstance } from 'axios';
import { N8nApiClient } from './client.js';
import { handleAxiosError } from '../errors/index.js';
import { SecurityAuditResult } from '../types/security-audit.js';

/**
 * Security Audit API client class
 */
export class SecurityAuditClient {
  private client: AxiosInstance;

  /**
   * Creates a new instance of the SecurityAuditClient
   * 
   * @param apiClient The N8nApiClient instance
   */
  constructor(private apiClient: N8nApiClient) {
    this.client = apiClient.getAxiosInstance();
  }

  /**
   * Generate a security audit
   * 
   * @param workflowIds Optional array of workflow IDs to audit
   * @returns Security audit result
   */
  async generateAudit(workflowIds?: string[]): Promise<SecurityAuditResult> {
    try {
      const params: Record<string, any> = {};
      
      if (workflowIds && workflowIds.length > 0) {
        params.workflowIds = workflowIds.join(',');
      }
      
      const response = await this.client.post('/security/audit/generate', null, { params });
      return response.data as SecurityAuditResult;
    } catch (error) {
      console.error('Error generating security audit:', error);
      throw handleAxiosError(error, 'Failed to generate security audit');
    }
  }
}

/**
 * Create a new SecurityAuditClient instance
 * 
 * @param apiClient The N8nApiClient instance
 * @returns SecurityAuditClient instance
 */
export function createSecurityAuditClient(apiClient: N8nApiClient): SecurityAuditClient {
  return new SecurityAuditClient(apiClient);
}
