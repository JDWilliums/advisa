import { LinksAnalysis, AnalysisDepth } from '../../types/seo';
import { Page } from 'puppeteer-core';
import { URL } from 'url';

/**
 * Analyzes links for SEO compliance
 * @param document DOM document object
 * @param baseUrl Base URL of the page being analyzed
 * @param page Puppeteer page object
 * @param depth Analysis depth level
 * @returns Analysis of links
 */
export async function analyzeLinks(
  document: Document,
  baseUrl: string,
  page: Page,
  depth: AnalysisDepth = 'standard'
): Promise<LinksAnalysis> {
  // Default result with empty values
  const result: LinksAnalysis = {
    score: 0,
    issues: [],
    internal: 0,
    external: 0,
    broken: 0,
    nofollow: 0,
    total: 0,
    uniqueUrls: 0,
  };

  try {
    // Parse the base URL to help determine internal vs external links
    const parsedBaseUrl = new URL(baseUrl);
    const baseDomain = parsedBaseUrl.hostname;
    
    // Get all links from the page
    const links = document.querySelectorAll('a[href]');
    result.total = links.length;
    
    if (result.total === 0) {
      result.issues.push('No links found on the page');
      return result;
    }
    
    // Store unique URLs to count them
    const uniqueUrls = new Set<string>();
    const brokenLinks = new Set<string>();
    
    // Analyze each link
    for (const link of Array.from(links)) {
      const href = link.getAttribute('href');
      if (!href) continue;
      
      // Skip anchor links and javascript: links
      if (href.startsWith('#') || href.startsWith('javascript:')) {
        continue;
      }
      
      // Try to parse the URL (relative or absolute)
      let fullUrl: URL;
      try {
        fullUrl = new URL(href, baseUrl);
        uniqueUrls.add(fullUrl.href);
      } catch (e) {
        // Malformed URL, count as an issue
        result.issues.push(`Malformed URL found: ${href}`);
        continue;
      }
      
      // Check if internal or external
      if (fullUrl.hostname === baseDomain) {
        result.internal++;
      } else {
        result.external++;
      }
      
      // Check for nofollow attribute
      const rel = link.getAttribute('rel');
      if (rel && (rel.includes('nofollow') || rel.includes('ugc') || rel.includes('sponsored'))) {
        if (result.nofollow !== undefined) {
          result.nofollow++;
        }
      }
      
      // For deep analysis, check for broken links
      if (depth === 'deep') {
        try {
          // Use fetch to check if the link is broken
          // Note: This is simplified and has limitations in a real tool
          const status = await page.evaluate(async (url) => {
            try {
              const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
              return response.status;
            } catch (e) {
              return 0; // Network error
            }
          }, fullUrl.href);
          
          if (status >= 400 || status === 0) {
            brokenLinks.add(fullUrl.href);
          }
        } catch (e) {
          // Skip individual link check errors
        }
      }
    }
    
    // Update result with unique URLs and broken links
    result.uniqueUrls = uniqueUrls.size;
    result.broken = brokenLinks.size;
    
    // Generate issues based on the analysis
    if (result.internal === 0) {
      result.issues.push('No internal links found');
    }
    
    if (result.broken > 0) {
      result.issues.push(`${result.broken} broken link(s) found`);
    }
    
    const uniqueRatio = result.total > 0 ? result.uniqueUrls / result.total : 0;
    if (uniqueRatio < 0.7 && result.total > 10) {
      result.issues.push('Many duplicate links found (less than 70% unique)');
    }
    
    if (result.internal < 3 && result.total > 5) {
      result.issues.push('Too few internal links (recommended: at least 3)');
    }
    
    // Calculate score based on issues and link metrics
    const issueCount = result.issues.length;
    let score = 100 - (issueCount * 15);
    
    // Adjust score based on broken links (more severe penalty)
    if (result.broken > 0) {
      score -= Math.min(40, result.broken * 10);
    }
    
    result.score = Math.max(0, score);
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.issues.push(`Error analyzing links: ${errorMessage}`);
  }

  return result;
} 