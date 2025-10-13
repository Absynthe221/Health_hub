"""
ECG Platform - Content Pipeline Package

This package contains the automated content processing pipeline for converting
PPTX files into structured learning modules with segmented media.

Components:
- pptx_to_module.py: Converts PPTX files to module.json format
- segment_videos.py: Segments long videos into 15-minute chunks
- Pipeline utilities and helper functions

Usage:
    python3 scripts/pipeline/pptx_to_module.py
    python3 scripts/pipeline/segment_videos.py
    
    Or use the npm command:
    npm run process:modules
"""

__version__ = "1.0.0"
__author__ = "ECG Platform Development Team"
__description__ = "Automated content processing pipeline for ECG learning modules"

# Import main pipeline classes
from .pptx_to_module import PPTXToModuleConverter
from .segment_videos import VideoSegmenter

# Export main classes
__all__ = [
    'PPTXToModuleConverter',
    'VideoSegmenter'
]

# Pipeline configuration
PIPELINE_CONFIG = {
    'max_segment_duration': 15 * 60,  # 15 minutes in seconds
    'segment_overlap': 30,  # 30 seconds overlap
    'supported_video_formats': {'.mp4', '.avi', '.mov', '.wmv', '.mkv', '.flv', '.webm'},
    'supported_pptx_formats': {'.pptx', '.ppt'},
    'default_slide_duration': 30,  # 30 seconds per slide
    'output_directories': {
        'modules': 'public/modules',
        'media': 'public/assets/ecg-media',
        'segments': 'public/segments'
    }
}

def get_pipeline_config():
    """Get pipeline configuration"""
    return PIPELINE_CONFIG.copy()

def validate_environment():
    """Validate that required tools are available"""
    import subprocess
    import sys
    
    required_tools = ['ffmpeg', 'ffprobe']
    missing_tools = []
    
    for tool in required_tools:
        try:
            result = subprocess.run([tool, '-version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode != 0:
                missing_tools.append(tool)
        except (subprocess.TimeoutExpired, FileNotFoundError):
            missing_tools.append(tool)
    
    if missing_tools:
        print(f"Warning: Missing required tools: {', '.join(missing_tools)}")
        print("Please install FFmpeg for video processing capabilities")
        return False
    
    return True

def run_full_pipeline():
    """Run the complete content processing pipeline"""
    import sys
    from pathlib import Path
    
    # Add current directory to Python path
    current_dir = Path(__file__).parent.parent.parent
    sys.path.insert(0, str(current_dir))
    
    try:
        # Step 1: Convert PPTX files to modules
        print("Step 1: Converting PPTX files to modules...")
        from scripts.pipeline.pptx_to_module import main as pptx_main
        pptx_main()
        
        # Step 2: Segment videos
        print("Step 2: Segmenting videos...")
        from scripts.pipeline.segment_videos import main as segment_main
        segment_main()
        
        print("Full pipeline completed successfully!")
        return True
        
    except Exception as e:
        print(f"Pipeline failed: {str(e)}")
        return False

if __name__ == "__main__":
    # Validate environment
    if not validate_environment():
        print("Environment validation failed. Please install required tools.")
        sys.exit(1)
    
    # Run full pipeline
    success = run_full_pipeline()
    sys.exit(0 if success else 1)

