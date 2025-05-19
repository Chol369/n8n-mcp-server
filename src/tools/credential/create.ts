/**
 * Credential Create Tool
 * 
 * This module provides a tool to create a new credential in n8n.
 */

import { BaseCredentialHandler } from './base-handler.js';
import { ToolDefinition, ToolCallResult } from '../../types/index.js';

/**
 * Create Credential tool definition
 * 
 * @returns Tool definition
 */
export function getCredentialCreateToolDefinition(): ToolDefinition {
  return {
    name: 'credential_create',
    description: 'Create a new credential in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name for the credential',
        },
        type: {
          type: 'string',
          description: 'Type of the credential (e.g., githubApi, slackApi, etc.)',
        },
        data: {
          type: 'object',
          description: 'Credential data containing the authentication information',
        },
        sharedWithUsers: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Optional array of user IDs to share the credential with',
        },
      },
      required: ['name', 'type', 'data'],
    },
  };
}

/**
 * Handler for creating a credential
 */
export class CredentialCreateHandler extends BaseCredentialHandler {
  /**
   * Execute the create credential tool
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  public async execute(args: Record<string, any>): Promise<ToolCallResult> {
    try {
      if (!args.name) {
        throw new Error('Credential name is required');
      }
      if (!args.type) {
        throw new Error('Credential type is required');
      }
      if (!args.data) {
        throw new Error('Credential data is required');
      }

      const credentialData = {
        name: args.name,
        type: args.type,
        data: args.data,
        sharedWith: args.sharedWithUsers || [],
      };

      const credential = await this.apiService.createCredential(credentialData);
      return this.formatSuccess(
        credential,
        `Successfully created credential "${args.name}"`
      );
    } catch (error) {
      return this.formatError(error instanceof Error ? error : String(error));
    }
  }
}
