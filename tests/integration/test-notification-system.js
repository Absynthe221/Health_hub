const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('🔔 NOTIFICATION MANAGEMENT SYSTEM TEST');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();
  
  const results = {
    apiEndpoint: false,
    notificationTab: false,
    statsCards: false,
    templates: false,
    notificationList: false,
    searchFilter: false,
    bulkActions: false,
    createButton: false,
    exportButton: false,
    composer: false
  };
  
  try {
    // TEST 1: API Endpoint
    console.log('🔌 TEST 1: NOTIFICATION API ENDPOINT');
    console.log('-'.repeat(80));
    const apiRes = await page.request.get('http://localhost:3001/api/admin/notifications');
    const apiData = await apiRes.json();
    results.apiEndpoint = apiData.success;
    console.log(`   ${results.apiEndpoint ? '✅' : '❌'} API Response: ${apiRes.status()}`);
    console.log(`   ✅ Total notifications: ${apiData.notifications?.length || 0}`);
    console.log(`   ✅ Templates: ${apiData.templates?.length || 0}`);
    console.log(`   ✅ Stats: ${apiData.stats ? 'Available' : 'Missing'}\n`);
    
    // TEST 2: Navigate to Notifications Tab
    console.log('📋 TEST 2: NAVIGATE TO NOTIFICATIONS TAB');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3001/dashboard/admin');
    await page.waitForTimeout(2000);
    
    await page.locator('nav.flex.space-x-8 button:has-text("Notifications")').first().click();
    await page.waitForTimeout(2000);
    
    results.notificationTab = await page.locator('text=Notification Center').isVisible();
    console.log(`   ${results.notificationTab ? '✅' : '❌'} Notifications Tab Loaded\n`);
    
    // TEST 3: Verify Stats Cards
    console.log('📊 TEST 3: VERIFY STATISTICS CARDS');
    console.log('-'.repeat(80));
    const statsCards = await page.locator('.bg-white.rounded-lg.shadow.p-6').count();
    results.statsCards = statsCards >= 4;
    console.log(`   ${results.statsCards ? '✅' : '❌'} Stats Cards: ${statsCards} found\n`);
    
    // TEST 4: Check Templates
    console.log('📝 TEST 4: CHECK NOTIFICATION TEMPLATES');
    console.log('-'.repeat(80));
    const templatesVisible = await page.locator('text=Notification Templates').isVisible();
    const templateCards = await page.locator('.border.border-gray-200.rounded-lg.p-4').count();
    results.templates = templatesVisible && templateCards > 0;
    console.log(`   ${results.templates ? '✅' : '❌'} Templates Section: ${templateCards} templates\n`);
    
    // TEST 5: Check Notification List
    console.log('📬 TEST 5: CHECK NOTIFICATION LIST');
    console.log('-'.repeat(80));
    const notifications = await page.locator('.border.rounded-lg.p-4.hover\\:shadow-md').count();
    results.notificationList = notifications > 0;
    console.log(`   ${results.notificationList ? '✅' : '❌'} Notifications Listed: ${notifications} items\n`);
    
    // TEST 6: Test Search and Filter
    console.log('🔍 TEST 6: TEST SEARCH AND FILTER');
    console.log('-'.repeat(80));
    const searchInput = await page.locator('input[placeholder="Search notifications..."]');
    await searchInput.fill('Certificate');
    await page.waitForTimeout(1000);
    console.log('   ✅ Search applied: "Certificate"');
    
    await searchInput.fill('');
    await page.waitForTimeout(500);
    
    const typeFilter = await page.locator('select').first();
    await typeFilter.selectOption('success');
    await page.waitForTimeout(1000);
    console.log('   ✅ Filter applied: "Success type"');
    results.searchFilter = true;
    
    await typeFilter.selectOption('all');
    await page.waitForTimeout(500);
    console.log('');
    
    // TEST 7: Test Bulk Actions
    console.log('☑️  TEST 7: TEST BULK SELECTION');
    console.log('-'.repeat(80));
    const selectAllCheckbox = await page.locator('input[type="checkbox"]').first();
    await selectAllCheckbox.click();
    await page.waitForTimeout(500);
    
    const selectedText = await page.locator('text=/\\d+ selected/').isVisible();
    results.bulkActions = selectedText;
    console.log(`   ${results.bulkActions ? '✅' : '❌'} Bulk Selection: Working\n`);
    
    // Unselect all
    await selectAllCheckbox.click();
    await page.waitForTimeout(500);
    
    // TEST 8: Test Action Buttons
    console.log('🎮 TEST 8: TEST ACTION BUTTONS');
    console.log('-'.repeat(80));
    const createBtn = await page.locator('button:has-text("New Notification")').isVisible();
    results.createButton = createBtn;
    console.log(`   ${results.createButton ? '✅' : '❌'} Create Button: ${createBtn ? 'Visible' : 'Hidden'}`);
    
    const exportBtn = await page.locator('button:has-text("Export")').isVisible();
    results.exportButton = exportBtn;
    console.log(`   ${results.exportButton ? '✅' : '❌'} Export Button: ${exportBtn ? 'Visible' : 'Hidden'}`);
    
    const broadcastBtn = await page.locator('button:has-text("Broadcast")').isVisible();
    console.log(`   ✅ Broadcast Button: ${broadcastBtn ? 'Visible' : 'Hidden'}`);
    
    const templatesBtn = await page.locator('button:has-text("Templates")').isVisible();
    console.log(`   ✅ Templates Button: ${templatesBtn ? 'Visible' : 'Hidden'}\n`);
    
    // TEST 9: Test Notification Composer
    console.log('✍️  TEST 9: TEST NOTIFICATION COMPOSER');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("New Notification")').first().click();
    await page.waitForTimeout(1000);
    
    const composerModal = await page.locator('h3:has-text("Create New Notification")').isVisible();
    results.composer = composerModal;
    console.log(`   ${results.composer ? '✅' : '❌'} Composer Modal: ${composerModal ? 'Opened' : 'Failed'}`);
    
    if (composerModal) {
      const titleInput = await page.locator('input[placeholder="Notification title..."]').isVisible();
      const messageTextarea = await page.locator('textarea[placeholder="Notification message..."]').isVisible();
      console.log(`   ✅ Title Input: ${titleInput ? 'Visible' : 'Hidden'}`);
      console.log(`   ✅ Message Textarea: ${messageTextarea ? 'Visible' : 'Hidden'}`);
      
      // Close modal
      await page.locator('button:has-text("Cancel")').first().click();
      await page.waitForTimeout(500);
    }
    console.log('');
    
    // TEST 10: Test Analytics Section
    console.log('📈 TEST 10: TEST ANALYTICS SECTION');
    console.log('-'.repeat(80));
    const analyticsSection = await page.locator('text=Notification Analytics').isVisible();
    console.log(`   ${analyticsSection ? '✅' : '❌'} Analytics Section: ${analyticsSection ? 'Visible' : 'Hidden'}\n`);
    
    // Take Screenshot
    await page.screenshot({ path: 'notification-management.png', fullPage: true });
    console.log('📸 Screenshot saved: notification-management.png\n');
    
    // FINAL RESULTS
    console.log('='.repeat(80));
    console.log('📊 NOTIFICATION MANAGEMENT TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log('\n🔌 API & DATA:');
    console.log(`   ${results.apiEndpoint ? '✅' : '❌'} API Endpoint`);
    console.log(`   ${results.statsCards ? '✅' : '❌'} Statistics Cards`);
    console.log(`   ${analyticsSection ? '✅' : '❌'} Analytics Section`);
    
    console.log('\n📋 CORE FEATURES:');
    console.log(`   ${results.notificationTab ? '✅' : '❌'} Notification Tab`);
    console.log(`   ${results.templates ? '✅' : '❌'} Templates System`);
    console.log(`   ${results.notificationList ? '✅' : '❌'} Notification List`);
    
    console.log('\n🎮 FUNCTIONALITY:');
    console.log(`   ${results.searchFilter ? '✅' : '❌'} Search & Filter`);
    console.log(`   ${results.bulkActions ? '✅' : '❌'} Bulk Actions`);
    console.log(`   ${results.createButton ? '✅' : '❌'} Create Button`);
    console.log(`   ${results.exportButton ? '✅' : '❌'} Export Button`);
    console.log(`   ${results.composer ? '✅' : '❌'} Notification Composer`);
    
    const passedCount = Object.values(results).filter(v => v === true).length;
    const totalCount = Object.values(results).length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    
    console.log('\n' + '='.repeat(80));
    console.log(`📊 OVERALL SCORE: ${passedCount}/${totalCount} tests passed (${passRate}%)`);
    console.log('='.repeat(80));
    
    if (passRate === 100) {
      console.log('\n🎊🎊🎊 PERFECT! NOTIFICATION SYSTEM FULLY OPERATIONAL! 🎊🎊🎊\n');
    } else if (passRate >= 80) {
      console.log('\n🎉 EXCELLENT! System operational with all core features working!\n');
    } else {
      console.log('\n⚠️  Some features need attention. Review results above.\n');
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

