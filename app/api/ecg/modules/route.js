import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the modules index file
    const modulesPath = path.join(process.cwd(), 'assets', 'ecg-modules.json');
    
    if (!fs.existsSync(modulesPath)) {
      return NextResponse.json([], { status: 200 });
    }

    const modulesData = fs.readFileSync(modulesPath, 'utf8');
    const modules = JSON.parse(modulesData);

    // Enhance each module with additional metadata
    const enhancedModules = modules.map(module => {
      const moduleDir = path.join(process.cwd(), 'assets', module.title);
      const moduleJsonPath = path.join(moduleDir, 'module.json');
      
      let additionalData = {};
      if (fs.existsSync(moduleJsonPath)) {
        try {
          const moduleData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
          additionalData = {
            hasImages: moduleData.slides?.some(slide => slide.images?.length > 0) || false,
            imageCount: moduleData.slides?.reduce((total, slide) => total + (slide.images?.length || 0), 0) || 0,
            hasAudio: moduleData.slides?.some(slide => slide.audio) || false,
            hasSubtitles: moduleData.slides?.some(slide => slide.subtitles) || false,
            totalSlides: moduleData.slides?.length || 0
          };
        } catch (err) {
          console.error(`Error reading module data for ${module.title}:`, err);
        }
      }

      return {
        ...module,
        ...additionalData
      };
    });

    return NextResponse.json(enhancedModules);
  } catch (error) {
    console.error('Error loading ECG modules:', error);
    return NextResponse.json(
      { error: 'Failed to load modules' },
      { status: 500 }
    );
  }
}




