/**
 * Security Audit Types
 * 
 * Type definitions for security audit generate operation.
 */

/**
 * Security audit result structure
 */
export interface SecurityAuditResult {
  /**
   * Date and time when the audit was generated
   */
  auditDate: string;

  /**
   * Summary of the audit results
   */
  summary: {
    /**
     * Total number of workflows analyzed
     */
    totalWorkflows: number;
    
    /**
     * Total number of issues found
     */
    issuesFound: number;
    
    /**
     * Number of critical severity issues
     */
    criticalIssues: number;
    
    /**
     * Number of high severity issues
     */
    highIssues: number;
    
    /**
     * Number of medium severity issues
     */
    mediumIssues: number;
    
    /**
     * Number of low severity issues
     */
    lowIssues: number;
  };

  /**
   * Detailed results for each workflow
   */
  workflowResults: WorkflowAuditResult[];
}

/**
 * Result of a security audit for a single workflow
 */
export interface WorkflowAuditResult {
  /**
   * ID of the workflow
   */
  workflowId: string;
  
  /**
   * Name of the workflow
   */
  workflowName: string;
  
  /**
   * List of security issues found in the workflow
   */
  issues: SecurityIssue[];
}

/**
 * Security issue structure
 */
export interface SecurityIssue {
  /**
   * Unique identifier for the issue
   */
  id: string;
  
  /**
   * ID of the node where the issue was found
   */
  nodeId?: string;
  
  /**
   * Name of the node where the issue was found
   */
  nodeName?: string;
  
  /**
   * Type of the node where the issue was found
   */
  nodeType?: string;
  
  /**
   * Severity of the issue (critical, high, medium, low)
   */
  severity: 'critical' | 'high' | 'medium' | 'low';
  
  /**
   * Short title describing the issue
   */
  title: string;
  
  /**
   * Detailed description of the issue
   */
  description: string;
  
  /**
   * Recommended fix for the issue
   */
  recommendation?: string;
}

/**
 * Parameters for the securityAudit:generate tool
 */
export interface SecurityAuditGenerateParams {
  /**
   * Optional array of workflow IDs to audit
   * If not provided, all workflows will be audited
   */
  workflowIds?: string[];
}
