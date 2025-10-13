import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET user details
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        slideProgress: {
          include: {
            slide: {
              select: {
                moduleId: true,
                slideNumber: true,
                title: true
              }
            }
          }
        },
        _count: {
          select: {
            slideProgress: true,
            enrollments: true,
            certificates: true
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

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        profile: user.profile,
        progress: user.slideProgress,
        stats: {
          slidesCompleted: user._count.slideProgress,
          enrollments: user._count.enrollments,
          certificates: user._count.certificates
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}

// UPDATE user (admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, email, role } = await request.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role: role.toUpperCase() })
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE user (admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}

