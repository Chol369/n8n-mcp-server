/**
 * Credential Delete Tool
 * 
 * This module provides a tool to delete a credential in n8n.
 */

import { BaseCredentialHandler } from './base-handler.js';
import { ToolDefinition, ToolCallResult } from '../../types/index.js';

/**
 * Delete Credential tool definition
 * 
 * @returns Tool definition
 */
export function getCredentialDeleteToolDefinition(): ToolDefinition {
  return {
    name: 'credential_delete',
    description: 'Delete a credential from n8n',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the credential to delete',
        },
      },
      required: ['id'],
    },
  };
}

/**
 * Handler for deleting a credential
 */
export class CredentialDeleteHandler extends BaseCredentialHandler {
  /**
   * Execute the delete credential tool
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  public async execute(args: Record<string, any>): Promise<ToolCallResult> {
    try {
      if (!args.id) {
        throw new Error('Credential ID is required');
      }

      const result = await this.apiService.deleteCredential(args.id);
      return this.formatSuccess(
        result,
        `Successfully deleted credential with ID ${args.id}`
      );
    } catch (error) {
      return this.formatError(error instanceof Error ? error : String(error));
    }
  }
}
