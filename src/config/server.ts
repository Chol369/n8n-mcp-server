/**
 * Server Configuration
 * 
 * This module configures the MCP server with tools and resources
 * for n8n workflow management.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getEnvConfig } from './environment.js';
import { setupWorkflowTools } from '../tools/workflow/index.js';
import { setupExecutionTools } from '../tools/execution/index.js';
import { setupResourceHandlers } from '../resources/index.js';
import { createApiService } from '../api/n8n-client.js';
import { setupUserTools } from '../tools/user/index.js';
import { setupSourceControlTools } from '../tools/source-control/index.js';
import { setupSecurityAuditTools } from '../tools/security-audit/index.js';
import { setupWorkflowTagTools } from '../tools/workflow-tag/index.js';
import { setupProjectTools } from '../tools/project/index.js';
import { setupVariableTools } from '../tools/variable/index.js';
import { setupTagTools } from '../tools/tag/index.js';
import { setupCredentialTools } from '../tools/credential/index.js';

// Import types
import { ToolCallResult } from '../types/index.js';

/**
 * Configure and return an MCP server instance with all tools and resources
 * 
 * @returns Configured MCP server instance
 */
export async function configureServer(): Promise<Server> {
  // Get validated environment configuration
  const envConfig = getEnvConfig();
  
  // Create n8n API service
  const apiService = createApiService(envConfig);
  
  // Verify n8n API connectivity
  try {
    console.error('Verifying n8n API connectivity...');
    await apiService.checkConnectivity();
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

  // Set up all request handlers
  setupToolListRequestHandler(server);
  setupToolCallRequestHandler(server);
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
    // Combine tools from all modules
    const workflowTools = await setupWorkflowTools();
    const executionTools = await setupExecutionTools();
    const tagTools = await setupTagTools();
    const variableTools = await setupVariableTools();
    const projectTools = await setupProjectTools();
    const securityAuditTools = await setupSecurityAuditTools();
    const sourceControlTools = await setupSourceControlTools();
    const userTools = await setupUserTools();
    const credentialTools = await setupCredentialTools();
    const workflowTagTools = await setupWorkflowTagTools();
    
    // All tools are now registered via setupXxxTools functions

    return {
      tools: [
        ...workflowTools, 
        ...executionTools, 
        ...tagTools, 
        ...variableTools, 
        ...projectTools, 
        ...securityAuditTools, 
        ...sourceControlTools,
        ...userTools,
        ...credentialTools,
        ...workflowTagTools
      ],
    };
  });
}

/**
 * Set up the tool call request handler for the server
 * 
 * @param server MCP server instance
 */
function setupToolCallRequestHandler(server: Server): void {
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;
    const args = request.params.arguments || {};

    let result: ToolCallResult;

    try {
      // Import handlers - all officially supported workflow operations
      const { 
        ListWorkflowsHandler, 
        ReadWorkflowHandler,
        CreateWorkflowHandler,
        UpdateWorkflowHandler,
        DeleteWorkflowHandler,
        MoveWorkflowHandler,
        ActivateWorkflowHandler,
        DeactivateWorkflowHandler
      } = await import('../tools/workflow/index.js');
      
      const {
        ListExecutionsHandler,
        GetExecutionHandler,
        DeleteExecutionHandler,
        RunWebhookHandler,
        ExecuteWorkflowHandler,
        StopExecutionHandler
      } = await import('../tools/execution/index.js');
      
      // Import tag tool handlers - only the officially supported ones
      const {
        TagListHandler,
        TagReadHandler,
        TagCreateHandler,
        TagUpdateHandler,
        TagDeleteHandler
      } = await import('../tools/tag/index.js');
      
      // Import variable tool handlers - only the officially supported ones
      const {
        VariableListHandler,
        VariableCreateHandler,
        VariableDeleteHandler
      } = await import('../tools/variable/index.js');
      
      // Import project tool handlers - only the officially supported ones
      const {
        ProjectListHandler,
        ProjectCreateHandler,
        ProjectUpdateHandler,
        ProjectDeleteHandler
      } = await import('../tools/project/index.js');
      
      // Import security audit tool handler - only the officially supported one
      const {
        SecurityAuditGenerateHandler
      } = await import('../tools/security-audit/index.js');
      
      // Import source control tool handler - only the officially supported one
      const {
        SourceControlPullHandler
      } = await import('../tools/source-control/index.js');
      
      // Import user tool handlers
      const {
        UserReadHandler,
        UserListHandler,
        UserCreateHandler,
        UserChangeRoleHandler,
        UserDeleteHandler
      } = await import('../tools/user/index.js');
      
      // Import credential tool handlers
      const {
        CredentialCreateHandler,
        CredentialMoveHandler,
        CredentialDeleteHandler
      } = await import('../tools/credential/index.js');
      
      // Import workflow tag tool handlers
      const {
        ListWorkflowTagsHandler,
        UpdateWorkflowTagsHandler
      } = await import('../tools/workflow-tag/index.js');
      
      // Route the tool call to the appropriate handler - workflow operations use official n8n API naming
      if (toolName === 'list_workflows') {
        const handler = new ListWorkflowsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'workflow_read') {
        const handler = new ReadWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'create_workflow') {
        const handler = new CreateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'update_workflow') {
        const handler = new UpdateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'delete_workflow') {
        const handler = new DeleteWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'activate_workflow') {
        const handler = new ActivateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'workflow_move') {
        const handler = new MoveWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'deactivate_workflow') {
        const handler = new DeactivateWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'list_executions') {
        const handler = new ListExecutionsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'get_execution') {
        const handler = new GetExecutionHandler();
        result = await handler.execute(args);
      } else if (toolName === 'delete_execution') {
        const handler = new DeleteExecutionHandler();
        result = await handler.execute(args);
      } else if (toolName === 'run_webhook') {
        const handler = new RunWebhookHandler();
        result = await handler.execute(args);
      } else if (toolName === 'execution_run') {
        const handler = new ExecuteWorkflowHandler();
        result = await handler.execute(args);
      } else if (toolName === 'execution_stop') {
        const handler = new StopExecutionHandler();
        result = await handler.execute(args);
      } 
      // Tag tool handlers - only the officially supported ones
      else if (toolName === 'tag_list') {
        const handler = new TagListHandler();
        result = await handler.execute(args);
      } else if (toolName === 'tag_read') {
        const handler = new TagReadHandler();
        result = await handler.execute(args);
      } else if (toolName === 'tag_create') {
        const handler = new TagCreateHandler();
        result = await handler.execute(args);
      } else if (toolName === 'tag_update') {
        const handler = new TagUpdateHandler();
        result = await handler.execute(args);
      } else if (toolName === 'tag_delete') {
        const handler = new TagDeleteHandler();
        result = await handler.execute(args);
      }
      // Variable tool handlers - only the officially supported ones
      else if (toolName === 'variable_list') {
        const handler = new VariableListHandler();
        result = await handler.execute(args);
      } else if (toolName === 'variable_create') {
        const handler = new VariableCreateHandler();
        result = await handler.execute(args);
      } else if (toolName === 'variable_delete') {
        const handler = new VariableDeleteHandler();
        result = await handler.execute(args);
      }
      // Project tool handlers - only the officially supported ones
      else if (toolName === 'project_list') {
        const handler = new ProjectListHandler();
        result = await handler.execute(args);
      } else if (toolName === 'project_create') {
        const handler = new ProjectCreateHandler();
        result = await handler.execute(args);
      } else if (toolName === 'project_update') {
        const handler = new ProjectUpdateHandler();
        result = await handler.execute(args);
      } else if (toolName === 'project_delete') {
        const handler = new ProjectDeleteHandler();
        result = await handler.execute(args);
      }
      // Security audit tool handler - only the officially supported one
      else if (toolName === 'security_audit_generate') {
        const handler = new SecurityAuditGenerateHandler();
        result = await handler.execute(args);
      }
      // Source control tool handler - only the officially supported one
      else if (toolName === 'source_control_pull') {
        const handler = new SourceControlPullHandler();
        result = await handler.execute(args);
      }
      // User tool handlers
      else if (toolName === 'user_read') {
        const handler = new UserReadHandler();
        result = await handler.execute(args);
      } else if (toolName === 'user_list') {
        const handler = new UserListHandler();
        result = await handler.execute(args);
      } else if (toolName === 'user_create') {
        const handler = new UserCreateHandler();
        result = await handler.execute(args);
      } else if (toolName === 'user_change_role') {
        const handler = new UserChangeRoleHandler();
        result = await handler.execute(args);
      } else if (toolName === 'user_delete') {
        const handler = new UserDeleteHandler();
        result = await handler.execute(args);
      }
      // Credential tool handlers
      else if (toolName === 'credential_create') {
        const handler = new CredentialCreateHandler();
        result = await handler.execute(args);
      } else if (toolName === 'credential_move') {
        const handler = new CredentialMoveHandler();
        result = await handler.execute(args);
      } else if (toolName === 'credential_delete') {
        const handler = new CredentialDeleteHandler();
        result = await handler.execute(args);
      }
      // Workflow tag tool handlers
      else if (toolName === 'workflow_tags_list') {
        const handler = new ListWorkflowTagsHandler();
        result = await handler.execute(args);
      } else if (toolName === 'workflow_tags_update') {
        const handler = new UpdateWorkflowTagsHandler();
        result = await handler.execute(args);
      } else {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      // Return the result in MCP SDK expected format
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