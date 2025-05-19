/**
 * Workflow Tags Management Types
 * 
 * Type definitions for workflow tags management operations.
 * According to the official n8n API, only the following operations are supported:
 * - workflowTags:list
 * - workflowTags:update
 */

import { Tag } from './tag.js';

/**
 * Parameters for the workflowTags:list tool
 */
export interface WorkflowTagsListParams {
  /**
   * ID of the workflow to list tags for
   */
  workflowId: string;
}

/**
 * Parameters for the workflowTags:update tool
 */
export interface WorkflowTagsUpdateParams {
  /**
   * ID of the workflow to update tags for
   */
  workflowId: string;
  
  /**
   * Array of tag IDs to assign to the workflow
   */
  tagIds: string[];
}

/**
 * Response from workflowTags operations
 */
export interface WorkflowTagsResponse {
  /**
   * Array of tags assigned to the workflow
   */
  tags: Tag[];
}
