#!/usr/bin/env python3
"""
ECG Platform - AI Integration Script

This script enhances existing module.json files with AI-generated content:
- Generates quiz questions for interactive slides
- Creates summaries for all slides
- Updates module.json with AI-enhanced content

Usage: python3 scripts/pipeline/ai_integration.py
"""

import os
import json
import sys
import requests
import time
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scripts/pipeline/ai_integration.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class AIIntegration:
    """AI integration service for enhancing existing module.json files"""
    
    def __init__(self, 
                 modules_dir: str = "public/modules",
                 api_base_url: str = "http://localhost:3002"):
        
        self.modules_dir = Path(modules_dir)
        self.api_base_url = api_base_url.rstrip('/')
        self.ai_endpoints = {
            'generateQuiz': f"{self.api_base_url}/api/ai/generateQuiz",
            'summarizeSlide': f"{self.api_base_url}/api/ai/summarizeSlide",
            'interpretECG': f"{self.api_base_url}/api/ai/interpretECG"
        }
        
        # AI processing settings
        self.ai_timeout = 30  # seconds
        self.ai_retry_attempts = 3
        self.ai_delay_between_calls = 2  # seconds
        
        # Check if AI endpoints are available
        self.ai_available = self.check_ai_endpoints()
        
        logger.info(f"AI Integration initialized")
        logger.info(f"Modules directory: {self.modules_dir}")
        logger.info(f"API Base URL: {self.api_base_url}")
        logger.info(f"AI Endpoints Available: {self.ai_available}")
    
    def check_ai_endpoints(self) -> Dict[str, bool]:
        """Check if AI endpoints are available"""
        endpoint_status = {}
        
        for name, url in self.ai_endpoints.items():
            try:
                # Try to reach the health endpoint first
                health_url = f"{self.api_base_url}/api/health"
                response = requests.get(health_url, timeout=5)
                endpoint_status[name] = response.status_code == 200
                logger.info(f"Health check for {name}: {'✅' if endpoint_status[name] else '❌'}")
            except Exception as e:
                endpoint_status[name] = False
                logger.warning(f"Health check failed for {name}: {str(e)}")
        
        return endpoint_status
    
    def call_ai_endpoint(self, endpoint_name: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Call an AI endpoint with retry logic"""
        if not self.ai_available.get(endpoint_name, False):
            logger.warning(f"AI endpoint {endpoint_name} not available, skipping")
            return None
        
        endpoint_url = self.ai_endpoints[endpoint_name]
        
        for attempt in range(self.ai_retry_attempts):
            try:
                logger.info(f"Calling AI endpoint: {endpoint_name} (attempt {attempt + 1})")
                
                response = requests.post(
                    endpoint_url,
                    json=data,
                    headers={'Content-Type': 'application/json'},
                    timeout=self.ai_timeout
                )
                
                if response.status_code == 200:
                    result = response.json()
                    logger.info(f"✅ AI endpoint {endpoint_name} successful")
                    return result
                else:
                    logger.warning(f"⚠️ AI endpoint {endpoint_name} returned status {response.status_code}")
                    if response.text:
                        logger.warning(f"Response: {response.text[:200]}...")
                    
            except requests.exceptions.Timeout:
                logger.warning(f"⏰ AI endpoint {endpoint_name} timeout (attempt {attempt + 1})")
            except requests.exceptions.RequestException as e:
                logger.warning(f"🌐 AI endpoint {endpoint_name} request error: {str(e)}")
            except Exception as e:
                logger.error(f"❌ AI endpoint {endpoint_name} unexpected error: {str(e)}")
            
            if attempt < self.ai_retry_attempts - 1:
                logger.info(f"⏳ Waiting {self.ai_delay_between_calls}s before retry...")
                time.sleep(self.ai_delay_between_calls)
        
        logger.error(f"💥 AI endpoint {endpoint_name} failed after {self.ai_retry_attempts} attempts")
        return None
    
    def generate_quiz_for_slide(self, slide_content: str, module_context: str, slide_id: int) -> Optional[Dict[str, Any]]:
        """Generate quiz questions for a slide using AI"""
        if not slide_content or not slide_content.strip():
            logger.info(f"Slide {slide_id}: No content for quiz generation")
            return None
        
        # Limit content length to avoid token limits
        max_content_length = 2000
        if len(slide_content) > max_content_length:
            slide_content = slide_content[:max_content_length] + "..."
        
        data = {
            'slideContent': slide_content,
            'moduleContext': module_context,
            'questionCount': 3  # Generate 3 questions per slide for better quality
        }
        
        result = self.call_ai_endpoint('generateQuiz', data)
        if result and result.get('success', False):
            quiz_data = {
                'questions': result.get('questions', []),
                'metadata': result.get('metadata', {}),
                'generated_at': datetime.now(timezone.utc).isoformat(),
                'slide_id': slide_id
            }
            logger.info(f"✅ Generated {len(quiz_data['questions'])} quiz questions for slide {slide_id}")
            return quiz_data
        
        logger.warning(f"⚠️ Failed to generate quiz for slide {slide_id}")
        return None
    
    def generate_summary_for_slide(self, slide_content: str, module_context: str, slide_id: int) -> Optional[Dict[str, Any]]:
        """Generate a summary for a slide using AI"""
        if not slide_content or not slide_content.strip():
            logger.info(f"Slide {slide_id}: No content for summary generation")
            return None
        
        # Limit content length to avoid token limits
        max_content_length = 1500
        if len(slide_content) > max_content_length:
            slide_content = slide_content[:max_content_length] + "..."
        
        data = {
            'slideContent': slide_content,
            'moduleContext': module_context,
            'summaryType': 'brief'
        }
        
        result = self.call_ai_endpoint('summarizeSlide', data)
        if result and result.get('success', False):
            summary_data = {
                'summary': result.get('summary', ''),
                'keyPoints': result.get('keyPoints', []),
                'learningObjectives': result.get('learningObjectives', []),
                'difficulty': result.get('difficulty', 'intermediate'),
                'estimatedReadTime': result.get('estimatedReadTime', '2 minutes'),
                'metadata': result.get('metadata', {}),
                'generated_at': datetime.now(timezone.utc).isoformat(),
                'slide_id': slide_id
            }
            logger.info(f"✅ Generated summary for slide {slide_id}")
            return summary_data
        
        logger.warning(f"⚠️ Failed to generate summary for slide {slide_id}")
        return None
    
    def enhance_module_with_ai(self, module_path: Path) -> Dict[str, Any]:
        """Enhance a module.json file with AI content"""
        logger.info(f"🤖 Enhancing module: {module_path.name}")
        
        try:
            # Load existing module.json
            with open(module_path, 'r', encoding='utf-8') as f:
                module_data = json.load(f)
            
            # Skip if already AI enhanced
            if module_data.get('aiMetadata'):
                logger.info(f"⏭️ Module {module_path.name} already AI enhanced, skipping")
                return {'status': 'skipped', 'reason': 'already_enhanced'}
            
            module_title = module_data.get('moduleTitle', 'Unknown Module')
            module_category = module_data.get('category', 'ECG')
            module_context = f"{module_title} - {module_category}"
            
            enhanced_slides = []
            quiz_count = 0
            summary_count = 0
            
            # Process each slide
            for slide in module_data.get('slides', []):
                slide_id = slide.get('id', 0)
                enhanced_slide = slide.copy()
                
                # Generate quiz for interactive slides
                if slide.get('interactive', False) or slide.get('ai', {}).get('generateQuiz', False):
                    quiz_data = self.generate_quiz_for_slide(
                        slide.get('content', ''), 
                        module_context, 
                        slide_id
                    )
                    if quiz_data:
                        enhanced_slide['quiz'] = quiz_data
                        quiz_count += 1
                    
                    # Add delay between AI calls
                    time.sleep(self.ai_delay_between_calls)
                
                # Generate summary for all slides
                if slide.get('ai', {}).get('summarizeSlide', True):
                    summary_data = self.generate_summary_for_slide(
                        slide.get('content', ''), 
                        module_context, 
                        slide_id
                    )
                    if summary_data:
                        enhanced_slide['aiSummary'] = summary_data
                        summary_count += 1
                    
                    # Add delay between AI calls
                    time.sleep(self.ai_delay_between_calls)
                
                enhanced_slides.append(enhanced_slide)
            
            # Update module data
            module_data['slides'] = enhanced_slides
            module_data['updatedAt'] = datetime.now(timezone.utc).isoformat()
            
            # Add AI metadata
            module_data['aiMetadata'] = {
                'enhanced_slides': len([s for s in enhanced_slides if s.get('quiz') or s.get('aiSummary')]),
                'total_slides': len(enhanced_slides),
                'quiz_count': quiz_count,
                'summary_count': summary_count,
                'enhancement_rate': f"{len([s for s in enhanced_slides if s.get('quiz') or s.get('aiSummary')])/len(enhanced_slides)*100:.1f}%" if enhanced_slides else "0%",
                'enhanced_at': datetime.now(timezone.utc).isoformat(),
                'ai_endpoints_used': [name for name, available in self.ai_available.items() if available]
            }
            
            # Update module metadata
            if 'metadata' not in module_data:
                module_data['metadata'] = {}
            
            module_data['metadata']['aiEnhanced'] = True
            module_data['metadata']['quizItems'] = quiz_count
            
            # Save enhanced module.json
            with open(module_path, 'w', encoding='utf-8') as f:
                json.dump(module_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"✅ Successfully enhanced module {module_path.name}")
            logger.info(f"   📊 Enhanced {module_data['aiMetadata']['enhanced_slides']}/{len(enhanced_slides)} slides")
            logger.info(f"   ❓ Generated {quiz_count} quizzes")
            logger.info(f"   📝 Generated {summary_count} summaries")
            
            return {
                'status': 'success',
                'quiz_count': quiz_count,
                'summary_count': summary_count,
                'enhanced_slides': module_data['aiMetadata']['enhanced_slides'],
                'total_slides': len(enhanced_slides)
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to enhance module {module_path.name}: {str(e)}")
            return {'status': 'failed', 'error': str(e)}
    
    def find_modules(self) -> List[Path]:
        """Find all module.json files to enhance"""
        module_files = []
        
        if not self.modules_dir.exists():
            logger.warning(f"Modules directory not found: {self.modules_dir}")
            return module_files
        
        # Search for module.json files
        for module_dir in self.modules_dir.iterdir():
            if module_dir.is_dir():
                module_json_path = module_dir / "module.json"
                if module_json_path.exists():
                    module_files.append(module_json_path)
        
        return module_files
    
    def run(self) -> Dict[str, Any]:
        """Run the AI integration pipeline"""
        logger.info("🚀 Starting AI Integration Pipeline")
        
        if not any(self.ai_available.values()):
            logger.error("❌ No AI endpoints available! Please ensure the Next.js server is running.")
            return {
                'success': False,
                'error': 'No AI endpoints available',
                'processed': [],
                'failed': []
            }
        
        results = {
            'success': True,
            'processed': [],
            'failed': [],
            'skipped': [],
            'summary': {
                'total_modules': 0,
                'enhanced': 0,
                'failed': 0,
                'skipped': 0,
                'total_quizzes': 0,
                'total_summaries': 0
            }
        }
        
        # Find all modules
        module_files = self.find_modules()
        results['summary']['total_modules'] = len(module_files)
        
        if not module_files:
            logger.warning("⚠️ No module.json files found to enhance")
            return results
        
        logger.info(f"📁 Found {len(module_files)} modules to enhance")
        
        # Process each module
        for module_path in module_files:
            result = self.enhance_module_with_ai(module_path)
            
            if result['status'] == 'success':
                results['processed'].append({
                    'module': module_path.name,
                    'path': str(module_path),
                    'result': result
                })
                results['summary']['enhanced'] += 1
                results['summary']['total_quizzes'] += result.get('quiz_count', 0)
                results['summary']['total_summaries'] += result.get('summary_count', 0)
                
            elif result['status'] == 'skipped':
                results['skipped'].append({
                    'module': module_path.name,
                    'path': str(module_path),
                    'reason': result.get('reason', 'unknown')
                })
                results['summary']['skipped'] += 1
                
            else:
                results['failed'].append({
                    'module': module_path.name,
                    'path': str(module_path),
                    'error': result.get('error', 'unknown error')
                })
                results['summary']['failed'] += 1
        
        # Log summary
        logger.info("🎉 AI Integration Pipeline Summary:")
        logger.info(f"  📁 Total modules: {results['summary']['total_modules']}")
        logger.info(f"  ✅ Enhanced: {results['summary']['enhanced']}")
        logger.info(f"  ⏭️ Skipped: {results['summary']['skipped']}")
        logger.info(f"  ❌ Failed: {results['summary']['failed']}")
        logger.info(f"  ❓ Total quizzes generated: {results['summary']['total_quizzes']}")
        logger.info(f"  📝 Total summaries generated: {results['summary']['total_summaries']}")
        
        return results

def main():
    """Main function"""
    try:
        # Initialize AI integration
        ai_integration = AIIntegration()
        
        # Run AI integration pipeline
        results = ai_integration.run()
        
        # Save results
        results_path = Path("scripts/pipeline/ai_integration_results.json")
        with open(results_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"💾 AI integration results saved to: {results_path}")
        
        # Exit with appropriate code
        if results['summary']['failed'] > 0:
            logger.warning(f"⚠️ Pipeline completed with {results['summary']['failed']} failures")
            sys.exit(1)
        else:
            logger.info("🎊 AI integration pipeline completed successfully!")
            sys.exit(0)
            
    except Exception as e:
        logger.error(f"💥 AI integration pipeline failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()

