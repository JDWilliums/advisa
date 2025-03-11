import { NextRequest, NextResponse } from 'next/server';
// Import the analyzer function dynamically to prevent client-side bundling issues
import { analyzeSEO } from '@/app/dashboard/seo-content/api/analyze-seo';
import { AnalysisDepth } from '@/app/dashboard/seo-content/types/seo';

// Save original environment variable for restoration
if (!process.env.ORIGINAL_FALLBACK_TO_MOCK) {
  process.env.ORIGINAL_FALLBACK_TO_MOCK = process.env.FALLBACK_TO_MOCK;
}

export const maxDuration = 60; // Set maximum execution time to 60 seconds
export const dynamic = 'force-dynamic'; // Ensure this route is never cached

export async function POST(request: NextRequest) {
  try {
    // Log environment for debugging
    console.log('API: SEO Analysis Environment', {
      NODE_ENV: process.env.NODE_ENV,
      FALLBACK_TO_MOCK: process.env.FALLBACK_TO_MOCK,
      BROWSERLESS_TOKEN_EXISTS: !!process.env.BROWSERLESS_TOKEN
    });
    
    // Parse request body
    const body = await request.json();
    const { url, depth = 'standard', forceMock = false } = body;
    
    // Check for force real data options in query params or headers
    const searchParams = request.nextUrl.searchParams;
    const noFallback = searchParams.get('noFallback') === 'true' || 
                      request.headers.get('x-force-real-data') === 'true';
    
    console.log('API: Request options:', {
      url,
      depth,
      forceMock,
      noFallback,
      forceRealData: request.headers.get('x-force-real-data')
    });
    
    // Validate input
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' }, 
        { status: 400 }
      );
    }

    // Validate depth parameter
    const validDepths: AnalysisDepth[] = ['basic', 'standard', 'deep'];
    if (depth && !validDepths.includes(depth as AnalysisDepth)) {
      return NextResponse.json(
        { error: 'Invalid depth parameter. Must be one of: basic, standard, deep' },
        { status: 400 }
      );
    }

    // For debugging - allow forcing mock data through query parameter
    if (forceMock) {
      console.log('API: Forcing mock data due to forceMock parameter');
      const { getMockSEOResult } = await import('@/app/dashboard/seo-content/api/analyze-seo');
      const mockResult = getMockSEOResult(url, depth as AnalysisDepth);
      mockResult.warning = 'Using forced mock data for debugging';
      return NextResponse.json(mockResult);
    }

    try {
      // Run SEO analysis with our improved browserless-compatible analyzer
      console.log(`API: Starting SEO analysis for ${url} with depth ${depth}`);
      
      // If noFallback is set, temporarily override FALLBACK_TO_MOCK
      if (noFallback) {
        console.log('API: Forcing real data (no fallback)');
        process.env.FALLBACK_TO_MOCK = 'false';
      }
      
      const result = await analyzeSEO(url, depth as AnalysisDepth);
      
      // Restore original FALLBACK_TO_MOCK setting if we changed it
      if (noFallback) {
        process.env.FALLBACK_TO_MOCK = process.env.ORIGINAL_FALLBACK_TO_MOCK || 'true';
      }
      
      // Check if we received mock data with a warning
      if (result.warning) {
        console.log(`API: SEO analysis returned with warning: ${result.warning}`);
        
        // Still return the data, but include a warning header
        return NextResponse.json(result, { 
          status: 200,
          headers: { 'X-SEO-Warning': 'Used fallback data due to error' } 
        });
      }
      
      console.log(`API: Successfully analyzed ${url}`);
      return NextResponse.json(result);
    } catch (browserError) {
      console.error('API: Browser error during SEO analysis:', browserError);
      
      if (process.env.FALLBACK_TO_MOCK === 'true') {
        // Import the mock function to get fallback data
        const { getMockSEOResult } = await import('@/app/dashboard/seo-content/api/analyze-seo');
        
        // Generate mock data with a warning
        const mockResult = getMockSEOResult(url, depth as AnalysisDepth);
        mockResult.warning = 'Analysis failed. This is simulated data.';
        
        // Return mock data with a 200 status but include warning headers
        return NextResponse.json(mockResult, {
          status: 200,
          headers: { 'X-SEO-Warning': 'Using mock data due to analysis failure' }
        });
      } else {
        // If no fallback is configured, return an error
        const errorMessage = browserError instanceof Error ? browserError.message : String(browserError);
        return NextResponse.json(
          { error: `SEO analysis failed: ${errorMessage}` },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('API: Error handling SEO analysis request:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 