import puppeteerCore from 'puppeteer-core';
import type { Browser, Page } from 'puppeteer-core';
import * as fs from 'fs';

// Define a minimal type for chrome-aws-lambda to satisfy TypeScript
type ChromiumType = {
  default: {
    args: string[];
    executablePath: string | Promise<string>;
    headless: boolean;
  }
};

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
      // First try local Chrome if available
      const possiblePaths = process.platform === 'win32'
        ? [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
          ]
        : process.platform === 'darwin'
          ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
          : ['/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium'];
      
      for (const path of possiblePaths) {
        try {
          if (require('fs').existsSync(path)) {
            console.log('Using local Chrome:', path);
            return await puppeteerCore.launch({
              headless: true,
              executablePath: path,
              args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
          }
        } catch (e) {}
      }
      
      // If local Chrome not found, try to use chrome-aws-lambda as fallback
      try {
        // Use dynamic import with type assertion to bypass TypeScript errors
        // @ts-expect-error - Ignore the module not found error
        const chromium = await import('chrome-aws-lambda') as any;
        
        return await puppeteerCore.launch({
          args: chromium.default.args,
          executablePath: await chromium.default.executablePath,
          headless: chromium.default.headless,
        });
      } catch (importError) {
        console.error('Failed to import chrome-aws-lambda:', importError);
        throw new Error('Could not find Chrome or chrome-aws-lambda. Please install Chrome or run npm install chrome-aws-lambda.');
      }
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