/**
 * Server Configuration
 * 
 * This module configures the MCP server with tools and resources
 * for n8n workflow management.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getEnvConfig, EnvConfig } from './environment.js'; // Import EnvConfig
import { setupWorkflowTools, ListWorkflowsHandler, GetWorkflowHandler, CreateWorkflowHandler, UpdateWorkflowHandler, DeleteWorkflowHandler, ActivateWorkflowHandler, DeactivateWorkflowHandler } from '../tools/workflow/index.js';
import { setupExecutionTools, ListExecutionsHandler, GetExecutionHandler, DeleteExecutionHandler, RunWebhookHandler } from '../tools/execution/index.js';
import { setupResourceHandlers } from '../resources/index.js';
// Update imports to use N8nApiClient and its factory
import { createN8nApiClient, N8nApiClient } from '../api/n8n-client.js'; 
import { McpError, ErrorCode } from '../errors/index.js'; 

// Import types
import { ToolCallResult, BaseToolHandler } from '../types/index.js'; 

/**
 * Configure and return an MCP server instance with all tools and resources
 * 
 * @returns Configured MCP server instance
 */
export async function configureServer(): Promise<Server> {
  // Get validated environment configuration
  const envConfig = getEnvConfig();
  
  // Create n8n API client instance
  const apiClient = createN8nApiClient(envConfig); // Use new factory function name
  
  // Verify n8n API connectivity
  try {
    console.error('Verifying n8n API connectivity...');
    await apiClient.checkConnectivity(); // Use apiClient instance
    console.error(`Successfully connected to n8n API at ${envConfig.n8nApiUrl}`);
  } catch (error) {
    console.error('ERROR: Failed to connect to n8n API:', error instanceof Error ? error.message : error);
    throw error;
  }

  // Create server instance
  const server = new Server(
    {
      name: 'n8n-mcp-server',
      version: '0.1.0',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // Set up all request handlers, passing the single apiClient instance where needed
  setupToolListRequestHandler(server);
  setupToolCallRequestHandler(server, apiClient); // Pass apiClient
  // Pass envConfig to resource handlers as originally intended
  setupResourceHandlers(server, envConfig); 

  return server;
}

/**
 * Set up the tool list request handler for the server
 * 
 * @param server MCP server instance
 */
function setupToolListRequestHandler(server: Server): void {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    // Combine tools from workflow and execution modules
    const workflowTools = await setupWorkflowTools();
    const executionTools = await setupExecutionTools();

    return {
      tools: [...workflowTools, ...executionTools],
    };
  });
}

/**
 * Set up the tool call request handler for the server
 * 
 * @param server MCP server instance
 * @param apiClient The shared N8nApiClient instance
 */
// Update function signature to accept N8nApiClient
function setupToolCallRequestHandler(server: Server, apiClient: N8nApiClient): void { 

  // Map tool names to their handler classes - Update constructor signature type
  // The constructor now expects N8nApiClient (which is aliased as N8nApiService)
  const toolHandlerMap: Record<string, new (apiClient: N8nApiClient) => BaseToolHandler> = {
    'list_workflows': ListWorkflowsHandler,
    'get_workflow': GetWorkflowHandler,
    'create_workflow': CreateWorkflowHandler,
    'update_workflow': UpdateWorkflowHandler,
    'delete_workflow': DeleteWorkflowHandler,
    'activate_workflow': ActivateWorkflowHandler,
    'deactivate_workflow': DeactivateWorkflowHandler,
    'list_executions': ListExecutionsHandler,
    'get_execution': GetExecutionHandler,
    'delete_execution': DeleteExecutionHandler,
    'run_webhook': RunWebhookHandler,
    // Add other tools here
  };

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = request.params.arguments || {};

    try {
      const HandlerClass = toolHandlerMap[toolName];

      if (!HandlerClass) {
        throw new McpError(ErrorCode.NotImplemented, `Unknown tool: ${toolName}`); // Use NotImplemented
      }

      // Pass the apiClient instance to the constructor
      const handler = new HandlerClass(apiClient); 
      const result: ToolCallResult = await handler.execute(args);

      // Return result in MCP SDK expected format
      return {
        content: result.content,
        isError: result.isError,
      };
    } catch (error) {
      console.error(`Error handling tool call to ${toolName}:`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  });
}
