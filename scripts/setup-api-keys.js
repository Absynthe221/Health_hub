#!/usr/bin/env node

/**
 * API Keys Setup Script for Health Hub ECG Platform
 * This script helps configure API keys and external service integrations
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function setupApiKeys() {
  console.log('🔑 Setting up API Keys for Health Hub ECG Platform...\n');

  try {
    // 1. OpenAI API Key Setup
    console.log('1. OpenAI API Configuration');
    console.log('   For AI-powered quiz generation, case studies, and content enhancement');
    console.log('   Get your API key from: https://platform.openai.com/api-keys\n');

    const openaiKey = await question('   Enter your OpenAI API key (or press Enter to skip): ');
    
    if (openaiKey.trim()) {
      console.log('   ✅ OpenAI API key configured');
    } else {
      console.log('   ⚠️  OpenAI API key not provided - AI features will use fallback content');
    }

    // 2. Database Configuration
    console.log('\n2. Database Configuration');
    console.log('   PostgreSQL database connection string');
    console.log('   Format: postgresql://username:password@host:port/database\n');

    const dbUrl = await question('   Enter your PostgreSQL connection string (or press Enter for default): ');
    
    if (dbUrl.trim()) {
      console.log('   ✅ Database URL configured');
    } else {
      console.log('   ⚠️  Using default database URL - make sure to update for production');
    }

    // 3. Email Configuration
    console.log('\n3. Email Configuration (Optional)');
    console.log('   For user notifications and password resets\n');

    const smtpHost = await question('   Enter SMTP host (or press Enter to skip): ');
    const smtpUser = await question('   Enter SMTP username (or press Enter to skip): ');
    const smtpPass = await question('   Enter SMTP password (or press Enter to skip): ');

    // 4. Redis Configuration (Optional)
    console.log('\n4. Redis Configuration (Optional)');
    console.log('   For caching and session storage\n');

    const redisUrl = await question('   Enter Redis URL (or press Enter to skip): ');

    // 5. Generate environment configuration
    await generateEnvConfig({
      openaiKey: openaiKey.trim(),
      dbUrl: dbUrl.trim(),
      smtp: {
        host: smtpHost.trim(),
        user: smtpUser.trim(),
        pass: smtpPass.trim()
      },
      redisUrl: redisUrl.trim()
    });

    console.log('\n🎉 API Keys setup completed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Copy .env.local to your production server');
    console.log('   2. Update the values with your production credentials');
    console.log('   3. Run: npm run db:generate');
    console.log('   4. Run: npm run db:push');
    console.log('   5. Run: node scripts/setup-database.js');

  } catch (error) {
    console.error('❌ API Keys setup failed:', error);
  } finally {
    rl.close();
  }
}

async function generateEnvConfig(config) {
  console.log('\n5. Generating environment configuration...');

  const envContent = `# Health Hub ECG Platform - Environment Configuration
# Generated on ${new Date().toISOString()}

# ===========================================
# APPLICATION CONFIGURATION
# ===========================================
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME="Health Hub ECG"
NEXT_PUBLIC_APP_DESCRIPTION="Comprehensive ECG Learning Platform for Healthcare Professionals"

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
DATABASE_URL="${config.dbUrl || 'postgresql://username:password@localhost:5432/healthhub_ecg_prod'}"
DB_POOL_SIZE=20
DB_CONNECTION_TIMEOUT=60000
DB_QUERY_TIMEOUT=30000

# ===========================================
# AUTHENTICATION & SECURITY
# ===========================================
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=${generateRandomSecret()}
NEXTAUTH_DEBUG=false

JWT_SECRET=${generateRandomSecret()}
JWT_EXPIRES_IN=7d

SESSION_MAX_AGE=2592000
SESSION_UPDATE_AGE=86400

# ===========================================
# AI SERVICES CONFIGURATION
# ===========================================
OPENAI_API_KEY="${config.openaiKey || 'your-openai-api-key-here'}"
OPENAI_MODEL_GPT4=gpt-4o
OPENAI_MODEL_GPT35=gpt-3.5-turbo
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

AI_QUIZ_GENERATION_TIMEOUT=30000
AI_CASE_STUDY_TIMEOUT=45000
AI_SUMMARIZATION_TIMEOUT=25000

# ===========================================
# FILE STORAGE & MEDIA
# ===========================================
MAX_FILE_SIZE=50000000
UPLOAD_DIR=./uploads
MEDIA_DIR=./public/media

ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif,svg,webp
ALLOWED_VIDEO_TYPES=mp4,webm,ogg
ALLOWED_AUDIO_TYPES=mp3,wav,ogg,aac
ALLOWED_DOCUMENT_TYPES=pdf,doc,docx,pptx,txt

# ===========================================
# PIPELINE CONFIGURATION
# ===========================================
PIPELINE_ENABLED=true
PIPELINE_WORKER_COUNT=4
PIPELINE_QUEUE_SIZE=100
PIPELINE_RETRY_ATTEMPTS=3
PIPELINE_RETRY_DELAY=5000

FFMPEG_PATH=/usr/bin/ffmpeg
FFMPEG_THREADS=4
FFMPEG_QUALITY=high

PYTHON_PATH=/usr/bin/python3
PIPELINE_SCRIPTS_DIR=./scripts/pipeline

# ===========================================
# CACHING & PERFORMANCE
# ===========================================
REDIS_URL="${config.redisUrl || 'redis://localhost:6379'}"
REDIS_PASSWORD=
REDIS_DB=0

CACHE_TTL=3600
CACHE_MAX_SIZE=1000
CACHE_STRATEGY=lru

# ===========================================
# EMAIL CONFIGURATION
# ===========================================
SMTP_HOST="${config.smtp.host || 'smtp.gmail.com'}"
SMTP_PORT=587
SMTP_USER="${config.smtp.user || 'your-email@gmail.com'}"
SMTP_PASS="${config.smtp.pass || 'your-app-password'}"
SMTP_FROM="Health Hub ECG <noreply@your-domain.com>"

EMAIL_TEMPLATES_DIR=./templates/email

# ===========================================
# SECURITY SETTINGS
# ===========================================
CORS_ORIGIN=https://your-domain.com
CORS_CREDENTIALS=true

RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

CSP_ENABLED=true
CSP_REPORT_URI=/api/csp-report

# ===========================================
# FEATURE FLAGS
# ===========================================
FEATURE_AI_ENHANCEMENT=${config.openaiKey ? 'true' : 'false'}
FEATURE_PIPELINE_AUTOMATION=true
FEATURE_REAL_TIME_ANALYTICS=true
FEATURE_SOCIAL_LEARNING=false
FEATURE_MOBILE_APP=false
FEATURE_ADVANCED_AI=${config.openaiKey ? 'true' : 'false'}

# ===========================================
# MONITORING & LOGGING
# ===========================================
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=./logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5

ENABLE_METRICS=true
METRICS_PORT=9090
HEALTH_CHECK_INTERVAL=30000

# ===========================================
# DEVELOPMENT & DEBUG
# ===========================================
DEBUG_MODE=false
ENABLE_DEBUG_ROUTES=false
ENABLE_API_DOCS=false
MOCK_DATA_ENABLED=false
`;

  // Write to .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  fs.writeFileSync(envPath, envContent);
  console.log('   ✅ Environment configuration written to .env.local');

  // Create .env.example for reference
  const examplePath = path.join(process.cwd(), '.env.example');
  const exampleContent = envContent.replace(/=.*$/gm, '=your-value-here');
  fs.writeFileSync(examplePath, exampleContent);
  console.log('   ✅ Environment example written to .env.example');
}

function generateRandomSecret(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Run the setup
if (require.main === module) {
  setupApiKeys()
    .then(() => {
      console.log('\n🚀 API Keys setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 API Keys setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupApiKeys };

