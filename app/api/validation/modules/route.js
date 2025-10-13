import { NextResponse } from 'next/server';

// Sample module data (inline to avoid import issues)
const modulesData = {
  modules: [
    {
      moduleId: 'module_1',
      moduleTitle: 'Introduction to ECG',
      description: 'Fundamental concepts of electrocardiography and basic ECG interpretation',
      slides: [
        {
          id: 1,
          title: 'What is an ECG?',
          contentType: 'Text + Diagram',
          interactive: false,
          content: 'An electrocardiogram (ECG) is a medical test that measures the electrical activity of the heart.',
          ai: { generateQuiz: true, summarizeSlide: true, explainECG: false }
        }
      ],
      metadata: {
        totalSlides: 1,
        interactiveSlides: 0,
        quizItems: 0,
        estimatedDuration: '10 minutes',
        difficulty: 'Beginner'
      },
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      tags: ['ECG Basics', 'Introduction']
    }
  ]
};

// Validation functions (inline to avoid import issues)
function validateModuleSchema(module) {
  const errors = [];
  
  if (!module.moduleId) errors.push("Missing moduleId");
  if (!module.moduleTitle) errors.push("Missing moduleTitle");
  if (!module.slides || !Array.isArray(module.slides)) {
    errors.push("Missing or invalid slides array");
  }
  
  return { isValid: errors.length === 0, errors };
}

function validateAllModules(modules) {
  const results = modules.map(module => ({
    moduleId: module.moduleId,
    moduleTitle: module.moduleTitle,
    ...validateModuleSchema(module)
  }));
  
  const validModules = results.filter(r => r.isValid).length;
  const invalidModules = results.length - validModules;
  
  return {
    results,
    summary: {
      totalModules: modules.length,
      validModules,
      invalidModules,
      validationRate: (validModules / modules.length * 100).toFixed(1) + '%'
    }
  };
}

function generateValidationReport(modules) {
  const validation = validateAllModules(modules);
  return {
    timestamp: new Date().toISOString(),
    summary: validation.summary,
    details: validation.results,
    recommendations: []
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const includeReport = searchParams.get('report') === 'true';

    if (moduleId) {
      // Validate single module
      const module = modulesData.modules.find(m => m.moduleId === moduleId);
      if (!module) {
        return NextResponse.json({ error: 'Module not found' }, { status: 404 });
      }

      const validation = validateModuleSchema(module);
      return NextResponse.json({
        moduleId,
        ...validation,
        moduleTitle: module.moduleTitle
      });
    }

    // Validate all modules
    const validation = validateAllModules(modulesData.modules);
    
    let report = null;
    if (includeReport) {
      report = generateValidationReport(modulesData.modules);
    }

    return NextResponse.json({
      success: true,
      validation,
      report
    });

  } catch (error) {
    console.error('Error validating modules:', error);
    return NextResponse.json({ 
      error: 'Validation failed',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { modules } = await request.json();

    if (!modules || !Array.isArray(modules)) {
      return NextResponse.json({ error: 'Modules array is required' }, { status: 400 });
    }

    const validation = validateAllModules(modules);
    const report = generateValidationReport(modules);

    return NextResponse.json({
      success: true,
      validation,
      report,
      metadata: {
        totalModules: modules.length,
        validModules: validation.summary.validModules,
        invalidModules: validation.summary.invalidModules,
        validationRate: validation.summary.validationRate
      }
    });

  } catch (error) {
    console.error('Error validating modules:', error);
    return NextResponse.json({ 
      error: 'Validation failed',
      details: error.message 
    }, { status: 500 });
  }
}
