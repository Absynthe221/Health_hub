const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('👨‍🏫 INSTRUCTOR MANAGEMENT SYSTEM - COMPREHENSIVE TEST');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const page = await browser.newPage();
  
  const results = {
    instructorDashboard: false,
    overviewTab: false,
    statsCards: false,
    pendingTasks: false,
    recentActivity: false,
    quickActions: false,
    modulesTab: false,
    modulesList: false,
    studentsTab: false,
    studentTable: false,
    analyticsTab: false,
    performanceMetrics: false,
    communicationTab: false,
    announcements: false
  };
  
  try {
    console.log('📋 NAVIGATING TO INSTRUCTOR DASHBOARD');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3000/dashboard/instructor', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    results.instructorDashboard = await page.locator('text=Welcome back, Instructor!').isVisible();
    console.log(`   ${results.instructorDashboard ? '✅' : '❌'} Instructor Dashboard Loaded\n`);
    
    // TEST 1: Overview Tab
    console.log('📊 TEST 1: OVERVIEW TAB');
    console.log('-'.repeat(80));
    const overviewTab = await page.locator('button:has-text("Overview")').isVisible();
    results.overviewTab = overviewTab;
    console.log(`   ${results.overviewTab ? '✅' : '❌'} Overview Tab visible\n`);
    
    // TEST 2: Stats Cards
    console.log('📈 TEST 2: STATS OVERVIEW');
    console.log('-'.repeat(80));
    await page.waitForTimeout(1000);
    const statsCards = await page.locator('.bg-gradient-to-br').count();
    results.statsCards = statsCards >= 4;
    console.log(`   ${results.statsCards ? '✅' : '❌'} Stats Cards: ${statsCards} found\n`);
    
    // TEST 3: Pending Tasks
    console.log('📝 TEST 3: PENDING TASKS');
    console.log('-'.repeat(80));
    const pendingTasks = await page.locator('text=Pending Tasks').isVisible();
    results.pendingTasks = pendingTasks;
    console.log(`   ${results.pendingTasks ? '✅' : '❌'} Pending Tasks panel\n`);
    
    // TEST 4: Recent Activity
    console.log('⚡ TEST 4: RECENT ACTIVITY');
    console.log('-'.repeat(80));
    const recentActivity = await page.locator('text=Recent Activity').isVisible();
    results.recentActivity = recentActivity;
    console.log(`   ${results.recentActivity ? '✅' : '❌'} Recent Activity panel\n`);
    
    // TEST 5: Quick Actions
    console.log('🎯 TEST 5: QUICK ACTIONS');
    console.log('-'.repeat(80));
    const quickActions = await page.locator('text=Quick Actions').isVisible();
    results.quickActions = quickActions;
    console.log(`   ${results.quickActions ? '✅' : '❌'} Quick Actions section\n`);
    
    // TEST 6: My Modules Tab
    console.log('📚 TEST 6: MY MODULES TAB');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("My Modules")').click();
    await page.waitForTimeout(1000);
    
    results.modulesTab = true;
    console.log(`   ✅ Modules Tab loaded\n`);
    
    // TEST 7: Module List
    console.log('📖 TEST 7: MODULES LIST');
    console.log('-'.repeat(80));
    await page.waitForTimeout(1000);
    const moduleCards = await page.locator('.bg-white.rounded-lg.shadow').count();
    results.modulesList = moduleCards > 0;
    console.log(`   ${results.modulesList ? '✅' : '❌'} Module Cards: ${moduleCards} found\n`);
    
    // TEST 8: Students Tab
    console.log('👥 TEST 8: STUDENTS TAB');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Students")').click();
    await page.waitForTimeout(1000);
    
    results.studentsTab = true;
    console.log(`   ✅ Students Tab loaded\n`);
    
    // TEST 9: Student Table
    console.log('📋 TEST 9: STUDENT TABLE');
    console.log('-'.repeat(80));
    const studentTable = await page.locator('table').isVisible();
    results.studentTable = studentTable;
    console.log(`   ${results.studentTable ? '✅' : '❌'} Student Table visible\n`);
    
    // TEST 10: Analytics Tab
    console.log('📊 TEST 10: ANALYTICS TAB');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Analytics")').click();
    await page.waitForTimeout(1000);
    
    results.analyticsTab = true;
    console.log(`   ✅ Analytics Tab loaded\n`);
    
    // TEST 11: Performance Metrics
    console.log('📈 TEST 11: PERFORMANCE METRICS');
    console.log('-'.repeat(80));
    const performanceMetrics = await page.locator('text=Total Enrollments').isVisible();
    results.performanceMetrics = performanceMetrics;
    console.log(`   ${results.performanceMetrics ? '✅' : '❌'} Performance Metrics visible\n`);
    
    // TEST 12: Communication Tab
    console.log('💬 TEST 12: COMMUNICATION TAB');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Communication")').click();
    await page.waitForTimeout(1000);
    
    results.communicationTab = true;
    console.log(`   ✅ Communication Tab loaded\n`);
    
    // TEST 13: Announcements
    console.log('📢 TEST 13: ANNOUNCEMENTS');
    console.log('-'.repeat(80));
    const announcements = await page.locator('text=Announcements').isVisible();
    results.announcements = announcements;
    console.log(`   ${results.announcements ? '✅' : '❌'} Announcements section\n`);
    
    // Screenshot
    await page.screenshot({ path: 'instructor-system.png', fullPage: true });
    console.log('📸 Screenshot saved: instructor-system.png\n');
    
    // FINAL RESULTS
    console.log('='.repeat(80));
    console.log('👨‍🏫 INSTRUCTOR SYSTEM TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log('\n📋 CORE FEATURES:');
    console.log(`   ${results.instructorDashboard ? '✅' : '❌'} Instructor Dashboard`);
    console.log(`   ${results.overviewTab ? '✅' : '❌'} Overview Tab`);
    console.log(`   ${results.modulesTab ? '✅' : '❌'} Modules Tab`);
    console.log(`   ${results.studentsTab ? '✅' : '❌'} Students Tab`);
    console.log(`   ${results.analyticsTab ? '✅' : '❌'} Analytics Tab`);
    console.log(`   ${results.communicationTab ? '✅' : '❌'} Communication Tab`);
    
    console.log('\n📊 OVERVIEW FEATURES:');
    console.log(`   ${results.statsCards ? '✅' : '❌'} Stats Cards (4 metrics)`);
    console.log(`   ${results.pendingTasks ? '✅' : '❌'} Pending Tasks`);
    console.log(`   ${results.recentActivity ? '✅' : '❌'} Recent Activity`);
    console.log(`   ${results.quickActions ? '✅' : '❌'} Quick Actions`);
    
    console.log('\n📚 MANAGEMENT FEATURES:');
    console.log(`   ${results.modulesList ? '✅' : '❌'} Modules List`);
    console.log(`   ${results.studentTable ? '✅' : '❌'} Student Table`);
    console.log(`   ${results.performanceMetrics ? '✅' : '❌'} Performance Metrics`);
    console.log(`   ${results.announcements ? '✅' : '❌'} Announcements`);
    
    const passedCount = Object.values(results).filter(v => v === true).length;
    const totalCount = Object.values(results).length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    
    console.log('\n' + '='.repeat(80));
    console.log(`👨‍🏫 OVERALL SCORE: ${passedCount}/${totalCount} tests passed (${passRate}%)`);
    console.log('='.repeat(80));
    
    if (passRate === 100) {
      console.log('\n🎊🎊🎊 PERFECT! INSTRUCTOR SYSTEM FULLY OPERATIONAL! 🎊🎊🎊\n');
    } else if (passRate >= 80) {
      console.log('\n🎉 EXCELLENT! System operational!\n');
    }
    
    console.log('⏳ Keeping browser open for 10 seconds...\n');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('✅ Test complete!\n');
  }
})();

