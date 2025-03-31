/**
 * Create Workflow Tool
 * 
 * This tool creates a new workflow in n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Workflow, N8nNode, N8nConnection } from '../../types/index.js'; // Import specific types
import { N8nApiError } from '../../errors/index.js';

// Define specific type for create arguments based on ToolDefinition
interface CreateWorkflowArgs {
  name: string;
  nodes?: N8nNode[];
  connections?: N8nConnection;
  active?: boolean;
  tags?: string[];
}

/**
 * Handler for the create_workflow tool
 */
export class CreateWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow details
   * @returns Created workflow information
   */
  async execute(args: CreateWorkflowArgs): Promise<ToolCallResult> { // Use specific args type
    return this.handleExecution(async (args) => {
      const { name, nodes, connections, active, tags } = args;
      
      if (!name) {
        // This check might be redundant if 'name' is required in schema, but good for safety
        throw new N8nApiError('Missing required parameter: name'); 
      }
      
      // Basic validation (more robust validation could use Zod or similar)
      if (nodes && !Array.isArray(nodes)) {
        throw new N8nApiError('Parameter "nodes" must be an array');
      }
      if (connections && typeof connections !== 'object') {
        throw new N8nApiError('Parameter "connections" must be an object');
      }
      if (tags && !Array.isArray(tags)) {
        throw new N8nApiError('Parameter "tags" must be an array of strings');
      }
      
      // Prepare workflow object using Partial<Workflow> for the API call
      const workflowData: Partial<Workflow> = {
        name,
        active: active === true, // Default to false if not specified or undefined
        nodes: nodes || [], // Default to empty array if not provided
        connections: connections || {}, // Default to empty object if not provided
        tags: tags || [], // Default to empty array if not provided
      };
      
      // Create the workflow
      const createdWorkflow = await this.apiService.createWorkflow(workflowData);
      
      // Return summary of the created workflow
      return this.formatSuccess(
        {
          id: createdWorkflow.id,
          name: createdWorkflow.name,
          active: createdWorkflow.active
        },
        `Workflow created successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the create_workflow tool
 * 
 * @returns Tool definition
 */
export function getCreateWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'create_workflow',
    description: 'Create a new workflow in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the workflow',
        },
        nodes: {
          type: 'array',
          description: 'Array of node objects (N8nNode structure) defining the workflow',
          items: {
            type: 'object', // Ideally, reference a detailed N8nNode schema here
          },
        },
        connections: {
          type: 'object',
          description: 'Connection mappings between nodes (N8nConnection structure)',
        },
        active: {
          type: 'boolean',
          description: 'Whether the workflow should be active upon creation (defaults to false)',
        },
        tags: {
          type: 'array',
          description: 'Tags to associate with the workflow',
          items: {
            type: 'string',
          },
        },
      },
      required: ['name'],
    },
  };
}
