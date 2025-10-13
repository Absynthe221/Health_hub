
import sys
import json
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE
import base64
import os

def extract_slides(pptx_path):
    try:
        prs = Presentation(pptx_path)
        slides_data = []
        
        for i, slide in enumerate(prs.slides, 1):
            slide_data = {
                "slideNumber": i,
                "slideTitle": f"Slide {i}",
                "slideContent": "",
                "slideImage": "",
                "slideAudio": "",
                "slideVideo": "",
                "slideQuiz": null,
                "slideSubtitle": "",
                "slideNotes": "",
                "slideAnnotations": [],
                "learningObjectives": [],
                "interactiveElements": [],
                "mediaSync": {
                    "imageTiming": 0,
                    "audioTiming": 0,
                    "videoTiming": 0
                }
            }
            
            # Extract text content
            text_content = []
            for shape in slide.shapes:
                if hasattr(shape, "text") and shape.text.strip():
                    text_content.append(shape.text.strip())
            
            slide_data["slideContent"] = "\n\n".join(text_content)
            
            # Extract images
            for j, shape in enumerate(slide.shapes):
                if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
                    try:
                        image_path = f"/uploads/ecg-media/slide_{i}_image_{j+1}.png"
                        slide_data["slideImage"] = image_path
                        slide_data["interactiveElements"].push({
                            "type": "image",
                            "src": image_path,
                            "alt": f"ECG Diagram {j+1}",
                            "description": "Interactive ECG waveform analysis"
                        })
                    except Exception as e:
                        print(f"Error extracting image: {e}")
            
            # Generate AI narration placeholder
            if slide_data["slideContent"]:
                slide_data["slideAudio"] = f"/uploads/ecg-media/slide_{i}_narration.mp3"
                slide_data["slideSubtitle"] = f"AI-generated narration for: {slide_data['slideContent'][:100]}..."
            
            slides_data.append(slide_data)
        
        return slides_data
    except Exception as e:
        return [{"error": str(e), "slideNumber": 1}]

if __name__ == "__main__":
    pptx_path = sys.argv[1]
    slides = extract_slides(pptx_path)
    print(json.dumps(slides, indent=2))
