/**
 * Execution Formatter Utilities
 * 
 * This module provides utility functions for formatting execution data
 * in a consistent, user-friendly manner.
 */

import { Execution, ExecutionRunData, ExecutionError } from '../types/index.js'; // Import specific types

/**
 * Format basic execution information for display
 * 
 * @param execution Execution object
 * @returns Formatted execution summary
 */
export function formatExecutionSummary(execution: Execution): Record<string, any> { // Keep return flexible for now
  // Calculate duration
  const startedAt = new Date(execution.startedAt);
  // Use current time if stoppedAt is null (execution still running)
  const stoppedAt = execution.stoppedAt ? new Date(execution.stoppedAt) : new Date(); 
  const durationMs = stoppedAt.getTime() - startedAt.getTime();
  const durationSeconds = Math.round(durationMs / 1000);
  
  // Create status indicator emoji
  const statusIndicator = getStatusIndicator(execution.status);
  
  return {
    id: execution.id,
    workflowId: execution.workflowId,
    status: `${statusIndicator} ${execution.status}`,
    startedAt: execution.startedAt,
    stoppedAt: execution.stoppedAt || 'In progress',
    duration: `${durationSeconds}s`,
    finished: execution.finished
  };
}

/**
 * Format detailed execution information including node results
 * 
 * @param execution Execution object
 * @returns Formatted execution details
 */
export function formatExecutionDetails(execution: Execution): Record<string, any> { // Keep return flexible
  const summary = formatExecutionSummary(execution);
  
  // Extract node results
  const nodeResults: Record<string, any> = {};
  const runData: ExecutionRunData | undefined = execution.data?.resultData?.runData;

  if (runData) {
    for (const [nodeName, nodeDataArray] of Object.entries(runData)) {
      try {
        // Get the last output object from the node's execution history array
        const lastOutput = Array.isArray(nodeDataArray) && nodeDataArray.length > 0
          ? nodeDataArray[nodeDataArray.length - 1]
          : null;
          
        // Check if the last output has the expected structure
        if (lastOutput && lastOutput.data && Array.isArray(lastOutput.data.main)) {
          // Extract the output data items
          const outputItems = lastOutput.data.main.length > 0 
            ? lastOutput.data.main[0] // Assuming the first element contains the items array
            : [];
            
          nodeResults[nodeName] = {
            status: lastOutput.status,
            items: Array.isArray(outputItems) ? outputItems.length : 0, // Ensure items is an array
            // Limit data preview to avoid overwhelming response
            dataPreview: Array.isArray(outputItems) ? outputItems.slice(0, 3) : [], 
          };
        } else {
           nodeResults[nodeName] = { status: lastOutput?.status || 'unknown', items: 0, dataPreview: [] };
        }
      } catch (error) {
        console.error(`Error parsing node output for ${nodeName}:`, error);
        nodeResults[nodeName] = { error: 'Failed to parse node output' };
      }
    }
  }
  
  // Extract error details if present
  const errorDetails: ExecutionError | undefined = execution.data?.resultData?.error;

  // Add node results and error information to the summary
  return {
    ...summary,
    mode: execution.mode,
    nodeResults: nodeResults,
    error: errorDetails ? { // Use the defined ExecutionError type
      message: errorDetails.message,
      stack: errorDetails.stack, // Include stack if available
    } : undefined,
  };
}

/**
 * Get appropriate status indicator emoji based on execution status
 * 
 * @param status Execution status string
 * @returns Status indicator emoji
 */
export function getStatusIndicator(status: Execution['status']): string { // Use specific status type
  switch (status) {
    case 'success':
      return '✅'; // Success
    case 'error':
      return '❌'; // Error
    case 'waiting':
      return '⏳'; // Waiting
    // Add other potential statuses if known, e.g., 'canceled'
    // case 'canceled': 
    //   return '🛑'; 
    default:
      return '⏱️'; // Running or unknown
  }
}

/**
 * Summarize execution results for more compact display
 * 
 * @param executions Array of execution objects
 * @param limit Maximum number of executions to include
 * @returns Summary of execution results
 */
export function summarizeExecutions(executions: Execution[], limit: number = 10): Record<string, any> { // Keep return flexible
  const limitedExecutions = executions.slice(0, limit);
  
  // Group executions by status
  const byStatus: Record<string, number> = {};
  limitedExecutions.forEach(execution => {
    const status = execution.status || 'unknown';
    byStatus[status] = (byStatus[status] || 0) + 1;
  });
  
  // Calculate success rate
  const totalCount = limitedExecutions.length;
  const successCount = byStatus.success || 0;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;
  
  return {
    total: totalCount,
    byStatus: Object.entries(byStatus).map(([status, count]) => ({
      status: `${getStatusIndicator(status as Execution['status'])} ${status}`, // Cast status
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    })),
    successRate: `${successRate}%`,
    displayed: limitedExecutions.length,
    totalAvailable: executions.length
  };
}
