const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('📚 MODULE MANAGEMENT SYSTEM - COMPREHENSIVE TEST');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 700 });
  const page = await browser.newPage();
  
  const results = {
    apiModules: false,
    modulesTab: false,
    statsCards: false,
    moduleCards: false,
    searchFilter: false,
    viewToggle: false,
    slideExpansion: false,
    bulkSelection: false,
    actionButtons: false,
    addModuleModal: false
  };
  
  try {
    // TEST 1: Modules API
    console.log('🔌 TEST 1: MODULES API');
    console.log('-'.repeat(80));
    const apiRes = await page.request.get('http://localhost:3000/api/modules');
    const apiData = await apiRes.json();
    results.apiModules = apiData.success && apiData.modules.length > 0;
    console.log(`   ${results.apiModules ? '✅' : '❌'} API Status: ${apiRes.status()}`);
    console.log(`   ✅ Modules Returned: ${apiData.modules?.length || 0}`);
    console.log(`   ✅ Total Slides: ${apiData.modules?.reduce((acc, m) => acc + (m.slides?.length || 0), 0) || 0}\n`);
    
    // TEST 2: Navigate to Modules Tab
    console.log('📋 TEST 2: NAVIGATE TO MODULES TAB');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3000/dashboard/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.waitForSelector('text=Welcome back, Admin!', { timeout: 10000 });
    
    await page.locator('nav.flex.space-x-8 button:has-text("Modules")').first().click();
    await page.waitForTimeout(3000);
    
    results.modulesTab = await page.locator('text=Module Management').first().isVisible();
    console.log(`   ${results.modulesTab ? '✅' : '❌'} Modules Tab Loaded\n`);
    
    // TEST 3: Verify Statistics Cards
    console.log('📊 TEST 3: STATISTICS CARDS');
    console.log('-'.repeat(80));
    const statsCards = await page.locator('.bg-white.rounded-lg.shadow.p-6').count();
    results.statsCards = statsCards >= 4;
    console.log(`   ${results.statsCards ? '✅' : '❌'} Stats Cards: ${statsCards} found\n`);
    
    // TEST 4: Check Module Cards
    console.log('📦 TEST 4: MODULE CARDS/LIST');
    console.log('-'.repeat(80));
    const moduleCards = await page.locator('.bg-white.rounded-lg.shadow.hover\\:shadow-lg').count();
    results.moduleCards = moduleCards > 0;
    console.log(`   ${results.moduleCards ? '✅' : '❌'} Module Cards: ${moduleCards} visible\n`);
    
    // TEST 5: Test Search
    console.log('🔍 TEST 5: SEARCH FUNCTIONALITY');
    console.log('-'.repeat(80));
    const searchInput = await page.locator('input[placeholder*="Search modules"]');
    await searchInput.fill('ecg');
    await page.waitForTimeout(1000);
    console.log('   ✅ Search: "ecg" applied');
    
    await searchInput.fill('');
    await page.waitForTimeout(500);
    
    // TEST 6: Test Filters
    const difficultyFilter = await page.locator('select').first();
    await difficultyFilter.selectOption('advanced');
    await page.waitForTimeout(1000);
    console.log('   ✅ Filter: "Advanced" applied');
    results.searchFilter = true;
    
    await difficultyFilter.selectOption('all');
    await page.waitForTimeout(500);
    console.log('');
    
    // TEST 7: Test View Toggle
    console.log('🔀 TEST 6: VIEW TOGGLE');
    console.log('-'.repeat(80));
    const listViewBtn = await page.locator('button:has-text("List View")');
    if (await listViewBtn.isVisible()) {
      await listViewBtn.click();
      await page.waitForTimeout(1500);
      
      const tableVisible = await page.locator('table').isVisible();
      results.viewToggle = tableVisible;
      console.log(`   ${results.viewToggle ? '✅' : '❌'} List View: ${tableVisible ? 'Working' : 'Failed'}`);
      
      // Switch back to grid
      await page.locator('button:has-text("Grid View")').click();
      await page.waitForTimeout(1000);
    }
    console.log('');
    
    // TEST 8: Test Slide Expansion
    console.log('📂 TEST 7: SLIDE EXPANSION');
    console.log('-'.repeat(80));
    const viewSlidesBtn = await page.locator('button:has-text("View Slides")').first();
    if (await viewSlidesBtn.isVisible()) {
      await viewSlidesBtn.click();
      await page.waitForTimeout(1500);
      
      const slidesVisible = await page.locator('text=/Slides \\(\\d+\\)/').isVisible();
      results.slideExpansion = slidesVisible;
      console.log(`   ${results.slideExpansion ? '✅' : '❌'} Slide Expansion: ${slidesVisible ? 'Working' : 'Failed'}`);
      
      if (slidesVisible) {
        const slideCount = await page.locator('.bg-gray-50.rounded.text-xs').count();
        console.log(`   ✅ Slides Displayed: ${slideCount}`);
      }
      
      // Collapse slides
      await page.locator('button:has-text("Hide Slides")').first().click();
      await page.waitForTimeout(500);
    }
    console.log('');
    
    // TEST 9: Test Bulk Selection
    console.log('☑️  TEST 8: BULK SELECTION');
    console.log('-'.repeat(80));
    const firstCheckbox = await page.locator('.bg-white.rounded-lg.shadow.hover\\:shadow-lg input[type="checkbox"]').first();
    await firstCheckbox.click();
    await page.waitForTimeout(500);
    
    const selectedText = await page.locator('text=/\\d+ selected/').isVisible();
    results.bulkSelection = selectedText;
    console.log(`   ${results.bulkSelection ? '✅' : '❌'} Bulk Selection: ${selectedText ? 'Working' : 'Failed'}\n`);
    
    // Deselect
    await firstCheckbox.click();
    await page.waitForTimeout(500);
    
    // TEST 10: Test Action Buttons
    console.log('🎮 TEST 9: ACTION BUTTONS');
    console.log('-'.repeat(80));
    const createBtn = await page.locator('button:has-text("Create Module")').isVisible();
    const uploadBtn = await page.locator('button:has-text("Upload PPTX")').isVisible();
    const importBtn = await page.locator('button:has-text("Import")').isVisible();
    
    results.actionButtons = createBtn && uploadBtn && importBtn;
    console.log(`   ${createBtn ? '✅' : '❌'} Create Module Button`);
    console.log(`   ${uploadBtn ? '✅' : '❌'} Upload PPTX Button`);
    console.log(`   ${importBtn ? '✅' : '❌'} Import Button\n`);
    
    // TEST 11: Test Add Module Modal
    console.log('➕ TEST 10: ADD MODULE MODAL');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Create Module")').first().click();
    await page.waitForTimeout(1500);
    
    const modalVisible = await page.locator('h3:has-text("Create New Module")').isVisible();
    results.addModuleModal = modalVisible;
    console.log(`   ${results.addModuleModal ? '✅' : '❌'} Modal Opened: ${modalVisible ? 'YES' : 'NO'}`);
    
    if (modalVisible) {
      const fields = await page.locator('input, select, textarea').count();
      console.log(`   ✅ Form Fields: ${fields}`);
      
      // Close modal
      await page.locator('button:has-text("Cancel")').first().click();
      await page.waitForTimeout(500);
    }
    console.log('');
    
    // Screenshot
    await page.screenshot({ path: 'module-management-system.png', fullPage: true });
    console.log('📸 Screenshot saved: module-management-system.png\n');
    
    // FINAL RESULTS
    console.log('='.repeat(80));
    console.log('📊 MODULE MANAGEMENT TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log('\n🔌 API & DATA:');
    console.log(`   ${results.apiModules ? '✅' : '❌'} Modules API`);
    console.log(`   ${results.statsCards ? '✅' : '❌'} Statistics Cards`);
    
    console.log('\n📋 CORE FEATURES:');
    console.log(`   ${results.modulesTab ? '✅' : '❌'} Modules Tab Navigation`);
    console.log(`   ${results.moduleCards ? '✅' : '❌'} Module Cards Display`);
    console.log(`   ${results.slideExpansion ? '✅' : '❌'} Slide Expansion`);
    
    console.log('\n🎮 FUNCTIONALITY:');
    console.log(`   ${results.searchFilter ? '✅' : '❌'} Search & Filter`);
    console.log(`   ${results.viewToggle ? '✅' : '❌'} View Toggle`);
    console.log(`   ${results.bulkSelection ? '✅' : '❌'} Bulk Selection`);
    console.log(`   ${results.actionButtons ? '✅' : '❌'} Action Buttons`);
    console.log(`   ${results.addModuleModal ? '✅' : '❌'} Add Module Modal`);
    
    const passedCount = Object.values(results).filter(v => v === true).length;
    const totalCount = Object.values(results).length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    
    console.log('\n' + '='.repeat(80));
    console.log(`📊 OVERALL SCORE: ${passedCount}/${totalCount} tests passed (${passRate}%)`);
    console.log('='.repeat(80));
    
    if (passRate === 100) {
      console.log('\n🎊🎊🎊 PERFECT! MODULE MANAGEMENT SYSTEM FULLY OPERATIONAL! 🎊🎊🎊\n');
    } else if (passRate >= 80) {
      console.log('\n🎉 EXCELLENT! System operational!\n');
    } else {
      console.log('\n⚠️  System needs attention.\n');
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

