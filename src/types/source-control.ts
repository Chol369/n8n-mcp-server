/**
 * Source Control Types
 * 
 * This module provides type definitions for source control operations.
 * According to the official n8n API, only the sourceControl:pull operation is supported.
 */

/**
 * Source control pull result structure
 */
export interface SourceControlPullResult {
  /**
   * Whether the pull was successful
   */
  success: boolean;
  
  /**
   * Number of files that were updated
   */
  filesUpdated: number;
  
  /**
   * Whether there were merge conflicts
   */
  hasConflicts: boolean;
  
  /**
   * Files with merge conflicts
   */
  conflicts?: string[];
  
  /**
   * Message from the pull operation
   */
  message?: string;

  /**
   * Error message, if any
   */
  error?: string;
}

/**
 * Parameters for the sourceControl:pull tool
 */
export interface SourceControlPullParams {
  /**
   * Whether to force pull (discard local changes)
   */
  force?: boolean;
}
