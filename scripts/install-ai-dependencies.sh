#!/bin/bash

# Health Hub ECG - AI Dependencies Installation
# =============================================

echo "🤖 Installing AI dependencies for voice generation and MCQ creation..."

# Install Python AI libraries
pip3 install openai anthropic elevenlabs requests

# Install Node.js AI libraries
npm install openai @anthropic-ai/sdk elevenlabs axios

# Install audio processing libraries
npm install fluent-ffmpeg ffmpeg-static

# Install image processing libraries
npm install sharp canvas

echo "✅ AI dependencies installed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Add API keys to .env.local:"
echo "   OPENAI_API_KEY=your_openai_key"
echo "   ANTHROPIC_API_KEY=your_anthropic_key"
echo "   ELEVENLABS_API_KEY=your_elevenlabs_key"
echo "2. Run: node scripts/ai-content-generator.js"
echo "3. Test the AI voice generation pipeline"



