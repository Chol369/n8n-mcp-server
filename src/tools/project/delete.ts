/**
 * Project Delete Tool
 * 
 * This tool deletes a project.
 */

import { BaseProjectToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { ProjectDeleteParams } from '../../types/project.js';

/**
 * Handler for the project:delete tool
 */
export class ProjectDeleteHandler extends BaseProjectToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Deletion result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { id, force = false } = args as ProjectDeleteParams;
      
      if (!id) {
        throw new Error('Project ID is required');
      }
      
      const result = await this.projectClient.deleteProject(id, force);
      
      return this.formatSuccess(
        result,
        `Project with ID "${id}" ${force ? 'force ' : ''}deleted successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the project:delete tool
 * 
 * @returns Tool definition
 */
export function getProjectDeleteToolDefinition(): ToolDefinition {
  return {
    name: 'project_delete',
    description: 'Delete a project',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the project to delete',
        },
        force: {
          type: 'boolean',
          description: 'Whether to force delete the project and all its resources',
        },
      },
      required: ['id'],
    },
  };
}
