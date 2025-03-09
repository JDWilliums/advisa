import { PerformanceAnalysis } from '../../types/seo';
import { Page } from 'puppeteer-core';

/**
 * Analyzes performance metrics for SEO
 * @param page Puppeteer page object
 * @param resourceTiming Array of resource timing objects
 * @returns Analysis of performance
 */
export async function analyzePerformance(
  page: Page, 
  resourceTiming: Array<{
    url: string;
    type: string;
    status: number;
    size: number | string;
    timing?: {
      startTime: number;
      domainLookupStart?: number;
      domainLookupEnd?: number;
      connectStart?: number;
      connectEnd?: number;
      requestStart?: number;
      responseStart?: number;
      responseEnd?: number;
    };
  }>
): Promise<PerformanceAnalysis> {
  // Default result with empty values
  const result: PerformanceAnalysis = {
    score: 0,
    issues: [],
    loadTime: '0s',
    ttfb: '0ms',
    tti: '0s',
    fcp: '0s',
    resources: {
      total: 0,
      byType: {},
      totalSize: '0KB'
    }
  };

  try {
    // Get performance metrics from page
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      // TTFB (Time to First Byte)
      const ttfb = navigation ? navigation.responseStart - navigation.requestStart : 0;
      
      // Load time
      const loadTime = navigation ? navigation.loadEventEnd - navigation.startTime : 0;
      
      // First Contentful Paint
      let fcp = 0;
      const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        fcp = fcpEntry.startTime;
      }
      
      return {
        ttfb,
        loadTime,
        fcp
      };
    });
    
    // Calculate TTI (Time to Interactive) - simplified approximation
    // In a real tool, you would use more sophisticated methods
    const tti = await page.evaluate(() => {
      return new Promise<number>(resolve => {
        // A simplified TTI calculation
        // Real TTI calculation requires Long Tasks API and more complex analysis
        let timeToInteractive = performance.timing.domInteractive - performance.timing.navigationStart;
        
        // Add a small buffer to account for script execution
        timeToInteractive += 50;
        
        resolve(timeToInteractive);
      });
    });
    
    // Format time values for human readability
    result.ttfb = `${Math.round(performanceMetrics.ttfb)}ms`;
    result.loadTime = `${(performanceMetrics.loadTime / 1000).toFixed(2)}s`;
    result.fcp = `${(performanceMetrics.fcp / 1000).toFixed(2)}s`;
    result.tti = `${(tti / 1000).toFixed(2)}s`;
    
    // Analyze resource data
    result.resources.total = resourceTiming.length;
    
    // Calculate resource sizes by type
    let totalSize = 0;
    resourceTiming.forEach(resource => {
      // Increment count by resource type
      const type = resource.type || 'other';
      result.resources.byType[type] = (result.resources.byType[type] || 0) + 1;
      
      // Add size
      let resourceSize = 0;
      if (typeof resource.size === 'number') {
        resourceSize = resource.size;
      } else if (typeof resource.size === 'string') {
        resourceSize = parseInt(resource.size, 10) || 0;
      }
      
      totalSize += resourceSize;
    });
    
    // Format total size
    result.resources.totalSize = formatBytes(totalSize);
    
    // Generate performance issues
    const ttfbValue = parseInt(result.ttfb, 10);
    const loadTimeValue = parseFloat(result.loadTime);
    const fcpValue = parseFloat(result.fcp);
    
    if (ttfbValue > 200) {
      result.issues.push(`Time to First Byte (TTFB) is slow: ${result.ttfb} (should be under 200ms)`);
    }
    
    if (loadTimeValue > 3) {
      result.issues.push(`Page load time is slow: ${result.loadTime} (should be under 3s)`);
    }
    
    if (fcpValue > 1.8) {
      result.issues.push(`First Contentful Paint is slow: ${result.fcp} (should be under 1.8s)`);
    }
    
    if (result.resources.total > 80) {
      result.issues.push(`High number of HTTP requests: ${result.resources.total} (try to reduce below 80)`);
    }
    
    const totalSizeInMB = totalSize / (1024 * 1024);
    if (totalSizeInMB > 2) {
      result.issues.push(`Page size is too large: ${result.resources.totalSize} (should be under 2MB)`);
    }
    
    // Calculate performance score based on issues
    const issueCount = result.issues.length;
    result.score = Math.max(0, 100 - (issueCount * 20));
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.issues.push(`Error analyzing performance: ${errorMessage}`);
  }

  return result;
}

/**
 * Formats bytes into human-readable format
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
} 