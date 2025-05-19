/**
 * Tag Read Tool
 * 
 * This tool retrieves details about a specific tag.
 */

import { BaseTagToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { TagReadParams } from '../../types/tag.js';

/**
 * Handler for the tag:read tool
 */
export class TagReadHandler extends BaseTagToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Tag details
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { id } = args as TagReadParams;
      
      if (!id) {
        throw new Error('Tag ID is required');
      }
      
      const tag = await this.tagClient.readTag(id);
      
      return this.formatSuccess(
        tag,
        `Retrieved tag: ${tag.name} (${tag.id})`
      );
    }, args);
  }
}

/**
 * Get tool definition for the tag:read tool
 * 
 * @returns Tool definition
 */
export function getTagReadToolDefinition(): ToolDefinition {
  return {
    name: 'tag_read',
    description: 'Read details about a specific tag',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the tag to retrieve',
        },
      },
      required: ['id'],
    },
  };
}
