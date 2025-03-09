import { ImagesAnalysis } from '../../types/seo';
import { Page } from 'puppeteer-core';

/**
 * Analyzes images for SEO compliance
 * @param document DOM document object
 * @param page Puppeteer page object
 * @returns Analysis of images
 */
export async function analyzeImages(document: Document, page: Page): Promise<ImagesAnalysis> {
  // Default result with empty values
  const result: ImagesAnalysis = {
    score: 0,
    issues: [],
    total: 0,
    withAlt: 0,
    withoutAlt: 0,
    largeImages: 0,
    avgSize: 0,
  };

  try {
    // Get all images
    const images = document.querySelectorAll('img');
    result.total = images.length;
    
    if (result.total === 0) {
      result.issues.push('No images found on the page');
      result.score = 50; // Neutral score for no images
      return result;
    }
    
    // Analyze alt attributes
    let totalImageSize = 0;
    const largeImageSizeThreshold = 100 * 1024; // 100KB
    
    // Evaluate each image
    await Promise.all(Array.from(images).map(async (img) => {
      // Check for alt text
      const hasAlt = img.hasAttribute('alt') && img.getAttribute('alt')?.trim() !== '';
      
      if (hasAlt) {
        result.withAlt++;
      } else {
        result.withoutAlt++;
      }
      
      // Get image size data
      const src = img.getAttribute('src');
      if (src) {
        try {
          // Use Puppeteer to get image size
          const imageSize = await page.evaluate((imgSrc) => {
            return new Promise<number>((resolve) => {
              const xhr = new XMLHttpRequest();
              xhr.open('HEAD', imgSrc, true);
              xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                    const size = xhr.getResponseHeader('Content-Length');
                    resolve(size ? parseInt(size, 10) : 0);
                  } else {
                    resolve(0);
                  }
                }
              };
              xhr.send(null);
            });
          }, src);
          
          if (imageSize > 0) {
            totalImageSize += imageSize;
            
            if (imageSize > largeImageSizeThreshold) {
              result.largeImages++;
            }
          }
        } catch (err) {
          // Silently fail for individual image analysis
        }
      }
    }));
    
    // Calculate average image size
    result.avgSize = result.total > 0 ? Math.round(totalImageSize / result.total) : 0;
    
    // Generate issues based on analysis
    if (result.withoutAlt > 0) {
      result.issues.push(`${result.withoutAlt} image(s) missing alt text`);
    }
    
    if (result.largeImages > 0) {
      result.issues.push(`${result.largeImages} image(s) are over 100KB and could be optimized`);
    }
    
    if (result.avgSize > 200 * 1024) { // 200KB average
      result.issues.push('Average image size is too large (over 200KB)');
    }
    
    // Calculate score based on alt text ratio and image size optimization
    const altTextScore = result.total > 0 ? (result.withAlt / result.total) * 100 : 0;
    const sizeScore = 100 - (result.largeImages / Math.max(1, result.total) * 100);
    
    result.score = Math.round((altTextScore * 0.7) + (sizeScore * 0.3));
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.issues.push(`Error analyzing images: ${errorMessage}`);
  }

  return result;
} 