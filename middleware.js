import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Handle dashboard routing
    // COMMENTED OUT FOR DEVELOPMENT - Allow direct access to all dashboards
    // if (pathname.startsWith('/dashboard/')) {
    //   // Redirect to appropriate dashboard based on role
    //   if (token?.role) {
    //     const role = token.role
    //     let targetPath = '/dashboard/learner' // default
    //     
    //     if (role === 'admin' && pathname.startsWith('/dashboard/admin')) {
    //       targetPath = '/dashboard/admin'
    //     } else if (role === 'instructor' && pathname.startsWith('/dashboard/instructor')) {
    //       targetPath = '/dashboard/instructor'
    //     } else if (role === 'student' && pathname.startsWith('/dashboard/learner')) {
    //       targetPath = '/dashboard/learner'
    //     } else {
    //       // Redirect to role-appropriate dashboard
    //       switch (role) {
    //         case 'admin':
    //           targetPath = '/dashboard/admin'
    //           break
    //         case 'instructor':
    //           targetPath = '/dashboard/instructor'
    //           break
    //         case 'student':
    //           targetPath = '/dashboard/learner'
    //           break
    //       }
    //     }
    //     
    //     // If user is trying to access wrong dashboard, redirect
    //     if (!pathname.startsWith(targetPath)) {
    //       return NextResponse.redirect(new URL(targetPath, req.url))
    //     }
    //   }
    // }

    // Handle post-login redirects
    if (pathname === '/' && token?.role) {
      const dashboardPath = getDashboardForRole(token.role)
      return NextResponse.redirect(new URL(dashboardPath, req.url))
    }

    // Handle login redirect
    if (pathname === '/login' && token) {
      const dashboardPath = getDashboardForRole(token.role)
      return NextResponse.redirect(new URL(dashboardPath, req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to public routes
        const publicRoutes = [
          '/login', 
          '/api/auth', 
          '/api/health', 
          '/api/puzzles',
          '/api/validation',
          '/_next', 
          '/favicon.ico',
          '/test-basic',
          '/admin-demo',
          '/admin-test-simple',
          '/puzzle-demo',
          '/test-modules',
          '/demo-working',
          '/dashboard', // Allow direct access to all dashboards in development
          '/'
        ]
        
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }
        
        // API routes with specific role requirements
        if (pathname.startsWith('/api/')) {
          return validateAPIAccess(token, pathname, req.method)
        }
        
        // Dashboard routes require authentication
        if (pathname.startsWith('/dashboard/')) {
          return !!token
        }
        
        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

// Helper function to get dashboard path for role
function getDashboardForRole(role) {
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

// Helper function to validate API access based on role
function validateAPIAccess(token, pathname, method) {
  if (!token) return false
  
  const role = token.role
  
  // Define role-based API access rules
  const apiRules = {
    // Admin-only APIs
    'admin': [
      '/api/users',
      '/api/admin'
    ],
    
    // Instructor and Admin APIs
    'instructor': [
      '/api/modules',
      '/api/instructor',
      '/api/student/modules', // Can view student modules
      '/api/student/progress' // Can view student progress
    ],
    
    // Student APIs
    'student': [
      '/api/student/modules',
      '/api/student/progress',
      '/api/ai', // All users can use AI
      '/api/notifications'
    ]
  }
  
  // Check if user role has access to this API
  const allowedPaths = apiRules[role] || []
  const hasAccess = allowedPaths.some(allowedPath => 
    pathname.startsWith(allowedPath)
  )
  
  // Special cases for shared APIs
  const sharedAPIs = [
    '/api/ai',
    '/api/notifications',
    '/api/modules' // Students can read modules
  ]
  
  const isSharedAPI = sharedAPIs.some(api => pathname.startsWith(api))
  
  // For shared APIs, allow read access for students, full access for instructors/admin
  if (isSharedAPI) {
    if (method === 'GET') {
      return true // All authenticated users can read
    } else {
      return role === 'instructor' || role === 'admin' // Only instructors/admin can write
    }
  }
  
  return hasAccess
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

