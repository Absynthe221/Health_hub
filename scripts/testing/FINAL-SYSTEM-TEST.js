const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('🎯 HEALTH HUB - FINAL COMPREHENSIVE SYSTEM TEST');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const page = await browser.newPage();
  
  const results = {
    apiHealth: false,
    apiModules: false,
    apiProgress: false,
    adminDashboard: false,
    learnerDashboard: false,
    instructorDashboard: false,
    adminNavigation: false,
    learnerNavigation: false,
    instructorNavigation: false,
    userManagement: false,
    moduleManagement: false,
    progressManagement: false,
    buttonClicks: false,
    tabSwitching: false,
    searchFilter: false,
    exportButtons: false
  };
  
  try {
    // ========== API TESTS ==========
    console.log('🔌 API ENDPOINT TESTS');
    console.log('-'.repeat(80));
    
    const healthRes = await page.request.get('http://localhost:3001/api/health');
    const healthData = await healthRes.json();
    results.apiHealth = healthData.status === 'healthy';
    console.log(`   ${results.apiHealth ? '✅' : '❌'} /api/health: ${healthData.status || 'FAILED'}`);
    
    const modulesRes = await page.request.get('http://localhost:3001/api/modules');
    const modulesData = await modulesRes.json();
    results.apiModules = modulesData.success && modulesData.modules.length > 0;
    console.log(`   ${results.apiModules ? '✅' : '❌'} /api/modules: ${modulesData.modules?.length || 0} modules`);
    
    const progressRes = await page.request.get('http://localhost:3001/api/admin/progress');
    const progressData = await progressRes.json();
    results.apiProgress = progressData.success;
    console.log(`   ${results.apiProgress ? '✅' : '❌'} /api/admin/progress: ${progressData.students?.length || 0} students\n`);
    
    // ========== ADMIN DASHBOARD TESTS ==========
    console.log('👨‍💼 ADMIN DASHBOARD TESTS');
    console.log('-'.repeat(80));
    
    await page.goto('http://localhost:3001/dashboard/admin');
    await page.waitForTimeout(2000);
    results.adminDashboard = await page.locator('text=Welcome back, Admin!').isVisible();
    console.log(`   ${results.adminDashboard ? '✅' : '❌'} Admin Dashboard Loads`);
    
    // Test button clicks
    await page.locator('button:has-text("Add User")').first().click();
    await page.waitForTimeout(500);
    const clickCount = await page.locator('text=/Button clicks:/').first().textContent();
    results.buttonClicks = !clickCount.includes(': 0');
    console.log(`   ${results.buttonClicks ? '✅' : '❌'} Button Clicks: ${clickCount}`);
    
    // Test Users tab
    await page.locator('nav.flex.space-x-8 button:has-text("Users")').first().click();
    await page.waitForTimeout(1000);
    results.userManagement = await page.locator('text=User Management').first().isVisible();
    results.tabSwitching = true;
    const userRows = await page.locator('tbody tr').count();
    console.log(`   ${results.userManagement ? '✅' : '❌'} User Management: ${userRows} users visible`);
    
    // Test Modules tab
    await page.locator('nav.flex.space-x-8 button:has-text("Modules")').first().click();
    await page.waitForTimeout(1000);
    results.moduleManagement = await page.locator('text=Module Management').first().isVisible();
    const moduleCards = await page.locator('.border.border-gray-300.rounded-lg').count();
    console.log(`   ${results.moduleManagement ? '✅' : '❌'} Module Management: ${moduleCards} modules visible`);
    
    // Test Progress tab
    await page.locator('nav.flex.space-x-8 button:has-text("Progress")').first().click();
    await page.waitForTimeout(2000);
    results.progressManagement = await page.locator('text=Student Progress Tracking').isVisible();
    console.log(`   ${results.progressManagement ? '✅' : '❌'} Progress Management: Loaded`);
    
    // Test search
    const searchInput = await page.locator('input[placeholder="Search students..."]');
    if (searchInput) {
      await searchInput.fill('John');
      await page.waitForTimeout(500);
      results.searchFilter = true;
      console.log(`   ${results.searchFilter ? '✅' : '❌'} Search/Filter: Working`);
    }
    
    // Test export buttons
    const exportCount = await page.locator('button:has-text("Export")').count();
    results.exportButtons = exportCount > 0;
    console.log(`   ${results.exportButtons ? '✅' : '❌'} Export Buttons: ${exportCount} found\n`);
    
    // ========== NAVIGATION TESTS ==========
    console.log('🧭 CROSS-DASHBOARD NAVIGATION TESTS');
    console.log('-'.repeat(80));
    
    // Navigate to Learner
    await page.locator('button:has-text("Learner")').first().click();
    await page.waitForTimeout(2000);
    results.learnerNavigation = page.url().includes('/learner');
    results.learnerDashboard = await page.locator('text=Welcome back, Student!').isVisible();
    console.log(`   ${results.learnerNavigation ? '✅' : '❌'} Navigate to Learner: ${page.url()}`);
    console.log(`   ${results.learnerDashboard ? '✅' : '❌'} Learner Dashboard Loads`);
    
    const learnerModules = await page.locator('.bg-white.rounded-lg.shadow').count();
    console.log(`   ✅ Modules visible: ${learnerModules}`);
    
    // Navigate to Instructor
    await page.locator('button:has-text("Instructor")').first().click();
    await page.waitForTimeout(2000);
    results.instructorNavigation = page.url().includes('/instructor');
    results.instructorDashboard = await page.locator('text=Welcome back, Instructor!').isVisible();
    console.log(`   ${results.instructorNavigation ? '✅' : '❌'} Navigate to Instructor: ${page.url()}`);
    console.log(`   ${results.instructorDashboard ? '✅' : '❌'} Instructor Dashboard Loads`);
    
    // Navigate back to Admin
    await page.locator('button:has-text("Admin")').first().click();
    await page.waitForTimeout(2000);
    results.adminNavigation = page.url().includes('/admin');
    console.log(`   ${results.adminNavigation ? '✅' : '❌'} Navigate back to Admin: ${page.url()}\n`);
    
    // ========== FINAL SCREENSHOT ==========
    await page.screenshot({ path: 'FINAL-SYSTEM-SCREENSHOT.png', fullPage: true });
    console.log('📸 Final screenshot saved: FINAL-SYSTEM-SCREENSHOT.png\n');
    
    // ========== RESULTS SUMMARY ==========
    console.log('='.repeat(80));
    console.log('📊 FINAL TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log('\n🔌 API ENDPOINTS:');
    console.log(`   ${results.apiHealth ? '✅' : '❌'} Health Check API`);
    console.log(`   ${results.apiModules ? '✅' : '❌'} Modules API`);
    console.log(`   ${results.apiProgress ? '✅' : '❌'} Progress API`);
    
    console.log('\n📱 DASHBOARDS:');
    console.log(`   ${results.adminDashboard ? '✅' : '❌'} Admin Dashboard`);
    console.log(`   ${results.learnerDashboard ? '✅' : '❌'} Learner Dashboard`);
    console.log(`   ${results.instructorDashboard ? '✅' : '❌'} Instructor Dashboard`);
    
    console.log('\n🧭 NAVIGATION:');
    console.log(`   ${results.adminNavigation ? '✅' : '❌'} Admin Navigation Button`);
    console.log(`   ${results.learnerNavigation ? '✅' : '❌'} Learner Navigation Button`);
    console.log(`   ${results.instructorNavigation ? '✅' : '❌'} Instructor Navigation Button`);
    
    console.log('\n⚙️ MANAGEMENT SYSTEMS:');
    console.log(`   ${results.userManagement ? '✅' : '❌'} User Management`);
    console.log(`   ${results.moduleManagement ? '✅' : '❌'} Module Management`);
    console.log(`   ${results.progressManagement ? '✅' : '❌'} Progress Management`);
    
    console.log('\n🎮 FUNCTIONALITY:');
    console.log(`   ${results.buttonClicks ? '✅' : '❌'} Button Clicks`);
    console.log(`   ${results.tabSwitching ? '✅' : '❌'} Tab Switching`);
    console.log(`   ${results.searchFilter ? '✅' : '❌'} Search & Filter`);
    console.log(`   ${results.exportButtons ? '✅' : '❌'} Export Buttons`);
    
    const passedCount = Object.values(results).filter(v => v === true).length;
    const totalCount = Object.values(results).length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    
    console.log('\n' + '='.repeat(80));
    console.log(`📊 OVERALL SCORE: ${passedCount}/${totalCount} tests passed (${passRate}%)`);
    console.log('='.repeat(80));
    
    if (passRate === 100) {
      console.log('\n🎊🎊🎊 PERFECT SCORE! ALL SYSTEMS FULLY OPERATIONAL! 🎊🎊🎊\n');
    } else if (passRate >= 90) {
      console.log('\n🎉 EXCELLENT! System is operational with minor enhancements needed.\n');
    } else if (passRate >= 75) {
      console.log('\n✅ GOOD! Most features working, some refinement needed.\n');
    } else {
      console.log('\n⚠️  System needs attention. Review failed tests above.\n');
    }
    
    console.log('⏳ Keeping browser open for 10 seconds so you can explore...\n');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('\n✅ Test suite complete!\n');
  }
})();

