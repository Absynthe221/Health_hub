import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const userId = searchParams.get('userId');

    // Read exercises data from JSON file
    const exercisesPath = path.join(process.cwd(), 'data', 'ecg-exercises.json');
    const fileContents = fs.readFileSync(exercisesPath, 'utf8');
    let exercises = JSON.parse(fileContents);

    // Filter exercises based on query parameters
    if (difficulty) {
      exercises = exercises.filter((exercise) => exercise.difficulty === difficulty);
    }
    
    if (category) {
      exercises = exercises.filter((exercise) => exercise.category === category);
    }

    // Get user progress (mock data - in real app, query database)
    const userProgress = {
      'ex1': { completed: true, score: 85, completedAt: '2024-01-20T15:30:00Z' },
      'ex2': { completed: false, score: 0, completedAt: null },
      'ex3': { completed: true, score: 92, completedAt: '2024-01-22T10:15:00Z' },
      'ex4': { completed: false, score: 0, completedAt: null },
      'ex5': { completed: false, score: 0, completedAt: null }
    };

    // Add progress information to exercises
    if (userId) {
      exercises = exercises.map((exercise) => ({
        ...exercise,
        userProgress: userProgress[exercise.id] || {
          completed: false,
          score: 0,
          completedAt: null
        }
      }));
    }

    return NextResponse.json({
      success: true,
      exercises,
      total: exercises.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching ECG exercises:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { exerciseId, answers, userId, timeSpent } = body;

    if (!exerciseId || !answers || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: exerciseId, answers, userId' },
        { status: 400 }
      );
    }

    // Read exercises data
    const exercisesPath = path.join(process.cwd(), 'data', 'ecg-exercises.json');
    const fileContents = fs.readFileSync(exercisesPath, 'utf8');
    const exercises = JSON.parse(fileContents);

    // Find the exercise
    const exercise = exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }

    // Grade the exercise
    const results = gradeExercise(exercise, answers);
    
    // Save user progress (mock implementation - in real app, save to database)
    const submission = {
      id: `submission_${Date.now()}`,
      exerciseId,
      userId,
      answers,
      results,
      timeSpent: timeSpent || 0,
      submittedAt: new Date().toISOString()
    };

    // Mock: Save submission to JSON file
    const submissionsPath = path.join(process.cwd(), 'data', 'exercise-submissions.json');
    let submissions = [];
    try {
      const existingData = fs.readFileSync(submissionsPath, 'utf8');
      submissions = JSON.parse(existingData);
    } catch (err) {
      // File doesn't exist, start with empty array
    }
    
    submissions.push(submission);
    fs.writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2));

    return NextResponse.json({
      success: true,
      submission,
      results
    });

  } catch (error) {
    console.error('Error submitting exercise:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function gradeExercise(exercise, answers) {
  // Simple text-based grading for the new exercise format
  const userAnswer = answers.answer || '';
  const solution = exercise.solution || '';
  
  // Basic keyword matching for grading
  const solutionKeywords = solution.toLowerCase().split(/[,\s]+/).filter(word => word.length > 3);
  const userAnswerLower = userAnswer.toLowerCase();
  
  let matchedKeywords = 0;
  solutionKeywords.forEach(keyword => {
    if (userAnswerLower.includes(keyword)) {
      matchedKeywords++;
    }
  });
  
  // Calculate score based on keyword matches
  const keywordScore = Math.round((matchedKeywords / solutionKeywords.length) * 100);
  
  // Additional scoring based on length and complexity
  const lengthScore = Math.min(userAnswer.length / 50, 1) * 20; // Max 20 points for length
  const finalScore = Math.min(keywordScore + lengthScore, 100);
  
  const passed = finalScore >= 70;

  return {
    score: Math.round(finalScore),
    passed,
    matchedKeywords,
    totalKeywords: solutionKeywords.length,
    feedback: generateFeedback(Math.round(finalScore), exercise.difficulty),
    solution: exercise.solution
  };
}

function generateFeedback(score, difficulty) {
  if (score >= 90) {
    return {
      message: "Excellent work! You have a strong understanding of this topic.",
      level: "excellent"
    };
  } else if (score >= 80) {
    return {
      message: "Good job! You understand the concepts well with room for improvement.",
      level: "good"
    };
  } else if (score >= 70) {
    return {
      message: "You passed! Review the explanations to strengthen your understanding.",
      level: "pass"
    };
  } else {
    return {
      message: "Keep studying! Review the material and try again.",
      level: "fail"
    };
  }
}
