/**
 * User Read Tool
 * 
 * This tool retrieves information about a specific user from n8n.
 */

import { BaseUserToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { UserReadParams } from '../../types/user.js';

/**
 * Handler for the user:read tool
 */
export class UserReadHandler extends BaseUserToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns User information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { id } = args as UserReadParams;
      
      if (!id) {
        return this.formatError(new Error('A user ID is required'));
      }
      
      const user = await this.userClient.getUser(id);
      
      return this.formatSuccess(
        user,
        `Retrieved information for user ${user.email}`
      );
    }, args);
  }
}

/**
 * Get tool definition for the user:read tool
 * 
 * @returns Tool definition
 */
export function getUserReadToolDefinition(): ToolDefinition {
  return {
    name: 'user_read',
    description: 'Get details about a specific n8n user',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the user to retrieve information about',
        },
      },
      required: ['id'],
    },
  };
}
