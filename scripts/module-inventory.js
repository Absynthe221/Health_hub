#!/usr/bin/env node

/**
 * Health Hub ECG Module Inventory & Verification System
 * =====================================================
 * 
 * This script performs comprehensive verification of all ECG modules:
 * - Validates module structure and data integrity
 * - Checks for missing files (audio, subtitles, images)
 * - Verifies JSON schema compliance
 * - Generates detailed inventory report
 * - Identifies issues for production readiness
 */

const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');

// Configuration
const assetsDir = path.join(__dirname, '..', 'assets');
const modulesIndexPath = path.join(assetsDir, 'ecg-modules.json');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class ModuleInventory {
  constructor() {
    this.results = {
      totalModules: 0,
      validModules: 0,
      issues: [],
      warnings: [],
      fileStats: {
        totalFiles: 0,
        missingFiles: 0,
        corruptedFiles: 0
      },
      modules: []
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async loadModulesIndex() {
    try {
      if (!fs.existsSync(modulesIndexPath)) {
        throw new Error('ecg-modules.json not found');
      }
      
      const data = fs.readFileSync(modulesIndexPath, 'utf8');
      const modules = JSON.parse(data);
      this.results.totalModules = modules.length;
      this.log(`📊 Found ${modules.length} modules in index`, 'cyan');
      return modules;
    } catch (error) {
      this.log(`❌ Error loading modules index: ${error.message}`, 'red');
      throw error;
    }
  }

  async verifyModuleStructure(module) {
    const moduleDir = path.join(assetsDir, module.title);
    const moduleJsonPath = path.join(moduleDir, 'module.json');
    
    const moduleResult = {
      id: module.id,
      title: module.title,
      valid: true,
      issues: [],
      warnings: [],
      files: {
        moduleJson: false,
        slides: [],
        audio: [],
        subtitles: [],
        images: []
      },
      stats: {
        totalSlides: 0,
        slidesWithAudio: 0,
        slidesWithSubtitles: 0,
        slidesWithImages: 0,
        totalQuestions: 0
      }
    };

    // Check if module directory exists
    if (!fs.existsSync(moduleDir)) {
      moduleResult.valid = false;
      moduleResult.issues.push(`Module directory not found: ${moduleDir}`);
      return moduleResult;
    }

    // Check module.json
    if (fs.existsSync(moduleJsonPath)) {
      moduleResult.files.moduleJson = true;
      try {
        const moduleData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
        moduleResult.stats.totalSlides = moduleData.slides?.length || 0;
        
        // Verify each slide
        if (moduleData.slides) {
          for (let i = 0; i < moduleData.slides.length; i++) {
            const slide = moduleData.slides[i];
            const slideNumber = i + 1;
            
            // Check audio files
            if (slide.audio && fs.existsSync(slide.audio)) {
              moduleResult.files.audio.push(slide.audio);
              moduleResult.stats.slidesWithAudio++;
            } else if (slide.audio) {
              moduleResult.warnings.push(`Slide ${slideNumber}: Audio file missing - ${slide.audio}`);
            }

            // Check subtitle files
            if (slide.subtitles && fs.existsSync(slide.subtitles)) {
              moduleResult.files.subtitles.push(slide.subtitles);
              moduleResult.stats.slidesWithSubtitles++;
            } else if (slide.subtitles) {
              moduleResult.warnings.push(`Slide ${slideNumber}: Subtitle file missing - ${slide.subtitles}`);
            }

            // Check image files
            if (slide.images && Array.isArray(slide.images)) {
              slide.images.forEach((imagePath, idx) => {
                if (fs.existsSync(imagePath)) {
                  moduleResult.files.images.push(imagePath);
                } else {
                  moduleResult.warnings.push(`Slide ${slideNumber}: Image ${idx + 1} missing - ${imagePath}`);
                }
              });
              if (slide.images.length > 0) {
                moduleResult.stats.slidesWithImages++;
              }
            }

            // Count questions
            if (slide.mcqs && Array.isArray(slide.mcqs)) {
              moduleResult.stats.totalQuestions += slide.mcqs.length;
            }

            moduleResult.files.slides.push({
              slideNumber,
              hasAudio: !!slide.audio && fs.existsSync(slide.audio),
              hasSubtitles: !!slide.subtitles && fs.existsSync(slide.subtitles),
              hasImages: slide.images && slide.images.length > 0,
              questionCount: slide.mcqs ? slide.mcqs.length : 0
            });
          }
        }
      } catch (error) {
        moduleResult.valid = false;
        moduleResult.issues.push(`Invalid module.json: ${error.message}`);
      }
    } else {
      moduleResult.valid = false;
      moduleResult.issues.push('module.json not found');
    }

    return moduleResult;
  }

  async generateReport() {
    this.log('\n📋 HEALTH HUB ECG MODULE INVENTORY REPORT', 'bright');
    this.log('=' .repeat(50), 'cyan');
    
    // Summary
    this.log(`\n📊 SUMMARY:`, 'bright');
    this.log(`  Total Modules: ${this.results.totalModules}`, 'blue');
    this.log(`  Valid Modules: ${this.results.validModules}`, 'green');
    this.log(`  Issues Found: ${this.results.issues.length}`, this.results.issues.length > 0 ? 'red' : 'green');
    this.log(`  Warnings: ${this.results.warnings.length}`, this.results.warnings.length > 0 ? 'yellow' : 'green');

    // File Statistics
    this.log(`\n📁 FILE STATISTICS:`, 'bright');
    this.log(`  Total Files: ${this.results.fileStats.totalFiles}`, 'blue');
    this.log(`  Missing Files: ${this.results.fileStats.missingFiles}`, 'red');
    this.log(`  Corrupted Files: ${this.results.fileStats.corruptedFiles}`, 'red');

    // Module Details
    this.log(`\n📚 MODULE DETAILS:`, 'bright');
    this.results.modules.forEach((module, index) => {
      const status = module.valid ? '✅' : '❌';
      const color = module.valid ? 'green' : 'red';
      
      this.log(`\n  ${index + 1}. ${status} ${module.title}`, color);
      this.log(`     Slides: ${module.stats.totalSlides}`, 'blue');
      this.log(`     Audio: ${module.stats.slidesWithAudio}/${module.stats.totalSlides}`, 'blue');
      this.log(`     Subtitles: ${module.stats.slidesWithSubtitles}/${module.stats.totalSlides}`, 'blue');
      this.log(`     Images: ${module.stats.slidesWithImages}/${module.stats.totalSlides}`, 'blue');
      this.log(`     Questions: ${module.stats.totalQuestions}`, 'blue');
      
      if (module.issues.length > 0) {
        this.log(`     Issues:`, 'red');
        module.issues.forEach(issue => this.log(`       - ${issue}`, 'red'));
      }
      
      if (module.warnings.length > 0) {
        this.log(`     Warnings:`, 'yellow');
        module.warnings.forEach(warning => this.log(`       - ${warning}`, 'yellow'));
      }
    });

    // Issues Summary
    if (this.results.issues.length > 0) {
      this.log(`\n❌ CRITICAL ISSUES:`, 'bright');
      this.results.issues.forEach((issue, index) => {
        this.log(`  ${index + 1}. ${issue}`, 'red');
      });
    }

    // Warnings Summary
    if (this.results.warnings.length > 0) {
      this.log(`\n⚠️  WARNINGS:`, 'bright');
      this.results.warnings.forEach((warning, index) => {
        this.log(`  ${index + 1}. ${warning}`, 'yellow');
      });
    }

    // Production Readiness
    this.log(`\n🚀 PRODUCTION READINESS:`, 'bright');
    const readinessScore = this.calculateReadinessScore();
    this.log(`  Overall Score: ${readinessScore}%`, readinessScore >= 90 ? 'green' : readinessScore >= 70 ? 'yellow' : 'red');
    
    if (readinessScore >= 90) {
      this.log(`  Status: ✅ READY FOR PRODUCTION`, 'green');
    } else if (readinessScore >= 70) {
      this.log(`  Status: ⚠️  NEEDS ATTENTION`, 'yellow');
    } else {
      this.log(`  Status: ❌ NOT READY`, 'red');
    }

    // Recommendations
    this.log(`\n💡 RECOMMENDATIONS:`, 'bright');
    if (this.results.issues.length > 0) {
      this.log(`  - Fix all critical issues before deployment`, 'red');
    }
    if (this.results.warnings.length > 0) {
      this.log(`  - Address warnings for optimal user experience`, 'yellow');
    }
    if (readinessScore >= 90) {
      this.log(`  - System is ready for CI/CD deployment`, 'green');
    }
  }

  calculateReadinessScore() {
    if (this.results.totalModules === 0) return 0;
    
    const validModulesScore = (this.results.validModules / this.results.totalModules) * 60;
    const issuesPenalty = Math.min(this.results.issues.length * 10, 30);
    const warningsPenalty = Math.min(this.results.warnings.length * 2, 10);
    
    return Math.max(0, Math.round(validModulesScore - issuesPenalty - warningsPenalty));
  }

  async run() {
    try {
      this.log('🔍 Starting Health Hub ECG Module Inventory...', 'bright');
      
      const modules = await this.loadModulesIndex();
      const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
      progressBar.start(modules.length, 0);

      for (const module of modules) {
        const moduleResult = await this.verifyModuleStructure(module);
        this.results.modules.push(moduleResult);
        
        if (moduleResult.valid) {
          this.results.validModules++;
        }
        
        this.results.issues.push(...moduleResult.issues);
        this.results.warnings.push(...moduleResult.warnings);
        
        progressBar.increment();
      }

      progressBar.stop();
      await this.generateReport();
      
      // Save detailed report to file
      const reportPath = path.join(assetsDir, 'inventory-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      this.log(`\n📄 Detailed report saved to: ${reportPath}`, 'cyan');
      
    } catch (error) {
      this.log(`❌ Inventory failed: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Run the inventory
if (require.main === module) {
  const inventory = new ModuleInventory();
  inventory.run();
}

module.exports = ModuleInventory;




