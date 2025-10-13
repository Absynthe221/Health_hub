import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read courses data from JSON file
    const dataPath = path.join(process.cwd(), 'data', 'courses.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const courses = JSON.parse(fileContents);

    return NextResponse.json({
      success: true,
      courses,
      totalCourses: courses.length,
      publishedCourses: courses.filter(c => c.status === 'published').length,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch courses data',
        message: 'Could not read courses.json file'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const newCourse = await request.json();
    
    // Read existing data
    const dataPath = path.join(process.cwd(), 'data', 'courses.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const courses = JSON.parse(fileContents);
    
    // Add new course
    const course = {
      id: `course_${Date.now()}`,
      enrolledLearners: [],
      status: 'draft',
      completionRate: 0,
      averageScore: 0,
      totalLessons: 0,
      estimatedHours: 0,
      difficulty: 'beginner',
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      modules: [],
      quizzes: [],
      ...newCourse
    };
    
    courses.push(course);
    
    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(courses, null, 2));
    
    return NextResponse.json({
      success: true,
      course,
      message: 'Course created successfully'
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create course',
        message: 'Could not write to courses.json file'
      },
      { status: 500 }
    );
  }
}
