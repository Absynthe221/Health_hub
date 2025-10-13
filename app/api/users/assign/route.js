import { NextResponse } from 'next/server'
import { withAdminAuth, withInstructorOrAdminAuth } from '@/lib/middleware/apiMiddleware'
import fs from 'fs/promises'
import path from 'path'

/**
 * User Assignment API
 * Handles assigning learners to modules and managing assignments
 */

const ASSIGNMENTS_DIR = path.join(process.cwd(), 'data', 'assignments')
const USERS_DIR = path.join(process.cwd(), 'data', 'users')

// POST /api/users/assign - Assign users to modules
export const POST = withAdminAuth(async (req) => {
  try {
    const { assignments, moduleId, userIds, dueDate, instructions } = await req.json()

    // Validate input - either assignments array or moduleId + userIds
    if (!assignments && (!moduleId || !userIds)) {
      return NextResponse.json(
        { error: 'Either assignments array or moduleId + userIds are required' },
        { status: 400 }
      )
    }

    const results = []

    // Create assignments directory if it doesn't exist
    await fs.mkdir(ASSIGNMENTS_DIR, { recursive: true })

    if (assignments && Array.isArray(assignments)) {
      // Bulk assignment from array
      for (const assignment of assignments) {
        const result = await createAssignment(assignment)
        results.push(result)
      }
    } else {
      // Single assignment from moduleId + userIds
      const assignment = {
        moduleId,
        userIds: Array.isArray(userIds) ? userIds : [userIds],
        dueDate,
        instructions,
        assignedBy: req.user.id,
        assignedAt: new Date().toISOString()
      }
      
      const result = await createAssignment(assignment)
      results.push(result)
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      message: `Assignments created: ${successCount} successful, ${failureCount} failed`,
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      }
    })
  } catch (error) {
    console.error('Error creating assignments:', error)
    return NextResponse.json(
      { error: 'Failed to create assignments' },
      { status: 500 }
    )
  }
})

// GET /api/users/assign - Get assignments
export const GET = withInstructorOrAdminAuth(async (req) => {
  try {
    const user = req.user
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const moduleId = searchParams.get('moduleId')
    const status = searchParams.get('status') // 'active', 'completed', 'overdue'
    const role = searchParams.get('role') // 'learner', 'instructor'

    let assignments = []

    // Read all assignment files
    try {
      const files = await fs.readdir(ASSIGNMENTS_DIR)
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(ASSIGNMENTS_DIR, file)
          const assignmentData = JSON.parse(await fs.readFile(filePath, 'utf8'))
          
          // Apply filters
          if (userId && !assignmentData.userIds.includes(userId)) continue
          if (moduleId && assignmentData.moduleId !== moduleId) continue
          if (status && assignmentData.status !== status) continue
          
          // Check permissions
          if (user.role === 'instructor') {
            // Instructors can only see assignments for their modules
            const moduleData = await getModuleData(assignmentData.moduleId)
            if (!moduleData || moduleData.instructorId !== user.id) continue
          }
          
          assignments.push(assignmentData)
        }
      }
    } catch (error) {
      // Assignments directory doesn't exist yet
    }

    // Sort by assignment date (newest first)
    assignments.sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))

    // Calculate assignment statistics
    const stats = calculateAssignmentStats(assignments)

    return NextResponse.json({
      success: true,
      assignments,
      statistics: stats,
      metadata: {
        total: assignments.length,
        active: assignments.filter(a => a.status === 'active').length,
        completed: assignments.filter(a => a.status === 'completed').length,
        overdue: assignments.filter(a => a.status === 'overdue').length
      }
    })
  } catch (error) {
    console.error('Error getting assignments:', error)
    return NextResponse.json(
      { error: 'Failed to get assignments' },
      { status: 500 }
    )
  }
})

// PUT /api/users/assign - Update assignment status
export const PUT = withInstructorOrAdminAuth(async (req) => {
  try {
    const user = req.user
    const { assignmentId, status, progress, feedback, completionDate } = await req.json()

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    // Find assignment file
    const assignmentFile = path.join(ASSIGNMENTS_DIR, `${assignmentId}.json`)
    
    try {
      await fs.access(assignmentFile)
    } catch (error) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    const assignmentData = JSON.parse(await fs.readFile(assignmentFile, 'utf8'))

    // Check permissions
    if (user.role === 'instructor') {
      const moduleData = await getModuleData(assignmentData.moduleId)
      if (!moduleData || moduleData.instructorId !== user.id) {
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        )
      }
    }

    // Update assignment data
    if (status) assignmentData.status = status
    if (progress !== undefined) assignmentData.progress = progress
    if (feedback) assignmentData.feedback = feedback
    if (completionDate) assignmentData.completionDate = completionDate
    
    assignmentData.updatedAt = new Date().toISOString()
    assignmentData.updatedBy = user.id

    // Save updated assignment
    await fs.writeFile(assignmentFile, JSON.stringify(assignmentData, null, 2))

    return NextResponse.json({
      success: true,
      message: 'Assignment updated successfully',
      assignment: assignmentData
    })
  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    )
  }
})

// DELETE /api/users/assign - Remove assignments
export const DELETE = withAdminAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const assignmentIds = searchParams.get('ids')?.split(',') || []

    if (assignmentIds.length === 0) {
      return NextResponse.json(
        { error: 'No assignment IDs provided' },
        { status: 400 }
      )
    }

    const results = []

    for (const assignmentId of assignmentIds) {
      try {
        const assignmentFile = path.join(ASSIGNMENTS_DIR, `${assignmentId}.json`)
        await fs.unlink(assignmentFile)
        results.push({ assignmentId, success: true, message: 'Assignment deleted' })
      } catch (error) {
        results.push({ 
          assignmentId, 
          success: false, 
          error: error.message 
        })
      }
    }

    const successCount = results.filter(r => r.success).length

    return NextResponse.json({
      success: true,
      message: `${successCount} assignments deleted`,
      results
    })
  } catch (error) {
    console.error('Error deleting assignments:', error)
    return NextResponse.json(
      { error: 'Failed to delete assignments' },
      { status: 500 }
    )
  }
})

// Helper function to create an assignment
async function createAssignment(assignmentData) {
  try {
    const assignmentId = `assign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Validate module exists
    const moduleData = await getModuleData(assignmentData.moduleId)
    if (!moduleData) {
      return {
        success: false,
        error: 'Module not found',
        assignmentId: null
      }
    }

    // Validate users exist
    const validUserIds = []
    for (const userId of assignmentData.userIds) {
      const userData = await getUserData(userId)
      if (userData && userData.role === 'student') {
        validUserIds.push(userId)
      }
    }

    if (validUserIds.length === 0) {
      return {
        success: false,
        error: 'No valid student users found',
        assignmentId: null
      }
    }

    // Create assignment object
    const assignment = {
      assignmentId,
      moduleId: assignmentData.moduleId,
      moduleTitle: moduleData.moduleTitle,
      userIds: validUserIds,
      assignedBy: assignmentData.assignedBy,
      assignedAt: assignmentData.assignedAt || new Date().toISOString(),
      dueDate: assignmentData.dueDate,
      instructions: assignmentData.instructions || '',
      status: 'active',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save assignment file
    const assignmentFile = path.join(ASSIGNMENTS_DIR, `${assignmentId}.json`)
    await fs.writeFile(assignmentFile, JSON.stringify(assignment, null, 2))

    // Create notifications for assigned users
    await createAssignmentNotifications(validUserIds, assignment)

    return {
      success: true,
      assignmentId,
      assignment,
      message: `Assignment created for ${validUserIds.length} users`
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      assignmentId: null
    }
  }
}

// Helper function to get module data
async function getModuleData(moduleId) {
  try {
    const MODULES_DIR = path.join(process.cwd(), 'public', 'modules')
    const moduleDirs = await fs.readdir(MODULES_DIR)
    
    for (const moduleDir of moduleDirs) {
      const modulePath = path.join(MODULES_DIR, moduleDir)
      const moduleJsonPath = path.join(modulePath, 'module.json')
      
      try {
        const moduleData = JSON.parse(await fs.readFile(moduleJsonPath, 'utf8'))
        if (moduleData.moduleId === moduleId) {
          return moduleData
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

// Helper function to get user data
async function getUserData(userId) {
  try {
    const userFile = path.join(USERS_DIR, `${userId}.json`)
    const userData = JSON.parse(await fs.readFile(userFile, 'utf8'))
    return userData
  } catch (error) {
    return null
  }
}

// Helper function to calculate assignment statistics
function calculateAssignmentStats(assignments) {
  const stats = {
    totalAssignments: assignments.length,
    activeAssignments: 0,
    completedAssignments: 0,
    overdueAssignments: 0,
    averageProgress: 0,
    totalUsers: [],
    totalModules: []
  }

  let totalProgress = 0

  assignments.forEach(assignment => {
    assignment.userIds.forEach(userId => {
      if (!stats.totalUsers.includes(userId)) {
        stats.totalUsers.push(userId)
      }
    })
    if (!stats.totalModules.includes(assignment.moduleId)) {
      stats.totalModules.push(assignment.moduleId)
    }
    
    switch (assignment.status) {
      case 'active':
        stats.activeAssignments++
        break
      case 'completed':
        stats.completedAssignments++
        break
      case 'overdue':
        stats.overdueAssignments++
        break
    }
    
    totalProgress += assignment.progress || 0
  })

  stats.averageProgress = assignments.length > 0 ? (totalProgress / assignments.length).toFixed(1) : 0
  stats.totalUsers = stats.totalUsers.size
  stats.totalModules = stats.totalModules.size

  return stats
}

// Helper function to create assignment notifications
async function createAssignmentNotifications(userIds, assignment) {
  try {
    const notificationsDir = path.join(process.cwd(), 'data', 'notifications')
    await fs.mkdir(notificationsDir, { recursive: true })

    for (const userId of userIds) {
      const notificationFile = path.join(notificationsDir, `${userId}.json`)
      
      let notifications = []
      try {
        const content = await fs.readFile(notificationFile, 'utf8')
        notifications = JSON.parse(content)
      } catch (error) {
        // File doesn't exist yet
      }

      const notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'assignment',
        title: 'New Module Assignment',
        message: `You have been assigned to module: ${assignment.moduleTitle}`,
        data: {
          assignmentId: assignment.assignmentId,
          moduleId: assignment.moduleId,
          moduleTitle: assignment.moduleTitle,
          dueDate: assignment.dueDate
        },
        read: false,
        createdAt: new Date().toISOString()
      }

      notifications.push(notification)
      await fs.writeFile(notificationFile, JSON.stringify(notifications, null, 2))
    }
  } catch (error) {
    console.error('Error creating assignment notifications:', error)
  }
}
