/**
 * Source Control Pull Tool
 * 
 * This tool pulls changes from the remote repository.
 */

import { BaseSourceControlToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { SourceControlPullParams } from '../../types/source-control.js';

/**
 * Handler for the sourceControl:pull tool
 */
export class SourceControlPullHandler extends BaseSourceControlToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns Pull operation result
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const { force = false } = args as SourceControlPullParams;
      
      const result = await this.sourceControlClient.pullChanges(force);
      
      let message = result.success 
        ? `Successfully pulled changes. ${result.filesUpdated} files updated.` 
        : 'Failed to pull changes.';
      
      if (result.hasConflicts) {
        message += ` Conflicts detected in ${result.conflicts?.length || 0} file(s).`;
      }
      
      return this.formatSuccess(
        result,
        message
      );
    });
  }
}

/**
 * Get tool definition for the sourceControl:pull tool
 * 
 * @returns Tool definition
 */
export function getSourceControlPullToolDefinition(): ToolDefinition {
  return {
    name: 'source_control_pull',
    description: 'Pull changes from the remote source control repository',
    inputSchema: {
      type: 'object',
      properties: {
        force: {
          type: 'boolean',
          description: 'Whether to force pull (discard local changes)',
        },
      },
      required: [],
    },
  };
}
