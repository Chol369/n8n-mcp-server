/**
 * Tag List Tool
 * 
 * This tool lists available tags.
 */

import { BaseTagToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { TagListParams } from '../../types/tag.js';

/**
 * Handler for the tag:list tool
 */
export class TagListHandler extends BaseTagToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns List of tags
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { search, limit, offset } = args as TagListParams;
      
      const tags = await this.tagClient.listTags(search, limit, offset);
      
      let message = `Found ${tags.length} tag(s)`;
      
      if (search) {
        message += ` matching "${search}"`;
      }
      
      message += '.';
      
      return this.formatSuccess(
        tags,
        message
      );
    }, args);
  }
}

/**
 * Get tool definition for the tag:list tool
 * 
 * @returns Tool definition
 */
export function getTagListToolDefinition(): ToolDefinition {
  return {
    name: 'tag_list',
    description: 'List available tags',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term to filter tags',
        },
        limit: {
          type: 'number',
          description: 'Number of results to return',
        },
        offset: {
          type: 'number',
          description: 'Offset for pagination',
        },
      },
      required: [],
    },
  };
}
