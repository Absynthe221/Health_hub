/**
 * Cursor-ready One-Click ECG Training Module Generator (Optimized)
 * ---------------------------------------------------------------
 * Features:
 * 1. Parallel processing for slide-level AI tasks (narration, MCQs, audio, subtitles)
 * 2. CLI progress bar
 * 3. Drop PDFs → full module output
 * 4. No canvas dependency - uses simpler image handling
 */

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const pptx2json = require("pptx2json");
const { nanoid } = require("nanoid");
const PQueue = require("p-queue").default;
const cliProgress = require("cli-progress");

// Mock OpenAI client for demo (replace with real OpenAI client)
const mockOpenAI = {
  chat: {
    completions: {
      create: async ({ messages }) => {
        // Mock response for demo purposes
        const content = messages[0].content;
        if (content.includes("narration")) {
          return {
            choices: [{
              message: {
                content: `This is a mock narration for the slide content. It explains the key concepts in a conversational manner that would be suitable for medical education. The content covers important ECG principles and practical applications.`
              }
            }]
          };
        } else if (content.includes("MCQ")) {
          return {
            choices: [{
              message: {
                content: `[{"question":"What is the normal heart rate range for adults?","options":["60-100 bpm","40-80 bpm","80-120 bpm","100-140 bpm"],"answer":"60-100 bpm"}]`
              }
            }]
          };
        }
        return { choices: [{ message: { content: "Mock response" } }] };
      }
    }
  },
  audio: {
    speech: {
      create: async ({ input }) => {
        // Mock audio generation
        return {
          arrayBuffer: async () => Buffer.from("mock audio data")
        };
      }
    }
  }
};

// Uncomment and configure for real OpenAI usage:
// const OpenAI = require("openai");
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Utilities ---
const cleanText = (txt) => txt.replace(/\s+/g, " ").trim();
const estimateDuration = (text, wpm = 150) => Math.round((text.split(/\s+/).length / wpm) * 60);

// --- AI Functions ---
async function generateNarration(text, slideNumber, moduleTitle) {
  const prompt = `
You are a medical educator. Generate a conversational narration script
for Slide ${slideNumber} of "${moduleTitle}". 
Make it clear, full sentences, ~1-2 minutes long.
Slide Content:
${text}
`;
  const res = await mockOpenAI.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
  });
  return res.choices[0].message.content.trim();
}

async function generateMCQs(text, slideNumber, moduleTitle) {
  const prompt = `
You are an ECG educator. Generate 1 multiple-choice question for Slide ${slideNumber} of "${moduleTitle}".
Provide 1 correct answer and 3 plausible distractors. Return JSON:
[
  {"question":"...","options":["...","...","...","..."],"answer":"..."}
]
Slide Content:
${text}
`;
  const res = await mockOpenAI.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
  });
  try { 
    return JSON.parse(res.choices[0].message.content); 
  } catch (e) { 
    console.error(`❌ Slide ${slideNumber} MCQ parse error`, e); 
    return []; 
  }
}

// --- TTS ---
async function generateAudio(narration, moduleDir, slideNumber, format = "mp3") {
  const audioFile = `slide${slideNumber}.${format}`;
  const audioPath = path.join(moduleDir, audioFile);
  const res = await mockOpenAI.audio.speech.create({ 
    input: narration, 
    format 
  });
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(audioPath, buffer);
  return audioFile;
}

// --- Subtitles ---
function generateSubtitles(narration, duration) {
  const words = narration.split(/\s+/);
  const totalWords = words.length;
  const timePerWord = duration / totalWords;
  let srt = "", counter = 1, start = 0, index = 0;

  const formatTime = (s) => {
    const hr = Math.floor(s / 3600).toString().padStart(2, "0");
    const min = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    const ms = Math.floor((s % 1) * 1000).toString().padStart(3, "0");
    return `${hr}:${min}:${sec},${ms}`;
  };

  while(index < totalWords) {
    const chunk = words.slice(index, index + 12);
    const end = start + chunk.length * timePerWord;
    srt += `${counter}\n${formatTime(start)} --> ${formatTime(end)}\n${chunk.join(" ")}\n\n`;
    start = end; 
    index += chunk.length; 
    counter++;
  }

  return { 
    srt, 
    vtt: "WEBVTT\n\n" + srt.replace(/,/g, ".") 
  };
}

// --- PPTX Extraction ---
async function extractPPTXSlides(pptxPath) {
  try {
    const pptxData = await pptx2json.parse(pptxPath);
    const slides = [];
    
    if (pptxData.slides && pptxData.slides.length > 0) {
      pptxData.slides.forEach((slide, index) => {
        let slideText = '';
        
        // Extract text from slide content
        if (slide.content) {
          slide.content.forEach(content => {
            if (content.text) {
              slideText += content.text + ' ';
            }
          });
        }
        
        // Extract text from shapes
        if (slide.shapes) {
          slide.shapes.forEach(shape => {
            if (shape.text) {
              slideText += shape.text + ' ';
            }
          });
        }
        
        const cleanedText = cleanText(slideText);
        if (cleanedText.length > 10) {
          slides.push({
            slideNumber: index + 1,
            text: cleanedText,
            image: `slide${index + 1}.png`,
            title: slide.title || `Slide ${index + 1}`,
            notes: slide.notes || ''
          });
        }
      });
    }
    
    return slides;
  } catch (error) {
    console.error(`❌ Error extracting PPTX: ${error.message}`);
    return [];
  }
}

// --- PDF Extraction ---
async function extractPDFSlides(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(dataBuffer);
  
  const rawText = cleanText(pdfData.text);
  const slides = [];
  
  // Split text into slides based on common patterns
  const slidePatterns = [
    /(?:Slide \d+|Page \d+|#+\s|===+)/gi,
    /(?:Learning Objectives|Objectives|Outline|Introduction|Conclusion)/gi
  ];
  
  let slideTexts = [rawText]; // Start with full text
  
  // Try different splitting patterns
  for (const pattern of slidePatterns) {
    const newSlides = [];
    for (const slideText of slideTexts) {
      const parts = slideText.split(pattern);
      if (parts.length > 1) {
        newSlides.push(...parts.filter(part => part.trim().length > 50));
      } else {
        newSlides.push(slideText);
      }
    }
    if (newSlides.length > slideTexts.length) {
      slideTexts = newSlides;
      break;
    }
  }
  
  // If no good split found, create artificial slides
  if (slideTexts.length === 1) {
    const words = rawText.split(/\s+/);
    const wordsPerSlide = Math.ceil(words.length / 10); // 10 slides max
    for (let i = 0; i < words.length; i += wordsPerSlide) {
      const slideWords = words.slice(i, i + wordsPerSlide);
      slideTexts.push(slideWords.join(" "));
    }
  }
  
  // Create slide objects
  slideTexts.forEach((text, index) => {
    if (text.trim().length > 50) {
      slides.push({
        slideNumber: index + 1,
        text: text.trim(),
        image: `slide${index + 1}.png`,
        title: `Slide ${index + 1}`,
        notes: ''
      });
    }
  });
  
  return slides;
}

// --- Universal Slide Extraction ---
async function extractSlides(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.pptx') {
    console.log(`📊 Extracting PPTX slides from ${path.basename(filePath)}`);
    return await extractPPTXSlides(filePath);
  } else if (ext === '.pdf') {
    console.log(`📄 Extracting PDF slides from ${path.basename(filePath)}`);
    return await extractPDFSlides(filePath);
  } else {
    throw new Error(`Unsupported file format: ${ext}`);
  }
}

// --- Process a Module (PDF or PPTX) ---
async function parseModule(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const moduleTitle = path.basename(filePath, ext);
  const moduleId = nanoid();
  console.log(`📖 Processing module: ${moduleTitle} (${ext.toUpperCase()})`);

  const moduleDir = path.join(path.dirname(filePath), moduleTitle);
  if (!fs.existsSync(moduleDir)) fs.mkdirSync(moduleDir, { recursive: true });

  const slidesRaw = await extractSlides(filePath);
  const slidesProcessed = [];

  // --- Parallel processing setup ---
  const queue = new PQueue({ concurrency: 3 }); // 3 slides in parallel
  const progressBar = new cliProgress.SingleBar({
    format: 'Processing |{bar}| {percentage}% | {value}/{total} slides | ETA: {eta}s',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });
  
  progressBar.start(slidesRaw.length, 0);

  await Promise.all(slidesRaw.map(slide => queue.add(async () => {
    try {
      const narration = await generateNarration(slide.text, slide.slideNumber, moduleTitle);
      const duration = estimateDuration(narration);
      const questions = await generateMCQs(slide.text, slide.slideNumber, moduleTitle);
      const audioFile = await generateAudio(narration, moduleDir, slide.slideNumber);
      const { srt, vtt } = generateSubtitles(narration, duration);

      // Write subtitle files
      fs.writeFileSync(path.join(moduleDir, `slide${slide.slideNumber}.srt`), srt);
      fs.writeFileSync(path.join(moduleDir, `slide${slide.slideNumber}.vtt`), vtt);

      slidesProcessed.push({
        slideNumber: slide.slideNumber,
        content: slide.text,
        image: slide.image,
        narration,
        duration,
        questions,
        audioFile,
        subtitles: { 
          srtFile: `slide${slide.slideNumber}.srt`, 
          vttFile: `slide${slide.slideNumber}.vtt` 
        }
      });

      progressBar.increment();
    } catch (error) {
      console.error(`❌ Error processing slide ${slide.slideNumber}:`, error.message);
      progressBar.increment();
    }
  })));

  progressBar.stop();
  
  // Create module structure
  const moduleData = {
    id: moduleId,
    title: moduleTitle,
    description: `Interactive ECG training module: ${moduleTitle}`,
    overview: `This module covers essential ECG concepts and practical applications. Complete all sections to master the material.`,
    objectives: [
      "Understand basic ECG principles",
      "Identify normal ECG components", 
      "Apply electrode placement techniques",
      "Interpret basic cardiac rhythms"
    ],
    duration: Math.max(30, Math.ceil(slidesProcessed.length * 2)),
    difficulty: slidesProcessed.length > 15 ? "Intermediate" : "Beginner",
    prerequisites: "Basic anatomy knowledge recommended",
    slides: slidesProcessed.map(slide => ({
      name: `Slide ${slide.slideNumber}`,
      url: `/assets/${moduleTitle}/pdfs/${moduleTitle}.pdf#page=${slide.slideNumber}`,
      content: slide.content,
      narration: slide.narration,
      audioFile: slide.audioFile,
      subtitles: slide.subtitles
    })),
    videos: [], // Will be added manually
    cases: [], // Will be added manually
    pretest: slidesProcessed
      .flatMap(slide => slide.questions)
      .slice(0, Math.ceil(slidesProcessed.length / 2))
      .map((q, index) => ({
        id: `q${index + 1}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.options.indexOf(q.answer),
        explanation: "Review the material to understand the correct answer."
      })),
    posttest: slidesProcessed
      .flatMap(slide => slide.questions)
      .slice(Math.ceil(slidesProcessed.length / 2))
      .map((q, index) => ({
        id: `q${index + 1}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.options.indexOf(q.answer),
        explanation: "Review the material to understand the correct answer."
      }))
  };

  return { moduleData, slidesProcessed };
}

// --- Main ---
async function main() {
  const inputDir = process.argv[2];
  if (!inputDir) { 
    console.error("❌ Usage: node scripts/optimizedECGPipeline.js ./presentations"); 
    process.exit(1); 
  }

  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Directory not found: ${inputDir}`);
    console.error("   Please create the directory and add your PDF or PPTX files");
    process.exit(1);
  }

  const files = fs.readdirSync(inputDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ext === '.pdf' || ext === '.pptx';
  });
  
  if (files.length === 0) {
    console.error(`❌ No PDF or PPTX files found in ${inputDir}`);
    console.error("   Please add PDF or PPTX files to the directory");
    process.exit(1);
  }

  const pdfCount = files.filter(f => f.toLowerCase().endsWith('.pdf')).length;
  const pptxCount = files.filter(f => f.toLowerCase().endsWith('.pptx')).length;
  
  console.log(`🚀 Found ${files.length} files to process:`);
  console.log(`   📄 PDF files: ${pdfCount}`);
  console.log(`   📊 PPTX files: ${pptxCount}`);
  console.log(`⚡ Using parallel processing (3 slides at a time)`);
  
  const assetsDir = path.join(process.cwd(), "assets");
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const modulesIndex = [];
  let totalSlides = 0;

  for (const file of files) {
    console.log(`\n📖 Processing ${file}...`);
    const filePath = path.join(inputDir, file);
    const { moduleData, slidesProcessed } = await parseModule(filePath);

    const moduleDir = path.join(assetsDir, moduleData.title);
    if (!fs.existsSync(moduleDir)) fs.mkdirSync(moduleDir, { recursive: true });
    
    // Create subdirectories
    ['pdfs', 'videos', 'images', 'questions', 'audio', 'subtitles'].forEach(dir => {
      const dirPath = path.join(moduleDir, dir);
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    });

    // Copy file to module directory
    const sourceFile = filePath;
    const destFile = path.join(moduleDir, 'pdfs', file);
    fs.copyFileSync(sourceFile, destFile);

    // Save module data
    fs.writeFileSync(
      path.join(moduleDir, "module.json"), 
      JSON.stringify(moduleData, null, 2)
    );

    modulesIndex.push({
      id: moduleData.id,
      title: moduleData.title,
      description: moduleData.description,
      duration: moduleData.duration,
      difficulty: moduleData.difficulty,
      numSlides: slidesProcessed.length,
      hasQuestions: moduleData.pretest.length > 0 || moduleData.posttest.length > 0,
      questionCount: moduleData.pretest.length + moduleData.posttest.length
    });

    totalSlides += slidesProcessed.length;
    console.log(`📦 Module "${moduleData.title}" saved with ${slidesProcessed.length} slides!`);
  }

  // Update master index
  fs.writeFileSync(
    path.join(assetsDir, "ecg-modules.json"), 
    JSON.stringify(modulesIndex, null, 2)
  );
  
  console.log(`\n🎉 All files processed successfully!`);
  console.log(`📊 Processed: ${files.length} modules, ${totalSlides} total slides`);
  console.log(`📁 Output directory: ${assetsDir}`);
  console.log(`📋 Master index: ${path.join(assetsDir, "ecg-modules.json")}`);
  
  if (files.length > 0) {
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. Start the server: npm run dev`);
    console.log(`   2. Visit: http://localhost:3001/ecg-training (or check terminal for actual port)`);
    console.log(`   3. Your optimized modules are ready for learning!`);
    console.log(`\n💡 Features included:`);
    console.log(`   • Parallel processing for faster generation`);
    console.log(`   • Progress tracking with visual feedback`);
    console.log(`   • Auto-generated narrations and MCQs`);
    console.log(`   • Audio files and subtitles`);
    console.log(`   • Structured module data`);
  }
}

// --- Error handling ---
main().catch(err => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
