/**
 * User Types
 * 
 * Type definitions for user management operations.
 */

/**
 * User role in n8n
 */
export enum UserRole {
  OWNER = 'owner',
  MEMBER = 'member',
  ADMIN = 'admin'
}

/**
 * User object structure returned by n8n API
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isPending: boolean;
  createdAt: string;
  updatedAt: string;
  settings?: Record<string, any>;
}

/**
 * Request to create a new user
 */
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string;
}

/**
 * Request to change a user's role
 */
export interface ChangeUserRoleRequest {
  role: UserRole;
}

/**
 * Parameters for the user:read tool
 */
export interface UserReadParams {
  id: string;
}

/**
 * Parameters for the user:list tool
 */
export interface UserListParams {
  // Optional filtering parameters could be added here
}

/**
 * Parameters for the user:create tool
 */
export interface UserCreateParams {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string;
}

/**
 * Parameters for the user:changeRole tool
 */
export interface UserChangeRoleParams {
  id: string;
  role: UserRole;
}

/**
 * Parameters for the user:delete tool
 */
export interface UserDeleteParams {
  id: string;
}
