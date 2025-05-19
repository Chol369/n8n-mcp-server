/**
 * Variable Management Types
 * 
 * Type definitions for variable management operations.
 * According to the official n8n API, only the following operations are supported:
 * - variable:list
 * - variable:create
 * - variable:delete
 */

/**
 * Variable structure
 */
export interface Variable {
  /**
   * Variable ID
   */
  id: string;

  /**
   * Variable key (name)
   */
  key: string;

  /**
   * Variable value
   */
  value: string;

  /**
   * Variable description
   */
  description?: string;

  /**
   * Date the variable was created
   */
  createdAt: string;

  /**
   * Date the variable was last updated
   */
  updatedAt: string;

  /**
   * Optional project ID this variable is associated with
   */
  projectId?: string;

  /**
   * Whether the variable is a system variable
   */
  isSystem?: boolean;

  /**
   * Variable type
   */
  type?: VariableType;
}

/**
 * Variable type
 */
export enum VariableType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  CREDENTIAL = 'credential',
  SECRET = 'secret',
  EXPRESSION = 'expression',
  CONFIGURATION = 'configuration',
  CUSTOM = 'custom'
}

/**
 * Parameters for the variable:list tool
 */
export interface VariableListParams {
  /**
   * Filter by project ID
   */
  projectId?: string;

  /**
   * Filter by variable type
   */
  type?: VariableType;

  /**
   * Whether to include system variables
   */
  includeSystem?: boolean;

  /**
   * Whether to include variable values in the response
   */
  includeValues?: boolean;

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
 * Parameters for the variable:create tool
 */
export interface VariableCreateParams {
  /**
   * Variable key (name)
   */
  key: string;

  /**
   * Variable value
   */
  value: string;

  /**
   * Variable description
   */
  description?: string;

  /**
   * Variable type
   */
  type?: VariableType;

  /**
   * Optional project ID to associate the variable with
   */
  projectId?: string;
}



/**
 * Parameters for the variable:delete tool
 */
export interface VariableDeleteParams {
  /**
   * Variable ID to delete
   */
  id?: string;

  /**
   * Variable key (name) to delete, can be used instead of ID
   */
  key?: string;

  /**
   * Project ID to look in when deleting by key
   */
  projectId?: string;
}


