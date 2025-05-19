/**
 * Static Users Resource Handler
 * 
 * This module provides the MCP resource implementation for listing all users.
 */

import { N8nApiService } from '../../api/n8n-client.js';
import { createUserClient } from '../../api/user-client.js';
import { McpError, ErrorCode } from '../../errors/index.js';

/**
 * Get users resource URI
 * 
 * @returns Formatted resource URI
 */
export function getUsersResourceUri(): string {
  return 'n8n://users';
}

/**
 * Get users resource data
 * 
 * @param apiService n8n API service
 * @returns Formatted users resource data
 */
export async function getUsersResource(apiService: N8nApiService): Promise<string> {
  try {
    // Create user client from API service
    const userClient = createUserClient(apiService.getClient());
    
    // Get all users from the API
    const users = await userClient.listUsers();
    
    // Format users for display, omitting sensitive information
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isPending: user.isPending,
      createdAt: user.createdAt,
    }));
    
    // Add metadata about the resource
    const result = {
      resourceType: 'users',
      count: formattedUsers.length,
      users: formattedUsers,
      _links: {
        self: getUsersResourceUri(),
      },
      lastUpdated: new Date().toISOString(),
    };
    
    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error('Error fetching users resource:', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to retrieve users: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get users resource metadata
 * 
 * @returns Resource metadata object
 */
export function getUsersResourceMetadata(): Record<string, any> {
  return {
    uri: getUsersResourceUri(),
    name: 'n8n Users',
    mimeType: 'application/json',
    description: 'List of all users in the n8n instance with their basic information',
  };
}
