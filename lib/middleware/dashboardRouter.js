import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Dashboard routing middleware
 * Handles role-based dashboard access and redirects
 */

// Define dashboard routes and their access permissions
export const DASHBOARD_ROUTES = [
  {
    path: '/dashboard/admin',
    allowedRoles: ['admin'],
    redirect: '/dashboard/learner' // Default redirect for non-admin users
  },
  {
    path: '/dashboard/instructor',
    allowedRoles: ['instructor', 'admin'],
    redirect: '/dashboard/learner' // Default redirect for students
  },
  {
    path: '/dashboard/learner',
    allowedRoles: ['student', 'instructor', 'admin'],
    redirect: '/login' // Redirect to login if not authenticated
  }
]

/**
 * Get the appropriate dashboard for a user role
 */
export function getDashboardForRole(role) {
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
 * Check if user can access a specific dashboard route
 */
export function canAccessDashboard(role, path) {
  const route = DASHBOARD_ROUTES.find(r => path.startsWith(r.path))
  return route ? route.allowedRoles.includes(role) : false
}

/**
 * Get redirect URL for unauthorized dashboard access
 */
export function getDashboardRedirect(role, attemptedPath) {
  const route = DASHBOARD_ROUTES.find(r => attemptedPath.startsWith(r.path))
  
  if (route?.redirect) {
    return route.redirect
  }
  
  // Default to user's appropriate dashboard
  return getDashboardForRole(role)
}

/**
 * Dashboard routing middleware
 */
export async function dashboardRouterMiddleware(request) {
  const { pathname } = request.nextUrl
  
  // Only process dashboard routes
  if (!pathname.startsWith('/dashboard/')) {
    return null
  }
  
  try {
    // Get user token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const userRole = token.role
    
    // Check if user can access the requested dashboard
    if (!canAccessDashboard(userRole, pathname)) {
      const redirectUrl = getDashboardRedirect(userRole, pathname)
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    
    // Allow access
    return null
    
  } catch (error) {
    console.error('Dashboard router middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

/**
 * Post-login redirect handler
 */
export async function handlePostLoginRedirect(request, userRole) {
  // Check if there's a redirect parameter
  const redirectParam = request.nextUrl.searchParams.get('redirect')
  
  if (redirectParam) {
    // Validate redirect URL is a dashboard route
    if (redirectParam.startsWith('/dashboard/') && canAccessDashboard(userRole, redirectParam)) {
      return redirectParam
    }
  }
  
  // Default to user's appropriate dashboard
  return getDashboardForRole(userRole)
}

/**
 * Create dashboard navigation links based on user role
 */
export function getDashboardNavLinks(userRole) {
  const baseLinks = [
    { label: 'Overview', href: `/dashboard/${userRole === 'admin' ? 'admin' : userRole === 'instructor' ? 'instructor' : 'learner'}` }
  ]
  
  switch (userRole) {
    case 'admin':
      return [
        ...baseLinks,
        { label: 'Users', href: '/dashboard/admin?tab=users' },
        { label: 'Modules', href: '/dashboard/admin?tab=modules' },
        { label: 'Analytics', href: '/dashboard/admin?tab=analytics' },
        { label: 'Settings', href: '/dashboard/admin?tab=settings' }
      ]
      
    case 'instructor':
      return [
        ...baseLinks,
        { label: 'Modules', href: '/dashboard/instructor?tab=modules' },
        { label: 'Students', href: '/dashboard/instructor?tab=students' },
        { label: 'Quizzes', href: '/dashboard/instructor?tab=quizzes' },
        { label: 'Analytics', href: '/dashboard/instructor?tab=analytics' }
      ]
      
    case 'student':
      return [
        ...baseLinks,
        { label: 'Modules', href: '/dashboard/learner?tab=modules' },
        { label: 'Learning', href: '/dashboard/learner?tab=learning' },
        { label: 'Progress', href: '/dashboard/learner?tab=progress' },
        { label: 'Quizzes', href: '/dashboard/learner?tab=quizzes' }
      ]
      
    default:
      return baseLinks
  }
}

/**
 * Check if current path matches dashboard tab
 */
export function isDashboardTab(pathname, tab) {
  const url = new URL(pathname, 'http://localhost')
  const currentTab = url.searchParams.get('tab')
  return currentTab === tab
}

/**
 * Generate dashboard URL with tab parameter
 */
export function getDashboardTabUrl(role, tab) {
  const basePath = getDashboardForRole(role)
  return `${basePath}?tab=${tab}`
}

/**
 * Extract current tab from dashboard URL
 */
export function getCurrentDashboardTab(pathname) {
  const url = new URL(pathname, 'http://localhost')
  return url.searchParams.get('tab')
}

/**
 * Validate dashboard tab access for user role
 */
export function validateDashboardTab(role, tab) {
  const validTabs = {
    admin: ['overview', 'users', 'modules', 'analytics', 'settings', 'notifications'],
    instructor: ['overview', 'modules', 'students', 'quizzes', 'analytics'],
    student: ['modules', 'learning', 'progress', 'quizzes']
  }
  
  return validTabs[role]?.includes(tab) || false
}

/**
 * Get default tab for user role
 */
export function getDefaultDashboardTab(role) {
  switch (role) {
    case 'admin':
      return 'overview'
    case 'instructor':
      return 'overview'
    case 'student':
      return 'modules'
    default:
      return 'overview'
  }
}

/**
 * Middleware for dashboard tab validation
 */
export async function validateDashboardTabAccess(request, userRole) {
  const { pathname } = request.nextUrl
  const currentTab = getCurrentDashboardTab(pathname)
  
  // If no tab specified, redirect to default tab
  if (!currentTab) {
    const defaultTab = getDefaultDashboardTab(userRole)
    const redirectUrl = getDashboardTabUrl(userRole, defaultTab)
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }
  
  // Validate tab access
  if (!validateDashboardTab(userRole, currentTab)) {
    const defaultTab = getDefaultDashboardTab(userRole)
    const redirectUrl = getDashboardTabUrl(userRole, defaultTab)
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }
  
  return null
}

