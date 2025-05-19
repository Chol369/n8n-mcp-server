/**
 * Mock for @modelcontextprotocol/sdk
 * 
 * This file provides mock implementations of the SDK used in tests.
 */

// Mock McpError class
export class McpError extends Error {
  errorCode: string;
  
  constructor(errorCode: string, message: string) {
    super(message);
    this.name = 'McpError';
    this.errorCode = errorCode;
  }
}

// Export any other SDK constructs used in tests
export const ErrorCode = {
  InternalError: 'INTERNAL_ERROR',
  InvalidRequest: 'INVALID_REQUEST',
  AuthenticationError: 'AUTHENTICATION_ERROR',
  NotFoundError: 'NOT_FOUND_ERROR'
};
