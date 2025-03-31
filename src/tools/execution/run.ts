/**
 * Run Execution via Webhook Tool Handler
 * 
 * This module provides a tool for running n8n workflows via webhooks.
 */

import axios, { AxiosRequestConfig } from 'axios'; // Import AxiosRequestConfig
import { z } from 'zod';
import { ToolCallResult, ToolDefinition } from '../../types/index.js'; // Import ToolDefinition
import { BaseExecutionToolHandler } from './base-handler.js';
import { N8nApiError } from '../../errors/index.js';
import { getEnvConfig } from '../../config/environment.js';
import { URL } from 'url';

/**
 * Webhook execution input schema
 */
const runWebhookSchema = z.object({
  workflowName: z.string().describe('Name of the workflow to execute (e.g., "hello-world")'),
  data: z.record(z.any()).optional().describe('Input data to pass to the webhook'),
  headers: z.record(z.string()).optional().describe('Additional headers to send with the request')
});

/**
 * Type for webhook execution parameters
 */
type RunWebhookParams = z.infer<typeof runWebhookSchema>;

/**
 * Handler for the run_webhook tool
 */
export class RunWebhookHandler extends BaseExecutionToolHandler {
  /**
   * Tool definition for execution via webhook
   */
  // Note: Static properties on classes aren't directly usable for instance methods in TS
  // The schema is used within the execute method instead.

  /**
   * Extract N8N base URL from N8N API URL by removing /api/v1
   * @returns N8N base URL
   */
  private getN8nBaseUrl(): string {
    const config = getEnvConfig();
    const apiUrl = new URL(config.n8nApiUrl);
    
    // Remove /api/v1 if it exists in the path
    let path = apiUrl.pathname;
    if (path.endsWith('/api/v1') || path.endsWith('/api/v1/')) {
      path = path.replace(/\/api\/v1\/?$/, '');
    }
    
    // Create a new URL with the base path
    apiUrl.pathname = path;
    return apiUrl.toString();
  }

  /**
   * Validate and execute webhook call
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  async execute(args: RunWebhookParams): Promise<ToolCallResult> { // Use specific args type
    return this.handleExecution(async (args) => { // Pass args to handler
      // Parse and validate arguments using the Zod schema
      // This ensures args conforms to RunWebhookParams
      const params = runWebhookSchema.parse(args); 
      
      // Get environment config for auth credentials
      const config = getEnvConfig();
      
      try {
        // Get the webhook URL with the proper prefix
        const baseUrl = this.getN8nBaseUrl();
        // Ensure workflowName doesn't contain slashes that could break the URL path
        const safeWorkflowName = params.workflowName.replace(/\//g, ''); 
        const webhookPath = `webhook/${safeWorkflowName}`;
        const webhookUrl = new URL(webhookPath, baseUrl).toString();
        
        // Prepare request config with basic auth from environment
        const requestConfig: AxiosRequestConfig = { // Use AxiosRequestConfig type
          headers: {
            'Content-Type': 'application/json',
            ...(params.headers || {})
          },
          auth: {
            username: config.n8nWebhookUsername,
            password: config.n8nWebhookPassword
          }
        };

        // Make the request to the webhook
        const response = await axios.post(
          webhookUrl,
          params.data || {},
          requestConfig
        );

        // Return the webhook response
        return this.formatSuccess({
          status: response.status,
          statusText: response.statusText,
          data: response.data // Assuming response.data is JSON-serializable
        }, 'Webhook executed successfully');
      } catch (error) {
        // Handle error from the webhook request
        if (axios.isAxiosError(error)) {
          let errorMessage = `Webhook execution failed: ${error.message}`;
          
          if (error.response) {
            errorMessage = `Webhook execution failed with status ${error.response.status}: ${error.response.statusText}`;
            // Attempt to stringify response data safely
            let responseDataStr = '';
            try {
              responseDataStr = JSON.stringify(error.response.data, null, 2);
            } catch (stringifyError) {
              responseDataStr = '[Could not stringify response data]';
            }
            // Add explicit check for error.response before accessing status
            const statusCode = error.response?.status || 500; 
            return this.formatError(new N8nApiError(
              `${errorMessage}\n\n${responseDataStr}`,
              statusCode 
            ));
          }
          
          // Cast error.response to any before accessing status
          return this.formatError(new N8nApiError(errorMessage, (error.response as any)?.status || 500)); 
        }
        
        // Re-throw non-axios errors for the base handler to catch
        throw error; 
      }
    }, args); // Pass args to handleExecution
  }
}

/**
 * Get the tool definition for run_webhook
 * 
 * @returns Tool definition object
 */
export function getRunWebhookToolDefinition(): ToolDefinition { // Add return type
  return {
    name: 'run_webhook',
    description: 'Execute a workflow via webhook with optional input data',
    inputSchema: {
      type: 'object',
      properties: {
        workflowName: {
          type: 'string',
          description: 'Name of the workflow to execute (e.g., "hello-world")'
        },
        data: {
          type: 'object',
          description: 'Input data (JSON object) to pass to the webhook',
          // Indicate that properties can be anything for an object
          additionalProperties: true, 
        },
        headers: {
          type: 'object',
          description: 'Additional headers (key-value pairs) to send with the request',
          additionalProperties: { type: 'string' },
        }
      },
      required: ['workflowName']
    }
  };
}
