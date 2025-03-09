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

// Mock data for development to avoid server-side dependencies
const getMockSEOResult = (url: string, depth: AnalysisDepth): SEOResult => {
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

export async function analyzeSEO(url: string, depth: AnalysisDepth = 'standard'): Promise<SEOResult> {
  // Use mock data in development to avoid issues with puppeteer
  if (process.env.NODE_ENV !== 'production' && process.env.USE_MOCK_SEO === 'true') {
    console.log('Using mock SEO data for development');
    // Simulate a delay to mimic the real analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockSEOResult(url, depth);
  }

  let browser;
  let page;
  
  try {
    // Try standard puppeteer - make sure to run npm install puppeteer 
    // (not puppeteer-core) to have Chromium downloaded automatically
    try {
      // Attempt to use puppeteer directly (which has bundled Chromium)
      const puppeteerStandard = require('puppeteer');
      console.log('Using standard Puppeteer with bundled Chromium');
      browser = await puppeteerStandard.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } catch (error) {
      console.log('Standard Puppeteer not available, trying with local Chrome installation');
      
      // Look for a local Chrome installation
      let chromePath = null;
      
      if (process.platform === 'win32') {
        // Windows
        const possiblePaths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
        ];
        
        for (const path of possiblePaths) {
          try {
            if (fs.existsSync(path)) {
              chromePath = path;
              break;
            }
          } catch (e) {}
        }
      } else if (process.platform === 'darwin') {
        // macOS
        if (fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')) {
          chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        }
      } else {
        // Linux
        const possiblePaths = [
          '/usr/bin/google-chrome',
          '/usr/bin/chromium-browser',
          '/usr/bin/chromium'
        ];
        
        for (const path of possiblePaths) {
          try {
            if (fs.existsSync(path)) {
              chromePath = path;
              break;
            }
          } catch (e) {}
        }
      }
      
      if (chromePath) {
        console.log('Using local Chrome installation:', chromePath);
        browser = await puppeteer.launch({
          headless: true,
          executablePath: chromePath,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      } else {
        throw new Error('No Chrome installation found. Please install Chrome or run "npm install puppeteer" to download Chromium.');
      }
    }
    
    // Create a new page
    page = await browser.newPage();
    
    // Set viewport to desktop size
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });
    
    // Enable request interception for performance tracking
    await page.setRequestInterception(true);
    
    // Store resource timing for performance analysis
    const resourceTiming: Array<{
      url: string;
      type: string;
      status: number;
      size: number | string;
    }> = [];
    
    page.on('request', (request: puppeteer.HTTPRequest) => {
      request.continue();
    });
    
    page.on('response', (response: puppeteer.HTTPResponse) => {
      const request = response.request();
      const resourceType = request.resourceType();
      
      resourceTiming.push({
        url: request.url(),
        type: resourceType,
        status: response.status(),
        size: response.headers()['content-length'] || 0
      });
    });
    
    // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    
    // Wait for any remaining JavaScript to execute
    // Use a timeout as a more compatible alternative to waitForNetworkIdle
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get HTML content for analysis
    const htmlContent = await page.content();
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    
    // Run all analyses in parallel for efficiency
    const [
      metaTags,
      headings,
      contentAnalysis,
      images,
      performance,
      links,
      security,
      mobileOptimization,
      accessibility,
      structuredData
    ] = await Promise.all([
      analyzeMetaTags(document, page),
      analyzeHeadings(document),
      analyzeContent(document, page, depth),
      analyzeImages(document, page),
      analyzePerformance(page, resourceTiming),
      analyzeLinks(document, url, page, depth),
      analyzeSecurity(page, url),
      depth !== 'basic' ? analyzeMobileOptimization(page) : undefined,
      depth === 'deep' ? analyzeAccessibility(page) : undefined,
      depth !== 'basic' ? analyzeStructuredData(page) : undefined,
    ]);
    
    // Compile all results
    const result: SEOResult = {
      overallScore: 0,
      categories: {
        metaTags,
        headings,
        content: contentAnalysis,
        images,
        performance,
        links,
        security,
        mobileOptimization,
        accessibility,
        structuredData,
      },
      recommendations: [],
      analyzedUrl: url,
      timestamp: new Date().toISOString(),
      analysisDepth: depth,
    };
    
    // Calculate overall score
    result.overallScore = calculateOverallScore(result.categories);
    
    // Generate recommendations
    result.recommendations = generateRecommendations(result);
    
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Return error result
    return {
      overallScore: 0,
      categories: {
        metaTags: { 
          score: 0, 
          issues: [`Error: ${errorMessage}`],
          title: {
            exists: false,
            length: 0,
            optimal: false,
            value: '',
            includesSiteName: false
          },
          description: {
            exists: false,
            length: 0,
            optimal: false,
            value: ''
          },
          keywords: {
            exists: false,
            value: ''
          },
          canonical: {
            exists: false,
            value: ''
          },
          socialTags: {
            openGraph: false,
            twitterCard: false
          }
        },
        headings: { 
          score: 0, 
          issues: [],
          h1: { count: 0, optimal: false, values: [] },
          h2: { count: 0, optimal: false, values: [] },
          h3: { count: 0, optimal: false },
          structure: ''
        },
        content: { score: 0, issues: [], wordCount: 0, paragraphs: 0, readabilityScore: '', keywordDensity: '' },
        images: { score: 0, issues: [], total: 0, withAlt: 0, withoutAlt: 0, largeImages: 0 },
        performance: { score: 0, issues: [], loadTime: '', ttfb: '', tti: '', fcp: '', resources: { total: 0, byType: {}, totalSize: '' } },
        links: { score: 0, issues: [], internal: 0, external: 0, broken: 0 },
        security: { score: 0, issues: [], https: false },
      },
      recommendations: [`Analysis failed: ${errorMessage}`],
      analyzedUrl: url,
      timestamp: new Date().toISOString(),
      analysisDepth: depth,
    };
  } finally {
    // Clean up resources
    if (page) {
      await page.close();
    }
    
    if (browser) {
      await browser.close();
    }
  }
}