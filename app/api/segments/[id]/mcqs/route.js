import { NextResponse } from 'next/server'
import { withInstructorOrAdminAuth } from '@/lib/middleware/apiMiddleware'
import { updateSegmentMCQs, getMediaSegment } from '@/lib/prisma'

/**
 * Segment MCQs API
 * Handles updating multiple choice questions for specific segments
 */

// PUT /api/segments/[id]/mcqs - Update segment MCQs
export async function PUT(req, { params }) {
  return withInstructorOrAdminAuth(async (req) => {
    try {
      const { id } = params
      const { mcqs, source } = await req.json()

      // Validate segment exists
      const existingSegment = await getMediaSegment(id)
      if (!existingSegment) {
        return NextResponse.json(
          { error: 'Segment not found' },
          { status: 404 }
        )
      }

      // Validate MCQs structure
      if (!Array.isArray(mcqs)) {
        return NextResponse.json(
          { error: 'MCQs must be an array' },
          { status: 400 }
        )
      }

      // Validate each MCQ
      for (const mcq of mcqs) {
        if (!mcq.question || !mcq.options || !Array.isArray(mcq.options)) {
          return NextResponse.json(
            { error: 'Each MCQ must have question and options array' },
            { status: 400 }
          )
        }
      }

      // Prepare MCQs data with metadata
      const mcqsData = {
        questions: mcqs,
        metadata: {
          totalQuestions: mcqs.length,
          generatedAt: new Date().toISOString(),
          source: source || 'manual',
          updatedBy: req.user.id,
          updatedByName: req.user.name
        }
      }

      // Update segment MCQs
      const updatedSegment = await updateSegmentMCQs(id, mcqsData)

      return NextResponse.json({
        success: true,
        message: 'Segment MCQs updated successfully',
        segment: {
          id: updatedSegment.id,
          title: updatedSegment.title,
          mcqs: updatedSegment.mcqs
        },
        metadata: {
          totalQuestions: mcqs.length,
          source: source || 'manual'
        }
      })
    } catch (error) {
      console.error('Error updating segment MCQs:', error)
      return NextResponse.json(
        { error: 'Failed to update segment MCQs' },
        { status: 500 }
      )
    }
  })(req)
}

// GET /api/segments/[id]/mcqs - Get segment MCQs
export async function GET(req, { params }) {
  return withInstructorOrAdminAuth(async (req) => {
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
        mcqs: segment.mcqs,
        segment: {
          id: segment.id,
          title: segment.title,
          startTime: segment.startTime,
          endTime: segment.endTime
        }
      })
    } catch (error) {
      console.error('Error getting segment MCQs:', error)
      return NextResponse.json(
        { error: 'Failed to get segment MCQs' },
        { status: 500 }
      )
    }
  })(req)
}

// DELETE /api/segments/[id]/mcqs - Remove segment MCQs
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

      // Remove MCQs
      const updatedSegment = await updateSegmentMCQs(id, null)

      return NextResponse.json({
        success: true,
        message: 'Segment MCQs removed successfully',
        segment: {
          id: updatedSegment.id,
          title: updatedSegment.title
        }
      })
    } catch (error) {
      console.error('Error removing segment MCQs:', error)
      return NextResponse.json(
        { error: 'Failed to remove segment MCQs' },
        { status: 500 }
      )
    }
  })(req)
}

