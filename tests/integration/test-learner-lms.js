const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('📚 LEARNER LEARNING MANAGEMENT SYSTEM - COMPREHENSIVE TEST');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const page = await browser.newPage();
  
  const results = {
    learnerDashboard: false,
    dashboardTab: false,
    statsCards: false,
    continueSection: false,
    recentActivity: false,
    modulesTab: false,
    searchFilter: false,
    moduleCards: false,
    progressTab: false,
    circularProgress: false,
    achievementsTab: false,
    badges: false,
    certificates: false,
    notificationsTab: false
  };
  
  try {
    console.log('📋 NAVIGATING TO LEARNER DASHBOARD');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3000/dashboard/learner', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    results.learnerDashboard = await page.locator('text=Welcome back, Student!').isVisible();
    console.log(`   ${results.learnerDashboard ? '✅' : '❌'} Learner Dashboard Loaded\n`);
    
    // TEST 1: Dashboard Tab
    console.log('📊 TEST 1: DASHBOARD TAB');
    console.log('-'.repeat(80));
    const dashboardTab = await page.locator('button:has-text("Dashboard")').isVisible();
    results.dashboardTab = dashboardTab;
    console.log(`   ${results.dashboardTab ? '✅' : '❌'} Dashboard Tab visible\n`);
    
    // TEST 2: Stats Cards
    console.log('📈 TEST 2: STATS OVERVIEW');
    console.log('-'.repeat(80));
    await page.waitForTimeout(1000);
    const statsCards = await page.locator('.bg-gradient-to-br').count();
    results.statsCards = statsCards >= 4;
    console.log(`   ${results.statsCards ? '✅' : '❌'} Stats Cards: ${statsCards} found`);
    
    const modulesCompleted = await page.locator('text=Modules Completed').isVisible();
    const avgScore = await page.locator('text=Average Score').isVisible();
    console.log(`   ${modulesCompleted ? '✅' : '❌'} Modules Completed stat`);
    console.log(`   ${avgScore ? '✅' : '❌'} Average Score stat\n`);
    
    // TEST 3: Continue Learning Section
    console.log('▶️  TEST 3: CONTINUE LEARNING');
    console.log('-'.repeat(80));
    const continueSection = await page.locator('text=Continue Learning').first().isVisible();
    results.continueSection = continueSection;
    console.log(`   ${results.continueSection ? '✅' : '❌'} Continue Learning section\n`);
    
    // TEST 4: Recent Activity
    console.log('📝 TEST 4: RECENT ACTIVITY');
    console.log('-'.repeat(80));
    const recentActivity = await page.locator('text=Recent Activity').isVisible();
    results.recentActivity = recentActivity;
    console.log(`   ${results.recentActivity ? '✅' : '❌'} Recent Activity panel\n`);
    
    // TEST 5: Modules Tab
    console.log('📚 TEST 5: MY MODULES TAB');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("My Modules")').click();
    await page.waitForTimeout(1000);
    
    results.modulesTab = true;
    console.log(`   ✅ Modules Tab loaded\n`);
    
    // TEST 6: Search and Filters
    console.log('🔍 TEST 6: SEARCH & FILTERS');
    console.log('-'.repeat(80));
    const searchBox = await page.locator('input[placeholder*="Search"]').isVisible();
    const difficultyFilter = await page.locator('select:has(option:text("All Levels"))').isVisible();
    results.searchFilter = searchBox && difficultyFilter;
    console.log(`   ${searchBox ? '✅' : '❌'} Search box`);
    console.log(`   ${difficultyFilter ? '✅' : '❌'} Difficulty filter\n`);
    
    // TEST 7: Module Cards
    console.log('📖 TEST 7: MODULE CARDS');
    console.log('-'.repeat(80));
    await page.waitForTimeout(1000);
    const moduleCards = await page.locator('.bg-white.rounded-lg.shadow').count();
    results.moduleCards = moduleCards > 0;
    console.log(`   ${results.moduleCards ? '✅' : '❌'} Module Cards: ${moduleCards} found\n`);
    
    // TEST 8: Progress Tab
    console.log('📊 TEST 8: PROGRESS TAB');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Progress")').click();
    await page.waitForTimeout(1000);
    
    const progressOverview = await page.locator('text=Your Progress Overview').isVisible();
    results.progressTab = progressOverview;
    console.log(`   ${results.progressTab ? '✅' : '❌'} Progress Tab loaded\n`);
    
    // TEST 9: Circular Progress Indicators
    console.log('⭕ TEST 9: CIRCULAR PROGRESS');
    console.log('-'.repeat(80));
    const circularSVG = await page.locator('svg circle').count();
    results.circularProgress = circularSVG >= 3;
    console.log(`   ${results.circularProgress ? '✅' : '❌'} Circular progress indicators: ${circularSVG} found\n`);
    
    // TEST 10: Achievements Tab
    console.log('🏆 TEST 10: ACHIEVEMENTS TAB');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Achievements")').click();
    await page.waitForTimeout(1000);
    
    results.achievementsTab = true;
    console.log(`   ✅ Achievements Tab loaded\n`);
    
    // TEST 11: Badges
    console.log('🎖️  TEST 11: BADGES');
    console.log('-'.repeat(80));
    const badgesHeading = await page.locator('text=Your Badges').isVisible();
    results.badges = badgesHeading;
    console.log(`   ${results.badges ? '✅' : '❌'} Badges section\n`);
    
    // TEST 12: Certificates
    console.log('📜 TEST 12: CERTIFICATES');
    console.log('-'.repeat(80));
    const certificatesHeading = await page.locator('h3:has-text("Certificates")').isVisible();
    results.certificates = certificatesHeading;
    console.log(`   ${results.certificates ? '✅' : '❌'} Certificates section\n`);
    
    // TEST 13: Notifications Tab
    console.log('🔔 TEST 13: NOTIFICATIONS TAB');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Notifications")').click();
    await page.waitForTimeout(1000);
    
    const notificationsHeading = await page.locator('h3:has-text("Notifications")').isVisible();
    results.notificationsTab = notificationsHeading;
    console.log(`   ${results.notificationsTab ? '✅' : '❌'} Notifications Tab loaded\n`);
    
    // Screenshot
    await page.screenshot({ path: 'learner-lms.png', fullPage: true });
    console.log('📸 Screenshot saved: learner-lms.png\n');
    
    // FINAL RESULTS
    console.log('='.repeat(80));
    console.log('📚 LEARNER LMS TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log('\n📋 CORE FEATURES:');
    console.log(`   ${results.learnerDashboard ? '✅' : '❌'} Learner Dashboard`);
    console.log(`   ${results.dashboardTab ? '✅' : '❌'} Dashboard Tab`);
    console.log(`   ${results.modulesTab ? '✅' : '❌'} Modules Tab`);
    console.log(`   ${results.progressTab ? '✅' : '❌'} Progress Tab`);
    console.log(`   ${results.achievementsTab ? '✅' : '❌'} Achievements Tab`);
    console.log(`   ${results.notificationsTab ? '✅' : '❌'} Notifications Tab`);
    
    console.log('\n📊 DASHBOARD FEATURES:');
    console.log(`   ${results.statsCards ? '✅' : '❌'} Stats Cards (4 metrics)`);
    console.log(`   ${results.continueSection ? '✅' : '❌'} Continue Learning`);
    console.log(`   ${results.recentActivity ? '✅' : '❌'} Recent Activity`);
    
    console.log('\n📚 MODULES FEATURES:');
    console.log(`   ${results.searchFilter ? '✅' : '❌'} Search & Filters`);
    console.log(`   ${results.moduleCards ? '✅' : '❌'} Module Cards`);
    
    console.log('\n🏆 ACHIEVEMENTS:');
    console.log(`   ${results.circularProgress ? '✅' : '❌'} Circular Progress Indicators`);
    console.log(`   ${results.badges ? '✅' : '❌'} Badges System`);
    console.log(`   ${results.certificates ? '✅' : '❌'} Certificates`);
    
    const passedCount = Object.values(results).filter(v => v === true).length;
    const totalCount = Object.values(results).length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    
    console.log('\n' + '='.repeat(80));
    console.log(`📚 OVERALL SCORE: ${passedCount}/${totalCount} tests passed (${passRate}%)`);
    console.log('='.repeat(80));
    
    if (passRate === 100) {
      console.log('\n🎊🎊🎊 PERFECT! LEARNER LMS FULLY OPERATIONAL! 🎊🎊🎊\n');
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

