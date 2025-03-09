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
  
  // If in production and BROWSERLESS_TOKEN is available, use browserless.io
  if (!isDev && process.env.BROWSERLESS_TOKEN) {
    console.log('🔍 Using Browserless.io service');
    try {
      return await puppeteerCore.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
      }) as unknown as Browser;
    } catch (error) {
      console.error('Failed to connect to Browserless.io:', error);
      throw new Error(`Could not connect to Browserless.io: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
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
          executablePath: process.platform === 'win32' 
            ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
            : process.platform === 'darwin'
              ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
              : '/usr/bin/google-chrome',
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
    console.log('🔍 Launching browser in production mode');
    
    // Production environment - try fallback options
    try {
      // First try puppeteer's bundled Chromium - this should be used in serverless environments
      try {
        const puppeteer = await import('puppeteer');
        console.log('Using puppeteer bundled Chromium');
        return await puppeteer.default.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--single-process'
          ]
        }) as unknown as Browser;
      } catch (puppeteerError) {
        console.log('Failed to use puppeteer bundled Chromium:', puppeteerError);
        
        // Fallback to Browserless.io again (in case BROWSERLESS_TOKEN was added after initialization)
        if (process.env.BROWSERLESS_TOKEN) {
          console.log('Retrying Browserless.io connection...');
          return await puppeteerCore.connect({
            browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
          }) as unknown as Browser;
        }
        
        throw new Error('No available browser options. Please configure BROWSERLESS_TOKEN in your environment variables.');
      }
    } catch (error) {
      console.error('All browser launch attempts failed:', error);
      throw new Error(`Could not find any compatible browser or service. Please check the error logs.`);
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