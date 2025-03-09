import { NextRequest, NextResponse } from 'next/server';
// Import the analyzer function dynamically to prevent client-side bundling issues
import { analyzeSEO } from '@/app/dashboard/seo-content/api/analyze-seo';
import { AnalysisDepth } from '@/app/dashboard/seo-content/types/seo';

export const maxDuration = 60; // Set maximum execution time to 60 seconds
export const dynamic = 'force-dynamic'; // Ensure this route is never cached

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { url, depth = 'standard' } = body;
    
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

    try {
      // Run SEO analysis with our improved browserless-compatible analyzer
      console.log(`API: Starting SEO analysis for ${url} with depth ${depth}`);
      const result = await analyzeSEO(url, depth as AnalysisDepth);
      
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