#!/usr/bin/env python3
"""
ECG Platform - PPTX to Module JSON Converter

This script converts PPTX files into structured module.json files with:
- Slide extraction and parsing
- Audio file extraction and processing
- Image extraction and optimization
- Subtitle generation
- Module metadata creation

Usage: python3 scripts/pipeline/pptx_to_module.py
"""

import os
import json
import sys
import shutil
import subprocess
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import logging
from pptx import Presentation
from pptx.util import Inches
import zipfile
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scripts/pipeline/pipeline.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class PPTXToModuleConverter:
    """Converts PPTX files to structured module.json format"""
    
    def __init__(self, input_dir: str = "assets", output_dir: str = "public/modules"):
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.media_dir = Path("public/assets/ecg-media")
        self.segments_dir = Path("public/segments")
        
        # Create output directories
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.media_dir.mkdir(parents=True, exist_ok=True)
        self.segments_dir.mkdir(parents=True, exist_ok=True)
        
        # Module counter for auto-incrementing IDs
        self.module_counter = 1
        
        # Supported file extensions
        self.supported_extensions = {'.pptx', '.ppt'}
        
        logger.info(f"PPTX to Module Converter initialized")
        logger.info(f"Input directory: {self.input_dir}")
        logger.info(f"Output directory: {self.output_dir}")
    
    def extract_pptx_content(self, pptx_path: Path) -> Dict[str, Any]:
        """Extract content from PPTX file"""
        try:
            logger.info(f"Processing PPTX file: {pptx_path}")
            
            # Load presentation
            presentation = Presentation(str(pptx_path))
            
            # Extract basic metadata
            metadata = {
                'filename': pptx_path.name,
                'slide_count': len(presentation.slides),
                'processed_at': datetime.now(timezone.utc).isoformat()
            }
            
            # Extract slides
            slides = []
            for i, slide in enumerate(presentation.slides):
                slide_data = self.extract_slide_content(slide, i + 1)
                slides.append(slide_data)
            
            # Extract embedded media files
            media_files = self.extract_embedded_media(pptx_path)
            
            return {
                'metadata': metadata,
                'slides': slides,
                'media_files': media_files
            }
            
        except Exception as e:
            logger.error(f"Error processing PPTX file {pptx_path}: {str(e)}")
            raise
    
    def extract_slide_content(self, slide, slide_number: int) -> Dict[str, Any]:
        """Extract content from a single slide"""
        slide_data = {
            'id': slide_number,
            'title': '',
            'content': '',
            'contentType': 'text',
            'interactive': False,
            'duration': 30,  # Default 30 seconds per slide
            'audioFile': None,
            'subtitles': None,
            'images': [],
            'video': None,
            'quiz': None,
            'ai': {
                'generateQuiz': True,
                'summarizeSlide': True,
                'explainECG': False
            },
            'segments': []
        }
        
        # Extract text content
        text_content = []
        for shape in slide.shapes:
            if hasattr(shape, 'text') and shape.text.strip():
                text_content.append(shape.text.strip())
        
        # Set title (first text element or slide number)
        if text_content:
            slide_data['title'] = text_content[0][:100]  # Limit title length
            slide_data['content'] = '\n\n'.join(text_content)
        
        # Check for interactive elements
        if any('quiz' in text.lower() or 'question' in text.lower() for text in text_content):
            slide_data['interactive'] = True
            slide_data['contentType'] = 'interactive'
        
        # Check for ECG-related content
        if any('ecg' in text.lower() or 'electrocardiogram' in text.lower() for text in text_content):
            slide_data['ai']['explainECG'] = True
        
        # Extract images from slide
        slide_images = []
        for shape in slide.shapes:
            if shape.shape_type == 13:  # Picture type
                try:
                    image_data = shape.image
                    if image_data:
                        # Save image
                        image_filename = f"slide_{slide_number}_image_{len(slide_images) + 1}.png"
                        image_path = self.media_dir / "images" / image_filename
                        image_path.parent.mkdir(parents=True, exist_ok=True)
                        
                        with open(image_path, 'wb') as f:
                            f.write(image_data.blob)
                        
                        slide_images.append(f"/assets/ecg-media/images/{image_filename}")
                        logger.info(f"Extracted image: {image_filename}")
                except Exception as e:
                    logger.warning(f"Could not extract image from slide {slide_number}: {str(e)}")
        
        slide_data['images'] = slide_images
        
        return slide_data
    
    def extract_embedded_media(self, pptx_path: Path) -> Dict[str, List[str]]:
        """Extract embedded media files from PPTX"""
        media_files = {
            'audio': [],
            'video': [],
            'images': []
        }
        
        try:
            # PPTX is a ZIP file, extract it temporarily
            with zipfile.ZipFile(pptx_path, 'r') as zip_ref:
                # Extract media files from ppt/media/ directory
                for file_info in zip_ref.filelist:
                    if file_info.filename.startswith('ppt/media/'):
                        filename = os.path.basename(file_info.filename)
                        file_extension = os.path.splitext(filename)[1].lower()
                        
                        if file_extension in ['.mp3', '.wav', '.aiff', '.m4a']:
                            # Audio file
                            audio_path = self.media_dir / "audio" / filename
                            audio_path.parent.mkdir(parents=True, exist_ok=True)
                            
                            with zip_ref.open(file_info.filename) as source:
                                with open(audio_path, 'wb') as target:
                                    shutil.copyfileobj(source, target)
                            
                            media_files['audio'].append(f"/assets/ecg-media/audio/{filename}")
                            logger.info(f"Extracted audio: {filename}")
                        
                        elif file_extension in ['.mp4', '.avi', '.mov', '.wmv']:
                            # Video file
                            video_path = self.media_dir / "videos" / filename
                            video_path.parent.mkdir(parents=True, exist_ok=True)
                            
                            with zip_ref.open(file_info.filename) as source:
                                with open(video_path, 'wb') as target:
                                    shutil.copyfileobj(source, target)
                            
                            media_files['video'].append(f"/assets/ecg-media/videos/{filename}")
                            logger.info(f"Extracted video: {filename}")
                        
                        elif file_extension in ['.jpg', '.jpeg', '.png', '.gif', '.bmp']:
                            # Image file
                            image_path = self.media_dir / "images" / filename
                            image_path.parent.mkdir(parents=True, exist_ok=True)
                            
                            with zip_ref.open(file_info.filename) as source:
                                with open(image_path, 'wb') as target:
                                    shutil.copyfileobj(source, target)
                            
                            media_files['images'].append(f"/assets/ecg-media/images/{filename}")
                            logger.info(f"Extracted image: {filename}")
        
        except Exception as e:
            logger.warning(f"Could not extract embedded media from {pptx_path}: {str(e)}")
        
        return media_files
    
    def generate_module_json(self, module_name: str, content_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate complete module.json structure"""
        
        # Calculate total duration
        total_duration = sum(slide.get('duration', 30) for slide in content_data['slides'])
        
        # Generate module ID
        module_id = f"mod_{self.module_counter:03d}"
        self.module_counter += 1
        
        # Determine difficulty based on content
        difficulty = self.determine_difficulty(content_data['slides'])
        
        # Determine category based on content
        category = self.determine_category(content_data['slides'])
        
        module_json = {
            'moduleId': module_id,
            'moduleTitle': module_name,
            'description': self.generate_description(content_data['slides']),
            'overview': self.generate_overview(content_data['slides']),
            'objectives': self.extract_objectives(content_data['slides']),
            'duration': total_duration,
            'difficulty': difficulty,
            'category': category,
            'prerequisites': self.determine_prerequisites(difficulty, category),
            'tags': self.generate_tags(content_data['slides']),
            'status': 'draft',
            'roleAccess': ['learner', 'instructor'],
            'instructorId': 'instructor_tbd',
            'createdAt': datetime.now(timezone.utc).isoformat(),
            'updatedAt': datetime.now(timezone.utc).isoformat(),
            'slides': content_data['slides'],
            'metadata': {
                'totalSlides': len(content_data['slides']),
                'interactiveSlides': len([s for s in content_data['slides'] if s['interactive']]),
                'quizItems': len([s for s in content_data['slides'] if s['quiz']]),
                'estimatedDuration': f"{total_duration} minutes",
                'mediaFiles': {
                    'audio': len(content_data['media_files']['audio']),
                    'video': len(content_data['media_files']['video']),
                    'images': len(content_data['media_files']['images'])
                }
            }
        }
        
        return module_json
    
    def determine_difficulty(self, slides: List[Dict]) -> str:
        """Determine module difficulty based on content"""
        content_text = ' '.join([slide.get('content', '') for slide in slides]).lower()
        
        advanced_keywords = ['advanced', 'complex', 'diagnosis', 'interpretation', 'pathophysiology']
        intermediate_keywords = ['intermediate', 'analysis', 'recognition', 'pattern']
        
        if any(keyword in content_text for keyword in advanced_keywords):
            return 'advanced'
        elif any(keyword in content_text for keyword in intermediate_keywords):
            return 'intermediate'
        else:
            return 'beginner'
    
    def determine_category(self, slides: List[Dict]) -> str:
        """Determine module category based on content"""
        content_text = ' '.join([slide.get('content', '') for slide in slides]).lower()
        
        categories = {
            'rhythm_analysis': ['rhythm', 'rate', 'regularity'],
            'arrhythmia_detection': ['arrhythmia', 'irregular', 'abnormal'],
            'conduction_abnormalities': ['conduction', 'block', 'delay'],
            'ischemia_infarction': ['ischemia', 'infarction', 'stemi', 'nstemi'],
            'general': ['basic', 'introduction', 'overview']
        }
        
        for category, keywords in categories.items():
            if any(keyword in content_text for keyword in keywords):
                return category
        
        return 'general'
    
    def generate_description(self, slides: List[Dict]) -> str:
        """Generate module description from slide content"""
        if not slides:
            return "ECG Training Module"
        
        first_slide_content = slides[0].get('content', '')
        if len(first_slide_content) > 200:
            return first_slide_content[:200] + "..."
        return first_slide_content or "ECG Training Module"
    
    def generate_overview(self, slides: List[Dict]) -> str:
        """Generate detailed overview from all slide content"""
        overview_parts = []
        for slide in slides[:3]:  # Use first 3 slides for overview
            content = slide.get('content', '')
            if content:
                overview_parts.append(content[:300])
        
        return '\n\n'.join(overview_parts) or "Comprehensive ECG training module covering essential concepts and practical applications."
    
    def extract_objectives(self, slides: List[Dict]) -> List[str]:
        """Extract learning objectives from slide content"""
        objectives = []
        content_text = ' '.join([slide.get('content', '') for slide in slides])
        
        # Look for objective patterns
        objective_patterns = [
            r'objective[s]?\s*:?\s*(.+?)(?:\n|$)',
            r'learning\s+goal[s]?\s*:?\s*(.+?)(?:\n|$)',
            r'upon\s+completion[,\s]+(.+?)(?:\n|$)'
        ]
        
        for pattern in objective_patterns:
            matches = re.findall(pattern, content_text, re.IGNORECASE | re.MULTILINE)
            objectives.extend(matches)
        
        # If no objectives found, generate based on content
        if not objectives:
            if 'ecg' in content_text.lower():
                objectives = [
                    "Understand ECG fundamentals and interpretation",
                    "Recognize normal and abnormal ECG patterns",
                    "Apply ECG knowledge to clinical scenarios"
                ]
            else:
                objectives = [
                    "Master key concepts presented in this module",
                    "Apply knowledge to practical scenarios",
                    "Demonstrate competency through assessments"
                ]
        
        return objectives[:5]  # Limit to 5 objectives
    
    def determine_prerequisites(self, difficulty: str, category: str) -> List[str]:
        """Determine module prerequisites"""
        if difficulty == 'beginner':
            return ["Basic anatomy and physiology knowledge"]
        elif difficulty == 'intermediate':
            return ["Basic ECG interpretation", "Cardiac anatomy fundamentals"]
        else:  # advanced
            return ["Intermediate ECG interpretation", "Cardiac pathophysiology", "Clinical experience"]
    
    def generate_tags(self, slides: List[Dict]) -> List[str]:
        """Generate searchable tags from slide content"""
        content_text = ' '.join([slide.get('content', '') for slide in slides]).lower()
        
        tags = []
        
        # ECG-specific tags
        ecg_tags = ['ecg', 'electrocardiogram', 'cardiac', 'heart', 'rhythm', 'waveform']
        for tag in ecg_tags:
            if tag in content_text:
                tags.append(tag)
        
        # Medical tags
        medical_tags = ['diagnosis', 'treatment', 'clinical', 'patient', 'symptoms']
        for tag in medical_tags:
            if tag in content_text:
                tags.append(tag)
        
        # Learning tags
        learning_tags = ['interactive', 'quiz', 'assessment', 'practice']
        for tag in learning_tags:
            if tag in content_text:
                tags.append(tag)
        
        return list(set(tags))[:10]  # Remove duplicates and limit to 10 tags
    
    def save_module_json(self, module_name: str, module_data: Dict[str, Any]) -> Path:
        """Save module.json to appropriate directory"""
        # Create module directory
        module_dir = self.output_dir / module_name
        module_dir.mkdir(parents=True, exist_ok=True)
        
        # Save module.json
        module_json_path = module_dir / "module.json"
        with open(module_json_path, 'w', encoding='utf-8') as f:
            json.dump(module_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Module JSON saved: {module_json_path}")
        return module_json_path
    
    def process_pptx_file(self, pptx_path: Path) -> Optional[Path]:
        """Process a single PPTX file"""
        try:
            # Extract content from PPTX
            content_data = self.extract_pptx_content(pptx_path)
            
            # Generate module name from filename
            module_name = self.sanitize_module_name(pptx_path.stem)
            
            # Generate module.json
            module_data = self.generate_module_json(module_name, content_data)
            
            # Save module.json
            module_json_path = self.save_module_json(module_name, module_data)
            
            logger.info(f"Successfully processed: {pptx_path.name} -> {module_name}")
            return module_json_path
            
        except Exception as e:
            logger.error(f"Failed to process {pptx_path.name}: {str(e)}")
            return None
    
    def sanitize_module_name(self, name: str) -> str:
        """Sanitize module name for filesystem compatibility"""
        # Remove special characters and replace with underscores
        sanitized = re.sub(r'[^\w\s-]', '', name)
        # Replace spaces and multiple underscores with single underscore
        sanitized = re.sub(r'[\s_-]+', '_', sanitized)
        # Remove leading/trailing underscores
        sanitized = sanitized.strip('_')
        # Limit length
        if len(sanitized) > 50:
            sanitized = sanitized[:50]
        
        return sanitized.lower() if sanitized else f"module_{self.module_counter}"
    
    def run(self) -> Dict[str, Any]:
        """Run the PPTX to module conversion pipeline"""
        logger.info("Starting PPTX to Module conversion pipeline")
        
        results = {
            'processed': [],
            'failed': [],
            'summary': {
                'total_files': 0,
                'successful': 0,
                'failed': 0,
                'modules_created': 0
            }
        }
        
        # Find all PPTX files in input directory
        pptx_files = []
        for ext in self.supported_extensions:
            pptx_files.extend(self.input_dir.glob(f"**/*{ext}"))
        
        results['summary']['total_files'] = len(pptx_files)
        
        if not pptx_files:
            logger.warning(f"No PPTX files found in {self.input_dir}")
            return results
        
        logger.info(f"Found {len(pptx_files)} PPTX files to process")
        
        # Process each PPTX file
        for pptx_path in pptx_files:
            logger.info(f"Processing: {pptx_path.name}")
            
            result = self.process_pptx_file(pptx_path)
            if result:
                results['processed'].append({
                    'input_file': str(pptx_path),
                    'output_file': str(result),
                    'status': 'success'
                })
                results['summary']['successful'] += 1
                results['summary']['modules_created'] += 1
            else:
                results['failed'].append({
                    'input_file': str(pptx_path),
                    'status': 'failed'
                })
                results['summary']['failed'] += 1
        
        # Log summary
        logger.info("Pipeline Summary:")
        logger.info(f"  Total files: {results['summary']['total_files']}")
        logger.info(f"  Successful: {results['summary']['successful']}")
        logger.info(f"  Failed: {results['summary']['failed']}")
        logger.info(f"  Modules created: {results['summary']['modules_created']}")
        
        return results

def main():
    """Main function"""
    try:
        # Initialize converter
        converter = PPTXToModuleConverter()
        
        # Run conversion pipeline
        results = converter.run()
        
        # Save results
        results_path = Path("scripts/pipeline/conversion_results.json")
        with open(results_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Conversion results saved to: {results_path}")
        
        # Exit with appropriate code
        if results['summary']['failed'] > 0:
            logger.warning(f"Pipeline completed with {results['summary']['failed']} failures")
            sys.exit(1)
        else:
            logger.info("Pipeline completed successfully!")
            sys.exit(0)
            
    except Exception as e:
        logger.error(f"Pipeline failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()

