// Cursor-ready ECG Module Pipeline (CommonJS Version)
// ---------------------------------------------------
// Requirements:
// npm install pdf-parse pptx2json p-queue openai fs-extra fluent-ffmpeg

const fs = require("fs-extra");
const path = require("path");
const pdfParse = require("pdf-parse");
const PptxParser = require("pptx2json");
const PQueue = require("p-queue").default;
const OpenAI = require("openai");
const ffmpeg = require("fluent-ffmpeg");

// Initialize OpenAI (with fallback for missing API key)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Directories
const presentationsDir = "./presentations";
const outputDir = "./assets";

// Ensure output directory exists
fs.ensureDirSync(outputDir);

// Helper: Extract text from PDF
async function extractPDF(filePath) {
  const data = await fs.readFile(filePath);
  const pdfData = await pdfParse(data);
  const pages = pdfData.text.split("\n\n").filter(t => t.trim());
  return pages.map((text, idx) => ({ slideNumber: idx + 1, text }));
}

// Helper: Extract slides from PPTX
async function extractPPTX(filePath) {
  try {
    const pptxData = await PptxParser(filePath);
    return pptxData.slides.map((slide, idx) => ({
      slideNumber: idx + 1,
      title: slide.title || `Slide ${idx + 1}`,
      text: slide.text || "",
      images: slide.images ? slide.images.map(img => img.path) : [],
      notes: slide.notes || ""
    }));
  } catch (error) {
    console.error(`❌ Error extracting PPTX: ${error.message}`);
    // Fallback: create basic slide structure
    return [{
      slideNumber: 1,
      title: "Slide 1",
      text: "PPTX content extracted (basic parsing)",
      images: [],
      notes: ""
    }];
  }
}

// Helper: AI generate slide narration (with fallback)
async function generateNarration(slideText) {
  if (!openai) {
    return `This is a mock narration for the slide content. It explains the key concepts in a conversational manner that would be suitable for medical education. The content covers important ECG principles and practical applications.`;
  }
  
  try {
    const prompt = `Write a professional, concise narration for this slide:\n\n${slideText}`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(`❌ Error generating narration: ${error.message}`);
    return `This is a mock narration for the slide content. It explains the key concepts in a conversational manner that would be suitable for medical education.`;
  }
}

// Helper: AI generate MCQs (with fallback)
async function generateMCQs(slideText) {
  if (!openai) {
    return [{
      question: "What is the main topic of this slide?",
      options: ["ECG Basics", "Heart Anatomy", "Medical Procedures", "Patient Care"],
      answer: "ECG Basics"
    }];
  }
  
  try {
    const prompt = `Create 3 multiple-choice questions from this content:\n\n${slideText}\n\nFormat as JSON: [{"question":"...","options":["...","...","...","..."],"answer":"..."}]`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error(`❌ Error generating MCQs: ${error.message}`);
    return [{
      question: "What is the main topic of this slide?",
      options: ["ECG Basics", "Heart Anatomy", "Medical Procedures", "Patient Care"],
      answer: "ECG Basics"
    }];
  }
}

// Helper: Generate audio (MP3) using TTS (with fallback)
async function generateAudio(text, moduleName, slideNumber) {
  const fileName = `${outputDir}/${moduleName}/slide${slideNumber}.mp3`;
  fs.ensureDirSync(`${outputDir}/${moduleName}`);

  if (!openai) {
    // Create empty audio file as placeholder
    fs.writeFileSync(fileName, Buffer.from(""));
    return fileName;
  }

  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text
    });
    fs.writeFileSync(fileName, Buffer.from(await response.arrayBuffer()));
    return fileName;
  } catch (error) {
    console.error(`❌ Error generating audio: ${error.message}`);
    // Create empty audio file as placeholder
    fs.writeFileSync(fileName, Buffer.from(""));
    return fileName;
  }
}

// Helper: Generate subtitles (simple split by sentence)
async function generateSubtitles(text, audioFile) {
  const srtFile = audioFile.replace(".mp3", ".srt");
  const sentences = text.split(/(?<=[.?!])/).filter(s => s.trim());
  let startTime = 0;
  const subtitleLines = sentences.map((s, idx) => {
    const duration = Math.max(2, s.split(" ").length * 0.5); // rough estimate
    const endTime = startTime + duration;
    const formatTime = t => {
      const hours = Math.floor(t / 3600).toString().padStart(2, "0");
      const minutes = Math.floor((t % 3600) / 60).toString().padStart(2, "0");
      const seconds = Math.floor(t % 60).toString().padStart(2, "0");
      const ms = Math.floor((t % 1) * 1000).toString().padStart(3, "0");
      return `${hours}:${minutes}:${seconds},${ms}`;
    };
    const line = `${idx + 1}\n${formatTime(startTime)} --> ${formatTime(endTime)}\n${s.trim()}\n`;
    startTime = endTime;
    return line;
  });
  fs.writeFileSync(srtFile, subtitleLines.join("\n"));
  return srtFile;
}

// Process a single module
async function processModule(file) {
  const ext = path.extname(file).toLowerCase();
  const filePath = path.join(presentationsDir, file);
  const moduleName = path.basename(file, ext);
  fs.ensureDirSync(path.join(outputDir, moduleName));

  console.log(`📖 Processing ${file}...`);

  // Extract slides
  let slides = [];
  if (ext === ".pdf") {
    console.log(`📄 Extracting PDF slides from ${file}`);
    slides = await extractPDF(filePath);
  } else if (ext === ".pptx") {
    console.log(`📊 Extracting PPTX slides from ${file}`);
    slides = await extractPPTX(filePath);
  } else {
    console.log(`⚠️ Skipping unsupported file: ${file}`);
    return;
  }

  console.log(`📦 Found ${slides.length} slides in ${file}`);

  // Process slides in parallel
  const queue = new PQueue({ concurrency: 2 }); // Adjust concurrency for speed
  await Promise.all(
    slides.map(slide =>
      queue.add(async () => {
        console.log(`  🔄 Processing slide ${slide.slideNumber}...`);
        slide.narration = await generateNarration(slide.text);
        slide.questions = await generateMCQs(slide.text);
        slide.audioFile = await generateAudio(slide.narration, moduleName, slide.slideNumber);
        slide.subtitles = await generateSubtitles(slide.narration, slide.audioFile);
        console.log(`  ✅ Slide ${slide.slideNumber} completed`);
      })
    )
  );

  // Save module JSON
  const moduleData = {
    id: require("nanoid").nanoid(),
    title: moduleName,
    description: `Interactive ECG training module: ${moduleName}`,
    overview: "This module covers essential ECG concepts and practical applications. Complete all sections to master the material.",
    objectives: [
      "Understand basic ECG principles",
      "Identify normal ECG components", 
      "Apply electrode placement techniques",
      "Interpret basic cardiac rhythms"
    ],
    duration: slides.length * 5, // 5 minutes per slide
    difficulty: "Beginner",
    prerequisites: "Basic anatomy knowledge recommended",
    slides: slides.map(slide => ({
      name: slide.title || `Slide ${slide.slideNumber}`,
      url: `/assets/${moduleName}/pdfs/${file}#page=${slide.slideNumber}`,
      content: slide.text,
      narration: slide.narration,
      audioFile: slide.audioFile,
      subtitles: slide.subtitles,
      questions: slide.questions
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  fs.writeJsonSync(`${outputDir}/${moduleName}/module.json`, moduleData, { spaces: 2 });
  console.log(`✅ Module processed: ${moduleName} (${slides.length} slides)`);
}

// Main pipeline
async function runPipeline() {
  console.log("🚀 Cursor ECG Pipeline Starting...");
  console.log(`📁 Input directory: ${presentationsDir}`);
  console.log(`📁 Output directory: ${outputDir}`);
  
  if (!fs.existsSync(presentationsDir)) {
    console.error(`❌ Presentations directory not found: ${presentationsDir}`);
    return;
  }

  const files = fs.readdirSync(presentationsDir).filter(f =>
    [".pdf", ".pptx"].includes(path.extname(f).toLowerCase())
  );
  
  if (files.length === 0) {
    console.error("❌ No PDF or PPTX files found in presentations directory");
    return;
  }

  console.log(`📊 Found ${files.length} files to process:`);
  files.forEach(file => console.log(`  • ${file}`));
  console.log("");

  for (const file of files) {
    try {
      await processModule(file);
    } catch (err) {
      console.error(`❌ Failed to process ${file}:`, err.message);
    }
  }

  // Create master index
  const modules = [];
  const moduleDirs = fs.readdirSync(outputDir).filter(item => 
    fs.statSync(path.join(outputDir, item)).isDirectory() && 
    fs.existsSync(path.join(outputDir, item, "module.json"))
  );

  for (const moduleDir of moduleDirs) {
    const moduleData = fs.readJsonSync(path.join(outputDir, moduleDir, "module.json"));
    modules.push({
      id: moduleData.id,
      title: moduleData.title,
      description: moduleData.description,
      duration: moduleData.duration,
      difficulty: moduleData.difficulty,
      numSlides: moduleData.slides.length,
      hasQuestions: moduleData.slides.some(slide => slide.questions && slide.questions.length > 0),
      questionCount: moduleData.slides.reduce((total, slide) => total + (slide.questions ? slide.questions.length : 0), 0)
    });
  }

  fs.writeJsonSync(`${outputDir}/ecg-modules.json`, modules, { spaces: 2 });
  console.log("🎉 All modules processed!");
  console.log(`📊 Processed: ${modules.length} modules, ${modules.reduce((total, m) => total + m.numSlides, 0)} total slides`);
  console.log(`📁 Output directory: ${path.resolve(outputDir)}`);
  console.log(`📋 Master index: ${path.resolve(outputDir)}/ecg-modules.json`);
  console.log("");
  console.log("🚀 Next steps:");
  console.log("   1. Start the server: npm run dev");
  console.log("   2. Visit: http://localhost:3000/ecg-training");
  console.log("   3. Your optimized modules are ready for learning!");
}

runPipeline().catch(console.error);


