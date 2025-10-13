import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single module with all slides
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const slides = await prisma.moduleSlide.findMany({
      where: { moduleId: id },
      orderBy: { slideNumber: 'asc' }
    });

    if (slides.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      module: {
        moduleId: id,
        moduleTitle: slides[0].moduleSource || id,
        slides: slides.map(s => ({
          id: s.id,
          slideNumber: s.slideNumber,
          title: s.title,
          content: s.content,
          contentType: s.contentType,
          duration: s.duration,
          interactive: s.interactive,
          images: s.images,
          audioFile: s.audioFile,
          quiz: s.quizData ? JSON.parse(s.quizData) : null,
          clinicalCase: s.clinicalCase ? JSON.parse(s.clinicalCase) : null
        })),
        metadata: {
          totalSlides: slides.length,
          estimatedDuration: slides.reduce((sum, s) => sum + s.duration, 0)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch module', details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE module
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { slides } = await request.json();

    // Delete existing slides
    await prisma.moduleSlide.deleteMany({
      where: { moduleId: id }
    });

    // Create new slides
    const createdSlides = await Promise.all(
      slides.map((slide, index) =>
        prisma.moduleSlide.create({
          data: {
            moduleId: id,
            slideNumber: index + 1,
            title: slide.title || `Slide ${index + 1}`,
            content: typeof slide.content === 'string' ? slide.content : JSON.stringify(slide.content),
            contentType: slide.contentType || 'text',
            duration: slide.duration || 2,
            interactive: slide.interactive || false,
            images: slide.images || [],
            quizData: slide.quiz ? JSON.stringify(slide.quiz) : null
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Module updated with ${createdSlides.length} slides`
    });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update module', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE module
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.moduleSlide.deleteMany({
      where: { moduleId: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete module', details: error.message },
      { status: 500 }
    );
  }
}

