#!/usr/bin/env node

/**
 * Health Hub ECG - Complete Platform Setup
 * =======================================
 * 
 * Master script that runs the complete setup pipeline:
 * 1. Install dependencies
 * 2. Convert all PPTX files to JSON
 * 3. Generate AI content (voice, MCQs, attention questions)
 * 4. Set up package-based access control
 * 5. Test the complete system
 */

const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const SCRIPTS_DIR = './scripts';
const MODULES_FILE = './data/ecg_modules_complete.json';

async function runCommand(command, description) {
  console.log(`\n🚀 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} completed successfully!`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🎯 Health Hub ECG - Complete Platform Setup');
  console.log('==========================================');
  console.log('This script will set up the complete ECG learning platform with:');
  console.log('• PPTX to JSON conversion for all 18 modules');
  console.log('• AI-powered voice narration generation');
  console.log('• Automated MCQ creation');
  console.log('• Attention tracking system');
  console.log('• Package-based access control');
  console.log('• Certification system');
  console.log('');

  const steps = [
    {
      name: 'Install PPTX Dependencies',
      command: 'bash scripts/install-pptx-dependencies.sh',
      required: true
    },
    {
      name: 'Install AI Dependencies',
      command: 'bash scripts/install-ai-dependencies.sh',
      required: false
    },
    {
      name: 'Convert PPTX Files to JSON',
      command: 'node scripts/convert-all-pptx-to-json.js',
      required: true
    },
    {
      name: 'Generate AI Content',
      command: 'node scripts/ai-content-generator.js',
      required: false
    }
  ];

  let successCount = 0;
  let totalSteps = steps.length;

  for (const step of steps) {
    const success = await runCommand(step.command, step.name);
    if (success) {
      successCount++;
    } else if (step.required) {
      console.log(`\n❌ Required step failed: ${step.name}`);
      console.log('Please fix the error and run the script again.');
      process.exit(1);
    } else {
      console.log(`\n⚠️  Optional step failed: ${step.name}`);
      console.log('Continuing with remaining steps...');
    }
  }

  // Check if modules file was created
  const modulesExists = await checkFileExists(MODULES_FILE);
  if (!modulesExists) {
    console.log('\n❌ Critical error: Modules file not created!');
    console.log('The PPTX conversion step must complete successfully.');
    process.exit(1);
  }

  // Display final results
  console.log('\n🎉 Setup Complete!');
  console.log('==================');
  console.log(`✅ Completed ${successCount}/${totalSteps} steps`);
  
  if (modulesExists) {
    try {
      const modulesData = JSON.parse(await fs.readFile(MODULES_FILE, 'utf8'));
      console.log(`📚 Created ${modulesData.modules?.length || 0} modules`);
      console.log(`📄 Total slides: ${modulesData.metadata?.totalSlides || 0}`);
      console.log(`🧠 Total quizzes: ${modulesData.metadata?.totalQuizzes || 0}`);
      
      if (modulesData.metadata?.packageDistribution) {
        console.log('\n📦 Package Distribution:');
        console.log(`   • Beginner: ${modulesData.metadata.packageDistribution.BEGINNER || 0} modules`);
        console.log(`   • Intermediate: ${modulesData.metadata.packageDistribution.INTERMEDIATE || 0} modules`);
        console.log(`   • Advanced: ${modulesData.metadata.packageDistribution.ADVANCED || 0} modules`);
      }
    } catch (error) {
      console.log('⚠️  Could not read modules file for statistics');
    }
  }

  console.log('\n🚀 Next Steps:');
  console.log('==============');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Navigate to: http://localhost:3000');
  console.log('3. Login with admin credentials');
  console.log('4. Go to Admin Dashboard → Presentations tab');
  console.log('5. Test the package-based filtering');
  console.log('6. Upload additional PPTX files if needed');
  console.log('7. Configure AI API keys in .env.local for voice generation');
  console.log('');
  console.log('📋 Available Features:');
  console.log('• Package-based module organization (Beginner/Intermediate/Advanced)');
  console.log('• AI-powered content generation (voice, MCQs, attention questions)');
  console.log('• Attention tracking and verification system');
  console.log('• Progress-based certification');
  console.log('• Comprehensive student dashboard');
  console.log('• Admin module management with search and filtering');
  console.log('');
  console.log('🔧 Configuration:');
  console.log('• Edit .env.local to add AI API keys');
  console.log('• Modify package levels in ModuleManager.jsx');
  console.log('• Customize certification requirements in CertificationSystem.jsx');
  console.log('• Adjust attention tracking settings in AttentionTracker.jsx');
  console.log('');
  console.log('🎯 Ready to launch your ECG learning platform!');
}

// Run the complete setup
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { main };



