import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
// import { generateSlideMap } from "@/lib/ai/generateSlideMap"; // Disabled to avoid costs
// import { extractPptxText } from "@/lib/utils/pptxParser"; // Disabled due to server-side issues
import { simplePptxToJson } from "@/lib/utils/simplePptxParser";
import { extractPptxTextServer } from "@/lib/utils/serverPptxParser";

// Helper function to generate slides from extracted text (cost-effective, no AI)
function generateSlidesFromText(text, title) {
  const slides = [];
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  let currentSlide = null;
  let slideIndex = 1;
  
  // Medical education templates for better content
  const medicalNarrations = [
    "Let's explore this important medical concept in detail.",
    "This slide covers essential information for medical professionals.",
    "Understanding this topic is crucial for clinical practice.",
    "Let's examine this medical concept step by step.",
    "This information is vital for patient care and diagnosis.",
    "Let's review this medical topic thoroughly.",
    "This slide presents key medical knowledge for healthcare providers.",
    "Understanding this concept will enhance your clinical skills."
  ];
  
  const medicalDescriptions = [
    "Essential medical knowledge for healthcare professionals",
    "Important clinical concepts and applications",
    "Key medical information for patient care",
    "Fundamental healthcare knowledge and skills",
    "Critical medical concepts for clinical practice",
    "Comprehensive medical education content",
    "Professional healthcare training material",
    "Advanced medical knowledge and applications"
  ];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this line looks like a slide title (multiple patterns)
    if ((trimmedLine.startsWith('Slide') && trimmedLine.includes(':')) ||
        (trimmedLine.length > 0 && trimmedLine.length < 100 && 
         !trimmedLine.includes('.') && !trimmedLine.includes(',') && 
         trimmedLine.charAt(0) === trimmedLine.charAt(0).toUpperCase())) {
      
      // Save previous slide if exists
      if (currentSlide) {
        slides.push(currentSlide);
      }
      
      // Create new slide
      let slideTitle;
      if (trimmedLine.startsWith('Slide') && trimmedLine.includes(':')) {
        slideTitle = trimmedLine.split(':').slice(1).join(':').trim();
      } else {
        slideTitle = trimmedLine;
      }
      
      currentSlide = {
        id: slideIndex++,
        title: slideTitle || `Medical Topic ${slideIndex - 1}`,
        type: "theory",
        content: "",
        narration: `${slideTitle || `Slide ${slideIndex - 1}`}. ${medicalNarrations[Math.floor(Math.random() * medicalNarrations.length)]}`,
        media: [],
        quiz: null
      };
    } else if (currentSlide && trimmedLine.length > 0) {
      // Add content to current slide
      if (currentSlide.content) {
        currentSlide.content += "\n\n" + trimmedLine;
      } else {
        currentSlide.content = trimmedLine;
      }
    }
  }
  
  // Add the last slide
  if (currentSlide) {
    slides.push(currentSlide);
  }
  
  // If no slides were created, create a basic one
  if (slides.length === 0) {
    slides.push({
      id: 1,
      title: title || "Medical Education Content",
      type: "theory",
      content: text.length > 500 ? text.substring(0, 500) + "..." : text,
      narration: `Welcome to ${title || 'this medical education module'}. ${medicalNarrations[0]}`,
      media: [],
      quiz: null
    });
  }
  
  // Enhance slides with medical context
  slides.forEach((slide, index) => {
    if (slide.content && slide.content.length > 0) {
      // Add medical context to narrations
      if (!slide.narration.includes('medical') && !slide.narration.includes('clinical')) {
        slide.narration = `${slide.title}. ${medicalNarrations[index % medicalNarrations.length]}`;
      }
      
      // Ensure content is properly formatted
      slide.content = slide.content.trim();
    }
  });
  
  return slides;
}

// Helper function to generate medical education descriptions (cost-effective)
function generateDescription(title, slideCount) {
  const medicalDescriptions = [
    `A comprehensive medical education module on ${title} covering essential healthcare concepts and clinical applications.`,
    `Professional medical training material on ${title} with ${slideCount} detailed slides for healthcare professionals.`,
    `Educational content on ${title} designed to enhance clinical knowledge and medical practice skills.`,
    `Medical education module covering ${title} with practical applications for patient care and diagnosis.`,
    `Healthcare training material on ${title} featuring structured medical content and clinical insights.`,
    `Professional medical education on ${title} designed for healthcare providers and medical students.`,
    `Clinical training module on ${title} covering essential medical knowledge and practical applications.`,
    `Medical education content on ${title} with comprehensive coverage for healthcare professionals.`
  ];
  
  return medicalDescriptions[Math.floor(Math.random() * medicalDescriptions.length)];
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");
    const difficulty = formData.get("difficulty");
    const packageLevel = formData.get("packageLevel");
    const estimatedDuration = formData.get("estimatedDuration");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file size (10MB limit for safety)
    const maxSize = 10 * 1024 * 1024; // 10MB - reduced for Safari safety
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB for browser safety." },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['.pptx', '.pdf', '.mp4', '.jpg', '.jpeg', '.png'];
    const fileExtension = path.extname(file.name).toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { error: `File type ${fileExtension} not supported. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    console.log(`Processing upload: ${file.name}`);
    console.log(`File type: ${fileExtension}, Size: ${file.size} bytes`);

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique module ID
    const moduleId = `module-${Date.now()}`;
    const moduleDir = path.join(uploadsDir, moduleId);
    await mkdir(moduleDir, { recursive: true });

    // Save uploaded file with memory optimization
    const filePath = path.join(moduleDir, `presentation${fileExtension}`);
    let bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Clear the array buffer to free memory
    bytes = null;

    let processedModule;

    if (fileExtension === '.pptx') {
      // Process PPTX with enhanced slide generation
      console.log("Processing PPTX file...");
      
      try {
        // Extract text content from PPTX using server-side parser
        console.log("Extracting content from PPTX using server-side parser...");
        const pptxText = await extractPptxTextServer(file);
        console.log(`Extracted text length: ${pptxText.length} characters`);

        // Use simple parser for cost-effective processing
        console.log("Using cost-effective slide generation (no AI)...");
        const slides = generateSlidesFromText(pptxText, title || path.basename(file.name, fileExtension));
        console.log(`Generated ${slides.length} slides from PPTX content`);
        
        processedModule = {
          id: moduleId,
          moduleId: moduleId,
          title: title || path.basename(file.name, fileExtension),
          description: description || generateDescription(title || path.basename(file.name, fileExtension), slides.length),
          difficulty: difficulty || "Intermediate",
          packageLevel: packageLevel || "standard",
          estimatedDuration: parseInt(estimatedDuration) || Math.max(30, slides.length * 2),
          category: "uploaded",
          status: "processed",
          slides: slides,
          instructorName: "Dr. Medical Education Assistant",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          filePath: `/uploads/${moduleId}/presentation${fileExtension}`,
          type: "Cost_Effective_Processing"
        };
        
        console.log(`PPTX processed successfully with ${slides.length} slides`);
        
      } catch (processingError) {
        console.error("PPTX processing failed:", processingError);
        
        // Fallback to basic module structure
        processedModule = {
          id: moduleId,
          moduleId: moduleId,
          title: title || path.basename(file.name, fileExtension),
          description: description || "Medical education presentation uploaded and ready for review and editing. Please add your content and structure the slides as needed.",
          difficulty: difficulty || "Intermediate",
          packageLevel: packageLevel || "standard",
          estimatedDuration: parseInt(estimatedDuration) || 45,
          category: "uploaded",
          status: "uploaded",
          slides: [
            {
              id: 1,
              title: "Medical Education Overview",
              type: "theory",
              content: "This medical education presentation has been uploaded and is ready for review and editing. Please add your medical content and structure the slides as needed for your healthcare training program.",
              narration: "Welcome to this medical education module. This presentation covers important healthcare concepts. Please review and edit the content as needed to meet your educational objectives.",
              media: [],
              quiz: null
            }
          ],
          instructorName: "Dr. Medical Education Assistant",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          filePath: `/uploads/${moduleId}/presentation${fileExtension}`,
          type: "Basic_Medical_Upload"
        };
      }
    }

    // Fallback for non-PPTX files or AI processing failure
    if (!processedModule) {
      processedModule = {
        id: moduleId,
        moduleId: moduleId,
        title: title || path.basename(file.name, fileExtension),
        description: description || "Uploaded presentation",
        difficulty: difficulty || "Intermediate",
        packageLevel: packageLevel || "standard",
        estimatedDuration: parseInt(estimatedDuration) || 45,
        category: "uploaded",
        status: "uploaded",
        slides: [
          {
            id: 1,
            title: "Presentation Content",
            content: `This is the uploaded ${fileExtension.toUpperCase()} file: ${file.name}`,
            type: "theory",
            media: [{ type: fileExtension.substring(1), url: `/uploads/${moduleId}/presentation${fileExtension}`, timestamp: 0 }]
          }
        ],
        instructorName: "Uploaded Content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        filePath: `/uploads/${moduleId}/presentation${fileExtension}`,
        type: "Uploaded"
      };
    }

    // Save to /data/presentations/
    const presentationsDir = path.join(process.cwd(), 'data', 'presentations');
    await mkdir(presentationsDir, { recursive: true });
    
    const presentationFileName = `${moduleId}.json`;
    const presentationPath = path.join(presentationsDir, presentationFileName);
    
    const presentationData = {
      title: processedModule.title,
      level: processedModule.difficulty.toLowerCase(),
      slides: processedModule.slides.map(slide => ({
        id: slide.id,
        title: slide.title,
        content: slide.content,
        type: slide.type || "theory"
      })),
      instructor: processedModule.instructorName,
      duration: `${processedModule.estimatedDuration} minutes`,
      examThreshold: 80,
      certificate: true,
      prerequisites: [],
      learningObjectives: processedModule.slides.map(slide => `Understand ${slide.title}`),
      assessment: {
        pretest: [],
        posttest: []
      },
      metadata: {
        id: processedModule.id,
        moduleId: processedModule.moduleId,
        filePath: processedModule.filePath,
        createdAt: processedModule.createdAt,
        updatedAt: processedModule.updatedAt,
        status: processedModule.status,
        type: processedModule.type
      }
    };

    await writeFile(presentationPath, JSON.stringify(presentationData, null, 2));

    // Also update the comprehensive modules file
    const comprehensivePath = path.join(process.cwd(), 'data', 'ecg_modules_comprehensive.json');
    let allModules = [];
    
    try {
      const existingData = JSON.parse(await import('fs').then(fs => fs.promises.readFile(comprehensivePath, 'utf8')));
      allModules = Array.isArray(existingData) ? existingData : existingData.modules || [];
    } catch (error) {
      console.log("Creating new comprehensive modules file");
    }
    
    allModules.push(processedModule);
    await writeFile(comprehensivePath, JSON.stringify(allModules, null, 2));

    console.log("Upload processed successfully:", {
      moduleId: processedModule.id,
      title: processedModule.title,
      slidesCount: processedModule.slides.length,
      presentationFile: presentationFileName
    });

    return NextResponse.json({
      success: true,
      module: processedModule,
      presentationFile: presentationFileName,
      message: "Presentation uploaded and processed successfully"
    });

  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { error: "Failed to process upload: " + error.message },
      { status: 500 }
    );
  }
}
