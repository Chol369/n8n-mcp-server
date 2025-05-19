/**
 * Base Source Control Tool Handler
 * 
 * This module provides a base handler for source control related tools.
 */

import { ToolCallResult } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { createApiService } from '../../api/n8n-client.js';
import { getEnvConfig } from '../../config/environment.js';
import { createSourceControlClient } from '../../api/source-control-client.js';
import { SourceControlClient } from '../../api/source-control-client.js';
import { N8nApiService } from '../../api/n8n-client.js';

/**
 * Base class for source control tool handlers
 */
export abstract class BaseSourceControlToolHandler {
  protected apiService: N8nApiService;
  protected sourceControlClient: SourceControlClient;
  
  /**
   * Create a new base source control tool handler
   */
  constructor() {
    this.apiService = createApiService(getEnvConfig());
    this.sourceControlClient = createSourceControlClient(this.apiService.getClient());
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
   * @param executionFn Function to execute
   * @returns Tool call result
   */
  protected async handleExecution(
    executionFn: () => Promise<ToolCallResult>
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
        
      return this.formatError(`Error executing source control tool: ${errorMessage}`);
    }
  }
}
