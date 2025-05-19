/**
 * Project Management Types
 * 
 * Type definitions for project management operations.
 * According to the official n8n API, only the following operations are supported:
 * - project:list
 * - project:create
 * - project:update
 * - project:delete
 */

/**
 * Project structure
 */
export interface Project {
  /**
   * Project ID
   */
  id: string;

  /**
   * Project name
   */
  name: string;

  /**
   * Project description
   */
  description?: string;

  /**
   * Date the project was created
   */
  createdAt: string;

  /**
   * Date the project was last updated
   */
  updatedAt: string;

  /**
   * ID of the user who created the project
   */
  ownerId: string;

  /**
   * IDs of workflows associated with this project
   */
  workflowIds?: string[];

  /**
   * IDs of credentials associated with this project
   */
  credentialIds?: string[];

  /**
   * IDs of variables associated with this project
   */
  variableIds?: string[];

  /**
   * Project status
   */
  status?: ProjectStatus;

  /**
   * Custom metadata for the project
   */
  metadata?: Record<string, any>;
}

/**
 * Project status
 */
export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DRAFT = 'draft',
  COMPLETED = 'completed'
}

/**
 * Parameters for the project:list tool
 */
export interface ProjectListParams {
  /**
   * Filter by project status
   */
  status?: ProjectStatus;

  /**
   * Filter by owner ID
   */
  ownerId?: string;

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
 * Parameters for the project:create tool
 */
export interface ProjectCreateParams {
  /**
   * Project name
   */
  name: string;

  /**
   * Project description
   */
  description?: string;

  /**
   * Project status
   */
  status?: ProjectStatus;

  /**
   * Custom metadata for the project
   */
  metadata?: Record<string, any>;
}

/**
 * Parameters for the project:update tool
 */
export interface ProjectUpdateParams {
  /**
   * Project ID
   */
  id: string;

  /**
   * Updated project name
   */
  name?: string;

  /**
   * Updated project description
   */
  description?: string;

  /**
   * Updated project status
   */
  status?: ProjectStatus;

  /**
   * Updated custom metadata for the project
   */
  metadata?: Record<string, any>;
}

/**
 * Parameters for the project:delete tool
 */
export interface ProjectDeleteParams {
  /**
   * Project ID
   */
  id: string;

  /**
   * Whether to force delete the project and all its resources
   */
  force?: boolean;
}


