import { MetaTagsAnalysis } from '../../types/seo';
import { Page } from 'puppeteer-core';

/**
 * Analyzes meta tags for SEO compliance
 * @param document DOM document object
 * @param page Puppeteer page object
 * @returns Analysis of meta tags
 */
export async function analyzeMetaTags(document: Document, page: Page): Promise<MetaTagsAnalysis> {
  // Default result with empty values
  const result: MetaTagsAnalysis = {
    score: 0,
    issues: [],
    title: {
      exists: false,
      length: 0,
      optimal: false,
      value: '',
    },
    description: {
      exists: false,
      length: 0,
      optimal: false,
      value: '',
    },
    keywords: {
      exists: false,
    },
    canonical: {
      exists: false,
    },
    socialTags: {
      openGraph: false,
      twitterCard: false,
    },
  };
  
  // Example analysis logic - you can expand this as needed
  try {
    // Check title
    const titleEl = document.querySelector('title');
    if (titleEl && titleEl.textContent) {
      result.title.exists = true;
      result.title.value = titleEl.textContent.trim();
      result.title.length = result.title.value.length;
      result.title.optimal = result.title.length >= 10 && result.title.length <= 60;
      
      if (!result.title.optimal) {
        result.issues.push(result.title.length < 10 
          ? 'Title tag is too short (should be 10-60 characters)'
          : 'Title tag is too long (should be 10-60 characters)');
      }
    } else {
      result.issues.push('Missing title tag');
    }
    
    // Check meta description
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl && descEl.getAttribute('content')) {
      result.description.exists = true;
      result.description.value = descEl.getAttribute('content') || '';
      result.description.length = result.description.value.length;
      result.description.optimal = result.description.length >= 50 && result.description.length <= 160;
      
      if (!result.description.optimal) {
        result.issues.push(result.description.length < 50 
          ? 'Meta description is too short (should be 50-160 characters)'
          : 'Meta description is too long (should be 50-160 characters)');
      }
    } else {
      result.issues.push('Missing meta description');
    }
    
    // Calculate score based on issues
    result.score = Math.max(0, 100 - (result.issues.length * 20));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.issues.push(`Error analyzing meta tags: ${errorMessage}`);
  }
  
  return result;
} 