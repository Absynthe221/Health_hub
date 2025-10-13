'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    if (session?.user) {
      setUser(session.user)
      setLoading(false)
    } else {
      setUser(null)
      setLoading(false)
    }
  }, [session, status])

  const login = async (credentials) => {
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Redirect to appropriate dashboard based on role
      if (result?.ok) {
        const role = session?.user?.role
        const dashboardPath = getDashboardPath(role)
        router.push(dashboardPath)
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      setUser(null)
      router.push('/login')
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const hasRole = (role) => {
    return user?.role === role
  }

  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role)
  }

  const hasPermission = (resource, action) => {
    // Define permissions based on role
    const permissions = {
      admin: {
        users: ['read', 'write', 'delete'],
        modules: ['read', 'write', 'delete'],
        analytics: ['read'],
        settings: ['read', 'write']
      },
      instructor: {
        modules: ['read', 'write'],
        students: ['read'],
        quizzes: ['read', 'write', 'delete'],
        analytics: ['read']
      },
      student: {
        modules: ['read'],
        progress: ['read', 'write'],
        quizzes: ['read']
      }
    }

    const userPermissions = permissions[user?.role] || {}
    return userPermissions[resource]?.includes(action) || false
  }

  const getDashboardPath = (role) => {
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

  const redirectToDashboard = () => {
    if (user?.role) {
      const dashboardPath = getDashboardPath(user.role)
      router.push(dashboardPath)
    }
  }

  const value = {
    user,
    loading,
    authenticated: !!user,
    login,
    logout,
    hasRole,
    hasAnyRole,
    hasPermission,
    redirectToDashboard
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Higher-order component for protecting routes
 */
export function withAuth(WrappedComponent, requiredRole = null) {
  return function AuthenticatedComponent(props) {
    const { user, loading, hasRole } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login')
          return
        }

        if (requiredRole && !hasRole(requiredRole)) {
          // Redirect to appropriate dashboard
          const dashboardPath = getDashboardPath(user.role)
          router.push(dashboardPath)
          return
        }
      }
    }, [user, loading, requiredRole, router])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!user) {
      return null
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

/**
 * Role-based component wrapper
 */
export function RoleGuard({ children, requiredRole, requiredRoles, fallback = null }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-8 w-full rounded"></div>
    )
  }

  if (!user) {
    return fallback
  }

  if (requiredRole && user.role !== requiredRole) {
    return fallback
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return fallback
  }

  return children
}

/**
 * Permission-based component wrapper
 */
export function PermissionGuard({ children, resource, action, fallback = null }) {
  const { hasPermission } = useAuth()

  if (!hasPermission(resource, action)) {
    return fallback
  }

  return children
}

/**
 * Hook for role-based conditional rendering
 */
export function useRoleAccess() {
  const { user } = useAuth()

  return {
    isAdmin: user?.role === 'admin',
    isInstructor: user?.role === 'instructor',
    isStudent: user?.role === 'student',
    canManageUsers: user?.role === 'admin',
    canManageModules: ['admin', 'instructor'].includes(user?.role),
    canViewAnalytics: ['admin', 'instructor'].includes(user?.role),
    canManageQuizzes: ['admin', 'instructor'].includes(user?.role)
  }
}

/**
 * Hook for permission-based conditional rendering
 */
export function usePermissions() {
  const { hasPermission } = useAuth()

  return {
    canReadUsers: hasPermission('users', 'read'),
    canWriteUsers: hasPermission('users', 'write'),
    canDeleteUsers: hasPermission('users', 'delete'),
    canReadModules: hasPermission('modules', 'read'),
    canWriteModules: hasPermission('modules', 'write'),
    canDeleteModules: hasPermission('modules', 'delete'),
    canReadAnalytics: hasPermission('analytics', 'read'),
    canManageSettings: hasPermission('settings', 'write')
  }
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

