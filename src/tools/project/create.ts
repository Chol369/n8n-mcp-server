/**
 * Project Create Tool
 * 
 * This tool creates a new project.
 */

import { BaseProjectToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { ProjectCreateParams, ProjectStatus } from '../../types/project.js';

/**
 * Handler for the project:create tool
 */
export class ProjectCreateHandler extends BaseProjectToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Created project
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { name, description, status, metadata } = args as ProjectCreateParams;
      
      if (!name) {
        throw new Error('Project name is required');
      }
      
      const project = await this.projectClient.createProject({
        name,
        description,
        status,
        metadata,
      });
      
      return this.formatSuccess(
        project,
        `Project "${project.name}" created successfully with ID: ${project.id}`
      );
    }, args);
  }
}

/**
 * Get tool definition for the project:create tool
 * 
 * @returns Tool definition
 */
export function getProjectCreateToolDefinition(): ToolDefinition {
  return {
    name: 'project_create',
    description: 'Create a new project',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the project',
        },
        description: {
          type: 'string',
          description: 'Description of the project',
        },
        status: {
          type: 'string',
          enum: Object.values(ProjectStatus),
          description: 'Status of the project',
        },
        metadata: {
          type: 'object',
          description: 'Custom metadata for the project',
        },
      },
      required: ['name'],
    },
  };
}
