import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all modules
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const modules = await prisma.moduleSlide.groupBy({
      by: ['moduleId'],
      _count: {
        id: true
      }
    });

    // Get detailed module info
    const moduleDetails = await Promise.all(
      modules.map(async (m) => {
        const slides = await prisma.moduleSlide.findMany({
          where: { moduleId: m.moduleId },
          orderBy: { slideNumber: 'asc' }
        });

        const firstSlide = slides[0];
        const assignment = userId ? await prisma.moduleAssignment.findUnique({
          where: {
            userId_moduleId: {
              userId,
              moduleId: m.moduleId
            }
          }
        }) : null;

        return {
          moduleId: m.moduleId,
          moduleTitle: firstSlide?.moduleSource || m.moduleId,
          slideCount: m._count.id,
          status: assignment?.status || 'ASSIGNED',
          assignedAt: assignment?.assignedAt,
          dueDate: assignment?.dueDate
        };
      })
    );

    return NextResponse.json({
      success: true,
      modules: moduleDetails,
      total: modules.length
    });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch modules', details: error.message },
      { status: 500 }
    );
  }
}

// CREATE new module (admin/instructor only)
export async function POST(request) {
  try {
    const { moduleId, moduleTitle, slides } = await request.json();

    if (!moduleId || !slides || !Array.isArray(slides)) {
      return NextResponse.json(
        { success: false, error: 'moduleId and slides array required' },
        { status: 400 }
      );
    }

    // Create slides
    const createdSlides = await Promise.all(
      slides.map((slide, index) =>
        prisma.moduleSlide.create({
          data: {
            moduleId,
            slideNumber: index + 1,
            title: slide.title || `Slide ${index + 1}`,
            content: typeof slide.content === 'string' ? slide.content : JSON.stringify(slide.content),
            contentType: slide.contentType || 'text',
            duration: slide.duration || 2,
            interactive: slide.interactive || false,
            images: slide.images || [],
            audioFile: slide.audioFile || null,
            quizData: slide.quiz ? JSON.stringify(slide.quiz) : null,
            clinicalCase: slide.content?.clinicalPresentation ? JSON.stringify(slide.content) : null
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Module created with ${createdSlides.length} slides`,
      moduleId,
      slideCount: createdSlides.length
    });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create module', details: error.message },
      { status: 500 }
    );
  }
}

