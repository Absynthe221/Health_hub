import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { 
      slideContent, 
      moduleContext, 
      questionCount = 10,
      difficulty = 'mixed',
      focusAreas = [],
      includeCaseStudies = false
    } = await request.json();

    if (!slideContent) {
      return NextResponse.json({ error: 'Slide content is required' }, { status: 400 });
    }

    // Validate question count
    const validQuestionCount = Math.min(Math.max(parseInt(questionCount), 5), 25);

    const systemPrompt = `You are a medical education expert specializing in ECG interpretation and cardiology. 
    
    Generate ${validQuestionCount} high-quality quiz questions specifically for ECG learning based on the provided slide content.
    
    Requirements:
    - Questions should test practical ECG interpretation skills
    - Include a mix of difficulty levels based on request: ${difficulty}
    - Focus on clinical application and real-world scenarios
    - Use clear, unambiguous language appropriate for medical students
    - Provide 4 multiple choice options per question
    - Ensure only one correct answer per question
    - Include detailed explanations with clinical context
    - Focus areas to emphasize: ${focusAreas.join(', ') || 'General ECG interpretation'}
    - Include case study questions: ${includeCaseStudies ? 'Yes' : 'No'}
    
    Question Types to Include:
    - ECG pattern recognition
    - Rhythm interpretation
    - Clinical decision making
    - Anatomical correlation
    - Measurement and calculation
    - Differential diagnosis
    
    Return the questions in JSON format with this structure:
    {
      "questions": [
        {
          "id": 1,
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Detailed explanation with clinical context",
          "difficulty": "basic|intermediate|advanced",
          "category": "ECG Basics|Rhythm Analysis|Arrhythmias|Ischemia|Anatomy",
          "clinicalContext": "Brief clinical scenario if applicable",
          "keyLearningPoints": ["Key point 1", "Key point 2"],
          "references": ["Reference if applicable"]
        }
      ]
    }
    
    Slide Content: ${JSON.stringify(slideContent)}
    Module Context: ${moduleContext || 'General ECG module'}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Generate ${validQuestionCount} ECG-focused quiz questions for the slide content provided.`
        }
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    
    // Parse and validate the JSON response
    let questions;
    try {
      questions = JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      questions = generateFallbackQuestions(validQuestionCount, slideContent);
    }

    // Validate the structure
    if (!questions.questions || !Array.isArray(questions.questions)) {
      questions = generateFallbackQuestions(validQuestionCount, slideContent);
    }

    return NextResponse.json({
      success: true,
      questions: questions.questions,
      metadata: {
        totalQuestions: questions.questions.length,
        difficultyDistribution: getDifficultyDistribution(questions.questions),
        categories: getUniqueCategories(questions.questions),
        focusAreas: focusAreas,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating ECG quiz:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate ECG quiz questions',
      questions: generateFallbackQuestions(10, {}),
      metadata: {
        totalQuestions: 1,
        difficultyDistribution: { intermediate: 1 },
        categories: ["General ECG"],
        generatedAt: new Date().toISOString()
      }
    });
  }
}

function generateFallbackQuestions(count, slideContent) {
  const fallbackQuestions = [];
  
  for (let i = 1; i <= Math.min(count, 5); i++) {
    fallbackQuestions.push({
      id: i,
      question: `Based on the ECG content provided, which statement is most accurate regarding ${i === 1 ? 'basic ECG interpretation' : i === 2 ? 'rhythm analysis' : i === 3 ? 'clinical application' : 'advanced concepts'}?`,
      options: [
        "Option A - Basic concept from content",
        "Option B - Correct answer based on ECG principles", 
        "Option C - Related but incorrect concept",
        "Option D - Unrelated medical concept"
      ],
      correctAnswer: 1,
      explanation: "This answer is correct based on ECG interpretation principles and the content provided.",
      difficulty: i <= 2 ? "basic" : i <= 4 ? "intermediate" : "advanced",
      category: i === 1 ? "ECG Basics" : i === 2 ? "Rhythm Analysis" : i === 3 ? "Arrhythmias" : "Clinical Application",
      clinicalContext: "Standard ECG interpretation scenario",
      keyLearningPoints: [
        "Understanding ECG fundamentals",
        "Clinical correlation is essential"
      ],
      references: []
    });
  }

  return { questions: fallbackQuestions };
}

function getDifficultyDistribution(questions) {
  const distribution = { basic: 0, intermediate: 0, advanced: 0 };
  questions.forEach(q => {
    if (q.difficulty && distribution[q.difficulty] !== undefined) {
      distribution[q.difficulty]++;
    }
  });
  return distribution;
}

function getUniqueCategories(questions) {
  const categories = [];
  questions.forEach(q => {
    if (q.category && !categories.includes(q.category)) {
      categories.push(q.category);
    }
  });
  return categories;
}

