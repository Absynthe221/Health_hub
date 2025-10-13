import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client instance for database operations
 * Includes MediaSegment model for video segmentation
 */

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * MediaSegment operations
 */

// Create a new media segment
export async function createMediaSegment(data) {
  return await prisma.mediaSegment.create({
    data: {
      moduleId: data.moduleId,
      videoPath: data.videoPath,
      startTime: data.startTime,
      endTime: data.endTime,
      title: data.title,
      description: data.description,
      mcqs: data.mcqs,
      metadata: data.metadata
    },
    include: {
      module: true
    }
  })
}

// Get media segments for a module
export async function getMediaSegments(moduleId) {
  return await prisma.mediaSegment.findMany({
    where: { moduleId },
    orderBy: { startTime: 'asc' },
    include: {
      module: {
        select: {
          id: true,
          title: true,
          description: true
        }
      }
    }
  })
}

// Get a specific media segment
export async function getMediaSegment(id) {
  return await prisma.mediaSegment.findUnique({
    where: { id: parseInt(id) },
    include: {
      module: {
        select: {
          id: true,
          title: true,
          description: true
        }
      }
    }
  })
}

// Update a media segment
export async function updateMediaSegment(id, data) {
  return await prisma.mediaSegment.update({
    where: { id: parseInt(id) },
    data: {
      ...data,
      updatedAt: new Date()
    },
    include: {
      module: true
    }
  })
}

// Delete a media segment
export async function deleteMediaSegment(id) {
  return await prisma.mediaSegment.delete({
    where: { id: parseInt(id) }
  })
}

// Bulk create media segments
export async function createMediaSegments(segments) {
  return await prisma.mediaSegment.createMany({
    data: segments.map(segment => ({
      moduleId: segment.moduleId,
      videoPath: segment.videoPath,
      startTime: segment.startTime,
      endTime: segment.endTime,
      title: segment.title,
      description: segment.description,
      mcqs: segment.mcqs,
      metadata: segment.metadata
    }))
  })
}

// Get segments by time range
export async function getSegmentsByTimeRange(moduleId, startTime, endTime) {
  return await prisma.mediaSegment.findMany({
    where: {
      moduleId,
      OR: [
        {
          AND: [
            { startTime: { gte: startTime } },
            { startTime: { lte: endTime } }
          ]
        },
        {
          AND: [
            { endTime: { gte: startTime } },
            { endTime: { lte: endTime } }
          ]
        },
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gte: endTime } }
          ]
        }
      ]
    },
    orderBy: { startTime: 'asc' }
  })
}

// Get module with segments
export async function getModuleWithSegments(moduleId) {
  return await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      mediaSegments: {
        orderBy: { startTime: 'asc' }
      },
      course: {
        select: {
          id: true,
          title: true,
          description: true
        }
      },
      lessons: {
        orderBy: { order: 'asc' }
      }
    }
  })
}

// Update segment MCQs
export async function updateSegmentMCQs(id, mcqs) {
  return await prisma.mediaSegment.update({
    where: { id: parseInt(id) },
    data: {
      mcqs: mcqs,
      updatedAt: new Date()
    }
  })
}

// Get segments with MCQs
export async function getSegmentsWithMCQs(moduleId) {
  return await prisma.mediaSegment.findMany({
    where: {
      moduleId,
      mcqs: { not: Prisma.JsonNull }
    },
    orderBy: { startTime: 'asc' }
  })
}

// Get segment statistics
export async function getSegmentStatistics(moduleId) {
  const stats = await prisma.mediaSegment.aggregate({
    where: { moduleId },
    _count: {
      id: true
    },
    _min: {
      startTime: true
    },
    _max: {
      endTime: true
    }
  })

  const segmentsWithMCQs = await prisma.mediaSegment.count({
    where: {
      moduleId,
      mcqs: { not: Prisma.JsonNull }
    }
  })

  return {
    totalSegments: stats._count.id,
    totalDuration: stats._max.endTime - (stats._min.startTime || 0),
    segmentsWithMCQs,
    mcqCoverage: stats._count.id > 0 ? (segmentsWithMCQs / stats._count.id * 100).toFixed(1) : 0
  }
}

/**
 * Module operations with segments
 */

// Create module with initial segments
export async function createModuleWithSegments(moduleData, segments = []) {
  return await prisma.module.create({
    data: {
      ...moduleData,
      mediaSegments: {
        create: segments.map(segment => ({
          videoPath: segment.videoPath,
          startTime: segment.startTime,
          endTime: segment.endTime,
          title: segment.title,
          description: segment.description,
          mcqs: segment.mcqs,
          metadata: segment.metadata
        }))
      }
    },
    include: {
      mediaSegments: true,
      course: true
    }
  })
}

// Update module and segments
export async function updateModuleWithSegments(moduleId, moduleData, segments = []) {
  return await prisma.module.update({
    where: { id: moduleId },
    data: {
      ...moduleData,
      updatedAt: new Date(),
      mediaSegments: segments.length > 0 ? {
        deleteMany: {},
        create: segments.map(segment => ({
          videoPath: segment.videoPath,
          startTime: segment.startTime,
          endTime: segment.endTime,
          title: segment.title,
          description: segment.description,
          mcqs: segment.mcqs,
          metadata: segment.metadata
        }))
      } : undefined
    },
    include: {
      mediaSegments: true,
      course: true
    }
  })
}

/**
 * Utility functions
 */

// Convert JSON module data to database format
export function convertModuleToDatabase(moduleData) {
  return {
    title: moduleData.moduleTitle || moduleData.title,
    description: moduleData.description,
    order: moduleData.order || 0,
    courseId: moduleData.courseId || 'default-course', // You may need to handle this
    mediaSegments: moduleData.segments?.map(segment => ({
      videoPath: segment.videoPath || segment.path,
      startTime: segment.startTime || 0,
      endTime: segment.endTime || segment.duration,
      title: segment.title,
      description: segment.description,
      mcqs: segment.mcqs || segment.quiz,
      metadata: {
        thumbnail: segment.thumbnail,
        duration: segment.endTime - segment.startTime,
        fileSize: segment.fileSize,
        mimeType: segment.mimeType
      }
    })) || []
  }
}

// Convert database module to JSON format
export function convertDatabaseToModule(dbModule) {
  return {
    moduleId: dbModule.id,
    moduleTitle: dbModule.title,
    description: dbModule.description,
    order: dbModule.order,
    courseId: dbModule.courseId,
    createdAt: dbModule.createdAt,
    updatedAt: dbModule.updatedAt,
    segments: dbModule.mediaSegments?.map(segment => ({
      id: segment.id,
      videoPath: segment.videoPath,
      startTime: segment.startTime,
      endTime: segment.endTime,
      title: segment.title,
      description: segment.description,
      mcqs: segment.mcqs,
      metadata: segment.metadata
    })) || [],
    metadata: {
      totalSegments: dbModule.mediaSegments?.length || 0,
      totalDuration: dbModule.mediaSegments?.reduce((total, segment) => 
        total + (segment.endTime - segment.startTime), 0) || 0,
      segmentsWithMCQs: dbModule.mediaSegments?.filter(s => s.mcqs).length || 0
    }
  }
}

export default prisma

