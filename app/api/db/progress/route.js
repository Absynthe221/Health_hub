import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET user progress
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const moduleId = searchParams.get('moduleId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const where = {
      userId,
      ...(moduleId && {
        slide: {
          moduleId
        }
      })
    };

    const progress = await prisma.slideProgress.findMany({
      where,
      include: {
        slide: {
          select: {
            moduleId: true,
            slideNumber: true,
            title: true,
            contentType: true
          }
        }
      },
      orderBy: {
        lastAccessed: 'desc'
      }
    });

    // Calculate summary statistics
    const totalSlides = progress.length;
    const completedSlides = progress.filter(p => p.completed).length;
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);
    const avgQuizScore = progress.filter(p => p.quizScore !== null).length > 0
      ? Math.round(progress.filter(p => p.quizScore !== null).reduce((sum, p) => sum + (p.quizScore || 0), 0) / progress.filter(p => p.quizScore !== null).length)
      : null;

    return NextResponse.json({
      success: true,
      progress,
      summary: {
        totalSlides,
        completedSlides,
        completionPercentage: totalSlides > 0 ? Math.round((completedSlides / totalSlides) * 100) : 0,
        totalTimeSpent, // seconds
        avgQuizScore
      }
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch progress', details: error.message },
      { status: 500 }
    );
  }
}

// POST/UPDATE progress
export async function POST(request) {
  try {
    const { userId, slideId, completed, timeSpent, quizScore, puzzleScore } = await request.json();

    if (!userId || !slideId) {
      return NextResponse.json(
        { success: false, error: 'userId and slideId are required' },
        { status: 400 }
      );
    }

    const progress = await prisma.slideProgress.upsert({
      where: {
        userId_slideId: {
          userId,
          slideId
        }
      },
      update: {
        completed: completed !== undefined ? completed : undefined,
        timeSpent: timeSpent !== undefined ? { increment: timeSpent } : undefined,
        quizScore: quizScore !== undefined ? quizScore : undefined,
        puzzleScore: puzzleScore !== undefined ? puzzleScore : undefined,
        lastAccessed: new Date()
      },
      create: {
        userId,
        slideId,
        completed: completed || false,
        timeSpent: timeSpent || 0,
        quizScore,
        puzzleScore,
        lastAccessed: new Date()
      }
    });

    // Update user profile streak and points
    if (completed) {
      const profile = await prisma.userProfile.findUnique({
        where: { userId }
      });

      if (profile) {
        const pointsEarned = 10 + (quizScore || 0) / 10 + (puzzleScore || 0) / 10;
        
        await prisma.userProfile.update({
          where: { userId },
          data: {
            points: { increment: Math.round(pointsEarned) },
            lastActiveDate: new Date()
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update progress', details: error.message },
      { status: 500 }
    );
  }
}

