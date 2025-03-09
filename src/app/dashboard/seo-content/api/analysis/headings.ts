import { HeadingsAnalysis } from '../../types/seo';

/**
 * Analyzes heading structure for SEO compliance
 * @param document DOM document object
 * @returns Analysis of headings
 */
export async function analyzeHeadings(document: Document): Promise<HeadingsAnalysis> {
  // Default result with empty values
  const result: HeadingsAnalysis = {
    score: 0,
    issues: [],
    h1: {
      count: 0,
      optimal: false,
      values: [],
    },
    h2: {
      count: 0,
      optimal: false,
      values: [],
    },
    h3: {
      count: 0,
      optimal: false,
    },
    h4: {
      count: 0,
    },
    h5: {
      count: 0,
    },
    h6: {
      count: 0,
    },
    structure: 'correct',
  };

  try {
    // Get all headings
    const h1Elements = document.querySelectorAll('h1');
    const h2Elements = document.querySelectorAll('h2');
    const h3Elements = document.querySelectorAll('h3');
    const h4Elements = document.querySelectorAll('h4');
    const h5Elements = document.querySelectorAll('h5');
    const h6Elements = document.querySelectorAll('h6');

    // Count headings
    result.h1.count = h1Elements.length;
    result.h2.count = h2Elements.length;
    result.h3.count = h3Elements.length;
    if (result.h4) result.h4.count = h4Elements.length;
    if (result.h5) result.h5.count = h5Elements.length;
    if (result.h6) result.h6.count = h6Elements.length;

    // Store H1 and H2 values for content analysis
    h1Elements.forEach(el => {
      if (el.textContent) {
        result.h1.values.push(el.textContent.trim());
      }
    });
    
    h2Elements.forEach(el => {
      if (el.textContent) {
        result.h2.values.push(el.textContent.trim());
      }
    });

    // Check H1 usage
    if (result.h1.count === 0) {
      result.issues.push('Missing H1 heading');
      result.h1.optimal = false;
    } else if (result.h1.count > 1) {
      result.issues.push('Multiple H1 headings found (recommended: one H1 per page)');
      result.h1.optimal = false;
    } else {
      result.h1.optimal = true;
    }

    // Check H2 usage
    if (result.h2.count === 0) {
      result.issues.push('No H2 headings found (recommended for content structure)');
      result.h2.optimal = false;
    } else {
      result.h2.optimal = true;
    }

    // Check H3 usage in relation to H2
    result.h3.optimal = result.h3.count === 0 || result.h2.count > 0;
    if (result.h3.count > 0 && result.h2.count === 0) {
      result.issues.push('H3 headings used without H2 headings (improper hierarchy)');
    }

    // Check heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let prevLevel = 0;
    let structureIssues = 0;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      
      // Check if heading level jumps by more than one
      if (prevLevel > 0 && level > prevLevel + 1) {
        structureIssues++;
      }
      
      prevLevel = level;
    });

    if (structureIssues > 0) {
      result.structure = 'improper';
      result.issues.push('Improper heading structure (headings should not skip levels)');
    }

    // Calculate score based on issues
    result.score = Math.max(0, 100 - (result.issues.length * 20));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.issues.push(`Error analyzing headings: ${errorMessage}`);
  }

  return result;
} 