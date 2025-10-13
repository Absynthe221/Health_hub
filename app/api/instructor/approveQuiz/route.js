import { NextResponse } from 'next/server'
import { withInstructorOrAdminAuth } from '@/lib/middleware/apiMiddleware'
import fs from 'fs/promises'
import path from 'path'

/**
 * Instructor Quiz Approval API
 * Handles quiz review, approval, and rejection
 */

const MODULES_DIR = path.join(process.cwd(), 'public', 'modules')

// POST /api/instructor/approveQuiz - Approve or reject quiz
export const POST = withInstructorOrAdminAuth(async (req) => {
  try {
    const user = req.user
    const { moduleId, slideIndex, quizIndex, action, feedback } = await req.json()

    // Validate required fields
    if (!moduleId || slideIndex === undefined || quizIndex === undefined || !action) {
      return NextResponse.json(
        { error: 'moduleId, slideIndex, quizIndex, and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject', 'request_changes'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be approve, reject, or request_changes' },
        { status: 400 }
      )
    }

    // Find module directory
    const moduleDir = await findModuleDirectory(moduleId)
    if (!moduleDir) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    // Load module data
    const moduleJsonPath = path.join(moduleDir, 'module.json')
    const moduleData = JSON.parse(await fs.readFile(moduleJsonPath, 'utf8'))

    // Check permissions
    if (user.role === 'instructor' && moduleData.instructorId !== user.id) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    // Validate slide and quiz indices
    if (!moduleData.slides || slideIndex >= moduleData.slides.length) {
      return NextResponse.json(
        { error: 'Invalid slide index' },
        { status: 400 }
      )
    }

    const slide = moduleData.slides[slideIndex]
    if (!slide.quiz || quizIndex >= slide.quiz.questions.length) {
      return NextResponse.json(
        { error: 'Invalid quiz index' },
        { status: 400 }
      )
    }

    // Update quiz approval status
    const quiz = slide.quiz.questions[quizIndex]
    
    // Initialize approval history if it doesn't exist
    if (!quiz.approvalHistory) {
      quiz.approvalHistory = []
    }

    // Add approval record
    const approvalRecord = {
      action,
      reviewerId: user.id,
      reviewerName: user.name,
      reviewedAt: new Date().toISOString(),
      feedback: feedback || null
    }

    quiz.approvalHistory.push(approvalRecord)
    quiz.status = action
    quiz.lastReviewedBy = user.id
    quiz.lastReviewedAt = new Date().toISOString()

    // If approved, mark as ready for use
    if (action === 'approve') {
      quiz.isApproved = true
      quiz.isPublished = true
    } else {
      quiz.isApproved = false
      quiz.isPublished = false
    }

    // Update module metadata
    moduleData.updatedAt = new Date().toISOString()
    moduleData.lastReviewedBy = user.id
    moduleData.lastReviewedAt = new Date().toISOString()

    // Update quiz statistics
    const totalQuizzes = moduleData.slides.reduce((count, s) => 
      count + (s.quiz ? s.quiz.questions.length : 0), 0)
    const approvedQuizzes = moduleData.slides.reduce((count, s) => 
      count + (s.quiz ? s.quiz.questions.filter(q => q.isApproved).length : 0), 0)
    
    moduleData.metadata = {
      ...moduleData.metadata,
      totalQuizzes,
      approvedQuizzes,
      pendingQuizzes: totalQuizzes - approvedQuizzes,
      quizApprovalRate: totalQuizzes > 0 ? (approvedQuizzes / totalQuizzes * 100).toFixed(1) : 0
    }

    // Save updated module data
    await fs.writeFile(moduleJsonPath, JSON.stringify(moduleData, null, 2))

    // Create notification for module owner if different from reviewer
    if (moduleData.instructorId !== user.id) {
      await createQuizReviewNotification(moduleData.instructorId, {
        moduleId,
        moduleTitle: moduleData.moduleTitle,
        slideIndex,
        quizIndex,
        action,
        feedback,
        reviewerName: user.name
      })
    }

    return NextResponse.json({
      success: true,
      message: `Quiz ${action}d successfully`,
      quiz: {
        slideIndex,
        quizIndex,
        status: action,
        isApproved: quiz.isApproved,
        approvalHistory: quiz.approvalHistory
      },
      module: {
        moduleId,
        totalQuizzes,
        approvedQuizzes,
        pendingQuizzes: totalQuizzes - approvedQuizzes
      }
    })
  } catch (error) {
    console.error('Error approving quiz:', error)
    return NextResponse.json(
      { error: 'Failed to approve quiz' },
      { status: 500 }
    )
  }
})

// GET /api/instructor/approveQuiz - Get quiz review status
export const GET = withInstructorOrAdminAuth(async (req) => {
  try {
    const user = req.user
    const { searchParams } = new URL(req.url)
    const moduleId = searchParams.get('moduleId')
    const status = searchParams.get('status') // 'pending', 'approved', 'rejected'

    if (moduleId) {
      // Get specific module's quiz status
      const moduleDir = await findModuleDirectory(moduleId)
      if (!moduleDir) {
        return NextResponse.json(
          { error: 'Module not found' },
          { status: 404 }
        )
      }

      const moduleJsonPath = path.join(moduleDir, 'module.json')
      const moduleData = JSON.parse(await fs.readFile(moduleJsonPath, 'utf8'))

      // Check permissions
      if (user.role === 'instructor' && moduleData.instructorId !== user.id) {
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        )
      }

      const quizStatus = getModuleQuizStatus(moduleData, status)
      
      return NextResponse.json({
        success: true,
        module: {
          moduleId: moduleData.moduleId,
          moduleTitle: moduleData.moduleTitle,
          instructorId: moduleData.instructorId
        },
        quizStatus
      })
    } else {
      // Get all modules with quiz status for user
      const allQuizStatus = await getAllQuizStatus(user, status)
      
      return NextResponse.json({
        success: true,
        quizStatus: allQuizStatus,
        metadata: {
          totalModules: allQuizStatus.length,
          totalQuizzes: allQuizStatus.reduce((sum, m) => sum + m.totalQuizzes, 0),
          approvedQuizzes: allQuizStatus.reduce((sum, m) => sum + m.approvedQuizzes, 0),
          pendingQuizzes: allQuizStatus.reduce((sum, m) => sum + m.pendingQuizzes, 0)
        }
      })
    }
  } catch (error) {
    console.error('Error getting quiz status:', error)
    return NextResponse.json(
      { error: 'Failed to get quiz status' },
      { status: 500 }
    )
  }
})

// PUT /api/instructor/approveQuiz - Bulk approve/reject quizzes
export const PUT = withInstructorOrAdminAuth(async (req) => {
  try {
    const user = req.user
    const { moduleId, quizActions, feedback } = await req.json()

    // Validate required fields
    if (!moduleId || !Array.isArray(quizActions)) {
      return NextResponse.json(
        { error: 'moduleId and quizActions array are required' },
        { status: 400 }
      )
    }

    // Find module directory
    const moduleDir = await findModuleDirectory(moduleId)
    if (!moduleDir) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    // Load module data
    const moduleJsonPath = path.join(moduleDir, 'module.json')
    const moduleData = JSON.parse(await fs.readFile(moduleJsonPath, 'utf8'))

    // Check permissions
    if (user.role === 'instructor' && moduleData.instructorId !== user.id) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }

    const results = []

    // Process each quiz action
    for (const action of quizActions) {
      try {
        const { slideIndex, quizIndex, action: quizAction } = action

        if (!moduleData.slides || slideIndex >= moduleData.slides.length) {
          results.push({ slideIndex, quizIndex, success: false, error: 'Invalid slide index' })
          continue
        }

        const slide = moduleData.slides[slideIndex]
        if (!slide.quiz || quizIndex >= slide.quiz.questions.length) {
          results.push({ slideIndex, quizIndex, success: false, error: 'Invalid quiz index' })
          continue
        }

        const quiz = slide.quiz.questions[quizIndex]
        
        // Initialize approval history if it doesn't exist
        if (!quiz.approvalHistory) {
          quiz.approvalHistory = []
        }

        // Add approval record
        const approvalRecord = {
          action: quizAction,
          reviewerId: user.id,
          reviewerName: user.name,
          reviewedAt: new Date().toISOString(),
          feedback: feedback || null
        }

        quiz.approvalHistory.push(approvalRecord)
        quiz.status = quizAction
        quiz.lastReviewedBy = user.id
        quiz.lastReviewedAt = new Date().toISOString()

        // Update approval status
        if (quizAction === 'approve') {
          quiz.isApproved = true
          quiz.isPublished = true
        } else {
          quiz.isApproved = false
          quiz.isPublished = false
        }

        results.push({ slideIndex, quizIndex, success: true, action: quizAction })
      } catch (error) {
        results.push({ 
          slideIndex: action.slideIndex, 
          quizIndex: action.quizIndex, 
          success: false, 
          error: error.message 
        })
      }
    }

    // Update module metadata
    moduleData.updatedAt = new Date().toISOString()
    moduleData.lastReviewedBy = user.id
    moduleData.lastReviewedAt = new Date().toISOString()

    // Update quiz statistics
    const totalQuizzes = moduleData.slides.reduce((count, s) => 
      count + (s.quiz ? s.quiz.questions.length : 0), 0)
    const approvedQuizzes = moduleData.slides.reduce((count, s) => 
      count + (s.quiz ? s.quiz.questions.filter(q => q.isApproved).length : 0), 0)
    
    moduleData.metadata = {
      ...moduleData.metadata,
      totalQuizzes,
      approvedQuizzes,
      pendingQuizzes: totalQuizzes - approvedQuizzes,
      quizApprovalRate: totalQuizzes > 0 ? (approvedQuizzes / totalQuizzes * 100).toFixed(1) : 0
    }

    // Save updated module data
    await fs.writeFile(moduleJsonPath, JSON.stringify(moduleData, null, 2))

    return NextResponse.json({
      success: true,
      message: 'Bulk quiz approval completed',
      results,
      module: {
        moduleId,
        totalQuizzes,
        approvedQuizzes,
        pendingQuizzes: totalQuizzes - approvedQuizzes
      }
    })
  } catch (error) {
    console.error('Error bulk approving quizzes:', error)
    return NextResponse.json(
      { error: 'Failed to bulk approve quizzes' },
      { status: 500 }
    )
  }
})

// Helper function to find module directory by ID
async function findModuleDirectory(moduleId) {
  try {
    const moduleDirs = await fs.readdir(MODULES_DIR)
    
    for (const moduleDir of moduleDirs) {
      const modulePath = path.join(MODULES_DIR, moduleDir)
      const moduleJsonPath = path.join(modulePath, 'module.json')
      
      try {
        const moduleData = JSON.parse(await fs.readFile(moduleJsonPath, 'utf8'))
        if (moduleData.moduleId === moduleId) {
          return modulePath
        }
      } catch (error) {
        // Skip invalid module files
        continue
      }
    }
  } catch (error) {
    // Modules directory doesn't exist
  }
  
  return null
}

// Helper function to get quiz status for a module
function getModuleQuizStatus(moduleData, filterStatus = null) {
  const quizzes = []

  moduleData.slides?.forEach((slide, slideIndex) => {
    if (slide.quiz) {
      slide.quiz.questions.forEach((quiz, quizIndex) => {
        const quizInfo = {
          slideIndex,
          quizIndex,
          question: quiz.question,
          status: quiz.status || 'pending',
          isApproved: quiz.isApproved || false,
          lastReviewedBy: quiz.lastReviewedBy,
          lastReviewedAt: quiz.lastReviewedAt,
          approvalHistory: quiz.approvalHistory || []
        }

        if (!filterStatus || quizInfo.status === filterStatus) {
          quizzes.push(quizInfo)
        }
      })
    }
  })

  return {
    totalQuizzes: quizzes.length,
    approvedQuizzes: quizzes.filter(q => q.isApproved).length,
    pendingQuizzes: quizzes.filter(q => q.status === 'pending').length,
    rejectedQuizzes: quizzes.filter(q => q.status === 'rejected').length,
    quizzes
  }
}

// Helper function to get all quiz status for user
async function getAllQuizStatus(user, filterStatus = null) {
  const modules = []

  try {
    const moduleDirs = await fs.readdir(MODULES_DIR)
    
    for (const moduleDir of moduleDirs) {
      const modulePath = path.join(MODULES_DIR, moduleDir)
      const moduleJsonPath = path.join(modulePath, 'module.json')
      
      try {
        const moduleData = JSON.parse(await fs.readFile(moduleJsonPath, 'utf8'))
        
        // Check permissions
        if (user.role === 'instructor' && moduleData.instructorId !== user.id) {
          continue
        }

        const quizStatus = getModuleQuizStatus(moduleData, filterStatus)
        
        modules.push({
          moduleId: moduleData.moduleId,
          moduleTitle: moduleData.moduleTitle,
          instructorId: moduleData.instructorId,
          ...quizStatus
        })
      } catch (error) {
        // Skip invalid module files
        continue
      }
    }
  } catch (error) {
    // Modules directory doesn't exist
  }

  return modules
}

// Helper function to create quiz review notification
async function createQuizReviewNotification(instructorId, notificationData) {
  try {
    const notificationsDir = path.join(process.cwd(), 'data', 'notifications')
    await fs.mkdir(notificationsDir, { recursive: true })
    
    const notificationFile = path.join(notificationsDir, `${instructorId}.json`)
    
    let notifications = []
    try {
      const content = await fs.readFile(notificationFile, 'utf8')
      notifications = JSON.parse(content)
    } catch (error) {
      // File doesn't exist yet
    }

    const notification = {
      id: `notif_${Date.now()}`,
      type: 'quiz_review',
      title: 'Quiz Review Notification',
      message: `Quiz in "${notificationData.moduleTitle}" has been ${notificationData.action}`,
      data: notificationData,
      read: false,
      createdAt: new Date().toISOString()
    }

    notifications.push(notification)
    await fs.writeFile(notificationFile, JSON.stringify(notifications, null, 2))
  } catch (error) {
    console.error('Error creating notification:', error)
  }
}

