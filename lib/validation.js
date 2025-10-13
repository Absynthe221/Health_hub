// JSON Schema validation for ECG modules
const moduleSchema = {
  type: "object",
  required: ["moduleId", "moduleTitle", "slides"],
  properties: {
    moduleId: { type: "string" },
    moduleTitle: { type: "string" },
    description: { type: "string" },
    slides: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "title", "contentType", "interactive"],
        properties: {
          id: { type: "number" },
          title: { type: "string" },
          contentType: { type: "string" },
          interactive: { type: "boolean" },
          content: { type: "string" },
          quiz: {
            type: "object",
            properties: {
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correctAnswer: { type: "number" },
              explanation: { type: "string" }
            }
          },
          ai: {
            type: "object",
            properties: {
              generateQuiz: { type: "boolean" },
              summarizeSlide: { type: "boolean" },
              explainECG: { type: "boolean" }
            }
          }
        }
      }
    },
    metadata: {
      type: "object",
      properties: {
        totalSlides: { type: "number" },
        interactiveSlides: { type: "number" },
        quizItems: { type: "number" },
        estimatedDuration: { type: "string" },
        difficulty: { type: "string" },
        tags: { type: "array", items: { type: "string" } }
      }
    },
    status: { type: "string", enum: ["draft", "active", "archived"] },
    createdAt: { type: "string" },
    updatedAt: { type: "string" }
  }
};

export function validateModuleSchema(module) {
  const errors = [];
  
  // Check required fields
  if (!module.moduleId) errors.push("Missing moduleId");
  if (!module.moduleTitle) errors.push("Missing moduleTitle");
  if (!module.slides || !Array.isArray(module.slides)) {
    errors.push("Missing or invalid slides array");
  }
  
  // Validate slides
  if (module.slides) {
    module.slides.forEach((slide, index) => {
      if (!slide.id) errors.push(`Slide ${index + 1}: Missing id`);
      if (!slide.title) errors.push(`Slide ${index + 1}: Missing title`);
      if (!slide.contentType) errors.push(`Slide ${index + 1}: Missing contentType`);
      if (typeof slide.interactive !== 'boolean') {
        errors.push(`Slide ${index + 1}: Missing or invalid interactive flag`);
      }
      
      // Validate quiz if present
      if (slide.quiz) {
        if (!slide.quiz.question) errors.push(`Slide ${index + 1}: Quiz missing question`);
        if (!slide.quiz.options || !Array.isArray(slide.quiz.options)) {
          errors.push(`Slide ${index + 1}: Quiz missing or invalid options`);
        }
        if (typeof slide.quiz.correctAnswer !== 'number') {
          errors.push(`Slide ${index + 1}: Quiz missing or invalid correctAnswer`);
        }
      }
    });
  }
  
  // Validate metadata
  if (module.metadata) {
    if (typeof module.metadata.totalSlides !== 'number') {
      errors.push("Metadata: Invalid totalSlides");
    }
    if (typeof module.metadata.interactiveSlides !== 'number') {
      errors.push("Metadata: Invalid interactiveSlides");
    }
    if (typeof module.metadata.quizItems !== 'number') {
      errors.push("Metadata: Invalid quizItems");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateAllModules(modules) {
  const results = [];
  let totalValid = 0;
  let totalInvalid = 0;
  
  modules.forEach(module => {
    const validation = validateModuleSchema(module);
    results.push({
      moduleId: module.moduleId,
      moduleTitle: module.moduleTitle,
      ...validation
    });
    
    if (validation.isValid) {
      totalValid++;
    } else {
      totalInvalid++;
    }
  });
  
  return {
    results,
    summary: {
      totalModules: modules.length,
      validModules: totalValid,
      invalidModules: totalInvalid,
      validationRate: (totalValid / modules.length * 100).toFixed(1) + '%'
    }
  };
}

export function generateValidationReport(modules) {
  const validation = validateAllModules(modules);
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: validation.summary,
    details: validation.results,
    recommendations: []
  };
  
  // Generate recommendations based on common issues
  const allErrors = validation.results.flatMap(r => r.errors);
  const errorCounts = {};
  allErrors.forEach(error => {
    errorCounts[error] = (errorCounts[error] || 0) + 1;
  });
  
  if (errorCounts["Missing quiz missing question"]) {
    report.recommendations.push("Review quiz questions across modules");
  }
  if (errorCounts["Missing or invalid interactive flag"]) {
    report.recommendations.push("Ensure all slides have proper interactive flags");
  }
  if (errorCounts["Metadata: Invalid totalSlides"]) {
    report.recommendations.push("Update metadata calculations for slide counts");
  }
  
  return report;
}

