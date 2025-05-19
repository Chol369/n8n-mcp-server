/**
 * Base Security Audit Tool Handler
 * 
 * This module provides the base handler for security audit tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { McpError, ErrorCode } from '../../errors/index.js';
import { createSecurityAuditClient } from '../../api/security-audit-client.js';
import { SecurityAuditClient } from '../../api/security-audit-client.js';
import { N8nApiService, createApiService } from '../../api/n8n-client.js';
import { getEnvConfig } from '../../config/environment.js';

/**
 * Base handler for security audit tools
 */
export abstract class BaseSecurityAuditHandler {
  protected apiService: N8nApiService;
  protected securityAuditClient: SecurityAuditClient;

  /**
   * Creates a new instance of BaseSecurityAuditToolHandler
   */
  constructor() {
    this.apiService = createApiService(getEnvConfig());
    this.securityAuditClient = createSecurityAuditClient(this.apiService.getClient());
  }

  /**
   * Format a successful response
   * 
   * @param data Data to include in the response
   * @param message Optional message to include in the response
   * @returns Formatted tool call result
   */
  protected formatSuccess(data: any, message?: string): ToolCallResult {
    return {
      content: [
        {
          type: 'text',
          text: message || 'Operation completed successfully',
        },
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
      isError: false,
    };
  }

  /**
   * Format an error response
   * 
   * @param error Error object or message
   * @returns Formatted tool call result
   */
  protected formatError(error: Error | string): ToolCallResult {
    const errorMessage = typeof error === 'string' ? error : error.message;
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }

  /**
   * Execute the tool with error handling
   * 
   * @param fn Function to execute
   * @param args Tool arguments
   * @returns Tool call result
   */
  protected async handleExecution(
    fn: () => Promise<ToolCallResult>
  ): Promise<ToolCallResult> {
    try {
      return await fn();
    } catch (error) {
      console.error('Error executing security audit tool:', error);
      
      if (error instanceof McpError) {
        return this.formatError(error);
      }
      
      return this.formatError(
        error instanceof Error
          ? error
          : new McpError(
            ErrorCode.InternalError,
            'An unexpected error occurred during tool execution'
          )
      );
    }
  }

  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  abstract execute(args: Record<string, any>): Promise<ToolCallResult>;
}
