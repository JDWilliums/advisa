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

    // Run SEO analysis
    const result = await analyzeSEO(url, depth as AnalysisDepth);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 