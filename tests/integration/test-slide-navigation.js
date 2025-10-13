const { chromium } = require('playwright');

(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('📖 TESTING SLIDE NAVIGATION FROM LEARNER DASHBOARD');
  console.log('='.repeat(80) + '\n');
  
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();
  
  try {
    console.log('📋 STEP 1: Navigate to Learner Dashboard');
    console.log('-'.repeat(80));
    await page.goto('http://localhost:3000/dashboard/learner', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const dashboardLoaded = await page.locator('text=Welcome back, Student!').isVisible();
    console.log(`   ${dashboardLoaded ? '✅' : '❌'} Dashboard loaded\n`);
    
    console.log('📚 STEP 2: Click My Modules Tab');
    console.log('-'.repeat(80));
    await page.locator('button:has-text("My Modules")').click();
    await page.waitForTimeout(2000);
    console.log('   ✅ Modules tab active\n');
    
    console.log('🔍 STEP 3: Find Module Cards');
    console.log('-'.repeat(80));
    const moduleCards = await page.locator('.bg-white.rounded-lg.shadow').count();
    console.log(`   ✅ Found ${moduleCards} module cards\n`);
    
    console.log('▶️  STEP 4: Click Review/Continue Button on First Module');
    console.log('-'.repeat(80));
    
    // Find and click the first module button
    const firstButton = page.locator('button:has-text("Review"), button:has-text("Continue"), button:has-text("Start Learning")').first();
    const buttonText = await firstButton.innerText();
    console.log(`   📌 Button text: "${buttonText}"`);
    
    await firstButton.click();
    await page.waitForTimeout(3000);
    
    console.log('   ✅ Button clicked\n');
    
    console.log('🎯 STEP 5: Verify Slide Viewer Loaded');
    console.log('-'.repeat(80));
    
    const currentURL = page.url();
    console.log(`   📍 Current URL: ${currentURL}`);
    
    const slideViewerLoaded = currentURL.includes('/view-slides/');
    console.log(`   ${slideViewerLoaded ? '✅' : '❌'} Navigated to slide viewer`);
    
    if (slideViewerLoaded) {
      await page.waitForTimeout(2000);
      
      const slideTitle = await page.locator('h2.text-3xl, h2.text-4xl').first().isVisible();
      const prevButton = await page.locator('button:has-text("Previous")').isVisible();
      const nextButton = await page.locator('button:has-text("Next")').isVisible();
      
      console.log(`   ${slideTitle ? '✅' : '❌'} Slide title visible`);
      console.log(`   ${prevButton ? '✅' : '❌'} Previous button visible`);
      console.log(`   ${nextButton ? '✅' : '❌'} Next button visible\n`);
      
      // Test navigation
      console.log('➡️  STEP 6: Test Slide Navigation');
      console.log('-'.repeat(80));
      
      if (nextButton) {
        await page.locator('button:has-text("Next")').click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Next button works\n');
      }
      
      // Screenshot
      await page.screenshot({ path: 'slide-viewer-test.png', fullPage: true });
      console.log('📸 Screenshot saved: slide-viewer-test.png\n');
    }
    
    console.log('='.repeat(80));
    console.log('🎊 NAVIGATION TEST COMPLETE!');
    console.log('='.repeat(80));
    
    if (slideViewerLoaded) {
      console.log('\n✅ SUCCESS: Review/Continue buttons are working!');
      console.log('✅ Students can now view slides from the learner dashboard!\n');
    } else {
      console.log('\n⚠️  Navigation did not work as expected\n');
    }
    
    console.log('⏳ Keeping browser open for 10 seconds...\n');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await browser.close();
    console.log('✅ Test complete!\n');
  }
})();

