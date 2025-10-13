import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET quiz attempts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const slideId = searchParams.get('slideId');

    const where = {};
    if (userId) where.userId = userId;
    if (slideId) where.slideId = slideId;

    const attempts = await prisma.knowledgeCheckAttempt.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      attempts,
      total: attempts.length
    });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attempts', details: error.message },
      { status: 500 }
    );
  }
}

// POST quiz attempt
export async function POST(request) {
  try {
    const {
      userId,
      slideId,
      questionText,
      selectedAnswer,
      correctAnswer,
      timeSpent
    } = await request.json();

    if (!userId || !slideId || questionText === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const isCorrect = selectedAnswer === correctAnswer;

    // Get attempt number
    const previousAttempts = await prisma.knowledgeCheckAttempt.count({
      where: { userId, slideId }
    });

    const attempt = await prisma.knowledgeCheckAttempt.create({
      data: {
        userId,
        slideId,
        questionText,
        selectedAnswer,
        correctAnswer,
        isCorrect,
        attemptNumber: previousAttempts + 1,
        timeSpent: timeSpent || 0
      }
    });

    // Update user profile points if correct
    if (isCorrect) {
      await prisma.userProfile.update({
        where: { userId },
        data: {
          points: { increment: 5 }
        }
      });
    }

    return NextResponse.json({
      success: true,
      attempt,
      isCorrect,
      message: isCorrect ? 'Correct! +5 points' : 'Incorrect. Try again!'
    });
  } catch (error) {
    console.error('Error creating quiz attempt:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create attempt', details: error.message },
      { status: 500 }
    );
  }
}

