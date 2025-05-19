/**
 * Project Tools Module
 * 
 * This module provides MCP tools for interacting with n8n projects.
 * According to the official n8n API, only the following operations are allowed:
 * - project:create
 * - project:update
 * - project:delete
 * - project:list
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions - only keeping officially supported operations
import { getProjectListToolDefinition, ProjectListHandler } from './list.js';
import { getProjectCreateToolDefinition, ProjectCreateHandler } from './create.js';
import { getProjectUpdateToolDefinition, ProjectUpdateHandler } from './update.js';
import { getProjectDeleteToolDefinition, ProjectDeleteHandler } from './delete.js';

// Export handlers for use in the tool call handler
export {
  ProjectListHandler,
  ProjectCreateHandler,
  ProjectUpdateHandler,
  ProjectDeleteHandler
};

/**
 * Set up project management tools
 * 
 * @returns Array of project tool definitions
 */
export async function setupProjectTools(): Promise<ToolDefinition[]> {
  return [
    getProjectListToolDefinition(),
    getProjectCreateToolDefinition(),
    getProjectUpdateToolDefinition(),
    getProjectDeleteToolDefinition()
  ];
}
