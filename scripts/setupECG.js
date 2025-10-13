/**
 * ECG Training Module Setup Script
 * --------------------------------
 * Usage: node scripts/setupECG.js ./pdfs
 *
 * - Reads all PDFs from the given folder
 * - Extracts text & images
 * - Splits into "slides", "questions", "objectives"
 * - Creates ready-to-use module folders under /assets
 */

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { nanoid } = require("nanoid");

// --- Utility: clean text ---
function cleanText(txt) {
  return txt
    .replace(/\s+/g, " ")
    .replace(/\n/g, " ")
    .trim();
}

// --- Extract questions from text ---
function extractQuestions(text) {
  const questions = [];
  
  // Look for numbered questions (1., 2., etc.)
  const questionRegex = /(\d+\.\s*[^?]*\?)/g;
  let match;
  
  while ((match = questionRegex.exec(text)) !== null) {
    const questionText = match[1].trim();
    if (questionText.length > 10) { // Filter out very short matches
      questions.push({
        id: nanoid(),
        question: questionText,
        type: 'multiple-choice',
        options: [],
        correctAnswer: null,
        explanation: ''
      });
    }
  }
  
  return questions;
}

// --- Extract objectives from text ---
function extractObjectives(text) {
  const objectives = [];
  
  // Look for objectives section
  const objRegex = /(?:Learning Objectives|Objectives|Learning Goals?)[:\s]*([^]*?)(?:\n\n|\n[A-Z]|$)/i;
  const match = text.match(objRegex);
  
  if (match) {
    const objText = match[1];
    // Split by bullet points, numbers, or dashes
    const objList = objText.split(/(?:•|\d+\.|-|\*)\s*/)
      .map(obj => obj.trim())
      .filter(obj => obj.length > 10 && !obj.match(/^\d+$/));
    
    objectives.push(...objList);
  }
  
  return objectives;
}

// --- Split text into slides ---
function splitIntoSides(text) {
  const slides = [];
  
  // Split by common slide separators
  const slideRegex = /(?:Slide \d+|Page \d+|#+\s|===+)/gi;
  const parts = text.split(slideRegex);
  
  parts.forEach((part, index) => {
    const cleaned = part.trim();
    if (cleaned.length > 50) { // Only include substantial content
      slides.push({
        id: nanoid(),
        title: `Slide ${index + 1}`,
        content: cleaned,
        pageNumber: index + 1
      });
    }
  });
  
  return slides;
}

// --- Parse PDF into structured module data ---
async function parsePDF(filePath) {
  try {
    console.log(`📖 Reading ${filePath}...`);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const rawText = cleanText(pdfData.text);
    const fileName = path.basename(filePath, ".pdf");
    
    console.log(`📊 Extracting content from ${fileName}...`);
    
    // Extract different components
    const objectives = extractObjectives(rawText);
    const questions = extractQuestions(rawText);
    const slides = splitIntoSides(rawText);
    
    // Create module structure
    const module = {
      id: nanoid(),
      title: fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `Interactive ECG training module: ${fileName}`,
      overview: `This module covers essential ECG concepts and practical applications. Complete all sections to master the material.`,
      objectives: objectives.length > 0 ? objectives : [
        "Understand basic ECG principles",
        "Identify normal ECG components",
        "Apply electrode placement techniques",
        "Interpret basic cardiac rhythms"
      ],
      duration: Math.max(30, Math.ceil(slides.length * 2)), // Estimate 2 min per slide
      difficulty: questions.length > 10 ? "Intermediate" : "Beginner",
      prerequisites: "Basic anatomy knowledge recommended",
      slides: slides.map(slide => ({
        name: slide.title,
        url: `/assets/${fileName}/pdfs/${fileName}.pdf#page=${slide.pageNumber}`,
        content: slide.content
      })),
      videos: [], // Will be added manually
      cases: [], // Will be added manually
      pretest: questions.slice(0, Math.ceil(questions.length / 2)).map(q => ({
        ...q,
        options: [
          "Option A",
          "Option B", 
          "Option C",
          "Option D"
        ],
        correctAnswer: 0,
        explanation: "Review the material to understand the correct answer."
      })),
      posttest: questions.slice(Math.ceil(questions.length / 2)).map(q => ({
        ...q,
        options: [
          "Option A",
          "Option B",
          "Option C", 
          "Option D"
        ],
        correctAnswer: 0,
        explanation: "Review the material to understand the correct answer."
      }))
    };

    return { module, fileName };
  } catch (error) {
    console.error(`❌ Error parsing ${filePath}:`, error.message);
    return null;
  }
}

// --- Create module directory structure ---
function createModuleStructure(module, fileName) {
  const moduleDir = path.join(process.cwd(), "assets", fileName);
  
  // Create directories
  const dirs = ['pdfs', 'videos', 'images', 'questions'];
  dirs.forEach(dir => {
    const dirPath = path.join(moduleDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
  
  // Copy PDF to module directory
  const sourcePdf = path.join(process.cwd(), "pdfs", `${fileName}.pdf`);
  const destPdf = path.join(moduleDir, "pdfs", `${fileName}.pdf`);
  
  if (fs.existsSync(sourcePdf)) {
    fs.copyFileSync(sourcePdf, destPdf);
    console.log(`📄 Copied PDF to ${destPdf}`);
  }
  
  // Create module.json
  const moduleJsonPath = path.join(moduleDir, "module.json");
  fs.writeFileSync(moduleJsonPath, JSON.stringify(module, null, 2));
  console.log(`📝 Created module.json`);
  
  return moduleDir;
}

// --- Main Runner ---
async function main() {
  const inputDir = process.argv[2];
  if (!inputDir) {
    console.error("❌ Usage: node scripts/setupECG.js ./pdfs");
    console.error("   Make sure to create a 'pdfs' folder with your PDF files");
    process.exit(1);
  }

  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Directory not found: ${inputDir}`);
    console.error("   Please create the directory and add your PDF files");
    process.exit(1);
  }

  const files = fs.readdirSync(inputDir).filter((f) => f.toLowerCase().endsWith(".pdf"));
  
  if (files.length === 0) {
    console.error(`❌ No PDF files found in ${inputDir}`);
    console.error("   Please add PDF files to the directory");
    process.exit(1);
  }

  console.log(`🚀 Found ${files.length} PDF files to process`);
  
  const outDir = path.join(process.cwd(), "assets");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const modules = [];
  let successCount = 0;

  for (const file of files) {
    console.log(`\n📖 Processing ${file}...`);
    const result = await parsePDF(path.join(inputDir, file));
    
    if (result) {
      const { module, fileName } = result;
      
      // Create module structure
      createModuleStructure(module, fileName);
      
      modules.push({
        id: module.id,
        title: module.title,
        description: module.description,
        duration: module.duration,
        difficulty: module.difficulty,
        objectives: module.objectives,
        hasQuestions: module.pretest.length > 0 || module.posttest.length > 0,
        slideCount: module.slides.length,
        questionCount: module.pretest.length + module.posttest.length
      });
      
      successCount++;
      console.log(`✅ Successfully processed ${fileName}`);
    }
  }

  // Update master index
  const masterIndexPath = path.join(outDir, "ecg-modules.json");
  fs.writeFileSync(masterIndexPath, JSON.stringify(modules, null, 2));
  
  console.log(`\n🎉 ECG Modules processed successfully!`);
  console.log(`📊 Processed: ${successCount}/${files.length} files`);
  console.log(`📁 Output directory: ${outDir}`);
  console.log(`📋 Master index: ${masterIndexPath}`);
  
  if (successCount > 0) {
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. Start the server: npm run dev`);
    console.log(`   2. Visit: http://localhost:3000/ecg-training`);
    console.log(`   3. Your modules will be available for learning!`);
  }
}

// --- Error handling ---
main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});


