/**
 * Production Configuration for Health Hub ECG Platform
 * This file contains all production environment settings
 */

module.exports = {
  // ===========================================
  // APPLICATION CONFIGURATION
  // ===========================================
  app: {
    name: 'Health Hub ECG',
    description: 'Comprehensive ECG Learning Platform for Healthcare Professionals',
    version: '1.0.0',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com',
    environment: 'production'
  },

  // ===========================================
  // DATABASE CONFIGURATION
  // ===========================================
  database: {
    url: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/healthhub_ecg_prod',
    pool: {
      size: parseInt(process.env.DB_POOL_SIZE) || 20,
      connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 60000,
      queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 30000
    },
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },

  // ===========================================
  // AUTHENTICATION & SECURITY
  // ===========================================
  auth: {
    nextAuthUrl: process.env.NEXTAUTH_URL || 'https://your-domain.com',
    nextAuthSecret: process.env.NEXTAUTH_SECRET || 'your-super-secret-nextauth-key',
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE) || 2592000,
    sessionUpdateAge: parseInt(process.env.SESSION_UPDATE_AGE) || 86400
  },

  // ===========================================
  // AI SERVICES CONFIGURATION
  // ===========================================
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      modelGPT4: process.env.OPENAI_MODEL_GPT4 || 'gpt-4o',
      modelGPT35: process.env.OPENAI_MODEL_GPT35 || 'gpt-3.5-turbo',
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 2000,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7
    },
    timeouts: {
      quizGeneration: parseInt(process.env.AI_QUIZ_GENERATION_TIMEOUT) || 30000,
      caseStudy: parseInt(process.env.AI_CASE_STUDY_TIMEOUT) || 45000,
      summarization: parseInt(process.env.AI_SUMMARIZATION_TIMEOUT) || 25000
    }
  },

  // ===========================================
  // FILE STORAGE & MEDIA
  // ===========================================
  storage: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 50000000,
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    mediaDir: process.env.MEDIA_DIR || './public/media',
    allowedTypes: {
      image: (process.env.ALLOWED_IMAGE_TYPES || 'jpg,jpeg,png,gif,svg,webp').split(','),
      video: (process.env.ALLOWED_VIDEO_TYPES || 'mp4,webm,ogg').split(','),
      audio: (process.env.ALLOWED_AUDIO_TYPES || 'mp3,wav,ogg,aac').split(','),
      document: (process.env.ALLOWED_DOCUMENT_TYPES || 'pdf,doc,docx,pptx,txt').split(',')
    }
  },

  // ===========================================
  // PIPELINE CONFIGURATION
  // ===========================================
  pipeline: {
    enabled: process.env.PIPELINE_ENABLED === 'true',
    workerCount: parseInt(process.env.PIPELINE_WORKER_COUNT) || 4,
    queueSize: parseInt(process.env.PIPELINE_QUEUE_SIZE) || 100,
    retryAttempts: parseInt(process.env.PIPELINE_RETRY_ATTEMPTS) || 3,
    retryDelay: parseInt(process.env.PIPELINE_RETRY_DELAY) || 5000,
    ffmpeg: {
      path: process.env.FFMPEG_PATH || '/usr/bin/ffmpeg',
      threads: parseInt(process.env.FFMPEG_THREADS) || 4,
      quality: process.env.FFMPEG_QUALITY || 'high'
    },
    python: {
      path: process.env.PYTHON_PATH || '/usr/bin/python3',
      scriptsDir: process.env.PIPELINE_SCRIPTS_DIR || './scripts/pipeline'
    }
  },

  // ===========================================
  // CACHING & PERFORMANCE
  // ===========================================
  cache: {
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD || '',
      db: parseInt(process.env.REDIS_DB) || 0
    },
    ttl: parseInt(process.env.CACHE_TTL) || 3600,
    maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 1000,
    strategy: process.env.CACHE_STRATEGY || 'lru'
  },

  // ===========================================
  // MONITORING & LOGGING
  // ===========================================
  monitoring: {
    logLevel: process.env.LOG_LEVEL || 'info',
    logFormat: process.env.LOG_FORMAT || 'json',
    logFile: process.env.LOG_FILE || './logs/app.log',
    logMaxSize: process.env.LOG_MAX_SIZE || '10m',
    logMaxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT) || 9090,
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000
  },

  // ===========================================
  // EMAIL CONFIGURATION
  // ===========================================
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
      from: process.env.SMTP_FROM || 'Health Hub ECG <noreply@healthhub.com>'
    },
    templatesDir: process.env.EMAIL_TEMPLATES_DIR || './templates/email'
  },

  // ===========================================
  // SECURITY SETTINGS
  // ===========================================
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN || 'https://your-domain.com',
      credentials: process.env.CORS_CREDENTIALS === 'true'
    },
    rateLimit: {
      window: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000,
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100
    },
    csp: {
      enabled: process.env.CSP_ENABLED === 'true',
      reportUri: process.env.CSP_REPORT_URI || '/api/csp-report'
    }
  },

  // ===========================================
  // FEATURE FLAGS
  // ===========================================
  features: {
    aiEnhancement: process.env.FEATURE_AI_ENHANCEMENT === 'true',
    pipelineAutomation: process.env.FEATURE_PIPELINE_AUTOMATION === 'true',
    realTimeAnalytics: process.env.FEATURE_REAL_TIME_ANALYTICS === 'true',
    socialLearning: process.env.FEATURE_SOCIAL_LEARNING === 'true',
    mobileApp: process.env.FEATURE_MOBILE_APP === 'true',
    advancedAI: process.env.FEATURE_ADVANCED_AI === 'true'
  }
};

