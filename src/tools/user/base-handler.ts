/**
 * Base User Tool Handler
 * 
 * This module provides a base handler for user-related tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { createApiService } from '../../api/n8n-client.js';
import { getEnvConfig } from '../../config/environment.js';
import { createUserClient } from '../../api/user-client.js';
import { UserClient } from '../../api/user-client.js';
import { N8nApiService } from '../../api/n8n-client.js';

/**
 * Base class for user tool handlers
 */
export abstract class BaseUserToolHandler {
  protected apiService: N8nApiService;
  protected userClient: UserClient;
  
  /**
   * Create a new base user tool handler
   */
  constructor() {
    this.apiService = createApiService(getEnvConfig());
    this.userClient = createUserClient(this.apiService.getClient());
  }
  
  /**
   * Validate and execute the tool
   * 
   * @param args Arguments passed to the tool
   * @returns Tool call result
   */
  abstract execute(args: Record<string, any>): Promise<ToolCallResult>;
  
  /**
   * Format a successful response
   * 
   * @param data Response data
   * @param message Optional success message
   * @returns Formatted success response
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
   * @returns Formatted error response
   */
  protected formatError(error: Error | string): ToolCallResult {
    const errorMessage = error instanceof Error ? error.message : error;
    
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
   * Handle tool execution errors
   * 
   * @param handler Function to execute
   * @param args Arguments to pass to the handler
   * @returns Tool call result
   */
  protected async handleExecution(
    executionFn: () => Promise<ToolCallResult>,
    _args: Record<string, any> // Unused but kept for consistency with other handlers
  ): Promise<ToolCallResult> {
    try {
      return await executionFn();
    } catch (error) {
      if (error instanceof N8nApiError) {
        return this.formatError(error.toString());
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
        
      return this.formatError(`Error executing user tool: ${errorMessage}`);
    }
  }
}
