/**
 * Credential Tools Module
 * 
 * This module provides MCP tools for interacting with n8n credentials.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions - only including standard allowed operations
import { getCredentialCreateToolDefinition, CredentialCreateHandler } from './create.js';
import { getCredentialMoveToolDefinition, CredentialMoveHandler } from './move.js';
import { getCredentialDeleteToolDefinition, CredentialDeleteHandler } from './delete.js';

// Export handlers for use in the tool call handler
export {
  CredentialCreateHandler,
  CredentialMoveHandler,
  CredentialDeleteHandler
};

/**
 * Set up credential management tools
 * 
 * @returns Array of credential tool definitions
 */
export async function setupCredentialTools(): Promise<ToolDefinition[]> {
  return [
    getCredentialCreateToolDefinition(),
    getCredentialMoveToolDefinition(),
    getCredentialDeleteToolDefinition()
  ];
}
