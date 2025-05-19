/**
 * Tag Create Tool
 * 
 * This tool creates a new tag.
 */

import { BaseTagToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { TagCreateParams } from '../../types/tag.js';

/**
 * Handler for the tag:create tool
 */
export class TagCreateHandler extends BaseTagToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Created tag
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { name, color } = args as TagCreateParams;
      
      if (!name) {
        throw new Error('Tag name is required');
      }
      
      const tag = await this.tagClient.createTag({
        name,
        color,
      });
      
      return this.formatSuccess(
        tag,
        `Tag "${tag.name}" created successfully with ID: ${tag.id}`
      );
    }, args);
  }
}

/**
 * Get tool definition for the tag:create tool
 * 
 * @returns Tool definition
 */
export function getTagCreateToolDefinition(): ToolDefinition {
  return {
    name: 'tag_create',
    description: 'Create a new tag',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the tag',
        },
        color: {
          type: 'string',
          description: 'Color of the tag as a hex code',
        },
      },
      required: ['name'],
    },
  };
}
