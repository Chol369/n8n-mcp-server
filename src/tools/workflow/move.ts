/**
 * Workflow Move Tool
 * 
 * This tool moves/transfers a workflow to a different owner.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';
import { WorkflowMoveParams } from '../../types/workflow.js';

/**
 * Handler for the workflow:move tool
 */
export class MoveWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Result of moving the workflow
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { id, newOwner } = args as WorkflowMoveParams;
      
      if (!id) {
        throw new Error('Workflow ID is required');
      }
      
      if (!newOwner) {
        throw new Error('New owner is required');
      }
      
      try {
        const workflow = await this.apiService.moveWorkflow(id, newOwner);
        
        return this.formatSuccess(
          workflow,
          `Workflow ${id} has been moved to owner ${newOwner}`
        );
      } catch (error) {
        if (error instanceof N8nApiError) {
          throw error;
        }
        
        throw new Error(`Failed to move workflow: ${error instanceof Error ? error.message : String(error)}`);
      }
    }, args);
  }
}

/**
 * Get tool definition for the workflow:move tool
 * 
 * @returns Tool definition
 */
export function getWorkflowMoveToolDefinition(): ToolDefinition {
  return {
    name: 'workflow_move',
    description: 'Move a workflow to a different owner',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the workflow to move',
        },
        newOwner: {
          type: 'string',
          description: 'ID or email of the new owner',
        },
      },
      required: ['id', 'newOwner'],
    },
  };
}
