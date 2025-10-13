import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title') || 'Untitled Presentation';
    const description = formData.get('description') || 'Uploaded presentation';
    const instructor = formData.get('instructor') || 'Dr. Medical Instructor';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique module ID
    const moduleId = `module-${Date.now()}`;
    const moduleDir = path.join(uploadsDir, moduleId);
    fs.mkdirSync(moduleDir, { recursive: true });

    // Save uploaded file
    const fileExtension = path.extname(file.name);
    const fileName = `presentation${fileExtension}`;
    const filePath = path.join(moduleDir, fileName);
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Create module data structure
    const moduleData = {
      moduleId,
      title,
      description,
      difficulty: 'intermediate',
      category: 'uploaded',
      duration: 30,
      status: 'published',
      roleAccess: ['learner', 'instructor', 'admin'],
      slideCount: 1,
      hasAudio: false,
      hasQuiz: false,
      hasInteractiveElements: false,
      instructorName: instructor,
      slides: [
        {
          id: 1,
          title: 'Presentation Slide',
          content: `This is the content from ${file.name}. The presentation has been uploaded and is ready for viewing.`,
          learningObjectives: [
            'Review the uploaded presentation content',
            'Understand the key concepts presented',
            'Apply knowledge to clinical practice'
          ],
          media: {
            images: [`/uploads/${moduleId}/slide1.png`],
            audio: [],
            video: []
          },
          type: 'presentation',
          quiz: null,
          duration: 30
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'ECG_Professional'
    };

    // Save module data
    const moduleDataPath = path.join(moduleDir, 'module.json');
    fs.writeFileSync(moduleDataPath, JSON.stringify(moduleData, null, 2));

    // Update the comprehensive modules file
    const comprehensivePath = path.join(process.cwd(), 'data', 'ecg_modules_comprehensive.json');
    let allModules = [];
    
    if (fs.existsSync(comprehensivePath)) {
      const existingData = JSON.parse(fs.readFileSync(comprehensivePath, 'utf8'));
      allModules = Array.isArray(existingData) ? existingData : existingData.modules || [];
    }
    
    allModules.push(moduleData);
    fs.writeFileSync(comprehensivePath, JSON.stringify(allModules, null, 2));

    return NextResponse.json({
      success: true,
      module: moduleData,
      message: 'Presentation processed successfully'
    });

  } catch (error) {
    console.error('Error processing presentation:', error);
    return NextResponse.json(
      { error: 'Failed to process presentation' },
      { status: 500 }
    );
  }
}



