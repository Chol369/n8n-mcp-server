/**
 * User Change Role Tool
 * 
 * This tool changes a user's role in n8n.
 */

import { BaseUserToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { UserChangeRoleParams, UserRole } from '../../types/user.js';

/**
 * Handler for the user:changeRole tool
 */
export class UserChangeRoleHandler extends BaseUserToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Updated user information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { id, role } = args as UserChangeRoleParams;
      
      if (!id) {
        return this.formatError(new Error('User ID is required'));
      }
      
      if (!role || !Object.values(UserRole).includes(role as UserRole)) {
        return this.formatError(new Error('Valid role is required (owner, admin, or member)'));
      }
      
      // Convert role to n8n API format (global:admin, global:member)
      let newRoleName: string;
      switch (role) {
        case 'admin':
          newRoleName = 'global:admin';
          break;
        case 'member':
          newRoleName = 'global:member';
          break;
        case 'owner':
          // Owner role might not be changeable via API
          return this.formatError(new Error('Owner role cannot be changed via API'));
        default:
          return this.formatError(new Error('Invalid role specified'));
      }
      
      const roleData = { newRoleName };
      const user = await this.userClient.changeUserRole(id, roleData);
      
      return this.formatSuccess(
        {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        `User role changed to ${role} successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the user:changeRole tool
 * 
 * @returns Tool definition
 */
export function getUserChangeRoleToolDefinition(): ToolDefinition {
  return {
    name: 'user_change_role',
    description: 'Change the role of an existing n8n user',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the user to change role for',
        },
        role: {
          type: 'string',
          enum: Object.values(UserRole),
          description: 'New role for the user (owner, admin, or member)',
        },
      },
      required: ['id', 'role'],
    },
  };
}
