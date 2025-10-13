import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all slides for a module
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const slides = await prisma.moduleSlide.findMany({
      where: { moduleId: id },
      orderBy: { slideNumber: 'asc' },
      include: userId ? {
        progress: {
          where: { userId }
        }
      } : {}
    });

    return NextResponse.json({
      success: true,
      slides: slides.map(s => ({
        ...s,
        quiz: s.quizData ? JSON.parse(s.quizData) : null,
        clinicalCase: s.clinicalCase ? JSON.parse(s.clinicalCase) : null,
        userProgress: userId && s.progress?.[0] ? s.progress[0] : null
      })),
      total: slides.length
    });
  } catch (error) {
    console.error('Error fetching slides:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch slides', details: error.message },
      { status: 500 }
    );
  }
}

