/**
 * Security Audit Generate Tool
 * 
 * This tool generates a security audit for n8n workflows.
 */

import { ToolDefinition, ToolCallResult } from '../../types/index.js';
import { BaseSecurityAuditHandler } from './base-handler.js';

/**
 * Get the security audit generate tool definition
 * 
 * @returns Tool definition for generating a security audit
 */
export function getSecurityAuditGenerateToolDefinition(): ToolDefinition {
  return {
    name: 'security_audit_generate',
    description: 'Generate a security audit for n8n workflows',
    inputSchema: {
      type: 'object',
      properties: {
        workflowIds: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Optional array of workflow IDs to audit. If not provided, all workflows will be audited.',
        },
      },
      required: [],
    },
  };
}

/**
 * Handler for generating a security audit
 */
export class SecurityAuditGenerateHandler extends BaseSecurityAuditHandler {
  /**
   * Execute the security audit generate tool
   * 
   * @param args Tool arguments
   * @returns Tool call result
   */
  public async execute(args: Record<string, any>): Promise<ToolCallResult> {
    try {
      // Use our security audit client to generate the audit
      const workflowIds = args.workflowIds || [];
      const auditResults = await this.securityAuditClient.generateAudit(workflowIds.length > 0 ? workflowIds : undefined);
      
      return this.formatSuccess(
        auditResults,
        `Successfully generated security audit for ${auditResults.summary.totalWorkflows} workflows`
      );
    } catch (error) {
      return this.formatError(error instanceof Error ? error : String(error));
    }
  }
}