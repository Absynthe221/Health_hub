#!/usr/bin/env python3
"""
ECG Platform - Enhanced AI Integration Pipeline

This script provides comprehensive AI enhancement for ECG modules:
- Generates adaptive quiz questions
- Creates case studies
- Provides quiz validation
- Generates personalized learning paths

Usage: python3 scripts/pipeline/ai_enhanced_pipeline.py
"""

import os
import json
import sys
import requests
import time
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any, Tuple
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scripts/pipeline/ai_enhanced_pipeline.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class EnhancedAIPipeline:
    """Enhanced AI pipeline with comprehensive ECG learning features"""
    
    def __init__(self, 
                 modules_dir: str = "public/modules",
                 api_base_url: str = "http://localhost:3000"):
        
        self.modules_dir = Path(modules_dir)
        self.api_base_url = api_base_url.rstrip('/')
        self.ai_endpoints = {
            'generateQuiz': f"{self.api_base_url}/api/ai/generateQuiz",
            'generateECGQuiz': f"{self.api_base_url}/api/ai/generateECGQuiz",
            'generateCaseStudy': f"{self.api_base_url}/api/ai/generateCaseStudy",
            'adaptiveQuiz': f"{self.api_base_url}/api/ai/adaptiveQuiz",
            'validateQuiz': f"{self.api_base_url}/api/ai/validateQuiz",
            'quizMaster': f"{self.api_base_url}/api/ai/quizMaster",
            'summarizeSlide': f"{self.api_base_url}/api/ai/summarizeSlide",
            'interpretECG': f"{self.api_base_url}/api/ai/interpretECG"
        }
        
        # AI processing settings
        self.ai_timeout = 60  # seconds
        self.max_retries = 3
        self.retry_delay = 2  # seconds
        
        # Results tracking
        self.results = {
            'start_time': datetime.now(timezone.utc).isoformat(),
            'modules_processed': 0,
            'quizzes_generated': 0,
            'case_studies_created': 0,
            'errors': [],
            'warnings': []
        }

    def log(self, message: str, level: str = "INFO"):
        """Log message with timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] {level}: {message}"
        
        if level == "ERROR":
            logger.error(message)
        elif level == "WARNING":
            logger.warning(message)
        else:
            logger.info(message)

    def make_api_request(self, endpoint: str, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Make API request with retry logic"""
        url = self.ai_endpoints.get(endpoint)
        if not url:
            self.log(f"Unknown endpoint: {endpoint}", "ERROR")
            return None

        for attempt in range(self.max_retries):
            try:
                self.log(f"Making request to {endpoint} (attempt {attempt + 1})")
                response = requests.post(
                    url,
                    json=payload,
                    timeout=self.ai_timeout,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    result = response.json()
                    self.log(f"Successfully called {endpoint}")
                    return result
                else:
                    self.log(f"API request failed with status {response.status_code}: {response.text}", "WARNING")
                    
            except requests.exceptions.RequestException as e:
                self.log(f"Request failed (attempt {attempt + 1}): {str(e)}", "WARNING")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay * (attempt + 1))
                else:
                    self.log(f"All attempts failed for {endpoint}", "ERROR")
                    
        return None

    def generate_adaptive_quiz(self, module_data: Dict[str, Any], user_profile: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """Generate adaptive quiz based on module content and user profile"""
        try:
            payload = {
                "moduleContent": module_data,
                "userProfile": user_profile or {
                    "learningLevel": "intermediate",
                    "preferredDifficulty": "mixed",
                    "learningGoals": ["ECG interpretation", "Clinical application"]
                },
                "quizPreferences": {
                    "questionCount": 10,
                    "difficulty": "adaptive",
                    "includeCaseStudies": True,
                    "focusAreas": ["ECG Basics", "Rhythm Analysis", "Clinical Application"]
                }
            }

            result = self.make_api_request('generateECGQuiz', payload)
            if result and result.get('success'):
                return result.get('questions', [])
            else:
                self.log(f"Failed to generate adaptive quiz: {result.get('error', 'Unknown error')}", "WARNING")
                return None
                
        except Exception as e:
            self.log(f"Error generating adaptive quiz: {str(e)}", "ERROR")
            return None

    def generate_case_study(self, module_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Generate case study for module"""
        try:
            payload = {
                "moduleContent": module_data,
                "caseType": "clinical",
                "difficulty": "intermediate",
                "includeECG": True,
                "patientAge": "adult"
            }

            result = self.make_api_request('generateCaseStudy', payload)
            if result and result.get('success'):
                return result.get('caseStudy')
            else:
                self.log(f"Failed to generate case study: {result.get('error', 'Unknown error')}", "WARNING")
                return None
                
        except Exception as e:
            self.log(f"Error generating case study: {str(e)}", "ERROR")
            return None

    def validate_quiz_questions(self, questions: List[Dict[str, Any]], module_content: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Validate quiz questions for quality and accuracy"""
        try:
            payload = {
                "quizQuestions": questions,
                "moduleContent": module_content,
                "validationCriteria": {
                    "medicalAccuracy": True,
                    "difficultyAppropriate": True,
                    "clearLanguage": True,
                    "clinicalRelevance": True,
                    "biasCheck": True
                }
            }

            result = self.make_api_request('validateQuiz', payload)
            if result and result.get('success'):
                return result.get('validationResults')
            else:
                self.log(f"Failed to validate quiz: {result.get('error', 'Unknown error')}", "WARNING")
                return None
                
        except Exception as e:
            self.log(f"Error validating quiz: {str(e)}", "ERROR")
            return None

    def enhance_module_with_ai(self, module_path: Path) -> bool:
        """Enhance a single module with AI-generated content"""
        try:
            self.log(f"Processing module: {module_path.name}")
            
            # Load module data
            with open(module_path / "module.json", 'r', encoding='utf-8') as f:
                module_data = json.load(f)

            enhanced = False

            # Generate adaptive quiz
            quiz_questions = self.generate_adaptive_quiz(module_data)
            if quiz_questions:
                # Validate quiz questions
                validation = self.validate_quiz_questions(quiz_questions, module_data)
                
                if validation and validation.get('summary', {}).get('approvedQuestions', 0) > 0:
                    module_data['adaptiveQuiz'] = {
                        'questions': quiz_questions,
                        'validation': validation,
                        'generatedAt': datetime.now(timezone.utc).isoformat()
                    }
                    enhanced = True
                    self.results['quizzes_generated'] += 1
                    self.log(f"Added adaptive quiz with {len(quiz_questions)} questions")

            # Generate case study
            case_study = self.generate_case_study(module_data)
            if case_study:
                module_data['caseStudy'] = case_study
                enhanced = True
                self.results['case_studies_created'] += 1
                self.log(f"Added case study: {case_study.get('title', 'Untitled')}")

            # Add AI enhancement metadata
            if enhanced:
                module_data['aiEnhanced'] = {
                    'enhancedAt': datetime.now(timezone.utc).isoformat(),
                    'features': {
                        'adaptiveQuiz': 'adaptiveQuiz' in module_data,
                        'caseStudy': 'caseStudy' in module_data
                    },
                    'apiVersion': 'enhanced_pipeline_v1.0'
                }

                # Save enhanced module
                with open(module_path / "module.json", 'w', encoding='utf-8') as f:
                    json.dump(module_data, f, indent=2, ensure_ascii=False)

                self.log(f"Successfully enhanced module: {module_path.name}")
                return True
            else:
                self.log(f"No AI enhancements added to module: {module_path.name}", "WARNING")
                return False

        except Exception as e:
            error_msg = f"Failed to enhance module {module_path.name}: {str(e)}"
            self.log(error_msg, "ERROR")
            self.results['errors'].append(error_msg)
            return False

    def generate_learning_path(self, user_performance: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """Generate personalized learning path based on performance data"""
        try:
            payload = {
                "action": "recommend",
                "userProfile": {
                    "learningLevel": "intermediate",
                    "preferredDifficulty": "mixed"
                },
                "performanceData": user_performance or {
                    "overallScore": 75,
                    "weakAreas": ["ECG Basics", "Rhythm Analysis"],
                    "strongAreas": ["Anatomy"]
                }
            }

            result = self.make_api_request('quizMaster', payload)
            if result and result.get('success'):
                return result.get('strategy')
            else:
                self.log(f"Failed to generate learning path: {result.get('error', 'Unknown error')}", "WARNING")
                return None
                
        except Exception as e:
            self.log(f"Error generating learning path: {str(e)}", "ERROR")
            return None

    def process_all_modules(self) -> Dict[str, Any]:
        """Process all modules in the modules directory"""
        self.log("Starting enhanced AI pipeline processing")
        
        if not self.modules_dir.exists():
            self.log(f"Modules directory not found: {self.modules_dir}", "ERROR")
            return self.results

        # Find all module directories
        module_dirs = [d for d in self.modules_dir.iterdir() if d.is_dir()]
        
        if not module_dirs:
            self.log("No modules found to process", "WARNING")
            return self.results

        self.log(f"Found {len(module_dirs)} modules to process")

        # Process each module
        for module_dir in module_dirs:
            module_json_path = module_dir / "module.json"
            
            if module_json_path.exists():
                success = self.enhance_module_with_ai(module_dir)
                if success:
                    self.results['modules_processed'] += 1
                else:
                    self.results['warnings'].append(f"Module {module_dir.name} was not enhanced")
            else:
                warning_msg = f"Module {module_dir.name} missing module.json"
                self.log(warning_msg, "WARNING")
                self.results['warnings'].append(warning_msg)

        # Generate overall learning path
        learning_path = self.generate_learning_path()
        if learning_path:
            # Save learning path to a separate file
            learning_path_file = self.modules_dir.parent / "learning_path.json"
            with open(learning_path_file, 'w', encoding='utf-8') as f:
                json.dump({
                    'generatedAt': datetime.now(timezone.utc).isoformat(),
                    'learningPath': learning_path,
                    'metadata': {
                        'modulesProcessed': self.results['modules_processed'],
                        'totalModules': len(module_dirs)
                    }
                }, f, indent=2, ensure_ascii=False)
            
            self.log(f"Generated learning path saved to: {learning_path_file}")

        return self.results

    def generate_report(self) -> None:
        """Generate processing report"""
        end_time = datetime.now(timezone.utc)
        start_time = datetime.fromisoformat(self.results['start_time'].replace('Z', '+00:00'))
        duration = (end_time - start_time).total_seconds()

        report = {
            'pipeline': 'Enhanced AI Pipeline',
            'version': '1.0',
            'processingTime': {
                'start': self.results['start_time'],
                'end': end_time.isoformat(),
                'durationSeconds': duration
            },
            'results': self.results,
            'summary': {
                'modulesProcessed': self.results['modules_processed'],
                'quizzesGenerated': self.results['quizzes_generated'],
                'caseStudiesCreated': self.results['case_studies_created'],
                'errors': len(self.results['errors']),
                'warnings': len(self.results['warnings'])
            }
        }

        # Save report
        report_file = Path('scripts/pipeline/ai_enhanced_report.json')
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        self.log(f"Processing report saved to: {report_file}")
        self.log(f"Enhanced AI Pipeline completed: {self.results['modules_processed']} modules processed")

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Enhanced AI Pipeline for ECG Platform')
    parser.add_argument('--modules-dir', default='public/modules', help='Modules directory path')
    parser.add_argument('--api-url', default='http://localhost:3000', help='API base URL')
    parser.add_argument('--timeout', type=int, default=60, help='API timeout in seconds')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be done without executing')
    
    args = parser.parse_args()

    if args.dry_run:
        print("DRY RUN: Enhanced AI Pipeline would process modules in:", args.modules_dir)
        print("DRY RUN: API base URL:", args.api_url)
        return

    # Create and run pipeline
    pipeline = EnhancedAIPipeline(
        modules_dir=args.modules_dir,
        api_base_url=args.api_url
    )
    
    pipeline.ai_timeout = args.timeout
    
    try:
        results = pipeline.process_all_modules()
        pipeline.generate_report()
        
        print(f"\n🎉 Enhanced AI Pipeline completed successfully!")
        print(f"📊 Processed {results['modules_processed']} modules")
        print(f"🧠 Generated {results['quizzes_generated']} quizzes")
        print(f"📚 Created {results['case_studies_created']} case studies")
        
        if results['errors']:
            print(f"⚠️  {len(results['errors'])} errors occurred")
        if results['warnings']:
            print(f"ℹ️  {len(results['warnings'])} warnings generated")
            
    except Exception as e:
        print(f"❌ Enhanced AI Pipeline failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()