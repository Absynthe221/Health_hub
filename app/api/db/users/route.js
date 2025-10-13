import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET all users (admin only)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const where = role ? { role: role.toUpperCase() } : {};

    const users = await prisma.user.findMany({
      where,
      include: {
        profile: true,
        _count: {
          select: {
            slideProgress: true,
            enrollments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        emailVerified: u.emailVerified,
        createdAt: u.createdAt,
        profile: u.profile,
        stats: {
          slidesCompleted: u._count.slideProgress,
          enrollments: u._count.enrollments
        }
      })),
      total: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}

// CREATE user (admin only)
export async function POST(request) {
  try {
    const { email, name, role, password } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role?.toUpperCase() || 'LEARNER',
        emailVerified: new Date(),
        profile: {
          create: {
            points: 0,
            streak: 0,
            level: 'Beginner',
            badges: JSON.stringify([])
          }
        }
      },
      include: {
        profile: true
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}

