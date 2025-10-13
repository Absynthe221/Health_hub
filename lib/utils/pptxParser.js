import { parsePptx } from "pptx-parser";

export async function extractPptxText(file) {
  try {
    let buffer;
    
    if (file instanceof File) {
      buffer = Buffer.from(await file.arrayBuffer());
    } else {
      buffer = file;
    }
    
    const slides = await parsePptx(buffer);
    
    return slides
      .map((slide, i) => {
        const slideTitle = slide.title || `Slide ${i + 1}`;
        const slideContent = slide.text || slide.content || '';
        return `Slide ${i + 1}: ${slideTitle}\n${slideContent}`;
      })
      .join("\n\n");
  } catch (error) {
    console.error("Error parsing PPTX:", error);
    throw new Error(`Failed to parse PPTX file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractPptxSlides(file) {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const slides = await parsePptx(buffer);
    
    return slides.map((slide, i) => ({
      id: i + 1,
      title: slide.title || `Slide ${i + 1}`,
      content: slide.text || slide.content || '',
      notes: slide.notes || ''
    }));
  } catch (error) {
    console.error("Error parsing PPTX slides:", error);
    throw new Error(`Failed to parse PPTX slides: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

