import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { 
      moduleContent, 
      userPerformance,
      previousQuizResults,
      learningGoals,
      preferredDifficulty = 'adaptive'
    } = await request.json();

    if (!moduleContent) {
      return NextResponse.json({ error: 'Module content is required' }, { status: 400 });
    }

    // Analyze user performance to determine adaptive parameters
    const performanceAnalysis = analyzeUserPerformance(userPerformance, previousQuizResults);
    
    const systemPrompt = `You are an AI tutor specializing in adaptive ECG education. Based on the user's performance data, generate personalized quiz questions.

    User Performance Analysis:
    - Overall Performance: ${performanceAnalysis.overallScore}%
    - Weak Areas: ${performanceAnalysis.weakAreas.join(', ')}
    - Strong Areas: ${performanceAnalysis.strongAreas.join(', ')}
    - Recommended Difficulty: ${performanceAnalysis.recommendedDifficulty}
    - Focus Areas: ${performanceAnalysis.focusAreas.join(', ')}
    
    Learning Goals: ${learningGoals || 'General ECG mastery'}
    
    Generate ${performanceAnalysis.questionCount} adaptive quiz questions that:
    - Target the user's weak areas for improvement
    - Reinforce strong areas with challenging questions
    - Gradually increase difficulty based on performance
    - Include immediate feedback and learning opportunities
    - Provide detailed explanations for learning
    
    Return in JSON format:
    {
      "adaptiveQuiz": {
        "questions": [
          {
            "id": 1,
            "question": "Question text",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": 0,
            "explanation": "Detailed explanation",
            "difficulty": "basic|intermediate|advanced",
            "category": "ECG category",
            "targetArea": "specific area being tested",
            "adaptiveReasoning": "Why this question was selected",
            "learningTip": "Additional learning tip"
          }
        ],
        "adaptiveStrategy": {
          "approach": "remediation|reinforcement|progression",
          "focusAreas": ["area1", "area2"],
          "difficultyProgression": "description of progression strategy"
        },
        "personalizedFeedback": {
          "strengths": ["strength1", "strength2"],
          "improvements": ["improvement1", "improvement2"],
          "recommendations": ["recommendation1", "recommendation2"]
        }
      }
    }
    
    Module Content: ${JSON.stringify(moduleContent)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Generate an adaptive quiz based on the user's performance data and learning goals.`
        }
      ],
      max_tokens: 4000,
      temperature: 0.6,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    
    // Parse and validate the JSON response
    let adaptiveQuiz;
    try {
      adaptiveQuiz = JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      adaptiveQuiz = generateFallbackAdaptiveQuiz(moduleContent, performanceAnalysis);
    }

    // Validate the structure
    if (!adaptiveQuiz.adaptiveQuiz) {
      adaptiveQuiz = generateFallbackAdaptiveQuiz(moduleContent, performanceAnalysis);
    }

    return NextResponse.json({
      success: true,
      adaptiveQuiz: adaptiveQuiz.adaptiveQuiz,
      performanceAnalysis: performanceAnalysis,
      metadata: {
        questionCount: adaptiveQuiz.adaptiveQuiz?.questions?.length || 0,
        adaptiveStrategy: adaptiveQuiz.adaptiveQuiz?.adaptiveStrategy?.approach || 'balanced',
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating adaptive quiz:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate adaptive quiz',
      adaptiveQuiz: generateFallbackAdaptiveQuiz({}, { recommendedDifficulty: 'intermediate', questionCount: 5 }),
      performanceAnalysis: { overallScore: 70, recommendedDifficulty: 'intermediate' },
      metadata: {
        questionCount: 5,
        adaptiveStrategy: 'fallback',
        generatedAt: new Date().toISOString()
      }
    });
  }
}

function analyzeUserPerformance(userPerformance, previousQuizResults) {
  // Default analysis if no performance data
  if (!userPerformance && !previousQuizResults) {
    return {
      overallScore: 75,
      weakAreas: ['ECG Basics', 'Rhythm Analysis'],
      strongAreas: ['Anatomy'],
      recommendedDifficulty: 'intermediate',
      focusAreas: ['ECG Basics', 'Clinical Application'],
      questionCount: 8
    };
  }

  // Calculate overall performance
  const scores = previousQuizResults?.map(result => result.score) || [userPerformance?.score] || [75];
  const overallScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  // Determine weak and strong areas
  const weakAreas = [];
  const strongAreas = [];
  
  if (userPerformance?.categoryScores) {
    Object.entries(userPerformance.categoryScores).forEach(([category, score]) => {
      if (score < 70) {
        weakAreas.push(category);
      } else if (score > 85) {
        strongAreas.push(category);
      }
    });
  }

  // Determine recommended difficulty
  let recommendedDifficulty = 'intermediate';
  if (overallScore < 60) {
    recommendedDifficulty = 'basic';
  } else if (overallScore > 85) {
    recommendedDifficulty = 'advanced';
  }

  // Calculate question count based on performance
  let questionCount = 8;
  if (overallScore < 70) {
    questionCount = 10; // More questions for struggling students
  } else if (overallScore > 90) {
    questionCount = 6; // Fewer, more challenging questions
  }

  return {
    overallScore: Math.round(overallScore),
    weakAreas: weakAreas.length > 0 ? weakAreas : ['ECG Basics'],
    strongAreas: strongAreas.length > 0 ? strongAreas : ['General Knowledge'],
    recommendedDifficulty,
    focusAreas: [...weakAreas, 'Clinical Application'],
    questionCount
  };
}

function generateFallbackAdaptiveQuiz(moduleContent, performanceAnalysis) {
  return {
    adaptiveQuiz: {
      questions: [
        {
          id: 1,
          question: "Based on your performance, which ECG concept needs the most attention?",
          options: [
            "Basic rhythm interpretation",
            "Advanced arrhythmia recognition",
            "Clinical correlation",
            "ECG measurements"
          ],
          correctAnswer: 0,
          explanation: "Focus on strengthening basic concepts before advancing to complex topics.",
          difficulty: performanceAnalysis.recommendedDifficulty,
          category: "ECG Basics",
          targetArea: "Foundation Knowledge",
          adaptiveReasoning: "Targeting areas for improvement based on performance analysis",
          learningTip: "Review basic ECG components and normal patterns"
        }
      ],
      adaptiveStrategy: {
        approach: "remediation",
        focusAreas: performanceAnalysis.focusAreas,
        difficultyProgression: "Gradual increase based on mastery"
      },
      personalizedFeedback: {
        strengths: performanceAnalysis.strongAreas,
        improvements: performanceAnalysis.weakAreas,
        recommendations: ["Focus on weak areas", "Practice regularly", "Review fundamentals"]
      }
    }
  };
}

