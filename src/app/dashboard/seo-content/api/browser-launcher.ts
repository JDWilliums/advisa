import puppeteerCore from 'puppeteer-core';
import type { Browser, Page } from 'puppeteer-core';

/**
 * Helper to launch a browser instance that works in both development and serverless environments
 */
export async function launchBrowser(): Promise<Browser> {
  // Detect environment
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    console.log('🔍 Launching browser in development mode');
    
    // Try multiple approaches to launch a browser
    try {
      // Approach 1: Try using locally installed Chrome with puppeteer-core
      try {
        return await puppeteerCore.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
          executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        });
      } catch (error) {
        console.log('Could not use local Chrome installation, trying puppeteer...');
        // Approach 2: Try using puppeteer's built-in browser
        const puppeteer = require('puppeteer');
        return await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
        });
      }
    } catch (error) {
      console.error('All browser launch attempts failed:', error);
      throw new Error(`Could not launch any browser: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    console.log('🔍 Launching browser in serverless mode');
    
    // Serverless environment - use Vercel's Chrome
    // Note: This requires Puppeteer core 9.x.x to work with chrome-aws-lambda
    try {
      // Dynamic import to avoid bundling issues
      const chromium = await import('chrome-aws-lambda');
      
      return await puppeteerCore.launch({
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath,
        headless: chromium.default.headless,
      });
    } catch (error) {
      console.error('Failed to launch browser in serverless mode:', error);
      throw error;
    }
  }
}

/**
 * Creates a ready-to-use page with common settings for SEO analysis
 */
export async function createPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  
  // Set a desktop viewport
  await page.setViewport({
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
  });
  
  // Set useful defaults for crawling
  await page.setJavaScriptEnabled(true);
  await page.setRequestInterception(true);
  
  // Block unnecessary resources to speed up analysis
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    const shouldBlock = ['image', 'media', 'font', 'stylesheet'].includes(resourceType);
    
    if (shouldBlock && process.env.BLOCK_RESOURCES === 'true') {
      req.abort();
    } else {
      req.continue();
    }
  });
  
  return page;
} 