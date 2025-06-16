/**
 * Workflow Tools Module
 * 
 * This module provides MCP tools for interacting with n8n workflows.
 * According to the official n8n API, the following operations are supported:
 * - workflow:create
 * - workflow:read
 * - workflow:update
 * - workflow:delete
 * - workflow:list
 * - workflow:activate
 * - workflow:deactivate
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions - all officially supported operations
import { getListWorkflowsToolDefinition, ListWorkflowsHandler } from './list.js';
import { getReadWorkflowToolDefinition, ReadWorkflowHandler } from './read.js';
import { getCreateWorkflowToolDefinition, CreateWorkflowHandler } from './create.js';
import { getUpdateWorkflowToolDefinition, UpdateWorkflowHandler } from './update.js';
import { getDeleteWorkflowToolDefinition, DeleteWorkflowHandler } from './delete.js';
import { getActivateWorkflowToolDefinition, ActivateWorkflowHandler } from './activate.js';
import { getDeactivateWorkflowToolDefinition, DeactivateWorkflowHandler } from './deactivate.js';

// Export handlers
export {
  ListWorkflowsHandler,
  ReadWorkflowHandler,
  CreateWorkflowHandler,
  UpdateWorkflowHandler,
  DeleteWorkflowHandler,
  ActivateWorkflowHandler,
  DeactivateWorkflowHandler,
};

/**
 * Set up workflow management tools
 * 
 * @returns Array of workflow tool definitions
 */
export async function setupWorkflowTools(): Promise<ToolDefinition[]> {
  return [
    getListWorkflowsToolDefinition(),
    getReadWorkflowToolDefinition(),
    getCreateWorkflowToolDefinition(),
    getUpdateWorkflowToolDefinition(),
    getDeleteWorkflowToolDefinition(),
    getActivateWorkflowToolDefinition(),
    getDeactivateWorkflowToolDefinition(),
  ];
}
