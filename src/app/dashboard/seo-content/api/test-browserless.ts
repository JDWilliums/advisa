import puppeteer from 'puppeteer-core';

/**
 * Simple utility to test Browserless.io connection
 * Run this file directly with: 
 * node -r dotenv/config dist/app/dashboard/seo-content/api/test-browserless.js
 */
async function testBrowserless() {
  if (!process.env.BROWSERLESS_TOKEN) {
    console.error('❌ Error: BROWSERLESS_TOKEN environment variable is not set');
    console.log('Please set a valid token in your .env.local file or environment variables');
    process.exit(1);
  }

  console.log('🔍 Testing Browserless.io connection...');
  console.log(`Using token: ${process.env.BROWSERLESS_TOKEN.substring(0, 5)}...`);
  
  let browser;
  
  try {
    // Connect to Browserless.io
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    });
    
    console.log('✅ Successfully connected to Browserless.io!');
    
    // Create a new page
    const page = await browser.newPage();
    console.log('✅ Successfully created a new page');
    
    // Navigate to a test URL
    await page.goto('https://example.com', { waitUntil: 'networkidle2' });
    console.log('✅ Successfully loaded example.com');
    
    // Get the page title
    const title = await page.title();
    console.log(`✅ Page title: "${title}"`);
    
    // Take a screenshot (optional)
    await page.screenshot({ path: 'browserless-test.png' });
    console.log('✅ Saved screenshot to browserless-test.png');
    
    console.log('🎉 All tests passed! Browserless.io is working correctly.');
    
    // Close everything
    await page.close();
    await browser.close();
  } catch (error) {
    console.error('❌ Error connecting to Browserless.io:', error);
    console.log('\nPossible issues:');
    console.log('1. Your BROWSERLESS_TOKEN may be invalid');
    console.log('2. You may have exceeded your Browserless.io quota');
    console.log('3. Your network may be blocking the connection');
    
    process.exit(1);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        // Ignore
      }
    }
  }
}

// Only run directly if this file is executed directly
if (require.main === module) {
  testBrowserless().catch(console.error);
}

export { testBrowserless }; 