import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const MODULES_DIR = path.join(process.cwd(), 'public', 'modules')

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit')) || 50
    const offset = parseInt(searchParams.get('offset')) || 0
    const includeDraft = searchParams.get('includeDraft') === 'true'

    const modules = []

    // Read modules from disk
    let moduleDirs = []
    try {
      moduleDirs = await fs.readdir(MODULES_DIR)
    } catch (e) {
      moduleDirs = []
    }

    for (const dir of moduleDirs) {
      const moduleJsonPath = path.join(MODULES_DIR, dir, 'module.json')
      try {
        const raw = await fs.readFile(moduleJsonPath, 'utf8')
        const mod = JSON.parse(raw)

        // Filter visibility: students see only published by default
        if (!includeDraft && mod.status !== 'published') continue

        // Normalize response for learner consumption
        modules.push({
          moduleId: mod.moduleId,
          moduleTitle: mod.moduleTitle,
          description: mod.description,
          difficulty: mod.difficulty || 'intermediate',
          category: mod.category || 'general',
          status: mod.status || 'draft',
          slides: Array.isArray(mod.slides) ? mod.slides.map(s => ({
            id: s.id,
            title: s.title,
            contentType: s.contentType,
            duration: s.duration,
            interactive: !!s.interactive,
            quiz: !!s.quiz,
          })) : [],
          metadata: {
            totalSlides: mod.metadata?.totalSlides ?? (Array.isArray(mod.slides) ? mod.slides.length : 0),
            interactiveSlides: mod.metadata?.interactiveSlides ?? 0,
            quizItems: mod.metadata?.quizItems ?? 0,
            estimatedDuration: mod.metadata?.estimatedDuration ?? `${(mod.slides?.length || 0) * 2} minutes`,
          },
          progress: {
            status: 'not-started',
            completionPercentage: 0,
          },
        })
      } catch (e) {
        continue
      }
    }

    const paginated = modules.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      modules: paginated,
      pagination: {
        total: modules.length,
        limit,
        offset,
        hasMore: offset + limit < modules.length,
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch student modules'
    }, { status: 500 })
  }
}