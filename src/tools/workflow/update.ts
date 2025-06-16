/**
 * Update Workflow Tool
 * 
 * This tool updates an existing workflow in n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

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
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { workflowId, name, nodes, connections, active, tags } = args;
      
      if (!workflowId) {
        throw new N8nApiError('Missing required parameter: workflowId');
      }
      
      // Get the current workflow to validate it exists and for building update
      let currentWorkflow;
      try {
        currentWorkflow = await this.apiService.getWorkflow(workflowId);
      } catch (error) {
        throw new N8nApiError(`Workflow ${workflowId} not found`, 404);
      }
      
      // Build update data - the API client will merge with current workflow
      const updateData: Record<string, any> = {};
      if (name !== undefined) updateData.name = name;
      if (nodes !== undefined) updateData.nodes = nodes;
      if (connections !== undefined) updateData.connections = connections;
      if (active !== undefined) updateData.active = active;
      
      // Check if any supported changes requested
      if (Object.keys(updateData).length === 0 && tags === undefined) {
        return this.formatSuccess(currentWorkflow, 'No changes requested - workflow unchanged');
      }
      
      // Perform update - the API client handles required field merging
      let updatedWorkflow = currentWorkflow;
      if (Object.keys(updateData).length > 0) {
        updatedWorkflow = await this.apiService.updateWorkflow(workflowId, updateData);
      }
      
      // Handle tags separately if provided (tags require separate API endpoint)
      if (tags !== undefined) {
        try {
          await this.apiService.updateWorkflowTags(workflowId, tags);
        } catch (tagError) {
          console.warn(`Failed to update tags for workflow ${workflowId}:`, tagError);
          // Don't fail the entire operation for tag update errors
        }
      }
      
      // Build a summary of changes
      const changesArray = [];
      if (name !== undefined && name !== currentWorkflow.name) changesArray.push(`name: "${currentWorkflow.name}" → "${name}"`);
      if (active !== undefined && active !== currentWorkflow.active) changesArray.push(`active: ${currentWorkflow.active} → ${active}`);
      if (nodes !== undefined) changesArray.push('nodes updated');
      if (connections !== undefined) changesArray.push('connections updated');
      if (tags !== undefined) changesArray.push('tags updated');
      
      const changesSummary = changesArray.length > 0
        ? `Changes applied: ${changesArray.join(', ')}`
        : 'Workflow updated successfully';
      
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
    description: 'Update an existing workflow in n8n',
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
          description: 'Updated array of node objects that define the workflow',
          items: {
            type: 'object',
          },
        },
        connections: {
          type: 'object',
          description: 'Updated connection mappings between nodes',
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
      },
      required: ['workflowId'],
    },
  };
}
