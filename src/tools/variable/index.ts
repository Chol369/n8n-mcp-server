/**
 * Variable Tools Module
 * 
 * This module provides MCP tools for interacting with n8n variables.
 * According to the official n8n API, only the following operations are supported:
 * - variable:create
 * - variable:delete
 * - variable:list
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions - only keeping officially supported operations
import { getVariableListToolDefinition, VariableListHandler } from './list.js';
import { getVariableCreateToolDefinition, VariableCreateHandler } from './create.js';
import { getVariableDeleteToolDefinition, VariableDeleteHandler } from './delete.js';

// Export handlers for use in the tool call handler
export {
  VariableListHandler,
  VariableCreateHandler,
  VariableDeleteHandler
};

/**
 * Set up variable management tools
 * 
 * @returns Array of variable tool definitions
 */
export async function setupVariableTools(): Promise<ToolDefinition[]> {
  return [
    getVariableListToolDefinition(),
    getVariableCreateToolDefinition(),
    getVariableDeleteToolDefinition()
  ];
}
