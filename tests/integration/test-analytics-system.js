const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('📊 ANALYTICS MANAGEMENT SYSTEM - COMPREHENSIVE TEST');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 700 });
  const page = await browser.newPage();
  
  const results = {
    analyticsTab: false,
    kpiCards: false,
    quickMetrics: false,
    trendsCharts: false,
    topPerformers: false,
    modulePopularity: false,
    deviceUsage: false,
    engagementMetrics: false,
    weeklyTrends: false,
    exportButton: false
  };
  
  try {
    console.log('📋 NAVIGATING TO ANALYTICS TAB');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3000/dashboard/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.waitForSelector('text=Welcome back, Admin!', { timeout: 10000 });
    
    await page.locator('nav.flex.space-x-8 button:has-text("Analytics")').first().click();
    await page.waitForTimeout(2000);
    
    results.analyticsTab = await page.locator('text=Platform Analytics').isVisible();
    console.log(`   ${results.analyticsTab ? '✅' : '❌'} Analytics Tab Loaded\n`);
    
    // TEST 1: KPI Cards
    console.log('📊 TEST 1: KEY PERFORMANCE INDICATORS');
    console.log('-'.repeat(80));
    const kpiCards = await page.locator('.bg-white.rounded-lg.shadow.p-6').count();
    results.kpiCards = kpiCards >= 4;
    console.log(`   ${results.kpiCards ? '✅' : '❌'} KPI Cards: ${kpiCards} cards found`);
    
    const totalUsers = await page.locator('text=/Total Users.*200/').isVisible();
    const completionRate = await page.locator('text=/Completion Rate.*68/').isVisible();
    console.log(`   ${totalUsers ? '✅' : '❌'} Total Users metric visible`);
    console.log(`   ${completionRate ? '✅' : '❌'} Completion Rate metric visible\n`);
    
    // TEST 2: Quick Metrics
    console.log('📈 TEST 2: QUICK METRIC CARDS');
    console.log('-'.repeat(80));
    const gradientCards = await page.locator('.bg-gradient-to-br').count();
    results.quickMetrics = gradientCards >= 3;
    console.log(`   ${results.quickMetrics ? '✅' : '❌'} Gradient Metric Cards: ${gradientCards} found`);
    
    const learningHours = await page.locator('h4:has-text("Learning Hours")').isVisible();
    const certificates = await page.locator('h4:has-text("Certificates Issued")').isVisible();
    console.log(`   ${learningHours ? '✅' : '❌'} Learning Hours metric`);
    console.log(`   ${certificates ? '✅' : '❌'} Certificates metric\n`);
    
    // TEST 3: Trends Charts
    console.log('📉 TEST 3: TREND VISUALIZATIONS');
    console.log('-'.repeat(80));
    const dailyActivity = await page.locator('h4:has-text("Daily Activity")').isVisible();
    const moduleCompletions = await page.locator('h4:has-text("Module Completions")').isVisible();
    results.trendsCharts = dailyActivity && moduleCompletions;
    console.log(`   ${dailyActivity ? '✅' : '❌'} Daily Activity chart`);
    console.log(`   ${moduleCompletions ? '✅' : '❌'} Module Completions chart\n`);
    
    // TEST 4: Top Performers
    console.log('🏆 TEST 4: TOP PERFORMERS SECTION');
    console.log('-'.repeat(80));
    const topPerformers = await page.locator('text=Top Performers').isVisible();
    const performerCards = await page.locator('.bg-gradient-to-r.from-yellow-50').count();
    results.topPerformers = topPerformers && performerCards > 0;
    console.log(`   ${results.topPerformers ? '✅' : '❌'} Top Performers: ${performerCards} students\n`);
    
    // TEST 5: Module Popularity
    console.log('📚 TEST 5: MODULE POPULARITY');
    console.log('-'.repeat(80));
    const modulePopularity = await page.locator('text=Most Popular Modules').isVisible();
    results.modulePopularity = modulePopularity;
    console.log(`   ${results.modulePopularity ? '✅' : '❌'} Module Popularity section loaded\n`);
    
    // TEST 6: Device Usage
    console.log('💻 TEST 6: DEVICE USAGE BREAKDOWN');
    console.log('-'.repeat(80));
    const deviceUsage = await page.locator('text=Device Usage').isVisible();
    results.deviceUsage = deviceUsage;
    console.log(`   ${results.deviceUsage ? '✅' : '❌'} Device Usage analytics\n`);
    
    // TEST 7: Engagement Metrics
    console.log('⚡ TEST 7: DETAILED ENGAGEMENT METRICS');
    console.log('-'.repeat(80));
    const engagementSection = await page.locator('text=Detailed Engagement Metrics').isVisible();
    results.engagementMetrics = engagementSection;
    console.log(`   ${results.engagementMetrics ? '✅' : '❌'} Engagement Metrics section\n`);
    
    // TEST 8: Weekly Trends
    console.log('📆 TEST 8: WEEKLY TRENDS');
    console.log('-'.repeat(80));
    const weeklyTrends = await page.locator('text=Weekly Trends').isVisible();
    results.weeklyTrends = weeklyTrends;
    console.log(`   ${results.weeklyTrends ? '✅' : '❌'} Weekly Trends visualization\n`);
    
    // TEST 9: Export Button
    console.log('📥 TEST 9: EXPORT FUNCTIONALITY');
    console.log('-'.repeat(80));
    const exportButton = await page.locator('button:has-text("Export Report")').isVisible();
    results.exportButton = exportButton;
    console.log(`   ${results.exportButton ? '✅' : '❌'} Export Report button\n`);
    
    if (exportButton) {
      await page.locator('button:has-text("Export Report")').first().click();
      await page.waitForTimeout(500);
      console.log('   ✅ Export button clicked successfully\n');
    }
    
    // Screenshot
    await page.screenshot({ path: 'analytics-management-system.png', fullPage: true });
    console.log('📸 Screenshot saved: analytics-management-system.png\n');
    
    // FINAL RESULTS
    console.log('='.repeat(80));
    console.log('📊 ANALYTICS MANAGEMENT TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log('\n📋 CORE FEATURES:');
    console.log(`   ${results.analyticsTab ? '✅' : '❌'} Analytics Tab Navigation`);
    console.log(`   ${results.kpiCards ? '✅' : '❌'} KPI Cards (4 metrics)`);
    console.log(`   ${results.quickMetrics ? '✅' : '❌'} Quick Metrics (3 gradient cards)`);
    
    console.log('\n📊 VISUALIZATIONS:');
    console.log(`   ${results.trendsCharts ? '✅' : '❌'} Trend Charts`);
    console.log(`   ${results.topPerformers ? '✅' : '❌'} Top Performers`);
    console.log(`   ${results.modulePopularity ? '✅' : '❌'} Module Popularity`);
    console.log(`   ${results.weeklyTrends ? '✅' : '❌'} Weekly Trends`);
    
    console.log('\n🎮 FUNCTIONALITY:');
    console.log(`   ${results.deviceUsage ? '✅' : '❌'} Device Usage`);
    console.log(`   ${results.engagementMetrics ? '✅' : '❌'} Engagement Metrics`);
    console.log(`   ${results.exportButton ? '✅' : '❌'} Export Functionality`);
    
    const passedCount = Object.values(results).filter(v => v === true).length;
    const totalCount = Object.values(results).length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    
    console.log('\n' + '='.repeat(80));
    console.log(`📊 OVERALL SCORE: ${passedCount}/${totalCount} tests passed (${passRate}%)`);
    console.log('='.repeat(80));
    
    if (passRate === 100) {
      console.log('\n🎊🎊🎊 PERFECT! ANALYTICS SYSTEM FULLY OPERATIONAL! 🎊🎊🎊\n');
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

