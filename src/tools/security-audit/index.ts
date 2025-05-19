/**
 * Security Audit Tools Module
 * 
 * This module provides MCP tools for interacting with n8n security audits.
 */

import { ToolDefinition } from '../../types/index.js';

// Import only the officially supported generate tool
// According to n8n API, only securityAudit:generate is officially allowed
import { getSecurityAuditGenerateToolDefinition, SecurityAuditGenerateHandler } from './generate.js';

// Export only the officially supported handler
export {
  SecurityAuditGenerateHandler
};

/**
 * Set up security audit tools
 * 
 * @returns Array of security audit tool definitions
 */
export async function setupSecurityAuditTools(): Promise<ToolDefinition[]> {
  return [
    getSecurityAuditGenerateToolDefinition()
  ];
}
