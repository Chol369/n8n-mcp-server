/**
 * Update Workflow Tool
 * 
 * This tool updates an existing workflow in n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Workflow, N8nNode, N8nConnection } from '../../types/index.js'; // Import specific types
import { N8nApiError } from '../../errors/index.js';

// Define specific type for update arguments
// Intersect with Partial<Workflow> to allow any workflow property update
// Requires workflowId to identify the workflow
interface UpdateWorkflowArgs extends Partial<Workflow> {
  workflowId: string; 
}

/**
 * Handler for the update_workflow tool
 */
export class UpdateWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow updates
   * @returns Updated workflow information
   */
  async execute(args: UpdateWorkflowArgs): Promise<ToolCallResult> { // Use specific args type
    return this.handleExecution(async (args) => {
      const { workflowId, name, nodes, connections, active, tags, settings } = args; // Destructure known properties
      
      if (!workflowId) {
        throw new N8nApiError('Missing required parameter: workflowId');
      }
      
      // Basic validation (more robust validation could use Zod or similar)
      if (nodes && !Array.isArray(nodes)) {
        throw new N8nApiError('Parameter "nodes" must be an array');
      }
      if (connections && typeof connections !== 'object') {
        throw new N8nApiError('Parameter "connections" must be an object');
      }
      if (tags && !Array.isArray(tags)) {
        throw new N8nApiError('Parameter "tags" must be an array of strings');
      }
      if (settings && typeof settings !== 'object') {
        throw new N8nApiError('Parameter "settings" must be an object');
      }
      
      // Get the current workflow to compare changes (optional, but good for summary)
      let currentWorkflow: Workflow | null = null;
      try {
        currentWorkflow = await this.apiService.getWorkflow(workflowId);
      } catch (error) {
        // Handle case where workflow to update doesn't exist
        if (error instanceof N8nApiError && error.message.includes('not found')) { // Adjust error check as needed
           throw new N8nApiError(`Workflow with ID "${workflowId}" not found.`);
        }
        throw error; // Re-throw other errors
      }
      
      // Prepare update object with only the provided changes
      const workflowUpdateData: Partial<Workflow> = {};
      if (name !== undefined) workflowUpdateData.name = name;
      if (nodes !== undefined) workflowUpdateData.nodes = nodes;
      if (connections !== undefined) workflowUpdateData.connections = connections;
      if (active !== undefined) workflowUpdateData.active = active;
      if (tags !== undefined) workflowUpdateData.tags = tags;
      if (settings !== undefined) workflowUpdateData.settings = settings;
      // Add other updatable fields from Workflow interface if needed
      
      // Check if there are any actual changes to send
      if (Object.keys(workflowUpdateData).length === 0) {
        return this.formatSuccess(
          { id: workflowId, name: currentWorkflow.name, active: currentWorkflow.active },
          `No update parameters provided for workflow ${workflowId}. No changes made.`
        );
      }

      // Update the workflow
      const updatedWorkflow = await this.apiService.updateWorkflow(workflowId, workflowUpdateData);
      
      // Build a summary of changes (optional)
      const changesArray = [];
      if (name !== undefined && name !== currentWorkflow.name) changesArray.push(`name: "${currentWorkflow.name}" → "${name}"`);
      if (active !== undefined && active !== currentWorkflow.active) changesArray.push(`active: ${currentWorkflow.active} → ${active}`);
      if (nodes !== undefined) changesArray.push('nodes updated');
      if (connections !== undefined) changesArray.push('connections updated');
      if (tags !== undefined) changesArray.push('tags updated');
      if (settings !== undefined) changesArray.push('settings updated');
      
      const changesSummary = changesArray.length > 0
        ? `Changes: ${changesArray.join(', ')}`
        : 'No effective changes were made (values might be the same as current)';
      
      return this.formatSuccess(
        {
          id: updatedWorkflow.id,
          name: updatedWorkflow.name,
          active: updatedWorkflow.active
        },
        `Workflow updated successfully. ${changesSummary}`
      );
    }, args);
  }
}

/**
 * Get tool definition for the update_workflow tool
 * 
 * @returns Tool definition
 */
export function getUpdateWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'update_workflow',
    description: 'Update an existing workflow in n8n. Provide only the fields you want to change.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to update',
        },
        name: {
          type: 'string',
          description: 'New name for the workflow',
        },
        nodes: {
          type: 'array',
          description: 'Updated array of node objects (N8nNode structure) defining the workflow',
          items: {
            type: 'object', // Ideally, reference a detailed N8nNode schema here
          },
        },
        connections: {
          type: 'object',
          description: 'Updated connection mappings between nodes (N8nConnection structure)',
        },
        active: {
          type: 'boolean',
          description: 'Whether the workflow should be active',
        },
        tags: {
          type: 'array',
          description: 'Updated tags to associate with the workflow',
          items: {
            type: 'string',
          },
        },
         settings: {
          type: 'object',
          description: 'Updated workflow settings (WorkflowSettings structure)',
        },
      },
      required: ['workflowId'], // Only ID is strictly required to identify the workflow
    },
  };
}
