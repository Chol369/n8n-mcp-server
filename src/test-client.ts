/**
 * Client Architecture Test Script
 * 
 * This script tests the refactored n8n API client architecture
 * by making sample API calls to verify functionality.
 */

import { loadEnvironmentVariables, getEnvConfig } from './config/environment.js';
import { createApiService } from './api/n8n-client.js';

async function testClients() {
  try {
    console.log('Loading environment variables...');
    loadEnvironmentVariables();
    
    console.log('Getting environment configuration...');
    const config = getEnvConfig();
    
    console.log('Creating API service...');
    const apiService = createApiService(config);
    
    // Test connectivity
    console.log('Testing API connectivity...');
    await apiService.checkConnectivity();
    console.log('✅ API connectivity working!');
    
    // Test workflow operations
    console.log('\nTesting workflow operations:');
    try {
      console.log('Listing workflows...');
      const workflows = await apiService.getWorkflows();
      console.log(`✅ Found ${workflows.length} workflows`);
      
      if (workflows.length > 0) {
        const workflowId = workflows[0].id;
        console.log(`Getting workflow with ID: ${workflowId}...`);
        const workflow = await apiService.getWorkflow(workflowId);
        console.log(`✅ Retrieved workflow: ${workflow.name}`);
      }
    } catch (error) {
      console.error('❌ Workflow operations error:', error);
    }
    
    // Test execution operations
    console.log('\nTesting execution operations:');
    try {
      console.log('Listing executions...');
      const executions = await apiService.getExecutions();
      console.log(`✅ Found ${executions.length} executions`);
      
      if (executions.length > 0) {
        const executionId = executions[0].id;
        console.log(`Getting execution with ID: ${executionId}...`);
        const execution = await apiService.getExecution(executionId);
        console.log(`✅ Retrieved execution for workflow: ${execution.workflowId}`);
      }
    } catch (error) {
      console.error('❌ Execution operations error:', error);
    }
    
    // Test credential operations
    console.log('\nTesting credential operations:');
    console.log('Note: The n8n API officially supports only:');
    console.log('- credential:create');
    console.log('- credential:move');
    console.log('- credential:delete');
    console.log('These operations can be tested using the credential-operations-test.js file.');
    
    console.log('\n✅ Client testing completed!');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
  }
}

// Run the test
testClients();
