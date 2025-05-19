/**
 * Variable Delete Tool
 * 
 * This tool deletes a variable.
 */

import { BaseVariableToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { VariableDeleteParams } from '../../types/variable.js';

/**
 * Handler for the variable:delete tool
 */
export class VariableDeleteHandler extends BaseVariableToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Deletion result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { id, key, projectId } = args as VariableDeleteParams;
      
      if (!id && !key) {
        throw new Error('Either variable ID or key is required');
      }
      
      let result;
      
      if (id) {
        result = await this.variableClient.deleteVariableById(id);
      } else if (key) {
        // The deleteVariableByKey method doesn't exist in the VariableClient
        // We need to find the variable by key first, then delete it by ID
        const variables = await this.variableClient.listVariables(projectId);
        const variable = variables.find(v => v.key === key);
        
        if (!variable) {
          throw new Error(`Variable with key "${key}" not found`);
        }
        
        result = await this.variableClient.deleteVariableById(variable.id);
      }
      
      return this.formatSuccess(
        result,
        `Variable ${id ? `with ID ${id}` : `with key "${key}"`} deleted successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the variable:delete tool
 * 
 * @returns Tool definition
 */
export function getVariableDeleteToolDefinition(): ToolDefinition {
  return {
    name: 'variable_delete',
    description: 'Delete a variable',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the variable to delete',
        },
        key: {
          type: 'string',
          description: 'Key (name) of the variable to delete, can be used instead of ID',
        },
        projectId: {
          type: 'string',
          description: 'Project ID to look in when deleting by key',
        },
      },
      required: [],
    },
  };
}
