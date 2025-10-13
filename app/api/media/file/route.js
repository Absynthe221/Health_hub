import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/apiMiddleware'
import fs from 'fs/promises'
import path from 'path'

/**
 * Media File Serving API
 * Serves individual media files with proper headers and streaming
 */

// GET /api/media/file - Serve individual media file
export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const filePath = searchParams.get('path')
    const range = req.headers.get('range')

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    // Construct full file path
    const fullPath = path.join(process.cwd(), filePath)

    // Security check - ensure file is within allowed directories
    const allowedDirs = [
      path.join(process.cwd(), 'public', 'assets', 'ecg-media'),
      path.join(process.cwd(), 'public', 'segments'),
      path.join(process.cwd(), 'public', 'modules')
    ]

    const isAllowed = allowedDirs.some(dir => fullPath.startsWith(dir))
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check if file exists
    try {
      await fs.access(fullPath)
    } catch (error) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    const stats = await fs.stat(fullPath)
    const fileSize = stats.size
    const ext = path.extname(fullPath).toLowerCase()

    // Set content type based on file extension
    const contentType = getContentType(ext)
    const isVideo = contentType.startsWith('video/')
    const isAudio = contentType.startsWith('audio/')
    const isImage = contentType.startsWith('image/')

    // Handle range requests for video/audio streaming
    if (range && (isVideo || isAudio)) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = (end - start) + 1

      const stream = require('fs').createReadStream(fullPath, { start, end })
      
      return new NextResponse(stream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
        }
      })
    }

    // For images and non-streaming requests, serve the entire file
    const fileBuffer = await fs.readFile(fullPath)

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileSize.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        'Accept-Ranges': isVideo || isAudio ? 'bytes' : 'none'
      }
    })
  } catch (error) {
    console.error('Error serving media file:', error)
    return NextResponse.json(
      { error: 'Failed to serve media file' },
      { status: 500 }
    )
  }
})

// Helper function to get content type from file extension
function getContentType(ext) {
  const contentTypes = {
    // Video
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.wmv': 'video/x-ms-wmv',
    '.flv': 'video/x-flv',
    '.webm': 'video/webm',
    
    // Audio
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.aac': 'audio/aac',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    
    // Documents
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  }

  return contentTypes[ext] || 'application/octet-stream'
}

