const fs = require('fs');
const path = require('path');

const modulesDir = path.join(__dirname, 'public', 'modules');

console.log('🔄 Consolidating modules into 2 modules...\n');

// Step 1: Read all beginner modules and collect their slides
const beginnerModules = [
  'activus_mr_ibrahim_pea',
  'activus_mr_ibrahim_ventricular_rhythms_wps_office',
  'class3',
  'ecg_lecture_slide',
  'junctional_rhythm',
  'lead_error',
  'stemi'
];

let allSlides = [];
let totalSlides = 0;
let totalInteractive = 0;
let totalQuizItems = 0;

console.log('📚 Collecting slides from beginner modules:\n');

beginnerModules.forEach(moduleId => {
  const modulePath = path.join(modulesDir, moduleId, 'module.json');
  
  if (fs.existsSync(modulePath)) {
    try {
      const moduleData = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
      const moduleTitle = moduleData.moduleTitle || moduleId;
      const slides = moduleData.slides || [];
      
      console.log(`✓ ${moduleTitle}: ${slides.length} slides`);
      
      // Add module section marker
      allSlides.push({
        id: `section-${moduleId}`,
        title: `📖 ${moduleTitle}`,
        contentType: "section-header",
        duration: 1,
        content: {
          sectionTitle: moduleTitle,
          description: moduleData.description || "",
          slideCount: slides.length
        }
      });
      
      // Add all slides from this module
      slides.forEach((slide, index) => {
        const prefixedSlide = {
          ...slide,
          id: `${moduleId}-${slide.id || index}`,
          moduleSource: moduleTitle
        };
        allSlides.push(prefixedSlide);
        
        if (slide.interactive) totalInteractive++;
        if (slide.quiz) totalQuizItems++;
      });
      
      totalSlides += slides.length;
      
    } catch (error) {
      console.error(`❌ Error reading ${moduleId}:`, error.message);
    }
  }
});

console.log(`\n✅ Total slides collected: ${totalSlides}`);
console.log(`   Interactive slides: ${totalInteractive}`);
console.log(`   Quiz items: ${totalQuizItems}\n`);

// Step 2: Create comprehensive Module 1
const module1 = {
  "moduleId": "module-1-basic-ecg-interpretations",
  "moduleTitle": "Basic ECG Interpretations",
  "description": "Comprehensive foundational module covering all essential ECG interpretation skills. This module includes: PEA recognition, ventricular rhythms, ECG revision, junctional rhythms, lead errors, and STEMI recognition. Master the fundamental concepts needed for clinical ECG interpretation.",
  "difficulty": "beginner",
  "category": "Basic ECG Interpretation",
  "status": "published",
  "slides": allSlides,
  "metadata": {
    "totalSlides": allSlides.length,
    "contentSlides": totalSlides,
    "sectionHeaders": beginnerModules.length,
    "interactiveSlides": totalInteractive,
    "quizItems": totalQuizItems,
    "estimatedDuration": `${Math.ceil(totalSlides * 2.5)} minutes`,
    "topics": [
      "PEA (Pulseless Electrical Activity)",
      "Ventricular Rhythms",
      "ECG Revision & Fundamentals",
      "ECG Lecture Content",
      "Junctional Rhythms",
      "Lead Errors & Artifacts",
      "STEMI Recognition"
    ],
    "learningObjectives": [
      "Recognize and interpret basic ECG rhythms",
      "Identify pulseless electrical activity (PEA)",
      "Understand ventricular arrhythmias",
      "Master ECG fundamentals and lead placement",
      "Recognize junctional rhythms",
      "Identify common lead errors and artifacts",
      "Recognize STEMI patterns and criteria"
    ],
    "prerequisites": ["None - foundational module"],
    "sourceModules": beginnerModules.map(id => {
      const modPath = path.join(modulesDir, id, 'module.json');
      if (fs.existsSync(modPath)) {
        const data = JSON.parse(fs.readFileSync(modPath, 'utf8'));
        return data.moduleTitle || id;
      }
      return id;
    })
  }
};

// Create Module 1 directory
const module1Dir = path.join(modulesDir, 'module-1-basic-ecg-interpretations');
if (!fs.existsSync(module1Dir)) {
  fs.mkdirSync(module1Dir, { recursive: true });
}

fs.writeFileSync(
  path.join(module1Dir, 'module.json'),
  JSON.stringify(module1, null, 2)
);

console.log('✅ Created Module 1: Basic ECG Interpretations');
console.log(`   Total slides: ${allSlides.length} (including ${beginnerModules.length} section headers)`);
console.log(`   Content slides: ${totalSlides}`);
console.log(`   Estimated duration: ${Math.ceil(totalSlides * 2.5)} minutes\n`);

// Step 3: Rename case-studies to Module 2
const caseStudiesOldPath = path.join(modulesDir, 'module-7-case-studies');
const module2Path = path.join(modulesDir, 'module-2-case-studies');

if (fs.existsSync(caseStudiesOldPath)) {
  // Read and update the module data
  const caseStudiesJsonPath = path.join(caseStudiesOldPath, 'module.json');
  const caseStudiesData = JSON.parse(fs.readFileSync(caseStudiesJsonPath, 'utf8'));
  
  caseStudiesData.moduleId = 'module-2-case-studies';
  
  // Create Module 2 directory
  if (!fs.existsSync(module2Path)) {
    fs.mkdirSync(module2Path, { recursive: true });
  }
  
  // Write updated JSON to new location
  fs.writeFileSync(
    path.join(module2Path, 'module.json'),
    JSON.stringify(caseStudiesData, null, 2)
  );
  
  console.log('✅ Created Module 2: Case Studies (Intermediate)');
  console.log(`   Slides: ${caseStudiesData.slides.length}`);
  console.log(`   Duration: ${caseStudiesData.metadata.estimatedDuration}\n`);
}

// Step 4: Remove old module directories
console.log('🗑️  Removing old module directories:\n');

// Remove beginner modules
beginnerModules.forEach(moduleId => {
  const modulePath = path.join(modulesDir, moduleId);
  if (fs.existsSync(modulePath)) {
    fs.rmSync(modulePath, { recursive: true, force: true });
    console.log(`   ✓ Removed ${moduleId}`);
  }
});

// Remove old case-studies location
if (fs.existsSync(caseStudiesOldPath)) {
  fs.rmSync(caseStudiesOldPath, { recursive: true, force: true });
  console.log(`   ✓ Removed module-7-case-studies\n`);
}

console.log('✅ Module consolidation complete!\n');
console.log('📊 FINAL STRUCTURE:');
console.log('   Module 1: Basic ECG Interpretations (Beginner) - ' + allSlides.length + ' slides');
console.log('   Module 2: Case Studies (Intermediate) - 7 slides');
console.log('\n🎊 Total: 2 modules with ' + (allSlides.length + 7) + ' slides combined!');

