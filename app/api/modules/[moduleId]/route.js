import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const MODULES_DIR = path.join(process.cwd(), 'public', 'modules')

export async function GET(request, { params }) {
  try {
    const { moduleId } = params
    
    const moduleDirs = await fs.readdir(MODULES_DIR)
    
    for (const dir of moduleDirs) {
      const moduleJsonPath = path.join(MODULES_DIR, dir, 'module.json')
      try {
        const raw = await fs.readFile(moduleJsonPath, 'utf8')
        const mod = JSON.parse(raw)
        
        if (mod.moduleId === moduleId) {
          return NextResponse.json({
            success: true,
            module: mod
          })
        }
      } catch (e) {
        continue
      }
    }
    
    return NextResponse.json({
      success: false,
      error: 'Module not found'
    }, { status: 404 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch module'
    }, { status: 500 })
  }
}
