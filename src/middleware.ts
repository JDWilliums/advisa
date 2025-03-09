import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log API requests when debug mode is enabled
  if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' && request.nextUrl.pathname.startsWith('/api/')) {
    console.log('API Request:', {
      method: request.method,
      url: request.url,
      path: request.nextUrl.pathname,
    });
  }
  
  // Handle preflight requests for CORS
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  // Add CORS headers to API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }
  
  return NextResponse.next();
}

// Configure the paths that the middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 