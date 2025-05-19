/**
 * Workflow Management Types
 * 
 * Type definitions for workflow management operations.
 * According to the official n8n API, the following operations are supported:
 * - workflow:list
 * - workflow:read
 * - workflow:create
 * - workflow:update
 * - workflow:delete
 * - workflow:move
 * - workflow:activate
 * - workflow:deactivate
 */

/**
 * Parameters for the workflow:list tool
 */
export interface WorkflowListParams {
  /**
   * Tag ID to filter by
   */
  tagId?: string;

  /**
   * Search term
   */
  search?: string;

  /**
   * Number of results to return
   */
  limit?: number;

  /**
   * Offset for pagination
   */
  offset?: number;
}

/**
 * Parameters for the workflow:read tool
 */
export interface WorkflowReadParams {
  /**
   * Workflow ID
   */
  workflowId: string;
}

/**
 * Parameters for the workflow:create tool
 */
export interface WorkflowCreateParams {
  /**
   * Workflow name
   */
  name: string;

  /**
   * Workflow nodes
   */
  nodes: any[];

  /**
   * Workflow connections
   */
  connections: any;

  /**
   * Workflow settings
   */
  settings?: Record<string, any>;

  /**
   * Whether the workflow should be active on creation
   */
  active?: boolean;
}

/**
 * Parameters for the workflow:update tool
 */
export interface WorkflowUpdateParams {
  /**
   * Workflow ID
   */
  workflowId: string;

  /**
   * Updated workflow name
   */
  name?: string;

  /**
   * Updated workflow nodes
   */
  nodes?: any[];

  /**
   * Updated workflow connections
   */
  connections?: any;

  /**
   * Updated workflow settings
   */
  settings?: Record<string, any>;
}

/**
 * Parameters for the workflow:delete tool
 */
export interface WorkflowDeleteParams {
  /**
   * Workflow ID
   */
  workflowId: string;
}

/**
 * Parameters for the workflow:move tool
 */
export interface WorkflowMoveParams {
  /**
   * Workflow ID
   */
  id: string;

  /**
   * New owner ID or email
   */
  newOwner: string;
}

/**
 * Parameters for the workflow:activate tool
 */
export interface WorkflowActivateParams {
  /**
   * Workflow ID
   */
  workflowId: string;
}

/**
 * Parameters for the workflow:deactivate tool
 */
export interface WorkflowDeactivateParams {
  /**
   * Workflow ID
   */
  workflowId: string;
}
