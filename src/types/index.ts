/**
 * Core Types Module
 * 
 * This module provides type definitions used throughout the application
 * and bridges compatibility with the MCP SDK.
 */

// Tool definition for MCP tools
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

// Tool call result for MCP tool responses
export interface ToolCallResult {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

// Base interface for tool handlers
export interface BaseToolHandler {
  execute(args: Record<string, any>): Promise<ToolCallResult>;
}

// --- n8n Specific Types ---

// Interface for n8n Node Parameters
export interface NodeParameter {
  // Define common parameter properties if known, otherwise keep flexible
  [key: string]: any; 
}

// Interface for n8n Node
export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: NodeParameter;
  credentials?: Record<string, any>; 
  notes?: string;
  disabled?: boolean;
  [key: string]: any; // Allow other properties
}

// Interface for n8n Connection Data
export interface ConnectionData {
  // Define specific properties if known
  [key: string]: any; 
}

// Interface for n8n Connection
export interface N8nConnection {
  [outputNodeId: string]: {
    [outputType: string]: Array<{
      node: string; // Input node ID
      type: string; // Input type
      data?: ConnectionData; 
    }>;
  };
}

// Interface for n8n Workflow Settings
export interface WorkflowSettings {
  saveExecutionProgress?: boolean;
  saveManualExecutions?: boolean;
  saveDataErrorExecution?: string; // e.g., "all", "none"
  saveDataSuccessExecution?: string; // e.g., "all", "none"
  executionTimeout?: number;
  timezone?: string;
  errorWorkflow?: string;
  [key: string]: any; // Allow other settings
}

// Enhanced Type for n8n workflow object
export interface Workflow {
  id: string;
  name: string;
  active: boolean;
  nodes: N8nNode[]; // Use specific Node type
  connections: N8nConnection; // Use specific Connection type
  createdAt: string;
  updatedAt: string;
  settings?: WorkflowSettings; // Use specific Settings type
  staticData?: Record<string, any> | null;
  tags?: string[]; // Assuming tags are strings
  pinData?: Record<string, any>;
  [key: string]: any; // Keep for flexibility if needed
}

// Interface for n8n Execution Error Details
export interface ExecutionError {
  message?: string;
  stack?: string;
  [key: string]: any;
}

// Interface for n8n Execution Run Data
export interface ExecutionRunData {
  // Define specific properties if known structure exists
  [key: string]: any; 
}

// Enhanced Type for n8n execution object
export interface Execution {
  id: string;
  workflowId: string;
  finished: boolean;
  mode: string; // e.g., 'manual', 'webhook', 'trigger'
  startedAt: string;
  stoppedAt: string | null; // Can be null if running
  status: 'waiting' | 'running' | 'success' | 'error' | 'unknown'; // More specific statuses
  data?: { // Make data optional
    resultData?: { // Make resultData optional
      runData?: ExecutionRunData; // Use specific RunData type
      error?: ExecutionError; // Add error details
    };
  };
  workflowData?: Partial<Workflow>; // Workflow data might be partial
  waitTill?: string | null;
  [key: string]: any; // Keep for flexibility
}
