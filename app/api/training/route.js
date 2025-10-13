import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    // Read training program data from JSON file
    const dataPath = path.join(process.cwd(), 'data', 'training-program.json');
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    const trainingData = JSON.parse(fileContents);

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const moduleId = searchParams.get('moduleId');
    const type = searchParams.get('type');

    let modules = trainingData.trainingProgram.modules;

    // Filter by role if specified
    if (role) {
      modules = modules.filter(module => 
        module.roles.includes(role) || module.roles.includes('all')
      );
    }

    // Filter by module ID if specified
    if (moduleId) {
      modules = modules.filter(module => module.id === moduleId);
    }

    // Filter by assessment type if specified
    if (type) {
      modules = modules.filter(module => module.assessment.type === type);
    }

    // Calculate statistics
    const stats = {
      totalModules: trainingData.trainingProgram.modules.length,
      filteredModules: modules.length,
      moduleTypes: {
        quiz: trainingData.trainingProgram.modules.filter(m => m.assessment.type === 'quiz').length,
        practical: trainingData.trainingProgram.modules.filter(m => m.assessment.type === 'practical').length,
        scenario: trainingData.trainingProgram.modules.filter(m => m.assessment.type === 'scenario').length
      },
      mandatoryModules: trainingData.trainingProgram.modules.filter(m => m.roles.includes('all')).length
    };

    return NextResponse.json({
      success: true,
      trainingProgram: {
        ...trainingData.trainingProgram,
        modules
      },
      stats,
      filters: {
        role,
        moduleId,
        type
      },
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching training program:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch training program data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { moduleId, userId, progress, score, completed } = body;

    // Validate required fields
    if (!moduleId || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Module ID and User ID are required' 
        },
        { status: 400 }
      );
    }

    // In a real application, this would save to a database
    // For now, we'll return a success response
    const result = {
      success: true,
      message: 'Training progress updated successfully',
      data: {
        moduleId,
        userId,
        progress: progress || 0,
        score: score || null,
        completed: completed || false,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error updating training progress:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update training progress',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
