/**
 * n8n API Service Interface
 * 
 * This module provides a service layer for interacting with the n8n API.
 * It delegates to specialized client classes for different API domains.
 */

import { N8nApiClient } from './client.js';
import { EnvConfig } from '../config/environment.js';
import { Workflow, Execution } from '../types/index.js';

// Import specialized client classes
import { WorkflowClient, createWorkflowClient } from './workflow-client.js';
import { ExecutionClient, createExecutionClient } from './execution-client.js';
import { CredentialClient, createCredentialClient } from './credential-client.js';
import { UserClient, createUserClient } from './user-client.js';
import { SourceControlClient, createSourceControlClient } from './source-control-client.js';
import { SecurityAuditClient, createSecurityAuditClient } from './security-audit-client.js';
import { ProjectClient, createProjectClient } from './project-client.js';
import { VariableClient, createVariableClient } from './variable-client.js';
import { TagClient, createTagClient } from './tag-client.js';
import { WorkflowTagClient, createWorkflowTagClient } from './workflow-tag-client.js';

/**
 * n8n API service - provides functions for interacting with n8n API
 * 
 * This service delegates to specialized clients for different API domains
 */
export class N8nApiService {
  private client: N8nApiClient;
  private workflowClient: WorkflowClient;
  private executionClient: ExecutionClient;
  private credentialClient: CredentialClient;
  private userClient: UserClient;
  private sourceControlClient: SourceControlClient;
  private securityAuditClient: SecurityAuditClient;
  private projectClient: ProjectClient;
  private variableClient: VariableClient;
  private tagClient: TagClient;
  private workflowTagClient: WorkflowTagClient;

  /**
   * Create a new n8n API service
   * 
   * @param config Environment configuration
   */
  constructor(config: EnvConfig) {
    this.client = new N8nApiClient(config);
    
    // Initialize specialized clients
    this.workflowClient = createWorkflowClient(this.client);
    this.executionClient = createExecutionClient(this.client);
    this.credentialClient = createCredentialClient(this.client);
    this.userClient = createUserClient(this.client);
    this.sourceControlClient = createSourceControlClient(this.client);
    this.securityAuditClient = createSecurityAuditClient(this.client);
    this.projectClient = createProjectClient(this.client);
    this.variableClient = createVariableClient(this.client);
    this.tagClient = createTagClient(this.client);
    this.workflowTagClient = createWorkflowTagClient(this.client);
  }

  /**
   * Check connectivity to the n8n API
   */
  async checkConnectivity(): Promise<void> {
    return this.client.checkConnectivity();
  }

  /**
   * Get the API client
   * 
   * @returns The N8nApiClient instance
   */
  getClient(): N8nApiClient {
    return this.client;
  }

  /**
   * Get the workflow client
   * 
   * @returns The WorkflowClient instance
   */
  getWorkflowClient(): WorkflowClient {
    return this.workflowClient;
  }

  /**
   * Get the execution client
   * 
   * @returns The ExecutionClient instance
   */
  getExecutionClient(): ExecutionClient {
    return this.executionClient;
  }

  /**
   * Get the credential client
   * 
   * @returns The CredentialClient instance
   */
  getCredentialClient(): CredentialClient {
    return this.credentialClient;
  }

  /**********************************/
  /* Workflow Operations            */
  /**********************************/

  /**
   * Get all workflows from n8n
   * 
   * @param tagId Optional tag ID to filter by
   * @param search Optional search term
   * @param limit Optional limit of results to return
   * @param offset Optional offset for pagination
   * @returns Array of workflow objects
   */
  async getWorkflows(
    tagId?: string,
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<Workflow[]> {
    return this.workflowClient.listWorkflows(tagId, search, limit, offset);
  }

  /**
   * Get a specific workflow by ID
   * 
   * @param id Workflow ID
   * @returns Workflow object
   */
  async getWorkflow(id: string): Promise<Workflow> {
    return this.workflowClient.readWorkflow(id);
  }

  /**
   * Execute a workflow by ID
   * 
   * @param id Workflow ID
   * @param data Optional data to pass to the workflow
   * @returns Execution result
   */
  async executeWorkflow(id: string, data?: Record<string, any>): Promise<any> {
    return this.workflowClient.executeWorkflow(id, data);
  }

  /**
   * Create a new workflow
   * 
   * @param workflow Workflow object to create
   * @returns Created workflow
   */
  async createWorkflow(workflow: Record<string, any>): Promise<Workflow> {
    return this.workflowClient.createWorkflow(workflow);
  }

  /**
   * Update an existing workflow
   * 
   * @param id Workflow ID
   * @param workflow Updated workflow object
   * @returns Updated workflow
   */
  async updateWorkflow(id: string, workflow: Record<string, any>): Promise<Workflow> {
    return this.workflowClient.updateWorkflow(id, workflow);
  }

  /**
   * Delete a workflow
   * 
   * @param id Workflow ID
   * @returns Deleted workflow or success message
   */
  async deleteWorkflow(id: string): Promise<any> {
    return this.workflowClient.deleteWorkflow(id);
  }

  /**
   * Activate a workflow
   * 
   * @param id Workflow ID
   * @returns Activated workflow
   */
  async activateWorkflow(id: string): Promise<Workflow> {
    return this.workflowClient.activateWorkflow(id);
  }

  /**
   * Deactivate a workflow
   * 
   * @param id Workflow ID
   * @returns Deactivated workflow
   */
  async deactivateWorkflow(id: string): Promise<Workflow> {
    return this.workflowClient.deactivateWorkflow(id);
  }
  
  /**
   * Move workflow to a different owner
   * 
   * @param id Workflow ID
   * @param newOwner ID or email of the new owner
   * @returns Updated workflow
   */
  async moveWorkflow(id: string, newOwner: string): Promise<Workflow> {
    return this.workflowClient.moveWorkflow(id, newOwner);
  }

  /**********************************/
  /* Execution Operations           */
  /**********************************/

  /**
   * Get all workflow executions
   * 
   * @param workflowId Optional workflow ID to filter by
   * @param status Optional status to filter by
   * @param limit Optional limit of results to return
   * @param offset Optional offset for pagination
   * @returns Array of execution objects
   */
  async getExecutions(
    workflowId?: string,
    status?: string,
    limit?: number,
    offset?: number
  ): Promise<Execution[]> {
    return this.executionClient.listExecutions(workflowId, status, limit, offset);
  }

  /**
   * Get a specific execution by ID
   * 
   * @param id Execution ID
   * @returns Execution object
   */
  async getExecution(id: string): Promise<Execution> {
    return this.executionClient.readExecution(id);
  }
  
  /**
   * Delete an execution
   * 
   * @param id Execution ID
   * @returns Deleted execution or success message
   */
  async deleteExecution(id: string): Promise<any> {
    return this.executionClient.deleteExecution(id);
  }
  
  /**
   * Stop a running execution
   * 
   * @param id Execution ID
   * @returns Stop result
   */
  async stopExecution(id: string): Promise<any> {
    return this.executionClient.stopExecution(id);
  }

  /**********************************/
  /* Credential Operations          */
  /**********************************/

  // Credential type operations removed as they are not officially supported by the n8n API
  
  /**
   * Get a user by ID
   * 
   * @param id User ID
   * @returns User object
   */
  async getUser(id: string): Promise<any> {
    return this.userClient.getUser(id);
  }
  
  /**
   * Get all users
   * 
   * @returns Array of users
   */
  async getUsers(): Promise<any[]> {
    return this.userClient.listUsers();
  }
  
  /**
   * Create a new user
   * 
   * @param userData User data for creation
   * @returns Created user
   */
  async createUser(userData: any): Promise<any> {
    return this.userClient.createUser(userData);
  }
  
  /**
   * Change a user's role
   * 
   * @param id User ID
   * @param role New role for the user
   * @returns Updated user
   */
  async changeUserRole(id: string, role: any): Promise<any> {
    return this.userClient.changeUserRole(id, { role });
  }
  
  /**
   * Delete a user
   * 
   * @param id User ID
   * @returns Success response
   */
  async deleteUser(id: string): Promise<any> {
    return this.userClient.deleteUser(id);
  }

  /**
   * Pull changes from source control
   * 
   * @param force Whether to force pull (discard local changes)
   * @returns Pull operation result
   */
  async pullSourceControlChanges(force = false): Promise<any> {
    return this.sourceControlClient.pullChanges(force);
  }
  
  /**
   * Generate a security audit
   * 
   * @param workflowIds Optional array of workflow IDs to audit
   * @returns Security audit result
   */
  async generateSecurityAudit(workflowIds?: string[]): Promise<any> {
    return this.securityAuditClient.generateAudit(workflowIds);
  }
  
  /**
   * List all projects
   * 
   * @param status Optional status to filter by
   * @param ownerId Optional owner ID to filter by
   * @param limit Optional limit of results to return
   * @param offset Optional offset for pagination
   * @returns List of projects
   */
  async getProjects(
    status?: any,
    ownerId?: string,
    limit?: number,
    offset?: number
  ): Promise<any[]> {
    return this.projectClient.listProjects(status, ownerId, limit, offset);
  }
  
  /**
   * Create a new project
   * 
   * @param params Project creation parameters
   * @returns Created project
   */
  async createProject(params: any): Promise<any> {
    return this.projectClient.createProject(params);
  }
  
  /**
   * Update a project
   * 
   * @param id Project ID
   * @param params Project update parameters
   * @returns Updated project
   */
  async updateProject(id: string, params: any): Promise<any> {
    return this.projectClient.updateProject(id, params);
  }
  
  /**
   * Delete a project
   * 
   * @param id Project ID
   * @param force Whether to force delete the project and all its resources
   * @returns Success message
   */
  async deleteProject(id: string, force = false): Promise<any> {
    return this.projectClient.deleteProject(id, force);
  }

  /**
   * List all variables
   * 
   * @param projectId Optional project ID to filter by
   * @param type Optional variable type to filter by
   * @param includeSystem Whether to include system variables
   * @param includeValues Whether to include variable values in the response
   * @param limit Optional limit of results to return
   * @param offset Optional offset for pagination
   * @returns List of variables
   */
  async getVariables(
    projectId?: string,
    type?: any,
    includeSystem?: boolean,
    includeValues?: boolean,
    limit?: number,
    offset?: number
  ): Promise<any[]> {
    return this.variableClient.listVariables(projectId, type, includeSystem, includeValues, limit, offset);
  }
  
  /**
   * Create a new variable
   * 
   * @param params Variable creation parameters
   * @returns Created variable
   */
  async createVariable(params: any): Promise<any> {
    return this.variableClient.createVariable(params);
  }
  
  /**
   * Delete a variable by ID
   * 
   * @param id Variable ID
   * @returns Success message
   */
  async deleteVariable(id: string): Promise<any> {
    return this.variableClient.deleteVariableById(id);
  }

  /**
   * List all tags
   * 
   * @param search Optional search term to filter tags
   * @param limit Optional limit of results to return
   * @param offset Optional offset for pagination
   * @returns List of tags
   */
  async getTags(
    search?: string,
    limit?: number,
    offset?: number
  ): Promise<any[]> {
    return this.tagClient.listTags(search, limit, offset);
  }
  
  /**
   * Read a specific tag by ID
   * 
   * @param id Tag ID
   * @returns Tag details
   */
  async getTag(id: string): Promise<any> {
    return this.tagClient.readTag(id);
  }
  
  /**
   * Create a new tag
   * 
   * @param params Tag creation parameters
   * @returns Created tag
   */
  async createTag(params: any): Promise<any> {
    return this.tagClient.createTag(params);
  }
  
  /**
   * Update a tag
   * 
   * @param id Tag ID
   * @param params Tag update parameters
   * @returns Updated tag
   */
  async updateTag(id: string, params: any): Promise<any> {
    return this.tagClient.updateTag(id, params);
  }
  
  /**
   * Delete a tag
   * 
   * @param id Tag ID
   * @returns Success message
   */
  async deleteTag(id: string): Promise<any> {
    return this.tagClient.deleteTag(id);
  }

  /**
   * List all tags for a specific workflow
   * 
   * @param workflowId Workflow ID to get tags for
   * @returns List of tags assigned to the workflow
   */
  async getWorkflowTags(workflowId: string): Promise<any[]> {
    return this.workflowTagClient.listWorkflowTags(workflowId);
  }
  
  /**
   * Update tags for a specific workflow
   * 
   * @param workflowId Workflow ID to update tags for
   * @param tagIds Array of tag IDs to assign to the workflow
   * @returns Updated list of tags assigned to the workflow
   */
  async updateWorkflowTags(workflowId: string, tagIds: string[]): Promise<any[]> {
    return this.workflowTagClient.updateWorkflowTags(workflowId, tagIds);
  }

  /**
   * Create a new credential
   * 
   * @param credential Credential object to create
   * @returns Created credential
   */
  async createCredential(credential: Record<string, any>): Promise<any> {
    return this.credentialClient.createCredential(credential);
  }

  /**
   * Move/share a credential with a user
   * 
   * @param id Credential ID
   * @param newOwnerId ID of the user to share with
   * @returns Updated credential or success message
   */
  async moveCredential(id: string, newOwnerId: string): Promise<any> {
    return this.credentialClient.moveCredential(id, newOwnerId);
  }

  /**
   * Delete a credential
   * 
   * @param id Credential ID
   * @returns Deleted credential or success message
   */
  async deleteCredential(id: string): Promise<any> {
    return this.credentialClient.deleteCredential(id);
  }
  
  /**
   * Run a workflow by ID
   * 
   * @param workflowId ID of the workflow to run
   * @param data Optional input data for the workflow run
   * @returns Execution details including the execution ID
   */
  async runWorkflow(workflowId: string, data: Record<string, any> = {}): Promise<any> {
    try {
      const response = await this.client.getAxiosInstance().post(`/workflows/${workflowId}/run`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to run workflow ${workflowId}: ${error?.message || 'Unknown error'}`);
    }
  }
  
  /**
   * Get the status of a workflow execution
   * 
   * @param executionId ID of the execution to check
   * @returns Execution status and results
   */
  async getWorkflowRunStatus(executionId: string): Promise<any> {
    try {
      const response = await this.client.getAxiosInstance().get(`/executions/${executionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get execution status for ${executionId}: ${error?.message || 'Unknown error'}`);
    }
  }
  
  /**
   * Cancel a running workflow execution
   * 
   * @param executionId ID of the execution to cancel
   * @returns Success message
   */
  async cancelWorkflowRun(executionId: string): Promise<any> {
    try {
      const response = await this.client.getAxiosInstance().post(`/executions/${executionId}/cancel`, {});
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to cancel execution ${executionId}: ${error?.message || 'Unknown error'}`);
    }
  }
}

/**
 * Create a new n8n API service
 * 
 * @param config Environment configuration
 * @returns n8n API service
 */
export function createApiService(config: EnvConfig): N8nApiService {
  return new N8nApiService(config);
}
