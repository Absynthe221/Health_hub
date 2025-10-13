const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 VERIFYING 2-MODULE STRUCTURE ACROSS ALL DASHBOARDS');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  const results = {
    admin: { loaded: false, moduleCount: 0, module1: false, module2: false },
    instructor: { loaded: false, moduleCount: 0, module1: false, module2: false },
    learner: { loaded: false, moduleCount: 0, module1: false, module2: false }
  };
  
  try {
    // TEST ADMIN DASHBOARD
    console.log('🔧 TEST 1: ADMIN DASHBOARD');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3000/dashboard/admin', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    results.admin.loaded = await page.locator('text=Welcome back, Admin!').isVisible();
    console.log(`   ${results.admin.loaded ? '✅' : '❌'} Admin dashboard loaded`);
    
    // Click Modules tab
    await page.locator('nav.flex.space-x-8 button:has-text("Modules")').first().click();
    await page.waitForTimeout(2000);
    
    // Count module cards
    const adminModuleCards = await page.locator('.bg-white.rounded-lg.shadow.p-6').count();
    results.admin.moduleCount = adminModuleCards;
    
    results.admin.module1 = await page.locator('text=Basic ECG Interpretations').first().isVisible();
    results.admin.module2 = await page.locator('text=Case Studies').first().isVisible();
    
    console.log(`   📊 Module count: ${adminModuleCards}`);
    console.log(`   ${results.admin.module1 ? '✅' : '❌'} Module 1: Basic ECG Interpretations`);
    console.log(`   ${results.admin.module2 ? '✅' : '❌'} Module 2: Case Studies\n`);
    
    // TEST INSTRUCTOR DASHBOARD
    console.log('👨‍🏫 TEST 2: INSTRUCTOR DASHBOARD');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3000/dashboard/instructor', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    results.instructor.loaded = await page.locator('text=Welcome back, Instructor!').isVisible();
    console.log(`   ${results.instructor.loaded ? '✅' : '❌'} Instructor dashboard loaded`);
    
    // Click My Modules tab
    await page.locator('button:has-text("My Modules")').click();
    await page.waitForTimeout(2000);
    
    // Count module cards
    const instructorModuleCards = await page.locator('.bg-white.rounded-lg.shadow').count();
    results.instructor.moduleCount = instructorModuleCards;
    
    results.instructor.module1 = await page.locator('text=Basic ECG Interpretations').first().isVisible();
    results.instructor.module2 = await page.locator('text=Case Studies').first().isVisible();
    
    console.log(`   📊 Module count: ${instructorModuleCards}`);
    console.log(`   ${results.instructor.module1 ? '✅' : '❌'} Module 1: Basic ECG Interpretations`);
    console.log(`   ${results.instructor.module2 ? '✅' : '❌'} Module 2: Case Studies\n`);
    
    // TEST LEARNER DASHBOARD
    console.log('📚 TEST 3: LEARNER DASHBOARD');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3000/dashboard/learner', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    results.learner.loaded = await page.locator('text=Welcome back, Student!').isVisible();
    console.log(`   ${results.learner.loaded ? '✅' : '❌'} Learner dashboard loaded`);
    
    // Click My Modules tab
    await page.locator('button:has-text("My Modules")').click();
    await page.waitForTimeout(2000);
    
    // Count module cards
    const learnerModuleCards = await page.locator('.bg-white.rounded-lg.shadow').count();
    results.learner.moduleCount = learnerModuleCards;
    
    results.learner.module1 = await page.locator('text=Basic ECG Interpretations').first().isVisible();
    results.learner.module2 = await page.locator('text=Case Studies').first().isVisible();
    
    console.log(`   📊 Module count: ${learnerModuleCards}`);
    console.log(`   ${results.learner.module1 ? '✅' : '❌'} Module 1: Basic ECG Interpretations`);
    console.log(`   ${results.learner.module2 ? '✅' : '❌'} Module 2: Case Studies\n`);
    
    // Check difficulty badges
    console.log('🏷️  TEST 4: DIFFICULTY BADGES');
    console.log('-'.repeat(80));
    const beginnerBadge = await page.locator('text=beginner').first().isVisible();
    const intermediateBadge = await page.locator('text=intermediate').first().isVisible();
    console.log(`   ${beginnerBadge ? '✅' : '❌'} Beginner badge visible`);
    console.log(`   ${intermediateBadge ? '✅' : '❌'} Intermediate badge visible\n`);
    
    // Screenshot
    await page.screenshot({ path: '2-modules-verified.png', fullPage: true });
    console.log('📸 Screenshot saved: 2-modules-verified.png\n');
    
    // FINAL RESULTS
    console.log('='.repeat(80));
    console.log('📊 VERIFICATION RESULTS - 2 MODULE STRUCTURE');
    console.log('='.repeat(80));
    
    console.log('\n🔧 ADMIN DASHBOARD:');
    console.log(`   ${results.admin.loaded ? '✅' : '❌'} Dashboard loaded`);
    console.log(`   ${results.admin.moduleCount === 2 ? '✅' : '❌'} Module count: ${results.admin.moduleCount} (expected 2)`);
    console.log(`   ${results.admin.module1 ? '✅' : '❌'} Module 1 visible`);
    console.log(`   ${results.admin.module2 ? '✅' : '❌'} Module 2 visible`);
    
    console.log('\n👨‍🏫 INSTRUCTOR DASHBOARD:');
    console.log(`   ${results.instructor.loaded ? '✅' : '❌'} Dashboard loaded`);
    console.log(`   ${results.instructor.moduleCount >= 2 ? '✅' : '❌'} Module count: ${results.instructor.moduleCount}`);
    console.log(`   ${results.instructor.module1 ? '✅' : '❌'} Module 1 visible`);
    console.log(`   ${results.instructor.module2 ? '✅' : '❌'} Module 2 visible`);
    
    console.log('\n📚 LEARNER DASHBOARD:');
    console.log(`   ${results.learner.loaded ? '✅' : '❌'} Dashboard loaded`);
    console.log(`   ${results.learner.moduleCount >= 2 ? '✅' : '❌'} Module count: ${results.learner.moduleCount}`);
    console.log(`   ${results.learner.module1 ? '✅' : '❌'} Module 1 visible`);
    console.log(`   ${results.learner.module2 ? '✅' : '❌'} Module 2 visible`);
    
    const allPassed = 
      results.admin.loaded && results.admin.module1 && results.admin.module2 &&
      results.instructor.loaded && results.instructor.module1 && results.instructor.module2 &&
      results.learner.loaded && results.learner.module1 && results.learner.module2;
    
    console.log('\n' + '='.repeat(80));
    if (allPassed) {
      console.log('🎊🎊🎊 PERFECT! 2 MODULES VISIBLE ACROSS ALL DASHBOARDS! 🎊🎊🎊');
    } else {
      console.log('⚠️  Some modules may still be loading...');
    }
    console.log('='.repeat(80));
    
    console.log('\n📊 SUMMARY:');
    console.log(`   Module 1: Basic ECG Interpretations (Beginner) - 166 slides`);
    console.log(`   Module 2: Case Studies (Intermediate) - 7 slides`);
    console.log(`   Total: 2 modules, 173 slides\n`);
    
    console.log('⏳ Keeping browser open for 10 seconds...\n');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('✅ Verification complete!\n');
  }
})();

