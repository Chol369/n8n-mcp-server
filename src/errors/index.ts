/**
 * Error Handling Module
 * 
 * This module provides custom error classes and error handling utilities
 * for the n8n MCP Server.
 */

import { ErrorCode } from './error-codes.js';

// Define a custom Error class for n8n API errors
class McpError extends Error {
  code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = 'McpError';
    this.code = code;
  }
}

// Export for use in other modules
export { McpError };
// Re-export ErrorCode enum
export { ErrorCode } from './error-codes.js';

/**
 * n8n API Error class for handling errors from the n8n API
 */
export class N8nApiError extends Error {
  public code: ErrorCode;
  public statusCode?: number;
  public details?: unknown;
  
  constructor(message: string, statusCode?: number, details?: unknown) {
    // Format the error message with additional details
    const formattedMessage = formatErrorMessage(message, statusCode, details);
    super(formattedMessage);
    
    // Map HTTP status codes to appropriate MCP error codes
    let errorCode = ErrorCode.InternalError;
    
    if (statusCode) {
      if (statusCode === 401 || statusCode === 403) {
        errorCode = ErrorCode.AuthenticationError;
      } else if (statusCode === 404) {
        errorCode = ErrorCode.NotFoundError;
      } else if (statusCode >= 400 && statusCode < 500) {
        errorCode = ErrorCode.InvalidRequest;
      }
    }
    
    this.name = 'N8nApiError';
    this.code = errorCode;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Format an error message with status code and details
 */
function formatErrorMessage(message: string, statusCode?: number, details?: unknown): string {
  let formattedMessage = message;
  
  if (statusCode) {
    formattedMessage += ` (Status: ${statusCode})`;
  }
  
  if (details) {
    try {
      const detailsStr = typeof details === 'string' 
        ? details 
        : JSON.stringify(details, null, 2);
      formattedMessage += `\nDetails: ${detailsStr}`;
    } catch (error) {
      // Ignore JSON stringification errors
    }
  }
  
  return formattedMessage;
}

/**
 * Safely parse JSON response from n8n API
 * 
 * @param text Text to parse as JSON
 * @returns Parsed JSON object or null if parsing fails
 */
export function safeJsonParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

/**
 * Handle axios errors and convert them to N8nApiError
 * 
 * @param error Error object from axios
 * @param defaultMessage Default error message
 * @returns N8nApiError with appropriate details
 */
export function handleAxiosError(error: any, defaultMessage = 'n8n API request failed'): N8nApiError {
  // Handle axios error responses
  if (error.response) {
    const statusCode = error.response.status;
    const responseData = error.response.data;
    
    let errorMessage = defaultMessage;
    if (responseData && responseData.message) {
      errorMessage = responseData.message;
    }
    
    return new N8nApiError(errorMessage, statusCode, responseData);
  }
  
  // Handle request errors (e.g., network issues)
  if (error.request) {
    return new N8nApiError(
      'Network error connecting to n8n API', 
      undefined, 
      error.message
    );
  }
  
  // Handle other errors
  return new N8nApiError(error.message || defaultMessage);
}

/**
 * Extract a readable error message from an error object
 * 
 * @param error Error object
 * @returns Readable error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
}
