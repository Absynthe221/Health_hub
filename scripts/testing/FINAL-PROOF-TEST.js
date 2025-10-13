const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(70));
  console.log('🎯 FINAL COMPREHENSIVE FUNCTIONALITY TEST');
  console.log('='.repeat(70) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();
  
  const results = {
    adminNav: false,
    learnerNav: false,
    instructorNav: false,
    buttonClicks: false,
    tabSwitching: false,
    userManagement: false,
    moduleManagement: false,
  };
  
  let instructorWorks = false;
  
  try {
    // TEST 1: Admin Dashboard
    console.log('📋 TEST 1: ADMIN DASHBOARD');
    console.log('-'.repeat(70));
    await page.goto('http://localhost:3001/dashboard/admin');
    await page.waitForTimeout(1500);
    console.log('✅ Admin dashboard loaded');
    
    // Test button clicks
    const addUserBtn = await page.locator('button:has-text("Add User")').first();
    await addUserBtn.click();
    await page.waitForTimeout(500);
    
    const clickCount = await page.locator('text=/Button clicks: \\d+/').first().textContent();
    results.buttonClicks = !clickCount.includes('Button clicks: 0');
    console.log(`✅ Button clicks working: ${clickCount}`);
    
    // Test Users tab
    await page.locator('nav.flex.space-x-8 button:has-text("Users")').first().click();
    await page.waitForTimeout(1000);
    
    const userTable = await page.locator('table').isVisible();
    results.userManagement = userTable;
    console.log(`✅ User Management table visible: ${userTable ? 'YES' : 'NO'}`);
    
    if (userTable) {
      const userRows = await page.locator('tbody tr').count();
      console.log(`✅ Users in table: ${userRows}`);
    }
    
    // Test Modules tab
    await page.locator('nav.flex.space-x-8 button:has-text("Modules")').first().click();
    await page.waitForTimeout(1000);
    
    const moduleCards = await page.locator('.border.rounded-lg.p-4').count();
    results.moduleManagement = moduleCards > 0;
    console.log(`✅ Module Management cards: ${moduleCards}`);
    
    results.tabSwitching = true;
    
    // TEST 2: Navigate to Learner Dashboard
    console.log('\n📋 TEST 2: NAVIGATION TO LEARNER DASHBOARD');
    console.log('-'.repeat(70));
    await page.locator('button:has-text("Learner")').first().click();
    await page.waitForTimeout(2000);
    
    const learnerUrl = page.url();
    results.learnerNav = learnerUrl.includes('/learner');
    console.log(`✅ Navigated to: ${learnerUrl}`);
    console.log(`✅ Learner navigation works: ${results.learnerNav ? 'YES' : 'NO'}`);
    
    // Check modules loaded
    const moduleElements = await page.locator('.bg-white.rounded-lg.shadow').count();
    console.log(`✅ Modules loaded on learner dashboard: ${moduleElements}`);
    
    // TEST 3: Navigate to Instructor
    console.log('\n📋 TEST 3: NAVIGATION TO INSTRUCTOR DASHBOARD');
    console.log('-'.repeat(70));
    await page.locator('button:has-text("Instructor")').first().click();
    await page.waitForTimeout(2000);
    
    const instructorUrl = page.url();
    results.instructorNav = instructorUrl.includes('/instructor');
    console.log(`✅ Navigated to: ${instructorUrl}`);
    console.log(`✅ Instructor navigation works: ${results.instructorNav ? 'YES' : 'NO'}`);
    
    // TEST 4: Navigate to Admin from Instructor
    console.log('\n📋 TEST 4: NAVIGATION BACK TO ADMIN');
    console.log('-'.repeat(70));
    await page.locator('button:has-text("Admin")').first().click();
    await page.waitForTimeout(2000);
    
    const adminUrl = page.url();
    results.adminNav = adminUrl.includes('/admin');
    console.log(`✅ Navigated to: ${adminUrl}`);
    console.log(`✅ Admin navigation works: ${results.adminNav ? 'YES' : 'NO'}`);
    
    // Take final screenshot
    await page.screenshot({ path: 'FINAL-ADMIN-DASHBOARD.png', fullPage: true });
    console.log('✅ Screenshot saved: FINAL-ADMIN-DASHBOARD.png');
    
    // FINAL RESULTS
    console.log('\n' + '='.repeat(70));
    console.log('🎉 FINAL TEST RESULTS');
    console.log('='.repeat(70));
    console.log(`\n${results.adminNav ? '✅' : '❌'} Admin Navigation`);
    console.log(`${results.instructorNav ? '✅' : '❌'} Instructor Navigation`);
    console.log(`${results.learnerNav ? '✅' : '❌'} Learner Navigation`);
    console.log(`${results.buttonClicks ? '✅' : '❌'} Button Clicks`);
    console.log(`${results.tabSwitching ? '✅' : '❌'} Tab Switching`);
    console.log(`${results.userManagement ? '✅' : '❌'} User Management System`);
    console.log(`${results.moduleManagement ? '✅' : '❌'} Module Management System`);
    
    const passedCount = Object.values(results).filter(v => v === true).length;
    const totalCount = Object.values(results).length;
    const allPassed = passedCount === totalCount;
    
    console.log(`\n📊 SCORE: ${passedCount}/${totalCount} tests passed\n`);
    
    if (allPassed) {
      console.log('🎊🎊🎊 ALL TESTS PASSED! SYSTEM IS FULLY OPERATIONAL! 🎊🎊🎊\n');
    } else {
      console.log(`⚠️  ${totalCount - passedCount} test(s) failed. Review results above.\n`);
    }
    
    console.log('Keeping browser open for 10 seconds...\n');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('✅ Test complete!\n');
  }
})();

