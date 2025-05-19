/**
 * Static Tags Resource Handler
 * 
 * This module provides the MCP resource implementation for tags.
 */

import { N8nApiService } from '../../api/n8n-client.js';
import { createTagClient } from '../../api/tag-client.js';
import { McpError, ErrorCode } from '../../errors/index.js';

/**
 * Get tags resource URI
 * 
 * @returns Formatted resource URI
 */
export function getTagsResourceUri(): string {
  return 'n8n://tags';
}

/**
 * Get tags resource data
 * 
 * @param apiService n8n API service
 * @returns Formatted tags resource data
 */
export async function getTagsResource(apiService: N8nApiService): Promise<string> {
  try {
    // Create tag client from API service
    const tagClient = createTagClient(apiService.getClient());
    
    // Get tags from the API
    const tags = await tagClient.listTags();
    
    // Process tag data for display
    const sortedTags = [...tags].sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    // Group tags by color for better organization
    const tagsByColor: Record<string, number> = {};
    tags.forEach(tag => {
      const color = tag.color || 'no-color';
      tagsByColor[color] = (tagsByColor[color] || 0) + 1;
    });
    
    // Add metadata about the resource
    const result = {
      resourceType: 'tags',
      count: tags.length,
      summary: {
        byColor: tagsByColor,
      },
      recentTags: sortedTags.slice(0, 10).map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      })),
      _links: {
        self: getTagsResourceUri(),
      },
      lastUpdated: new Date().toISOString(),
    };
    
    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error('Error fetching tags resource:', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to retrieve tags: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get tags resource metadata
 * 
 * @returns Resource metadata object
 */
export function getTagsResourceMetadata(): Record<string, any> {
  return {
    uri: getTagsResourceUri(),
    name: 'n8n Tags',
    mimeType: 'application/json',
    description: 'Tags available in the n8n instance',
  };
}
