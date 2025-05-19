/**
 * Project Update Tool
 * 
 * This tool updates an existing project.
 */

import { BaseProjectToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { ProjectUpdateParams, ProjectStatus } from '../../types/project.js';

/**
 * Handler for the project:update tool
 */
export class ProjectUpdateHandler extends BaseProjectToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Updated project
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { id, name, description, status, metadata } = args as ProjectUpdateParams;
      
      if (!id) {
        throw new Error('Project ID is required');
      }
      
      // Create update payload with only provided fields
      const updateData = {
        id, // Required field, already validated above
        name,
        description,
        status,
        metadata
      };
      
      const project = await this.projectClient.updateProject(id, updateData);
      
      return this.formatSuccess(
        project,
        `Project "${project.name}" (${project.id}) updated successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the project:update tool
 * 
 * @returns Tool definition
 */
export function getProjectUpdateToolDefinition(): ToolDefinition {
  return {
    name: 'project_update',
    description: 'Update an existing project',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the project to update',
        },
        name: {
          type: 'string',
          description: 'New name for the project',
        },
        description: {
          type: 'string',
          description: 'New description for the project',
        },
        status: {
          type: 'string',
          enum: Object.values(ProjectStatus),
          description: 'New status for the project',
        },
        metadata: {
          type: 'object',
          description: 'New custom metadata for the project',
        },
      },
      required: ['id'],
    },
  };
}
