import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Next.js 14 App Router handles body parsing automatically for FormData
// No need for bodyParser config

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const moduleTitle = formData.get('title') || 'Untitled Module';
    const moduleDescription = formData.get('description') || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate unique module ID
    const moduleId = `module-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'slides', moduleId);
    const audioDir = path.join(process.cwd(), 'public', 'uploads', 'audio', moduleId);

    // Create directories
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Save uploaded file
    const fileExtension = path.extname(file.name).toLowerCase();
    const fileName = `presentation${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Process the file based on type
    let slides = [];
    
    if (fileExtension === '.pptx') {
      slides = await processPPTX(filePath, uploadDir, audioDir);
    } else if (fileExtension === '.pdf') {
      slides = await processPDF(filePath, uploadDir, audioDir);
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // Create module data
    const moduleData = {
      id: moduleId,
      title: moduleTitle,
      description: moduleDescription,
      slides: slides,
      roleAccess: ['learner', 'instructor'],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slideCount: slides.length,
      hasAudio: slides.some(slide => slide.audio),
      hasQuiz: slides.some(slide => slide.quiz)
    };

    // Save module data
    const modulesPath = path.join(process.cwd(), 'data', 'modules.json');
    let modules = [];
    
    if (fs.existsSync(modulesPath)) {
      const modulesData = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
      modules = modulesData.modules || [];
    }
    
    modules.push(moduleData);
    
    const modulesData = {
      modules: modules,
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(modulesPath, JSON.stringify(modulesData, null, 2));

    return NextResponse.json({
      success: true,
      module: moduleData,
      message: 'Presentation uploaded and processed successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload', details: error.message },
      { status: 500 }
    );
  }
}

async function processPPTX(filePath, uploadDir, audioDir) {
  try {
    // For now, create mock slides - in production, you'd use pptx2json
    const slides = [];
    const slideCount = 5; // Mock slide count
    
    for (let i = 1; i <= slideCount; i++) {
      const slideData = {
        id: i,
        image: `/uploads/slides/${path.basename(uploadDir)}/slide${i}.png`,
        subtitle: `This is slide ${i} content extracted from the presentation.`,
        audio: null, // Can be added later
        quiz: null   // Can be added later
      };
      
      // Create placeholder image (in production, extract from PPTX)
      const placeholderImage = createPlaceholderImage(800, 600, `Slide ${i}`);
      const imagePath = path.join(uploadDir, `slide${i}.png`);
      fs.writeFileSync(imagePath, placeholderImage);
      
      slides.push(slideData);
    }
    
    return slides;
  } catch (error) {
    console.error('PPTX processing error:', error);
    return [];
  }
}

async function processPDF(filePath, uploadDir, audioDir) {
  try {
    // For now, create mock slides - in production, you'd use pdf-parse
    const slides = [];
    const slideCount = 3; // Mock slide count
    
    for (let i = 1; i <= slideCount; i++) {
      const slideData = {
        id: i,
        image: `/uploads/slides/${path.basename(uploadDir)}/slide${i}.png`,
        subtitle: `This is slide ${i} content extracted from the PDF.`,
        audio: null,
        quiz: null
      };
      
      // Create placeholder image
      const placeholderImage = createPlaceholderImage(800, 600, `PDF Slide ${i}`);
      const imagePath = path.join(uploadDir, `slide${i}.png`);
      fs.writeFileSync(imagePath, placeholderImage);
      
      slides.push(slideData);
    }
    
    return slides;
  } catch (error) {
    console.error('PDF processing error:', error);
    return [];
  }
}

function createPlaceholderImage(width, height, text) {
  // Create a simple SVG placeholder and convert to PNG
  // For now, create a simple base64 encoded PNG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
            font-family="Arial, sans-serif" font-size="24" fill="#374151">
        ${text}
      </text>
    </svg>
  `;
  
  // For now, return a simple data URL that can be saved as PNG
  // In production, you'd use a proper SVG to PNG converter
  return Buffer.from(svg, 'utf8');
}
