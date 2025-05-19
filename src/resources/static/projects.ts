/**
 * Static Projects Resource Handler
 * 
 * This module provides the MCP resource implementation for projects.
 */

import { N8nApiService } from '../../api/n8n-client.js';
import { createProjectClient } from '../../api/project-client.js';
import { McpError, ErrorCode } from '../../errors/index.js';

/**
 * Get projects resource URI
 * 
 * @returns Formatted resource URI
 */
export function getProjectsResourceUri(): string {
  return 'n8n://projects';
}

/**
 * Get projects resource data
 * 
 * @param apiService n8n API service
 * @returns Formatted projects resource data
 */
export async function getProjectsResource(apiService: N8nApiService): Promise<string> {
  try {
    // Create project client from API service
    const projectClient = createProjectClient(apiService.getClient());
    
    // List projects from the API
    const projects = await projectClient.listProjects();
    
    // Group projects by status
    const activeProjects = projects.filter(p => p.status === 'active');
    const draftProjects = projects.filter(p => p.status === 'draft');
    const archivedProjects = projects.filter(p => p.status === 'archived');
    const completedProjects = projects.filter(p => p.status === 'completed');
    
    // Add metadata about the resource
    const result = {
      resourceType: 'projects',
      count: projects.length,
      summary: {
        active: activeProjects.length,
        draft: draftProjects.length,
        archived: archivedProjects.length,
        completed: completedProjects.length,
      },
      recentProjects: projects.slice(0, 5).map(project => ({
        id: project.id,
        name: project.name,
        status: project.status,
        workflowCount: project.workflowIds?.length || 0,
      })),
      _links: {
        self: getProjectsResourceUri(),
      },
      lastUpdated: new Date().toISOString(),
    };
    
    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error('Error fetching projects resource:', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to retrieve projects: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get projects resource metadata
 * 
 * @returns Resource metadata object
 */
export function getProjectsResourceMetadata(): Record<string, any> {
  return {
    uri: getProjectsResourceUri(),
    name: 'n8n Projects',
    mimeType: 'application/json',
    description: 'Projects available in the n8n instance',
  };
}
