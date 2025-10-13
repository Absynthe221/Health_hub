import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }

    // Try to load from individual module directory first
    const modulePath = path.join(process.cwd(), 'public', 'modules', id, 'module.json');
    
    if (fs.existsSync(modulePath)) {
      const moduleData = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
      
      // Enhance with additional metadata
      const enhancedModule = {
        ...moduleData,
        id: id,
        slug: id,
        learningPath: generateLearningPath(moduleData),
        prerequisites: generatePrerequisites(moduleData),
        learningObjectives: generateLearningObjectives(moduleData),
        estimatedTime: calculateEstimatedTime(moduleData),
        difficulty: assessDifficulty(moduleData),
        lastUpdated: new Date().toISOString()
      };

      return NextResponse.json(enhancedModule);
    }

    // Fallback: create a basic module structure from available data
    const fallbackModule = createFallbackModule(id);
    
    return NextResponse.json(fallbackModule);

  } catch (error) {
    console.error('Error fetching ECG module:', error);
    return NextResponse.json({ 
      error: 'Failed to load ECG module',
      message: error.message 
    }, { status: 500 });
  }
}

function generateLearningPath(moduleData) {
  const topics = [
    'ECG Fundamentals',
    'Rhythm Analysis', 
    'Clinical Application',
    'Advanced Interpretation'
  ];
  
  // Determine learning path based on module title/content
  const title = moduleData.title?.toLowerCase() || '';
  
  if (title.includes('basic') || title.includes('fundamental')) {
    return topics.slice(0, 2);
  } else if (title.includes('rhythm') || title.includes('arrhythmia')) {
    return topics.slice(1, 3);
  } else if (title.includes('advanced') || title.includes('complex')) {
    return topics.slice(2);
  }
  
  return topics;
}

function generatePrerequisites(moduleData) {
  const title = moduleData.title?.toLowerCase() || '';
  
  if (title.includes('basic') || title.includes('fundamental')) {
    return ['Basic cardiac anatomy knowledge'];
  } else if (title.includes('rhythm') || title.includes('arrhythmia')) {
    return ['ECG basics', 'Cardiac anatomy'];
  } else if (title.includes('advanced')) {
    return ['ECG basics', 'Rhythm analysis', 'Clinical experience'];
  }
  
  return ['Basic medical knowledge'];
}

function generateLearningObjectives(moduleData) {
  const title = moduleData.title?.toLowerCase() || '';
  
  if (title.includes('basic')) {
    return [
      'Understand ECG fundamentals',
      'Identify normal sinus rhythm',
      'Recognize basic ECG patterns'
    ];
  } else if (title.includes('rhythm')) {
    return [
      'Identify various cardiac rhythms',
      'Understand arrhythmia mechanisms',
      'Apply rhythm analysis techniques'
    ];
  } else if (title.includes('stemi') || title.includes('infarction')) {
    return [
      'Recognize STEMI patterns',
      'Understand myocardial infarction',
      'Apply emergency protocols'
    ];
  }
  
  return [
    'Master ECG interpretation',
    'Apply clinical knowledge',
    'Demonstrate competency'
  ];
}

function calculateEstimatedTime(moduleData) {
  // Estimate time based on slides and content
  const slideCount = moduleData.slides?.length || 0;
  const baseTime = slideCount * 2; // 2 minutes per slide
  
  // Add time for quizzes and case studies
  const quizTime = moduleData.adaptiveQuiz ? 10 : 0;
  const caseStudyTime = moduleData.caseStudy ? 15 : 0;
  
  return baseTime + quizTime + caseStudyTime;
}

function assessDifficulty(moduleData) {
  const title = moduleData.title?.toLowerCase() || '';
  
  if (title.includes('basic') || title.includes('fundamental')) {
    return 'beginner';
  } else if (title.includes('advanced') || title.includes('complex')) {
    return 'advanced';
  }
  
  return 'intermediate';
}

function createFallbackModule(id) {
  // Create a basic module structure when individual module file doesn't exist
  const moduleTitles = {
    'activus_mr_ibrahim_pea': 'Pulseless Electrical Activity (PEA)',
    'activus_mr_ibrahim_ventricular_rhythms_wps_office': 'Ventricular Rhythms',
    'class3': 'Heart Block and Arrhythmia Review',
    'ecg_lecture_slide': 'Heart Blocks and Bundle Branch Blocks',
    'junctional_rhythm': 'Junctional Rhythm Analysis',
    'lead_error': 'ECG Interpretation and Recording Errors',
    'stemi': 'STEMI and NSTEMI Management'
  };

  const moduleDescriptions = {
    'activus_mr_ibrahim_pea': 'Understanding pulseless electrical activity and its clinical implications.',
    'activus_mr_ibrahim_ventricular_rhythms_wps_office': 'Comprehensive analysis of ventricular rhythm disorders.',
    'class3': 'Review of heart blocks and arrhythmia recognition.',
    'ecg_lecture_slide': 'In-depth study of conduction system abnormalities.',
    'junctional_rhythm': 'Understanding junctional rhythms and their clinical significance.',
    'lead_error': 'Common ECG recording errors and interpretation challenges.',
    'stemi': 'ST-elevation and non-ST-elevation myocardial infarction management.'
  };

  return {
    id: id,
    title: moduleTitles[id] || id,
    description: moduleDescriptions[id] || 'ECG learning module',
    slides: generateFallbackSlides(id),
    duration: 30,
    difficulty: 'intermediate',
    learningPath: ['ECG Fundamentals', 'Clinical Application'],
    prerequisites: ['Basic cardiac anatomy knowledge'],
    learningObjectives: [
      'Understand ECG interpretation principles',
      'Apply clinical knowledge to ECG analysis',
      'Demonstrate competency in ECG reading'
    ],
    estimatedTime: 30,
    lastUpdated: new Date().toISOString(),
    aiEnhanced: false
  };
}

function generateFallbackSlides(id) {
  const slideCounts = {
    'activus_mr_ibrahim_pea': 21,
    'activus_mr_ibrahim_ventricular_rhythms_wps_office': 20,
    'class3': 45,
    'ecg_lecture_slide': 27,
    'junctional_rhythm': 10,
    'lead_error': 30,
    'stemi': 6
  };

  const count = slideCounts[id] || 10;
  const slides = [];

  for (let i = 1; i <= count; i++) {
    slides.push({
      id: i,
      name: `Slide ${i}`,
      content: `Content for slide ${i} of ${id}`,
      image: null,
      video: null,
      audio: null,
      notes: `Notes for slide ${i}`
    });
  }

  return slides;
}

