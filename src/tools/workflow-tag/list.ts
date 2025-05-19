/**
 * Handler for workflowTags:list operation
 */

import { ToolCallResult } from '../../types/index.js';
import { WorkflowTagBaseHandler } from './base-handler.js';

/**
 * Parameters for listing workflow tags
 */
export interface ListWorkflowTagsParams {
  /**
   * ID of the workflow to list tags for
   */
  workflowId: string;
}

/**
 * Handler for workflowTags:list operation
 * Lists all tags assigned to a specific workflow
 */
export class ListWorkflowTagsHandler extends WorkflowTagBaseHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { workflowId } = args as ListWorkflowTagsParams;
      
      if (!workflowId) {
        throw new Error('Workflow ID is required for listing workflow tags');
      }
      
      const tags = await this.apiService.getWorkflowTags(workflowId);
      return this.formatSuccess(
        tags,
        `Successfully retrieved ${tags.length} tags for workflow ${workflowId}`
      );
    }, args);
  }
}
