/**
 * Test Script for N8n API Service
 * 
 * This script tests the N8nApiService class that provides a high-level interface
 * to interact with the n8n API by delegating to specialized client classes.
 */

import { jest } from '@jest/globals';
import { EnvConfig } from '../../../src/config/environment';
import { createApiService, N8nApiService } from '../../../src/api/n8n-client';

// Mock environment and client dependencies
jest.mock('../../../src/api/client');
jest.mock('../../../src/api/workflow-client');
jest.mock('../../../src/api/credential-client');
jest.mock('../../../src/api/execution-client');

describe('N8nApiService', () => {
  // Mock config with required environment variables
  const mockConfig: EnvConfig = {
    n8nApiUrl: 'https://n8n.example.com/api/v1',
    n8nApiKey: 'test-api-key',
    n8nWebhookUsername: 'webhook-user',
    n8nWebhookPassword: 'webhook-password',
    debug: false
  };
  
  let apiService: N8nApiService;

  beforeEach(() => {
    apiService = createApiService(mockConfig);
  });

  // Test service initialization
  test('should initialize service with correct configuration', () => {
    expect(apiService).toBeDefined();
    expect(apiService).toBeInstanceOf(N8nApiService);
  });

  // Test workflow operations
  test('should have workflow operations', () => {
    expect(typeof apiService.getWorkflows).toBe('function');
    expect(typeof apiService.getWorkflow).toBe('function');
    expect(typeof apiService.createWorkflow).toBe('function');
    expect(typeof apiService.updateWorkflow).toBe('function');
    expect(typeof apiService.deleteWorkflow).toBe('function');
    expect(typeof apiService.activateWorkflow).toBe('function');
    expect(typeof apiService.deactivateWorkflow).toBe('function');
  });

  // Test execution operations
  test('should have execution operations', () => {
    expect(typeof apiService.getExecutions).toBe('function');
    expect(typeof apiService.getExecution).toBe('function');
    expect(typeof apiService.deleteExecution).toBe('function');
  });

  // Test user operations
  test('should have user operations', () => {
    expect(typeof apiService.getUsers).toBe('function');
    expect(typeof apiService.getUser).toBe('function');
    expect(typeof apiService.createUser).toBe('function');
    expect(typeof apiService.deleteUser).toBe('function');
  });

  // Test project operations
  test('should have project operations', () => {
    expect(typeof apiService.getProjects).toBe('function');
    expect(typeof apiService.createProject).toBe('function');
    expect(typeof apiService.updateProject).toBe('function');
    expect(typeof apiService.deleteProject).toBe('function');
  });

  // Test variable operations
  test('should have variable operations', () => {
    expect(typeof apiService.getVariables).toBe('function');
    expect(typeof apiService.createVariable).toBe('function');
    expect(typeof apiService.deleteVariable).toBe('function');
  });

  // Test tag operations
  test('should have tag operations', () => {
    expect(typeof apiService.getTags).toBe('function');
    expect(typeof apiService.createTag).toBe('function');
    expect(typeof apiService.updateTag).toBe('function');
    expect(typeof apiService.deleteTag).toBe('function');
  });

  // Test workflow tag operations
  test('should have workflow tag operations', () => {
    expect(typeof apiService.getWorkflowTags).toBe('function');
    expect(typeof apiService.updateWorkflowTags).toBe('function');
  });

  // Test credential operations
  test('should have credential operations', () => {
    expect(typeof apiService.createCredential).toBe('function');
    expect(typeof apiService.moveCredential).toBe('function');
    expect(typeof apiService.deleteCredential).toBe('function');
  });

  // Test source control operations
  test('should have source control operations', () => {
    expect(typeof apiService.pullSourceControlChanges).toBe('function');
  });

  // Test security audit operations
  test('should have security audit operations', () => {
    expect(typeof apiService.generateSecurityAudit).toBe('function');
  });
});
