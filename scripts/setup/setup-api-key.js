#!/usr/bin/env node

/**
 * API Key Setup Script for Health Hub ECG Platform
 * This script helps you set up your OpenAI API key
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupAPIKey() {
  console.log('🔑 Health Hub ECG Platform - API Key Setup\n');
  
  console.log('This script will help you set up your OpenAI API key for AI-powered slide generation.\n');
  
  // Check if .env.local already exists
  const envPath = path.join(__dirname, '.env.local');
  let existingEnv = {};
  
  if (fs.existsSync(envPath)) {
    console.log('📄 Found existing .env.local file\n');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        existingEnv[key.trim()] = value.trim();
      }
    });
  }
  
  // Get OpenAI API Key
  let openaiKey = existingEnv.OPENAI_API_KEY || '';
  if (openaiKey && openaiKey !== 'your-openai-api-key-here') {
    console.log('✅ OpenAI API Key already configured');
    const update = await question('Do you want to update it? (y/N): ');
    if (update.toLowerCase() !== 'y') {
      openaiKey = existingEnv.OPENAI_API_KEY;
    }
  }
  
  if (!openaiKey || openaiKey === 'your-openai-api-key-here' || openaiKey === '') {
    console.log('\n🔗 To get your OpenAI API Key:');
    console.log('1. Go to: https://platform.openai.com/api-keys');
    console.log('2. Sign up/Login with your account');
    console.log('3. Click "Create new secret key"');
    console.log('4. Copy the key (starts with sk-...)\n');
    
    openaiKey = await question('Enter your OpenAI API Key (starts with sk-): ');
  }
  
  // Get NextAuth Secret
  let nextauthSecret = existingEnv.NEXTAUTH_SECRET || '';
  if (!nextauthSecret || nextauthSecret === 'your-nextauth-secret-key-here') {
    console.log('\n🔐 NextAuth Secret is needed for authentication');
    nextauthSecret = await question('Enter NextAuth Secret (or press Enter for auto-generated): ');
    if (!nextauthSecret) {
      nextauthSecret = require('crypto').randomBytes(32).toString('hex');
      console.log(`✅ Auto-generated NextAuth Secret: ${nextauthSecret}`);
    }
  }
  
  // Create .env.local content
  const envContent = `# Health Hub ECG Platform Environment Variables
# Generated on ${new Date().toISOString()}

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=${nextauthSecret}

# OpenAI API Configuration
OPENAI_API_KEY=${openaiKey}

# Database Configuration (if needed)
# DATABASE_URL=your-database-url-here

# Other API Keys (optional)
# ANTHROPIC_API_KEY=your-anthropic-key-here
# GOOGLE_AI_API_KEY=your-google-ai-key-here
`;
  
  // Write .env.local file
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env.local file created successfully!');
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Restart your development server:');
    console.log('   npm run dev');
    console.log('\n2. Test AI functionality:');
    console.log('   Go to: http://localhost:3001/dashboard/admin?tab=presentations');
    console.log('   Upload a PPTX file and watch the AI magic! ✨');
    
    console.log('\n💰 Cost Information:');
    console.log('- OpenAI API: ~$0.01-0.05 per PPTX upload');
    console.log('- Free Tier: $5 credit for new accounts');
    console.log('- Typical Usage: 100+ uploads for $5');
    
  } catch (error) {
    console.error('❌ Error creating .env.local file:', error.message);
    console.log('\n📝 Please create .env.local manually with this content:');
    console.log(envContent);
  }
  
  rl.close();
}

// Run the setup
setupAPIKey().catch(console.error);


