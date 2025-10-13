import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { slideContent, moduleContext, questionCount = 10 } = await request.json();

    if (!slideContent) {
      return NextResponse.json({ error: 'Slide content is required' }, { status: 400 });
    }

    // Validate question count
    const validQuestionCount = Math.min(Math.max(parseInt(questionCount), 5), 25);

    const systemPrompt = `You are a medical education expert specializing in ECG interpretation and cardiology. 
    
    Generate ${validQuestionCount} high-quality quiz questions based on the provided slide content.
    
    Requirements:
    - Questions should test understanding, not just memorization
    - Include a mix of difficulty levels (basic, intermediate, advanced)
    - Focus on clinical application and practical knowledge
    - Use clear, unambiguous language
    - Provide 4 multiple choice options per question
    - Ensure only one correct answer per question
    - Include brief explanations for each correct answer
    
    Return the questions in JSON format with this structure:
    {
      "questions": [
        {
          "id": 1,
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Brief explanation of why this answer is correct",
          "difficulty": "basic|intermediate|advanced",
          "category": "Category like 'ECG Basics', 'Arrhythmias', etc."
        }
      ]
    }
    
    Slide Content: ${JSON.stringify(slideContent)}
    Module Context: ${moduleContext || 'General ECG module'}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Generate ${validQuestionCount} quiz questions for the slide content provided.`
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    
    // Parse and validate the JSON response
    let questions;
    try {
      questions = JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback: generate a basic question structure
      questions = {
        questions: [
          {
            id: 1,
            question: "Based on the slide content, which statement is most accurate?",
            options: [
              "Option A - Basic concept from slide",
              "Option B - Correct answer based on content", 
              "Option C - Related but incorrect concept",
              "Option D - Unrelated concept"
            ],
            correctAnswer: 1,
            explanation: "This answer is correct based on the slide content provided.",
            difficulty: "intermediate",
            category: "General"
          }
        ]
      };
    }

    // Validate the structure
    if (!questions.questions || !Array.isArray(questions.questions)) {
      questions = {
        questions: [
          {
            id: 1,
            question: "Based on the slide content, which statement is most accurate?",
            options: [
              "Option A - Basic concept from slide",
              "Option B - Correct answer based on content", 
              "Option C - Related but incorrect concept",
              "Option D - Unrelated concept"
            ],
            correctAnswer: 1,
            explanation: "This answer is correct based on the slide content provided.",
            difficulty: "intermediate",
            category: "General"
          }
        ]
      };
    }

    return NextResponse.json({
      success: true,
      questions: questions.questions,
      metadata: {
        totalQuestions: questions.questions.length,
        difficultyDistribution: getDifficultyDistribution(questions.questions),
        categories: getUniqueCategories(questions.questions)
      }
    });

  } catch (error) {
    console.error('Error generating quiz:', error);
    
    // Fallback response
    const fallbackQuestions = [
      {
        id: 1,
        question: "Based on the slide content, which statement is most accurate?",
        options: [
          "Option A - Basic concept from slide",
          "Option B - Correct answer based on content", 
          "Option C - Related but incorrect concept",
          "Option D - Unrelated concept"
        ],
        correctAnswer: 1,
        explanation: "This answer is correct based on the slide content provided.",
        difficulty: "intermediate",
        category: "General"
      }
    ];

    return NextResponse.json({
      success: false,
      error: 'Failed to generate quiz questions',
      questions: fallbackQuestions,
      metadata: {
        totalQuestions: fallbackQuestions.length,
        difficultyDistribution: { intermediate: 1 },
        categories: ["General"]
      }
    });
  }
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
