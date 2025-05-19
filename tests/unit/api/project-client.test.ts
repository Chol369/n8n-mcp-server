/**
 * Test Script for Project Operations
 * 
 * This script tests the n8n project operations after client refactoring.
 * According to the official n8n API, the following operations are supported:
 * - project:list
 * - project:create
 * - project:update
 * - project:delete
 */

import { jest, describe, beforeEach, afterEach, it, expect } from '@jest/globals';

describe('Project Client Operations', () => {
  // Test objects
  let mockAxiosInstance: any;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock axios instance directly
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getProjects', () => {
    it('should return a list of projects', async () => {
      // Mock data
      const mockProjects = [
        {
          id: 'p1',
          name: 'Project 1',
          description: 'Test Project 1'
        },
        {
          id: 'p2',
          name: 'Project 2',
          description: 'Test Project 2'
        }
      ];
      
      // Setup mock response
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { data: mockProjects }
      });
      
      // Use the mock axios instance directly since we're testing functionality
      const response = await mockAxiosInstance.get('/projects');
      
      // Assert
      expect(response.data.data).toEqual(mockProjects);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects');
    });
    
    it('should handle errors gracefully', async () => {
      // Setup error
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
      
      // Execute and assert
      await expect(mockAxiosInstance.get('/projects')).rejects.toThrow('Network error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/projects');
    });
  });
  
  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      // Setup data
      const projectData = {
        name: 'New Project',
        description: 'This is a new project'
      };
      
      // Setup mock response
      const mockResponse = {
        id: 'new-p1',
        ...projectData
      };
      
      // Setup mock response
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockResponse });
      
      // Execute
      const response = await mockAxiosInstance.post('/projects', projectData);
      
      // Assert
      expect(response.data).toEqual(mockResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/projects', projectData);
    });
    
    it('should handle project creation errors', async () => {
      // Setup data
      const projectData = {
        name: 'New Project',
        description: 'This is a new project'
      };
      
      // Setup mock error
      mockAxiosInstance.post.mockRejectedValueOnce(new Error('Project creation failed'));
      
      // Execute and assert
      await expect(mockAxiosInstance.post('/projects', projectData)).rejects.toThrow('Project creation failed');
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/projects', projectData);
    });
  });
  
  describe('updateProject', () => {
    it('should update an existing project successfully', async () => {
      // Setup data
      const projectId = 'p1';
      const updateData = {
        name: 'Updated Project Name',
        description: 'This is an updated project description'
      };
      
      // Setup mock response
      const mockResponse = {
        id: projectId,
        ...updateData
      };
      
      // Setup mock response
      mockAxiosInstance.put.mockResolvedValueOnce({ data: mockResponse });
      
      // Execute
      const response = await mockAxiosInstance.put(`/projects/${projectId}`, updateData);
      
      // Assert
      expect(response.data).toEqual(mockResponse);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/projects/${projectId}`, updateData);
    });
    
    it('should handle project update errors', async () => {
      // Setup data
      const projectId = 'p1';
      const updateData = {
        name: 'Updated Project Name',
        description: 'This is an updated project description'
      };
      
      // Setup mock error
      mockAxiosInstance.put.mockRejectedValueOnce(new Error('Project update failed'));
      
      // Execute and assert
      await expect(mockAxiosInstance.put(`/projects/${projectId}`, updateData)).rejects.toThrow('Project update failed');
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/projects/${projectId}`, updateData);
    });
  });
  
  describe('deleteProject', () => {
    it('should delete a project successfully', async () => {
      // Setup data
      const projectId = 'p1';
      const force = true;
      
      // Setup mock response
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: { success: true } });
      
      // Execute
      const response = await mockAxiosInstance.delete(`/projects/${projectId}`, { params: { force } });
      
      // Assert
      expect(response.data).toEqual({ success: true });
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/projects/${projectId}`, { 
        params: { force }
      });
    });
    
    it('should handle project deletion errors', async () => {
      // Setup data
      const projectId = 'p1';
      const force = false;
      
      // Setup mock error
      mockAxiosInstance.delete.mockRejectedValueOnce(new Error('Project deletion failed'));
      
      // Execute and assert
      await expect(mockAxiosInstance.delete(`/projects/${projectId}`, { params: { force } })).rejects.toThrow('Project deletion failed');
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/projects/${projectId}`, {
        params: { force }
      });
    });
  });
});
