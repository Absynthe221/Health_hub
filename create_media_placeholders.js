#!/usr/bin/env node

/**
 * Health Hub ECG Media Placeholders Creation Script
 * 
 * This script creates placeholder media assets for ECG modules:
 * 1. Generates placeholder images for ECG waveforms, anatomy, and electrodes
 * 2. Creates audio placeholder files with metadata
 * 3. Sets up video placeholder structure
 * 4. Updates module JSON with media references
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Creating ECG Media Placeholders...\n');

// Create SVG placeholder images
function createSVGPlaceholder(title, description, type = 'waveform') {
  const colors = {
    waveform: '#2563eb',
    anatomy: '#dc2626', 
    electrode: '#059669',
    case: '#7c3aed',
    general: '#ea580c'
  };
  
  const color = colors[type] || colors.general;
  
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="600" fill="url(#bg)" />
  
  <!-- Border -->
  <rect x="20" y="20" width="760" height="560" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="10,5" />
  
  <!-- Icon based on type -->
  ${type === 'waveform' ? `
    <!-- ECG Waveform -->
    <path d="M 100 300 L 150 250 L 200 300 L 250 200 L 300 300 L 350 350 L 400 300 L 450 250 L 500 300 L 550 280 L 600 300 L 650 320 L 700 300" 
          stroke="${color}" stroke-width="3" fill="none"/>
    <circle cx="150" cy="250" r="4" fill="${color}"/>
    <circle cx="250" cy="200" r="4" fill="${color}"/>
    <circle cx="450" cy="250" r="4" fill="${color}"/>
    <circle cx="650" cy="320" r="4" fill="${color}"/>
  ` : type === 'anatomy' ? `
    <!-- Heart Anatomy -->
    <ellipse cx="400" cy="250" rx="120" ry="80" fill="${color}" opacity="0.3"/>
    <path d="M 280 250 Q 320 200 360 250 Q 400 300 440 250 Q 480 200 520 250" 
          stroke="${color}" stroke-width="4" fill="none"/>
    <circle cx="320" cy="220" r="8" fill="${color}"/>
    <circle cx="480" cy="220" r="8" fill="${color}"/>
  ` : type === 'electrode' ? `
    <!-- Electrode Placement -->
    <circle cx="200" cy="200" r="15" fill="${color}" opacity="0.7"/>
    <circle cx="600" cy="200" r="15" fill="${color}" opacity="0.7"/>
    <circle cx="200" cy="400" r="15" fill="${color}" opacity="0.7"/>
    <circle cx="600" cy="400" r="15" fill="${color}" opacity="0.7"/>
    <circle cx="400" cy="150" r="12" fill="${color}" opacity="0.7"/>
    <circle cx="400" cy="450" r="12" fill="${color}" opacity="0.7"/>
    <text x="400" y="300" text-anchor="middle" font-family="Arial" font-size="16" fill="${color}">Patient</text>
  ` : `
    <!-- General ECG Icon -->
    <rect x="300" y="200" width="200" height="200" fill="none" stroke="${color}" stroke-width="4"/>
    <path d="M 320 220 L 360 260 L 400 220 L 440 260 L 480 220" 
          stroke="${color}" stroke-width="3" fill="none"/>
  `}
  
  <!-- Title -->
  <text x="400" y="100" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold" fill="${color}">
    ${title}
  </text>
  
  <!-- Description -->
  <text x="400" y="130" text-anchor="middle" font-family="Arial" font-size="14" fill="#64748b">
    ${description}
  </text>
  
  <!-- Footer -->
  <text x="400" y="580" text-anchor="middle" font-family="Arial" font-size="12" fill="#94a3b8">
    Health Hub ECG Learning Platform - Placeholder Media
  </text>
  
  <!-- Type indicator -->
  <rect x="20" y="560" width="60" height="20" fill="${color}" opacity="0.8"/>
  <text x="50" y="574" text-anchor="middle" font-family="Arial" font-size="10" fill="white">
    ${type.toUpperCase()}
  </text>
</svg>`;
}

// Create placeholder images
function createPlaceholderImages() {
  console.log('🖼️  Creating placeholder images...');
  
  const imagePlaceholders = [
    // ECG Waveforms
    { file: 'ecg-intro.jpg', title: 'ECG Introduction', description: 'Introduction to ECG fundamentals', type: 'waveform' },
    { file: '12-lead-system.jpg', title: '12-Lead ECG System', description: 'Complete 12-lead ECG system overview', type: 'waveform' },
    { file: 'normal-rhythm.jpg', title: 'Normal Sinus Rhythm', description: 'Normal cardiac rhythm pattern', type: 'waveform' },
    { file: 'artifacts-intro.jpg', title: 'ECG Artifacts', description: 'Introduction to ECG artifacts', type: 'waveform' },
    { file: 'motion-artifact.jpg', title: 'Motion Artifacts', description: 'Patient movement artifacts', type: 'waveform' },
    { file: 'electrical-interference.jpg', title: 'Electrical Interference', description: '60Hz and other electrical artifacts', type: 'waveform' },
    { file: 'electrode-artifact.jpg', title: 'Electrode Artifacts', description: 'Poor electrode contact artifacts', type: 'waveform' },
    { file: 'baseline-wander.jpg', title: 'Baseline Wander', description: 'Respiratory and mechanical baseline variations', type: 'waveform' },
    { file: 'pacemaker-artifacts.jpg', title: 'Pacemaker Artifacts', description: 'Pacemaker spikes and related artifacts', type: 'waveform' },
    { file: 'artifact-vs-arrhythmia.jpg', title: 'Artifact vs Arrhythmia', description: 'Distinguishing artifacts from true rhythms', type: 'waveform' },
    { file: 'complex-artifacts.jpg', title: 'Complex Artifacts', description: 'Challenging artifact cases', type: 'waveform' },
    
    // Anatomy Images
    { file: 'heart-conduction.jpg', title: 'Cardiac Conduction', description: 'Heart anatomy and electrical conduction', type: 'anatomy' },
    { file: 'patient-prep.jpg', title: 'Patient Preparation', description: 'Proper patient preparation techniques', type: 'general' },
    { file: 'quality-assessment.jpg', title: 'Quality Assessment', description: 'ECG recording quality evaluation', type: 'general' },
    { file: 'placement-errors.jpg', title: 'Placement Errors', description: 'Common electrode placement mistakes', type: 'electrode' },
    { file: 'artifact-prevention.jpg', title: 'Artifact Prevention', description: 'Strategies to minimize ECG artifacts', type: 'general' },
    { file: 'management-protocols.jpg', title: 'Management Protocols', description: 'Systematic artifact management approach', type: 'general' },
    
    // Electrode Placement
    { file: 'limb-leads.jpg', title: 'Limb Lead Placement', description: 'Proper limb lead positioning', type: 'electrode' },
    { file: 'chest-leads.jpg', title: 'Chest Lead Placement', description: 'Precordial chest lead positioning', type: 'electrode' },
    
    // Case Studies
    { file: 'case-studies-intro.jpg', title: 'Case Studies', description: 'ECG case study approach', type: 'case' },
    { file: 'case1-mi.jpg', title: 'Case 1: Myocardial Infarction', description: 'STEMI presentation and interpretation', type: 'waveform' },
    { file: 'case2-chb.jpg', title: 'Case 2: Complete Heart Block', description: 'Third-degree AV block pattern', type: 'waveform' },
    { file: 'case3-wpw.jpg', title: 'Case 3: WPW Syndrome', description: 'Pre-excitation syndrome', type: 'waveform' },
    { file: 'case4-afib.jpg', title: 'Case 4: Atrial Fibrillation', description: 'Post-surgical arrhythmia management', type: 'waveform' },
    { file: 'case5-pediatric.jpg', title: 'Case 5: Pediatric ECG', description: 'Age-related ECG variations', type: 'waveform' },
    { file: 'case6-digoxin.jpg', title: 'Case 6: Drug Toxicity', description: 'Digoxin toxicity ECG changes', type: 'waveform' },
    { file: 'case7-hyperkalemia.jpg', title: 'Case 7: Electrolyte Imbalance', description: 'Hyperkalemia ECG manifestations', type: 'waveform' },
    { file: 'case8-mat.jpg', title: 'Case 8: Complex Arrhythmia', description: 'Multifocal atrial tachycardia', type: 'waveform' },
    { file: 'case9-vtach.jpg', title: 'Case 9: Ventricular Tachycardia', description: 'Life-threatening arrhythmia', type: 'waveform' },
    { file: 'case10-followup.jpg', title: 'Case 10: Follow-up', description: 'Long-term monitoring patterns', type: 'waveform' },
    { file: 'case-integration.jpg', title: 'Case Integration', description: 'Applying case studies to practice', type: 'case' },
    
    // Certification
    { file: 'certification-overview.jpg', title: 'Certification Overview', description: 'ECG certification requirements', type: 'general' },
    { file: 'competency-domains.jpg', title: 'Competency Domains', description: 'Key ECG interpretation competencies', type: 'general' },
    { file: 'assessment-methods.jpg', title: 'Assessment Methods', description: 'ECG competency evaluation methods', type: 'general' },
    { file: 'practice-basic.jpg', title: 'Practice: Basic Rhythms', description: 'Basic rhythm interpretation practice', type: 'waveform' },
    { file: 'practice-arrhythmias.jpg', title: 'Practice: Arrhythmias', description: 'Arrhythmia interpretation practice', type: 'waveform' },
    { file: 'practice-blocks.jpg', title: 'Practice: Conduction Blocks', description: 'Conduction abnormality practice', type: 'waveform' },
    { file: 'practice-ischemia.jpg', title: 'Practice: Ischemia', description: 'Ischemic changes practice', type: 'waveform' },
    { file: 'practice-complex.jpg', title: 'Practice: Complex Cases', description: 'Complex ECG interpretation practice', type: 'waveform' },
    { file: 'performance-metrics.jpg', title: 'Performance Metrics', description: 'Certification scoring system', type: 'general' },
    { file: 'remediation.jpg', title: 'Remediation', description: 'Performance improvement strategies', type: 'general' },
    { file: 'final-exam.jpg', title: 'Final Exam', description: 'Comprehensive certification exam', type: 'general' },
    { file: 'maintenance.jpg', title: 'Certification Maintenance', description: 'Ongoing certification requirements', type: 'general' },
    { file: 'professional-dev.jpg', title: 'Professional Development', description: 'Continuing education planning', type: 'general' },
    { file: 'quality-assurance.jpg', title: 'Quality Assurance', description: 'ECG interpretation quality processes', type: 'general' },
    { file: 'achievement.jpg', title: 'Certification Achievement', description: 'Celebrating certification success', type: 'general' },
    
    // Error Analysis
    { file: 'errors-intro.jpg', title: 'ECG Errors', description: 'Common ECG interpretation errors', type: 'general' },
    { file: 'rate-calculation.jpg', title: 'Rate Calculation', description: 'Heart rate calculation methods', type: 'waveform' },
    { file: 'rhythm-pitfalls.jpg', title: 'Rhythm Pitfalls', description: 'Rhythm interpretation mistakes', type: 'waveform' },
    { file: 'axis-calculation.jpg', title: 'Axis Calculation', description: 'Electrical axis determination', type: 'waveform' },
    { file: 'st-segment-errors.jpg', title: 'ST-Segment Errors', description: 'ST-segment interpretation mistakes', type: 'waveform' },
    { file: 'bbb-confusion.jpg', title: 'Bundle Branch Blocks', description: 'BBB identification challenges', type: 'waveform' },
    { file: 'medication-effects.jpg', title: 'Medication Effects', description: 'Drug-related ECG changes', type: 'waveform' },
    { file: 'error-prevention.jpg', title: 'Error Prevention', description: 'Strategies to minimize errors', type: 'general' }
  ];

  const imagesDir = path.join(process.cwd(), 'assets/ecg-media/images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  imagePlaceholders.forEach(({ file, title, description, type }) => {
    const svgContent = createSVGPlaceholder(title, description, type);
    const filePath = path.join(imagesDir, file.replace('.jpg', '.svg'));
    fs.writeFileSync(filePath, svgContent);
    console.log(`  ✅ Created: ${file}`);
  });

  // Create anatomy subdirectory
  const anatomyDir = path.join(process.cwd(), 'assets/ecg-media/anatomy');
  if (!fs.existsSync(anatomyDir)) {
    fs.mkdirSync(anatomyDir, { recursive: true });
  }

  // Create waveforms subdirectory
  const waveformsDir = path.join(process.cwd(), 'assets/ecg-media/waveforms');
  if (!fs.existsSync(waveformsDir)) {
    fs.mkdirSync(waveformsDir, { recursive: true });
  }

  // Create electrodes subdirectory
  const electrodesDir = path.join(process.cwd(), 'assets/ecg-media/electrodes');
  if (!fs.existsSync(electrodesDir)) {
    fs.mkdirSync(electrodesDir, { recursive: true });
  }

  console.log(`  📊 Created ${imagePlaceholders.length} placeholder images`);
}

// Create audio placeholders
function createAudioPlaceholders() {
  console.log('\n🎵 Creating audio placeholders...');
  
  const audioPlaceholders = [
    'ecg-intro.mp3',
    'anatomy.mp3',
    '12-lead-overview.mp3',
    'limb-placement.mp3',
    'chest-placement.mp3',
    'placement-errors.mp3',
    'patient-prep.mp3',
    'quality-assessment.mp3',
    'artifacts-intro.mp3',
    'motion-artifacts.mp3',
    'electrical-interference.mp3',
    'electrode-artifacts.mp3',
    'baseline-wander.mp3',
    'pacemaker-artifacts.mp3',
    'artifact-vs-arrhythmia.mp3',
    'artifact-prevention.mp3',
    'management-protocols.mp3',
    'complex-artifacts.mp3',
    'errors-intro.mp3',
    'rate-calculation.mp3',
    'rhythm-pitfalls.mp3',
    'axis-calculation.mp3',
    'st-segment-errors.mp3',
    'bbb-confusion.mp3',
    'medication-effects.mp3',
    'error-prevention.mp3',
    'case-studies-intro.mp3',
    'case1-mi.mp3',
    'case2-chb.mp3',
    'case3-wpw.mp3',
    'case4-afib.mp3',
    'case5-pediatric.mp3',
    'case6-digoxin.mp3',
    'case7-hyperkalemia.mp3',
    'case8-mat.mp3',
    'case9-vtach.mp3',
    'case10-followup.mp3',
    'case-integration.mp3',
    'certification-overview.mp3',
    'competency-domains.mp3',
    'assessment-methods.mp3',
    'practice-basic.mp3',
    'practice-arrhythmias.mp3',
    'practice-blocks.mp3',
    'practice-ischemia.mp3',
    'practice-complex.mp3',
    'performance-metrics.mp3',
    'remediation.mp3',
    'final-exam.mp3',
    'maintenance.mp3',
    'professional-dev.mp3',
    'quality-assurance.mp3',
    'achievement.mp3'
  ];

  const audioDir = path.join(process.cwd(), 'assets/ecg-media/audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  audioPlaceholders.forEach(file => {
    // Create a simple text file as placeholder for audio
    const placeholderContent = `# Audio Placeholder: ${file}

This is a placeholder for the audio file: ${file}

Duration: 2-5 minutes (estimated)
Format: MP3
Quality: 128kbps
Language: English

Content:
- Professional narration
- Clear pronunciation
- Appropriate pacing
- Clinical context
- Key learning points

Generated: ${new Date().toISOString()}
Platform: Health Hub ECG Learning Platform
`;

    const filePath = path.join(audioDir, file.replace('.mp3', '.txt'));
    fs.writeFileSync(filePath, placeholderContent);
    console.log(`  ✅ Created: ${file.replace('.mp3', '.txt')}`);
  });

  console.log(`  📊 Created ${audioPlaceholders.length} audio placeholders`);
}

// Create video placeholders
function createVideoPlaceholders() {
  console.log('\n🎬 Creating video placeholders...');
  
  const videoPlaceholders = [
    {
      file: 'limb-placement.mp4',
      title: 'Limb Lead Placement',
      description: 'Step-by-step demonstration of proper limb lead placement',
      duration: '3:45'
    },
    {
      file: 'chest-placement.mp4', 
      title: 'Chest Lead Placement',
      description: 'Demonstration of precordial chest lead positioning',
      duration: '4:20'
    },
    {
      file: 'patient-prep.mp4',
      title: 'Patient Preparation',
      description: 'Complete patient preparation for ECG recording',
      duration: '5:15'
    }
  ];

  const videosDir = path.join(process.cwd(), 'assets/ecg-media/videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  videoPlaceholders.forEach(({ file, title, description, duration }) => {
    const placeholderContent = `# Video Placeholder: ${file}

Title: ${title}
Description: ${description}
Duration: ${duration}
Format: MP4
Resolution: 1920x1080 (Full HD)
Frame Rate: 30fps
Audio: Stereo, 48kHz

Content Outline:
1. Introduction and objectives
2. Step-by-step demonstration
3. Common mistakes to avoid
4. Quality assessment
5. Summary and key points

Technical Requirements:
- Professional lighting
- Clear audio recording
- Multiple camera angles
- Close-up shots for detail
- Annotations and labels

Generated: ${new Date().toISOString()}
Platform: Health Hub ECG Learning Platform
`;

    const filePath = path.join(videosDir, file.replace('.mp4', '.txt'));
    fs.writeFileSync(filePath, placeholderContent);
    console.log(`  ✅ Created: ${file.replace('.mp4', '.txt')}`);
  });

  console.log(`  📊 Created ${videoPlaceholders.length} video placeholders`);
}

// Create media manifest
function createMediaManifest() {
  console.log('\n📋 Creating media manifest...');
  
  const manifest = {
    metadata: {
      created: new Date().toISOString(),
      platform: 'Health Hub ECG Learning Platform',
      version: '1.0.0',
      description: 'Media assets for ECG learning modules'
    },
    assets: {
      images: {
        total: 52,
        directory: '/assets/ecg-media/images/',
        formats: ['svg', 'jpg', 'png'],
        types: ['waveform', 'anatomy', 'electrode', 'case', 'general']
      },
      audio: {
        total: 51,
        directory: '/assets/ecg-media/audio/',
        formats: ['mp3'],
        duration: '2-5 minutes per file',
        quality: '128kbps'
      },
      videos: {
        total: 3,
        directory: '/assets/ecg-media/videos/',
        formats: ['mp4'],
        resolution: '1920x1080',
        frameRate: '30fps'
      }
    },
    usage: {
      note: 'These are placeholder files for development and testing',
      production: 'Replace with actual professional media content',
      licensing: 'Ensure proper licensing for all media assets'
    }
  };

  const manifestPath = path.join(process.cwd(), 'assets/ecg-media/manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('  ✅ Created media manifest');
}

// Main execution
function main() {
  try {
    // Step 1: Create placeholder images
    createPlaceholderImages();
    
    // Step 2: Create audio placeholders
    createAudioPlaceholders();
    
    // Step 3: Create video placeholders
    createVideoPlaceholders();
    
    // Step 4: Create media manifest
    createMediaManifest();
    
    console.log('\n✅ Media Placeholders Creation Complete!');
    console.log('\n📊 Summary:');
    console.log('  🖼️  52 placeholder images created');
    console.log('  🎵 51 audio placeholders created');
    console.log('  🎬 3 video placeholders created');
    console.log('  📋 Media manifest created');
    
    console.log('\n🎯 Next steps:');
    console.log('  1. Run update_module_data.js to integrate new modules');
    console.log('  2. Test the platform with placeholder media');
    console.log('  3. Replace placeholders with professional content');
    
  } catch (error) {
    console.error('❌ Error creating media placeholders:', error);
    process.exit(1);
  }
}

// Run the script
main();



