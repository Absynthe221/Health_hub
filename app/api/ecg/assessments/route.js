import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const assessmentData = await request.json();
    
    // Read assessments data from JSON file
    const assessmentsPath = path.join(process.cwd(), 'data', 'ecg-assessments.json');
    
    if (!fs.existsSync(assessmentsPath)) {
      fs.writeFileSync(assessmentsPath, JSON.stringify([], null, 2));
    }
    
    const assessments = JSON.parse(fs.readFileSync(assessmentsPath, 'utf8'));
    
    // Add new assessment
    const newAssessment = {
      id: Date.now().toString(),
      ...assessmentData,
      submittedAt: new Date().toISOString()
    };
    
    assessments.push(newAssessment);
    fs.writeFileSync(assessmentsPath, JSON.stringify(assessments, null, 2));
    
    return NextResponse.json(newAssessment);
  } catch (error) {
    console.error('Error saving assessment data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const moduleId = searchParams.get('moduleId');
    const type = searchParams.get('type');
    
    // Read assessments data from JSON file
    const assessmentsPath = path.join(process.cwd(), 'data', 'ecg-assessments.json');
    
    if (!fs.existsSync(assessmentsPath)) {
      return NextResponse.json([]);
    }
    
    let assessments = JSON.parse(fs.readFileSync(assessmentsPath, 'utf8'));
    
    // Filter by parameters
    if (userId) {
      assessments = assessments.filter(a => a.userId === userId);
    }
    if (moduleId) {
      assessments = assessments.filter(a => a.moduleId === moduleId);
    }
    if (type) {
      assessments = assessments.filter(a => a.type === type);
    }
    
    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error loading assessment data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}





