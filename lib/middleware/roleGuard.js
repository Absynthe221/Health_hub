import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Role-based access control middleware
 * Validates JWT tokens and enforces role-based permissions
 */

// Define role permissions for different API endpoints
export const ROLE_PERMISSIONS = {
  // User management - Admin only
  'GET /api/users': ['admin'],
  'POST /api/users': ['admin'],
  'PUT /api/users': ['admin'],
  'DELETE /api/users': ['admin'],
  
  // Module management - Admin and Instructor
  'GET /api/modules': ['admin', 'instructor', 'student'],
  'POST /api/modules': ['admin', 'instructor'],
  'PUT /api/modules': ['admin', 'instructor'],
  'DELETE /api/modules': ['admin', 'instructor'],
  
  // Student-specific endpoints
  'GET /api/student/modules': ['student', 'admin', 'instructor'],
  'GET /api/student/progress': ['student', 'admin', 'instructor'],
  'PUT /api/student/progress': ['student', 'admin', 'instructor'],
  
  // Instructor-specific endpoints
  'GET /api/instructor/students': ['instructor', 'admin'],
  'GET /api/instructor/modules': ['instructor', 'admin'],
  'POST /api/instructor/quizzes': ['instructor', 'admin'],
  'PUT /api/instructor/quizzes': ['instructor', 'admin'],
  'DELETE /api/instructor/quizzes': ['instructor', 'admin'],
  
  // Admin-specific endpoints
  'GET /api/admin/analytics': ['admin'],
  'GET /api/admin/reports': ['admin'],
  'POST /api/admin/settings': ['admin'],
  
  // AI endpoints - All authenticated users
  'POST /api/ai/generateQuiz': ['admin', 'instructor', 'student'],
  'POST /api/ai/summarizeSlide': ['admin', 'instructor', 'student'],
  'POST /api/ai/interpretECG': ['admin', 'instructor', 'student'],
  
  // Notification endpoints
  'GET /api/notifications': ['admin', 'instructor', 'student'],
  'POST /api/notifications': ['admin', 'instructor'],
  'PUT /api/notifications': ['admin', 'instructor', 'student'],
  
  // Public endpoints (no authentication required)
  'GET /api/health': [],
  'POST /api/auth/signin': [],
  'POST /api/auth/signout': [],
}

/**
 * Check if user has permission to access endpoint
 */
export function hasPermission(userRole, method, path) {
  const key = `${method} ${path}`
  
  // Check exact match first
  if (ROLE_PERMISSIONS[key]) {
    return ROLE_PERMISSIONS[key].length === 0 || ROLE_PERMISSIONS[key].includes(userRole)
  }
  
  // Check pattern matches for dynamic routes
  for (const [pattern, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
    if (matchesPattern(key, pattern)) {
      return allowedRoles.length === 0 || allowedRoles.includes(userRole)
    }
  }
  
  // Default deny for unmatched routes
  return false
}

/**
 * Check if request path matches pattern (supports dynamic segments)
 */
function matchesPattern(request, pattern) {
  // Convert pattern to regex
  const regexPattern = pattern
    .replace(/\*/g, '.*') // * matches anything
    .replace(/\{[^}]+\}/g, '[^/]+') // {id} matches any non-slash characters
    .replace(/\//g, '\\/') // Escape forward slashes
  
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(request)
}

/**
 * Extract user token from request
 */
export async function getUserToken(request) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) return null
    
    return {
      id: token.id,
      email: token.email,
      name: token.name,
      role: token.role,
      iat: token.iat,
      exp: token.exp
    }
  } catch (error) {
    console.error('Error extracting user token:', error)
    return null
  }
}

/**
 * Role guard middleware for API routes
 */
export function withRoleGuard(handler) {
  return async (request, context) => {
    try {
      // Extract method and path
      const method = request.method
      const path = new URL(request.url).pathname
      
      // Get user token
      const userToken = await getUserToken(request)
      
      // Check if endpoint requires authentication
      const requiresAuth = Object.keys(ROLE_PERMISSIONS).some(key => 
        matchesPattern(`${method} ${path}`, key)
      )
      
      if (requiresAuth && !userToken) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      // Check permissions
      if (userToken && !hasPermission(userToken.role, method, path)) {
        return NextResponse.json(
          { 
            error: 'Insufficient permissions',
            required: ROLE_PERMISSIONS[`${method} ${path}`] || 'Unknown role'
          },
          { status: 403 }
        )
      }
      
      // Add user context to request
      const requestWithUser = {
        ...request,
        user: userToken
      }
      
      // Call the original handler
      return await handler(requestWithUser, context)
      
    } catch (error) {
      console.error('Role guard error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Middleware for specific role requirements
 */
export function requireRole(roles) {
  return function(handler) {
    return async (request, context) => {
      const userToken = await getUserToken(request)
      
      if (!userToken) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      if (!roles.includes(userToken.role)) {
        return NextResponse.json(
          { 
            error: 'Insufficient permissions',
            required: roles,
            current: userToken.role
          },
          { status: 403 }
        )
      }
      
      return await handler(request, context)
    }
  }
}

/**
 * Middleware for admin-only access
 */
export const requireAdmin = requireRole(['admin'])

/**
 * Middleware for instructor or admin access
 */
export const requireInstructorOrAdmin = requireRole(['instructor', 'admin'])

/**
 * Middleware for authenticated users (any role)
 */
export const requireAuth = requireRole(['admin', 'instructor', 'student'])

/**
 * Validate JWT token and extract user info
 */
export async function validateToken(request) {
  try {
    const userToken = await getUserToken(request)
    
    if (!userToken) {
      return { valid: false, error: 'No token provided' }
    }
    
    // Check token expiration
    const now = Math.floor(Date.now() / 1000)
    if (userToken.exp < now) {
      return { valid: false, error: 'Token expired' }
    }
    
    return { valid: true, user: userToken }
  } catch (error) {
    return { valid: false, error: 'Invalid token' }
  }
}

/**
 * Get user role from request
 */
export async function getUserRole(request) {
  const userToken = await getUserToken(request)
  return userToken?.role || null
}

/**
 * Check if user has specific role
 */
export async function hasRole(request, role) {
  const userRole = await getUserRole(request)
  return userRole === role
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(request, roles) {
  const userRole = await getUserRole(request)
  return userRole ? roles.includes(userRole) : false
}

/**
 * Create error response for unauthorized access
 */
export function createUnauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  )
}

/**
 * Create error response for forbidden access
 */
export function createForbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  )
}

/**
 * Role-based dashboard redirect helper
 */
export function getDashboardRedirect(role) {
  switch (role) {
    case 'admin':
      return '/dashboard/admin'
    case 'instructor':
      return '/dashboard/instructor'
    case 'student':
      return '/dashboard/learner'
    default:
      return '/login'
  }
}

/**
 * Check if path requires specific role
 */
export function getRequiredRole(path) {
  if (path.startsWith('/dashboard/admin')) return 'admin'
  if (path.startsWith('/dashboard/instructor')) return 'instructor'
  if (path.startsWith('/dashboard/learner')) return 'student'
  return null
}

