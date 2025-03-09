/**
 * This is a test script to see if Puppeteer can launch a browser.
 * Run it with: node test-browser.js
 */

async function testBrowser() {
  try {
    console.log('Loading puppeteer...');
    const puppeteer = require('puppeteer');

    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    console.log('Browser launched successfully!');
    console.log('Browser version:', await browser.version());

    // Try to open a page
    console.log('Opening a page...');
    const page = await browser.newPage();
    await page.goto('https://example.com');
    console.log('Page opened successfully!');

    // Get page content
    const title = await page.title();
    console.log('Page title:', title);

    // Close browser
    await browser.close();
    console.log('Browser closed successfully.');
    console.log('TEST PASSED: Puppeteer is working correctly!');
    
    return true;
  } catch (error) {
    console.error('Error testing browser:', error);
    console.error('TEST FAILED: Puppeteer is not working correctly.');
    return false;
  }
}

// Run the test
testBrowser().then(success => {
  if (!success) {
    console.log('\nTROUBLESHOOTING TIPS:');
    console.log('1. Make sure Chrome is installed on your system');
    console.log('2. Try running "npm install puppeteer@9.1.1 --save" to install Puppeteer with its browser');
    console.log('3. If you\'re using Windows, make sure you\'re running this in a Command Prompt with admin privileges');
    console.log('4. Check if your antivirus is blocking Puppeteer from launching Chrome');
  }
}); 