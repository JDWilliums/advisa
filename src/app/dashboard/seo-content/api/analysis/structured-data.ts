import { StructuredDataAnalysis } from '../../types/seo';
import { Page } from 'puppeteer-core';

/**
 * Analyzes structured data for SEO
 * @param page Puppeteer page object
 * @returns Analysis of structured data
 */
export async function analyzeStructuredData(page: Page): Promise<StructuredDataAnalysis> {
  // Default result with empty values
  const result: StructuredDataAnalysis = {
    score: 0,
    issues: [],
    hasStructuredData: false,
    types: [],
    validStructure: false,
  };

  try {
    // Check for JSON-LD structured data
    const jsonLdResults = await page.evaluate(() => {
      // Look for JSON-LD script tags
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      
      if (jsonLdScripts.length === 0) {
        return {
          found: false,
          types: [],
          validJson: false,
        };
      }
      
      const types: string[] = [];
      let validJson = true;
      
      // Parse each JSON-LD script
      Array.from(jsonLdScripts).forEach(script => {
        try {
          const jsonContent = JSON.parse(script.textContent || '{}');
          
          // Extract schema type
          if (jsonContent['@type']) {
            types.push(jsonContent['@type']);
          } else if (jsonContent['@graph']) {
            // Handle graph structure
            jsonContent['@graph'].forEach((item: any) => {
              if (item['@type']) {
                types.push(item['@type']);
              }
            });
          }
        } catch (e) {
          validJson = false;
        }
      });
      
      return {
        found: true,
        types,
        validJson,
      };
    });
    
    // Check for Microdata
    const microdataResults = await page.evaluate(() => {
      // Look for elements with itemscope attribute
      const microdataElements = document.querySelectorAll('[itemscope]');
      
      if (microdataElements.length === 0) {
        return {
          found: false,
          types: [],
        };
      }
      
      const types: string[] = [];
      
      // Extract types from itemtype attribute
      microdataElements.forEach(el => {
        const itemtype = el.getAttribute('itemtype');
        if (itemtype) {
          // Extract the last part of the URL as the type
          const match = itemtype.match(/https?:\/\/schema.org\/(\w+)/);
          if (match && match[1]) {
            types.push(match[1]);
          } else {
            types.push(itemtype);
          }
        }
      });
      
      return {
        found: true,
        types,
      };
    });
    
    // Check for RDFa
    const rdfaResults = await page.evaluate(() => {
      // Look for elements with RDFa attributes
      const rdfaElements = document.querySelectorAll('[typeof]');
      
      if (rdfaElements.length === 0) {
        return {
          found: false,
          types: [],
        };
      }
      
      const types: string[] = [];
      
      // Extract types from typeof attribute
      rdfaElements.forEach(el => {
        const typeValue = el.getAttribute('typeof');
        if (typeValue) {
          types.push(typeValue);
        }
      });
      
      return {
        found: true,
        types,
      };
    });
    
    // Combine results
    result.hasStructuredData = jsonLdResults.found || microdataResults.found || rdfaResults.found;
    
    // Combine types from all formats
    const allTypes = [
      ...jsonLdResults.types,
      ...microdataResults.types,
      ...rdfaResults.types
    ];
    
    // Get unique types
    result.types = [...new Set(allTypes)];
    
    // Check validity
    result.validStructure = jsonLdResults.found ? jsonLdResults.validJson : true;
    
    // Generate issues
    if (!result.hasStructuredData) {
      result.issues.push('No structured data found (recommended for rich snippets in search results)');
    } else {
      if (!result.validStructure) {
        result.issues.push('Invalid JSON-LD structured data found (syntax errors)');
      }
      
      if (result.types.length === 0) {
        result.issues.push('Structured data found but no types specified');
      }
      
      // Common schema types that are valuable for SEO
      const recommendedTypes = [
        'Organization', 
        'LocalBusiness', 
        'Product', 
        'Article', 
        'BreadcrumbList',
        'Event',
        'Recipe',
        'Review',
        'FAQPage'
      ];
      
      const hasRecommendedType = result.types.some(type => 
        recommendedTypes.some(recType => type.includes(recType))
      );
      
      if (!hasRecommendedType && result.types.length > 0) {
        result.issues.push(`Consider adding common schema types (${recommendedTypes.join(', ')})`);
      }
    }
    
    // Calculate score
    if (!result.hasStructuredData) {
      result.score = 0;
    } else {
      let score = 60; // Base score for having structured data
      
      // Add points for valid structure
      score += result.validStructure ? 20 : 0;
      
      // Add points for having types
      score += result.types.length > 0 ? 20 : 0;
      
      result.score = score;
    }
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.issues.push(`Error analyzing structured data: ${errorMessage}`);
  }

  return result;
} 