import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read learners data from JSON file
    const dataPath = path.join(process.cwd(), 'data', 'learners.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const learners = JSON.parse(fileContents);

    return NextResponse.json({
      success: true,
      learners,
      totalLearners: learners.length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching learners:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch learners data',
        message: 'Could not read learners.json file'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const newLearner = await request.json();
    
    // Read existing data
    const dataPath = path.join(process.cwd(), 'data', 'learners.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const learners = JSON.parse(fileContents);
    
    // Add new learner
    const learner = {
      id: `learner_${Date.now()}`,
      ...newLearner,
      enrolledCourses: newLearner.enrolledCourses || [],
      progress: newLearner.progress || {},
      badges: newLearner.badges || [],
      quizScores: newLearner.quizScores || [],
      streak: newLearner.streak || 0,
      points: newLearner.points || 0,
      rank: learners.length + 1,
      coursesCompleted: newLearner.coursesCompleted || 0,
      avgScore: newLearner.avgScore || 0
    };
    
    learners.push(learner);
    
    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(learners, null, 2));
    
    return NextResponse.json({
      success: true,
      learner,
      message: 'Learner created successfully'
    });

  } catch (error) {
    console.error('Error creating learner:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create learner',
        message: 'Could not write to learners.json file'
      },
      { status: 500 }
    );
  }
}
