/**
 * Test Script for Credential Operations
 * 
 * This script tests the n8n credential operations
 */

import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { CredentialClient } from '../../../src/api/credential-client';
import { N8nApiClient } from '../../../src/api/client';

// Mock necessary dependencies
jest.mock('../../../src/api/client');

describe('CredentialClient', () => {
  // Mock objects
  let mockAxiosInstance: any;
  let mockApiClient: any;
  let credentialClient: CredentialClient;

  // Test data
  const testCredentialId = 'test-credential-123';
  const testCredential = {
    id: testCredentialId,
    name: 'Test OAuth2 Credential',
    type: 'oAuth2Api',
    data: {
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      accessToken: 'test-access-token'
    }
  };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock axios instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };

    // Create mock API client
    mockApiClient = {
      getAxiosInstance: jest.fn().mockReturnValue(mockAxiosInstance)
    };

    // Create credential client with mock API client
    credentialClient = new CredentialClient(mockApiClient as unknown as N8nApiClient);
  });
  
  describe('createCredential', () => {
    it('should create a credential successfully', async () => {
      // Setup data
      const credentialData = {
        name: 'Test OAuth2 Credential',
        type: 'oAuth2Api',
        data: {
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
          accessToken: 'test-access-token'
        }
      };
      
      // Mock response with created credential
      const createdCredential = {
        id: testCredentialId,
        ...credentialData
      };
      const mockResponse = { data: createdCredential };
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);
      
      // Call method
      const result = await credentialClient.createCredential(credentialData);
      
      // Assert
      expect(result).toEqual(createdCredential);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/credentials', credentialData);
    });
    
    it('should handle errors', async () => {
      // Setup data
      const credentialData = {
        name: 'Test OAuth2 Credential',
        type: 'oAuth2Api',
        data: {
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
          accessToken: 'test-access-token'
        }
      };
      
      // Mock error
      const mockError = new Error('Bad request');
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);
      
      // Call method and assert error
      await expect(credentialClient.createCredential(credentialData)).rejects.toThrow();
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/credentials', credentialData);
    });
  });
  
  describe('deleteCredential', () => {
    it('should delete a credential', async () => {
      // Mock response
      const mockResponse = { data: { success: true } };
      mockAxiosInstance.delete.mockResolvedValueOnce(mockResponse);
      
      // Call method
      const result = await credentialClient.deleteCredential(testCredentialId);
      
      // Assert
      expect(result).toEqual({ success: true });
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/credentials/${testCredentialId}`);
    });
    
    it('should handle errors', async () => {
      // Mock error
      const mockError = new Error('Not found');
      mockAxiosInstance.delete.mockRejectedValueOnce(mockError);
      
      // Call method and assert error
      await expect(credentialClient.deleteCredential(testCredentialId)).rejects.toThrow();
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/credentials/${testCredentialId}`);
    });
  });
  
  describe('moveCredential', () => {
    it('should move a credential to a new owner', async () => {
      // Test data
      const newOwnerId = 'user-123';
      
      // Mock response
      const movedCredential = {
        ...testCredential,
        ownedBy: newOwnerId
      };
      const mockResponse = { data: movedCredential };
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);
      
      // Call method
      const result = await credentialClient.moveCredential(testCredentialId, newOwnerId);
      
      // Assert
      expect(result).toEqual(movedCredential);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/credentials/${testCredentialId}/share`, { shareWithId: newOwnerId });
    });
    
    it('should handle errors', async () => {
      // Test data
      const newOwnerId = 'user-123';
      
      // Mock error
      const mockError = new Error('Not found');
      mockAxiosInstance.post.mockRejectedValueOnce(mockError);
      
      // Call method and assert error
      await expect(credentialClient.moveCredential(testCredentialId, newOwnerId)).rejects.toThrow();
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(`/credentials/${testCredentialId}/share`, { shareWithId: newOwnerId });
    });
  });
});
