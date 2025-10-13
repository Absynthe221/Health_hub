/**
 * Authentication and authorization types
 * Note: This file contains JSDoc type definitions for JavaScript
 */

/**
 * @typedef {'admin' | 'instructor' | 'student'} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {UserRole} role
 * @property {string} [avatar]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [lastActive]
 * @property {'active' | 'inactive' | 'suspended'} status
 */

/**
 * @typedef {Object} UserSession
 * @property {User} user
 * @property {string} expires
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 * @property {boolean} [rememberMe]
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} email
 * @property {string} password
 * @property {string} name
 * @property {UserRole} role
 */

/**
 * @typedef {Object} AuthResponse
 * @property {boolean} success
 * @property {User} [user]
 * @property {string} [token]
 * @property {string} [error]
 */

/**
 * @typedef {Object} JWTPayload
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {UserRole} role
 * @property {number} iat
 * @property {number} exp
 */

/**
 * @typedef {Object} Permission
 * @property {string} resource
 * @property {string[]} actions
 */

/**
 * @typedef {Object.<string, Permission[]>} RolePermissions
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {boolean} loading
 * @property {function(LoginCredentials): Promise<AuthResponse>} signIn
 * @property {function(): Promise<void>} signOut
 * @property {function(RegisterData): Promise<AuthResponse>} signUp
 * @property {function(Partial<User>): Promise<AuthResponse>} updateProfile
 * @property {function(string, string): boolean} hasPermission
 * @property {function(UserRole): boolean} hasRole
 */

// Export constants for role values
export const USER_ROLES = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  STUDENT: 'student'
}

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
}

// Export default object with type information
export default {
  USER_ROLES,
  USER_STATUS
}

