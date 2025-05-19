/**
 * Index file for workflow tags operations
 * 
 * Exports all workflow tag tool handlers and setup functions.
 */

import { ListWorkflowTagsHandler } from './list.js';
import { UpdateWorkflowTagsHandler } from './update.js';
import { workflowTagsResources } from '../../resources/static/workflow-tags.js';

// Export all handlers
export * from './base-handler.js';
export * from './list.js';
export * from './update.js';

/**
 * Create and return all workflow tag tools with handlers
 * 
 * @returns Array of tool definitions with handlers
 */
export async function setupWorkflowTagTools(): Promise<any[]> {
  return [
    {
      ...workflowTagsResources.list,
      handler: new ListWorkflowTagsHandler(),
      name: 'workflow_tags_list', // Tool name for MCP
    },
    {
      ...workflowTagsResources.update,
      handler: new UpdateWorkflowTagsHandler(),
      name: 'workflow_tags_update', // Tool name for MCP
    },
  ];
}
