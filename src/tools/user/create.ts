/**
 * User Create Tool
 * 
 * This tool creates a new user in n8n.
 */

import { BaseUserToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { UserCreateParams, UserRole } from '../../types/user.js';

/**
 * Handler for the user:create tool
 */
export class UserCreateHandler extends BaseUserToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Created user information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { email, firstName, lastName, role, password } = args as UserCreateParams;
      
      if (!email) {
        return this.formatError(new Error('Email is required'));
      }
      
      if (!firstName) {
        return this.formatError(new Error('First name is required'));
      }
      
      if (!lastName) {
        return this.formatError(new Error('Last name is required'));
      }
      
      if (!role || !Object.values(UserRole).includes(role as UserRole)) {
        return this.formatError(new Error('Valid role is required (owner, admin, or member)'));
      }
      
      const userData = {
        email,
        firstName,
        lastName,
        role: role as UserRole,
        password,
      };
      
      const user = await this.userClient.createUser(userData);
      
      return this.formatSuccess(
        {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isPending: user.isPending,
        },
        `User ${user.email} created successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the user:create tool
 * 
 * @returns Tool definition
 */
export function getUserCreateToolDefinition(): ToolDefinition {
  return {
    name: 'user_create',
    description: 'Create a new user in the n8n instance',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address for the new user',
        },
        firstName: {
          type: 'string',
          description: 'First name of the new user',
        },
        lastName: {
          type: 'string',
          description: 'Last name of the new user',
        },
        role: {
          type: 'string',
          enum: Object.values(UserRole),
          description: 'Role for the new user (owner, admin, or member)',
        },
        password: {
          type: 'string',
          description: 'Optional password for the new user (if not provided, an invitation will be sent)',
        },
      },
      required: ['email', 'firstName', 'lastName', 'role'],
    },
  };
}
