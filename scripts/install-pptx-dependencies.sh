#!/bin/bash

# Health Hub ECG - PPTX Conversion Dependencies Installation
# =========================================================

echo "🚀 Installing PPTX conversion dependencies..."

# Install Python PPTX parsing library
pip3 install python-pptx

# Install additional libraries for enhanced PPTX processing
pip3 install Pillow  # Image processing
pip3 install openpyxl  # Excel file support
pip3 install python-docx  # Word document support
pip3 install beautifulsoup4  # HTML parsing
pip3 install requests  # HTTP requests for AI services

# Install Node.js dependencies for AI integration
npm install openai axios @anthropic-ai/sdk

# Install audio processing libraries
npm install ffmpeg-static fluent-ffmpeg

echo "✅ All dependencies installed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run: node scripts/convert-all-pptx-to-json.js"
echo "2. Configure AI API keys in .env.local"
echo "3. Test the conversion pipeline"



