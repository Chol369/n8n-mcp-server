/**
 * Base Tag Tool Handler
 * 
 * This module provides the base handler for tag management tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { createApiService } from '../../api/n8n-client.js';
import { getEnvConfig } from '../../config/environment.js';
import { createTagClient } from '../../api/tag-client.js';
import { TagClient } from '../../api/tag-client.js';
import { N8nApiService } from '../../api/n8n-client.js';

/**
 * Base handler for tag tools
 */
export abstract class BaseTagToolHandler {
  protected apiService: N8nApiService;
  protected tagClient: TagClient;

  /**
   * Creates a new instance of BaseTagToolHandler
   */
  constructor() {
    this.apiService = createApiService(getEnvConfig());
    this.tagClient = createTagClient(this.apiService.getClient());
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
   * Execute the tool with error handling
   * 
   * @param fn Function to execute
   * @param args Tool arguments
   * @returns Tool call result
   */
  protected async handleExecution(
    executionFn: () => Promise<ToolCallResult>,
    _args: Record<string, any>
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
        
      return this.formatError(`Error executing tag tool: ${errorMessage}`);
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
