import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST submit quiz answers (for final module quiz)
export async function POST(request, { params }) {
  try {
    const { id } = params; // slideId
    const { userId, answers, timeSpent } = await request.json();

    if (!userId || !answers) {
      return NextResponse.json(
        { success: false, error: 'userId and answers are required' },
        { status: 400 }
      );
    }

    // Get the slide with quiz data
    const slide = await prisma.moduleSlide.findUnique({
      where: { id }
    });

    if (!slide || !slide.quizData) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    const quizData = JSON.parse(slide.quizData);
    const questions = quizData.questions || [];

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= (quizData.passingScore || 70);

    // Update slide progress
    await prisma.slideProgress.upsert({
      where: {
        userId_slideId: {
          userId,
          slideId: id
        }
      },
      update: {
        completed: passed,
        quizScore: scorePercentage,
        timeSpent: { increment: timeSpent || 0 },
        lastAccessed: new Date()
      },
      create: {
        userId,
        slideId: id,
        completed: passed,
        quizScore: scorePercentage,
        timeSpent: timeSpent || 0
      }
    });

    // Update user profile
    const pointsEarned = passed ? Math.round(scorePercentage / 2) : Math.round(scorePercentage / 4);
    
    await prisma.userProfile.update({
      where: { userId },
      data: {
        points: { increment: pointsEarned }
      }
    });

    return NextResponse.json({
      success: true,
      score: scorePercentage,
      correctCount,
      totalQuestions: questions.length,
      passed,
      pointsEarned,
      message: passed ? 'Congratulations! You passed!' : 'Keep studying and try again!'
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit quiz', details: error.message },
      { status: 500 }
    );
  }
}

