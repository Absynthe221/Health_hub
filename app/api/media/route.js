import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/apiMiddleware'
import fs from 'fs/promises'
import path from 'path'
import { createReadStream } from 'fs'

/**
 * Media Serving API
 * Serves segmented MP4s, thumbnails, and other media files
 */

const MEDIA_DIR = path.join(process.cwd(), 'public', 'assets', 'ecg-media')
const SEGMENTS_DIR = path.join(process.cwd(), 'public', 'segments')

// GET /api/media - List available media files
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const moduleId = searchParams.get('moduleId')
    const type = searchParams.get('type') // 'video', 'audio', 'image', 'thumbnail'
    const format = searchParams.get('format') // 'segments', 'full'

    const mediaFiles = []

    // Get media files based on parameters
    if (moduleId) {
      // Get media for specific module
      const moduleMedia = await getModuleMedia(moduleId, type)
      mediaFiles.push(...moduleMedia)
    } else {
      // Get all available media
      const allMedia = await getAllMedia(type)
      mediaFiles.push(...allMedia)
    }

    // Filter by format if specified
    let filteredMedia = mediaFiles
    if (format === 'segments') {
      filteredMedia = mediaFiles.filter(file => file.isSegment)
    } else if (format === 'full') {
      filteredMedia = mediaFiles.filter(file => !file.isSegment)
    }

    return NextResponse.json({
      success: true,
      media: filteredMedia,
      metadata: {
        total: filteredMedia.length,
        types: getMediaTypes(filteredMedia),
        totalSize: getTotalSize(filteredMedia)
      }
    })
  } catch (error) {
    console.error('Error listing media:', error)
    return NextResponse.json(
      { error: 'Failed to list media files' },
      { status: 500 }
    )
  }
})

// Helper function to get media files for a specific module
async function getModuleMedia(moduleId, type) {
  const mediaFiles = []

  try {
    // Check segments directory for module
    const moduleSegmentsDir = path.join(SEGMENTS_DIR, moduleId)
    const segmentFiles = await getDirectoryFiles(moduleSegmentsDir, type)
    mediaFiles.push(...segmentFiles.map(file => ({
      ...file,
      isSegment: true,
      moduleId
    })))

    // Check main media directory for module
    const moduleMediaDir = path.join(MEDIA_DIR, moduleId)
    const mediaFiles_ = await getDirectoryFiles(moduleMediaDir, type)
    mediaFiles.push(...mediaFiles_.map(file => ({
      ...file,
      isSegment: false,
      moduleId
    })))
  } catch (error) {
    console.warn(`Error getting media for module ${moduleId}:`, error.message)
  }

  return mediaFiles
}

// Helper function to get all media files
async function getAllMedia(type) {
  const mediaFiles = []

  try {
    // Get all media from main directory
    const allMedia = await getDirectoryFiles(MEDIA_DIR, type)
    mediaFiles.push(...allMedia.map(file => ({
      ...file,
      isSegment: false
    })))

    // Get all segments
    const allSegments = await getDirectoryFiles(SEGMENTS_DIR, type)
    mediaFiles.push(...allSegments.map(file => ({
      ...file,
      isSegment: true
    })))
  } catch (error) {
    console.warn('Error getting all media:', error.message)
  }

  return mediaFiles
}

// Helper function to get files from directory
async function getDirectoryFiles(dir, type) {
  const files = []

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Recursively get files from subdirectories
        const subFiles = await getDirectoryFiles(path.join(dir, entry.name), type)
        files.push(...subFiles)
      } else if (entry.isFile()) {
        const filePath = path.join(dir, entry.name)
        const stats = await fs.stat(filePath)
        const ext = path.extname(entry.name).toLowerCase()

        // Filter by type if specified
        if (type && !matchesType(ext, type)) continue

        files.push({
          name: entry.name,
          path: filePath.replace(process.cwd(), ''),
          size: stats.size,
          type: getFileType(ext),
          extension: ext,
          lastModified: stats.mtime,
          url: `/api/media/file?path=${encodeURIComponent(filePath.replace(process.cwd(), ''))}`
        })
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }

  return files
}

// Helper function to check if file type matches requested type
function matchesType(ext, type) {
  const typeMap = {
    video: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
    audio: ['.mp3', '.wav', '.aac', '.ogg', '.m4a'],
    image: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
    thumbnail: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  }

  return typeMap[type]?.includes(ext) || false
}

// Helper function to get file type from extension
function getFileType(ext) {
  if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'].includes(ext)) return 'video'
  if (['.mp3', '.wav', '.aac', '.ogg', '.m4a'].includes(ext)) return 'audio'
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) return 'image'
  return 'unknown'
}

// Helper function to get media types from files
function getMediaTypes(files) {
  const types = {}
  files.forEach(file => {
    types[file.type] = (types[file.type] || 0) + 1
  })
  return types
}

// Helper function to get total size of files
function getTotalSize(files) {
  return files.reduce((total, file) => total + file.size, 0)
}

