import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    // Get the URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const apiKey = process.env.NEXT_PUBLIC_SERPAPI_KEY;
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }
    
    // Make the request to SerpAPI
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: apiKey,
        engine: 'google',
        num: 10
      }
    });
    
    // Return the response data
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error proxying SerpAPI request:', error);
    return NextResponse.json({ error: 'Failed to fetch data from SerpAPI' }, { status: 500 });
  }
} 