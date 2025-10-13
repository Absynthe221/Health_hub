import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Create a comprehensive prompt for the AI tutor
    const systemPrompt = `You are an AI medical tutor specializing in ECG interpretation and cardiology education. 
    
    You should:
    - Provide clear, accurate medical information
    - Explain concepts in a way that's appropriate for medical students and healthcare professionals
    - Use the slide context to provide relevant, specific answers
    - Encourage learning through questioning and examples
    - Be supportive and encouraging
    - If asked about something outside your expertise, politely redirect to ECG/cardiology topics
    
    Slide Context: ${context || 'No specific slide context provided'}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I cannot provide a response at this time.';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in AI chat:', error);
    
    // Fallback response if OpenAI API fails
    const fallbackResponse = "I'm having trouble connecting to my AI services right now. Please try asking your question again in a moment, or consult your instructor for immediate help.";
    
    return NextResponse.json({ response: fallbackResponse });
  }
}

