/**
 * Static Variables Resource Handler
 * 
 * This module provides the MCP resource implementation for variables.
 */

import { N8nApiService } from '../../api/n8n-client.js';
import { createVariableClient } from '../../api/variable-client.js';
import { McpError, ErrorCode } from '../../errors/index.js';
import { VariableType } from '../../types/variable.js';

/**
 * Get variables resource URI
 * 
 * @returns Formatted resource URI
 */
export function getVariablesResourceUri(): string {
  return 'n8n://variables';
}

/**
 * Get variables resource data
 * 
 * @param apiService n8n API service
 * @returns Formatted variables resource data
 */
export async function getVariablesResource(apiService: N8nApiService): Promise<string> {
  try {
    // Create variable client from API service
    const variableClient = createVariableClient(apiService.getClient());
    
    // Get variables from the API (do not include values for security)
    const variables = await variableClient.listVariables(undefined, undefined, true, false);
    
    // Group variables by type
    const typeGroups = Object.values(VariableType).reduce((acc, type) => {
      acc[type] = variables.filter(v => v.type === type).length;
      return acc;
    }, {} as Record<string, number>);
    
    // Count system vs. user variables
    const systemCount = variables.filter(v => v.isSystem).length;
    const userCount = variables.length - systemCount;
    
    // Add metadata about the resource
    const result = {
      resourceType: 'variables',
      count: variables.length,
      summary: {
        byType: typeGroups,
        system: systemCount,
        user: userCount,
      },
      recentVariables: variables.slice(0, 5).map(variable => ({
        id: variable.id,
        key: variable.key,
        type: variable.type || 'string',
        projectId: variable.projectId,
        isSystem: variable.isSystem || false,
      })),
      _links: {
        self: getVariablesResourceUri(),
      },
      lastUpdated: new Date().toISOString(),
    };
    
    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error('Error fetching variables resource:', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to retrieve variables: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get variables resource metadata
 * 
 * @returns Resource metadata object
 */
export function getVariablesResourceMetadata(): Record<string, any> {
  return {
    uri: getVariablesResourceUri(),
    name: 'n8n Variables',
    mimeType: 'application/json',
    description: 'Variables available in the n8n instance',
  };
}
