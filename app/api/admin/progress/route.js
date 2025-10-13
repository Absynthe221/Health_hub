import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status'); // all, excellent, good, struggling

    // Mock comprehensive progress data
    // In production, this would query your database
    const progressData = {
      summary: {
        totalStudents: 156,
        activeStudents: 142,
        inactiveStudents: 14,
        avgCompletionRate: 68,
        avgScore: 76,
        totalModulesCompleted: 892,
        totalModulesInProgress: 234,
        strugglingStudents: 12,
        excellentStudents: 78,
        goodStudents: 52,
        totalTimeSpent: '2,847 hours'
      },
      
      modules: [
        { 
          id: 'mod_001', 
          name: 'ECG Basics', 
          enrolled: 142, 
          completed: 98, 
          inProgress: 32,
          notStarted: 12,
          avgScore: 82, 
          avgTime: '45 min',
          completionRate: 69,
          passRate: 94
        },
        { 
          id: 'mod_002', 
          name: 'STEMI Recognition', 
          enrolled: 128, 
          completed: 76, 
          inProgress: 38,
          notStarted: 14,
          avgScore: 74, 
          avgTime: '52 min',
          completionRate: 59,
          passRate: 88
        },
        { 
          id: 'mod_003', 
          name: 'Arrhythmias', 
          enrolled: 115, 
          completed: 62, 
          inProgress: 35,
          notStarted: 18,
          avgScore: 69, 
          avgTime: '48 min',
          completionRate: 54,
          passRate: 85
        },
        { 
          id: 'mod_004', 
          name: 'Heart Blocks', 
          enrolled: 98, 
          completed: 45, 
          inProgress: 28,
          notStarted: 25,
          avgScore: 71, 
          avgTime: '55 min',
          completionRate: 46,
          passRate: 86
        },
        { 
          id: 'mod_005', 
          name: 'Ventricular Rhythms', 
          enrolled: 87, 
          completed: 38, 
          inProgress: 24,
          notStarted: 25,
          avgScore: 68, 
          avgTime: '50 min',
          completionRate: 44,
          passRate: 82
        }
      ],
      
      students: [
        {
          id: 1,
          userId: 'user_001',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'learner',
          enrolledDate: '2024-01-15',
          modulesCompleted: 12,
          modulesInProgress: 2,
          modulesTotal: 19,
          avgScore: 85,
          lastActive: '2025-10-08T10:30:00Z',
          status: 'excellent',
          currentModule: 'STEMI Recognition',
          completionRate: 74,
          timeSpent: '18.5 hours',
          quizzesPassed: 12,
          quizzesFailed: 0,
          certificatesEarned: 8,
          streak: 14
        },
        {
          id: 2,
          userId: 'user_002',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'learner',
          enrolledDate: '2024-01-10',
          modulesCompleted: 15,
          modulesInProgress: 1,
          modulesTotal: 19,
          avgScore: 92,
          lastActive: '2025-10-08T11:00:00Z',
          status: 'excellent',
          currentModule: 'Arrhythmias',
          completionRate: 84,
          timeSpent: '22.3 hours',
          quizzesPassed: 15,
          quizzesFailed: 0,
          certificatesEarned: 12,
          streak: 21
        },
        {
          id: 3,
          userId: 'user_003',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'learner',
          enrolledDate: '2024-02-01',
          modulesCompleted: 8,
          modulesInProgress: 3,
          modulesTotal: 19,
          avgScore: 68,
          lastActive: '2025-10-07T09:15:00Z',
          status: 'good',
          currentModule: 'ECG Basics',
          completionRate: 58,
          timeSpent: '12.7 hours',
          quizzesPassed: 8,
          quizzesFailed: 2,
          certificatesEarned: 5,
          streak: 5
        },
        {
          id: 4,
          userId: 'user_004',
          name: 'Alice Williams',
          email: 'alice@example.com',
          role: 'learner',
          enrolledDate: '2024-02-15',
          modulesCompleted: 5,
          modulesInProgress: 2,
          modulesTotal: 19,
          avgScore: 58,
          lastActive: '2025-10-05T14:20:00Z',
          status: 'struggling',
          currentModule: 'Heart Blocks',
          completionRate: 37,
          timeSpent: '8.2 hours',
          quizzesPassed: 5,
          quizzesFailed: 3,
          certificatesEarned: 2,
          streak: 0
        },
        {
          id: 5,
          userId: 'user_005',
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          role: 'learner',
          enrolledDate: '2024-01-05',
          modulesCompleted: 18,
          modulesInProgress: 1,
          modulesTotal: 19,
          avgScore: 95,
          lastActive: '2025-10-08T11:45:00Z',
          status: 'excellent',
          currentModule: 'Final Assessment',
          completionRate: 95,
          timeSpent: '28.1 hours',
          quizzesPassed: 18,
          quizzesFailed: 0,
          certificatesEarned: 15,
          streak: 28
        }
      ],
      
      recentActivity: [
        {
          id: 1,
          userId: 'user_005',
          userName: 'Charlie Brown',
          action: 'completed',
          module: 'Advanced Arrhythmias',
          score: 98,
          timestamp: '2025-10-08T11:30:00Z'
        },
        {
          id: 2,
          userId: 'user_002',
          userName: 'Jane Smith',
          action: 'started',
          module: 'Cardiac Emergency Protocols',
          timestamp: '2025-10-08T11:00:00Z'
        },
        {
          id: 3,
          userId: 'user_001',
          userName: 'John Doe',
          action: 'quiz_passed',
          module: 'STEMI Recognition',
          score: 88,
          timestamp: '2025-10-08T10:30:00Z'
        }
      ],
      
      trends: {
        weekly: {
          completions: [45, 52, 48, 61, 58, 64, 72],
          avgScores: [74, 76, 75, 78, 77, 79, 80],
          activeUsers: [128, 132, 135, 138, 140, 142, 145]
        },
        monthly: {
          completions: [245, 278, 312, 358],
          avgScores: [72, 74, 76, 78],
          activeUsers: [120, 128, 135, 142]
        }
      }
    };

    // Filter by status if specified
    let filteredStudents = progressData.students;
    if (status && status !== 'all') {
      filteredStudents = progressData.students.filter(s => s.status === status);
    }

    // Filter by userId if specified
    if (userId) {
      const student = progressData.students.find(s => s.userId === userId);
      if (!student) {
        return NextResponse.json({ 
          success: false, 
          error: 'Student not found' 
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        student,
        moduleProgress: progressData.modules
      });
    }

    // Filter by moduleId if specified
    if (moduleId) {
      const module = progressData.modules.find(m => m.id === moduleId);
      if (!module) {
        return NextResponse.json({ 
          success: false, 
          error: 'Module not found' 
        }, { status: 404 });
      }
      
      const studentsInModule = progressData.students.filter(s => 
        s.currentModule === module.name || s.modulesCompleted > 0
      );
      
      return NextResponse.json({
        success: true,
        module,
        students: studentsInModule
      });
    }

    // Return all progress data
    return NextResponse.json({
      success: true,
      ...progressData,
      students: filteredStudents
    });

  } catch (error) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch progress data',
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, userId, moduleId, data } = body;

    // Handle different progress actions
    switch (action) {
      case 'update_progress':
        // Update student progress
        return NextResponse.json({
          success: true,
          message: 'Progress updated successfully',
          data: {
            userId,
            moduleId,
            ...data
          }
        });

      case 'reset_progress':
        // Reset student progress for a module
        return NextResponse.json({
          success: true,
          message: 'Progress reset successfully',
          userId,
          moduleId
        });

      case 'send_reminder':
        // Send reminder to student
        return NextResponse.json({
          success: true,
          message: 'Reminder sent successfully',
          userId
        });

      case 'generate_report':
        // Generate progress report
        return NextResponse.json({
          success: true,
          message: 'Report generated successfully',
          reportUrl: `/reports/progress-${Date.now()}.pdf`
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing progress action:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process request',
      message: error.message
    }, { status: 500 });
  }
}

