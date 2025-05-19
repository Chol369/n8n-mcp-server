/**
 * Handler for workflowTags:update operation
 */

import { ToolCallResult } from '../../types/index.js';
import { WorkflowTagBaseHandler } from './base-handler.js';

/**
 * Parameters for updating workflow tags
 */
export interface UpdateWorkflowTagsParams {
  /**
   * ID of the workflow to update tags for
   */
  workflowId: string;
  
  /**
   * List of tag IDs to assign to the workflow
   */
  tagIds: string[];
}

/**
 * Handler for workflowTags:update operation
 * Updates the tags assigned to a specific workflow
 */
export class UpdateWorkflowTagsHandler extends WorkflowTagBaseHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { workflowId, tagIds } = args as UpdateWorkflowTagsParams;
      
      if (!workflowId) {
        throw new Error('Workflow ID is required for updating workflow tags');
      }
      
      if (!tagIds || !Array.isArray(tagIds)) {
        throw new Error('Tag IDs must be provided as an array');
      }
      
      const updatedTags = await this.apiService.updateWorkflowTags(workflowId, tagIds);
      return this.formatSuccess(
        updatedTags,
        `Successfully updated tags for workflow ${workflowId}`
      );
    }, args);
  }
}
