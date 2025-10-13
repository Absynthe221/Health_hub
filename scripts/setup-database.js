#!/usr/bin/env node

/**
 * Database Setup Script for Health Hub ECG Platform
 * This script sets up the database, runs migrations, and seeds initial data
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function setupDatabase() {
  console.log('🗄️  Setting up Health Hub ECG Database...\n');

  try {
    // 1. Test database connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Database connection successful\n');

    // 2. Check if tables exist
    console.log('2. Checking database schema...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(`   📋 Found ${tables.length} tables in database\n`);

    // 3. Seed initial data if needed
    await seedInitialData();

    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedInitialData() {
  console.log('3. Seeding initial data...');

  try {
    // Check if we already have users
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log('   ⚠️  Users already exist, skipping user seeding');
      return;
    }

    // Create default users
    const defaultUsers = [
      {
        id: 'admin-user-001',
        name: 'Admin User',
        email: 'admin@healthhub.com',
        role: 'ADMIN',
        emailVerified: new Date()
      },
      {
        id: 'instructor-user-001',
        name: 'Instructor User',
        email: 'instructor@healthhub.com',
        role: 'INSTRUCTOR',
        emailVerified: new Date()
      },
      {
        id: 'learner-user-001',
        name: 'Student User',
        email: 'student@healthhub.com',
        role: 'LEARNER',
        emailVerified: new Date()
      }
    ];

    for (const userData of defaultUsers) {
      await prisma.user.create({
        data: userData
      });
      console.log(`   ✅ Created ${userData.role.toLowerCase()} user: ${userData.email}`);
    }

    // Create sample ECG course
    const ecgCourse = await prisma.course.create({
      data: {
        id: 'ecg-course-001',
        title: 'ECG Interpretation Mastery',
        description: 'Comprehensive ECG interpretation course for healthcare professionals',
        thumbnail: '/images/ecg-course-thumbnail.jpg',
        isPublished: true,
        createdBy: 'instructor-user-001'
      }
    });
    console.log(`   ✅ Created ECG course: ${ecgCourse.title}`);

    // Create ECG modules
    const ecgModules = [
      {
        id: 'ecg-module-001',
        title: 'ECG Fundamentals',
        description: 'Basic ECG concepts and anatomy',
        order: 1,
        courseId: ecgCourse.id
      },
      {
        id: 'ecg-module-002',
        title: 'Cardiac Rhythm Recognition',
        description: 'Identifying normal and abnormal rhythms',
        order: 2,
        courseId: ecgCourse.id
      },
      {
        id: 'ecg-module-003',
        title: 'Arrhythmia Analysis',
        description: 'Advanced arrhythmia interpretation',
        order: 3,
        courseId: ecgCourse.id
      }
    ];

    for (const moduleData of ecgModules) {
      await prisma.module.create({
        data: moduleData
      });
      console.log(`   ✅ Created ECG module: ${moduleData.title}`);
    }

    // Enroll the learner in the ECG course
    await prisma.enrollment.create({
      data: {
        userId: 'learner-user-001',
        courseId: ecgCourse.id,
        status: 'ENROLLED'
      }
    });
    console.log('   ✅ Enrolled learner in ECG course');

    console.log('   🎉 Initial data seeding completed!\n');

  } catch (error) {
    console.error('   ❌ Error seeding initial data:', error);
    throw error;
  }
}

async function checkDatabaseHealth() {
  console.log('4. Checking database health...');

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('   ✅ Database connection healthy');

    // Check user count
    const userCount = await prisma.user.count();
    console.log(`   📊 Users in database: ${userCount}`);

    // Check course count
    const courseCount = await prisma.course.count();
    console.log(`   📚 Courses in database: ${courseCount}`);

    // Check module count
    const moduleCount = await prisma.module.count();
    console.log(`   📖 Modules in database: ${moduleCount}`);

    console.log('   ✅ Database health check completed\n');

  } catch (error) {
    console.error('   ❌ Database health check failed:', error);
    throw error;
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('🚀 Database setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = {
  setupDatabase,
  seedInitialData,
  checkDatabaseHealth
};

