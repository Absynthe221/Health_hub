const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('⚙️  SETTINGS MANAGEMENT SYSTEM - COMPREHENSIVE TEST');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const page = await browser.newPage();
  
  const results = {
    settingsTab: false,
    sidebar: false,
    generalSettings: false,
    platformSettings: false,
    securitySettings: false,
    apiSettings: false,
    emailSettings: false,
    backupSettings: false,
    systemStatus: false,
    dangerZone: false,
    saveButton: false
  };
  
  try {
    console.log('📋 NAVIGATING TO SETTINGS TAB');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3000/dashboard/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.waitForSelector('text=Welcome back, Admin!', { timeout: 10000 });
    
    await page.locator('nav.flex.space-x-8 button:has-text("Settings")').first().click();
    await page.waitForTimeout(2000);
    
    results.settingsTab = await page.locator('text=System Settings').isVisible();
    console.log(`   ${results.settingsTab ? '✅' : '❌'} Settings Tab Loaded\n`);
    
    // TEST 1: Sidebar Navigation
    console.log('📁 TEST 1: SETTINGS SIDEBAR');
    console.log('-'.repeat(80));
    const sidebarButtons = await page.locator('nav button').count();
    results.sidebar = sidebarButtons >= 10;
    console.log(`   ${results.sidebar ? '✅' : '❌'} Sidebar: ${sidebarButtons} categories\n`);
    
    // TEST 2: General Settings
    console.log('🌐 TEST 2: GENERAL SETTINGS');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("General")').first().click();
    await page.waitForTimeout(500);
    
    const generalHeading = await page.locator('h3:has-text("General Settings")').isVisible();
    const platformName = await page.locator('input[value*="Health Hub"]').isVisible();
    results.generalSettings = generalHeading && platformName;
    console.log(`   ${results.generalSettings ? '✅' : '❌'} General Settings loaded`);
    console.log(`   ${platformName ? '✅' : '❌'} Platform Name field visible\n`);
    
    // TEST 3: Platform Settings
    console.log('🔧 TEST 3: PLATFORM CONFIGURATION');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Platform")').first().click();
    await page.waitForTimeout(500);
    
    const platformHeading = await page.locator('h3:has-text("Platform Configuration")').isVisible();
    const maintenanceMode = await page.locator('text=Maintenance Mode').isVisible();
    results.platformSettings = platformHeading && maintenanceMode;
    console.log(`   ${results.platformSettings ? '✅' : '❌'} Platform Settings loaded`);
    console.log(`   ${maintenanceMode ? '✅' : '❌'} Maintenance Mode toggle visible\n`);
    
    // TEST 4: Security Settings
    console.log('🔒 TEST 4: SECURITY SETTINGS');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Security")').first().click();
    await page.waitForTimeout(500);
    
    const securityHeading = await page.locator('h3:has-text("Security Settings")').isVisible();
    const passwordReq = await page.locator('text=Password Requirements').isVisible();
    results.securitySettings = securityHeading && passwordReq;
    console.log(`   ${results.securitySettings ? '✅' : '❌'} Security Settings loaded`);
    console.log(`   ${passwordReq ? '✅' : '❌'} Password Requirements section visible\n`);
    
    // TEST 5: API Settings
    console.log('🔑 TEST 5: API KEYS');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("API Keys")').first().click();
    await page.waitForTimeout(500);
    
    const apiHeading = await page.locator('h3:has-text("API Keys")').isVisible();
    const openaiKey = await page.locator('text=OpenAI API Key').isVisible();
    results.apiSettings = apiHeading && openaiKey;
    console.log(`   ${results.apiSettings ? '✅' : '❌'} API Settings loaded`);
    console.log(`   ${openaiKey ? '✅' : '❌'} OpenAI API Key field visible\n`);
    
    // TEST 6: Email Settings
    console.log('📧 TEST 6: EMAIL CONFIGURATION');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Email")').first().click();
    await page.waitForTimeout(500);
    
    const emailHeading = await page.locator('h3:has-text("Email Configuration")').isVisible();
    const smtpHost = await page.locator('text=SMTP Host').isVisible();
    results.emailSettings = emailHeading && smtpHost;
    console.log(`   ${results.emailSettings ? '✅' : '❌'} Email Settings loaded`);
    console.log(`   ${smtpHost ? '✅' : '❌'} SMTP Configuration visible\n`);
    
    // TEST 7: Backup Settings
    console.log('💾 TEST 7: BACKUP & RESTORE');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("Backup & Restore")').first().click();
    await page.waitForTimeout(500);
    
    const backupHeading = await page.locator('h3:has-text("Backup & Restore")').isVisible();
    const backupNow = await page.locator('button:has-text("Backup Now")').isVisible();
    results.backupSettings = backupHeading && backupNow;
    console.log(`   ${results.backupSettings ? '✅' : '❌'} Backup Settings loaded`);
    console.log(`   ${backupNow ? '✅' : '❌'} Backup Now button visible\n`);
    
    // TEST 8: System Status
    console.log('🖥️  TEST 8: SYSTEM STATUS');
    console.log('-'.repeat(80));
    const systemStatus = await page.locator('h3:has-text("System Status")').isVisible();
    const serverOnline = await page.locator('text=Online').isVisible();
    results.systemStatus = systemStatus && serverOnline;
    console.log(`   ${results.systemStatus ? '✅' : '❌'} System Status panel`);
    console.log(`   ${serverOnline ? '✅' : '❌'} Server status indicators\n`);
    
    // TEST 9: Danger Zone
    console.log('⚠️  TEST 9: DANGER ZONE');
    console.log('-'.repeat(80));
    const dangerZone = await page.locator('h3:has-text("Danger Zone")').isVisible();
    const clearCache = await page.locator('button:has-text("Clear Cache")').isVisible();
    results.dangerZone = dangerZone && clearCache;
    console.log(`   ${results.dangerZone ? '✅' : '❌'} Danger Zone section`);
    console.log(`   ${clearCache ? '✅' : '❌'} Dangerous action buttons\n`);
    
    // TEST 10: Save Button
    console.log('💾 TEST 10: SAVE FUNCTIONALITY');
    console.log('-'.repeat(80));
    
    // Go back to General settings and make a change
    await page.locator('button:has-text("General")').first().click();
    await page.waitForTimeout(500);
    
    const saveButton = await page.locator('button:has-text("Save Changes")').isVisible();
    results.saveButton = saveButton;
    console.log(`   ${results.saveButton ? '✅' : '❌'} Save Changes button visible\n`);
    
    if (saveButton) {
      // Make a small change to enable save button
      const taglineInput = await page.locator('input[value*="Comprehensive ECG"]').first();
      await taglineInput.click();
      await taglineInput.press('End');
      await taglineInput.type('!');
      await page.waitForTimeout(500);
      
      const unsavedText = await page.locator('text=Unsaved changes').isVisible();
      console.log(`   ${unsavedText ? '✅' : '❌'} Unsaved changes indicator\n`);
    }
    
    // Screenshot
    await page.screenshot({ path: 'settings-management-system.png', fullPage: true });
    console.log('📸 Screenshot saved: settings-management-system.png\n');
    
    // FINAL RESULTS
    console.log('='.repeat(80));
    console.log('⚙️  SETTINGS MANAGEMENT TEST RESULTS');
    console.log('='.repeat(80));
    
    console.log('\n📋 CORE FEATURES:');
    console.log(`   ${results.settingsTab ? '✅' : '❌'} Settings Tab Navigation`);
    console.log(`   ${results.sidebar ? '✅' : '❌'} Sidebar (10 categories)`);
    console.log(`   ${results.saveButton ? '✅' : '❌'} Save Functionality`);
    
    console.log('\n⚙️  SETTING CATEGORIES:');
    console.log(`   ${results.generalSettings ? '✅' : '❌'} General Settings`);
    console.log(`   ${results.platformSettings ? '✅' : '❌'} Platform Settings`);
    console.log(`   ${results.securitySettings ? '✅' : '❌'} Security Settings`);
    console.log(`   ${results.apiSettings ? '✅' : '❌'} API Keys`);
    console.log(`   ${results.emailSettings ? '✅' : '❌'} Email Configuration`);
    console.log(`   ${results.backupSettings ? '✅' : '❌'} Backup & Restore`);
    
    console.log('\n🎮 ADDITIONAL FEATURES:');
    console.log(`   ${results.systemStatus ? '✅' : '❌'} System Status Panel`);
    console.log(`   ${results.dangerZone ? '✅' : '❌'} Danger Zone`);
    
    const passedCount = Object.values(results).filter(v => v === true).length;
    const totalCount = Object.values(results).length;
    const passRate = Math.round((passedCount / totalCount) * 100);
    
    console.log('\n' + '='.repeat(80));
    console.log(`⚙️  OVERALL SCORE: ${passedCount}/${totalCount} tests passed (${passRate}%)`);
    console.log('='.repeat(80));
    
    if (passRate === 100) {
      console.log('\n🎊🎊🎊 PERFECT! SETTINGS SYSTEM FULLY OPERATIONAL! 🎊🎊🎊\n');
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

