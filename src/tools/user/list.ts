/**
 * User List Tool
 * 
 * This tool retrieves a list of users from n8n.
 */

import { BaseUserToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { UserListParams } from '../../types/user.js';

/**
 * Handler for the user:list tool
 */
export class UserListHandler extends BaseUserToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns List of users
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      // We could use UserListParams for filtering in the future
      // const params = args as UserListParams;
      
      // List users (filtering could be added later)
      const users = await this.userClient.listUsers();
      
      // Format the users for display (limit sensitive information)
      const formattedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isPending: user.isPending,
        createdAt: user.createdAt,
      }));
      
      return this.formatSuccess(
        formattedUsers,
        `Found ${formattedUsers.length} user(s)`
      );
    }, args);
  }
}

/**
 * Get tool definition for the user:list tool
 * 
 * @returns Tool definition
 */
export function getUserListToolDefinition(): ToolDefinition {
  return {
    name: 'user_list',
    description: 'List all users in the n8n instance',
    inputSchema: {
      type: 'object',
      properties: {
        // Optional filtering properties could be added here
      },
      required: [],
    },
  };
}
