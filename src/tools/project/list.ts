/**
 * Project List Tool
 * 
 * This tool lists available projects.
 */

import { BaseProjectToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { ProjectListParams, ProjectStatus } from '../../types/project.js';

/**
 * Handler for the project:list tool
 */
export class ProjectListHandler extends BaseProjectToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns List of projects
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { status, ownerId, limit, offset } = args as ProjectListParams;
      
      const projects = await this.projectClient.listProjects(status, ownerId, limit, offset);
      
      const message = `Found ${projects.length} project(s)${status ? ` with status: ${status}` : ''}.`;
      
      return this.formatSuccess(
        projects,
        message
      );
    }, args);
  }
}

/**
 * Get tool definition for the project:list tool
 * 
 * @returns Tool definition
 */
export function getProjectListToolDefinition(): ToolDefinition {
  return {
    name: 'project_list',
    description: 'List available projects',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(ProjectStatus),
          description: 'Filter by project status',
        },
        ownerId: {
          type: 'string',
          description: 'Filter by owner ID',
        },
        limit: {
          type: 'number',
          description: 'Number of results to return',
        },
        offset: {
          type: 'number',
          description: 'Offset for pagination',
        },
      },
      required: [],
    },
  };
}
