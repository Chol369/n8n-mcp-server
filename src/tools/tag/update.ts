/**
 * Tag Update Tool
 * 
 * This tool updates an existing tag.
 */

import { BaseTagToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { TagUpdateParams } from '../../types/tag.js';

/**
 * Handler for the tag:update tool
 */
export class TagUpdateHandler extends BaseTagToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Updated tag
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { id, name, color } = args as TagUpdateParams;
      
      if (!id) {
        throw new Error('Tag ID is required');
      }
      
      // Create update data object with provided fields
      const updateData: Partial<TagUpdateParams> = {};
      if (name !== undefined) updateData.name = name;
      if (color !== undefined) updateData.color = color;
      
      // If the update data is empty, there's nothing to update
      if (Object.keys(updateData).length === 0) {
        throw new Error('At least one field to update is required');
      }
      
      const tag = await this.tagClient.updateTag(id, updateData);
      
      return this.formatSuccess(
        tag,
        `Tag "${tag.name}" updated successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the tag:update tool
 * 
 * @returns Tool definition
 */
export function getTagUpdateToolDefinition(): ToolDefinition {
  return {
    name: 'tag_update',
    description: 'Update an existing tag',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the tag to update',
        },
        name: {
          type: 'string',
          description: 'New name for the tag',
        },
        color: {
          type: 'string',
          description: 'New color for the tag as a hex code',
        },
      },
      required: ['id'],
    },
  };
}
