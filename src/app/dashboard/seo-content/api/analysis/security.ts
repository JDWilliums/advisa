import { SecurityAnalysis } from '../../types/seo';
import { Page } from 'puppeteer-core';
import { URL } from 'url';

/**
 * Analyzes security aspects for SEO
 * @param page Puppeteer page object
 * @param url URL of the page being analyzed
 * @returns Analysis of security
 */
export async function analyzeSecurity(page: Page, url: string): Promise<SecurityAnalysis> {
  // Default result with empty values
  const result: SecurityAnalysis = {
    score: 0,
    issues: [],
    https: false,
    contentSecurityPolicy: false,
    xFrameOptions: false,
    strictTransportSecurity: false,
    xContentTypeOptions: false,
  };

  try {
    // Check if the site uses HTTPS
    const parsedUrl = new URL(url);
    result.https = parsedUrl.protocol === 'https:';
    
    if (!result.https) {
      result.issues.push('Site is not using HTTPS (required for better search rankings)');
    }
    
    // Check security headers
    const securityHeaders = await page.evaluate(() => {
      return new Promise<Record<string, string | null>>((resolve) => {
        // Simulate a fetch request to get headers
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', window.location.href, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            // Extract security headers
            const headers = {
              'content-security-policy': xhr.getResponseHeader('Content-Security-Policy'),
              'x-frame-options': xhr.getResponseHeader('X-Frame-Options'),
              'strict-transport-security': xhr.getResponseHeader('Strict-Transport-Security'),
              'x-content-type-options': xhr.getResponseHeader('X-Content-Type-Options'),
            };
            resolve(headers);
          }
        };
        xhr.send(null);
      });
    });
    
    // Analyze security headers
    result.contentSecurityPolicy = !!securityHeaders['content-security-policy'];
    result.xFrameOptions = !!securityHeaders['x-frame-options'];
    result.strictTransportSecurity = !!securityHeaders['strict-transport-security'];
    result.xContentTypeOptions = !!securityHeaders['x-content-type-options'];
    
    // Check for missing security headers
    if (!result.contentSecurityPolicy) {
      result.issues.push('Content-Security-Policy header not found (recommended for security)');
    }
    
    if (!result.xFrameOptions) {
      result.issues.push('X-Frame-Options header not found (helps prevent clickjacking)');
    }
    
    if (result.https && !result.strictTransportSecurity) {
      result.issues.push('Strict-Transport-Security header not found (HSTS recommended for HTTPS sites)');
    }
    
    if (!result.xContentTypeOptions) {
      result.issues.push('X-Content-Type-Options header not found (helps prevent MIME-type sniffing)');
    }
    
    // Additional checks could include:
    // - Mixed content detection
    // - Insecure forms
    // - Vulnerable libraries
    
    // Calculate score based on issues
    const issueCount = result.issues.length;
    
    // HTTPS is weighted more heavily
    let baseScore = result.https ? 60 : 20;
    
    // Each additional security measure adds points
    baseScore += result.contentSecurityPolicy ? 10 : 0;
    baseScore += result.xFrameOptions ? 10 : 0;
    baseScore += result.strictTransportSecurity ? 10 : 0;
    baseScore += result.xContentTypeOptions ? 10 : 0;
    
    result.score = baseScore;
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.issues.push(`Error analyzing security: ${errorMessage}`);
  }

  return result;
} 