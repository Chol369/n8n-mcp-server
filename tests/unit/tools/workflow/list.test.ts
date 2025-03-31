/**
 * ListWorkflowsHandler unit tests
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { ListWorkflowsHandler, getListWorkflowsToolDefinition } from '../../../../src/tools/workflow/list.js'; // Add .js back
import { createMockWorkflows } from '../../../mocks/n8n-fixtures.js'; // Add .js back
// Import BaseWorkflowToolHandler to check constructor call, but don't mock it directly
import { BaseWorkflowToolHandler } from '../../../../src/tools/workflow/base-handler.js'; // Add .js back

// Generate mock data
const mockWorkflows = createMockWorkflows(); 

// Mock dependencies of the BaseWorkflowToolHandler
const mockGetWorkflows = jest.fn(); // Define typed mock function variable
const mockApiService = {
  getWorkflows: mockGetWorkflows,
  // Add other methods used by BaseWorkflowToolHandler if necessary
};
const mockEnvConfig = { 
  /* mock necessary env config properties */ 
  n8nApiUrl: 'http://mock-n8n.com',
  n8nApiKey: 'mock-key',
  n8nWebhookUsername: 'test-user', // Added webhook user
  n8nWebhookPassword: 'test-pass', // Added webhook pass
};

// Add .js extension back to mock paths
jest.mock('../../../../src/config/environment.js', () => ({ 
  getEnvConfig: jest.fn(() => mockEnvConfig),
}));

jest.mock('../../../../src/api/n8n-client.js', () => ({ 
  createApiService: jest.fn(() => mockApiService),
}));


import { Workflow, ToolCallResult } from '../../../../src/types/index.js'; // Add .js back


describe('ListWorkflows Tool', () => {
  let handler: ListWorkflowsHandler;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Instantiate the handler, passing the mocked apiService (cast to any)
    handler = new ListWorkflowsHandler(mockApiService as any); 
    // Check that dependencies were called by the base constructor
    // Use the mocked functions directly now, casting the require result
    const configMock = jest.requireMock('../../../../src/config/environment.js') as any; // Add .js back
    const apiMock = jest.requireMock('../../../../src/api/n8n-client.js') as any; // Add .js back
    expect(configMock.getEnvConfig).toHaveBeenCalledTimes(1); 
    expect(apiMock.createApiService).toHaveBeenCalledWith(mockEnvConfig);
  });

  describe('getListWorkflowsToolDefinition', () => {
    it('should return the correct tool definition', () => {
      // Execute
    const definition = getListWorkflowsToolDefinition();
    
    // Assert
    expect(definition.name).toBe('list_workflows');
    expect(definition.description).toBeTruthy();
    expect(definition.inputSchema).toBeDefined();
    expect(definition.inputSchema.properties).toHaveProperty('active');
      expect(definition.inputSchema.required).toEqual([]);
    });
  });

  describe('execute', () => {
    it('should fetch all workflows and format them when no filter is provided', async () => {
      // Arrange
      // @ts-ignore - Suppress persistent TS2345 error
      mockGetWorkflows.mockResolvedValue(mockWorkflows); 
      const expectedFormatted = mockWorkflows.map((wf: Workflow) => ({ // Add type annotation
        id: wf.id,
        name: wf.name,
        active: wf.active,
        updatedAt: wf.updatedAt,
      }));

      // Act
      const result = await handler.execute({});

      // Assert
      expect(mockApiService.getWorkflows).toHaveBeenCalledTimes(1);
      // Check the actual result, which uses the real base class formatters
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain(`Found ${expectedFormatted.length} workflow(s)`);
      expect(result.content[0].text).toContain(JSON.stringify(expectedFormatted, null, 2)); 
    });

    it('should filter workflows by active=true when provided', async () => {
      // Arrange
      // @ts-ignore - Suppress persistent TS2345 error
      mockGetWorkflows.mockResolvedValue(mockWorkflows); 
      const activeWorkflows = mockWorkflows.filter(wf => wf.active === true);
      const expectedFormatted = activeWorkflows.map((wf: Workflow) => ({ // Add type annotation
        id: wf.id,
        name: wf.name,
        active: wf.active,
        updatedAt: wf.updatedAt,
      }));

      // Act
      const result = await handler.execute({ active: true });

      // Assert
      expect(mockApiService.getWorkflows).toHaveBeenCalledTimes(1);
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain(`Found ${expectedFormatted.length} workflow(s) (filtered by active=true)`);
      expect(result.content[0].text).toContain(JSON.stringify(expectedFormatted, null, 2)); 
    });

    it('should filter workflows by active=false when provided', async () => {
      // Arrange
      // @ts-ignore - Suppress persistent TS2345 error
      mockGetWorkflows.mockResolvedValue(mockWorkflows); 
      const inactiveWorkflows = mockWorkflows.filter(wf => wf.active === false);
      const expectedFormatted = inactiveWorkflows.map((wf: Workflow) => ({ // Add type annotation
        id: wf.id,
        name: wf.name,
        active: wf.active,
        updatedAt: wf.updatedAt,
      }));

      // Act
      const result = await handler.execute({ active: false });

      // Assert
      expect(mockApiService.getWorkflows).toHaveBeenCalledTimes(1);
      expect(result.isError).toBe(false);
      expect(result.content[0].text).toContain(`Found ${expectedFormatted.length} workflow(s) (filtered by active=false)`);
      expect(result.content[0].text).toContain(JSON.stringify(expectedFormatted, null, 2)); 
    });

    it('should handle errors during API call', async () => {
      // Arrange
      const apiError = new Error('API Failure');
      // @ts-ignore - Suppress persistent TS2345 error
      mockGetWorkflows.mockRejectedValue(apiError); 

      // Act
      const result = await handler.execute({});

      // Assert
      expect(mockApiService.getWorkflows).toHaveBeenCalledTimes(1);
      // Check the actual error result formatted by the real base class method
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Error executing workflow tool: API Failure'); 
    });
  });
});
