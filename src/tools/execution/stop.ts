/**
 * Stop Execution Tool
 * 
 * This tool stops a running workflow execution.
 */

import { BaseExecutionToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, StopExecutionParams } from '../../types/index.js';

/**
 * Handler for the execution_stop tool
 */
export class StopExecutionHandler extends BaseExecutionToolHandler {
  /**
   * Stop a running execution
   * 
   * @param args Tool arguments
   * @returns Stop result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { executionId } = args as StopExecutionParams;
      
      if (!executionId) {
        throw new Error('Execution ID is required');
      }
      
      // Get the axios instance first, then make the HTTP call
      const axiosInstance = this.apiService.getClient().getAxiosInstance();
      await axiosInstance.post(`/executions/${executionId}/stop`);
      
      return this.formatSuccess(
        { success: true },
        `Execution ${executionId} stopped successfully`
      );
    }, args);
  }
}

/**
 * Get the execution_stop tool definition
 * 
 * @returns Tool definition
 */
export function getStopExecutionToolDefinition(): ToolDefinition {
  return {
    name: 'execution_stop',
    description: 'Stop a running workflow execution',
    inputSchema: {
      type: 'object',
      properties: {
        executionId: {
          type: 'string',
          description: 'ID of the execution to stop',
        },
      },
      required: ['executionId'],
    },
  };
}
