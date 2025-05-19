/**
 * Static Source Control Resource Handler
 * 
 * This module provides the MCP resource implementation for source control.
 * According to the official n8n API, only sourceControl:pull is supported.
 */

import { McpError, ErrorCode } from '../../errors/index.js';

/**
 * Get source control resource URI
 * 
 * @returns Formatted resource URI
 */
export function getSourceControlResourceUri(): string {
  return 'n8n://source-control';
}

/**
 * Get source control resource data
 * 
 * @returns Formatted source control resource data
 */
export async function getSourceControlResource(): Promise<string> {
  try {
    // Since we only support pull operations, provide information about the pull capability
    const result = {
      resourceType: 'sourceControl',
      supportedOperations: ['pull'],
      description: 'Source control allows pulling changes from a connected repository',
      _links: {
        self: getSourceControlResourceUri(),
      },
      lastUpdated: new Date().toISOString(),
    };
    
    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error('Error creating source control resource:', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to create source control resource: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get source control resource metadata
 * 
 * @returns Resource metadata object
 */
export function getSourceControlResourceMetadata(): Record<string, any> {
  return {
    uri: getSourceControlResourceUri(),
    name: 'n8n Source Control',
    mimeType: 'application/json',
    description: 'Status of the source control repository in the n8n instance',
  };
}
