import puppeteer from 'puppeteer-core';
import { JSDOM } from 'jsdom';
import { AnalysisDepth, SEOResult } from '../types/seo';
import * as fs from 'fs';
import * as path from 'path';

// Import analysis modules
import { analyzeMetaTags } from './analysis/meta-tags';
import { analyzeHeadings } from './analysis/headings';
import { analyzeContent } from './analysis/content';
import { analyzeImages } from './analysis/images';
import { analyzePerformance } from './analysis/performance';
import { analyzeLinks } from './analysis/links';
import { analyzeSecurity } from './analysis/security';
import { analyzeMobileOptimization } from './analysis/mobile';
import { analyzeAccessibility } from './analysis/accessibility';
import { analyzeStructuredData } from './analysis/structured-data';
import { calculateOverallScore, generateRecommendations } from './analysis/scoring';
import { launchBrowser, createPage } from './browser-launcher';
import { closeBrowserSafely } from './cleanup-helper';

// Mock data for development to avoid server-side dependencies
export const getMockSEOResult = (url: string, depth: AnalysisDepth): SEOResult => {
  return {
    overallScore: 72,
    categories: {
      metaTags: {
        score: 85,
        issues: [],
        title: {
          exists: true,
          length: 45,
          optimal: true,
          value: 'Example Website - Professional Services & Solutions',
          includesSiteName: true
        },
        description: {
          exists: true,
          length: 145,
          optimal: true,
          value: 'Example Website offers professional services and innovative solutions for businesses. Our experienced team delivers high-quality results tailored to your needs.'
        },
        keywords: {
          exists: true,
          value: 'professional services, business solutions, innovation'
        },
        canonical: {
          exists: true,
          value: url
        },
        socialTags: {
          openGraph: true,
          twitterCard: true
        }
      },
      headings: {
        score: 75,
        issues: ['Multiple H1 tags found'],
        h1: { count: 2, optimal: false, values: ['Welcome to Example Website', 'Our Services'] },
        h2: { count: 5, optimal: true, values: ['About Us', 'Why Choose Us', 'Our Approach', 'Testimonials', 'Contact'] },
        h3: { count: 8, optimal: true },
        structure: 'Good'
      },
      content: {
        score: 68,
        issues: ['Content could be more comprehensive', 'Consider adding more relevant keywords'],
        wordCount: 850,
        paragraphs: 12,
        readabilityScore: 'Good',
        keywordDensity: 'Moderate'
      },
      images: {
        score: 62,
        issues: ['5 images missing alt text', '2 images are oversized'],
        total: 12,
        withAlt: 7,
        withoutAlt: 5,
        largeImages: 2
      },
      performance: {
        score: 70,
        issues: ['Consider optimizing CSS delivery', 'Leverage browser caching'],
        loadTime: '2.4s',
        ttfb: '350ms',
        tti: '1.8s',
        fcp: '1.2s',
        resources: { total: 45, byType: { js: 15, css: 8, images: 18, fonts: 4 }, totalSize: '1.2MB' }
      },
      links: {
        score: 90,
        issues: [],
        internal: 18,
        external: 5,
        broken: 0
      },
      security: {
        score: 85,
        issues: ['Missing Content-Security-Policy header'],
        https: true
      },
      mobileOptimization: {
        score: 78,
        issues: ['Touch targets could be larger'],
        viewportMeta: true,
        responsiveDesign: true,
        touchTargets: false,
        fontSizes: true
      },
      accessibility: {
        score: 65,
        issues: ['Low contrast text detected', 'Missing form labels'],
        hasAriaLabels: true,
        imageAltTexts: false,
        contrastRatio: false,
        semanticElements: true,
        formLabels: false
      },
      structuredData: {
        score: 60,
        issues: ['Limited structured data implementation'],
        hasStructuredData: true,
        types: ['Organization', 'WebPage'],
        validStructure: true
      }
    },
    recommendations: [
      'Add alt text to all images for better accessibility and SEO',
      'Fix multiple H1 tags - a page should have exactly one H1',
      'Improve content length and depth on key pages',
      'Implement proper Content-Security-Policy headers',
      'Optimize oversized images to improve loading speed',
      'Improve color contrast for better accessibility',
      'Add labels to all form elements',
      'Implement more structured data types relevant to your business',
      'Consider adding FAQ schema markup to enhance search results',
      'Optimize CSS delivery to reduce render-blocking resources'
    ],
    analyzedUrl: url,
    timestamp: new Date().toISOString(),
    analysisDepth: depth
  };
};

/**
 * Analyzes a URL for SEO factors
 */
export async function analyzeSEO(url: string, depth: AnalysisDepth = 'standard'): Promise<SEOResult> {
  // Use mock data in development to avoid issues with puppeteer
  if (process.env.NODE_ENV !== 'production' && process.env.USE_MOCK_SEO === 'true') {
    console.log('Using mock SEO data for development');
    // Simulate a delay to mimic the real analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockSEOResult(url, depth);
  }

  // Log environment status for debugging
  console.log('SEO ANALYSIS - Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    USE_MOCK_SEO: process.env.USE_MOCK_SEO,
    FALLBACK_TO_MOCK: process.env.FALLBACK_TO_MOCK,
    BROWSERLESS_TOKEN_EXISTS: !!process.env.BROWSERLESS_TOKEN
  });

  let browser: puppeteer.Browser | null = null;
  let page: puppeteer.Page | null = null;
  
  try {
    console.log(`Starting SEO analysis for ${url} with depth: ${depth}`);
    
    // Set timeout
    const timeoutMs = parseInt(process.env.SEO_ANALYSIS_TIMEOUT || '60000', 10);
    
    // Launch browser with improved launcher
    browser = await launchBrowser();
    
    // Create a new page with optimized settings
    page = await createPage(browser);
    
    // Set timeout for the entire operation
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
    });
    
    // Race the analysis against the timeout
    const result = await Promise.race([
      analyzeWithBrowser(url, page, depth),
      timeoutPromise
    ]);
    
    return result;
  } catch (error) {
    console.error('Error during SEO analysis:', error);
    
    if (process.env.FALLBACK_TO_MOCK === 'true') {
      console.log('Falling back to mock data due to error');
      const mockResult = getMockSEOResult(url, depth);
      mockResult.warning = `Analysis failed with error: ${error instanceof Error ? error.message : String(error)}. Using simulated data.`;
      return mockResult;
    }
    
    throw error;
  } finally {
    // Clean up resources
    if (page) {
      try {
        await page.close();
      } catch (err) {
        console.error('Error closing page:', err);
      }
    }
    
    if (browser) {
      await closeBrowserSafely(browser);
    }
  }
}

/**
 * Performs the actual analysis using the browser
 */
async function analyzeWithBrowser(url: string, page: puppeteer.Page, depth: AnalysisDepth): Promise<SEOResult> {
  try {
    console.log(`Starting real browser analysis of ${url} with depth ${depth}`);
    
    // Navigate to URL
    const response = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Get the final URL after redirects
    const finalUrl = page.url();
    console.log(`Loaded page at ${finalUrl}`);
    
    // Check for error status codes
    const status = response?.status() || 0;
    if (status >= 400) {
      throw new Error(`Page returned error status: ${status}`);
    }
    
    // Get HTML content
    const html = await page.content();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // REAL DATA COLLECTION - Not using mock templates
    
    // Collect meta tag information
    const title = await page.title();
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const description = descriptionMeta ? descriptionMeta.getAttribute('content') || '' : '';
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    const keywords = keywordsMeta ? keywordsMeta.getAttribute('content') || '' : '';
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const canonical = canonicalLink ? canonicalLink.getAttribute('href') || '' : '';
    
    // Collect heading information
    const h1Elements = Array.from(document.querySelectorAll('h1'));
    const h2Elements = Array.from(document.querySelectorAll('h2'));
    const h3Elements = Array.from(document.querySelectorAll('h3'));
    
    // Collect images information
    const images = Array.from(document.querySelectorAll('img'));
    const imagesWithAlt = images.filter(img => img.hasAttribute('alt') && img.getAttribute('alt')?.trim() !== '');
    
    // Collect links information
    const links = Array.from(document.querySelectorAll('a[href]'));
    const internalLinks = links.filter(link => {
      const href = link.getAttribute('href') || '';
      return !href.startsWith('http') || href.includes(new URL(finalUrl).hostname);
    });
    const externalLinks = links.filter(link => {
      const href = link.getAttribute('href') || '';
      return href.startsWith('http') && !href.includes(new URL(finalUrl).hostname);
    });
    
    // Basic performance metrics
    const performanceMetrics = await page.evaluate(() => {
      if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const ttfb = perfData.responseStart - perfData.navigationStart;
        return { pageLoadTime, ttfb };
      }
      return { pageLoadTime: 0, ttfb: 0 };
    }).catch(() => ({ pageLoadTime: 0, ttfb: 0 }));
    
    // Check if site is using HTTPS
    const isHttps = finalUrl.startsWith('https');
    
    // Check mobile optimization
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const hasMobileViewport = !!viewportMeta;
    
    console.log(`Collected real data from ${finalUrl}`);
    
    // Now build a REAL result object from scratch (not using mock data at all)
    const metaTagsScore = calculateMetaTagsScore({ title, description, keywords, canonical });
    const headingsScore = calculateHeadingsScore(h1Elements.length, h2Elements.length);
    const imagesScore = calculateImagesScore(images.length, imagesWithAlt.length);
    
    // Create result from scratch - NOT using mock data as template
    const result: SEOResult = {
      overallScore: 0, // Will calculate below
      categories: {
        metaTags: {
          score: metaTagsScore,
          issues: getMetaTagIssues({ title, description, keywords, canonical }),
          title: {
            exists: !!title,
            length: title?.length || 0,
            optimal: title ? title.length >= 30 && title.length <= 60 : false,
            value: title || '',
            includesSiteName: title ? title.includes('|') || title.includes('-') : false
          },
          description: {
            exists: !!description,
            length: description?.length || 0,
            optimal: description ? description.length >= 50 && description.length <= 160 : false,
            value: description || ''
          },
          keywords: {
            exists: !!keywords,
            value: keywords || ''
          },
          canonical: {
            exists: !!canonical,
            value: canonical || ''
          },
          socialTags: {
            openGraph: !!document.querySelector('meta[property^="og:"]'),
            twitterCard: !!document.querySelector('meta[name^="twitter:"]')
          }
        },
        headings: {
          score: headingsScore,
          issues: getHeadingsIssues(h1Elements.length, h2Elements.length),
          h1: { 
            count: h1Elements.length, 
            optimal: h1Elements.length === 1, 
            values: h1Elements.map(el => el.textContent?.trim() || '')
          },
          h2: { 
            count: h2Elements.length, 
            optimal: h2Elements.length > 0, 
            values: h2Elements.map(el => el.textContent?.trim() || '')
          },
          h3: { 
            count: h3Elements.length, 
            optimal: true 
          },
          structure: getHeadingStructureQuality(h1Elements.length, h2Elements.length, h3Elements.length)
        },
        content: {
          score: 70, // Basic score
          issues: [],
          wordCount: countWords(document.body.textContent || ''),
          paragraphs: document.querySelectorAll('p').length,
          readabilityScore: 'Good', // Simplified
          keywordDensity: 'Medium' // Simplified
        },
        images: {
          score: imagesScore,
          issues: getImageIssues(images.length, imagesWithAlt.length),
          total: images.length,
          withAlt: imagesWithAlt.length,
          withoutAlt: images.length - imagesWithAlt.length,
          largeImages: 0 // Would require additional analysis
        },
        performance: {
          score: 80, // Basic score
          issues: [],
          loadTime: `${performanceMetrics.pageLoadTime / 1000}s`,
          ttfb: `${performanceMetrics.ttfb}ms`,
          tti: 'N/A', // Would require additional analysis
          fcp: 'N/A', // Would require additional analysis
          resources: { 
            total: document.querySelectorAll('script, link, img').length, 
            byType: { 
              js: document.querySelectorAll('script').length,
              css: document.querySelectorAll('link[rel="stylesheet"]').length,
              images: images.length,
              fonts: document.querySelectorAll('link[rel="font"]').length
            }, 
            totalSize: 'N/A' // Would require additional analysis
          }
        },
        links: {
          score: 85, // Basic score
          issues: [],
          internal: internalLinks.length,
          external: externalLinks.length,
          broken: 0 // Would require additional analysis
        },
        security: {
          score: isHttps ? 90 : 50,
          issues: isHttps ? [] : ['Site is not using HTTPS'],
          https: isHttps
        },
        mobileOptimization: {
          score: hasMobileViewport ? 80 : 50,
          issues: hasMobileViewport ? [] : ['No mobile viewport meta tag found'],
          viewportMeta: hasMobileViewport,
          responsiveDesign: hasMobileViewport,
          touchTargets: true, // Simplified
          fontSizes: true // Simplified
        },
        accessibility: {
          score: 70, // Basic score
          issues: [],
          hasAriaLabels: document.querySelectorAll('[aria-label]').length > 0,
          imageAltTexts: imagesWithAlt.length === images.length,
          contrastRatio: true, // Simplified
          semanticElements: document.querySelectorAll('header, footer, nav, main, section, article').length > 0,
          formLabels: document.querySelectorAll('label').length >= document.querySelectorAll('input').length
        },
        structuredData: {
          score: 60, // Basic score
          issues: [],
          hasStructuredData: !!document.querySelector('script[type="application/ld+json"]'),
          types: ['WebPage'], // Simplified
          validStructure: true // Simplified
        }
      },
      recommendations: [],
      analyzedUrl: finalUrl,
      timestamp: new Date().toISOString(),
      analysisDepth: depth
    };
    
    // Calculate overall score from category scores
    const scores = [
      result.categories.metaTags.score,
      result.categories.headings.score,
      result.categories.content.score,
      result.categories.images.score,
      result.categories.performance.score,
      result.categories.links.score,
      result.categories.security.score
    ];
    result.overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    
    // Generate recommendations based on issues
    result.recommendations = generateRecommendationsFromResult(result);
    
    console.log(`Analysis complete: Score ${result.overallScore}/100`);
    return result;
  } catch (error) {
    console.error('Error during page analysis:', error);
    throw error;
  }
}

// Helper functions for the analyzer

function calculateMetaTagsScore({ title, description, keywords, canonical }: { 
  title?: string, description?: string, keywords?: string, canonical?: string 
}): number {
  let score = 60; // Base score
  
  if (title && title.length >= 30 && title.length <= 60) score += 10;
  if (description && description.length >= 50 && description.length <= 160) score += 10;
  if (keywords) score += 5;
  if (canonical) score += 15;
  
  return Math.min(score, 100);
}

function getMetaTagIssues({ title, description, keywords, canonical }: {
  title?: string, description?: string, keywords?: string, canonical?: string
}): string[] {
  const issues: string[] = [];
  
  if (!title) {
    issues.push('Missing title tag');
  } else if (title.length < 30) {
    issues.push('Title tag is too short (less than 30 characters)');
  } else if (title.length > 60) {
    issues.push('Title tag is too long (more than 60 characters)');
  }
  
  if (!description) {
    issues.push('Missing meta description');
  } else if (description.length < 50) {
    issues.push('Meta description is too short (less than 50 characters)');
  } else if (description.length > 160) {
    issues.push('Meta description is too long (more than 160 characters)');
  }
  
  if (!canonical) {
    issues.push('Missing canonical link');
  }
  
  return issues;
}

function calculateHeadingsScore(h1Count: number, h2Count: number): number {
  let score = 60; // Base score
  
  if (h1Count === 1) score += 20;
  if (h1Count > 1) score -= 10;
  if (h2Count > 0) score += 20;
  
  return Math.min(Math.max(score, 0), 100);
}

function getHeadingsIssues(h1Count: number, h2Count: number): string[] {
  const issues: string[] = [];
  
  if (h1Count === 0) {
    issues.push('Missing H1 heading');
  } else if (h1Count > 1) {
    issues.push(`Multiple H1 headings found (${h1Count})`);
  }
  
  if (h2Count === 0) {
    issues.push('No H2 headings found');
  }
  
  return issues;
}

function getHeadingStructureQuality(h1Count: number, h2Count: number, h3Count: number): string {
  if (h1Count === 1 && h2Count >= 2 && h3Count >= 1) return 'Excellent';
  if (h1Count === 1 && h2Count >= 1) return 'Good';
  if (h1Count === 1) return 'Fair';
  return 'Poor';
}

function calculateImagesScore(totalImages: number, imagesWithAlt: number): number {
  if (totalImages === 0) return 100; // No images is not a problem
  
  const altTextPercentage = (imagesWithAlt / totalImages) * 100;
  return Math.round(altTextPercentage);
}

function getImageIssues(totalImages: number, imagesWithAlt: number): string[] {
  const issues: string[] = [];
  
  if (totalImages > 0 && imagesWithAlt < totalImages) {
    issues.push(`${totalImages - imagesWithAlt} images missing alt text`);
  }
  
  return issues;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

function generateRecommendationsFromResult(result: SEOResult): string[] {
  const recommendations: string[] = [];
  
  // Add recommendations based on issues in each category
  Object.entries(result.categories).forEach(([category, data]) => {
    if (data.issues && Array.isArray(data.issues)) {
      data.issues.forEach(issue => {
        recommendations.push(issue);
      });
    }
  });
  
  // Add some general recommendations if score is below thresholds
  if (result.overallScore < 70) {
    recommendations.push('Improve overall SEO with targeted content optimization');
  }
  
  if (result.categories.metaTags.score < 80) {
    recommendations.push('Optimize meta tags for better search engine visibility');
  }
  
  if (result.categories.content.score < 80) {
    recommendations.push('Enhance content quality and keyword usage');
  }
  
  return recommendations;
}