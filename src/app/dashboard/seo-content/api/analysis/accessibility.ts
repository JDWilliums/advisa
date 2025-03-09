import { AccessibilityAnalysis } from '../../types/seo';
import { Page } from 'puppeteer-core';

/**
 * Analyzes accessibility for SEO
 * @param page Puppeteer page object
 * @returns Analysis of accessibility
 */
export async function analyzeAccessibility(page: Page): Promise<AccessibilityAnalysis> {
  // Default result with empty values
  const result: AccessibilityAnalysis = {
    score: 0,
    issues: [],
    hasAriaLabels: false,
    imageAltTexts: false,
    contrastRatio: false,
    semanticElements: false,
    formLabels: false,
  };

  try {
    // Check for ARIA labels and roles
    const ariaResults = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll('button, a[href], input, select, textarea, [role]');
      let elementsWithoutProperLabels = 0;
      
      interactiveElements.forEach(el => {
        const hasAriaLabel = el.hasAttribute('aria-label') || 
                            el.hasAttribute('aria-labelledby') || 
                            el.hasAttribute('title');
        const hasTextContent = el.textContent && el.textContent.trim().length > 0;
        
        if (!hasAriaLabel && !hasTextContent) {
          elementsWithoutProperLabels++;
        }
      });
      
      return {
        total: interactiveElements.length,
        missing: elementsWithoutProperLabels
      };
    });
    
    const ariaRatio = ariaResults.total > 0 
      ? (ariaResults.total - ariaResults.missing) / ariaResults.total 
      : 1;
    
    result.hasAriaLabels = ariaRatio >= 0.9; // At least 90% have proper labels
    
    if (!result.hasAriaLabels) {
      result.issues.push(`${ariaResults.missing} interactive elements missing proper labels (ARIA or text))`);
    }
    
    // Check for image alt text
    const imageAltResults = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      let imagesWithoutAlt = 0;
      
      images.forEach(img => {
        if (!img.hasAttribute('alt') || img.getAttribute('alt')?.trim() === '') {
          imagesWithoutAlt++;
        }
      });
      
      return {
        total: images.length,
        missing: imagesWithoutAlt
      };
    });
    
    const altRatio = imageAltResults.total > 0 
      ? (imageAltResults.total - imageAltResults.missing) / imageAltResults.total 
      : 1;
    
    result.imageAltTexts = altRatio >= 0.9; // At least 90% have alt text
    
    if (!result.imageAltTexts) {
      result.issues.push(`${imageAltResults.missing} images missing alt text (required for screen readers)`);
    }
    
    // Check for contrast ratio (simplified)
    // In a real tool, this would be more comprehensive
    const contrastResults = await page.evaluate(() => {
      const getContrastRatio = (color1: string, color2: string) => {
        const luminance1 = getLuminance(color1);
        const luminance2 = getLuminance(color2);
        
        const brightest = Math.max(luminance1, luminance2);
        const darkest = Math.min(luminance1, luminance2);
        
        return (brightest + 0.05) / (darkest + 0.05);
      };
      
      const getLuminance = (color: string) => {
        // Convert hex to RGB
        let r: number, g: number, b: number;
        
        if (color.startsWith('#')) {
          const hex = color.slice(1);
          r = parseInt(hex.substring(0, 2), 16) / 255;
          g = parseInt(hex.substring(2, 4), 16) / 255;
          b = parseInt(hex.substring(4, 6), 16) / 255;
        } else if (color.startsWith('rgb')) {
          const match = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
          if (match) {
            r = parseInt(match[1], 10) / 255;
            g = parseInt(match[2], 10) / 255;
            b = parseInt(match[3], 10) / 255;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
        
        // Calculate luminance
        r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      
      // Sample text elements
      const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, li, label'));
      
      // Only check a sample to prevent performance issues
      const sampleSize = Math.min(textElements.length, 100);
      const sample = textElements.slice(0, sampleSize);
      
      let lowContrastCount = 0;
      
      sample.forEach(el => {
        const style = window.getComputedStyle(el);
        const textColor = style.color;
        const bgColor = style.backgroundColor;
        
        // Skip if background is transparent
        if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') {
          return;
        }
        
        const ratio = getContrastRatio(textColor, bgColor);
        
        // WCAG AA requires 4.5:1 for normal text
        if (ratio < 4.5) {
          lowContrastCount++;
        }
      });
      
      return {
        checked: sample.length,
        lowContrast: lowContrastCount
      };
    });
    
    const contrastRatio = contrastResults.checked > 0 
      ? (contrastResults.checked - contrastResults.lowContrast) / contrastResults.checked 
      : 1;
    
    result.contrastRatio = contrastRatio >= 0.85; // At least 85% have good contrast
    
    if (!result.contrastRatio && contrastResults.checked > 0) {
      result.issues.push(`${contrastResults.lowContrast} text elements have insufficient contrast ratio (should be at least 4.5:1)`);
    }
    
    // Check for semantic HTML
    const semanticResults = await page.evaluate(() => {
      const hasSemantic = {
        header: !!document.querySelector('header'),
        nav: !!document.querySelector('nav'),
        main: !!document.querySelector('main'),
        footer: !!document.querySelector('footer'),
        article: !!document.querySelector('article'),
        section: !!document.querySelector('section'),
      };
      
      const semanticScore = Object.values(hasSemantic).filter(Boolean).length;
      
      return {
        score: semanticScore,
        hasSemantic
      };
    });
    
    result.semanticElements = semanticResults.score >= 3; // At least 3 semantic elements
    
    if (!result.semanticElements) {
      const missingSemantic = Object.entries(semanticResults.hasSemantic)
        .filter(([_, has]) => !has)
        .map(([tag]) => tag)
        .join(', ');
      
      result.issues.push(`Missing semantic HTML elements: ${missingSemantic} (improves SEO and accessibility)`);
    }
    
    // Check for form labels
    const formLabelResults = await page.evaluate(() => {
      const formInputs = document.querySelectorAll('input, textarea, select');
      let inputsWithoutLabels = 0;
      
      formInputs.forEach(input => {
        const id = input.getAttribute('id');
        const hasExplicitLabel = id && document.querySelector(`label[for="${id}"]`);
        const isWrapped = input.closest('label') !== null;
        const hasAriaLabel = input.hasAttribute('aria-label');
        
        if (!hasExplicitLabel && !isWrapped && !hasAriaLabel) {
          inputsWithoutLabels++;
        }
      });
      
      return {
        total: formInputs.length,
        missing: inputsWithoutLabels
      };
    });
    
    const formLabelRatio = formLabelResults.total > 0 
      ? (formLabelResults.total - formLabelResults.missing) / formLabelResults.total 
      : 1;
    
    result.formLabels = formLabelRatio >= 0.95; // At least 95% have labels
    
    if (!result.formLabels && formLabelResults.total > 0) {
      result.issues.push(`${formLabelResults.missing} form inputs missing labels (required for accessibility)`);
    }
    
    // Calculate score based on individual checks
    let score = 0;
    score += result.hasAriaLabels ? 20 : 0;
    score += result.imageAltTexts ? 20 : 0;
    score += result.contrastRatio ? 20 : 0;
    score += result.semanticElements ? 20 : 0;
    score += result.formLabels ? 20 : 0;
    
    result.score = score;
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.issues.push(`Error analyzing accessibility: ${errorMessage}`);
  }

  return result;
} 