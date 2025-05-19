/**
 * Read Workflow Tool
 * 
 * This tool retrieves a specific workflow from n8n by ID.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the workflow:read tool
 */
export class ReadWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflowId
   * @returns Workflow details
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId } = args;
      
      if (!workflowId) {
        throw new N8nApiError('Missing required parameter: workflowId');
      }
      
      const workflow = await this.apiService.getWorkflow(workflowId);
      
      return this.formatSuccess(workflow, `Retrieved workflow: ${workflow.name}`);
    }, args);
  }
}

/**
 * Get tool definition for the workflow:read tool
 * 
 * @returns Tool definition
 */
export function getReadWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'workflow_read',
    description: 'Read a specific workflow by ID',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to retrieve',
        },
      },
      required: ['workflowId'],
    },
  };
}
