import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import { closeBrowserSafely } from '@/app/dashboard/seo-content/api/cleanup-helper';

export const dynamic = 'force-dynamic'; // Never cache this route

export async function GET(request: NextRequest) {
  let browser = null;
  
  try {
    // Check if BROWSERLESS_TOKEN is configured
    if (!process.env.BROWSERLESS_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'BROWSERLESS_TOKEN not configured' },
        { status: 500 }
      );
    }
    
    // Attempt to connect to Browserless.io
    console.log('API: Testing connection to Browserless.io');
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
    });
    
    // Create a page
    const page = await browser.newPage();
    
    // Visit a simple website
    await page.goto('https://example.com', { waitUntil: 'networkidle2' });
    
    // Get some basic information
    const title = await page.title();
    const url = page.url();
    
    // Take a screenshot (as base64)
    const screenshot = await page.screenshot({ encoding: 'base64' });
    
    // Close the page
    await page.close();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Browserless.io',
      details: {
        title,
        url,
        screenshot: `data:image/png;base64,${screenshot}`
      }
    });
  } catch (error) {
    console.error('API: Browserless test failed:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    // Ensure browser is closed
    if (browser) {
      await closeBrowserSafely(browser);
    }
  }
} 