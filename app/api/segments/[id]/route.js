import { NextResponse } from 'next/server'
import { withAPIAuth, withInstructorOrAdminAuth, withAuth } from '@/lib/middleware/apiMiddleware'
import { 
  getMediaSegment, 
  updateMediaSegment, 
  deleteMediaSegment,
  updateSegmentMCQs 
} from '@/lib/prisma'

/**
 * Individual Media Segment Operations API
 * Handles get, update, delete for specific segments
 */

// GET /api/segments/[id] - Get specific segment
export async function GET(req, { params }) {
  return withAuth(async (req) => {
    try {
      const { id } = params

      const segment = await getMediaSegment(id)
      
      if (!segment) {
        return NextResponse.json(
          { error: 'Segment not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        segment
      })
    } catch (error) {
      console.error('Error getting segment:', error)
      return NextResponse.json(
        { error: 'Failed to get segment' },
        { status: 500 }
      )
    }
  })(req)
}

// PUT /api/segments/[id] - Update specific segment
export async function PUT(req, { params }) {
  return withInstructorOrAdminAuth(async (req) => {
    try {
      const { id } = params
      const updates = await req.json()

      // Validate segment exists
      const existingSegment = await getMediaSegment(id)
      if (!existingSegment) {
        return NextResponse.json(
          { error: 'Segment not found' },
          { status: 404 }
        )
      }

      // Update segment
      const updatedSegment = await updateMediaSegment(id, updates)

      return NextResponse.json({
        success: true,
        message: 'Segment updated successfully',
        segment: updatedSegment
      })
    } catch (error) {
      console.error('Error updating segment:', error)
      return NextResponse.json(
        { error: 'Failed to update segment' },
        { status: 500 }
      )
    }
  })(req)
}

// DELETE /api/segments/[id] - Delete specific segment
export async function DELETE(req, { params }) {
  return withInstructorOrAdminAuth(async (req) => {
    try {
      const { id } = params

      // Validate segment exists
      const existingSegment = await getMediaSegment(id)
      if (!existingSegment) {
        return NextResponse.json(
          { error: 'Segment not found' },
          { status: 404 }
        )
      }

      // Delete segment
      await deleteMediaSegment(id)

      return NextResponse.json({
        success: true,
        message: 'Segment deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting segment:', error)
      return NextResponse.json(
        { error: 'Failed to delete segment' },
        { status: 500 }
      )
    }
  })(req)
}

