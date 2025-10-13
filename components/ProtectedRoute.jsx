'use client'

import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * ProtectedRoute Component
 * Wraps components that require authentication and/or specific roles
 */

export default function ProtectedRoute({ 
  children, 
  requiredRole = null, 
  requiredRoles = null,
  fallback = null,
  redirectTo = '/login'
}) {
  const { user, loading, authenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push(redirectTo)
    }
  }, [loading, authenticated, router, redirectTo])

  useEffect(() => {
    if (!loading && authenticated && user) {
      // Check single role requirement
      if (requiredRole && user.role !== requiredRole) {
        // Redirect to appropriate dashboard
        const dashboardPath = getDashboardPath(user.role)
        router.push(dashboardPath)
        return
      }

      // Check multiple roles requirement
      if (requiredRoles && !requiredRoles.includes(user.role)) {
        // Redirect to appropriate dashboard
        const dashboardPath = getDashboardPath(user.role)
        router.push(dashboardPath)
        return
      }
    }
  }, [loading, authenticated, user, requiredRole, requiredRoles, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Not authenticated
  if (!authenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to access this page.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Check role requirements
  if (requiredRole && user?.role !== requiredRole) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need {requiredRole} privileges to access this page.
          </p>
          <button
            onClick={() => {
              const dashboardPath = getDashboardPath(user.role)
              router.push(dashboardPath)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You need one of the following roles: {requiredRoles.join(', ')}
          </p>
          <button
            onClick={() => {
              const dashboardPath = getDashboardPath(user.role)
              router.push(dashboardPath)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Render children if all checks pass
  return children
}

/**
 * Admin-only route wrapper
 */
export function AdminRoute({ children, fallback = null }) {
  return (
    <ProtectedRoute requiredRole="admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * Instructor or Admin route wrapper
 */
export function InstructorOrAdminRoute({ children, fallback = null }) {
  return (
    <ProtectedRoute requiredRoles={['instructor', 'admin']} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * Student route wrapper
 */
export function StudentRoute({ children, fallback = null }) {
  return (
    <ProtectedRoute requiredRole="student" fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * Authenticated route wrapper (any role)
 */
export function AuthenticatedRoute({ children, fallback = null }) {
  return (
    <ProtectedRoute fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

function getDashboardPath(role) {
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

