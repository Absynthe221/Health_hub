#!/usr/bin/env node

/**
 * ECG Platform - Complete Content Pipeline Automation
 * 
 * This script orchestrates the entire content pipeline:
 * 1. PPTX to Module conversion
 * 2. Video segmentation
 * 3. AI enhancement (quiz generation, summaries)
 * 4. Validation and quality assurance
 * 5. Database updates
 * 
 * Usage: node scripts/complete_pipeline.js [options]
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const CONFIG = {
  inputDir: 'assets',
  outputDir: 'public/modules',
  mediaDir: 'public/assets/ecg-media',
  segmentsDir: 'public/segments',
  apiBaseUrl: 'http://localhost:3000',
  pythonPath: 'python3',
  nodePath: 'node',
  logLevel: 'info',
  dryRun: false,
  skipAI: false,
  skipSegmentation: false,
  forceRegenerate: false
};

// Pipeline stages
const STAGES = {
  PREPARE: 'prepare',
  CONVERT: 'convert',
  SEGMENT: 'segment',
  AI_ENHANCE: 'ai_enhance',
  VALIDATE: 'validate',
  DEPLOY: 'deploy'
};

class ContentPipeline {
  constructor(options = {}) {
    this.config = { ...CONFIG, ...options };
    this.results = {
      startTime: new Date(),
      stages: {},
      errors: [],
      warnings: [],
      summary: {}
    };
    
    this.log(`Starting ECG Content Pipeline with config:`, this.config);
  }

  log(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    if (data) console.log(JSON.stringify(data, null, 2));
  }

  async runStage(stage, fn) {
    this.log(`\n=== Starting Stage: ${stage.toUpperCase()} ===`);
    const startTime = Date.now();
    
    try {
      const result = await fn();
      this.results.stages[stage] = {
        success: true,
        duration: Date.now() - startTime,
        result
      };
      this.log(`✓ Stage ${stage} completed successfully in ${Date.now() - startTime}ms`);
      return result;
    } catch (error) {
      this.results.stages[stage] = {
        success: false,
        duration: Date.now() - startTime,
        error: error.message
      };
      this.results.errors.push({ stage, error: error.message });
      this.log(`✗ Stage ${stage} failed: ${error.message}`);
      throw error;
    }
  }

  async prepareEnvironment() {
    this.log('Preparing environment...');
    
    // Check dependencies
    const dependencies = [
      { cmd: this.config.pythonPath, name: 'Python 3' },
      { cmd: this.config.nodePath, name: 'Node.js' }
    ];

    // Only check FFmpeg if segmentation is not skipped
    if (!this.config.skipSegmentation) {
      dependencies.push({ cmd: 'ffmpeg', name: 'FFmpeg' });
    }

    for (const dep of dependencies) {
      try {
        execSync(`${dep.cmd} --version`, { stdio: 'ignore' });
        this.log(`✓ ${dep.name} is available`);
      } catch (error) {
        throw new Error(`${dep.name} is required but not found`);
      }
    }

    // Create directories
    const dirs = [
      this.config.outputDir,
      this.config.mediaDir,
      this.config.segmentsDir,
      'scripts/pipeline'
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.log(`Created directory: ${dir}`);
      }
    }

    // Check API availability
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/api/health`);
      if (response.ok) {
        this.log('✓ API server is running');
      } else {
        throw new Error('API server responded with error');
      }
    } catch (error) {
      this.log('⚠ API server not available, some features may be limited');
    }

    return { directories: dirs, dependencies };
  }

  async convertPPTXToModules() {
    this.log('Converting PPTX files to modules...');
    
    const pythonScript = 'scripts/pipeline/pptx_to_module.py';
    const args = [
      pythonScript,
      '--input-dir', this.config.inputDir,
      '--output-dir', this.config.outputDir,
      '--force' // Force regeneration if needed
    ];

    if (this.config.dryRun) {
      this.log('DRY RUN: Would execute:', `${this.config.pythonPath} ${args.join(' ')}`);
      return { modulesProcessed: 0, dryRun: true };
    }

    try {
      const result = execSync(
        `${this.config.pythonPath} ${args.join(' ')}`,
        { 
          cwd: process.cwd(),
          stdio: 'pipe',
          encoding: 'utf8'
        }
      );

      // Parse results from Python script
      const lines = result.split('\n');
      let modulesProcessed = 0;
      
      lines.forEach(line => {
        if (line.includes('Successfully processed module:')) {
          modulesProcessed++;
        }
      });

      this.log(`Converted ${modulesProcessed} PPTX files to modules`);
      return { modulesProcessed, output: result };
    } catch (error) {
      this.log('PPTX conversion failed:', error.message);
      throw error;
    }
  }

  async segmentVideos() {
    if (this.config.skipSegmentation) {
      this.log('Skipping video segmentation as requested');
      return { segmentsCreated: 0, skipped: true };
    }

    this.log('Segmenting videos...');
    
    const pythonScript = 'scripts/pipeline/segment_videos.py';
    const args = [
      pythonScript,
      '--input-dir', this.config.mediaDir,
      '--output-dir', this.config.segmentsDir,
      '--duration', '900' // 15 minutes
    ];

    if (this.config.dryRun) {
      this.log('DRY RUN: Would execute:', `${this.config.pythonPath} ${args.join(' ')}`);
      return { segmentsCreated: 0, dryRun: true };
    }

    try {
      const result = execSync(
        `${this.config.pythonPath} ${args.join(' ')}`,
        { 
          cwd: process.cwd(),
          stdio: 'pipe',
          encoding: 'utf8'
        }
      );

      // Parse results
      const lines = result.split('\n');
      let segmentsCreated = 0;
      
      lines.forEach(line => {
        if (line.includes('Created segment:')) {
          segmentsCreated++;
        }
      });

      this.log(`Created ${segmentsCreated} video segments`);
      return { segmentsCreated, output: result };
    } catch (error) {
      this.log('Video segmentation failed:', error.message);
      throw error;
    }
  }

  async enhanceWithAI() {
    if (this.config.skipAI) {
      this.log('Skipping AI enhancement as requested');
      return { enhancedModules: 0, skipped: true };
    }

    this.log('Enhancing modules with AI...');
    
    const pythonScript = 'scripts/pipeline/ai_integration.py';
    const args = [
      pythonScript,
      '--modules-dir', this.config.outputDir,
      '--api-base-url', this.config.apiBaseUrl,
      '--timeout', '30'
    ];

    if (this.config.dryRun) {
      this.log('DRY RUN: Would execute:', `${this.config.pythonPath} ${args.join(' ')}`);
      return { enhancedModules: 0, dryRun: true };
    }

    try {
      const result = execSync(
        `${this.config.pythonPath} ${args.join(' ')}`,
        { 
          cwd: process.cwd(),
          stdio: 'pipe',
          encoding: 'utf8'
        }
      );

      // Parse results
      const lines = result.split('\n');
      let enhancedModules = 0;
      
      lines.forEach(line => {
        if (line.includes('Enhanced module:')) {
          enhancedModules++;
        }
      });

      this.log(`Enhanced ${enhancedModules} modules with AI content`);
      return { enhancedModules, output: result };
    } catch (error) {
      this.log('AI enhancement failed:', error.message);
      throw error;
    }
  }

  async validateContent() {
    this.log('Validating content...');
    
    const validationScripts = [
      'scripts/validate_modules.js',
      'scripts/validate_media.js',
      'scripts/data-validator.js'
    ];

    const validationResults = {};

    for (const script of validationScripts) {
      if (fs.existsSync(script)) {
        try {
          const result = execSync(
            `${this.config.nodePath} ${script}`,
            { 
              cwd: process.cwd(),
              stdio: 'pipe',
              encoding: 'utf8'
            }
          );
          
          validationResults[script] = { success: true, output: result };
          this.log(`✓ Validation passed: ${script}`);
        } catch (error) {
          validationResults[script] = { success: false, error: error.message };
          this.log(`✗ Validation failed: ${script} - ${error.message}`);
        }
      } else {
        this.log(`⚠ Validation script not found: ${script}`);
      }
    }

    return validationResults;
  }

  async deployContent() {
    this.log('Deploying content...');
    
    // Update module index
    const modulesDir = this.config.outputDir;
    const modules = [];

    if (fs.existsSync(modulesDir)) {
      const moduleDirs = fs.readdirSync(modulesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const moduleDir of moduleDirs) {
        const modulePath = path.join(modulesDir, moduleDir, 'module.json');
        if (fs.existsSync(modulePath)) {
          try {
            const moduleData = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
            modules.push({
              id: moduleDir,
              title: moduleData.title || moduleDir,
              description: moduleData.description || '',
              duration: moduleData.duration || 0,
              slides: moduleData.slides?.length || 0,
              updated: new Date().toISOString()
            });
          } catch (error) {
            this.log(`⚠ Failed to parse module: ${moduleDir}`);
          }
        }
      }
    }

    // Update modules index
    const modulesIndex = {
      generated: new Date().toISOString(),
      totalModules: modules.length,
      modules: modules
    };

    fs.writeFileSync(
      'public/data/ecg_modules.json',
      JSON.stringify(modulesIndex, null, 2)
    );

    this.log(`Updated modules index with ${modules.length} modules`);

    // Clear Next.js cache
    try {
      execSync('rm -rf .next', { stdio: 'ignore' });
      this.log('✓ Cleared Next.js cache');
    } catch (error) {
      this.log('⚠ Failed to clear Next.js cache');
    }

    return { modulesDeployed: modules.length, indexUpdated: true };
  }

  generateSummary() {
    const endTime = new Date();
    const totalDuration = endTime - this.results.startTime;
    
    this.results.summary = {
      totalDuration: totalDuration,
      stagesCompleted: Object.keys(this.results.stages).length,
      successfulStages: Object.values(this.results.stages).filter(s => s.success).length,
      failedStages: Object.values(this.results.stages).filter(s => !s.success).length,
      errors: this.results.errors.length,
      warnings: this.results.warnings.length
    };

    this.log('\n=== PIPELINE SUMMARY ===');
    this.log(`Total Duration: ${totalDuration}ms`);
    this.log(`Stages Completed: ${this.results.summary.stagesCompleted}`);
    this.log(`Successful: ${this.results.summary.successfulStages}`);
    this.log(`Failed: ${this.results.summary.failedStages}`);
    this.log(`Errors: ${this.results.summary.errors}`);
    this.log(`Warnings: ${this.results.summary.warnings}`);

    if (this.results.errors.length > 0) {
      this.log('\nErrors:');
      this.results.errors.forEach((error, index) => {
        this.log(`${index + 1}. [${error.stage}] ${error.error}`);
      });
    }

    return this.results.summary;
  }

  async run() {
    try {
      await this.runStage(STAGES.PREPARE, () => this.prepareEnvironment());
      await this.runStage(STAGES.CONVERT, () => this.convertPPTXToModules());
      await this.runStage(STAGES.SEGMENT, () => this.segmentVideos());
      await this.runStage(STAGES.AI_ENHANCE, () => this.enhanceWithAI());
      await this.runStage(STAGES.VALIDATE, () => this.validateContent());
      await this.runStage(STAGES.DEPLOY, () => this.deployContent());
      
      this.generateSummary();
      
      this.log('\n🎉 Content pipeline completed successfully!');
      return this.results;
    } catch (error) {
      this.log(`\n❌ Pipeline failed: ${error.message}`);
      this.generateSummary();
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--skip-ai':
        options.skipAI = true;
        break;
      case '--skip-segmentation':
        options.skipSegmentation = true;
        break;
      case '--force':
        options.forceRegenerate = true;
        break;
      case '--api-url':
        options.apiBaseUrl = args[++i];
        break;
      case '--help':
        console.log(`
ECG Content Pipeline Automation

Usage: node scripts/complete_pipeline.js [options]

Options:
  --dry-run              Show what would be done without executing
  --skip-ai              Skip AI enhancement step
  --skip-segmentation    Skip video segmentation step
  --force                Force regeneration of existing content
  --api-url <url>        API base URL (default: http://localhost:3000)
  --help                 Show this help message

Examples:
  node scripts/complete_pipeline.js
  node scripts/complete_pipeline.js --dry-run
  node scripts/complete_pipeline.js --skip-ai --force
        `);
        process.exit(0);
    }
  }

  const pipeline = new ContentPipeline(options);
  
  try {
    await pipeline.run();
    process.exit(0);
  } catch (error) {
    console.error('Pipeline failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ContentPipeline, STAGES };
