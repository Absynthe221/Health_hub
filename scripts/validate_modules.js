#!/usr/bin/env node

/**
 * Module Validation Script
 * Validates all module.json files against schema and checks for required media files
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// Module schema definition
const MODULE_SCHEMA = {
  type: 'object',
  required: [
    'moduleId',
    'moduleTitle',
    'description',
    'category',
    'difficulty',
    'status',
    'instructorId',
    'createdAt',
    'slides'
  ],
  properties: {
    moduleId: { type: 'string', pattern: '^mod_[a-zA-Z0-9_]+$' },
    moduleTitle: { type: 'string', minLength: 1, maxLength: 200 },
    description: { type: 'string', minLength: 1, maxLength: 1000 },
    overview: { type: 'string', maxLength: 2000 },
    objectives: { 
      type: 'array',
      items: { type: 'string', maxLength: 200 }
    },
    duration: { type: 'number', minimum: 1, maximum: 480 },
    difficulty: { 
      type: 'string',
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    category: { 
      type: 'string',
      enum: ['cardiology', 'anatomy', 'physiology', 'pathology', 'general']
    },
    prerequisites: { 
      type: 'array',
      items: { type: 'string' }
    },
    tags: { 
      type: 'array',
      items: { type: 'string', maxLength: 50 }
    },
    status: { 
      type: 'string',
      enum: ['draft', 'published', 'archived']
    },
    roleAccess: { 
      type: 'array',
      items: { 
        type: 'string',
        enum: ['learner', 'instructor', 'admin']
      }
    },
    instructorId: { type: 'string', minLength: 1 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    slides: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['slideNumber', 'title', 'content'],
        properties: {
          slideNumber: { type: 'number', minimum: 1 },
          title: { type: 'string', minLength: 1, maxLength: 200 },
          content: { type: 'string', minLength: 1 },
          interactive: { type: 'boolean' },
          quiz: {
            type: 'object',
            properties: {
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['question', 'options', 'correctAnswer'],
                  properties: {
                    question: { type: 'string', minLength: 1 },
                    options: { 
                      type: 'array',
                      minItems: 2,
                      maxItems: 6,
                      items: { type: 'string' }
                    },
                    correctAnswer: { type: 'number', minimum: 0 },
                    explanation: { type: 'string' }
                  }
                }
              }
            }
          },
          media: {
            type: 'object',
            properties: {
              image: { type: 'string' },
              audio: { type: 'string' },
              subtitle: { type: 'string' },
              video: { type: 'string' }
            }
          }
        }
      }
    },
    metadata: {
      type: 'object',
      properties: {
        totalSlides: { type: 'number', minimum: 1 },
        interactiveSlides: { type: 'number', minimum: 0 },
        quizItems: { type: 'number', minimum: 0 },
        estimatedDuration: { type: 'string' }
      }
    }
  }
}

// Slide schema for individual validation
const SLIDE_SCHEMA = {
  type: 'object',
  required: ['slideNumber', 'title', 'content'],
  properties: {
    slideNumber: { type: 'number', minimum: 1 },
    title: { type: 'string', minLength: 1, maxLength: 200 },
    content: { type: 'string', minLength: 1 },
    interactive: { type: 'boolean' },
    quiz: {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          items: {
            type: 'object',
            required: ['question', 'options', 'correctAnswer'],
            properties: {
              question: { type: 'string', minLength: 1 },
              options: { 
                type: 'array',
                minItems: 2,
                maxItems: 6,
                items: { type: 'string' }
              },
              correctAnswer: { type: 'number', minimum: 0 },
              explanation: { type: 'string' }
            }
          }
        }
      }
    },
    media: {
      type: 'object',
      properties: {
        image: { type: 'string' },
        audio: { type: 'string' },
        subtitle: { type: 'string' },
        video: { type: 'string' }
      }
    }
  }
}

/**
 * Simple JSON schema validator
 */
class SchemaValidator {
  constructor(schema) {
    this.schema = schema
  }

  validate(data, path = '') {
    const errors = []
    this._validate(data, this.schema, path, errors)
    return errors
  }

  _validate(data, schema, path, errors) {
    if (schema.type === 'object') {
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        errors.push(`${path}: Expected object, got ${typeof data}`)
        return
      }

      if (schema.required) {
        for (const field of schema.required) {
          if (!(field in data)) {
            errors.push(`${path}.${field}: Required field is missing`)
          }
        }
      }

      if (schema.properties) {
        for (const [key, value] of Object.entries(data)) {
          if (schema.properties[key]) {
            this._validate(value, schema.properties[key], `${path}.${key}`, errors)
          }
        }
      }
    } else if (schema.type === 'array') {
      if (!Array.isArray(data)) {
        errors.push(`${path}: Expected array, got ${typeof data}`)
        return
      }

      if (schema.minItems && data.length < schema.minItems) {
        errors.push(`${path}: Array must have at least ${schema.minItems} items`)
      }

      if (schema.maxItems && data.length > schema.maxItems) {
        errors.push(`${path}: Array must have at most ${schema.maxItems} items`)
      }

      if (schema.items) {
        data.forEach((item, index) => {
          this._validate(item, schema.items, `${path}[${index}]`, errors)
        })
      }
    } else if (schema.type === 'string') {
      if (typeof data !== 'string') {
        errors.push(`${path}: Expected string, got ${typeof data}`)
        return
      }

      if (schema.minLength && data.length < schema.minLength) {
        errors.push(`${path}: String must be at least ${schema.minLength} characters`)
      }

      if (schema.maxLength && data.length > schema.maxLength) {
        errors.push(`${path}: String must be at most ${schema.maxLength} characters`)
      }

      if (schema.pattern && !new RegExp(schema.pattern).test(data)) {
        errors.push(`${path}: String does not match required pattern`)
      }

      if (schema.enum && !schema.enum.includes(data)) {
        errors.push(`${path}: String must be one of: ${schema.enum.join(', ')}`)
      }

      if (schema.format === 'date-time') {
        if (isNaN(Date.parse(data))) {
          errors.push(`${path}: Invalid date-time format`)
        }
      }
    } else if (schema.type === 'number') {
      if (typeof data !== 'number') {
        errors.push(`${path}: Expected number, got ${typeof data}`)
        return
      }

      if (schema.minimum && data < schema.minimum) {
        errors.push(`${path}: Number must be at least ${schema.minimum}`)
      }

      if (schema.maximum && data > schema.maximum) {
        errors.push(`${path}: Number must be at most ${schema.maximum}`)
      }
    } else if (schema.type === 'boolean') {
      if (typeof data !== 'boolean') {
        errors.push(`${path}: Expected boolean, got ${typeof data}`)
      }
    }
  }
}

/**
 * Validate a single module file
 */
async function validateModule(modulePath) {
  const errors = []
  const warnings = []

  try {
    // Read and parse module.json
    const moduleContent = await fs.readFile(modulePath, 'utf8')
    const moduleData = JSON.parse(moduleContent)

    // Validate against schema
    const validator = new SchemaValidator(MODULE_SCHEMA)
    const schemaErrors = validator.validate(moduleData)
    errors.push(...schemaErrors)

    // Additional business logic validations
    await validateBusinessLogic(moduleData, modulePath, errors, warnings)

    return {
      path: modulePath,
      valid: errors.length === 0,
      errors,
      warnings
    }
  } catch (error) {
    return {
      path: modulePath,
      valid: false,
      errors: [`Failed to parse module.json: ${error.message}`],
      warnings: []
    }
  }
}

/**
 * Validate business logic rules
 */
async function validateBusinessLogic(moduleData, modulePath, errors, warnings) {
  const moduleDir = path.dirname(modulePath)

  // Validate slide numbers are sequential
  const slideNumbers = moduleData.slides.map(slide => slide.slideNumber).sort((a, b) => a - b)
  for (let i = 0; i < slideNumbers.length; i++) {
    if (slideNumbers[i] !== i + 1) {
      errors.push(`Slide numbers must be sequential starting from 1`)
      break
    }
  }

  // Validate each slide
  for (let i = 0; i < moduleData.slides.length; i++) {
    const slide = moduleData.slides[i]
    await validateSlide(slide, moduleDir, i, errors, warnings)
  }

  // Validate metadata consistency
  if (moduleData.metadata) {
    const actualSlideCount = moduleData.slides.length
    const actualInteractiveCount = moduleData.slides.filter(s => s.interactive).length
    const actualQuizCount = moduleData.slides.filter(s => s.quiz).length

    if (moduleData.metadata.totalSlides !== actualSlideCount) {
      errors.push(`Metadata totalSlides (${moduleData.metadata.totalSlides}) does not match actual slide count (${actualSlideCount})`)
    }

    if (moduleData.metadata.interactiveSlides !== actualInteractiveCount) {
      errors.push(`Metadata interactiveSlides (${moduleData.metadata.interactiveSlides}) does not match actual interactive slide count (${actualInteractiveCount})`)
    }

    if (moduleData.metadata.quizItems !== actualQuizCount) {
      errors.push(`Metadata quizItems (${moduleData.metadata.quizItems}) does not match actual quiz count (${actualQuizCount})`)
    }
  }

  // Validate quiz questions
  for (const slide of moduleData.slides) {
    if (slide.quiz && slide.quiz.questions) {
      for (const question of slide.quiz.questions) {
        if (question.correctAnswer >= question.options.length) {
          errors.push(`Slide ${slide.slideNumber}: Quiz question has invalid correctAnswer index`)
        }
      }
    }
  }
}

/**
 * Validate individual slide
 */
async function validateSlide(slide, moduleDir, index, errors, warnings) {
  // Check for required media files
  if (slide.media) {
    const mediaFiles = [
      { key: 'image', path: slide.media.image },
      { key: 'audio', path: slide.media.audio },
      { key: 'subtitle', path: slide.media.subtitle },
      { key: 'video', path: slide.media.video }
    ]

    for (const media of mediaFiles) {
      if (media.path) {
        const fullPath = path.resolve(moduleDir, media.path)
        try {
          await fs.access(fullPath)
        } catch {
          errors.push(`Slide ${slide.slideNumber}: ${media.key} file not found: ${media.path}`)
        }
      }
    }
  }

  // Validate interactive slides have required content
  if (slide.interactive && !slide.quiz) {
    warnings.push(`Slide ${slide.slideNumber}: Interactive slide should have quiz content`)
  }

  // Validate quiz structure
  if (slide.quiz) {
    if (!slide.quiz.questions || slide.quiz.questions.length === 0) {
      errors.push(`Slide ${slide.slideNumber}: Quiz must have at least one question`)
    }

    for (let i = 0; i < slide.quiz.questions.length; i++) {
      const question = slide.quiz.questions[i]
      
      if (question.options.length < 2) {
        errors.push(`Slide ${slide.slideNumber}, Question ${i + 1}: Must have at least 2 options`)
      }

      if (question.options.length > 6) {
        errors.push(`Slide ${slide.slideNumber}, Question ${i + 1}: Must have at most 6 options`)
      }

      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        errors.push(`Slide ${slide.slideNumber}, Question ${i + 1}: Invalid correctAnswer index`)
      }
    }
  }
}

/**
 * Find all module.json files
 */
async function findModuleFiles() {
  const modulesDir = path.join(projectRoot, 'public', 'modules')
  const moduleFiles = []

  try {
    const entries = await fs.readdir(modulesDir, { withFileTypes: true })
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const moduleJsonPath = path.join(modulesDir, entry.name, 'module.json')
        try {
          await fs.access(moduleJsonPath)
          moduleFiles.push(moduleJsonPath)
        } catch {
          // module.json doesn't exist in this directory
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read modules directory: ${error.message}`)
  }

  return moduleFiles
}

/**
 * Main validation function
 */
async function main() {
  console.log('🔍 Validating ECG Platform Modules...\n')

  const moduleFiles = await findModuleFiles()
  
  if (moduleFiles.length === 0) {
    console.log('⚠️  No module.json files found in public/modules/')
    process.exit(0)
  }

  console.log(`📁 Found ${moduleFiles.length} module files to validate\n`)

  const results = []
  let totalErrors = 0
  let totalWarnings = 0

  for (const moduleFile of moduleFiles) {
    const result = await validateModule(moduleFile)
    results.push(result)
    
    const moduleName = path.basename(path.dirname(moduleFile))
    
    if (result.valid) {
      console.log(`✅ ${moduleName}: Valid${result.warnings.length > 0 ? ` (${result.warnings.length} warnings)` : ''}`)
    } else {
      console.log(`❌ ${moduleName}: ${result.errors.length} errors${result.warnings.length > 0 ? `, ${result.warnings.length} warnings` : ''}`)
    }

    totalErrors += result.errors.length
    totalWarnings += result.warnings.length

    // Print errors and warnings
    result.errors.forEach(error => {
      console.log(`   🔴 ${error}`)
    })
    
    result.warnings.forEach(warning => {
      console.log(`   🟡 ${warning}`)
    })
  }

  console.log(`\n📊 Validation Summary:`)
  console.log(`   📁 Total modules: ${moduleFiles.length}`)
  console.log(`   ✅ Valid modules: ${results.filter(r => r.valid).length}`)
  console.log(`   ❌ Invalid modules: ${results.filter(r => !r.valid).length}`)
  console.log(`   🔴 Total errors: ${totalErrors}`)
  console.log(`   🟡 Total warnings: ${totalWarnings}`)

  if (totalErrors > 0) {
    console.log('\n❌ Module validation failed!')
    process.exit(1)
  } else {
    console.log('\n✅ All modules validated successfully!')
    process.exit(0)
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('💥 Validation failed:', error)
    process.exit(1)
  })
}

export { validateModule, findModuleFiles, MODULE_SCHEMA, SLIDE_SCHEMA }

