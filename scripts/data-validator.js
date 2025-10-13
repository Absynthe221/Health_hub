#!/usr/bin/env node

/**
 * Health Hub ECG Data Structure Validator
 * =======================================
 * 
 * Validates data structures against defined schemas:
 * - Module JSON schema validation
 * - Slide data integrity
 * - Media file consistency
 * - Question format validation
 * - API response validation
 */

const fs = require('fs');
const path = require('path');

class DataValidator {
  constructor() {
    this.schemas = this.defineSchemas();
    this.results = {
      valid: true,
      errors: [],
      warnings: [],
      stats: {
        modulesValidated: 0,
        slidesValidated: 0,
        questionsValidated: 0,
        mediaFilesChecked: 0
      }
    };
  }

  defineSchemas() {
    return {
      module: {
        type: 'object',
        required: ['id', 'title', 'description', 'duration', 'difficulty'],
        properties: {
          id: { type: 'string', minLength: 1 },
          title: { type: 'string', minLength: 1 },
          description: { type: 'string', minLength: 1 },
          duration: { type: 'number', minimum: 1 },
          difficulty: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'] },
          slides: { type: 'array', minItems: 1 },
          hasImages: { type: 'boolean' },
          imageCount: { type: 'number', minimum: 0 },
          hasAudio: { type: 'boolean' },
          hasSubtitles: { type: 'boolean' },
          totalSlides: { type: 'number', minimum: 1 }
        }
      },
      slide: {
        type: 'object',
        required: ['name', 'content'],
        properties: {
          name: { type: 'string', minLength: 1 },
          content: { type: 'string', minLength: 1 },
          url: { type: 'string' },
          narration: { type: 'string' },
          audio: { type: 'string' },
          subtitles: { type: 'string' },
          images: { type: 'array' },
          mcqs: { type: 'array' },
          questions: { type: 'array' },
          audioFile: { type: 'string' },
          duration: { type: 'number' }
        }
      },
      question: {
        type: 'object',
        required: ['question', 'options', 'answer'],
        properties: {
          question: { type: 'string', minLength: 10 },
          options: { 
            type: 'array', 
            minItems: 2, 
            maxItems: 6,
            items: { type: 'string', minLength: 1 }
          },
          answer: { type: 'string', minLength: 1 }
        }
      },
      segment: {
        type: 'object',
        required: ['id', 'video', 'duration', 'start', 'end'],
        properties: {
          id: { type: 'number' },
          video: { type: 'string', minLength: 1 },
          duration: { type: 'number', minimum: 1 },
          start: { type: 'number', minimum: 0 },
          end: { type: 'number', minimum: 1 },
          mcqs: { type: 'array' }
        }
      }
    };
  }

  validateSchema(data, schema, path = '') {
    const errors = [];
    const warnings = [];

    // Required fields check
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in data)) {
          errors.push(`Missing required field '${field}' at ${path}`);
        }
      }
    }

    // Type validation
    if (schema.type) {
      const actualType = Array.isArray(data) ? 'array' : typeof data;
      if (actualType !== schema.type) {
        errors.push(`Expected ${schema.type}, got ${actualType} at ${path}`);
      }
    }

    // String validation
    if (schema.type === 'string') {
      if (schema.minLength && data.length < schema.minLength) {
        errors.push(`String too short at ${path}: minimum ${schema.minLength} characters`);
      }
      if (schema.maxLength && data.length > schema.maxLength) {
        warnings.push(`String too long at ${path}: maximum ${schema.maxLength} characters`);
      }
    }

    // Number validation
    if (schema.type === 'number') {
      if (schema.minimum && data < schema.minimum) {
        errors.push(`Number too small at ${path}: minimum ${schema.minimum}`);
      }
      if (schema.maximum && data > schema.maximum) {
        warnings.push(`Number too large at ${path}: maximum ${schema.maximum}`);
      }
    }

    // Array validation
    if (schema.type === 'array') {
      if (schema.minItems && data.length < schema.minItems) {
        errors.push(`Array too short at ${path}: minimum ${schema.minItems} items`);
      }
      if (schema.maxItems && data.length > schema.maxItems) {
        warnings.push(`Array too long at ${path}: maximum ${schema.maxItems} items`);
      }
      if (schema.items) {
        data.forEach((item, index) => {
          const itemErrors = this.validateSchema(item, schema.items, `${path}[${index}]`);
          errors.push(...itemErrors.errors);
          warnings.push(...itemErrors.warnings);
        });
      }
    }

    // Object validation
    if (schema.type === 'object' && schema.properties) {
      for (const [key, value] of Object.entries(data)) {
        if (schema.properties[key]) {
          const propErrors = this.validateSchema(value, schema.properties[key], `${path}.${key}`);
          errors.push(...propErrors.errors);
          warnings.push(...propErrors.warnings);
        } else {
          warnings.push(`Unexpected property '${key}' at ${path}`);
        }
      }
    }

    // Enum validation
    if (schema.enum && !schema.enum.includes(data)) {
      errors.push(`Invalid value at ${path}: expected one of ${schema.enum.join(', ')}`);
    }

    return { errors, warnings };
  }

  validateModule(module) {
    this.results.stats.modulesValidated++;
    
    // Load the actual module data from module.json
    const moduleDir = path.join(__dirname, '..', 'assets', module.title);
    const moduleJsonPath = path.join(moduleDir, 'module.json');
    
    if (!fs.existsSync(moduleJsonPath)) {
      this.results.errors.push(`Module JSON not found: ${module.title}`);
      return false;
    }

    let moduleData;
    try {
      moduleData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
    } catch (error) {
      this.results.errors.push(`Invalid module JSON: ${module.title} - ${error.message}`);
      return false;
    }

    // Validate the module structure (without slides requirement for master index)
    const moduleSchema = { ...this.schemas.module };
    delete moduleSchema.required; // Remove required fields for master index validation
    
    const moduleErrors = this.validateSchema(module, moduleSchema, `module.${module.id}`);
    this.results.errors.push(...moduleErrors.errors);
    this.results.warnings.push(...moduleErrors.warnings);

    // Validate slides from the actual module data
    if (moduleData.slides && Array.isArray(moduleData.slides)) {
      moduleData.slides.forEach((slide, index) => {
        this.results.stats.slidesValidated++;
        const slideErrors = this.validateSchema(slide, this.schemas.slide, `module.${module.title}.slides[${index}]`);
        this.results.errors.push(...slideErrors.errors);
        this.results.warnings.push(...slideErrors.warnings);

        // Validate questions
        if (slide.mcqs && Array.isArray(slide.mcqs)) {
          slide.mcqs.forEach((question, qIndex) => {
            this.results.stats.questionsValidated++;
            const questionErrors = this.validateSchema(question, this.schemas.question, 
              `module.${module.title}.slides[${index}].mcqs[${qIndex}]`);
            this.results.errors.push(...questionErrors.errors);
            this.results.warnings.push(...questionErrors.warnings);
          });
        }
      });
    }

    // Validate segments from the actual module data
    if (moduleData.segments && Array.isArray(moduleData.segments)) {
      if (moduleData.segments.length === 0) {
        this.results.errors.push(`segments[] is empty: ${module.title}`);
      }
      moduleData.segments.forEach((segment, index) => {
        const segErrors = this.validateSchema(segment, this.schemas.segment, `module.${module.title}.segments[${index}]`);
        this.results.errors.push(...segErrors.errors);
        this.results.warnings.push(...segErrors.warnings);
        if (typeof segment.end === 'number' && typeof segment.start === 'number' && segment.end <= segment.start) {
          this.results.errors.push(`Invalid segment timing (end <= start) at module.${module.title}.segments[${index}]`);
        }
      });
    }

    // Require either slides[] or segments[]
    if ((!moduleData.slides || moduleData.slides.length === 0) && (!moduleData.segments || moduleData.segments.length === 0)) {
      this.results.errors.push(`Module must contain slides[] or segments[]: ${module.title}`);
    }

    return moduleErrors.errors.length === 0;
  }

  validateMediaFiles(module) {
    const moduleDir = path.join(__dirname, '..', 'assets', module.title);
    const moduleJsonPath = path.join(moduleDir, 'module.json');

    if (!fs.existsSync(moduleJsonPath)) {
      this.results.errors.push(`Module JSON not found: ${module.title}`);
      return false;
    }

    const moduleData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
    let valid = true;

    if (moduleData.slides) {
      moduleData.slides.forEach((slide, index) => {
        // Check audio files
        if (slide.audio) {
          this.results.stats.mediaFilesChecked++;
          if (!fs.existsSync(slide.audio)) {
            this.results.errors.push(`Audio file not found: ${slide.audio}`);
            valid = false;
          } else {
            // Check file size (should be > 0)
            const stats = fs.statSync(slide.audio);
            if (stats.size === 0) {
              this.results.errors.push(`Audio file is empty: ${slide.audio}`);
              valid = false;
            }
          }
        }

        // Check subtitle files
        if (slide.subtitles) {
          this.results.stats.mediaFilesChecked++;
          if (!fs.existsSync(slide.subtitles)) {
            this.results.errors.push(`Subtitle file not found: ${slide.subtitles}`);
            valid = false;
          } else {
            // Check SRT format
            const content = fs.readFileSync(slide.subtitles, 'utf8');
            if (!this.validateSRTFormat(content)) {
              this.results.warnings.push(`Invalid SRT format: ${slide.subtitles}`);
            }
          }
        }

        // Check image files
        if (slide.images && Array.isArray(slide.images)) {
          slide.images.forEach((imagePath, imgIndex) => {
            this.results.stats.mediaFilesChecked++;
            if (!fs.existsSync(imagePath)) {
              this.results.errors.push(`Image file not found: ${imagePath}`);
              valid = false;
            } else {
              // Check file extension
              const ext = path.extname(imagePath).toLowerCase();
              if (!['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
                this.results.warnings.push(`Unsupported image format: ${imagePath}`);
              }
            }
          });
        }
      });
    }

    // Validate segment video files
    if (moduleData.segments && Array.isArray(moduleData.segments)) {
      moduleData.segments.forEach((segment, index) => {
        if (segment.video) {
          this.results.stats.mediaFilesChecked++;
          const segPath = segment.video.startsWith('/')
            ? path.join(process.cwd(), segment.video)
            : path.join(moduleDir, segment.video);
          if (!fs.existsSync(segPath)) {
            this.results.errors.push(`Segment video not found: ${segment.video} (module ${module.title})`);
            valid = false;
          } else {
            const stats = fs.statSync(segPath);
            if (stats.size === 0) {
              this.results.errors.push(`Segment video is empty: ${segment.video}`);
              valid = false;
            }
          }
        } else {
          this.results.errors.push(`segments[${index}].video missing for module ${module.title}`);
          valid = false;
        }
      });
    }

    return valid;
  }

  validateSRTFormat(content) {
    // Basic SRT format validation
    const lines = content.split('\n');
    let i = 0;
    
    while (i < lines.length) {
      // Check for sequence number
      if (!/^\d+$/.test(lines[i].trim())) {
        return false;
      }
      i++;
      
      // Check for timestamp
      if (!/^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/.test(lines[i].trim())) {
        return false;
      }
      i++;
      
      // Skip subtitle text (until empty line)
      while (i < lines.length && lines[i].trim() !== '') {
        i++;
      }
      i++; // Skip empty line
    }
    
    return true;
  }

  validateAPIResponse(response) {
    const errors = [];
    const warnings = [];

    if (!Array.isArray(response)) {
      errors.push('API response should be an array');
      return { errors, warnings };
    }

    if (response.length === 0) {
      warnings.push('API response is empty');
    }

    response.forEach((module, index) => {
      const moduleErrors = this.validateSchema(module, this.schemas.module, `api[${index}]`);
      errors.push(...moduleErrors.errors);
      warnings.push(...moduleErrors.warnings);
    });

    return { errors, warnings };
  }

  async run() {
    console.log('🔍 Starting Health Hub ECG Data Validation...\n');

    try {
      // Load modules index
      const modulesIndexPath = path.join(__dirname, '..', 'assets', 'ecg-modules.json');
      if (!fs.existsSync(modulesIndexPath)) {
        throw new Error('ecg-modules.json not found');
      }

      const modules = JSON.parse(fs.readFileSync(modulesIndexPath, 'utf8'));
      console.log(`📊 Validating ${modules.length} modules...\n`);

      // Validate each module
      for (const module of modules) {
        console.log(`Validating module: ${module.title}`);
        const moduleValid = this.validateModule(module);
        const mediaValid = this.validateMediaFiles(module);
        
        if (!moduleValid || !mediaValid) {
          this.results.valid = false;
        }
      }

      // Generate report
      this.generateReport();

      // Save validation results
      const resultsPath = path.join(__dirname, '..', 'assets', 'validation-results.json');
      fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
      console.log(`\n📄 Validation results saved to: ${resultsPath}`);

      return this.results.valid;

    } catch (error) {
      console.error(`❌ Validation failed: ${error.message}`);
      return false;
    }
  }

  generateReport() {
    console.log('\n📋 HEALTH HUB ECG DATA VALIDATION REPORT');
    console.log('=' .repeat(50));

    console.log(`\n📊 SUMMARY:`);
    console.log(`  Modules Validated: ${this.results.stats.modulesValidated}`);
    console.log(`  Slides Validated: ${this.results.stats.slidesValidated}`);
    console.log(`  Questions Validated: ${this.results.stats.questionsValidated}`);
    console.log(`  Media Files Checked: ${this.results.stats.mediaFilesChecked}`);

    console.log(`\n📈 RESULTS:`);
    console.log(`  Valid: ${this.results.valid ? '✅ YES' : '❌ NO'}`);
    console.log(`  Errors: ${this.results.errors.length}`);
    console.log(`  Warnings: ${this.results.warnings.length}`);

    if (this.results.errors.length > 0) {
      console.log(`\n❌ ERRORS:`);
      this.results.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (this.results.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS:`);
      this.results.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }

    console.log(`\n🎯 RECOMMENDATIONS:`);
    if (this.results.valid) {
      console.log(`  ✅ Data structure is valid and ready for production`);
    } else {
      console.log(`  ❌ Fix all errors before deployment`);
    }
    if (this.results.warnings.length > 0) {
      console.log(`  ⚠️  Address warnings for optimal performance`);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new DataValidator();
  validator.run().then(valid => {
    process.exit(valid ? 0 : 1);
  });
}

module.exports = DataValidator;
