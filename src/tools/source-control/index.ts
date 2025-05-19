/**
 * Source Control Tools Module
 * 
 * This module provides MCP tools for interacting with n8n source control operations.
 */

import { ToolDefinition } from '../../types/index.js';

// Import only the officially supported pull tool definition
import { getSourceControlPullToolDefinition, SourceControlPullHandler } from './pull.js';

// Export only the officially supported handler
export {
  SourceControlPullHandler
};

/**
 * Set up source control tools
 * 
 * @returns Array of source control tool definitions
 */
export async function setupSourceControlTools(): Promise<ToolDefinition[]> {
  return [
    getSourceControlPullToolDefinition()
  ];
}
