import type { Browser } from 'puppeteer-core';

/**
 * Helper utility to ensure proper browser cleanup
 */
export async function closeBrowserSafely(browser: Browser | null): Promise<void> {
  if (!browser) {
    return;
  }
  
  try {
    // First try to close all pages
    const pages = await browser.pages().catch(() => []);
    await Promise.all(
      pages.map(page => 
        page.close().catch(e => console.log('Error closing page:', e))
      )
    );
    
    // Then close the browser
    if (browser.disconnect) {
      // For connected browsers (like Browserless.io)
      browser.disconnect();
    } else {
      // For launched browsers
      await browser.close().catch(e => console.log('Error closing browser:', e));
    }
    
    console.log('Browser safely closed');
  } catch (error) {
    console.error('Error during browser cleanup:', error);
  }
}

/**
 * Sets a maximum timeout for browser operations
 */
export function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });
}

/**
 * Run a browser operation with a timeout
 */
export async function runWithTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number = 30000,
  cleanupFn?: () => Promise<void>
): Promise<T> {
  try {
    return await Promise.race([
      operation,
      createTimeoutPromise(timeoutMs)
    ]);
  } catch (error) {
    if (cleanupFn) {
      await cleanupFn().catch(e => console.error('Cleanup error:', e));
    }
    throw error;
  }
} 