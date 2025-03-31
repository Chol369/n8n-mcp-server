/**
 * List Executions Tool
 * 
 * This tool retrieves a list of workflow executions from n8n.
 */

import { BaseExecutionToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Execution } from '../../types/index.js'; // Import Execution type
import { formatExecutionSummary, summarizeExecutions } from '../../utils/execution-formatter.js';

// Define specific type for list arguments based on ToolDefinition
interface ListExecutionsArgs {
  workflowId?: string;
  status?: 'success' | 'error' | 'waiting' | 'canceled'; // Use specific statuses if known
  limit?: number;
  lastId?: string; // Note: n8n API might not support cursor pagination with lastId easily
  includeSummary?: boolean;
}

/**
 * Handler for the list_executions tool
 */
export class ListExecutionsHandler extends BaseExecutionToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments (workflowId, status, limit, lastId, includeSummary)
   * @returns List of executions
   */
  async execute(args: ListExecutionsArgs): Promise<ToolCallResult> { // Use specific args type
    return this.handleExecution(async (args) => { // Pass args to handler
      // Fetch all executions first (n8n API might require filtering via query params)
      // TODO: Update apiService.getExecutions to accept filter parameters if possible
      const executions: Execution[] = await this.apiService.getExecutions(); 
      
      // Apply filters locally for now
      let filteredExecutions = executions;
      
      // Filter by workflow ID if provided
      if (args.workflowId) {
        filteredExecutions = filteredExecutions.filter(
          (execution: Execution) => execution.workflowId === args.workflowId
        );
      }
      
      // Filter by status if provided
      if (args.status) {
        filteredExecutions = filteredExecutions.filter(
          (execution: Execution) => execution.status === args.status
        );
      }
      
      // TODO: Implement pagination using lastId if the API supports it.
      // This usually requires sorting and finding the index, or specific API params.
      
      // Apply limit if provided (after filtering and potential pagination)
      const limit = args.limit && args.limit > 0 ? args.limit : filteredExecutions.length;
      // Ensure limit is applied correctly after potential pagination logic
      filteredExecutions = filteredExecutions.slice(0, limit); 
      
      // Format the executions for display
      const formattedExecutions = filteredExecutions.map((execution: Execution) => 
        formatExecutionSummary(execution)
      );
      
      // Generate summary if requested (based on the initially fetched, unfiltered list)
      let summary = undefined;
      if (args.includeSummary) {
        // Summarize based on the *original* list before filtering/limiting for accurate stats
        summary = summarizeExecutions(executions); 
      }
      
      // Prepare response data
      const responseData = {
        // Return the filtered and limited list
        executions: formattedExecutions, 
        summary: summary,
        count: formattedExecutions.length, // Count of returned executions
        // Indicate if filters were applied
        filtersApplied: args.workflowId || args.status ? true : false, 
        // Note: totalAvailable might be misleading if pagination isn't fully implemented
        totalAvailable: executions.length, 
      };
      
      return this.formatSuccess(
        responseData,
        `Found ${formattedExecutions.length} execution(s)` + (responseData.filtersApplied ? ' matching filters.' : '.')
      );
    }, args); // Pass args to handleExecution
  }
}

/**
 * Get tool definition for the list_executions tool
 * 
 * @returns Tool definition
 */
export function getListExecutionsToolDefinition(): ToolDefinition {
  return {
    name: 'list_executions',
    description: 'Retrieve a list of workflow executions from n8n, with optional filtering.',
    inputSchema: {
      type: 'object',
      properties: {
        workflowId: {
          type: 'string',
          description: 'Optional ID of workflow to filter executions by',
        },
        status: {
          type: 'string',
          description: 'Optional status to filter by (e.g., success, error, waiting)',
          // Consider using enum if statuses are fixed:
          // enum: ['success', 'error', 'waiting', 'canceled'] 
        },
        limit: {
          type: 'number',
          description: 'Maximum number of executions to return (default: all matching)',
        },
        // lastId is hard to implement without API support for cursor pagination
        // lastId: {
        //   type: 'string',
        //   description: 'ID of the last execution for pagination (if supported)',
        // },
        includeSummary: {
          type: 'boolean',
          description: 'Include summary statistics about all executions (before filtering/limiting)',
          default: false,
        },
      },
      required: [],
    },
  };
}
