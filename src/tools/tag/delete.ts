/**
 * Tag Delete Tool
 * 
 * This tool deletes a tag.
 */

import { BaseTagToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { TagDeleteParams } from '../../types/tag.js';

/**
 * Handler for the tag:delete tool
 */
export class TagDeleteHandler extends BaseTagToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Deletion result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { id } = args as TagDeleteParams;
      
      if (!id) {
        throw new Error('Tag ID is required');
      }
      
      // First read the tag to include its name in the success message
      const tag = await this.tagClient.readTag(id);
      const tagName = tag.name;
      
      const result = await this.tagClient.deleteTag(id);
      
      return this.formatSuccess(
        result,
        `Tag "${tagName}" (${id}) deleted successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the tag:delete tool
 * 
 * @returns Tool definition
 */
export function getTagDeleteToolDefinition(): ToolDefinition {
  return {
    name: 'tag_delete',
    description: 'Delete a tag',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the tag to delete',
        },
      },
      required: ['id'],
    },
  };
}
