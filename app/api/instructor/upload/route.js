import { NextResponse } from 'next/server'
import { withInstructorOrAdminAuth } from '@/lib/middleware/apiMiddleware'
import fs from 'fs/promises'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Instructor Upload API
 * Handles PPTX file uploads and triggers the content pipeline
 */

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'pptx')
const ASSETS_DIR = path.join(process.cwd(), 'assets')

// POST /api/instructor/upload - Upload PPTX and trigger pipeline
export const POST = withInstructorOrAdminAuth(async (req) => {
  try {
    const user = req.user
    const formData = await req.formData()
    const file = formData.get('file')
    const moduleTitle = formData.get('moduleTitle')
    const moduleDescription = formData.get('moduleDescription')
    const category = formData.get('category') || 'general'
    const difficulty = formData.get('difficulty') || 'intermediate'

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.pptx')) {
      return NextResponse.json(
        { error: 'Only PPTX files are supported' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!moduleTitle) {
      return NextResponse.json(
        { error: 'Module title is required' },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedTitle = moduleTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50)
    
    const fileName = `${sanitizedTitle}_${timestamp}.pptx`
    const filePath = path.join(UPLOAD_DIR, fileName)

    // Save uploaded file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await fs.writeFile(filePath, buffer)

    // Create module directory in assets
    const moduleDir = path.join(ASSETS_DIR, sanitizedTitle)
    await fs.mkdir(moduleDir, { recursive: true })

    // Copy file to assets directory
    const assetsFilePath = path.join(moduleDir, 'presentation.pptx')
    await fs.copyFile(filePath, assetsFilePath)

    // Generate module metadata
    const moduleData = {
      moduleId: `mod_${timestamp}`,
      moduleTitle,
      description: moduleDescription || '',
      category,
      difficulty,
      instructorId: user.id,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
      pptxPath: assetsFilePath,
      originalFileName: file.name
    }

    // Save metadata
    const metadataPath = path.join(moduleDir, 'metadata.json')
    await fs.writeFile(metadataPath, JSON.stringify(moduleData, null, 2))

    // Trigger the PPTX to module pipeline
    const pipelineResult = await triggerPPXTPipeline(moduleData)

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      module: {
        ...moduleData,
        pipelineStatus: pipelineResult.status,
        pipelineMessage: pipelineResult.message
      },
      file: {
        name: fileName,
        size: buffer.length,
        path: filePath
      }
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
})

// GET /api/instructor/upload - Get upload status and history
export const GET = withInstructorOrAdminAuth(async (req) => {
  try {
    const user = req.user
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const uploads = []

    // Read uploads directory
    try {
      const files = await fs.readdir(UPLOAD_DIR)
      
      for (const file of files) {
        if (file.endsWith('.pptx')) {
          const filePath = path.join(UPLOAD_DIR, file)
          const stats = await fs.stat(filePath)
          
          // Try to find corresponding metadata
          const sanitizedName = file.replace(/\d+\.pptx$/, '')
          const moduleDir = path.join(ASSETS_DIR, sanitizedName)
          const metadataPath = path.join(moduleDir, 'metadata.json')
          
          let metadata = null
          try {
            const metadataContent = await fs.readFile(metadataPath, 'utf8')
            metadata = JSON.parse(metadataContent)
          } catch (error) {
            // No metadata found
          }

          // Filter by status if specified
          if (status && metadata?.status !== status) continue

          uploads.push({
            fileName: file,
            filePath,
            size: stats.size,
            uploadedAt: stats.mtime,
            metadata,
            status: metadata?.status || 'unknown'
          })
        }
      }
    } catch (error) {
      // Uploads directory doesn't exist yet
    }

    // Sort by upload date (newest first)
    uploads.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))

    return NextResponse.json({
      success: true,
      uploads,
      metadata: {
        total: uploads.length,
        processing: uploads.filter(u => u.status === 'processing').length,
        completed: uploads.filter(u => u.status === 'completed').length,
        failed: uploads.filter(u => u.status === 'failed').length
      }
    })
  } catch (error) {
    console.error('Error getting uploads:', error)
    return NextResponse.json(
      { error: 'Failed to get uploads' },
      { status: 500 }
    )
  }
})

// Helper function to trigger PPTX pipeline
async function triggerPPXTPipeline(moduleData) {
  try {
    // Update the pptx_to_module.py script to use the specific file
    const scriptPath = path.join(process.cwd(), 'scripts', 'pipeline', 'pptx_to_module.py')
    
    // Check if the script exists
    try {
      await fs.access(scriptPath)
    } catch (error) {
      return {
        status: 'failed',
        message: 'PPTX pipeline script not found'
      }
    }

    // Execute the pipeline script
    const command = `cd ${process.cwd()} && python3 ${scriptPath} --input "${moduleData.pptxPath}" --output "public/modules" --module-id "${moduleData.moduleId}" --title "${moduleData.moduleTitle}"`
    
    console.log('Executing pipeline command:', command)
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 300000, // 5 minutes timeout
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    })

    if (stderr && !stderr.includes('warning')) {
      console.error('Pipeline stderr:', stderr)
      return {
        status: 'failed',
        message: `Pipeline error: ${stderr}`
      }
    }

    console.log('Pipeline stdout:', stdout)

    // Update metadata to reflect completion
    const moduleDir = path.dirname(moduleData.pptxPath)
    const metadataPath = path.join(moduleDir, 'metadata.json')
    
    const updatedMetadata = {
      ...moduleData,
      status: 'completed',
      processedAt: new Date().toISOString(),
      pipelineOutput: stdout
    }
    
    await fs.writeFile(metadataPath, JSON.stringify(updatedMetadata, null, 2))

    return {
      status: 'completed',
      message: 'PPTX pipeline completed successfully'
    }
  } catch (error) {
    console.error('Pipeline execution error:', error)
    
    // Update metadata to reflect failure
    try {
      const moduleDir = path.dirname(moduleData.pptxPath)
      const metadataPath = path.join(moduleDir, 'metadata.json')
      
      const updatedMetadata = {
        ...moduleData,
        status: 'failed',
        failedAt: new Date().toISOString(),
        error: error.message
      }
      
      await fs.writeFile(metadataPath, JSON.stringify(updatedMetadata, null, 2))
    } catch (updateError) {
      console.error('Error updating metadata:', updateError)
    }

    return {
      status: 'failed',
      message: `Pipeline failed: ${error.message}`
    }
  }
}

