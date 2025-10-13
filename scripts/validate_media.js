#!/usr/bin/env node

/**
 * Media Validation Script
 * Validates media files, FFmpeg segments, and ensures all slides have required assets
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import { promisify } from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const execAsync = promisify(exec)

// Supported media formats
const SUPPORTED_FORMATS = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
  audio: ['.mp3', '.wav', '.aac', '.ogg', '.m4a', '.wav'],
  video: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
  subtitle: ['.srt', '.vtt', '.ass', '.ssa']
}

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  image: 10 * 1024 * 1024,    // 10MB
  audio: 50 * 1024 * 1024,    // 50MB
  video: 500 * 1024 * 1024,   // 500MB
  subtitle: 1 * 1024 * 1024   // 1MB
}

/**
 * Check if FFmpeg is available
 */
async function checkFFmpeg() {
  try {
    await execAsync('ffmpeg -version')
    return true
  } catch {
    return false
  }
}

/**
 * Get media file information using FFmpeg
 */
async function getMediaInfo(filePath) {
  try {
    const { stdout } = await execAsync(`ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`)
    return JSON.parse(stdout)
  } catch (error) {
    throw new Error(`Failed to get media info: ${error.message}`)
  }
}

/**
 * Validate a single media file
 */
async function validateMediaFile(filePath, expectedType) {
  const errors = []
  const warnings = []
  const info = {}

  try {
    // Check if file exists
    const stats = await fs.stat(filePath)
    info.size = stats.size
    info.exists = true

    // Check file size limits
    if (FILE_SIZE_LIMITS[expectedType] && stats.size > FILE_SIZE_LIMITS[expectedType]) {
      errors.push(`File size (${(stats.size / 1024 / 1024).toFixed(2)}MB) exceeds limit (${(FILE_SIZE_LIMITS[expectedType] / 1024 / 1024).toFixed(2)}MB)`)
    }

    // Check file extension
    const ext = path.extname(filePath).toLowerCase()
    if (!SUPPORTED_FORMATS[expectedType]?.includes(ext)) {
      errors.push(`Unsupported file format: ${ext}. Expected: ${SUPPORTED_FORMATS[expectedType]?.join(', ')}`)
    }

    // Get detailed media info for audio/video files
    if (expectedType === 'audio' || expectedType === 'video') {
      try {
        const mediaInfo = await getMediaInfo(filePath)
        info.duration = parseFloat(mediaInfo.format.duration)
        info.format = mediaInfo.format.format_name

        if (expectedType === 'video') {
          const videoStream = mediaInfo.streams.find(s => s.codec_type === 'video')
          if (videoStream) {
            info.width = videoStream.width
            info.height = videoStream.height
            info.fps = eval(videoStream.r_frame_rate) || 0
          }
        }

        if (expectedType === 'audio') {
          const audioStream = mediaInfo.streams.find(s => s.codec_type === 'audio')
          if (audioStream) {
            info.sampleRate = parseInt(audioStream.sample_rate)
            info.channels = parseInt(audioStream.channels)
          }
        }
      } catch (error) {
        warnings.push(`Could not analyze media file: ${error.message}`)
      }
    }

    // Additional validations based on type
    if (expectedType === 'image' && info.size < 1024) {
      warnings.push('Image file is very small, may be corrupted or placeholder')
    }

    if (expectedType === 'audio' && info.duration && info.duration < 1) {
      warnings.push('Audio file is very short, may be corrupted or placeholder')
    }

    if (expectedType === 'video' && info.duration && info.duration < 1) {
      warnings.push('Video file is very short, may be corrupted or placeholder')
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      errors.push('File does not exist')
      info.exists = false
    } else {
      errors.push(`File validation error: ${error.message}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    info
  }
}

/**
 * Validate subtitle file format
 */
async function validateSubtitleFile(filePath) {
  const errors = []
  const warnings = []

  try {
    const content = await fs.readFile(filePath, 'utf8')
    const ext = path.extname(filePath).toLowerCase()

    if (ext === '.srt') {
      // Basic SRT format validation
      const lines = content.split('\n')
      let lineNumber = 0
      let sequenceNumber = null
      let timeCode = null

      for (const line of lines) {
        lineNumber++
        
        if (line.trim() === '') {
          sequenceNumber = null
          timeCode = null
          continue
        }

        // Check if line is a sequence number
        if (!isNaN(parseInt(line.trim())) && sequenceNumber === null) {
          sequenceNumber = parseInt(line.trim())
          continue
        }

        // Check if line is a time code
        if (timeCode === null && /^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/.test(line.trim())) {
          timeCode = line.trim()
          continue
        }

        // If we have both sequence and time code, this should be subtitle text
        if (sequenceNumber && timeCode && line.trim().length > 0) {
          if (line.trim().length > 100) {
            warnings.push(`Line ${lineNumber}: Subtitle text is very long (${line.trim().length} characters)`)
          }
        }
      }
    } else if (ext === '.vtt') {
      // Basic VTT format validation
      if (!content.startsWith('WEBVTT')) {
        errors.push('VTT file must start with "WEBVTT" header')
      }

      const lines = content.split('\n')
      let inCue = false
      let cueCount = 0

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        if (line.includes('-->')) {
          inCue = true
          cueCount++
          
          // Validate time format
          if (!/^\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}$/.test(line)) {
            errors.push(`Line ${i + 1}: Invalid VTT time format`)
          }
        } else if (inCue && line === '') {
          inCue = false
        }
      }

      if (cueCount === 0) {
        warnings.push('VTT file appears to have no subtitle cues')
      }
    }

  } catch (error) {
    errors.push(`Failed to validate subtitle file: ${error.message}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Check if FFmpeg segments exist for a module
 */
async function validateFFmpegSegments(moduleDir) {
  const errors = []
  const warnings = []
  const segments = []

  const segmentsDir = path.join(moduleDir, 'segments')
  
  try {
    const entries = await fs.readdir(segmentsDir, { withFileTypes: true })
    
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.mp4')) {
        const segmentPath = path.join(segmentsDir, entry.name)
        const segmentInfo = await validateMediaFile(segmentPath, 'video')
        
        segments.push({
          name: entry.name,
          path: segmentPath,
          ...segmentInfo
        })

        if (!segmentInfo.valid) {
          errors.push(...segmentInfo.errors.map(e => `Segment ${entry.name}: ${e}`))
        }
        warnings.push(...segmentInfo.warnings.map(w => `Segment ${entry.name}: ${w}`))
      }
    }

    if (segments.length === 0) {
      warnings.push('No FFmpeg segments found in segments directory')
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      warnings.push('Segments directory does not exist')
    } else {
      errors.push(`Failed to validate segments: ${error.message}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    segments
  }
}

/**
 * Validate media files for a single module
 */
async function validateModuleMedia(modulePath) {
  const errors = []
  const warnings = []
  const mediaInfo = {
    images: [],
    audio: [],
    videos: [],
    subtitles: [],
    segments: []
  }

  try {
    const moduleContent = await fs.readFile(modulePath, 'utf8')
    const moduleData = JSON.parse(moduleContent)
    const moduleDir = path.dirname(modulePath)

    // Validate slides media
    for (const slide of moduleData.slides || []) {
      if (slide.media) {
        // Validate image
        if (slide.media.image) {
          const imagePath = path.resolve(moduleDir, slide.media.image)
          const imageValidation = await validateMediaFile(imagePath, 'image')
          mediaInfo.images.push({
            slide: slide.slideNumber,
            path: slide.media.image,
            ...imageValidation
          })

          if (!imageValidation.valid) {
            errors.push(`Slide ${slide.slideNumber} image: ${imageValidation.errors.join(', ')}`)
          }
          warnings.push(...imageValidation.warnings.map(w => `Slide ${slide.slideNumber} image: ${w}`))
        } else {
          errors.push(`Slide ${slide.slideNumber}: Missing required image`)
        }

        // Validate audio
        if (slide.media.audio) {
          const audioPath = path.resolve(moduleDir, slide.media.audio)
          const audioValidation = await validateMediaFile(audioPath, 'audio')
          mediaInfo.audio.push({
            slide: slide.slideNumber,
            path: slide.media.audio,
            ...audioValidation
          })

          if (!audioValidation.valid) {
            errors.push(`Slide ${slide.slideNumber} audio: ${audioValidation.errors.join(', ')}`)
          }
          warnings.push(...audioValidation.warnings.map(w => `Slide ${slide.slideNumber} audio: ${w}`))
        } else {
          errors.push(`Slide ${slide.slideNumber}: Missing required audio`)
        }

        // Validate subtitle
        if (slide.media.subtitle) {
          const subtitlePath = path.resolve(moduleDir, slide.media.subtitle)
          const subtitleValidation = await validateSubtitleFile(subtitlePath)
          mediaInfo.subtitles.push({
            slide: slide.slideNumber,
            path: slide.media.subtitle,
            ...subtitleValidation
          })

          if (!subtitleValidation.valid) {
            errors.push(`Slide ${slide.slideNumber} subtitle: ${subtitleValidation.errors.join(', ')}`)
          }
          warnings.push(...subtitleValidation.warnings.map(w => `Slide ${slide.slideNumber} subtitle: ${w}`))
        } else {
          errors.push(`Slide ${slide.slideNumber}: Missing required subtitle`)
        }

        // Validate video (optional)
        if (slide.media.video) {
          const videoPath = path.resolve(moduleDir, slide.media.video)
          const videoValidation = await validateMediaFile(videoPath, 'video')
          mediaInfo.videos.push({
            slide: slide.slideNumber,
            path: slide.media.video,
            ...videoValidation
          })

          if (!videoValidation.valid) {
            errors.push(`Slide ${slide.slideNumber} video: ${videoValidation.errors.join(', ')}`)
          }
          warnings.push(...videoValidation.warnings.map(w => `Slide ${slide.slideNumber} video: ${w}`))
        }
      } else {
        errors.push(`Slide ${slide.slideNumber}: Missing media object`)
      }
    }

    // Validate FFmpeg segments
    const segmentValidation = await validateFFmpegSegments(moduleDir)
    mediaInfo.segments = segmentValidation.segments
    errors.push(...segmentValidation.errors)
    warnings.push(...segmentValidation.warnings)

  } catch (error) {
    errors.push(`Failed to validate module media: ${error.message}`)
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    mediaInfo
  }
}

/**
 * Find all module.json files
 */
async function findModuleFiles() {
  const modulesDir = path.join(projectRoot, 'public', 'modules')
  const moduleFiles = []

  try {
    const entries = await fs.readdir(modulesDir, { withFileTypes: true })
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const moduleJsonPath = path.join(modulesDir, entry.name, 'module.json')
        try {
          await fs.access(moduleJsonPath)
          moduleFiles.push(moduleJsonPath)
        } catch {
          // module.json doesn't exist in this directory
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read modules directory: ${error.message}`)
  }

  return moduleFiles
}

/**
 * Main validation function
 */
async function main() {
  console.log('🎬 Validating ECG Platform Media Files...\n')

  // Check FFmpeg availability
  const ffmpegAvailable = await checkFFmpeg()
  if (!ffmpegAvailable) {
    console.log('⚠️  Warning: FFmpeg not found. Media analysis will be limited.\n')
  }

  const moduleFiles = await findModuleFiles()
  
  if (moduleFiles.length === 0) {
    console.log('⚠️  No module.json files found in public/modules/')
    process.exit(0)
  }

  console.log(`📁 Found ${moduleFiles.length} modules to validate\n`)

  const results = []
  let totalErrors = 0
  let totalWarnings = 0

  for (const moduleFile of moduleFiles) {
    const result = await validateModuleMedia(moduleFile)
    results.push(result)
    
    const moduleName = path.basename(path.dirname(moduleFile))
    
    if (result.valid) {
      console.log(`✅ ${moduleName}: Media validation passed${result.warnings.length > 0 ? ` (${result.warnings.length} warnings)` : ''}`)
    } else {
      console.log(`❌ ${moduleName}: ${result.errors.length} errors${result.warnings.length > 0 ? `, ${result.warnings.length} warnings` : ''}`)
    }

    totalErrors += result.errors.length
    totalWarnings += result.warnings.length

    // Print errors and warnings
    result.errors.forEach(error => {
      console.log(`   🔴 ${error}`)
    })
    
    result.warnings.forEach(warning => {
      console.log(`   🟡 ${warning}`)
    })

    // Print media summary
    if (result.mediaInfo) {
      const { images, audio, subtitles, videos, segments } = result.mediaInfo
      console.log(`   📊 Media: ${images.length} images, ${audio.length} audio, ${subtitles.length} subtitles, ${videos.length} videos, ${segments.length} segments`)
    }
  }

  console.log(`\n📊 Media Validation Summary:`)
  console.log(`   📁 Total modules: ${moduleFiles.length}`)
  console.log(`   ✅ Valid modules: ${results.filter(r => r.valid).length}`)
  console.log(`   ❌ Invalid modules: ${results.filter(r => !r.valid).length}`)
  console.log(`   🔴 Total errors: ${totalErrors}`)
  console.log(`   🟡 Total warnings: ${totalWarnings}`)

  if (totalErrors > 0) {
    console.log('\n❌ Media validation failed!')
    process.exit(1)
  } else {
    console.log('\n✅ All media files validated successfully!')
    process.exit(0)
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Media validation failed:', error)
    process.exit(1)
  })
}

export { validateModuleMedia, validateMediaFile, validateSubtitleFile, validateFFmpegSegments }

