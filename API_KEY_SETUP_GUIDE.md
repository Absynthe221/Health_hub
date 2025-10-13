# 🔑 API Key Setup Guide for Health Hub ECG Platform

## 🚀 **Quick Setup Steps**

### 1. **Get OpenAI API Key**
1. Go to: https://platform.openai.com/api-keys
2. Sign up/Login with your account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. **Important**: Save it securely - you won't see it again!

### 2. **Add to Your Project**
Create or update your `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local

# Edit the file
nano .env.local
```

Add your API key:
```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here

# NextAuth Configuration  
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-key-here
```

### 3. **Restart Your Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## 💰 **Cost Information**
- **OpenAI API**: ~$0.01-0.05 per PPTX upload (very cheap)
- **Free Tier**: $5 credit for new accounts
- **Typical Usage**: 100+ uploads for $5

## 🛠️ **Alternative AI Providers**

If you prefer other AI services:

### **Anthropic Claude** (Alternative)
```env
ANTHROPIC_API_KEY=your-anthropic-key-here
```

### **Google AI** (Alternative)
```env
GOOGLE_AI_API_KEY=your-google-ai-key-here
```

## 🔧 **Enable AI Features**

Once you have your API key:

1. **Upload PPTX files** → AI will generate slides automatically
2. **Smart content creation** → Descriptions, narrations, MCQs
3. **Professional quality** → Medical education focused content

## 🆘 **Need Help?**

**Ask Cursor AI**: 
```
"Help me set up OpenAI API key for my Health Hub ECG Platform. I need to enable AI-powered slide generation."
```

**Or use this prompt**:
```
"I'm building a medical education platform and need help getting an OpenAI API key to generate educational content from PowerPoint files. Can you guide me through the process?"
```

## ✅ **Verification**

After setup, test by:
1. Going to: http://localhost:3001/dashboard/admin?tab=presentations
2. Upload a PPTX file
3. Check console for "AI processing" messages
4. Verify slides are generated with AI content

---

**Your AI-powered Health Hub ECG Platform will be ready! 🎉**


