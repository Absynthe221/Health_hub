import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(request) {
  try {
    const { moduleId, status } = await request.json();
    
    if (!moduleId || !status) {
      return NextResponse.json(
        { error: 'Module ID and status are required' },
        { status: 400 }
      );
    }

    const modulesPath = path.join(process.cwd(), 'data', 'modules.json');
    
    if (!fs.existsSync(modulesPath)) {
      return NextResponse.json(
        { error: 'Modules file not found' },
        { status: 404 }
      );
    }

    const modulesData = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
    const modules = modulesData.modules || [];
    
    const moduleIndex = modules.findIndex(module => module.id === moduleId);
    
    if (moduleIndex === -1) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Update module status
    modules[moduleIndex].status = status;
    modules[moduleIndex].updatedAt = new Date().toISOString();
    
    if (status === 'published') {
      modules[moduleIndex].publishedAt = new Date().toISOString();
    }

    // Save updated modules
    const updatedModulesData = {
      ...modulesData,
      modules: modules,
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(modulesPath, JSON.stringify(updatedModulesData, null, 2));

    return NextResponse.json({
      success: true,
      module: modules[moduleIndex],
      message: `Module ${status} successfully`
    });

  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Failed to update module status', details: error.message },
      { status: 500 }
    );
  }
}



