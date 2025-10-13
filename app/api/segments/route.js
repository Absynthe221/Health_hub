import { NextResponse } from 'next/server'
import { withAPIAuth, withInstructorOrAdminAuth, withAuth } from '../../../lib/middleware/apiMiddleware.js'
import prisma from '../../../lib/prisma.js'

/**
 * Media Segments API
 * Handles CRUD operations for video segments with MCQs
 */

// GET /api/segments - List segments for a module
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const moduleId = searchParams.get('moduleId')
    const includeStats = searchParams.get('includeStats') === 'true'

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      )
    }

    const segments = await getMediaSegments(moduleId)
    
    let statistics = null
    if (includeStats) {
      statistics = await getSegmentStatistics(moduleId)
    }

    return NextResponse.json({
      success: true,
      segments,
      statistics,
      metadata: {
        totalSegments: segments.length,
        totalDuration: segments.reduce((total, segment) => 
          total + (segment.endTime - segment.startTime), 0),
        segmentsWithMCQs: segments.filter(s => s.mcqs).length
      }
    })
  } catch (error) {
    console.error('Error getting segments:', error)
    return NextResponse.json(
      { error: 'Failed to get segments' },
      { status: 500 }
    )
  }
})

// POST /api/segments - Create new segment(s)
export const POST = withInstructorOrAdminAuth(async (req) => {
  try {
    const data = await req.json()
    const user = req.user

    // Validate required fields
    if (!data.moduleId || !data.videoPath || data.startTime === undefined || data.endTime === undefined) {
      return NextResponse.json(
        { error: 'moduleId, videoPath, startTime, and endTime are required' },
        { status: 400 }
      )
    }

    // Check if it's a single segment or multiple segments
    if (Array.isArray(data.segments)) {
      // Bulk create segments
      const segments = await createMediaSegments(data.segments.map(segment => ({
        ...segment,
        moduleId: data.moduleId
      })))

      return NextResponse.json({
        success: true,
        message: `${data.segments.length} segments created successfully`,
        segments: segments,
        metadata: {
          totalCreated: data.segments.length
        }
      })
    } else {
      // Single segment creation
      const segment = await createMediaSegment({
        moduleId: data.moduleId,
        videoPath: data.videoPath,
        startTime: data.startTime,
        endTime: data.endTime,
        title: data.title,
        description: data.description,
        mcqs: data.mcqs,
        metadata: data.metadata
      })

      return NextResponse.json({
        success: true,
        message: 'Segment created successfully',
        segment
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating segment:', error)
    return NextResponse.json(
      { error: 'Failed to create segment' },
      { status: 500 }
    )
  }
})

// PUT /api/segments - Bulk update segments
export const PUT = withInstructorOrAdminAuth(async (req) => {
  try {
    const { segments } = await req.json()

    if (!Array.isArray(segments)) {
      return NextResponse.json(
        { error: 'Expected array of segments' },
        { status: 400 }
      )
    }

    const results = []

    for (const segmentData of segments) {
      try {
        const updatedSegment = await updateMediaSegment(segmentData.id, {
          videoPath: segmentData.videoPath,
          startTime: segmentData.startTime,
          endTime: segmentData.endTime,
          title: segmentData.title,
          description: segmentData.description,
          mcqs: segmentData.mcqs,
          metadata: segmentData.metadata
        })

        results.push({ id: segmentData.id, success: true, segment: updatedSegment })
      } catch (error) {
        results.push({ 
          id: segmentData.id, 
          success: false, 
          error: error.message 
        })
      }
    }

    const successCount = results.filter(r => r.success).length

    return NextResponse.json({
      success: true,
      message: `${successCount} segments updated successfully`,
      results,
      metadata: {
        total: segments.length,
        successful: successCount,
        failed: segments.length - successCount
      }
    })
  } catch (error) {
    console.error('Error updating segments:', error)
    return NextResponse.json(
      { error: 'Failed to update segments' },
      { status: 500 }
    )
  }
})

// DELETE /api/segments - Delete segments
export const DELETE = withInstructorOrAdminAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids')?.split(',') || []

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'No segment IDs provided' },
        { status: 400 }
      )
    }

    const results = []

    for (const id of ids) {
      try {
        await deleteMediaSegment(id)
        results.push({ id, success: true, message: 'Segment deleted' })
      } catch (error) {
        results.push({ 
          id, 
          success: false, 
          error: error.message 
        })
      }
    }

    const successCount = results.filter(r => r.success).length

    return NextResponse.json({
      success: true,
      message: `${successCount} segments deleted successfully`,
      results,
      metadata: {
        total: ids.length,
        successful: successCount,
        failed: ids.length - successCount
      }
    })
  } catch (error) {
    console.error('Error deleting segments:', error)
    return NextResponse.json(
      { error: 'Failed to delete segments' },
      { status: 500 }
    )
  }
})

// Helper functions
async function updateMediaSegment(id, data) {
  return await prisma.mediaSegment.update({
    where: { id: parseInt(id) },
    data
  })
}

async function deleteMediaSegment(id) {
  return await prisma.mediaSegment.delete({
    where: { id: parseInt(id) }
  })
}
