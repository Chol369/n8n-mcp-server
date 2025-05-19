/**
 * Execute Workflow Tool
 * 
 * This tool executes a workflow via the API.
 */

import { BaseExecutionToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, ExecuteWorkflowParams, Execution } from '../../types/index.js';

/**
 * Handler for the execution_run tool
 */
export class ExecuteWorkflowHandler extends BaseExecutionToolHandler {
  /**
   * Execute a workflow via the API
   * 
   * @param args Tool arguments
   * @returns Execution details
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { workflowId, data } = args as ExecuteWorkflowParams;
      
      if (!workflowId) {
        throw new Error('Workflow ID is required');
      }
      
      // Use the apiService executeWorkflow method instead of direct axios calls
      const result = await this.apiService.executeWorkflow(workflowId, data || {});
      
      // Format the result into an Execution object
      const execution: Execution = {
        id: result.executionId || result.id,
        workflowId,
        finished: false,
        status: 'running',
        mode: 'manual',
        data: {
          resultData: {}
        },
        startedAt: new Date().toISOString(),
        stoppedAt: '',
        ...result
      };
      
      return this.formatSuccess(
        execution,
        `Workflow execution started with ID: ${execution.id}`
      );
    }, args);
  }

}

/**
 * Get the execution_run tool definition
 * 
 * @returns Tool definition
 */
export function getExecuteWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'execution_run',
    description: 'Execute a workflow via the API',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to execute',
        },
        data: {
          type: 'object',
          description: 'Data to pass to the workflow execution',
        },
      },
      required: ['workflowId'],
    },
  };
}
