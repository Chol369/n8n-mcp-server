/**
 * Tests for dynamic workflow resource URI functions
 */

import { describe, it, expect } from '@jest/globals';
// Import the actual functions from the source file with .js extension
import { 
  getWorkflowResourceTemplateUri, 
  extractWorkflowIdFromUri 
} from '../../../../src/resources/dynamic/workflow.js'; 

describe('Workflow Resource URI Functions', () => {
  describe('getWorkflowResourceTemplateUri', () => {
    it('should return the correct URI template', () => {
      // Test the actual imported function
      expect(getWorkflowResourceTemplateUri()).toBe('n8n://workflows/{id}');
    });
  });
  
  describe('extractWorkflowIdFromUri', () => {
    it('should extract workflow ID from valid URI', () => {
      // Test the actual imported function
      expect(extractWorkflowIdFromUri('n8n://workflows/123abc')).toBe('123abc');
      expect(extractWorkflowIdFromUri('n8n://workflows/workflow-name-with-dashes')).toBe('workflow-name-with-dashes');
    });
    
    it('should return null for invalid URI formats', () => {
      // Test the actual imported function
      expect(extractWorkflowIdFromUri('n8n://workflows/')).toBeNull();
      expect(extractWorkflowIdFromUri('n8n://workflows')).toBeNull();
      expect(extractWorkflowIdFromUri('n8n://workflow/123')).toBeNull(); // Should fail based on regex
      expect(extractWorkflowIdFromUri('invalid://workflows/123')).toBeNull();
      expect(extractWorkflowIdFromUri('n8n://workflows/123/extra')).toBeNull(); // Should fail based on regex
    });
  });
  
  // TODO: Add tests for getWorkflowResource function (requires mocking apiService)
});
