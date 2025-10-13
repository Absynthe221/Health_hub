#!/bin/bash

# Health Hub ECG Platform - GitHub Repository Setup Script
# This script helps set up the GitHub repository and initial push

set -e

echo "🚀 Health Hub ECG Platform - GitHub Setup"
echo "========================================"

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found"
    
    # Check if user is authenticated
    if gh auth status &> /dev/null; then
        echo "✅ GitHub CLI authenticated"
        
        echo "📝 Creating GitHub repository..."
        read -p "Enter your GitHub username: " USERNAME
        read -p "Enter repository name (default: health_hub): " REPO_NAME
        REPO_NAME=${REPO_NAME:-health_hub}
        
        echo "🔧 Setting up remote and pushing..."
        gh repo create $USERNAME/$REPO_NAME --public --push --source=.
        
        echo "✅ Repository created and pushed successfully!"
        echo "🌐 Repository URL: https://github.com/$USERNAME/$REPO_NAME"
        
    else
        echo "❌ GitHub CLI not authenticated"
        echo "🔐 Please run: gh auth login"
        exit 1
    fi
    
else
    echo "⚠️  GitHub CLI not found"
    echo "📋 Manual setup required:"
    echo ""
    echo "1. Create repository on GitHub.com"
    echo "2. Run these commands:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/health_hub.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "📚 See GIT_WORKFLOW.md for detailed instructions"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Verify repository: https://github.com/$USERNAME/$REPO_NAME"
echo "2. Check CI/CD pipeline in Actions tab"
echo "3. Review GIT_WORKFLOW.md for development workflow"
echo "4. Start developing with feature branches!"
