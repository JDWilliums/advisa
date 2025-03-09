import { ContentAnalysis, AnalysisDepth } from '../../types/seo';
import { Page } from 'puppeteer-core';

/**
 * Analyzes content for SEO compliance
 * @param document DOM document object
 * @param page Puppeteer page object
 * @param depth Analysis depth level
 * @returns Analysis of content
 */
export async function analyzeContent(
  document: Document, 
  page: Page, 
  depth: AnalysisDepth = 'standard'
): Promise<ContentAnalysis> {
  // Default result with empty values
  const result: ContentAnalysis = {
    score: 0,
    issues: [],
    wordCount: 0,
    paragraphs: 0,
    readabilityScore: 'medium',
    keywordDensity: '0%',
    sentenceCount: 0,
    avgSentenceLength: 0,
    avgParagraphLength: 0,
  };

  try {
    // Get all content text
    let bodyContent = '';
    
    // Extract text from paragraph elements
    const paragraphElements = document.querySelectorAll('p');
    result.paragraphs = paragraphElements.length;
    
    paragraphElements.forEach(p => {
      if (p.textContent) {
        bodyContent += p.textContent + ' ';
      }
    });

    // Basic content extraction from main content areas
    const contentAreas = document.querySelectorAll('article, main, .content, #content, .post, .entry');
    contentAreas.forEach(area => {
      if (area.textContent) {
        bodyContent += area.textContent + ' ';
      }
    });

    // Clean up the text
    bodyContent = bodyContent.replace(/\s+/g, ' ').trim();
    
    // Calculate word count
    const words = bodyContent.split(/\s+/).filter(word => word.length > 0);
    result.wordCount = words.length;

    // Calculate sentence count (basic approximation)
    const sentences = bodyContent.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    result.sentenceCount = sentences.length;
    
    // Calculate average sentence length
    result.avgSentenceLength = result.sentenceCount > 0 
      ? Math.round(result.wordCount / result.sentenceCount) 
      : 0;
    
    // Calculate average paragraph length
    result.avgParagraphLength = result.paragraphs > 0 
      ? Math.round(result.wordCount / result.paragraphs) 
      : 0;

    // Evaluate content metrics
    if (result.wordCount < 300) {
      result.issues.push('Content is too thin (less than 300 words)');
    }
    
    if (result.paragraphs < 3) {
      result.issues.push('Too few paragraphs (less than 3)');
    }
    
    if (result.avgParagraphLength > 150) {
      result.issues.push('Paragraphs are too long (aim for less than 150 words per paragraph)');
    }
    
    if (result.avgSentenceLength > 25) {
      result.issues.push('Sentences are too long (aim for less than 25 words per sentence)');
    }
    
    // Basic readability assessment
    if (result.avgSentenceLength > 20) {
      result.readabilityScore = 'difficult';
    } else if (result.avgSentenceLength < 12) {
      result.readabilityScore = 'easy';
    } else {
      result.readabilityScore = 'medium';
    }
    
    // For deep analysis, perform additional checks
    if (depth === 'deep') {
      // Keyword extraction and analysis could be implemented here
      // This is a simplified version
      
      // Extract potential keywords (common words/phrases)
      const wordFrequency: Record<string, number> = {};
      words.forEach(word => {
        const normalizedWord = word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
        if (normalizedWord.length > 3) {
          wordFrequency[normalizedWord] = (wordFrequency[normalizedWord] || 0) + 1;
        }
      });
      
      // Find the most common word (potential keyword)
      let topKeyword = '';
      let topFrequency = 0;
      
      Object.entries(wordFrequency).forEach(([word, frequency]) => {
        if (frequency > topFrequency) {
          topKeyword = word;
          topFrequency = frequency;
        }
      });
      
      // Calculate keyword density
      if (topKeyword && result.wordCount > 0) {
        const density = (topFrequency / result.wordCount) * 100;
        result.keywordDensity = `${density.toFixed(1)}%`;
        
        if (density > 5) {
          result.issues.push('Potential keyword stuffing detected (density > 5%)');
        } else if (density < 0.5) {
          result.issues.push('Main keyword density may be too low (< 0.5%)');
        }
      }
    }

    // Calculate score based on issues
    result.score = Math.max(0, 100 - (result.issues.length * 15));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.issues.push(`Error analyzing content: ${errorMessage}`);
  }

  return result;
} 