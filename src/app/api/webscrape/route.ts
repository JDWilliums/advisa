import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  try {
    // Get the URL parameter
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }
    
    // Make the request to the website
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000 // 10 seconds timeout
    });
    
    // Parse HTML
    const $ = cheerio.load(response.data);
    
    // Extract company information
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDescription = $('meta[property="og:description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    
    // Extract company name from title or og:title
    let name = ogTitle || title;
    // Clean up name (remove common suffixes like "- Home", "| Official Site", etc.)
    name = name.replace(/\s*[-|]\s*.*$/, '').trim();
    
    // Extract social media links
    const socialLinks: string[] = [];
    $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="instagram.com"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) socialLinks.push(href);
    });
    
    // Try to extract company size information
    let employeeCount = '';
    let companySize = '';
    
    // Look for employee count in text
    const employeeRegex = /(\d+(?:,\d+)?(?:\s*-\s*\d+(?:,\d+)?)?)\s*(?:employees|staff|team members|people)/i;
    const bodyText = $('body').text();
    const employeeMatch = bodyText.match(employeeRegex);
    if (employeeMatch) {
      employeeCount = employeeMatch[1];
      
      // Categorize company size
      const numEmployees = parseInt(employeeCount.replace(/,/g, ''));
      if (numEmployees < 10) {
        companySize = 'Micro';
      } else if (numEmployees < 50) {
        companySize = 'Small';
      } else if (numEmployees < 250) {
        companySize = 'Medium';
      } else {
        companySize = 'Large';
      }
    }
    
    // Look for LinkedIn data which often has employee count
    const linkedInLink = $('a[href*="linkedin.com"]').attr('href') || '';
    
    // Return the scraped data
    return NextResponse.json({
      name,
      website: url,
      description: ogDescription || metaDescription,
      logo: ogImage,
      socialLinks: [...new Set(socialLinks)], // Remove duplicates
      employeeCount,
      companySize,
      linkedInProfile: linkedInLink
    });
  } catch (error) {
    console.error('Error scraping website:', error);
    return NextResponse.json({ 
      error: 'Failed to scrape website',
      website: new URL(request.url).searchParams.get('url') || ''
    }, { status: 500 });
  }
} 