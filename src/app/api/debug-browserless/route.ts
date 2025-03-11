import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

export const dynamic = 'force-dynamic'; // Never cache this route

export async function GET(request: NextRequest) {
  console.log('DEBUG: Starting Browserless.io diagnostic test');
  
  // Log all relevant environment variables
  console.log('DEBUG: Environment variables', {
    NODE_ENV: process.env.NODE_ENV,
    BROWSERLESS_TOKEN_EXISTS: !!process.env.BROWSERLESS_TOKEN,
    BROWSERLESS_TOKEN_FIRST_CHARS: process.env.BROWSERLESS_TOKEN ? process.env.BROWSERLESS_TOKEN.substring(0, 5) : 'none'
  });
  
  let browser = null;
  
  try {
    // Check if BROWSERLESS_TOKEN is configured
    if (!process.env.BROWSERLESS_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'BROWSERLESS_TOKEN not configured' },
        { status: 500 }
      );
    }
    
    // DIRECTLY connect to Browserless.io
    console.log('DEBUG: Attempting to connect to Browserless.io directly');
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    });
    
    console.log('DEBUG: Successfully connected to Browserless.io');
    
    // Create a new page
    const page = await browser.newPage();
    console.log('DEBUG: Successfully created new page');
    
    // Visit example.com to test basic functionality
    await page.goto('https://example.com', { waitUntil: 'networkidle2' });
    console.log('DEBUG: Successfully loaded example.com');
    
    // Get page title
    const title = await page.title();
    console.log(`DEBUG: Page title: ${title}`);
    
    // Take a screenshot as base64
    const screenshot = await page.screenshot({ encoding: 'base64' });
    console.log('DEBUG: Successfully took screenshot');
    
    // Close the page
    await page.close();
    
    return NextResponse.json({
      success: true,
      message: 'Browserless.io is working correctly in production!',
      environment: process.env.NODE_ENV,
      details: {
        title,
        timestamp: new Date().toISOString(),
        screenshot: `data:image/png;base64,${screenshot}`
      }
    });
  } catch (error) {
    console.error('DEBUG: Browserless.io test failed with error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        environment: process.env.NODE_ENV,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace',
        tokenPrefix: process.env.BROWSERLESS_TOKEN ? process.env.BROWSERLESS_TOKEN.substring(0, 5) : 'none'
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log('DEBUG: Browser closed successfully');
      } catch (e) {
        console.error('DEBUG: Error closing browser:', e);
      }
    }
  }
} 