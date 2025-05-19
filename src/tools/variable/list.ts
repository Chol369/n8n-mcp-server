/**
 * Variable List Tool
 * 
 * This tool lists available variables.
 */

import { BaseVariableToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { VariableListParams, VariableType } from '../../types/variable.js';

/**
 * Handler for the variable:list tool
 */
export class VariableListHandler extends BaseVariableToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns List of variables
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { 
        projectId, 
        type, 
        includeSystem, 
        includeValues, 
        limit, 
        offset 
      } = args as VariableListParams;
      
      const variables = await this.variableClient.listVariables(
        projectId,
        type,
        includeSystem,
        includeValues,
        limit,
        offset
      );
      
      let message = `Found ${variables.length} variable(s)`;
      
      if (projectId) {
        message += ` for project ${projectId}`;
      }
      
      if (type) {
        message += ` of type ${type}`;
      }
      
      message += '.';
      
      return this.formatSuccess(
        variables,
        message
      );
    }, args);
  }
}

/**
 * Get tool definition for the variable:list tool
 * 
 * @returns Tool definition
 */
export function getVariableListToolDefinition(): ToolDefinition {
  return {
    name: 'variable_list',
    description: 'List available variables',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          description: 'Filter by project ID',
        },
        type: {
          type: 'string',
          enum: Object.values(VariableType),
          description: 'Filter by variable type',
        },
        includeSystem: {
          type: 'boolean',
          description: 'Whether to include system variables',
        },
        includeValues: {
          type: 'boolean',
          description: 'Whether to include variable values in the response',
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
