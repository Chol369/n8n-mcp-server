/**
 * n8n API Client Export
 * 
 * This module primarily exports the N8nApiClient class.
 * The N8nApiService wrapper was removed as it provided little additional value.
 */

import { N8nApiClient } from './client.js';
import { EnvConfig } from '../config/environment.js';

// Re-export the client class
export { N8nApiClient } from './client.js';

// Keep the factory function for consistency, but have it return N8nApiClient directly
/**
 * Create a new n8n API client instance
 * 
 * @param config Environment configuration
 * @returns n8n API client instance
 */
export function createN8nApiClient(config: EnvConfig): N8nApiClient {
  return new N8nApiClient(config);
}

// Export the type alias for convenience if needed elsewhere, 
// though direct use of N8nApiClient is preferred.
export type N8nApiService = N8nApiClient;
