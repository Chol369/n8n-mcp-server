/**
 * Tag Tools Module
 * 
 * This module provides MCP tools for interacting with n8n tags.
 * According to the official n8n API, only the following operations are supported:
 * - tag:list
 * - tag:read
 * - tag:create
 * - tag:update
 * - tag:delete
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions - only the officially supported ones
import { getTagListToolDefinition, TagListHandler } from './list.js';
import { getTagReadToolDefinition, TagReadHandler } from './read.js';
import { getTagCreateToolDefinition, TagCreateHandler } from './create.js';
import { getTagUpdateToolDefinition, TagUpdateHandler } from './update.js';
import { getTagDeleteToolDefinition, TagDeleteHandler } from './delete.js';

// Export handlers for use in the tool call handler
export {
  TagListHandler,
  TagReadHandler,
  TagCreateHandler,
  TagUpdateHandler,
  TagDeleteHandler
};

/**
 * Set up tag management tools
 * 
 * @returns Array of tag tool definitions
 */
export async function setupTagTools(): Promise<ToolDefinition[]> {
  return [
    getTagListToolDefinition(),
    getTagReadToolDefinition(),
    getTagCreateToolDefinition(),
    getTagUpdateToolDefinition(),
    getTagDeleteToolDefinition()
  ];
}
