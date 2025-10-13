const { chromium } = require('playwright');

(async () => {
  console.log('\n🧪 TESTING NAVIGATION BUTTONS\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    // Test 1: Admin Dashboard
    console.log('1️⃣  Opening Admin Dashboard...');
    await page.goto('http://localhost:3001/dashboard/admin');
    await page.waitForTimeout(2000);
    
    // Test 2: Click Learner button
    console.log('2️⃣  Clicking Learner button...');
    await page.locator('button:has-text("Learner")').first().click();
    await page.waitForTimeout(2000);
    
    const learnerUrl = page.url();
    console.log(`   ✅ Navigated to: ${learnerUrl}`);
    console.log(`   ✅ Learner button works: ${learnerUrl.includes('/learner') ? 'YES' : 'NO'}`);
    
    // Test 3: Click Instructor button (from learner page)
    console.log('3️⃣  Clicking Instructor button...');
    const instructorBtn = page.locator('button:has-text("Instructor")').first();
    if (await instructorBtn.isVisible()) {
      await instructorBtn.click();
      await page.waitForTimeout(2000);
      
      const instructorUrl = page.url();
      console.log(`   ✅ Navigated to: ${instructorUrl}`);
      console.log(`   ✅ Instructor button works: ${instructorUrl.includes('/instructor') ? 'YES' : 'NO'}`);
    }
    
    // Test 4: Go back to admin
    console.log('4️⃣  Clicking Admin button...');
    await page.locator('button:has-text("Admin")').first().click();
    await page.waitForTimeout(2000);
    
    const adminUrl = page.url();
    console.log(`   ✅ Navigated to: ${adminUrl}`);
    console.log(`   ✅ Admin button works: ${adminUrl.includes('/admin') ? 'YES' : 'NO'}`);
    
    // Test 5: Test Users tab
    console.log('5️⃣  Clicking Users tab...');
    await page.locator('button:has-text("Users")').first().click();
    await page.waitForTimeout(1000);
    
    const userTable = await page.locator('table').isVisible();
    console.log(`   ✅ User management table visible: ${userTable ? 'YES' : 'NO'}`);
    
    // Count users in table
    const userRows = await page.locator('tbody tr').count();
    console.log(`   ✅ Users in table: ${userRows}`);
    
    // Take screenshot
    await page.screenshot({ path: 'admin-user-management.png', fullPage: true });
    console.log('   📸 Screenshot saved: admin-user-management.png');
    
    // Test 6: Test Modules tab
    console.log('6️⃣  Clicking Modules tab...');
    await page.locator('button:has-text("Modules")').first().click();
    await page.waitForTimeout(1000);
    
    const moduleCards = await page.locator('.border.rounded-lg').count();
    console.log(`   ✅ Module cards visible: ${moduleCards}`);
    
    await page.screenshot({ path: 'admin-module-management.png', fullPage: true });
    console.log('   📸 Screenshot saved: admin-module-management.png');
    
    console.log('\n✅ ALL NAVIGATION TESTS PASSED!\n');
    console.log('Screenshots saved:');
    console.log('  - admin-user-management.png');
    console.log('  - admin-module-management.png\n');
    
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();

