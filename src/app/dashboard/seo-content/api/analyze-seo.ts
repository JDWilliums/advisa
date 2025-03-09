<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { AnalysisDepth, SEOResult } from '../types/seo';
import { launchBrowser, createPage } from './browser-launcher';
import { JSDOM } from 'jsdom';
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda'; // For serverless environments
import { JSDOM } from 'jsdom';
import { AnalysisDepth, SEOResult } from '../types/seo';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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

  // Use our browser launcher instead of directly importing puppeteer
  let browser;
  let page;
  
  try {
    // Launch browser using our launcher
    browser = await launchBrowser();
    
    // Create a configured page
    page = await createPage(browser);
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
export async function analyzeSEO(url: string, depth: AnalysisDepth = 'standard'): Promise<SEOResult> {
  // Set up browser with appropriate options for environment
  let browser;
  
  // For serverless environments (Vercel, AWS Lambda)
  if (process.env.NODE_ENV === 'production') {
    browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });
  } else {
    // For local development
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  let page;
  
  try {
    // Create a new page
    page = await browser.newPage();
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    
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
    
    page.on('request', request => {
      request.continue();
    });
    
    page.on('response', response => {
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    // Puppeteer v9 doesn't have waitForNetworkIdle, so we use a timeout instead
    await new Promise(resolve => setTimeout(resolve, 2000));
=======
    await page.waitForNetworkIdle();
>>>>>>> Stashed changes
=======
    await page.waitForNetworkIdle();
>>>>>>> Stashed changes
=======
    await page.waitForNetworkIdle();
>>>>>>> Stashed changes
    
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