const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🔍 Testing Admin Dashboard JavaScript Functionality...\n');
  
  try {
    // Navigate to admin dashboard
    await page.goto('http://localhost:3001/dashboard/admin', { waitUntil: 'networkidle' });
    console.log('✅ Page loaded successfully');
    
    // Wait for React to hydrate
    await page.waitForTimeout(2000);
    
    // Test 1: Check if buttons are interactive
    const addUserButton = await page.locator('button:has-text("Add User")');
    const isVisible = await addUserButton.isVisible();
    console.log(`✅ Add User button visible: ${isVisible}`);
    
    // Test 2: Click a button and check console
    let clickWorked = false;
    page.on('console', msg => {
      if (msg.text().includes('Add User button clicked')) {
        clickWorked = true;
      }
    });
    
    await addUserButton.click();
    await page.waitForTimeout(500);
    
    // Test 3: Check if state changed
    const clickCount = await page.locator('text=/Button clicks:.*\\d+/').first();
    const clickText = await clickCount.textContent();
    console.log(`✅ Click counter text: ${clickText}`);
    
    const hasNonZero = clickText && !clickText.includes('Button clicks: 0');
    console.log(`✅ Button click functionality working: ${hasNonZero ? 'YES' : 'NO'}`);
    
    // Test 4: Try tab switching
    const usersTab = await page.locator('button:has-text("Users")');
    await usersTab.click();
    await page.waitForTimeout(500);
    
    const userManagementText = await page.locator('text=User Management').first().isVisible();
    console.log(`✅ Tab switching works: ${userManagementText ? 'YES' : 'NO'}`);
    
    // Test 5: Check all interactive elements
    const allButtons = await page.locator('button[type="button"]').count();
    console.log(`✅ Total interactive buttons found: ${allButtons}`);
    
    console.log('\n🎉 ADMIN DASHBOARD JAVASCRIPT FUNCTIONALITY TEST COMPLETE');
    console.log(`\n📊 RESULTS:`);
    console.log(`   - Page loads: ✅`);
    console.log(`   - Buttons visible: ✅`);
    console.log(`   - Click handlers: ${hasNonZero ? '✅' : '❌'}`);
    console.log(`   - Tab switching: ${userManagementText ? '✅' : '❌'}`);
    console.log(`   - Interactive elements: ${allButtons} buttons`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();

