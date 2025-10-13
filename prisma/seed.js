const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clean existing data (optional - comment out if you want to preserve data)
  console.log('🗑️  Cleaning existing data...');
  await prisma.slideProgress.deleteMany({});
  await prisma.knowledgeCheckAttempt.deleteMany({});
  await prisma.puzzleGameAttempt.deleteMany({});
  await prisma.audioNarration.deleteMany({});
  await prisma.moduleAssignment.deleteMany({});
  await prisma.moduleSlide.deleteMany({});
  await prisma.userProfile.deleteMany({});
  
  console.log('✅ Cleanup complete\n');

  // Create Users
  console.log('👥 Creating users...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@healthhub.com' },
    update: {},
    create: {
      email: 'admin@healthhub.com',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
      profile: {
        create: {
          points: 0,
          streak: 0,
          level: 'Administrator',
          badges: JSON.stringify([])
        }
      }
    }
  });

  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@healthhub.com' },
    update: {},
    create: {
      email: 'instructor@healthhub.com',
      name: 'Dr. Sarah Johnson',
      role: 'INSTRUCTOR',
      emailVerified: new Date(),
      profile: {
        create: {
          points: 0,
          streak: 0,
          level: 'Instructor',
          badges: JSON.stringify([])
        }
      }
    }
  });

  const learner = await prisma.user.upsert({
    where: { email: 'learner@healthhub.com' },
    update: {},
    create: {
      email: 'learner@healthhub.com',
      name: 'Alex Johnson',
      role: 'LEARNER',
      emailVerified: new Date(),
      profile: {
        create: {
          points: 2450,
          streak: 12,
          level: 'Intermediate',
          rank: 23,
          badges: JSON.stringify([
            { name: 'Early Bird', icon: '🌅', earned: true },
            { name: 'Week Warrior', icon: '💪', earned: true },
            { name: 'Quiz Master', icon: '🎯', earned: true }
          ])
        }
      }
    }
  });

  console.log(`✅ Created users: ${admin.email}, ${instructor.email}, ${learner.email}\n`);

  // Import Module Data from JSON
  console.log('📚 Importing modules from JSON files...');

  const modulesDir = path.join(process.cwd(), 'public', 'modules');
  const moduleIds = ['module-1-basic-ecg-interpretations', 'module-2-case-studies'];

  let totalSlidesImported = 0;

  for (const moduleId of moduleIds) {
    const modulePath = path.join(modulesDir, moduleId, 'module.json');
    
    if (fs.existsSync(modulePath)) {
      const moduleData = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
      
      console.log(`  📖 Importing ${moduleData.moduleTitle}...`);
      
      // Import each slide
      for (let i = 0; i < moduleData.slides.length; i++) {
        const slide = moduleData.slides[i];
        
        await prisma.moduleSlide.create({
          data: {
            moduleId: moduleId,
            slideNumber: i + 1,
            title: slide.title || `Slide ${i + 1}`,
            content: typeof slide.content === 'string' ? slide.content : JSON.stringify(slide.content),
            contentType: slide.contentType || 'text',
            duration: slide.duration || 2,
            interactive: slide.interactive || false,
            images: slide.images || [],
            audioFile: slide.audioFile || null,
            videoFile: slide.video || null,
            quizData: slide.quiz ? JSON.stringify(slide.quiz) : null,
            puzzleData: slide.puzzleData ? JSON.stringify(slide.puzzleData) : null,
            clinicalCase: slide.content?.clinicalPresentation ? JSON.stringify(slide.content) : null,
            moduleSource: slide.moduleSource || null
          }
        });
        
        totalSlidesImported++;
      }
      
      console.log(`  ✅ Imported ${moduleData.slides.length} slides from ${moduleData.moduleTitle}`);
    }
  }

  console.log(`\n✅ Total slides imported: ${totalSlidesImported}\n`);

  // Create Module Assignments
  console.log('📋 Creating module assignments...');
  
  await prisma.moduleAssignment.create({
    data: {
      userId: learner.id,
      moduleId: 'module-1-basic-ecg-interpretations',
      status: 'IN_PROGRESS'
    }
  });

  await prisma.moduleAssignment.create({
    data: {
      userId: learner.id,
      moduleId: 'module-2-case-studies',
      status: 'ASSIGNED'
    }
  });

  console.log('✅ Module assignments created\n');

  // Create Sample Slide Progress
  console.log('📊 Creating sample progress data...');
  
  const firstFiveSlides = await prisma.moduleSlide.findMany({
    where: { moduleId: 'module-1-basic-ecg-interpretations' },
    take: 5,
    orderBy: { slideNumber: 'asc' }
  });

  for (const slide of firstFiveSlides) {
    await prisma.slideProgress.create({
      data: {
        userId: learner.id,
        slideId: slide.id,
        completed: true,
        timeSpent: Math.floor(Math.random() * 300) + 60, // 1-6 minutes
        quizScore: Math.floor(Math.random() * 30) + 70, // 70-100%
        lastAccessed: new Date()
      }
    });
  }

  console.log('✅ Sample progress created\n');

  // Create Sample Knowledge Check Attempts
  console.log('✓ Creating knowledge check attempts...');
  
  if (firstFiveSlides.length > 0) {
    await prisma.knowledgeCheckAttempt.create({
      data: {
        userId: learner.id,
        slideId: firstFiveSlides[0].id,
        questionText: 'Sample knowledge check question',
        selectedAnswer: 0,
        correctAnswer: 0,
        isCorrect: true,
        timeSpent: 45
      }
    });
  }

  console.log('✅ Knowledge checks created\n');

  // Create Sample Puzzle Attempts
  console.log('🎮 Creating puzzle game attempts...');
  
  await prisma.puzzleGameAttempt.create({
    data: {
      userId: learner.id,
      puzzleType: 'ecg_components',
      score: 85,
      timeSpent: 245,
      hintsUsed: 1,
      completed: true,
      perfectScore: false
    }
  });

  await prisma.puzzleGameAttempt.create({
    data: {
      userId: learner.id,
      puzzleType: 'lead_placement',
      score: 100,
      timeSpent: 312,
      hintsUsed: 0,
      completed: true,
      perfectScore: true
    }
  });

  console.log('✅ Puzzle attempts created\n');

  // Summary
  const userCount = await prisma.user.count();
  const slideCount = await prisma.moduleSlide.count();
  const assignmentCount = await prisma.moduleAssignment.count();
  const progressCount = await prisma.slideProgress.count();

  console.log('='.repeat(60));
  console.log('🎊 DATABASE SEEDING COMPLETE!\n');
  console.log('📊 Summary:');
  console.log(`   Users: ${userCount}`);
  console.log(`   Slides: ${slideCount}`);
  console.log(`   Assignments: ${assignmentCount}`);
  console.log(`   Progress Records: ${progressCount}`);
  console.log('='.repeat(60));
  console.log('\n✅ Database is ready for use!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

