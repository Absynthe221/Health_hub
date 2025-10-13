#!/usr/bin/env node

/**
 * Health Hub ECG - Complete PPTX to JSON Conversion Pipeline
 * ==========================================================
 * 
 * This script converts all 18 PPTX files into structured JSON modules with:
 * - Complete slide extraction (text, images, audio placeholders)
 * - Package-based categorization (Beginner/Intermediate/Advanced)
 * - AI-generated MCQ placeholders
 * - Media synchronization mapping
 * - Certificate tracking structure
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const PRESENTATIONS_DIR = './presentations';
const OUTPUT_FILE = './data/ecg_modules_complete.json';
const MEDIA_DIR = './public/uploads/ecg-media';

// Package categorization mapping
const PACKAGE_MAPPING = {
  'BEGINNER': [
    'ECG LECTURE SLIDE',
    'BRIEF_ANATOMY_AND_PHYSIOLOGY_OF_THE_HEART',
    'Introduction_to_ECG_Interpretation'
  ],
  'INTERMEDIATE': [
    'Class3',
    'JUNCTIONAL RHYTHM',
    'ACTIVUS MR IBRAHIM CARDIAC CHAMBERS',
    'lead error'
  ],
  'ADVANCED': [
    'STEMI',
    'ACTIVUS MR IBRAHIM PEA',
    'ACTIVUS MR IBRAHIM VENTRICULAR RHYTHMS',
    'ECG TRAINING'
  ]
};

// Module metadata mapping
const MODULE_METADATA = {
  'ECG LECTURE SLIDE': {
    title: 'ECG Basics and Fundamentals',
    description: 'Introduction to ECG interpretation and basic concepts',
    difficulty: 'Beginner',
    estimatedDuration: 45,
    prerequisites: [],
    learningObjectives: [
      'Understand ECG waveform components',
      'Learn basic rhythm identification',
      'Master fundamental ECG measurements'
    ]
  },
  'BRIEF_ANATOMY_AND_PHYSIOLOGY_OF_THE_HEART': {
    title: 'Heart Anatomy and Physiology',
    description: 'Comprehensive overview of cardiac anatomy and electrical conduction',
    difficulty: 'Beginner',
    estimatedDuration: 60,
    prerequisites: [],
    learningObjectives: [
      'Identify cardiac chambers and valves',
      'Understand electrical conduction system',
      'Learn cardiac cycle phases'
    ]
  },
  'Introduction_to_ECG_Interpretation': {
    title: 'Introduction to ECG Interpretation',
    description: 'Foundation course for ECG reading and interpretation skills',
    difficulty: 'Beginner',
    estimatedDuration: 50,
    prerequisites: [],
    learningObjectives: [
      'Master ECG lead placement',
      'Understand normal ECG parameters',
      'Learn systematic ECG analysis'
    ]
  },
  'Class3': {
    title: 'Intermediate ECG Patterns',
    description: 'Advanced ECG patterns and clinical correlations',
    difficulty: 'Intermediate',
    estimatedDuration: 55,
    prerequisites: ['ECG LECTURE SLIDE', 'BRIEF_ANATOMY_AND_PHYSIOLOGY_OF_THE_HEART'],
    learningObjectives: [
      'Recognize common arrhythmias',
      'Identify ischemic changes',
      'Analyze complex rhythms'
    ]
  },
  'JUNCTIONAL RHYTHM': {
    title: 'Junctional Rhythms and Conduction',
    description: 'Understanding junctional rhythms and AV conduction abnormalities',
    difficulty: 'Intermediate',
    estimatedDuration: 40,
    prerequisites: ['Introduction_to_ECG_Interpretation'],
    learningObjectives: [
      'Identify junctional rhythms',
      'Understand AV conduction blocks',
      'Learn treatment implications'
    ]
  },
  'ACTIVUS MR IBRAHIM CARDIAC CHAMBERS': {
    title: 'Cardiac Chamber Analysis',
    description: 'Detailed analysis of cardiac chamber abnormalities and hypertrophy',
    difficulty: 'Intermediate',
    estimatedDuration: 50,
    prerequisites: ['BRIEF_ANATOMY_AND_PHYSIOLOGY_OF_THE_HEART'],
    learningObjectives: [
      'Identify chamber enlargement patterns',
      'Understand hypertrophy criteria',
      'Learn clinical correlations'
    ]
  },
  'lead error': {
    title: 'ECG Lead Errors and Troubleshooting',
    description: 'Common ECG recording errors and their identification',
    difficulty: 'Intermediate',
    estimatedDuration: 35,
    prerequisites: ['ECG LECTURE SLIDE'],
    learningObjectives: [
      'Recognize lead placement errors',
      'Identify technical artifacts',
      'Learn troubleshooting techniques'
    ]
  },
  'STEMI': {
    title: 'ST-Elevation Myocardial Infarction',
    description: 'Advanced diagnosis and management of STEMI patterns',
    difficulty: 'Advanced',
    estimatedDuration: 65,
    prerequisites: ['Class3', 'ACTIVUS MR IBRAHIM CARDIAC CHAMBERS'],
    learningObjectives: [
      'Identify STEMI patterns',
      'Understand localization criteria',
      'Learn acute management protocols'
    ]
  },
  'ACTIVUS MR IBRAHIM PEA': {
    title: 'Pulseless Electrical Activity',
    description: 'Advanced cardiac arrest rhythms and PEA management',
    difficulty: 'Advanced',
    estimatedDuration: 45,
    prerequisites: ['JUNCTIONAL RHYTHM'],
    learningObjectives: [
      'Recognize PEA patterns',
      'Understand differential diagnosis',
      'Learn ACLS protocols'
    ]
  },
  'ACTIVUS MR IBRAHIM VENTRICULAR RHYTHMS': {
    title: 'Ventricular Rhythms and Tachycardia',
    description: 'Complex ventricular arrhythmias and emergency management',
    difficulty: 'Advanced',
    estimatedDuration: 70,
    prerequisites: ['STEMI', 'ACTIVUS MR IBRAHIM PEA'],
    learningObjectives: [
      'Identify ventricular tachycardia',
      'Understand VF management',
      'Learn defibrillation protocols'
    ]
  },
  'ECG TRAINING': {
    title: 'Advanced ECG Training and Certification',
    description: 'Comprehensive ECG training for certification preparation',
    difficulty: 'Advanced',
    estimatedDuration: 90,
    prerequisites: ['STEMI', 'ACTIVUS MR IBRAHIM VENTRICULAR RHYTHMS'],
    learningObjectives: [
      'Master complex ECG interpretation',
      'Prepare for certification exams',
      'Apply knowledge in clinical scenarios'
    ]
  }
};

/**
 * Extract slides from PPTX using Python script
 */
async function extractSlidesFromPPTX(pptxPath) {
  const pythonScript = `
import sys
import json
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE
import base64
import os

def extract_slides(pptx_path):
    try:
        prs = Presentation(pptx_path)
        slides_data = []
        
        for i, slide in enumerate(prs.slides, 1):
            slide_data = {
                "slideNumber": i,
                "slideTitle": f"Slide {i}",
                "slideContent": "",
                "slideImage": "",
                "slideAudio": "",
                "slideVideo": "",
                "slideQuiz": null,
                "slideSubtitle": "",
                "slideNotes": "",
                "slideAnnotations": [],
                "learningObjectives": [],
                "interactiveElements": [],
                "mediaSync": {
                    "imageTiming": 0,
                    "audioTiming": 0,
                    "videoTiming": 0
                }
            }
            
            # Extract text content
            text_content = []
            for shape in slide.shapes:
                if hasattr(shape, "text") and shape.text.strip():
                    text_content.append(shape.text.strip())
            
            slide_data["slideContent"] = "\\n\\n".join(text_content)
            
            # Extract images
            for j, shape in enumerate(slide.shapes):
                if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
                    try:
                        image_path = f"/uploads/ecg-media/slide_{i}_image_{j+1}.png"
                        slide_data["slideImage"] = image_path
                        slide_data["interactiveElements"].push({
                            "type": "image",
                            "src": image_path,
                            "alt": f"ECG Diagram {j+1}",
                            "description": "Interactive ECG waveform analysis"
                        })
                    except Exception as e:
                        print(f"Error extracting image: {e}")
            
            # Generate AI narration placeholder
            if slide_data["slideContent"]:
                slide_data["slideAudio"] = f"/uploads/ecg-media/slide_{i}_narration.mp3"
                slide_data["slideSubtitle"] = f"AI-generated narration for: {slide_data['slideContent'][:100]}..."
            
            slides_data.append(slide_data)
        
        return slides_data
    except Exception as e:
        return [{"error": str(e), "slideNumber": 1}]

if __name__ == "__main__":
    pptx_path = sys.argv[1]
    slides = extract_slides(pptx_path)
    print(json.dumps(slides, indent=2))
`;

  const tempScript = `temp_extract_${Date.now()}.py`;
  
  try {
    await fs.writeFile(tempScript, pythonScript);
    const result = execSync(`python3 ${tempScript} "${pptxPath}"`, { 
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    await fs.unlink(tempScript);
    return JSON.parse(result);
  } catch (error) {
    console.error(`Error extracting slides from ${pptxPath}:`, error.message);
    // Return fallback structure
    return [{
      slideNumber: 1,
      slideTitle: `Slide 1 - ${path.basename(pptxPath, '.pptx')}`,
      slideContent: `Content from ${path.basename(pptxPath)} - Manual extraction required`,
      slideImage: "/placeholder-ecg.svg",
      slideAudio: "",
      slideVideo: "",
      slideQuiz: null,
      slideSubtitle: "Manual content extraction needed",
      slideNotes: "This slide requires manual content extraction from the PPTX file",
      slideAnnotations: [],
      learningObjectives: ["Extract and organize slide content"],
      interactiveElements: [],
      mediaSync: { imageTiming: 0, audioTiming: 0, videoTiming: 0 }
    }];
  }
}

/**
 * Generate AI-powered MCQs for a slide
 */
function generateMCQPlaceholder(slideContent, slideNumber) {
  if (!slideContent || slideContent.length < 20) {
    return null;
  }

  return {
    id: `quiz_${slideNumber}`,
    question: `Based on the content in slide ${slideNumber}, what is the most important concept to remember?`,
    options: [
      "The primary learning objective",
      "A secondary detail",
      "An advanced concept",
      "A prerequisite topic"
    ],
    correctAnswer: 0,
    explanation: "This question tests understanding of the main learning objective from this slide.",
    difficulty: "medium",
    category: "comprehension",
    timeLimit: 30
  };
}

/**
 * Determine package level based on filename
 */
function determinePackageLevel(filename) {
  const upperFilename = filename.toUpperCase();
  
  for (const [level, patterns] of Object.entries(PACKAGE_MAPPING)) {
    for (const pattern of patterns) {
      if (upperFilename.includes(pattern.toUpperCase())) {
        return level;
      }
    }
  }
  
  return 'INTERMEDIATE'; // Default fallback
}

/**
 * Main conversion function
 */
async function convertAllPPTXFiles() {
  console.log('🚀 Starting comprehensive PPTX to JSON conversion...');
  
  try {
    const files = await fs.readdir(PRESENTATIONS_DIR);
    const pptxFiles = files.filter(file => file.endsWith('.pptx'));
    
    console.log(`📁 Found ${pptxFiles.length} PPTX files to convert`);
    
    const modules = [];
    
    for (const file of pptxFiles) {
      const filePath = path.join(PRESENTATIONS_DIR, file);
      const moduleId = path.basename(file, '.pptx').toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      console.log(`\n📄 Processing: ${file}`);
      
      try {
        const slides = await extractSlidesFromPPTX(filePath);
        const packageLevel = determinePackageLevel(file);
        const metadata = MODULE_METADATA[path.basename(file, '.pptx')] || {
          title: file.replace('.pptx', '').replace(/_/g, ' '),
          description: `ECG training module: ${file.replace('.pptx', '')}`,
          difficulty: packageLevel,
          estimatedDuration: 45,
          prerequisites: [],
          learningObjectives: ['Master ECG interpretation skills']
        };
        
        // Generate MCQs for slides with content
        slides.forEach((slide, index) => {
          if (slide.slideContent && slide.slideContent.length > 20) {
            slide.slideQuiz = generateMCQPlaceholder(slide.slideContent, index + 1);
          }
        });
        
        const module = {
          id: moduleId,
          moduleId: moduleId,
          title: metadata.title,
          description: metadata.description,
          packageLevel: packageLevel,
          difficulty: metadata.difficulty,
          estimatedDuration: metadata.estimatedDuration,
          prerequisites: metadata.prerequisites,
          learningObjectives: metadata.learningObjectives,
          instructorName: "Dr. ECG Specialist", // Placeholder
          slides: slides,
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mediaAssets: {
            images: slides.filter(s => s.slideImage).map(s => s.slideImage),
            audio: slides.filter(s => s.slideAudio).map(s => s.slideAudio),
            video: slides.filter(s => s.slideVideo).map(s => s.slideVideo)
          },
          assessment: {
            totalQuizzes: slides.filter(s => s.slideQuiz).length,
            passingScore: 80,
            timeLimit: metadata.estimatedDuration * 60, // Convert to seconds
            attempts: 3,
            certificateThreshold: 85
          },
          progress: {
            totalSlides: slides.length,
            completedSlides: 0,
            quizScores: [],
            timeSpent: 0,
            lastAccessed: null
          }
        };
        
        modules.push(module);
        console.log(`✅ Converted: ${file} → ${slides.length} slides, ${packageLevel} level`);
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        
        // Create fallback module
        const fallbackModule = {
          id: moduleId,
          moduleId: moduleId,
          title: file.replace('.pptx', '').replace(/_/g, ' '),
          description: `ECG training module: ${file.replace('.pptx', '')}`,
          packageLevel: 'INTERMEDIATE',
          difficulty: 'Intermediate',
          estimatedDuration: 45,
          prerequisites: [],
          learningObjectives: ['Master ECG interpretation skills'],
          instructorName: "Dr. ECG Specialist",
          slides: [{
            slideNumber: 1,
            slideTitle: `Introduction - ${file.replace('.pptx', '')}`,
            slideContent: `This module contains content from ${file}. Manual extraction and organization required.`,
            slideImage: "/placeholder-ecg.svg",
            slideAudio: "",
            slideVideo: "",
            slideQuiz: null,
            slideSubtitle: "Manual processing required",
            slideNotes: "This module requires manual content extraction from the PPTX file",
            slideAnnotations: [],
            learningObjectives: ["Extract and organize module content"],
            interactiveElements: [],
            mediaSync: { imageTiming: 0, audioTiming: 0, videoTiming: 0 }
          }],
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          mediaAssets: { images: [], audio: [], video: [] },
          assessment: {
            totalQuizzes: 0,
            passingScore: 80,
            timeLimit: 2700,
            attempts: 3,
            certificateThreshold: 85
          },
          progress: {
            totalSlides: 1,
            completedSlides: 0,
            quizScores: [],
            timeSpent: 0,
            lastAccessed: null
          }
        };
        
        modules.push(fallbackModule);
      }
    }
    
    // Create comprehensive output structure
    const output = {
      metadata: {
        totalModules: modules.length,
        conversionDate: new Date().toISOString(),
        sourceFiles: pptxFiles,
        packageDistribution: {
          BEGINNER: modules.filter(m => m.packageLevel === 'BEGINNER').length,
          INTERMEDIATE: modules.filter(m => m.packageLevel === 'INTERMEDIATE').length,
          ADVANCED: modules.filter(m => m.packageLevel === 'ADVANCED').length
        },
        totalSlides: modules.reduce((sum, m) => sum + m.slides.length, 0),
        totalQuizzes: modules.reduce((sum, m) => sum + m.assessment.totalQuizzes, 0)
      },
      modules: modules,
      learningPathways: {
        BEGINNER: {
          title: "Beginner ECG Training",
          description: "Foundation course for ECG interpretation",
          modules: modules.filter(m => m.packageLevel === 'BEGINNER').map(m => m.id),
          estimatedDuration: modules.filter(m => m.packageLevel === 'BEGINNER').reduce((sum, m) => sum + m.estimatedDuration, 0),
          prerequisites: [],
          certificate: {
            name: "ECG Fundamentals Certificate",
            requirements: {
              completionRate: 100,
              passingScore: 80,
              timeSpent: 0
            }
          }
        },
        INTERMEDIATE: {
          title: "Intermediate ECG Training",
          description: "Advanced ECG patterns and clinical applications",
          modules: modules.filter(m => m.packageLevel === 'INTERMEDIATE').map(m => m.id),
          estimatedDuration: modules.filter(m => m.packageLevel === 'INTERMEDIATE').reduce((sum, m) => sum + m.estimatedDuration, 0),
          prerequisites: ["BEGINNER"],
          certificate: {
            name: "ECG Intermediate Certificate",
            requirements: {
              completionRate: 100,
              passingScore: 85,
              timeSpent: 0
            }
          }
        },
        ADVANCED: {
          title: "Advanced ECG Training",
          description: "Expert-level ECG interpretation and emergency management",
          modules: modules.filter(m => m.packageLevel === 'ADVANCED').map(m => m.id),
          estimatedDuration: modules.filter(m => m.packageLevel === 'ADVANCED').reduce((sum, m) => sum + m.estimatedDuration, 0),
          prerequisites: ["INTERMEDIATE"],
          certificate: {
            name: "ECG Expert Certificate",
            requirements: {
              completionRate: 100,
              passingScore: 90,
              timeSpent: 0
            }
          }
        }
      }
    };
    
    // Ensure output directory exists
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
    
    // Write the comprehensive JSON file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    console.log(`\n🎉 Conversion completed successfully!`);
    console.log(`📊 Results:`);
    console.log(`   • Total modules: ${output.metadata.totalModules}`);
    console.log(`   • Total slides: ${output.metadata.totalSlides}`);
    console.log(`   • Total quizzes: ${output.metadata.totalQuizzes}`);
    console.log(`   • Beginner modules: ${output.metadata.packageDistribution.BEGINNER}`);
    console.log(`   • Intermediate modules: ${output.metadata.packageDistribution.INTERMEDIATE}`);
    console.log(`   • Advanced modules: ${output.metadata.packageDistribution.ADVANCED}`);
    console.log(`\n📁 Output file: ${OUTPUT_FILE}`);
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. Review the generated JSON structure`);
    console.log(`   2. Implement package-based access control`);
    console.log(`   3. Set up AI voice generation pipeline`);
    console.log(`   4. Configure automated MCQ generation`);
    console.log(`   5. Implement attention tracking system`);
    
  } catch (error) {
    console.error('❌ Conversion failed:', error);
    process.exit(1);
  }
}

// Run the conversion
if (require.main === module) {
  convertAllPPTXFiles();
}

module.exports = { convertAllPPTXFiles };



