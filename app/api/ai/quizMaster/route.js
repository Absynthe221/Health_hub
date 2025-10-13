import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { 
      action,
      moduleContent,
      userProfile,
      quizPreferences,
      performanceData
    } = await request.json();

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    switch (action) {
      case 'generate':
        return await generateComprehensiveQuiz(moduleContent, quizPreferences);
      case 'validate':
        return await validateQuizQuestions(moduleContent, quizPreferences);
      case 'adapt':
        return await generateAdaptiveQuiz(moduleContent, userProfile, performanceData);
      case 'analyze':
        return await analyzeQuizPerformance(performanceData);
      case 'recommend':
        return await recommendQuizStrategy(userProfile, performanceData);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in quiz master:', error);
    return NextResponse.json({
      success: false,
      error: 'Quiz master service error',
      message: error.message
    });
  }
}

async function generateComprehensiveQuiz(moduleContent, quizPreferences) {
  const {
    questionCount = 10,
    difficulty = 'mixed',
    includeCaseStudies = true,
    focusAreas = [],
    questionTypes = ['multiple_choice', 'case_study']
  } = quizPreferences || {};

  const systemPrompt = `You are the QuizMaster AI, a comprehensive medical education expert specializing in ECG interpretation and cardiology.
  
  Generate a comprehensive quiz that includes:
  - ${questionCount} total questions
  - Difficulty level: ${difficulty}
  - Question types: ${questionTypes.join(', ')}
  - Focus areas: ${focusAreas.join(', ') || 'General ECG interpretation'}
  - Include case studies: ${includeCaseStudies}
  
  Return in JSON format:
  {
    "comprehensiveQuiz": {
      "quizId": "unique_id",
      "title": "Comprehensive ECG Quiz",
      "description": "Quiz description",
      "estimatedTime": "20-25 minutes",
      "difficulty": "${difficulty}",
      "questions": [
        {
          "id": 1,
          "type": "multiple_choice|case_study|interpretation",
          "question": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "Detailed explanation",
          "difficulty": "basic|intermediate|advanced",
          "category": "ECG category",
          "points": 1,
          "timeLimit": 60,
          "caseStudy": {
            "patientInfo": "If applicable",
            "clinicalScenario": "If applicable",
            "ecgFindings": "If applicable"
          }
        }
      ],
      "scoring": {
        "totalPoints": 10,
        "passingScore": 70,
        "gradeRanges": {
          "A": "90-100",
          "B": "80-89",
          "C": "70-79",
          "D": "60-69",
          "F": "0-59"
        }
      },
      "learningObjectives": ["objective1", "objective2"],
      "feedback": {
        "immediate": true,
        "detailed": true,
        "adaptive": true
      }
    }
  }
  
  Module Content: ${JSON.stringify(moduleContent)}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate a comprehensive ECG quiz with the specified parameters.` }
    ],
    max_tokens: 5000,
    temperature: 0.7,
  });

  const response = completion.choices[0]?.message?.content || '{}';
  
  try {
    const quiz = JSON.parse(response);
    return NextResponse.json({
      success: true,
      quiz: quiz.comprehensiveQuiz,
      metadata: {
        generatedAt: new Date().toISOString(),
        questionCount: quiz.comprehensiveQuiz?.questions?.length || 0,
        difficulty: difficulty
      }
    });
  } catch (parseError) {
    return NextResponse.json({
      success: false,
      error: 'Failed to parse quiz response',
      quiz: generateFallbackQuiz(questionCount, difficulty)
    });
  }
}

async function validateQuizQuestions(moduleContent, quizQuestions) {
  // Use the validation service
  const validationResponse = await fetch('/api/ai/validateQuiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quizQuestions: quizQuestions,
      moduleContent: moduleContent
    })
  });
  
  return await validationResponse.json();
}

async function generateAdaptiveQuiz(moduleContent, userProfile, performanceData) {
  // Use the adaptive quiz service
  const adaptiveResponse = await fetch('/api/ai/adaptiveQuiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      moduleContent: moduleContent,
      userPerformance: performanceData,
      learningGoals: userProfile?.learningGoals
    })
  });
  
  return await adaptiveResponse.json();
}

async function analyzeQuizPerformance(performanceData) {
  const systemPrompt = `Analyze the user's quiz performance and provide insights for improvement.
  
  Performance Data: ${JSON.stringify(performanceData)}
  
  Return analysis in JSON format:
  {
    "performanceAnalysis": {
      "overallScore": 75,
      "strengths": ["area1", "area2"],
      "weaknesses": ["area1", "area2"],
      "improvementAreas": ["area1", "area2"],
      "recommendations": [
        {
          "area": "ECG Basics",
          "action": "Review fundamental concepts",
          "priority": "high|medium|low"
        }
      ],
      "learningPath": {
        "nextSteps": ["step1", "step2"],
        "suggestedModules": ["module1", "module2"],
        "practiceAreas": ["area1", "area2"]
      }
    }
  }`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Analyze this quiz performance data." }
    ],
    max_tokens: 2000,
    temperature: 0.5,
  });

  const response = completion.choices[0]?.message?.content || '{}';
  
  try {
    const analysis = JSON.parse(response);
    return NextResponse.json({
      success: true,
      analysis: analysis.performanceAnalysis
    });
  } catch (parseError) {
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze performance',
      analysis: generateFallbackAnalysis(performanceData)
    });
  }
}

async function recommendQuizStrategy(userProfile, performanceData) {
  const systemPrompt = `Based on the user profile and performance data, recommend an optimal quiz strategy.
  
  User Profile: ${JSON.stringify(userProfile)}
  Performance Data: ${JSON.stringify(performanceData)}
  
  Return recommendations in JSON format:
  {
    "quizStrategy": {
      "recommendedDifficulty": "basic|intermediate|advanced",
      "questionTypes": ["multiple_choice", "case_study"],
      "focusAreas": ["area1", "area2"],
      "questionCount": 8,
      "timeLimit": 20,
      "adaptiveFeatures": ["difficulty_adjustment", "personalized_feedback"],
      "learningObjectives": ["objective1", "objective2"],
      "studyPlan": {
        "duration": "2 weeks",
        "modules": ["module1", "module2"],
        "practiceSchedule": "daily"
      }
    }
  }`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Recommend an optimal quiz strategy for this user." }
    ],
    max_tokens: 2000,
    temperature: 0.6,
  });

  const response = completion.choices[0]?.message?.content || '{}';
  
  try {
    const strategy = JSON.parse(response);
    return NextResponse.json({
      success: true,
      strategy: strategy.quizStrategy
    });
  } catch (parseError) {
    return NextResponse.json({
      success: false,
      error: 'Failed to generate strategy',
      strategy: generateFallbackStrategy()
    });
  }
}

function generateFallbackQuiz(questionCount, difficulty) {
  return {
    quizId: `fallback_${Date.now()}`,
    title: "ECG Learning Quiz",
    description: "A comprehensive ECG interpretation quiz",
    estimatedTime: "15-20 minutes",
    difficulty: difficulty,
    questions: Array.from({ length: Math.min(questionCount, 5) }, (_, i) => ({
      id: i + 1,
      type: "multiple_choice",
      question: `ECG Question ${i + 1}: Which statement is most accurate?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 1,
      explanation: "This answer is correct based on ECG principles.",
      difficulty: difficulty,
      category: "General ECG",
      points: 1,
      timeLimit: 60
    })),
    scoring: {
      totalPoints: Math.min(questionCount, 5),
      passingScore: 70,
      gradeRanges: {
        "A": "90-100", "B": "80-89", "C": "70-79", "D": "60-69", "F": "0-59"
      }
    }
  };
}

function generateFallbackAnalysis(performanceData) {
  return {
    overallScore: performanceData?.score || 75,
    strengths: ["General Knowledge"],
    weaknesses: ["ECG Basics"],
    improvementAreas: ["Practice more ECG interpretation"],
    recommendations: [
      {
        area: "ECG Basics",
        action: "Review fundamental concepts",
        priority: "high"
      }
    ],
    learningPath: {
      nextSteps: ["Review basic ECG concepts"],
      suggestedModules: ["ECG Fundamentals"],
      practiceAreas: ["Basic interpretation"]
    }
  };
}

function generateFallbackStrategy() {
  return {
    recommendedDifficulty: "intermediate",
    questionTypes: ["multiple_choice"],
    focusAreas: ["ECG Basics"],
    questionCount: 8,
    timeLimit: 20,
    adaptiveFeatures: ["personalized_feedback"],
    learningObjectives: ["Master ECG interpretation"],
    studyPlan: {
      duration: "2 weeks",
      modules: ["ECG Fundamentals"],
      practiceSchedule: "daily"
    }
  };
}

