import { MobileOptimizationAnalysis } from '../../types/seo';
import { Page } from 'puppeteer-core';

/**
 * Analyzes mobile optimization for SEO
 * @param page Puppeteer page object
 * @returns Analysis of mobile optimization
 */
export async function analyzeMobileOptimization(page: Page): Promise<MobileOptimizationAnalysis> {
  // Default result with empty values
  const result: MobileOptimizationAnalysis = {
    score: 0,
    issues: [],
    viewportMeta: false,
    responsiveDesign: false,
    touchTargets: false,
    fontSizes: false,
    tapTargetResults: {
      passed: false,
      tooSmall: 0
    }
  };

  try {
    // Check viewport meta tag
    const hasViewportMeta = await page.evaluate(() => {
      const viewport = document.querySelector('meta[name="viewport"]');
      return !!viewport && !!viewport.getAttribute('content');
    });
    
    result.viewportMeta = hasViewportMeta;
    
    if (!result.viewportMeta) {
      result.issues.push('Missing or invalid viewport meta tag (required for mobile optimization)');
    }
    
    // Check responsiveness by simulating different screen sizes
    const responsiveResults = await page.evaluate(() => {
      const originalWidth = window.innerWidth;
      const originalHeight = window.innerHeight;
      
      // Test how elements respond to resizing
      // This is a simplified check for demo purposes
      const checkOverflow = () => {
        const body = document.body;
        const html = document.documentElement;
        
        return {
          horizontalOverflow: body.scrollWidth > window.innerWidth,
          verticalOverflow: body.scrollHeight > window.innerHeight,
          horizontalScroll: body.scrollWidth > html.clientWidth,
        };
      };
      
      // Simulate mobile width (375px is iPhone X width)
      window.innerWidth = 375;
      
      // Check for horizontal overflow
      const mobileResults = checkOverflow();
      
      // Restore original dimensions
      window.innerWidth = originalWidth;
      window.innerHeight = originalHeight;
      
      return {
        hasMobileOverflow: mobileResults.horizontalOverflow || mobileResults.horizontalScroll,
      };
    });
    
    result.responsiveDesign = !responsiveResults.hasMobileOverflow;
    
    if (!result.responsiveDesign) {
      result.issues.push('Page content overflows on mobile screens (not fully responsive)');
    }
    
    // Check for adequate touch targets
    const touchTargetResults = await page.evaluate(() => {
      const minimumTouchSize = 48; // 48px is Google's recommended minimum touch target size
      const interactableElements = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"]'));
      
      let tooSmallTargets = 0;
      
      interactableElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        if (width < minimumTouchSize || height < minimumTouchSize) {
          tooSmallTargets++;
        }
      });
      
      return {
        totalInteractable: interactableElements.length,
        tooSmallTargets,
      };
    });
    
    // Check if at least 90% of touch targets are adequate size
    const touchTargetRatio = touchTargetResults.totalInteractable > 0 
      ? (touchTargetResults.totalInteractable - touchTargetResults.tooSmallTargets) / touchTargetResults.totalInteractable 
      : 1;
    
    result.touchTargets = touchTargetRatio >= 0.9;
    result.tapTargetResults = {
      passed: result.touchTargets,
      tooSmall: touchTargetResults.tooSmallTargets
    };
    
    if (!result.touchTargets) {
      result.issues.push(`${touchTargetResults.tooSmallTargets} tap targets are too small for mobile users (should be at least 48x48px)`);
    }
    
    // Check font sizes for readability
    const fontSizeResults = await page.evaluate(() => {
      const minimumReadableSize = 12; // 12px is minimum readable text size
      const textElements = Array.from(document.querySelectorAll('p, span, div, li, h1, h2, h3, h4, h5, h6, button, a'));
      
      let tooSmallText = 0;
      
      textElements.forEach(el => {
        const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
        const hasText = el.textContent && el.textContent.trim().length > 0;
        if (fontSize < minimumReadableSize && hasText) {
          tooSmallText++;
        }
      });
      
      return {
        totalTextElements: textElements.length,
        tooSmallText,
      };
    });
    
    // Check if at least 95% of text is readable
    const fontSizeRatio = fontSizeResults.totalTextElements > 0 
      ? (fontSizeResults.totalTextElements - fontSizeResults.tooSmallText) / fontSizeResults.totalTextElements 
      : 1;
    
    result.fontSizes = fontSizeRatio >= 0.95;
    
    if (!result.fontSizes) {
      result.issues.push(`${fontSizeResults.tooSmallText} text elements have font size smaller than 12px (may be difficult to read on mobile)`);
    }
    
    // Calculate score based on checks
    let score = 0;
    score += result.viewportMeta ? 25 : 0;
    score += result.responsiveDesign ? 25 : 0;
    score += result.touchTargets ? 25 : 0;
    score += result.fontSizes ? 25 : 0;
    
    result.score = score;
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.issues.push(`Error analyzing mobile optimization: ${errorMessage}`);
  }

  return result;
} 