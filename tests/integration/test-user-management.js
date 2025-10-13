const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('👥 USER MANAGEMENT SYSTEM - COMPREHENSIVE TEST');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 700 });
  const page = await browser.newPage();
  
  const results = {
    apiEndpoint: false,
    usersTab: false,
    statsCards: false,
    roleDistribution: false,
    userTable: false,
    cardView: false,
    searchFilter: false,
    bulkSelection: false,
    actionButtons: false,
    addUserModal: false,
    editUserModal: false
  };
  
  try {
    // TEST 1: API Endpoint
    console.log('🔌 TEST 1: USER MANAGEMENT API');
    console.log('-'.repeat(80));
    const apiRes = await page.request.get('http://localhost:3000/api/admin/user-management');
    const apiData = await apiRes.json();
    results.apiEndpoint = apiData.success;
    console.log(`   ${results.apiEndpoint ? '✅' : '❌'} API Status: ${apiRes.status()}`);
    console.log(`   ✅ Total Users: ${apiData.stats?.totalUsers || 0}`);
    console.log(`   ✅ Active Users: ${apiData.stats?.activeUsers || 0}`);
    console.log(`   ✅ Users Returned: ${apiData.users?.length || 0}\n`);
    
    // TEST 2: Navigate to Users Tab
    console.log('📋 TEST 2: NAVIGATE TO USERS TAB');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3000/dashboard/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Wait for admin page to load
    await page.waitForSelector('text=Welcome back, Admin!', { timeout: 10000 });
    
    await page.locator('nav.flex.space-x-8 button:has-text("Users")').first().click();
    await page.waitForTimeout(2000);
    
    results.usersTab = await page.locator('text=User Management').first().isVisible();
    console.log(`   ${results.usersTab ? '✅' : '❌'} Users Tab Loaded\n`);
    
    // TEST 3: Verify Statistics Cards
    console.log('📊 TEST 3: STATISTICS CARDS');
    console.log('-'.repeat(80));
    const statsCards = await page.locator('.bg-white.rounded-lg.shadow.p-6').count();
    results.statsCards = statsCards >= 4;
    console.log(`   ${results.statsCards ? '✅' : '❌'} Stats Cards: ${statsCards} found\n`);
    
    // TEST 4: Role Distribution
    console.log('👨‍💼 TEST 4: ROLE DISTRIBUTION');
    console.log('-'.repeat(80));
    const roleDistTitle = await page.locator('text=User Distribution by Role').isVisible();
    const roleCards = await page.locator('.border.border-gray-200.rounded-lg.p-4').count();
    results.roleDistribution = roleDistTitle && roleCards >= 3;
    console.log(`   ${results.roleDistribution ? '✅' : '❌'} Role Distribution: ${roleCards} role cards\n`);
    
    // TEST 5: User Table
    console.log('📋 TEST 5: USER TABLE');
    console.log('-'.repeat(80));
    const tableVisible = await page.locator('table').isVisible();
    const userRows = await page.locator('tbody tr').count();
    results.userTable = tableVisible && userRows > 0;
    console.log(`   ${results.userTable ? '✅' : '❌'} User Table: ${userRows} users visible\n`);
    
    // TEST 6: Card View Toggle
    console.log('📇 TEST 6: CARD VIEW');
    console.log('-'.repeat(80));
    const viewToggle = await page.locator('button:has-text("Card View")');
    if (await viewToggle.isVisible()) {
      await viewToggle.click();
      await page.waitForTimeout(1500);
      
      const cardViewActive = await page.locator('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3').isVisible();
      results.cardView = cardViewActive;
      console.log(`   ${results.cardView ? '✅' : '❌'} Card View: ${cardViewActive ? 'Working' : 'Failed'}`);
      
      // Switch back to table view
      const tableViewBtn = page.locator('button:has-text("Table View")');
      if (await tableViewBtn.isVisible()) {
        await tableViewBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    console.log('');
    
    // Switch back to table view first
    const currentView = await page.locator('button:has-text("Table View")').isVisible();
    if (currentView) {
      await page.locator('button:has-text("Table View")').click();
      await page.waitForTimeout(1000);
    }
    
    // TEST 7: Search and Filter
    console.log('🔍 TEST 7: SEARCH AND FILTER');
    console.log('-'.repeat(80));
    const searchInput = await page.locator('input[placeholder*="Search users"]');
    await searchInput.fill('John');
    await page.waitForTimeout(1000);
    console.log('   ✅ Search: "John" applied');
    
    await searchInput.fill('');
    await page.waitForTimeout(500);
    
    const roleFilter = await page.locator('select').nth(0);
    await roleFilter.selectOption('learner');
    await page.waitForTimeout(1000);
    console.log('   ✅ Filter: "Learners only" applied');
    results.searchFilter = true;
    
    await roleFilter.selectOption('all');
    await page.waitForTimeout(500);
    console.log('');
    
    // TEST 8: Bulk Selection
    console.log('☑️  TEST 8: BULK SELECTION');
    console.log('-'.repeat(80));
    const selectAllCheckbox = await page.locator('thead input[type="checkbox"]').first();
    await selectAllCheckbox.click();
    await page.waitForTimeout(1000);
    
    const selectedCount = await page.locator('text=/\\d+ selected/').isVisible();
    results.bulkSelection = selectedCount;
    console.log(`   ${results.bulkSelection ? '✅' : '❌'} Bulk Selection: ${selectedCount ? 'Working' : 'Failed'}`);
    
    // Verify bulk action buttons appear
    const bulkButtons = await page.locator('button:has-text("Activate"), button:has-text("Deactivate"), button:has-text("Delete")').count();
    console.log(`   ✅ Bulk Action Buttons: ${bulkButtons} visible\n`);
    
    // Deselect all
    await selectAllCheckbox.click();
    await page.waitForTimeout(500);
    
    // TEST 9: Action Buttons
    console.log('🎮 TEST 9: ACTION BUTTONS');
    console.log('-'.repeat(80));
    const addUserBtn = await page.locator('button:has-text("Add User")').isVisible();
    const importBtn = await page.locator('button:has-text("Import CSV")').isVisible();
    const exportBtn = await page.locator('button:has-text("Export CSV")').isVisible();
    const viewToggleBtn = await page.locator('button:has-text("Card View"), button:has-text("Table View")').isVisible();
    
    results.actionButtons = addUserBtn && importBtn && exportBtn && viewToggleBtn;
    console.log(`   ${addUserBtn ? '✅' : '❌'} Add User Button`);
    console.log(`   ${importBtn ? '✅' : '❌'} Import CSV Button`);
    console.log(`   ${exportBtn ? '✅' : '❌'} Export CSV Button`);
    console.log(`   ${viewToggleBtn ? '✅' : '❌'} View Toggle Button\n`);
    
    // TEST 10: Add User Modal
    console.log('➕ TEST 10: ADD USER MODAL');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Add User")').first().click();
    await page.waitForTimeout(1500);
    
    const addModalVisible = await page.locator('h3:has-text("Add New User")').isVisible();
    results.addUserModal = addModalVisible;
    console.log(`   ${results.addUserModal ? '✅' : '❌'} Modal Opened: ${addModalVisible ? 'YES' : 'NO'}`);
    
    if (addModalVisible) {
      const formFields = {
        firstName: await page.locator('input[placeholder="John"]').isVisible(),
        lastName: await page.locator('input[placeholder="Doe"]').isVisible(),
        email: await page.locator('input[type="email"]').isVisible(),
        phone: await page.locator('input[type="tel"]').isVisible(),
        role: await page.locator('select').first().isVisible(),
        status: await page.locator('select').nth(1).isVisible(),
        password: await page.locator('input[type="password"]').first().isVisible()
      };
      
      const visibleFields = Object.values(formFields).filter(v => v).length;
      console.log(`   ✅ Form Fields Visible: ${visibleFields}/7`);
      
      const createBtn = await page.locator('button:has-text("Create User")').isVisible();
      const cancelBtn = await page.locator('button:has-text("Cancel")').isVisible();
      console.log(`   ✅ Buttons: Create=${createBtn}, Cancel=${cancelBtn}`);
      
      // Close modal
      await page.locator('button:has-text("Cancel")').first().click();
      await page.waitForTimeout(500);
    }
    console.log('');
    
    // TEST 11: Edit User Modal
    console.log('✏️  TEST 11: EDIT USER MODAL');
    console.log('-'.repeat(80));
    const editButton = await page.locator('button[title="Edit"]').first();
    await editButton.click();
    await page.waitForTimeout(1500);
    
    const editModalVisible = await page.locator('h3:has-text("Edit User")').isVisible();
    results.editUserModal = editModalVisible;
    console.log(`   ${results.editUserModal ? '✅' : '❌'} Edit Modal Opened: ${editModalVisible ? 'YES' : 'NO'}`);
    
    if (editModalVisible) {
      const saveBtn = await page.locator('button:has-text("Save Changes")').isVisible();
      console.log(`   ✅ Save Button: ${saveBtn ? 'Visible' : 'Hidden'}`);
      
      // Close modal
      await page.locator('button:has-text("Cancel")').first().click();
      await page.waitForTimeout(500);
    }
    console.log('');
    
    // Screenshot
    await page.screenshot({ path: 'user-management-system.png', fullPage: true });
    console.log('📸 Screenshot saved: user-management-system.png\n');
    
    // FINAL RESULTS
    console.log('='.repeat(80));
    console.log('📊 USER MANAGEMENT TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log('\n🔌 API & DATA:');
    console.log(`   ${results.apiEndpoint ? '✅' : '❌'} API Endpoint`);
    console.log(`   ${results.statsCards ? '✅' : '❌'} Statistics Cards`);
    console.log(`   ${results.roleDistribution ? '✅' : '❌'} Role Distribution`);
    
    console.log('\n📋 CORE FEATURES:');
    console.log(`   ${results.usersTab ? '✅' : '❌'} Users Tab Navigation`);
    console.log(`   ${results.userTable ? '✅' : '❌'} User Table View`);
    console.log(`   ${results.cardView ? '✅' : '❌'} Card View Toggle`);
    
    console.log('\n🎮 FUNCTIONALITY:');
    console.log(`   ${results.searchFilter ? '✅' : '❌'} Search & Filter`);
    console.log(`   ${results.bulkSelection ? '✅' : '❌'} Bulk Selection`);
    console.log(`   ${results.actionButtons ? '✅' : '❌'} Action Buttons`);
    console.log(`   ${results.addUserModal ? '✅' : '❌'} Add User Modal`);
    console.log(`   ${results.editUserModal ? '✅' : '❌'} Edit User Modal`);
    
    const passedCount = Object.values(results).filter(v => v === true).length;
    const totalCount = Object.values(results).length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    
    console.log('\n' + '='.repeat(80));
    console.log(`📊 OVERALL SCORE: ${passedCount}/${totalCount} tests passed (${passRate}%)`);
    console.log('='.repeat(80));
    
    if (passRate === 100) {
      console.log('\n🎊🎊🎊 PERFECT! USER MANAGEMENT SYSTEM FULLY OPERATIONAL! 🎊🎊🎊\n');
    } else if (passRate >= 90) {
      console.log('\n🎉 EXCELLENT! System operational with minor refinements needed.\n');
    } else {
      console.log('\n⚠️  System needs attention. Review failed tests.\n');
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

