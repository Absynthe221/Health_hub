import { NextResponse } from 'next/server';

// In-memory storage for demo (in production, use database)
let puzzleScores = {};

export async function POST(request) {
  try {
    const { userId, puzzleType, score, timeLeft, completed } = await request.json();

    if (!userId || !puzzleType) {
      return NextResponse.json({ error: 'userId and puzzleType are required' }, { status: 400 });
    }

    const scoreData = {
      userId,
      puzzleType,
      score,
      timeLeft,
      completed,
      completedAt: new Date().toISOString()
    };

    // Store score
    const key = `${userId}_${puzzleType}`;
    puzzleScores[key] = scoreData;

    return NextResponse.json({
      success: true,
      score: scoreData,
      message: 'Score saved successfully'
    });

  } catch (error) {
    console.error('Error saving puzzle score:', error);
    return NextResponse.json({ 
      error: 'Failed to save score',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Get all scores for user
    const userScores = Object.values(puzzleScores).filter(score => score.userId === userId);

    // Calculate statistics
    const totalPuzzles = userScores.length;
    const totalScore = userScores.reduce((sum, score) => sum + score.score, 0);
    const averageScore = totalPuzzles > 0 ? Math.round(totalScore / totalPuzzles) : 0;
    const completedPuzzles = userScores.filter(score => score.completed).length;

    return NextResponse.json({
      success: true,
      scores: userScores,
      statistics: {
        totalPuzzles,
        totalScore,
        averageScore,
        completedPuzzles,
        completionRate: totalPuzzles > 0 ? Math.round((completedPuzzles / totalPuzzles) * 100) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching puzzle scores:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch scores',
      details: error.message 
    }, { status: 500 });
  }
}

