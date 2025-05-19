/**
 * Variable Create Tool
 * 
 * This tool creates a new variable.
 */

import { BaseVariableToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { VariableCreateParams, VariableType } from '../../types/variable.js';

/**
 * Handler for the variable:create tool
 */
export class VariableCreateHandler extends BaseVariableToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Created variable
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { key, value, description, type, projectId } = args as VariableCreateParams;
      
      if (!key) {
        throw new Error('Variable key is required');
      }
      
      if (value === undefined || value === null) {
        throw new Error('Variable value is required');
      }
      
      const variable = await this.variableClient.createVariable({
        key,
        value,
        description,
        type,
        projectId,
      });
      
      return this.formatSuccess(
        variable,
        `Variable "${variable.key}" created successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the variable:create tool
 * 
 * @returns Tool definition
 */
export function getVariableCreateToolDefinition(): ToolDefinition {
  return {
    name: 'variable_create',
    description: 'Create a new variable',
    inputSchema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Key (name) of the variable',
        },
        value: {
          type: 'string',
          description: 'Value of the variable',
        },
        description: {
          type: 'string',
          description: 'Description of the variable',
        },
        type: {
          type: 'string',
          enum: Object.values(VariableType),
          description: 'Type of the variable',
        },
        projectId: {
          type: 'string',
          description: 'Project ID to associate the variable with',
        },
      },
      required: ['key', 'value'],
    },
  };
}
