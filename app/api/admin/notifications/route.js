import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // all, success, warning, reminder, info, achievement, announcement
    const status = searchParams.get('status'); // all, delivered, read, pending, scheduled, failed
    const recipientId = searchParams.get('recipientId');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    // Mock comprehensive notification data
    const notificationData = {
      stats: {
        totalSent: 1247,
        delivered: 1189,
        read: 892,
        pending: 23,
        failed: 12,
        scheduled: 15,
        openRate: 75,
        clickRate: 42,
        avgDeliveryTime: '2.3 seconds',
        bounceRate: 1.2
      },

      templates: [
        { 
          id: 1, 
          name: 'Module Completion', 
          type: 'success', 
          usage: 342,
          lastUsed: '2025-10-08T11:30:00Z',
          content: 'Congratulations! You have successfully completed the {MODULE_NAME} module.',
          variables: ['MODULE_NAME', 'STUDENT_NAME', 'COMPLETION_DATE']
        },
        { 
          id: 2, 
          name: 'Quiz Reminder', 
          type: 'reminder', 
          usage: 567,
          lastUsed: '2025-10-08T10:00:00Z',
          content: 'Reminder: Your quiz for {MODULE_NAME} is due in {HOURS} hours.',
          variables: ['MODULE_NAME', 'HOURS', 'DUE_DATE']
        },
        { 
          id: 3, 
          name: 'Certificate Available', 
          type: 'achievement', 
          usage: 189,
          lastUsed: '2025-10-08T09:15:00Z',
          content: 'Your certificate for {MODULE_NAME} is now available for download.',
          variables: ['MODULE_NAME', 'STUDENT_NAME', 'CERTIFICATE_URL']
        },
        { 
          id: 4, 
          name: 'Inactivity Alert', 
          type: 'warning', 
          usage: 78,
          lastUsed: '2025-10-07T15:00:00Z',
          content: 'We noticed you haven\'t logged in for {DAYS} days. Continue your learning journey!',
          variables: ['DAYS', 'STUDENT_NAME', 'LAST_MODULE']
        },
        { 
          id: 5, 
          name: 'New Module Available', 
          type: 'info', 
          usage: 234,
          lastUsed: '2025-10-07T09:00:00Z',
          content: 'A new module "{MODULE_NAME}" has been added to your curriculum.',
          variables: ['MODULE_NAME', 'MODULE_DESCRIPTION', 'INSTRUCTOR_NAME']
        },
        { 
          id: 6, 
          name: 'System Update', 
          type: 'announcement', 
          usage: 45,
          lastUsed: '2025-10-06T12:00:00Z',
          content: 'System maintenance scheduled for {DATE}. Platform will be unavailable for {DURATION}.',
          variables: ['DATE', 'DURATION', 'DETAILS']
        }
      ],

      notifications: [
        {
          id: 1,
          type: 'success',
          title: 'Module Completion Congratulations',
          message: 'Congratulations! You have successfully completed the ECG Basics module.',
          recipient: 'All Learners',
          recipientType: 'group',
          recipientCount: 142,
          recipientIds: [],
          status: 'delivered',
          sentAt: '2025-10-08T11:30:00Z',
          sentBy: 'System',
          readCount: 98,
          clickCount: 45,
          deliveredCount: 142,
          failedCount: 0,
          priority: 'normal',
          category: 'achievement',
          channel: ['in-app', 'email'],
          templateId: 1,
          metadata: {
            moduleId: 'mod_001',
            moduleName: 'ECG Basics'
          }
        },
        {
          id: 2,
          type: 'reminder',
          title: 'Complete Your Module',
          message: 'You have an incomplete module: STEMI Recognition. Complete it to maintain your streak!',
          recipient: 'Inactive Students',
          recipientType: 'group',
          recipientCount: 23,
          recipientIds: [],
          status: 'pending',
          scheduledFor: '2025-10-09T09:00:00Z',
          createdBy: 'admin_001',
          priority: 'high',
          category: 'reminder',
          channel: ['in-app', 'email', 'push'],
          templateId: 2
        },
        {
          id: 3,
          type: 'achievement',
          title: 'Certificate Ready',
          message: 'Your certificate for Advanced Arrhythmias is now available for download.',
          recipient: 'Charlie Brown',
          recipientType: 'individual',
          recipientCount: 1,
          recipientIds: ['user_005'],
          status: 'read',
          sentAt: '2025-10-08T10:15:00Z',
          sentBy: 'System',
          readCount: 1,
          clickCount: 1,
          deliveredCount: 1,
          failedCount: 0,
          priority: 'normal',
          category: 'achievement',
          channel: ['in-app', 'email'],
          templateId: 3,
          metadata: {
            certificateId: 'cert_045',
            moduleId: 'mod_012'
          }
        },
        {
          id: 4,
          type: 'warning',
          title: 'Low Quiz Score Alert',
          message: 'Your quiz score is below the passing threshold. Please review the material and retake.',
          recipient: 'Alice Williams',
          recipientType: 'individual',
          recipientCount: 1,
          recipientIds: ['user_004'],
          status: 'delivered',
          sentAt: '2025-10-07T14:30:00Z',
          sentBy: 'instructor_002',
          readCount: 0,
          clickCount: 0,
          deliveredCount: 1,
          failedCount: 0,
          priority: 'high',
          category: 'academic',
          channel: ['in-app', 'email'],
          metadata: {
            quizId: 'quiz_028',
            score: 58,
            passingScore: 70
          }
        },
        {
          id: 5,
          type: 'info',
          title: 'New ECG Module Available',
          message: 'A new module "Cardiac Emergency Protocols" has been added to your curriculum.',
          recipient: 'All Students',
          recipientType: 'group',
          recipientCount: 156,
          recipientIds: [],
          status: 'delivered',
          sentAt: '2025-10-07T09:00:00Z',
          sentBy: 'admin_001',
          readCount: 134,
          clickCount: 98,
          deliveredCount: 156,
          failedCount: 0,
          priority: 'normal',
          category: 'announcement',
          channel: ['in-app', 'email'],
          templateId: 5,
          metadata: {
            moduleId: 'mod_020',
            instructor: 'Dr. Sarah Johnson'
          }
        },
        {
          id: 6,
          type: 'announcement',
          title: 'System Maintenance Scheduled',
          message: 'The platform will undergo scheduled maintenance on Oct 10, 2025 from 2:00 AM - 4:00 AM.',
          recipient: 'All Users',
          recipientType: 'group',
          recipientCount: 200,
          recipientIds: [],
          status: 'scheduled',
          scheduledFor: '2025-10-10T00:00:00Z',
          createdBy: 'admin_001',
          priority: 'high',
          category: 'system',
          channel: ['in-app', 'email', 'push'],
          templateId: 6,
          metadata: {
            maintenanceType: 'database_upgrade',
            estimatedDuration: '2 hours'
          }
        },
        {
          id: 7,
          type: 'success',
          title: 'Streak Milestone Achieved',
          message: 'Congratulations! You have maintained a 30-day learning streak!',
          recipient: 'Jane Smith',
          recipientType: 'individual',
          recipientCount: 1,
          recipientIds: ['user_002'],
          status: 'delivered',
          sentAt: '2025-10-08T08:00:00Z',
          sentBy: 'System',
          readCount: 1,
          clickCount: 1,
          deliveredCount: 1,
          failedCount: 0,
          priority: 'normal',
          category: 'achievement',
          channel: ['in-app'],
          metadata: {
            streakDays: 30,
            nextMilestone: 60
          }
        },
        {
          id: 8,
          type: 'reminder',
          title: 'Quiz Deadline Approaching',
          message: 'Your quiz for Heart Blocks module is due in 24 hours.',
          recipient: 'Active Students',
          recipientType: 'group',
          recipientCount: 45,
          recipientIds: [],
          status: 'scheduled',
          scheduledFor: '2025-10-08T18:00:00Z',
          createdBy: 'instructor_003',
          priority: 'high',
          category: 'deadline',
          channel: ['in-app', 'email'],
          metadata: {
            moduleId: 'mod_004',
            quizId: 'quiz_015',
            deadline: '2025-10-09T18:00:00Z'
          }
        }
      ],

      recentActivity: [
        {
          id: 1,
          action: 'sent',
          notification: 'Module Completion Congratulations',
          recipient: 'All Learners (142)',
          timestamp: '2025-10-08T11:30:00Z',
          admin: 'System'
        },
        {
          id: 2,
          action: 'scheduled',
          notification: 'Complete Your Module',
          recipient: 'Inactive Students (23)',
          timestamp: '2025-10-08T11:00:00Z',
          admin: 'Admin User'
        },
        {
          id: 3,
          action: 'read',
          notification: 'Certificate Ready',
          recipient: 'Charlie Brown',
          timestamp: '2025-10-08T10:20:00Z',
          admin: 'System'
        }
      ],

      analytics: {
        hourlyStats: [
          { hour: '00:00', sent: 12, delivered: 12, read: 5 },
          { hour: '06:00', sent: 34, delivered: 33, read: 28 },
          { hour: '09:00', sent: 156, delivered: 154, read: 132 },
          { hour: '12:00', sent: 89, delivered: 87, read: 67 },
          { hour: '15:00', sent: 67, delivered: 66, read: 54 },
          { hour: '18:00', sent: 98, delivered: 95, read: 78 },
          { hour: '21:00', sent: 45, delivered: 44, read: 32 }
        ],
        typeDistribution: {
          success: 342,
          warning: 128,
          reminder: 567,
          info: 234,
          achievement: 189,
          announcement: 45
        },
        channelPerformance: {
          'in-app': { sent: 1247, delivered: 1189, read: 892, clickRate: 42 },
          'email': { sent: 892, delivered: 856, read: 645, clickRate: 38 },
          'push': { sent: 234, delivered: 198, read: 156, clickRate: 28 }
        }
      }
    };

    // Apply filters
    let filteredNotifications = notificationData.notifications;
    
    if (type && type !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }
    
    if (status && status !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.status === status);
    }
    
    if (recipientId) {
      filteredNotifications = filteredNotifications.filter(n => 
        n.recipientIds.includes(recipientId)
      );
    }

    // Pagination
    const total = filteredNotifications.length;
    const paginated = filteredNotifications.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      ...notificationData,
      notifications: paginated,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications',
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      action, 
      notificationId, 
      title, 
      message, 
      type, 
      recipients, 
      priority, 
      channel,
      scheduledFor,
      templateId 
    } = body;

    switch (action) {
      case 'create':
        // Create new notification
        const newNotification = {
          id: Date.now(),
          title,
          message,
          type: type || 'info',
          recipient: recipients?.label || 'Custom',
          recipientCount: recipients?.count || 0,
          recipientIds: recipients?.ids || [],
          status: scheduledFor ? 'scheduled' : 'pending',
          createdAt: new Date().toISOString(),
          scheduledFor,
          priority: priority || 'normal',
          category: type || 'general',
          channel: channel || ['in-app'],
          templateId
        };

        return NextResponse.json({
          success: true,
          message: 'Notification created successfully',
          notification: newNotification
        });

      case 'send':
        // Send notification immediately
        return NextResponse.json({
          success: true,
          message: `Notification sent to ${recipients?.count || 0} recipients`,
          notificationId,
          sentAt: new Date().toISOString()
        });

      case 'update':
        // Update existing notification
        return NextResponse.json({
          success: true,
          message: 'Notification updated successfully',
          notificationId
        });

      case 'delete':
        // Delete notification
        return NextResponse.json({
          success: true,
          message: 'Notification deleted successfully',
          notificationId
        });

      case 'bulk_delete':
        // Bulk delete notifications
        const deletedIds = body.notificationIds || [];
        return NextResponse.json({
          success: true,
          message: `${deletedIds.length} notifications deleted`,
          deletedIds
        });

      case 'bulk_resend':
        // Bulk resend notifications
        const resentIds = body.notificationIds || [];
        return NextResponse.json({
          success: true,
          message: `${resentIds.length} notifications resent`,
          resentIds
        });

      case 'schedule':
        // Schedule notification for later
        return NextResponse.json({
          success: true,
          message: 'Notification scheduled successfully',
          notificationId,
          scheduledFor
        });

      case 'cancel':
        // Cancel scheduled notification
        return NextResponse.json({
          success: true,
          message: 'Scheduled notification cancelled',
          notificationId
        });

      case 'save_template':
        // Save notification as template
        return NextResponse.json({
          success: true,
          message: 'Template saved successfully',
          templateId: Date.now()
        });

      case 'test_send':
        // Send test notification to admin
        return NextResponse.json({
          success: true,
          message: 'Test notification sent to your account',
          testRecipient: body.adminEmail || 'admin@healthhub.com'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing notification action:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json({
        success: false,
        error: 'Notification ID required'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
      notificationId
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete notification',
      message: error.message
    }, { status: 500 });
  }
}

