/**
 * Static Security Audit Resource Handler
 * 
 * This module provides the MCP resource implementation for security audit status.
 */

import { N8nApiService } from '../../api/n8n-client.js';
import { createSecurityAuditClient } from '../../api/security-audit-client.js';
import { McpError, ErrorCode } from '../../errors/index.js';

/**
 * Get security audit resource URI
 * 
 * @returns Formatted resource URI
 */
export function getSecurityAuditResourceUri(): string {
  return 'n8n://security-audit';
}

/**
 * Get security audit resource data
 * 
 * @param apiService n8n API service
 * @returns Formatted security audit resource data
 */
export async function getSecurityAuditResource(apiService: N8nApiService): Promise<string> {
  try {
    // Create security audit client from API service
    const securityAuditClient = createSecurityAuditClient(apiService.getClient());
    
    // Generate an audit for all workflows
    const auditResult = await securityAuditClient.generateAudit();
    
    // Extract summary data
    const { summary } = auditResult;
    
    // Determine overall status
    let status = 'secure';
    if (summary.criticalIssues > 0) {
      status = 'critical';
    } else if (summary.highIssues > 0) {
      status = 'high';
    } else if (summary.mediumIssues > 0) {
      status = 'medium';
    } else if (summary.lowIssues > 0) {
      status = 'low';
    }
    
    // Get up to 5 recent issues across all workflows
    const recentIssues = [];
    let count = 0;
    
    for (const workflow of auditResult.workflowResults) {
      for (const issue of workflow.issues) {
        if (count < 5) {
          recentIssues.push({
            id: issue.id,
            workflowId: workflow.workflowId,
            workflowName: workflow.workflowName,
            title: issue.title,
            severity: issue.severity,
            nodeName: issue.nodeName || 'Unknown'
          });
          count++;
        } else {
          break;
        }
      }
      if (count >= 5) break;
    }
    
    // Add metadata about the resource
    const result = {
      resourceType: 'securityAudit',
      status,
      summary: {
        totalWorkflows: summary.totalWorkflows,
        totalIssues: summary.issuesFound,
        criticalIssues: summary.criticalIssues,
        highIssues: summary.highIssues,
        mediumIssues: summary.mediumIssues,
        lowIssues: summary.lowIssues
      },
      recentIssues,
      _links: {
        self: getSecurityAuditResourceUri(),
      },
      lastUpdated: auditResult.auditDate,
    };
    
    return JSON.stringify(result, null, 2);
  } catch (error) {
    console.error('Error generating security audit resource:', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to generate security audit: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get security audit resource metadata
 * 
 * @returns Resource metadata object
 */
export function getSecurityAuditResourceMetadata(): Record<string, any> {
  return {
    uri: getSecurityAuditResourceUri(),
    name: 'n8n Security Audit',
    mimeType: 'application/json',
    description: 'Security audit status and summary for the n8n instance',
  };
}
