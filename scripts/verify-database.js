const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyDatabase() {
  console.log('🔍 Verifying database setup...\n');

  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful\n');

    // Count records in each table
    const userCount = await prisma.user.count();
    const slideCount = await prisma.moduleSlide.count();
    const progressCount = await prisma.slideProgress.count();
    const assignmentCount = await prisma.moduleAssignment.count();
    const profileCount = await prisma.userProfile.count();
    const knowledgeCheckCount = await prisma.knowledgeCheckAttempt.count();
    const puzzleAttemptCount = await prisma.puzzleGameAttempt.count();

    console.log('📊 Database Statistics:');
    console.log('═'.repeat(60));
    console.log(`   Users:                 ${userCount}`);
    console.log(`   User Profiles:         ${profileCount}`);
    console.log(`   Module Slides:         ${slideCount}`);
    console.log(`   Module Assignments:    ${assignmentCount}`);
    console.log(`   Slide Progress:        ${progressCount}`);
    console.log(`   Knowledge Checks:      ${knowledgeCheckCount}`);
    console.log(`   Puzzle Attempts:       ${puzzleAttemptCount}`);
    console.log('═'.repeat(60));
    console.log('');

    // Get module breakdown
    const modules = await prisma.moduleSlide.groupBy({
      by: ['moduleId'],
      _count: {
        id: true
      }
    });

    console.log('📚 Module Breakdown:');
    console.log('─'.repeat(60));
    for (const module of modules) {
      console.log(`   ${module.moduleId}: ${module._count.id} slides`);
    }
    console.log('─'.repeat(60));
    console.log('');

    // Get user details
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        _count: {
          select: {
            slideProgress: true
          }
        }
      }
    });

    console.log('👥 Users:');
    console.log('─'.repeat(60));
    for (const user of users) {
      console.log(`   ${user.email}`);
      console.log(`      Role: ${user.role}`);
      console.log(`      Progress: ${user._count.slideProgress} slides`);
      if (user.profile) {
        console.log(`      Points: ${user.profile.points}`);
        console.log(`      Level: ${user.profile.level}`);
        console.log(`      Streak: ${user.profile.streak} days`);
      }
      console.log('');
    }
    console.log('─'.repeat(60));
    console.log('');

    // Test relationships
    console.log('🔗 Testing Relationships:');
    console.log('─'.repeat(60));

    const sampleProgress = await prisma.slideProgress.findFirst({
      include: {
        user: {
          select: {
            email: true
          }
        },
        slide: {
          select: {
            title: true,
            moduleId: true
          }
        }
      }
    });

    if (sampleProgress) {
      console.log('   ✅ User → Progress → Slide relationship working');
      console.log(`      ${sampleProgress.user.email} → ${sampleProgress.slide.title}`);
    } else {
      console.log('   ℹ️  No progress data yet');
    }

    const sampleAssignment = await prisma.moduleAssignment.findFirst();
    if (sampleAssignment) {
      console.log('   ✅ Module assignments working');
      console.log(`      Status: ${sampleAssignment.status}`);
    }

    console.log('─'.repeat(60));
    console.log('');

    // Summary
    const isValid = userCount >= 3 && slideCount >= 170;

    if (isValid) {
      console.log('🎊 DATABASE VERIFICATION PASSED!');
      console.log('');
      console.log('Your database is properly set up and ready to use.');
      console.log('');
      console.log('Next steps:');
      console.log('   1. Start dev server: npm run dev');
      console.log('   2. View data: npx prisma studio');
      console.log('   3. Test APIs: Check DATABASE_SETUP_COMPLETE.md');
      console.log('');
    } else {
      console.log('⚠️  DATABASE INCOMPLETE');
      console.log('');
      console.log('Expected: 3+ users, 170+ slides');
      console.log(`Found: ${userCount} users, ${slideCount} slides`);
      console.log('');
      console.log('Run: npm run db:seed');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    console.log('');
    console.log('Common issues:');
    console.log('   1. DATABASE_URL not set in .env.local');
    console.log('   2. Database not accessible');
    console.log('   3. Schema not pushed: Run "npx prisma db push"');
    console.log('');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();

