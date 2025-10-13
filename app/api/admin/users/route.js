import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // all, admin, instructor, learner
    const status = searchParams.get('status'); // all, active, inactive, suspended
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const userId = searchParams.get('userId');

    // Mock comprehensive user data
    const userData = {
      stats: {
        totalUsers: 200,
        activeUsers: 178,
        inactiveUsers: 22,
        suspendedUsers: 0,
        admins: 4,
        instructors: 12,
        learners: 184,
        newThisMonth: 23,
        newThisWeek: 7,
        avgEngagement: 78,
        emailVerified: 185,
        twoFactorEnabled: 67
      },

      users: [
        {
          id: 1,
          userId: 'user_001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          role: 'learner',
          status: 'active',
          enrolledDate: '2024-01-15T00:00:00Z',
          lastActive: '2025-10-08T10:30:00Z',
          lastLogin: '2025-10-08T09:00:00Z',
          modulesCompleted: 12,
          modulesTotal: 19,
          modulesInProgress: 2,
          avgScore: 85,
          certificatesEarned: 8,
          totalTimeSpent: '18.5 hours',
          loginCount: 156,
          department: 'Cardiology',
          location: 'London, UK',
          country: 'United Kingdom',
          timezone: 'Europe/London',
          avatar: null,
          emailVerified: true,
          twoFactorEnabled: false,
          accountCreatedBy: 'self',
          notes: 'High performer, consistent engagement'
        },
        {
          id: 2,
          userId: 'user_002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 234-5678',
          role: 'instructor',
          status: 'active',
          enrolledDate: '2024-01-10T00:00:00Z',
          lastActive: '2025-10-08T11:00:00Z',
          lastLogin: '2025-10-08T08:30:00Z',
          modulesCreated: 8,
          modulesPublished: 6,
          studentsManaged: 142,
          avgStudentScore: 78,
          totalTimeSpent: '45.2 hours',
          loginCount: 234,
          department: 'Medical Education',
          location: 'Manchester, UK',
          country: 'United Kingdom',
          timezone: 'Europe/London',
          avatar: null,
          emailVerified: true,
          twoFactorEnabled: true,
          accountCreatedBy: 'admin_001',
          specialization: 'ECG Interpretation',
          qualifications: 'MD, MRCP, PhD',
          notes: 'Senior instructor, excellent student feedback'
        },
        {
          id: 3,
          userId: 'user_003',
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1 (555) 345-6789',
          role: 'admin',
          status: 'active',
          enrolledDate: '2024-01-05T00:00:00Z',
          lastActive: '2025-10-08T11:45:00Z',
          lastLogin: '2025-10-08T11:30:00Z',
          totalActions: 1547,
          usersManaged: 200,
          notificationsSent: 342,
          modulesApproved: 28,
          totalTimeSpent: '82.3 hours',
          loginCount: 456,
          department: 'IT Administration',
          location: 'Birmingham, UK',
          country: 'United Kingdom',
          timezone: 'Europe/London',
          avatar: null,
          emailVerified: true,
          twoFactorEnabled: true,
          accountCreatedBy: 'system',
          adminLevel: 'super',
          permissions: ['all'],
          notes: 'System administrator'
        },
        {
          id: 4,
          userId: 'user_004',
          firstName: 'Alice',
          lastName: 'Williams',
          email: 'alice.williams@example.com',
          phone: '+1 (555) 456-7890',
          role: 'learner',
          status: 'active',
          enrolledDate: '2024-02-15T00:00:00Z',
          lastActive: '2025-10-05T14:20:00Z',
          lastLogin: '2025-10-05T14:00:00Z',
          modulesCompleted: 5,
          modulesTotal: 19,
          modulesInProgress: 2,
          avgScore: 58,
          certificatesEarned: 2,
          totalTimeSpent: '8.2 hours',
          loginCount: 42,
          department: 'Emergency Medicine',
          location: 'Leeds, UK',
          country: 'United Kingdom',
          timezone: 'Europe/London',
          avatar: null,
          emailVerified: true,
          twoFactorEnabled: false,
          accountCreatedBy: 'self',
          notes: 'Needs additional support, struggling with advanced modules'
        },
        {
          id: 5,
          userId: 'user_005',
          firstName: 'Charlie',
          lastName: 'Brown',
          email: 'charlie.brown@example.com',
          phone: '+1 (555) 567-8901',
          role: 'learner',
          status: 'active',
          enrolledDate: '2024-01-05T00:00:00Z',
          lastActive: '2025-10-08T11:45:00Z',
          lastLogin: '2025-10-08T11:30:00Z',
          modulesCompleted: 18,
          modulesTotal: 19,
          modulesInProgress: 1,
          avgScore: 95,
          certificatesEarned: 15,
          totalTimeSpent: '28.1 hours',
          loginCount: 289,
          department: 'Cardiology',
          location: 'Liverpool, UK',
          country: 'United Kingdom',
          timezone: 'Europe/London',
          avatar: null,
          emailVerified: true,
          twoFactorEnabled: true,
          accountCreatedBy: 'self',
          notes: 'Top performer, course completion imminent'
        },
        {
          id: 6,
          userId: 'user_006',
          firstName: 'Diana',
          lastName: 'Prince',
          email: 'diana.prince@example.com',
          phone: '+1 (555) 678-9012',
          role: 'instructor',
          status: 'active',
          enrolledDate: '2024-02-01T00:00:00Z',
          lastActive: '2025-10-08T09:15:00Z',
          lastLogin: '2025-10-08T08:00:00Z',
          modulesCreated: 12,
          modulesPublished: 10,
          studentsManaged: 98,
          avgStudentScore: 82,
          totalTimeSpent: '52.8 hours',
          loginCount: 178,
          department: 'Clinical Training',
          location: 'Edinburgh, UK',
          country: 'United Kingdom',
          timezone: 'Europe/London',
          avatar: null,
          emailVerified: true,
          twoFactorEnabled: true,
          accountCreatedBy: 'admin_001',
          specialization: 'Advanced ECG Analysis',
          qualifications: 'MD, FRCP',
          notes: 'Excellent instructor, high student satisfaction'
        },
        {
          id: 7,
          userId: 'user_007',
          firstName: 'Ethan',
          lastName: 'Hunt',
          email: 'ethan.hunt@example.com',
          phone: '+1 (555) 789-0123',
          role: 'learner',
          status: 'inactive',
          enrolledDate: '2024-03-10T00:00:00Z',
          lastActive: '2025-09-15T16:00:00Z',
          lastLogin: '2025-09-15T15:30:00Z',
          modulesCompleted: 3,
          modulesTotal: 19,
          modulesInProgress: 0,
          avgScore: 62,
          certificatesEarned: 1,
          totalTimeSpent: '4.5 hours',
          loginCount: 18,
          department: 'General Medicine',
          location: 'Glasgow, UK',
          country: 'United Kingdom',
          timezone: 'Europe/London',
          avatar: null,
          emailVerified: false,
          twoFactorEnabled: false,
          accountCreatedBy: 'self',
          notes: 'Inactive for 23 days, send re-engagement notification'
        },
        {
          id: 8,
          userId: 'user_008',
          firstName: 'Fiona',
          lastName: 'Green',
          email: 'fiona.green@example.com',
          phone: '+1 (555) 890-1234',
          role: 'learner',
          status: 'active',
          enrolledDate: '2024-01-20T00:00:00Z',
          lastActive: '2025-10-08T08:30:00Z',
          lastLogin: '2025-10-08T08:00:00Z',
          modulesCompleted: 14,
          modulesTotal: 19,
          modulesInProgress: 1,
          avgScore: 88,
          certificatesEarned: 11,
          totalTimeSpent: '21.7 hours',
          loginCount: 203,
          department: 'Intensive Care',
          location: 'Cardiff, UK',
          country: 'United Kingdom',
          timezone: 'Europe/London',
          avatar: null,
          emailVerified: true,
          twoFactorEnabled: true,
          accountCreatedBy: 'self',
          notes: 'Strong performer, regular engagement'
        }
      ],

      recentActivity: [
        {
          id: 1,
          userId: 'user_008',
          userName: 'Fiona Green',
          action: 'logged_in',
          timestamp: '2025-10-08T08:30:00Z',
          details: 'Web login from Cardiff, UK'
        },
        {
          id: 2,
          userId: 'user_005',
          userName: 'Charlie Brown',
          action: 'completed_module',
          timestamp: '2025-10-08T11:30:00Z',
          details: 'Completed Advanced Arrhythmias with 98% score'
        },
        {
          id: 3,
          userId: 'new_user',
          userName: 'New Registration',
          action: 'registered',
          timestamp: '2025-10-08T10:00:00Z',
          details: 'Self-registration as Learner'
        }
      ]
    };

    // If specific user requested
    if (userId) {
      const user = userData.users.find(u => u.userId === userId);
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        user
      });
    }

    // Apply filters
    let filteredUsers = userData.users;
    
    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.role === role);
    }
    
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(u =>
        u.firstName.toLowerCase().includes(searchLower) ||
        u.lastName.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.department?.toLowerCase().includes(searchLower) ||
        u.userId.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = filteredUsers.length;
    const paginated = filteredUsers.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      ...userData,
      users: paginated,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, userId, userData, userIds } = body;

    switch (action) {
      case 'create':
        // Create new user
        const newUser = {
          id: Date.now(),
          userId: `user_${Date.now()}`,
          ...userData,
          enrolledDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          status: 'active',
          emailVerified: false,
          twoFactorEnabled: false
        };

        return NextResponse.json({
          success: true,
          message: 'User created successfully',
          user: newUser
        }, { status: 201 });

      case 'update':
        // Update existing user
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID required'
          }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          message: 'User updated successfully',
          userId,
          updatedFields: Object.keys(userData || {})
        });

      case 'delete':
        // Delete user (soft delete)
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID required'
          }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          message: 'User deleted successfully',
          userId,
          deletedAt: new Date().toISOString()
        });

      case 'bulk_activate':
        // Activate multiple users
        return NextResponse.json({
          success: true,
          message: `${userIds?.length || 0} users activated`,
          userIds: userIds || []
        });

      case 'bulk_deactivate':
        // Deactivate multiple users
        return NextResponse.json({
          success: true,
          message: `${userIds?.length || 0} users deactivated`,
          userIds: userIds || []
        });

      case 'bulk_delete':
        // Delete multiple users
        return NextResponse.json({
          success: true,
          message: `${userIds?.length || 0} users deleted`,
          userIds: userIds || []
        });

      case 'send_verification_email':
        // Resend verification email
        return NextResponse.json({
          success: true,
          message: 'Verification email sent',
          userId
        });

      case 'reset_password':
        // Send password reset email
        return NextResponse.json({
          success: true,
          message: 'Password reset email sent',
          userId
        });

      case 'enable_2fa':
        // Enable two-factor authentication
        return NextResponse.json({
          success: true,
          message: 'Two-factor authentication enabled',
          userId,
          qrCode: 'base64_qr_code_here'
        });

      case 'disable_2fa':
        // Disable two-factor authentication
        return NextResponse.json({
          success: true,
          message: 'Two-factor authentication disabled',
          userId
        });

      case 'change_role':
        // Change user role
        const { newRole } = body;
        return NextResponse.json({
          success: true,
          message: `User role changed to ${newRole}`,
          userId,
          newRole
        });

      case 'suspend':
        // Suspend user account
        const { reason, duration } = body;
        return NextResponse.json({
          success: true,
          message: 'User account suspended',
          userId,
          reason,
          suspendedUntil: duration ? new Date(Date.now() + duration).toISOString() : null
        });

      case 'unsuspend':
        // Unsuspend user account
        return NextResponse.json({
          success: true,
          message: 'User account reactivated',
          userId
        });

      case 'import_csv':
        // Import users from CSV
        const { csvData } = body;
        return NextResponse.json({
          success: true,
          message: 'Users imported successfully',
          imported: csvData?.length || 0,
          failed: 0
        });

      case 'assign_modules':
        // Assign modules to users
        const { moduleIds } = body;
        return NextResponse.json({
          success: true,
          message: `${moduleIds?.length || 0} modules assigned to ${userIds?.length || 0} users`,
          userIds,
          moduleIds
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing user action:', error);
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
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      userId,
      deletedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID required'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      userId,
      updatedFields: Object.keys(updates || {}),
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    }, { status: 500 });
  }
}

