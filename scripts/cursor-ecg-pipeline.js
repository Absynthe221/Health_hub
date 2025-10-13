// Cursor-ready ECG Module Pipeline
// ---------------------------------
// Requirements:
// npm install pdf-parse pptx2json p-queue openai fs-extra fluent-ffmpeg

import fs from "fs-extra";
import path from "path";
import pdfParse from "pdf-parse";
import PptxParser from "pptx2json";
import PQueue from "p-queue";
import OpenAI from "openai";
import ffmpeg from "fluent-ffmpeg";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
  const pptxData = await PptxParser(filePath);
  return pptxData.slides.map((slide, idx) => ({
    slideNumber: idx + 1,
    title: slide.title || `Slide ${idx + 1}`,
    text: slide.text || "",
    images: slide.images.map(img => img.path) || [],
    notes: slide.notes || ""
  }));
}

// Helper: AI generate slide narration
async function generateNarration(slideText) {
  const prompt = `Write a professional, concise narration for this slide:\n\n${slideText}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });
  return response.choices[0].message.content.trim();
}

// Helper: AI generate MCQs
async function generateMCQs(slideText) {
  const prompt = `Create 3 multiple-choice questions from this content:\n\n${slideText}\n\nFormat as JSON: [{question, options, answer}]`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });
  try {
    return JSON.parse(response.choices[0].message.content);
  } catch {
    return [];
  }
}

// Helper: Generate audio (MP3) using TTS
async function generateAudio(text, moduleName, slideNumber) {
  const fileName = `${outputDir}/${moduleName}/slide${slideNumber}.mp3`;
  fs.ensureDirSync(`${outputDir}/${moduleName}`);

  // Using OpenAI TTS (example)
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text
  });

  fs.writeFileSync(fileName, Buffer.from(await response.arrayBuffer()));
  return fileName;
}

// Helper: Generate subtitles (simple split by sentence)
async function generateSubtitles(text, audioFile) {
  const srtFile = audioFile.replace(".mp3", ".srt");
  const sentences = text.split(/(?<=[.?!])/).filter(s => s.trim());
  let startTime = 0;
  const subtitleLines = sentences.map((s, idx) => {
    const duration = Math.max(2, s.split(" ").length * 0.5); // rough estimate
    const endTime = startTime + duration;
    const formatTime = t =>
      new Date(t * 1000).toISOString().substr(11, 8) + ",000";
    const line = `${idx + 1}\n${formatTime(startTime)} --> ${formatTime(
      endTime
    )}\n${s.trim()}\n`;
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

  // Extract slides
  let slides = [];
  if (ext === ".pdf") slides = await extractPDF(filePath);
  else if (ext === ".pptx") slides = await extractPPTX(filePath);
  else return;

  // Process slides in parallel
  const queue = new PQueue({ concurrency: 2 }); // Adjust concurrency for speed
  await Promise.all(
    slides.map(slide =>
      queue.add(async () => {
        slide.narration = await generateNarration(slide.text);
        slide.questions = await generateMCQs(slide.text);
        slide.audioFile = await generateAudio(slide.narration, moduleName, slide.slideNumber);
        slide.subtitles = await generateSubtitles(slide.narration, slide.audioFile);
      })
    )
  );

  // Save module JSON
  fs.writeJsonSync(`${outputDir}/${moduleName}/module.json`, { slides }, { spaces: 2 });
  console.log(`✅ Module processed: ${moduleName}`);
}

// Main pipeline
async function runPipeline() {
  const files = fs.readdirSync(presentationsDir).filter(f =>
    [".pdf", ".pptx"].includes(path.extname(f).toLowerCase())
  );
  console.log("Files detected:", files);

  for (const file of files) {
    try {
      await processModule(file);
    } catch (err) {
      console.error(`❌ Failed to process ${file}:`, err.message);
    }
  }

  console.log("🎉 All modules processed!");
}

runPipeline();


