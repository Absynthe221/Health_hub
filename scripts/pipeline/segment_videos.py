#!/usr/bin/env python3
"""
ECG Platform - Video Segmentation Pipeline

This script segments long video files into 15-minute chunks and updates
module.json files with segment information for optimal learning experience.

Usage: python3 scripts/pipeline/segment_videos.py
"""

import os
import json
import sys
import subprocess
import shutil
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Tuple
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scripts/pipeline/segmentation.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class VideoSegmenter:
    """Segments long videos into manageable chunks and updates module.json files"""
    
    def __init__(self, 
                 modules_dir: str = "public/modules",
                 media_dir: str = "public/assets/ecg-media",
                 segments_dir: str = "public/segments"):
        
        self.modules_dir = Path(modules_dir)
        self.media_dir = Path(media_dir)
        self.segments_dir = Path(segments_dir)
        
        # Create segments directory
        self.segments_dir.mkdir(parents=True, exist_ok=True)
        
        # Video segmentation settings
        self.max_segment_duration = 15 * 60  # 15 minutes in seconds
        self.segment_overlap = 30  # 30 seconds overlap between segments
        
        # Supported video formats
        self.video_formats = {'.mp4', '.avi', '.mov', '.wmv', '.mkv', '.flv', '.webm'}
        
        # FFmpeg command templates
        self.ffmpeg_info_cmd = [
            'ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams'
        ]
        self.ffmpeg_segment_cmd = [
            'ffmpeg', '-i', '', '-ss', '', '-t', '', '-c', 'copy', '-avoid_negative_ts', 'make_zero', '-y', ''
        ]
        
        logger.info("Video Segmenter initialized")
        logger.info(f"Modules directory: {self.modules_dir}")
        logger.info(f"Media directory: {self.media_dir}")
        logger.info(f"Segments directory: {self.segments_dir}")
        logger.info(f"Max segment duration: {self.max_segment_duration} seconds")
    
    def check_ffmpeg_available(self) -> bool:
        """Check if FFmpeg is available in the system"""
        try:
            result = subprocess.run(['ffmpeg', '-version'], 
                                  capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                logger.info("FFmpeg is available")
                return True
            else:
                logger.error("FFmpeg is not working properly")
                return False
        except (subprocess.TimeoutExpired, FileNotFoundError):
            logger.error("FFmpeg is not installed or not in PATH")
            return False
    
    def get_video_info(self, video_path: Path) -> Optional[Dict[str, any]]:
        """Get video information using ffprobe"""
        try:
            cmd = self.ffmpeg_info_cmd + [str(video_path)]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                logger.error(f"Failed to get video info: {result.stderr}")
                return None
            
            info = json.loads(result.stdout)
            
            # Find video stream
            video_stream = None
            for stream in info.get('streams', []):
                if stream.get('codec_type') == 'video':
                    video_stream = stream
                    break
            
            if not video_stream:
                logger.error("No video stream found")
                return None
            
            # Extract video information
            duration = float(info.get('format', {}).get('duration', 0))
            width = video_stream.get('width', 0)
            height = video_stream.get('height', 0)
            fps = eval(video_stream.get('r_frame_rate', '0/1'))  # Convert fraction to float
            codec = video_stream.get('codec_name', 'unknown')
            
            video_info = {
                'duration': duration,
                'width': width,
                'height': height,
                'fps': fps,
                'codec': codec,
                'file_size': os.path.getsize(video_path)
            }
            
            logger.info(f"Video info for {video_path.name}:")
            logger.info(f"  Duration: {duration:.2f} seconds ({duration/60:.2f} minutes)")
            logger.info(f"  Resolution: {width}x{height}")
            logger.info(f"  FPS: {fps:.2f}")
            logger.info(f"  Codec: {codec}")
            
            return video_info
            
        except Exception as e:
            logger.error(f"Error getting video info for {video_path}: {str(e)}")
            return None
    
    def calculate_segments(self, duration: float) -> List[Tuple[float, float]]:
        """Calculate segment start and end times"""
        segments = []
        
        if duration <= self.max_segment_duration:
            # Video is short enough, no segmentation needed
            segments.append((0, duration))
            return segments
        
        # Calculate number of segments needed
        num_segments = int((duration - self.segment_overlap) / (self.max_segment_duration - self.segment_overlap)) + 1
        
        for i in range(num_segments):
            start_time = i * (self.max_segment_duration - self.segment_overlap)
            end_time = min(start_time + self.max_segment_duration, duration)
            
            segments.append((start_time, end_time))
            
            # If we've reached the end, break
            if end_time >= duration:
                break
        
        return segments
    
    def create_segment(self, video_path: Path, start_time: float, end_time: float, 
                      segment_path: Path) -> bool:
        """Create a video segment using FFmpeg"""
        try:
            duration = end_time - start_time
            
            # Build FFmpeg command
            cmd = self.ffmpeg_segment_cmd.copy()
            cmd[2] = str(video_path)  # Input file
            cmd[4] = str(start_time)  # Start time
            cmd[6] = str(duration)    # Duration
            cmd[12] = str(segment_path)  # Output file
            
            logger.info(f"Creating segment: {segment_path.name}")
            logger.info(f"  Start: {start_time:.2f}s, Duration: {duration:.2f}s")
            
            # Run FFmpeg command
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                logger.info(f"Segment created successfully: {segment_path.name}")
                return True
            else:
                logger.error(f"FFmpeg failed: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            logger.error(f"FFmpeg timeout for segment: {segment_path.name}")
            return False
        except Exception as e:
            logger.error(f"Error creating segment {segment_path.name}: {str(e)}")
            return False
    
    def segment_video(self, video_path: Path, module_name: str) -> Dict[str, any]:
        """Segment a video file into chunks"""
        logger.info(f"Segmenting video: {video_path.name}")
        
        # Get video information
        video_info = self.get_video_info(video_path)
        if not video_info:
            return {'success': False, 'error': 'Could not get video information'}
        
        duration = video_info['duration']
        
        # Calculate segments
        segments = self.calculate_segments(duration)
        logger.info(f"Video will be split into {len(segments)} segments")
        
        # Create segments directory for this module
        module_segments_dir = self.segments_dir / module_name
        module_segments_dir.mkdir(parents=True, exist_ok=True)
        
        created_segments = []
        failed_segments = []
        
        # Create each segment
        for i, (start_time, end_time) in enumerate(segments):
            segment_filename = f"segment_{i+1:03d}.mp4"
            segment_path = module_segments_dir / segment_filename
            
            success = self.create_segment(video_path, start_time, end_time, segment_path)
            
            if success:
                segment_info = {
                    'id': f"segment_{i+1:03d}",
                    'filename': segment_filename,
                    'path': f"/segments/{module_name}/{segment_filename}",
                    'startTime': start_time,
                    'endTime': end_time,
                    'duration': end_time - start_time,
                    'size': segment_path.stat().st_size
                }
                created_segments.append(segment_info)
            else:
                failed_segments.append(f"segment_{i+1:03d}")
        
        result = {
            'success': len(failed_segments) == 0,
            'original_duration': duration,
            'segments_created': len(created_segments),
            'segments_failed': len(failed_segments),
            'segments': created_segments,
            'failed_segments': failed_segments,
            'video_info': video_info
        }
        
        if result['success']:
            logger.info(f"Successfully segmented {video_path.name} into {len(created_segments)} segments")
        else:
            logger.warning(f"Segmentation completed with {len(failed_segments)} failures")
        
        return result
    
    def update_module_json_with_segments(self, module_path: Path, 
                                       segmentation_result: Dict[str, any]) -> bool:
        """Update module.json with segment information"""
        try:
            # Load existing module.json
            with open(module_path, 'r', encoding='utf-8') as f:
                module_data = json.load(f)
            
            # Find slides with video content
            for slide in module_data.get('slides', []):
                if slide.get('video'):
                    # Add segments to slide
                    slide['segments'] = segmentation_result['segments']
                    
                    # Update video path to point to first segment
                    if segmentation_result['segments']:
                        slide['video'] = segmentation_result['segments'][0]['path']
                    
                    logger.info(f"Updated slide {slide['id']} with {len(segmentation_result['segments'])} segments")
            
            # Update module metadata
            if 'metadata' not in module_data:
                module_data['metadata'] = {}
            
            module_data['metadata']['segmentation'] = {
                'original_duration': segmentation_result['original_duration'],
                'segments_created': segmentation_result['segments_created'],
                'segment_duration': self.max_segment_duration,
                'segmented_at': datetime.now(timezone.utc).isoformat()
            }
            
            module_data['updatedAt'] = datetime.now(timezone.utc).isoformat()
            
            # Save updated module.json
            with open(module_path, 'w', encoding='utf-8') as f:
                json.dump(module_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Updated module.json: {module_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating module.json {module_path}: {str(e)}")
            return False
    
    def find_videos_in_modules(self) -> List[Tuple[Path, str, Path]]:
        """Find all video files referenced in module.json files"""
        video_files = []
        
        if not self.modules_dir.exists():
            logger.warning(f"Modules directory not found: {self.modules_dir}")
            return video_files
        
        # Search through all module directories
        for module_dir in self.modules_dir.iterdir():
            if not module_dir.is_dir():
                continue
            
            module_json_path = module_dir / "module.json"
            if not module_json_path.exists():
                continue
            
            try:
                with open(module_json_path, 'r', encoding='utf-8') as f:
                    module_data = json.load(f)
                
                # Check slides for video references
                for slide in module_data.get('slides', []):
                    video_path_str = slide.get('video')
                    if video_path_str:
                        # Convert relative path to absolute path
                        if video_path_str.startswith('/'):
                            # Absolute path from web root
                            video_path = Path('public') / video_path_str.lstrip('/')
                        else:
                            # Relative path
                            video_path = self.media_dir / video_path_str
                        
                        if video_path.exists() and video_path.suffix.lower() in self.video_formats:
                            video_files.append((video_path, module_dir.name, module_json_path))
                            logger.info(f"Found video: {video_path.name} in module {module_dir.name}")
            
            except Exception as e:
                logger.error(f"Error reading module.json in {module_dir}: {str(e)}")
                continue
        
        return video_files
    
    def process_module_videos(self, video_path: Path, module_name: str, 
                            module_json_path: Path) -> Dict[str, any]:
        """Process videos for a specific module"""
        logger.info(f"Processing videos for module: {module_name}")
        
        # Check if video needs segmentation
        video_info = self.get_video_info(video_path)
        if not video_info:
            return {'success': False, 'error': 'Could not get video information'}
        
        duration = video_info['duration']
        
        # Skip if video is already short enough
        if duration <= self.max_segment_duration:
            logger.info(f"Video {video_path.name} is already short enough ({duration/60:.2f} minutes)")
            return {'success': True, 'skipped': True, 'reason': 'Video already short enough'}
        
        # Segment the video
        segmentation_result = self.segment_video(video_path, module_name)
        
        if segmentation_result['success']:
            # Update module.json with segment information
            update_success = self.update_module_json_with_segments(module_json_path, segmentation_result)
            
            if update_success:
                segmentation_result['module_updated'] = True
            else:
                segmentation_result['module_updated'] = False
                segmentation_result['warning'] = 'Video segmented but module.json not updated'
        
        return segmentation_result
    
    def run(self) -> Dict[str, any]:
        """Run the video segmentation pipeline"""
        logger.info("Starting video segmentation pipeline")
        
        # Check FFmpeg availability
        if not self.check_ffmpeg_available():
            return {
                'success': False,
                'error': 'FFmpeg is not available',
                'processed': [],
                'failed': []
            }
        
        results = {
            'success': True,
            'processed': [],
            'failed': [],
            'summary': {
                'total_videos': 0,
                'segmented': 0,
                'skipped': 0,
                'failed': 0,
                'total_segments_created': 0
            }
        }
        
        # Find all video files in modules
        video_files = self.find_videos_in_modules()
        results['summary']['total_videos'] = len(video_files)
        
        if not video_files:
            logger.info("No video files found in modules")
            return results
        
        logger.info(f"Found {len(video_files)} video files to process")
        
        # Process each video
        for video_path, module_name, module_json_path in video_files:
            logger.info(f"Processing: {video_path.name}")
            
            result = self.process_module_videos(video_path, module_name, module_json_path)
            
            if result.get('success', False):
                if result.get('skipped', False):
                    results['processed'].append({
                        'video': str(video_path),
                        'module': module_name,
                        'status': 'skipped',
                        'reason': result.get('reason', 'Unknown')
                    })
                    results['summary']['skipped'] += 1
                else:
                    results['processed'].append({
                        'video': str(video_path),
                        'module': module_name,
                        'status': 'segmented',
                        'segments_created': result.get('segments_created', 0),
                        'module_updated': result.get('module_updated', False)
                    })
                    results['summary']['segmented'] += 1
                    results['summary']['total_segments_created'] += result.get('segments_created', 0)
            else:
                results['failed'].append({
                    'video': str(video_path),
                    'module': module_name,
                    'status': 'failed',
                    'error': result.get('error', 'Unknown error')
                })
                results['summary']['failed'] += 1
        
        # Log summary
        logger.info("Segmentation Pipeline Summary:")
        logger.info(f"  Total videos: {results['summary']['total_videos']}")
        logger.info(f"  Segmented: {results['summary']['segmented']}")
        logger.info(f"  Skipped: {results['summary']['skipped']}")
        logger.info(f"  Failed: {results['summary']['failed']}")
        logger.info(f"  Total segments created: {results['summary']['total_segments_created']}")
        
        return results

def main():
    """Main function"""
    try:
        # Initialize segmenter
        segmenter = VideoSegmenter()
        
        # Run segmentation pipeline
        results = segmenter.run()
        
        # Save results
        results_path = Path("scripts/pipeline/segmentation_results.json")
        with open(results_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Segmentation results saved to: {results_path}")
        
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

