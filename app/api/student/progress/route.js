import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const MODULES_DIR = path.join(process.cwd(), 'public', 'modules')

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const period = (searchParams.get('period') || '30d').toLowerCase()

    // Optionally in the future: use req.user.id to pull real learner data
    // For now, compute sane defaults from available modules
    let moduleDirs = []
    try {
      moduleDirs = await fs.readdir(MODULES_DIR)
    } catch (_) {
      moduleDirs = []
    }

    let totalModules = 0
    let totalSlides = 0

    for (const dir of moduleDirs) {
      try {
        const jsonPath = path.join(MODULES_DIR, dir, 'module.json')
        const raw = await fs.readFile(jsonPath, 'utf8')
        const mod = JSON.parse(raw)
        totalModules += 1
        totalSlides += Array.isArray(mod.slides) ? mod.slides.length : (mod.metadata?.totalSlides || 0)
      } catch (_) {
        continue
      }
    }

    // Mock learner progress metrics (replace with real storage later)
    const completedModules = Math.min( Math.floor(totalModules * 0.3), totalModules)
    const completedSlides = Math.min( Math.floor(totalSlides * 0.35), totalSlides)
    const averageScore = totalModules > 0 ? 78 : 0
    const studyTime = `${Math.max(1, Math.floor(totalSlides * 0.5))}h`

    const weeklyProgress = [
      { week: 'This week', modulesCompleted: Math.min(2, totalModules), timeSpent: '3h' },
      { week: 'Last week', modulesCompleted: Math.min(3, totalModules), timeSpent: '4h' },
      { week: '2 weeks ago', modulesCompleted: Math.min(1, totalModules), timeSpent: '2h' },
    ]

    const achievements = [
      {
        id: 'achv_1',
        title: 'First Module Completed',
        description: 'Completed your first learning module',
        earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      },
    ]

    const recentActivity = [
      {
        id: 'act_1',
        moduleTitle: 'ECG Fundamentals',
        type: 'module_complete',
        score: 85,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        id: 'act_2',
        moduleTitle: 'Cardiac Rhythm Recognition',
        type: 'quiz_complete',
        score: 78,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
    ]

    const response = {
      success: true,
      period,
      progress: {
        totalModules,
        completedModules,
        totalSlides,
        completedSlides,
        averageScore,
        studyTime,
        weeklyProgress,
        achievements,
        recentActivity,
      },
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch student progress' }, { status: 500 })
  }
}

export const POST = async (req) => {
  try {
    // Accept minimal progress updates
    // Body shape: { moduleId, slideIndex, status, completionPercentage, score }
    const body = await req.json()
    const errors = []
    if (!body || typeof body !== 'object') errors.push('Invalid JSON body')
    if (!body?.moduleId) errors.push('moduleId is required')
    if (body?.completionPercentage != null) {
      const cp = Number(body.completionPercentage)
      if (Number.isNaN(cp) || cp < 0 || cp > 100) errors.push('completionPercentage must be 0-100')
    }
    if (errors.length) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    // In a real app, persist to DB per user (req.user.id)
    // For now, just echo back a normalized payload and pretend it was saved
    const normalized = {
      moduleId: String(body.moduleId),
      slideIndex: body.slideIndex != null ? Math.max(0, Number(body.slideIndex)) : null,
      status: body.status || (body.completionPercentage === 100 ? 'completed' : 'in-progress'),
      completionPercentage: body.completionPercentage != null ? Number(body.completionPercentage) : null,
      score: body.score != null ? Number(body.score) : null,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, progress: normalized }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update progress' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    // Mock progress data - in production this would come from database
    const progressData = {
      studentId,
      totalModules: 18,
      completedModules: 2,
      totalSlides: 67,
      completedSlides: 8,
      totalQuizItems: 49,
      completedQuizItems: 6,
      averageScore: 85.5,
      studyTime: '4 hours 30 minutes',
      lastActivity: new Date().toISOString(),
      achievements: [
        {
          id: 'first_module',
          title: 'First Module Complete',
          description: 'Completed your first ECG module',
          earnedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'quiz_master',
          title: 'Quiz Master',
          description: 'Scored 90% or higher on 5 quizzes',
          earnedAt: '2024-01-20T14:45:00Z'
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'module_complete',
          moduleId: 'module_1',
          moduleTitle: 'Introduction to ECG',
          timestamp: '2024-01-15T10:30:00Z',
          score: 88
        },
        {
          id: 2,
          type: 'quiz_complete',
          moduleId: 'module_2',
          moduleTitle: 'ECG Waveforms and Intervals',
          timestamp: '2024-01-20T14:45:00Z',
          score: 92
        }
      ],
      weeklyProgress: [
        { week: 'Week 1', modulesCompleted: 1, timeSpent: '2h 15m' },
        { week: 'Week 2', modulesCompleted: 1, timeSpent: '2h 15m' },
        { week: 'Week 3', modulesCompleted: 0, timeSpent: '0h 0m' },
        { week: 'Week 4', modulesCompleted: 0, timeSpent: '0h 0m' }
      ]
    };

    return NextResponse.json({
      success: true,
      progress: progressData
    });

  } catch (error) {
    console.error('Error fetching student progress:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch progress',
      details: error.message 
    }, { status: 500 });
  }
}