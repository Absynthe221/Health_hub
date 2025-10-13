import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const MODULES_DIR = path.join(process.cwd(), 'public', 'modules')

export async function GET() {
  try {
    const modules = []
    
    try {
      const moduleDirs = await fs.readdir(MODULES_DIR)
      
      for (const dir of moduleDirs) {
        const moduleJsonPath = path.join(MODULES_DIR, dir, 'module.json')
        try {
          const raw = await fs.readFile(moduleJsonPath, 'utf8')
          const mod = JSON.parse(raw)
          
          if (mod.status === 'published' || mod.status === 'draft') {
            modules.push({
              moduleId: mod.moduleId,
              moduleTitle: mod.moduleTitle,
              description: mod.description,
              difficulty: mod.difficulty || 'intermediate',
              slides: mod.slides || [],
              metadata: mod.metadata || {}
            })
          }
        } catch (e) {
          continue
        }
      }
    } catch (e) {
      // modules directory doesn't exist
    }

    return NextResponse.json({
      success: true,
      modules,
      total: modules.length
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch modules'
    }, { status: 500 })
  }
}