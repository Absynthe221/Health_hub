import { NextResponse } from 'next/server';

// This endpoint generates audio from text using browser's Web Speech API
// For production, you can integrate with OpenAI TTS, Google Cloud TTS, or ElevenLabs

export async function POST(request) {
  try {
    const { text, voice = 'default', speed = 1.0, slideId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // In production, integrate with:
    // - OpenAI TTS API
    // - Google Cloud Text-to-Speech
    // - Amazon Polly
    // - ElevenLabs
    // - Microsoft Azure Speech

    // For now, return configuration for client-side generation
    return NextResponse.json({
      success: true,
      audio: {
        slideId,
        method: 'browser-tts', // Will use browser's SpeechSynthesis API
        text: text,
        voice: voice,
        speed: speed,
        language: 'en-GB', // British English for healthcare
        message: 'Audio will be generated in browser using Web Speech API'
      },
      alternatives: {
        openai: {
          endpoint: 'https://api.openai.com/v1/audio/speech',
          model: 'tts-1-hd',
          voice: 'nova', // Options: alloy, echo, fable, onyx, nova, shimmer
          note: 'Requires OPENAI_API_KEY environment variable'
        },
        google: {
          endpoint: 'https://texttospeech.googleapis.com/v1/text:synthesize',
          voice: 'en-GB-Neural2-A',
          note: 'Requires GOOGLE_TTS_API_KEY environment variable'
        },
        elevenlabs: {
          endpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
          voice: 'professional-uk',
          note: 'Requires ELEVENLABS_API_KEY - highest quality'
        }
      },
      info: 'To enable cloud TTS, set API keys in Settings → API Keys'
    });

  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json({ 
      error: 'Failed to generate audio', 
      details: error.message 
    }, { status: 500 });
  }
}

// Get available voices
export async function GET() {
  return NextResponse.json({
    success: true,
    browserVoices: {
      available: true,
      method: 'SpeechSynthesis API',
      voices: [
        { name: 'Google UK English Female', lang: 'en-GB' },
        { name: 'Google UK English Male', lang: 'en-GB' },
        { name: 'Microsoft Hazel - English (Great Britain)', lang: 'en-GB' }
      ],
      note: 'Voices vary by browser and OS'
    },
    cloudOptions: {
      openai: {
        quality: 'High',
        cost: '$0.015 per 1K characters',
        voices: 6,
        languages: 57,
        recommended: true
      },
      google: {
        quality: 'Excellent',
        cost: '$4 per 1M characters (first 1M free monthly)',
        voices: '200+ neural voices',
        languages: 100,
        recommended: true
      },
      elevenlabs: {
        quality: 'Best (Most natural)',
        cost: '$22/month for 30K characters',
        voices: '100+ professional voices',
        customization: 'Voice cloning available',
        recommended: 'For premium experience'
      }
    }
  });
}

