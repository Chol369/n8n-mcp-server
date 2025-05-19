/**
 * Base Variable Tool Handler
 * 
 * This module provides the base handler for variable management tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { createApiService } from '../../api/n8n-client.js';
import { getEnvConfig } from '../../config/environment.js';
import { createVariableClient } from '../../api/variable-client.js';
import { VariableClient } from '../../api/variable-client.js';
import { N8nApiService } from '../../api/n8n-client.js';

/**
 * Base handler for variable tools
 */
export abstract class BaseVariableToolHandler {
  protected apiService: N8nApiService;
  protected variableClient: VariableClient;

  /**
   * Creates a new instance of BaseVariableToolHandler
   */
  constructor() {
    this.apiService = createApiService(getEnvConfig());
    this.variableClient = createVariableClient(this.apiService.getClient());
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
        
      return this.formatError(`Error executing variable tool: ${errorMessage}`);
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
