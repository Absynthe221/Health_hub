const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('Testing admin dashboard...');
    await page.goto('http://localhost:3000/dashboard/admin');
    await page.waitForTimeout(5000);
    
    const screenshot = await page.screenshot({ path: 'admin-current-state.png', fullPage: true });
    console.log('Screenshot saved');
    
    const html = await page.content();
    console.log('Page loaded');
    console.log('Has Welcome:', html.includes('Welcome back'));
    console.log('Has loading spinner:', html.includes('animate-spin'));
    
    await page.waitForTimeout(5000);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();

