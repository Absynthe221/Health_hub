import { NextResponse } from 'next/server';
import { getUsers, updateUser, updateUserModules, getUserById } from '@/lib/shared-users-data';

// Get users from shared data source
const users = getUsers();

export async function GET() {
  try {
    return NextResponse.json({
      users,
      total: users.length,
      stats: {
        totalUsers: users.length,
        admins: users.filter(u => u.role === 'admin').length,
        instructors: users.filter(u => u.role === 'instructor').length,
        students: users.filter(u => u.role === 'student').length,
        averageProgress: Math.round(users.reduce((sum, u) => sum + u.progress, 0) / users.length)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const userData = await request.json();
    
    const newUser = {
      id: (users.length + 1).toString(),
      ...userData,
      progress: 0,
      modulesAssigned: [],
      lastLogin: null,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    return NextResponse.json({
      user: newUser,
      message: 'User created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { userId, modulesAssigned } = await request.json();
    
    const updatedUser = updateUserModules(userId, modulesAssigned);
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log(`Updated user ${updatedUser.name} with modules:`, modulesAssigned);
    
    return NextResponse.json({
      user: updatedUser,
      message: 'User modules updated successfully'
    });
  } catch (error) {
    console.error('Error updating user modules:', error);
    return NextResponse.json(
      { error: 'Failed to update user modules' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, ...updateData } = await request.json();
    
    const updatedUser = updateUser(id, updateData);
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    console.log(`Updated user ${updatedUser.name} with data:`, updateData);
    
    return NextResponse.json({
      user: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    users.splice(userIndex, 1);
    
    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}