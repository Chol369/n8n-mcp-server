/**
 * User Delete Tool
 * 
 * This tool deletes a user from n8n.
 */

import { BaseUserToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { UserDeleteParams } from '../../types/user.js';

/**
 * Handler for the user:delete tool
 */
export class UserDeleteHandler extends BaseUserToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Deletion confirmation
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { id } = args as UserDeleteParams;
      
      if (!id) {
        return this.formatError(new Error('User ID is required'));
      }
      
      // Get user first to include details in the response
      let user;
      try {
        user = await this.userClient.getUser(id);
      } catch (error) {
        // If user doesn't exist, return error
        return this.formatError(new Error(`User with ID ${id} not found`));
      }
      
      // Now delete the user
      await this.userClient.deleteUser(id);
      
      return this.formatSuccess(
        {
          id,
          email: user.email,
          deleted: true
        },
        `User ${user.email} deleted successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the user:delete tool
 * 
 * @returns Tool definition
 */
export function getUserDeleteToolDefinition(): ToolDefinition {
  return {
    name: 'user_delete',
    description: 'Delete a user from the n8n instance',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the user to delete',
        },
      },
      required: ['id'],
    },
  };
}
