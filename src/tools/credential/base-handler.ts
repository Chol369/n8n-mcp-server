/**
 * Base Handler for Credential Tools
 * 
 * This module provides a base handler with common functionality for credential management tools.
 */

import { N8nApiService } from '../../api/n8n-client.js';
import { getEnvConfig } from '../../config/environment.js';
import { ToolCallResult } from '../../types/index.js';

/**
 * Base handler for credential management tools
 */
export abstract class BaseCredentialHandler {
  protected apiService: N8nApiService;

  constructor() {
    const config = getEnvConfig();
    this.apiService = new N8nApiService(config);
  }

  /**
   * Execute the credential tool with the provided arguments
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  public abstract execute(args: Record<string, any>): Promise<ToolCallResult>;

  /**
   * Format a success response
   * 
   * @param data Response data
   * @param message Success message
   * @returns Formatted tool call result
   */
  protected formatSuccess(data: any, message?: string): ToolCallResult {
    const result: ToolCallResult = {
      content: [
        {
          type: 'text',
          text: message || 'Operation completed successfully',
        },
      ],
      isError: false,
    };
    
    if (data) {
      // Add JSON data as second content item
      (result.content as any[]).push({
        type: 'json',
        json: data,
      });
    }
    
    return result;
  }

  /**
   * Format an error response
   * 
   * @param error Error object or message
   * @returns Formatted tool call result
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
}
