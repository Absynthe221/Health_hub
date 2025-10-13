import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET user-specific progress
export async function GET(request, { params }) {
  try {
    const { userId } = params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        slideProgress: {
          include: {
            slide: true
          },
          orderBy: {
            lastAccessed: 'desc'
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Group progress by module
    const progressByModule = {};
    user.slideProgress.forEach(sp => {
      const moduleId = sp.slide.moduleId;
      if (!progressByModule[moduleId]) {
        progressByModule[moduleId] = {
          moduleId,
          slides: [],
          completed: 0,
          total: 0,
          timeSpent: 0
        };
      }
      progressByModule[moduleId].slides.push(sp);
      progressByModule[moduleId].total++;
      if (sp.completed) progressByModule[moduleId].completed++;
      progressByModule[moduleId].timeSpent += sp.timeSpent;
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      profile: user.profile,
      progressByModule,
      totalProgress: user.slideProgress.length,
      overallCompletion: user.slideProgress.filter(sp => sp.completed).length
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user progress', details: error.message },
      { status: 500 }
    );
  }
}

