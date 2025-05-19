/**
 * Credential Move Tool
 * 
 * This module provides functionality for moving/sharing credentials in n8n.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseCredentialHandler } from './base-handler.js';

/**
 * Get the credential move tool definition
 * 
 * @returns Tool definition for moving a credential
 */
export function getCredentialMoveToolDefinition(): ToolDefinition {
  return {
    name: 'credential_move',
    description: 'Move/share a credential with users in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the credential to move/share',
        },
        newOwnerId: {
          type: 'string', 
          description: 'ID of the new owner user',
        },
        shareWithIds: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of user IDs to share the credential with',
        },
      },
      required: ['id'],
    },
  };
}

/**
 * Handler for moving/sharing a credential
 */
export class CredentialMoveHandler extends BaseCredentialHandler {
  /**
   * Execute the credential move tool
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  public async execute(args: Record<string, any>): Promise<ToolCallResult> {
    try {
      const moveData: Record<string, any> = {};
      
      if (args.newOwnerId) {
        moveData.ownerId = args.newOwnerId;
      }
      
      if (args.shareWithIds) {
        moveData.shareWithIds = args.shareWithIds;
      }
      
      const result = await this.apiService.moveCredential(args.id, args.newOwnerId);
      return this.formatSuccess(
        result, 
        `Successfully moved/shared credential with ID ${args.id}`
      );
    } catch (error) {
      return this.formatError(error instanceof Error ? error : String(error));
    }
  }
}