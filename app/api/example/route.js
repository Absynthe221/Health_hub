import { withAPIAuth, withAdminAuth, withInstructorOrAdminAuth, withAuth } from '@/lib/middleware/apiMiddleware'
import { NextResponse } from 'next/server'

// Example API route with role-based access control

// Admin-only endpoint
export const GET = withAdminAuth(async (req) => {
  return NextResponse.json({
    message: 'Admin access granted',
    data: { adminOnly: true }
  })
})

// Instructor or Admin endpoint
export const POST = withInstructorOrAdminAuth(async (req) => {
  return NextResponse.json({
    message: 'Instructor/Admin access granted',
    data: { instructorOrAdmin: true }
  })
})

// Any authenticated user
export const PUT = withAuth(async (req) => {
  return NextResponse.json({
    message: 'Authenticated user access granted',
    data: { authenticated: true }
  })
})

