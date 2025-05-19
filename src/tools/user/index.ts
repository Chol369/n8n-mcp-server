/**
 * User Tools Module
 * 
 * This module provides MCP tools for interacting with n8n users.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions
import { getUserReadToolDefinition, UserReadHandler } from './read.js';
import { getUserListToolDefinition, UserListHandler } from './list.js';
import { getUserCreateToolDefinition, UserCreateHandler } from './create.js';
import { getUserChangeRoleToolDefinition, UserChangeRoleHandler } from './change-role.js';
import { getUserDeleteToolDefinition, UserDeleteHandler } from './delete.js';

// Export handlers for use in the tool call handler
export {
  UserReadHandler,
  UserListHandler,
  UserCreateHandler,
  UserChangeRoleHandler,
  UserDeleteHandler
};

/**
 * Set up user management tools
 * 
 * @returns Array of user tool definitions
 */
export async function setupUserTools(): Promise<ToolDefinition[]> {
  return [
    getUserReadToolDefinition(),
    getUserListToolDefinition(),
    getUserCreateToolDefinition(),
    getUserChangeRoleToolDefinition(),
    getUserDeleteToolDefinition()
  ];
}
