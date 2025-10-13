import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const decodedId = decodeURIComponent(id);
    
    // First try to load from processed modules in assets
    const modulesPath = path.join(process.cwd(), 'assets', 'ecg-modules.json');
    
    if (fs.existsSync(modulesPath)) {
      const modulesData = fs.readFileSync(modulesPath, 'utf8');
      const modules = JSON.parse(modulesData);
      
      // Find module by title or id
      const module = modules.find(m => 
        m.title === decodedId || 
        m.id === decodedId || 
        m.moduleName === decodedId
      );
      
      if (module) {
        // Load detailed module data from individual module.json
        const moduleDir = path.join(process.cwd(), 'assets', module.title || module.moduleName);
        const moduleJsonPath = path.join(moduleDir, 'module.json');
        
        if (fs.existsSync(moduleJsonPath)) {
          try {
            const detailedModuleData = JSON.parse(fs.readFileSync(moduleJsonPath, 'utf8'));
            
            // Enhance with processed data
            const enhancedModule = {
              id: module.id || module.title,
              title: module.title || detailedModuleData.moduleName,
              moduleName: detailedModuleData.moduleName || module.title,
              description: module.description || detailedModuleData.description || 'ECG Training Module',
              slides: detailedModuleData.slides || [],
              segments: detailedModuleData.segments || [],
              objectives: detailedModuleData.objectives || [],
              duration: module.duration || detailedModuleData.duration || 60,
              difficulty: module.difficulty || detailedModuleData.difficulty || 'Intermediate',
              // Add metadata from processed data
              hasImages: detailedModuleData.slides?.some(slide => slide.images?.length > 0) || false,
              hasAudio: detailedModuleData.slides?.some(slide => slide.audio) || false,
              hasSubtitles: detailedModuleData.slides?.some(slide => slide.subtitles) || false,
              hasMCQs: detailedModuleData.slides?.some(slide => slide.mcqs?.length > 0) || false,
              totalSlides: detailedModuleData.slides?.length || 0,
              totalQuestions: (detailedModuleData.slides?.reduce((acc, slide) => acc + (slide.mcqs?.length || 0), 0) || 0) +
                              (detailedModuleData.segments?.reduce((acc, seg) => acc + (seg.mcqs?.length || 0), 0) || 0),
              totalImages: detailedModuleData.slides?.reduce((acc, slide) => acc + (slide.images?.length || 0), 0) || 0
            };
            
            return NextResponse.json(enhancedModule);
          } catch (err) {
            console.error(`Error reading detailed module data for ${module.title}:`, err);
          }
        }
        
        // Return basic module data if detailed data not available
        return NextResponse.json(module);
      }
    }
    
    // Fallback to legacy data structure
    const moduleDataPath = path.join(process.cwd(), 'data', 'ecg-modules.json');
    
    if (fs.existsSync(moduleDataPath)) {
      const moduleData = JSON.parse(fs.readFileSync(moduleDataPath, 'utf8'));
      const module = moduleData.find(m => m.id === id || m.title === decodedId);
      
      if (module) {
        return NextResponse.json(module);
      }
    }
    
    return NextResponse.json({ error: 'Module not found' }, { status: 404 });
  } catch (error) {
    console.error('Error loading module data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    // Update module data
    const moduleDataPath = path.join(process.cwd(), 'data', 'ecg-modules.json');
    const moduleData = JSON.parse(fs.readFileSync(moduleDataPath, 'utf8'));
    
    const moduleIndex = moduleData.findIndex(m => m.id === id);
    if (moduleIndex === -1) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }
    
    moduleData[moduleIndex] = { ...moduleData[moduleIndex], ...updates };
    fs.writeFileSync(moduleDataPath, JSON.stringify(moduleData, null, 2));
    
    return NextResponse.json(moduleData[moduleIndex]);
  } catch (error) {
    console.error('Error updating module data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


