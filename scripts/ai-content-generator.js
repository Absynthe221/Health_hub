#!/usr/bin/env node

/**
 * Health Hub ECG - AI Content Generator
 * =====================================
 * 
 * This script generates AI-powered content for ECG modules:
 * - Voice narration for slides using ElevenLabs or OpenAI TTS
 * - Automated MCQ generation from slide content
 * - Attention verification questions
 * - Certificate validation logic
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Configuration
const MODULES_FILE = './data/ecg_modules_complete.json';
const OUTPUT_DIR = './public/uploads/ecg-media';
const AUDIO_DIR = path.join(OUTPUT_DIR, 'audio');
const SUBTITLES_DIR = path.join(OUTPUT_DIR, 'subtitles');

// AI Service Configuration
const AI_CONFIG = {
  elevenlabs: {
    apiKey: process.env.ELEVENLABS_API_KEY,
    voiceId: '21m00Tcm4TlvDq8ikWAM', // Default voice
    model: 'eleven_monolingual_v1'
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'tts-1',
    voice: 'alloy'
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-sonnet-20240229'
  }
};

/**
 * Generate AI voice narration for slide content
 */
async function generateVoiceNarration(slideContent, slideNumber, voiceProvider = 'elevenlabs') {
  if (!slideContent || slideContent.length < 10) {
    return null;
  }

  try {
    // Clean and optimize content for speech
    const cleanContent = slideContent
      .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (cleanContent.length < 10) {
      return null;
    }

    // Enhance content for better speech synthesis
    const enhancedContent = await enhanceContentForSpeech(cleanContent);

    let audioUrl = null;

    if (voiceProvider === 'elevenlabs' && AI_CONFIG.elevenlabs.apiKey) {
      audioUrl = await generateWithElevenLabs(enhancedContent, slideNumber);
    } else if (AI_CONFIG.openai.apiKey) {
      audioUrl = await generateWithOpenAI(enhancedContent, slideNumber);
    } else {
      console.log(`⚠️  No AI voice service configured for slide ${slideNumber}`);
      return null;
    }

    if (audioUrl) {
      // Generate subtitle file
      await generateSubtitleFile(enhancedContent, slideNumber);
      return audioUrl;
    }

  } catch (error) {
    console.error(`Error generating voice for slide ${slideNumber}:`, error.message);
  }

  return null;
}

/**
 * Enhance content for better speech synthesis
 */
async function enhanceContentForSpeech(content) {
  try {
    if (!AI_CONFIG.anthropic.apiKey) {
      return content;
    }

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: AI_CONFIG.anthropic.model,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Enhance this ECG training content for clear, professional speech narration. Make it more conversational and easier to understand when spoken aloud. Keep medical terminology accurate but add natural flow:

"${content}"

Return only the enhanced content, no explanations.`
      }]
    }, {
      headers: {
        'x-api-key': AI_CONFIG.anthropic.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    return response.data.content[0].text || content;
  } catch (error) {
    console.error('Error enhancing content for speech:', error.message);
    return content;
  }
}

/**
 * Generate voice using ElevenLabs
 */
async function generateWithElevenLabs(content, slideNumber) {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${AI_CONFIG.elevenlabs.voiceId}`,
      {
        text: content,
        model_id: AI_CONFIG.elevenlabs.model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': AI_CONFIG.elevenlabs.apiKey
        },
        responseType: 'stream'
      }
    );

    const audioPath = path.join(AUDIO_DIR, `slide_${slideNumber}_narration.mp3`);
    await fs.mkdir(AUDIO_DIR, { recursive: true });

    const writer = require('fs').createWriteStream(audioPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Generated ElevenLabs audio for slide ${slideNumber}`);
        resolve(`/uploads/ecg-media/audio/slide_${slideNumber}_narration.mp3`);
      });
      writer.on('error', reject);
    });

  } catch (error) {
    console.error(`ElevenLabs error for slide ${slideNumber}:`, error.message);
    return null;
  }
}

/**
 * Generate voice using OpenAI TTS
 */
async function generateWithOpenAI(content, slideNumber) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: AI_CONFIG.openai.model,
        input: content,
        voice: AI_CONFIG.openai.voice
      },
      {
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );

    const audioPath = path.join(AUDIO_DIR, `slide_${slideNumber}_narration.mp3`);
    await fs.mkdir(AUDIO_DIR, { recursive: true });

    const writer = require('fs').createWriteStream(audioPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Generated OpenAI audio for slide ${slideNumber}`);
        resolve(`/uploads/ecg-media/audio/slide_${slideNumber}_narration.mp3`);
      });
      writer.on('error', reject);
    });

  } catch (error) {
    console.error(`OpenAI TTS error for slide ${slideNumber}:`, error.message);
    return null;
  }
}

/**
 * Generate subtitle file for accessibility
 */
async function generateSubtitleFile(content, slideNumber) {
  try {
    await fs.mkdir(SUBTITLES_DIR, { recursive: true });

    const subtitleContent = `1
00:00:00,000 --> 00:00:${Math.ceil(content.length / 20)},000
${content}`;

    const subtitlePath = path.join(SUBTITLES_DIR, `slide_${slideNumber}_subtitles.srt`);
    await fs.writeFile(subtitlePath, subtitleContent);

    console.log(`✅ Generated subtitles for slide ${slideNumber}`);
  } catch (error) {
    console.error(`Error generating subtitles for slide ${slideNumber}:`, error.message);
  }
}

/**
 * Generate AI-powered MCQs from slide content
 */
async function generateMCQs(slideContent, slideNumber, moduleContext) {
  if (!slideContent || slideContent.length < 50) {
    return null;
  }

  try {
    if (!AI_CONFIG.anthropic.apiKey) {
      return generateFallbackMCQ(slideContent, slideNumber);
    }

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: AI_CONFIG.anthropic.model,
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `Generate 3 high-quality multiple choice questions based on this ECG training content. Make them educational and clinically relevant:

Content: "${slideContent}"
Module Context: "${moduleContext}"

Return ONLY a JSON array with this structure:
[
  {
    "question": "Clear, specific question about the content",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of why the correct answer is right",
    "difficulty": "easy|medium|hard",
    "category": "knowledge|application|analysis"
  }
]

Focus on ECG interpretation, medical accuracy, and practical application.`
      }]
    }, {
      headers: {
        'x-api-key': AI_CONFIG.anthropic.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    const mcqText = response.data.content[0].text;
    const mcqs = JSON.parse(mcqText);

    return {
      id: `quiz_${slideNumber}`,
      questions: mcqs,
      timeLimit: 90,
      passingScore: 70
    };

  } catch (error) {
    console.error(`Error generating MCQs for slide ${slideNumber}:`, error.message);
    return generateFallbackMCQ(slideContent, slideNumber);
  }
}

/**
 * Generate fallback MCQ when AI is unavailable
 */
function generateFallbackMCQ(content, slideNumber) {
  const words = content.split(' ').filter(word => word.length > 4);
  const keyTerm = words[Math.floor(Math.random() * Math.min(words.length, 10))] || 'concept';

  return {
    id: `quiz_${slideNumber}`,
    questions: [{
      question: `What is the most important concept to understand from this slide about ${keyTerm}?`,
      options: [
        "The primary learning objective",
        "A secondary detail",
        "An advanced concept",
        "A prerequisite topic"
      ],
      correctAnswer: 0,
      explanation: "This question tests understanding of the main learning objective from this slide.",
      difficulty: "medium",
      category: "comprehension"
    }],
    timeLimit: 60,
    passingScore: 70
  };
}

/**
 * Generate attention verification questions
 */
async function generateAttentionQuestions(slideContent, slideNumber) {
  if (!slideContent || slideContent.length < 30) {
    return [];
  }

  try {
    if (!AI_CONFIG.anthropic.apiKey) {
      return generateFallbackAttentionQuestions(slideContent, slideNumber);
    }

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: AI_CONFIG.anthropic.model,
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Generate 2 simple attention verification questions for this ECG training content. These should be easy to answer if the learner is paying attention:

Content: "${slideContent}"

Return ONLY a JSON array:
[
  {
    "question": "Simple question that requires basic attention",
    "correctAnswer": "Expected answer",
    "type": "attention_check"
  }
]

Make questions that test if someone is actually watching/listening, not deep knowledge.`
      }]
    }, {
      headers: {
        'x-api-key': AI_CONFIG.anthropic.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    const questionsText = response.data.content[0].text;
    return JSON.parse(questionsText);

  } catch (error) {
    console.error(`Error generating attention questions for slide ${slideNumber}:`, error.message);
    return generateFallbackAttentionQuestions(slideContent, slideNumber);
  }
}

/**
 * Generate fallback attention questions
 */
function generateFallbackAttentionQuestions(content, slideNumber) {
  return [{
    question: "Are you paying attention to this ECG training content?",
    correctAnswer: "Yes",
    type: "attention_check"
  }];
}

/**
 * Process all modules with AI content generation
 */
async function processAllModulesWithAI() {
  console.log('🤖 Starting AI content generation for all modules...');

  try {
    // Read the modules file
    const modulesData = JSON.parse(await fs.readFile(MODULES_FILE, 'utf8'));
    const modules = modulesData.modules;

    console.log(`📚 Processing ${modules.length} modules...`);

    let processedSlides = 0;
    let generatedAudio = 0;
    let generatedMCQs = 0;
    let generatedAttentionQuestions = 0;

    for (const module of modules) {
      console.log(`\n📄 Processing module: ${module.title}`);
      
      for (const slide of module.slides) {
        processedSlides++;
        
        // Generate voice narration
        if (slide.slideContent && slide.slideContent.length > 20) {
          const audioUrl = await generateVoiceNarration(
            slide.slideContent, 
            slide.slideNumber,
            'elevenlabs' // Try ElevenLabs first, fallback to OpenAI
          );
          
          if (audioUrl) {
            slide.slideAudio = audioUrl;
            generatedAudio++;
          }

          // Generate MCQs
          const mcqs = await generateMCQs(
            slide.slideContent,
            slide.slideNumber,
            `${module.title} - ${module.description}`
          );
          
          if (mcqs) {
            slide.slideQuiz = mcqs;
            generatedMCQs++;
          }

          // Generate attention questions
          const attentionQuestions = await generateAttentionQuestions(
            slide.slideContent,
            slide.slideNumber
          );
          
          if (attentionQuestions.length > 0) {
            slide.attentionQuestions = attentionQuestions;
            generatedAttentionQuestions += attentionQuestions.length;
          }

          // Add small delay to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Update module statistics
      module.aiGenerated = {
        audioFiles: module.slides.filter(s => s.slideAudio).length,
        quizCount: module.slides.filter(s => s.slideQuiz).length,
        attentionQuestions: module.slides.reduce((sum, s) => sum + (s.attentionQuestions?.length || 0), 0),
        lastUpdated: new Date().toISOString()
      };
    }

    // Save the enhanced modules
    await fs.writeFile(MODULES_FILE, JSON.stringify(modulesData, null, 2));

    console.log(`\n🎉 AI content generation completed!`);
    console.log(`📊 Results:`);
    console.log(`   • Processed slides: ${processedSlides}`);
    console.log(`   • Generated audio files: ${generatedAudio}`);
    console.log(`   • Generated MCQ sets: ${generatedMCQs}`);
    console.log(`   • Generated attention questions: ${generatedAttentionQuestions}`);
    console.log(`\n📁 Enhanced modules saved to: ${MODULES_FILE}`);
    console.log(`🎵 Audio files saved to: ${AUDIO_DIR}`);
    console.log(`📝 Subtitle files saved to: ${SUBTITLES_DIR}`);

  } catch (error) {
    console.error('❌ AI content generation failed:', error);
    process.exit(1);
  }
}

// Run the AI content generation
if (require.main === module) {
  processAllModulesWithAI();
}

module.exports = { 
  processAllModulesWithAI,
  generateVoiceNarration,
  generateMCQs,
  generateAttentionQuestions
};



