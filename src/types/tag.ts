/**
 * Tag Management Types
 * 
 * Type definitions for tag management operations.
 * According to the official n8n API, only the following operations are supported:
 * - tag:list
 * - tag:read
 * - tag:create
 * - tag:update
 * - tag:delete
 */

/**
 * Tag structure
 */
export interface Tag {
  /**
   * Tag ID
   */
  id: string;

  /**
   * Tag name
   */
  name: string;

  /**
   * Date the tag was created
   */
  createdAt: string;

  /**
   * Date the tag was last updated
   */
  updatedAt: string;

  /**
   * Tag color as a hex code
   */
  color?: string;

  /**
   * ID of the user who created the tag
   */
  createdBy?: string;

  /**
   * ID of the user who last updated the tag
   */
  updatedBy?: string;
}

/**
 * Parameters for the tag:list tool
 */
export interface TagListParams {
  /**
   * Search term to filter tags
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
 * Parameters for the tag:read tool
 */
export interface TagReadParams {
  /**
   * Tag ID
   */
  id: string;
}

/**
 * Parameters for the tag:create tool
 */
export interface TagCreateParams {
  /**
   * Tag name
   */
  name: string;

  /**
   * Tag color as a hex code
   */
  color?: string;
}

/**
 * Parameters for the tag:update tool
 */
export interface TagUpdateParams {
  /**
   * Tag ID
   */
  id: string;

  /**
   * New tag name
   */
  name?: string;

  /**
   * New tag color as a hex code
   */
  color?: string;
}

/**
 * Parameters for the tag:delete tool
 */
export interface TagDeleteParams {
  /**
   * Tag ID
   */
  id: string;
}


