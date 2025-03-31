/**
 * List Workflows Tool
 * 
 * This tool retrieves a list of workflows from n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Workflow } from '../../types/index.js';

/**
 * Handler for the list_workflows tool
 */
export class ListWorkflowsHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
 * @param args Tool arguments (expecting optional 'active' boolean)
 * @returns List of workflows
 */
  async execute(args: { active?: boolean }): Promise<ToolCallResult> { // Use specific type for args
    return this.handleExecution(async (args) => { // Pass args to the handler
      let workflows: Workflow[] = await this.apiService.getWorkflows(); // Add type annotation

      // Apply filtering if the 'active' argument is provided
      if (args && typeof args.active === 'boolean') {
        workflows = workflows.filter((workflow: Workflow) => workflow.active === args.active);
      }
      
      // Format the workflows for display
      const formattedWorkflows = workflows.map((workflow: Workflow) => ({
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        updatedAt: workflow.updatedAt,
      }));
      
      return this.formatSuccess(
        formattedWorkflows,
        `Found ${formattedWorkflows.length} workflow(s)` + (typeof args?.active === 'boolean' ? ` (filtered by active=${args.active})` : '')
      );
    }, args); // Pass args to handleExecution
  }
}

/**
 * Get tool definition for the list_workflows tool
 * 
 * @returns Tool definition
 */
export function getListWorkflowsToolDefinition(): ToolDefinition {
  return {
    name: 'list_workflows',
    description: 'Retrieve a list of all workflows available in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        active: {
          type: 'boolean',
          description: 'Optional filter to show only active or inactive workflows',
        },
      },
      required: [],
    },
  };
}
