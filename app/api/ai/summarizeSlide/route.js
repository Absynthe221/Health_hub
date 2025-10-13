import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { slideContent, moduleContext, summaryType = 'brief' } = await request.json();

    if (!slideContent) {
      return NextResponse.json({ error: 'Slide content is required' }, { status: 400 });
    }

    const systemPrompt = `You are a medical education expert specializing in ECG interpretation and cardiology. 
    
    Generate a concise summary of the provided slide content for educational purposes.
    
    Requirements:
    - Create a ${summaryType} summary (brief: 1-2 sentences, detailed: 3-4 sentences)
    - Focus on key learning objectives and main concepts
    - Use clear, accessible medical language appropriate for healthcare students
    - Highlight the most important takeaway points
    - Maintain accuracy and clinical relevance
    - If the slide contains technical content, explain it in practical terms
    
    Return the summary in JSON format:
    {
      "summary": "Your summary text here",
      "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
      "learningObjectives": ["Objective 1", "Objective 2"],
      "difficulty": "basic|intermediate|advanced",
      "estimatedReadTime": "X minutes"
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
          content: `Generate a ${summaryType} summary for the slide content provided.`
        }
      ],
      max_tokens: 500,
      temperature: 0.6,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    
    // Parse and validate the JSON response
    let summaryData;
    try {
      summaryData = JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback summary
      summaryData = {
        summary: "This slide covers important ECG concepts and should be studied carefully for understanding cardiac interpretation.",
        keyPoints: [
          "Key concepts from the slide content",
          "Important clinical applications",
          "Practical learning points"
        ],
        learningObjectives: [
          "Understand the main concepts presented",
          "Apply knowledge to clinical scenarios"
        ],
        difficulty: "intermediate",
        estimatedReadTime: "2 minutes"
      };
    }

    // Validate required fields
    if (!summaryData.summary) {
      summaryData.summary = "This slide contains important ECG learning content that requires careful study.";
    }
    
    if (!summaryData.keyPoints || !Array.isArray(summaryData.keyPoints)) {
      summaryData.keyPoints = ["Key learning concepts from the slide"];
    }
    
    if (!summaryData.learningObjectives || !Array.isArray(summaryData.learningObjectives)) {
      summaryData.learningObjectives = ["Master the concepts presented in this slide"];
    }
    
    if (!summaryData.difficulty) {
      summaryData.difficulty = "intermediate";
    }
    
    if (!summaryData.estimatedReadTime) {
      summaryData.estimatedReadTime = "2 minutes";
    }

    return NextResponse.json({
      success: true,
      ...summaryData,
      metadata: {
        generatedAt: new Date().toISOString(),
        summaryType,
        wordCount: summaryData.summary.split(' ').length
      }
    });

  } catch (error) {
    console.error('Error generating slide summary:', error);
    
    // Fallback response
    const fallbackSummary = {
      summary: "This slide covers important ECG concepts and should be studied carefully for understanding cardiac interpretation.",
      keyPoints: [
        "Key concepts from the slide content",
        "Important clinical applications", 
        "Practical learning points"
      ],
      learningObjectives: [
        "Understand the main concepts presented",
        "Apply knowledge to clinical scenarios"
      ],
      difficulty: "intermediate",
      estimatedReadTime: "2 minutes",
      metadata: {
        generatedAt: new Date().toISOString(),
        summaryType: 'fallback',
        wordCount: 18
      }
    };

    return NextResponse.json({
      success: false,
      error: 'Failed to generate slide summary',
      ...fallbackSummary
    });
  }
}

