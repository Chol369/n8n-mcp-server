/**
 * Workflow Tags Resource Definitions
 * 
 * This module provides resource definitions for workflow tags operations.
 */

import { N8nApiService } from '../../api/n8n-client.js';

/**
 * Resource definition for workflow tags management
 */
export const workflowTagsResources = {
  /**
   * List tags for a workflow
   */
  list: {
    id: 'workflowTags:list',
    name: 'workflowTags:list',
    description: 'List tags for a specific workflow',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to list tags for'
        }
      },
      required: ['workflowId']
    }
  },
  
  /**
   * Update tags for a workflow
   */
  update: {
    id: 'workflowTags:update',
    name: 'workflowTags:update',
    description: 'Update tags for a specific workflow',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'ID of the workflow to update tags for'
        },
        tagIds: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Array of tag IDs to assign to the workflow'
        }
      },
      required: ['workflowId', 'tagIds']
    }
  }
};

/**
 * Get the workflow tags resources URI
 * 
 * @returns URI for the workflow tags resources
 */
export function getWorkflowTagsResourceUri(): string {
  return 'n8n:workflow-tags';
}

/**
 * Get metadata for workflow tags resources
 * 
 * @returns Metadata for workflow tags resources
 */
export function getWorkflowTagsResourceMetadata(): any {
  return {
    name: 'Workflow Tags Operations',
    description: 'Operations for managing tags assigned to workflows',
    resources: [
      {
        ...workflowTagsResources.list,
        uri: getWorkflowTagsResourceUri()
      },
      {
        ...workflowTagsResources.update,
        uri: getWorkflowTagsResourceUri()
      }
    ]
  };
}

/**
 * Get the workflow tags resource content
 * 
 * @param apiService The n8n API service instance
 * @returns JSON string representing the workflow tags resource
 */
export async function getWorkflowTagsResource(apiService: N8nApiService): Promise<string> {
  return JSON.stringify({
    tools: Object.values(workflowTagsResources).map(resource => ({
      ...resource,
      uri: getWorkflowTagsResourceUri()
    }))
  });
}
