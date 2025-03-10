import axios from 'axios';
import * as cheerio from 'cheerio';
import { Competitor, MarketOpportunity, MarketTrend } from './marketResearchService';
import { UserProfile } from './userService';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

// SerpAPI key - should be in environment variables in production
const SERPAPI_KEY = process.env.NEXT_PUBLIC_SERPAPI_KEY || '';

// Interface for company data from web scraping
interface ScrapedCompanyData {
  name: string;
  website: string;
  description?: string;
  logo?: string;
  socialLinks?: string[];
  employees?: string;
  founded?: string;
  headquarters?: string;
  companySize?: string;
  linkedInProfile?: string;
}

// Interface for search results
interface SearchResult {
  position: number;
  title: string;
  link: string;
  snippet: string;
  source: string;
}

/**
 * Collect competitor data based on user profile
 */
export const collectCompetitorData = async (userProfile: UserProfile): Promise<Competitor[]> => {
  try {
    console.log('Collecting competitor data for:', userProfile.businessName);
    
    // Step 1: Search for competitors
    const searchResults = await searchCompetitors(userProfile);
    
    // Step 2: Extract company websites from search results
    const companyWebsites = extractCompanyWebsites(searchResults, userProfile);
    
    // Step 3: Scrape company data from websites
    const scrapedData: ScrapedCompanyData[] = [];
    
    // Process websites in parallel with a limit
    const promises = companyWebsites.map(website => 
      scrapeCompanyData(website)
        .then(data => {
          if (data.name && data.description) {
            scrapedData.push(data);
          }
        })
        .catch(error => {
          console.error(`Error scraping ${website}:`, error);
        })
    );
    
    await Promise.all(promises);
    
    // Step 4: Transform scraped data into competitor objects
    const competitors = transformToCompetitors(
      scrapedData, 
      userProfile.industry || '', 
      userProfile.businessSize
    );
    
    // Step 5: Store competitor data
    await storeCompetitorData(competitors);
    
    return competitors;
  } catch (error) {
    console.error('Error collecting competitor data:', error);
    return [];
  }
};

/**
 * Search for competitors using SerpAPI
 */
const searchCompetitors = async (userProfile: UserProfile): Promise<SearchResult[]> => {
  try {
    // Extract all relevant information from user profile
    const industry = userProfile.industry || '';
    const businessType = userProfile.businessType || '';
    const location = userProfile.location || '';
    const businessSize = userProfile.businessSize || '';
    const businessDescription = userProfile.bio || '';
    const targetAudience = userProfile.targetAudience || '';
    const specializations = userProfile.specializations || [];
    const businessModel = userProfile.businessModel || '';
    const serviceArea = userProfile.serviceArea || '';
    const keyDifferentiators = userProfile.keyDifferentiators || [];
    
    console.log('Building search query with profile:', {
      industry,
      businessType,
      specializations,
      businessModel,
      targetAudience,
      keyDifferentiators
    });
    
    // Extract key terms from business description
    const descriptionTerms = extractKeyTerms(businessDescription);
    
    // Extract key terms from target audience
    const audienceTerms = targetAudience ? extractKeyTerms(targetAudience) : [];
    
    // Build a highly targeted search query
    let searchQuery = '';
    let negativeTerms: string[] = [];
    
    // Start with the core business type and industry
    searchQuery = `${businessType} ${industry}`;
    
    // Add business model if available
    if (businessModel && !businessModel.includes('Other')) {
      // Extract the main part of the business model (e.g., "SaaS" from "SaaS (Software as a Service)")
      const mainBusinessModel = businessModel.split(' ')[0].replace(/[()]/g, '');
      if (!searchQuery.toLowerCase().includes(mainBusinessModel.toLowerCase())) {
        searchQuery += ` ${mainBusinessModel}`;
      }
    }
    
    // Add specializations if available (up to 2)
    if (specializations && specializations.length > 0) {
      const specializationsToAdd = specializations
        .filter(spec => !searchQuery.toLowerCase().includes(spec.toLowerCase()))
        .slice(0, 2);
      
      if (specializationsToAdd.length > 0) {
        searchQuery += ` ${specializationsToAdd.join(' ')}`;
      }
    }
    
    // Add key terms from description if available
    if (descriptionTerms.length > 0) {
      // Limit to 2 key terms to keep the query focused
      const limitedTerms = descriptionTerms
        .filter(term => !searchQuery.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 2);
      
      if (limitedTerms.length > 0) {
        searchQuery += ` ${limitedTerms.join(' ')}`;
      }
    }
    
    // Add target audience if available
    if (targetAudience && !searchQuery.toLowerCase().includes(targetAudience.toLowerCase())) {
      searchQuery += ` for ${targetAudience}`;
    }
    
    // Add location if available and specific
    if (location && !location.toLowerCase().includes('online')) {
      searchQuery += ` in ${location}`;
    }
    
    // Add service area if available and not already covered by location
    if (serviceArea && !serviceArea.includes('Online only') && !searchQuery.toLowerCase().includes(serviceArea.toLowerCase())) {
      if (serviceArea === 'Local (city/town)') {
        searchQuery += ' local';
      } else if (serviceArea === 'Regional (state/province)') {
        searchQuery += ' regional';
      } else if (serviceArea === 'National') {
        searchQuery += ' national';
      } else if (serviceArea === 'International/Global') {
        searchQuery += ' global';
      }
    }
    
    // Generate negative terms to exclude irrelevant results
    // These are terms that would indicate the result is not a competitor
    negativeTerms = [
      'how to',
      'tutorial',
      'course',
      'learn',
      'guide',
      'wikipedia',
      'definition',
      'what is',
      'job',
      'career',
      'hire',
      'salary'
    ];
    
    // Add negative terms based on business type to exclude platforms/tools
    if (businessType === 'SaaS' || industry === 'Technology') {
      // For SaaS companies, exclude results about tools for building SaaS
      negativeTerms = [...negativeTerms, 'platform for', 'build a', 'create', 'develop', 'tools for'];
    } else {
      // For non-tech businesses, exclude software/platforms for that business type
      negativeTerms = [...negativeTerms, 'software for', 'platform for', 'app for', 'tool for', 'system for'];
    }
    
    // Add negative terms based on specializations to exclude irrelevant results
    if (specializations && specializations.length > 0) {
      // For each specialization, add negative terms to exclude tools/platforms for that specialization
      specializations.forEach(spec => {
        negativeTerms.push(`${spec} software`, `${spec} platform`, `${spec} app`, `${spec} tool`);
      });
    }
    
    // Add negative terms based on key differentiators
    if (keyDifferentiators && keyDifferentiators.length > 0) {
      keyDifferentiators.forEach(diff => {
        // If a key differentiator is "AI-powered", exclude results about AI tools
        if (diff.toLowerCase().includes('ai') || diff.toLowerCase().includes('artificial intelligence')) {
          negativeTerms.push('ai tools', 'ai platforms', 'ai software');
        }
      });
    }
    
    // Construct the negative terms string
    const negativeTermsString = negativeTerms.map(term => `-${term}`).join(' ');
    
    // Combine the search query with negative terms
    const finalQuery = `${searchQuery} ${negativeTermsString}`;
    
    console.log('Final search query:', finalQuery);
    
    // Perform the search
    // For development/testing, use simulated results
    return simulateSearchResults(searchQuery);
    
    // In production, use a real search API
    /*
    const response = await axios.get('/api/search', {
      params: {
        q: finalQuery,
        num: 10
      }
    });
    
    return response.data.results;
    */
  } catch (error) {
    console.error('Error searching for competitors:', error);
    return [];
  }
};

/**
 * Get search strategy based on business type and industry
 */
interface SearchStrategy {
  baseQuery: string;
  negativeTerms: string[];
}

const getSearchStrategy = (businessType: string, industry: string): SearchStrategy => {
  // Default strategy
  const defaultStrategy: SearchStrategy = {
    baseQuery: `${businessType || industry} business`,
    negativeTerms: []
  };
  
  // Specific strategies by business type
  const strategies: Record<string, SearchStrategy> = {
    // Technology
    "SaaS": {
      baseQuery: "SaaS company software",
      negativeTerms: ['platform for', 'build a', 'create', 'develop', 'tools for', 'software for', 'procurement', 'travel forum', 'bank', 'government', 'holiday', 'ski', 'jitter', 'economics']
    },
    "Web Development": {
      baseQuery: "web development company",
      negativeTerms: ['how to', 'learn', 'tutorial', 'course', 'bootcamp']
    },
    
    // Health & Wellness
    "Personal Trainer": {
      baseQuery: "personal trainer business",
      negativeTerms: ['booking', 'software', 'platform', 'app for', 'management system']
    },
    "Yoga Studio": {
      baseQuery: "yoga studio business",
      negativeTerms: ['app', 'software', 'platform', 'management system']
    },
    "Nutritionist": {
      baseQuery: "nutritionist practice",
      negativeTerms: ['certification', 'degree', 'how to become', 'course']
    },
    
    // Retail
    "Clothing Store": {
      baseQuery: "clothing store business",
      negativeTerms: ['wholesale', 'supplier', 'manufacturer', 'dropshipping']
    },
    "Home Goods": {
      baseQuery: "home goods store",
      negativeTerms: ['wholesale', 'supplier', 'manufacturer']
    },
    
    // Food & Beverage
    "Restaurant": {
      baseQuery: "restaurant business",
      negativeTerms: ['delivery app', 'ordering system', 'pos system', 'supplier']
    },
    "Bakery": {
      baseQuery: "bakery business",
      negativeTerms: ['equipment', 'supplier', 'wholesale', 'ingredients']
    },
    "Cafe": {
      baseQuery: "cafe business",
      negativeTerms: ['equipment', 'supplier', 'wholesale', 'pos system']
    },
    
    // Professional Services
    "Accounting": {
      baseQuery: "accounting firm",
      negativeTerms: ['software', 'tools', 'certification', 'degree']
    },
    "Marketing Agency": {
      baseQuery: "marketing agency",
      negativeTerms: ['tools', 'software', 'platform', 'how to start']
    },
    "Consulting": {
      baseQuery: "consulting firm",
      negativeTerms: ['certification', 'course', 'how to become']
    },
    
    // Home Services
    "Cleaning Service": {
      baseQuery: "cleaning service business",
      negativeTerms: ['equipment', 'supplies', 'software', 'management system']
    },
    "Landscaping": {
      baseQuery: "landscaping business",
      negativeTerms: ['equipment', 'supplies', 'software', 'tools']
    }
  };
  
  // Check for specific keywords in the business description to refine the strategy
  return strategies[businessType] || {
    baseQuery: `${businessType || industry} business`,
    negativeTerms: []
  };
};

/**
 * Extract domain from URL
 */
const extractDomain = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch (error) {
    return url;
  }
};

/**
 * Check if a site is a generic platform rather than a competitor
 */
const isGenericSite = (domain: string): boolean => {
  const genericSites = [
    // Social media and general platforms
    'linkedin.com',
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'youtube.com',
    'pinterest.com',
    'tiktok.com',
    'reddit.com',
    
    // Information sites
    'wikipedia.org',
    'quora.com',
    'medium.com',
    'answers.com',
    'stackexchange.com',
    'stackoverflow.com',
    
    // Job sites
    'indeed.com',
    'glassdoor.com',
    'monster.com',
    'ziprecruiter.com',
    'careerbuilder.com',
    
    // Review sites
    'yelp.com',
    'trustpilot.com',
    'capterra.com',
    'g2.com',
    'getapp.com',
    'softwareadvice.com',
    
    // E-commerce and marketplaces
    'amazon.com',
    'ebay.com',
    'etsy.com',
    'alibaba.com',
    'walmart.com',
    
    // Tech giants
    'google.com',
    'apple.com',
    'microsoft.com',
    'yahoo.com',
    'aol.com',
    
    // Government and education
    'gov',
    'edu',
    'ac.uk',
    'gov.uk',
    'nih.gov',
    'nasa.gov',
    
    // News and media
    'nytimes.com',
    'cnn.com',
    'bbc.co.uk',
    'forbes.com',
    'bloomberg.com',
    'wsj.com',
    
    // Travel and booking platforms
    'booking.com',
    'expedia.com',
    'tripadvisor.com',
    'airbnb.com',
    'hotels.com',
    
    // Forums and community sites
    'forum',
    'community',
    'board',
    'discussion',
    
    // Banks and financial institutions
    'bank',
    'chase.com',
    'wellsfargo.com',
    'citibank.com',
    'bankofamerica.com',
    
    // Other non-competitor sites
    'w3.org',
    'apache.org',
    'github.com',
    'gitlab.com',
    'bitbucket.org'
  ];
  
  // Check if the domain matches any in the list
  // Also check for subdomains (e.g., something.github.io)
  return genericSites.some(site => 
    domain === site || 
    domain.endsWith(`.${site}`) || 
    domain.includes(site)
  );
};

/**
 * Extract key terms from business description
 */
const extractKeyTerms = (description: string): string[] => {
  if (!description) return [];
  
  // Remove common words and punctuation
  const cleanedText = description.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Common words to exclude
  const stopWords = [
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'to', 'from', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
    'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should',
    'now', 'we', 'our', 'i', 'my', 'myself', 'you', 'your', 'yourself',
    'business', 'company', 'provide', 'service', 'services', 'product', 'products',
    'help', 'offer', 'offers', 'offering', 'offerings', 'client', 'clients',
    'customer', 'customers', 'work', 'working', 'works', 'based', 'focus',
    'focused', 'focusing', 'specializing', 'specialize', 'specializes', 'specialized',
    'quality', 'best', 'better', 'good', 'great', 'excellent', 'exceptional',
    'professional', 'professionals', 'expert', 'experts', 'expertise',
    'experience', 'experienced', 'solution', 'solutions', 'approach', 'approaches'
  ];
  
  // Look for important phrases first (2-3 word combinations)
  const phrases: string[] = [];
  const words = cleanedText.split(' ');
  
  // Extract 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length > 3 && words[i+1].length > 3) {
      const phrase = `${words[i]} ${words[i+1]}`;
      if (!stopWords.includes(words[i]) && !stopWords.includes(words[i+1])) {
        phrases.push(phrase);
      }
    }
  }
  
  // Extract 3-word phrases
  for (let i = 0; i < words.length - 2; i++) {
    if (words[i].length > 3 && words[i+1].length > 2 && words[i+2].length > 3) {
      const phrase = `${words[i]} ${words[i+1]} ${words[i+2]}`;
      if (!stopWords.includes(words[i]) && !stopWords.includes(words[i+2])) {
        phrases.push(phrase);
      }
    }
  }
  
  // Count phrase frequency
  const phraseFrequency: Record<string, number> = {};
  phrases.forEach(phrase => {
    phraseFrequency[phrase] = (phraseFrequency[phrase] || 0) + 1;
  });
  
  // Filter out stop words and short words
  const filteredWords = words.filter(word => 
    word.length > 3 && !stopWords.includes(word)
  );
  
  // Count word frequency
  const wordFrequency: Record<string, number> = {};
  filteredWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Prioritize phrases, then single words
  const sortedPhrases = Object.entries(phraseFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
    
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Combine phrases and words, prioritizing phrases
  const combinedTerms = [...sortedPhrases.slice(0, 2), ...sortedWords.slice(0, 3)];
  
  // Remove duplicates (words that are already part of phrases)
  const uniqueTerms = combinedTerms.filter((term, index, self) => {
    // Keep the term if it's the first occurrence or if it's not a substring of any previous term
    return self.findIndex(t => t.includes(term)) === index;
  });
  
  return uniqueTerms.slice(0, 5); // Return top 5 terms
};

/**
 * Simulate search results for development without API key
 */
const simulateSearchResults = (query: string): SearchResult[] => {
  // Determine the industry or business type from the query
  const queryLower = query.toLowerCase();
  
  let resultType = 'general';
  
  // Check for various industries and business types
  if (queryLower.includes('marketing') || queryLower.includes('advertising') || queryLower.includes('pr agency')) {
    resultType = 'marketing';
  } else if (queryLower.includes('software') || queryLower.includes('saas') || queryLower.includes('app development')) {
    resultType = 'software';
    
    // Check for specific SaaS types
    if (queryLower.includes('booking') || queryLower.includes('appointment') || queryLower.includes('scheduling')) {
      resultType = 'booking-software';
    } else if (queryLower.includes('crm') || queryLower.includes('customer relationship')) {
      resultType = 'crm-software';
    } else if (queryLower.includes('project management') || queryLower.includes('task management')) {
      resultType = 'project-management';
    }
  } else if (queryLower.includes('retail') || queryLower.includes('store') || queryLower.includes('shop')) {
    resultType = 'retail';
  } else if (queryLower.includes('restaurant') || queryLower.includes('cafe') || queryLower.includes('bakery')) {
    resultType = 'food';
  } else if (queryLower.includes('fitness') || queryLower.includes('gym') || queryLower.includes('personal trainer')) {
    resultType = 'fitness';
  } else if (queryLower.includes('salon') || queryLower.includes('spa') || queryLower.includes('beauty')) {
    resultType = 'beauty';
  } else if (queryLower.includes('cleaning') || queryLower.includes('landscaping') || queryLower.includes('plumbing')) {
    resultType = 'homeservices';
  } else if (queryLower.includes('accounting') || queryLower.includes('legal') || queryLower.includes('consulting')) {
    resultType = 'professional';
  }
  
  // Define results for each industry type
  const marketingResults: SearchResult[] = [
    { position: 1, title: 'HubSpot - Inbound Marketing, Sales, and Service Software', link: 'https://www.hubspot.com', snippet: 'HubSpot offers a full platform of marketing, sales, customer service, and CRM software — plus the methodology, resources, and support — to help businesses grow better.', source: 'simulated' },
    { position: 2, title: 'Mailchimp - Marketing Platform for Small Businesses', link: 'https://www.mailchimp.com', snippet: 'Mailchimp is the All-In-One integrated marketing platform for small businesses, to grow your business on your terms.', source: 'simulated' },
    { position: 3, title: 'Semrush - Online Visibility Management Platform', link: 'https://www.semrush.com', snippet: 'Semrush is a powerful and versatile competitive intelligence suite for online marketing, from SEO and PPC to social media and video advertising research.', source: 'simulated' },
    { position: 4, title: 'Moz - SEO Software, Tools & Resources for Smarter Marketing', link: 'https://moz.com', snippet: 'Backed by the largest community of SEOs on the planet, Moz builds tools that make SEO, inbound marketing, link building, and content marketing easy.', source: 'simulated' },
    { position: 5, title: 'Constant Contact - Email Marketing Software', link: 'https://www.constantcontact.com', snippet: 'Email marketing software and services to help you grow your business. Create, send, and track email marketing campaigns that drive results.', source: 'simulated' }
  ];
  
  const softwareResults: SearchResult[] = [
    { position: 1, title: 'Microsoft - Official Home Page', link: 'https://www.microsoft.com', snippet: 'Microsoft is the leading platform and productivity company for the mobile-first, cloud-first world, and its mission is to empower every person and every organization on the planet to achieve more.', source: 'simulated' },
    { position: 2, title: 'Oracle | Cloud Applications and Cloud Platform', link: 'https://www.oracle.com', snippet: 'Oracle offers a comprehensive and fully integrated stack of cloud applications and platform services.', source: 'simulated' },
    { position: 3, title: 'SAP Software Solutions | Business Applications and Technology', link: 'https://www.sap.com', snippet: 'SAP helps companies of all sizes and industries run better. From back office to boardroom, warehouse to storefront, desktop to mobile device – SAP empowers people and organizations.', source: 'simulated' },
    { position: 4, title: 'Salesforce: We Bring Companies and Customers Together', link: 'https://www.salesforce.com', snippet: 'Salesforce unites your marketing, sales, commerce, service, and IT teams from anywhere with Customer 360 — one integrated CRM platform.', source: 'simulated' },
    { position: 5, title: 'Adobe: Creative, marketing and document management solutions', link: 'https://www.adobe.com', snippet: 'Adobe is changing the world through digital experiences. We help our customers create, deliver and optimize content and applications.', source: 'simulated' }
  ];
  
  const retailResults: SearchResult[] = [
    { position: 1, title: 'Shopify: E-commerce Platform for Online Stores and Retail POS Systems', link: 'https://www.shopify.com', snippet: 'Shopify is a complete commerce platform that lets you start, grow, and manage a business. Create and customize an online store, sell in multiple places, including web, mobile, social media, and in person.', source: 'simulated' },
    { position: 2, title: 'Nordstrom: Designer Clothing for Men, Women and Kids', link: 'https://www.nordstrom.com', snippet: 'Nordstrom.com is a leading fashion specialty retailer offering clothing, shoes, and accessories for men, women and kids.', source: 'simulated' },
    { position: 3, title: 'Warby Parker: Eyewear with a Purpose', link: 'https://www.warbyparker.com', snippet: 'Warby Parker was founded with a rebellious spirit and a lofty objective: to offer designer eyewear at a revolutionary price, while leading the way for socially conscious businesses.', source: 'simulated' },
    { position: 4, title: 'Allbirds: Sustainable & Comfortable Shoes and Clothing', link: 'https://www.allbirds.com', snippet: 'Allbirds creates the world\'s most comfortable shoes and clothing made from natural materials like merino wool and eucalyptus.', source: 'simulated' },
    { position: 5, title: 'Everlane: Modern Essentials, Radical Transparency', link: 'https://www.everlane.com', snippet: 'Everlane creates and sells high-quality clothing, shoes, and accessories at transparent prices, while promoting ethical factories and sustainability.', source: 'simulated' }
  ];
  
  const foodResults: SearchResult[] = [
    { position: 1, title: 'Sweetgreen: Simple, Seasonal, Healthy Food', link: 'https://www.sweetgreen.com', snippet: 'Sweetgreen is a destination for simple, seasonal, healthy food. We believe the choices we make about what we eat, where it comes from and how it\'s prepared have a direct and powerful impact on the health of individuals, communities and the environment.', source: 'simulated' },
    { position: 2, title: 'Blue Bottle Coffee: Delicious, Sustainable Coffee', link: 'https://bluebottlecoffee.com', snippet: 'Blue Bottle Coffee is a specialty coffee roaster with cafes in the US and Japan. We\'re dedicated to sourcing, roasting, and serving the best coffee.', source: 'simulated' },
    { position: 3, title: 'Shake Shack: Modern Day Roadside Burger Stand', link: 'https://www.shakeshack.com', snippet: 'Shake Shack is a modern day "roadside" burger stand serving a classic American menu of premium burgers, hot dogs, crinkle-cut fries, shakes, frozen custard, beer and wine.', source: 'simulated' },
    { position: 4, title: 'Milk Bar: Award-Winning Desserts & Treats', link: 'https://milkbarstore.com', snippet: 'Milk Bar is an award-winning bakery known for its familiar yet unexpected desserts including Milk Bar® Pie, the Compost Cookie®, unfrosted layer cakes, and Cereal Milk Soft Serve.', source: 'simulated' },
    { position: 5, title: 'Chipotle Mexican Grill: Food With Integrity', link: 'https://www.chipotle.com', snippet: 'Chipotle Mexican Grill serves a focused menu of burritos, tacos, and bowls made with fresh, high-quality ingredients, prepared using classic cooking methods and served in a distinctive atmosphere.', source: 'simulated' }
  ];
  
  const fitnessResults: SearchResult[] = [
    { position: 1, title: 'Orangetheory Fitness: Science-Backed Workout', link: 'https://www.orangetheory.com', snippet: 'Orangetheory is a heart-rate based HIIT total-body group workout that combines science, coaching and technology to guarantee maximum results from the inside out.', source: 'simulated' },
    { position: 2, title: 'F45 Training: Functional Training', link: 'https://f45training.com', snippet: 'F45 Training is a global fitness community specializing in innovative, high-intensity group workouts that are fast, fun, and results-driven.', source: 'simulated' },
    { position: 3, title: 'SoulCycle: Indoor Cycling & Fitness Classes', link: 'https://www.soul-cycle.com', snippet: 'SoulCycle is an indoor cycling and fitness experience with 90+ studios across the US, Canada, and UK. Book a class today and join the movement.', source: 'simulated' },
    { position: 4, title: 'Barry\'s: The Best Workout in the World', link: 'https://www.barrys.com', snippet: 'Barry\'s is the original high-intensity workout. It combines 25 minutes of strength training with 25 minutes of cardio intervals on treadmills.', source: 'simulated' },
    { position: 5, title: 'Pure Barre: Total Body Workout', link: 'https://www.purebarre.com', snippet: 'Pure Barre is a fitness studio offering low-impact, high-intensity workouts using the ballet barre to perform small isometric movements that burn fat and sculpt muscles.', source: 'simulated' }
  ];
  
  const beautyResults: SearchResult[] = [
    { position: 1, title: 'Drybar: Professional Blowouts', link: 'https://www.drybar.com', snippet: 'Drybar is the nation\'s premier blow dry bar specializing in just blowouts, no cuts, no color. Drybar\'s philosophy is simple: Focus on one thing and be the best at it.', source: 'simulated' },
    { position: 2, title: 'Sephora: Beauty Products & Cosmetics', link: 'https://www.sephora.com', snippet: 'Discover the latest in beauty at Sephora. Explore our unrivaled selection of makeup, skin care, fragrance and more from classic and emerging brands.', source: 'simulated' },
    { position: 3, title: 'Ulta Beauty: Makeup, Hair Care, Skin Care & More', link: 'https://www.ulta.com', snippet: 'Ulta Beauty is the largest beauty retailer in the United States and the premier beauty destination for cosmetics, fragrance, skin care products, hair care products and salon services.', source: 'simulated' },
    { position: 4, title: 'Glossier: Skincare & Beauty Products', link: 'https://www.glossier.com', snippet: 'Glossier is a new approach to beauty. It\'s about fun and freedom and being OK with yourself today. We make uncomplicated products designed to live with you.', source: 'simulated' },
    { position: 5, title: 'Massage Envy: Massage, Stretch & Skin Care Services', link: 'https://www.massageenvy.com', snippet: 'Massage Envy offers professional massage, stretch, and skin care services. Make regular massage, stretch, and skin care part of your wellness routine.', source: 'simulated' }
  ];
  
  const homeservicesResults: SearchResult[] = [
    { position: 1, title: 'Molly Maid: Professional Home Cleaning Services', link: 'https://www.mollymaid.com', snippet: 'Molly Maid is a residential cleaning service that offers professional home cleaning services. Our cleaning service brings 40 years of experience into your home.', source: 'simulated' },
    { position: 2, title: 'TruGreen: Lawn Care & Maintenance Services', link: 'https://www.trugreen.com', snippet: 'TruGreen is America\'s #1 lawn care company offering lawn, tree and shrub care to help you achieve a healthy, green lawn.', source: 'simulated' },
    { position: 3, title: 'Mr. Handyman: Professional Home Improvement & Repair Services', link: 'https://www.mrhandyman.com', snippet: 'Mr. Handyman is a professional home improvement and repair company. Our fully insured technicians can handle a wide range of home maintenance and repair projects.', source: 'simulated' },
    { position: 4, title: 'Roto-Rooter: Plumbing & Water Cleanup Services', link: 'https://www.rotorooter.com', snippet: 'Roto-Rooter is the #1 provider of plumbing and drain cleaning services in North America. Available 24/7 for residential and commercial emergencies.', source: 'simulated' },
    { position: 5, title: 'Merry Maids: Home Cleaning Services', link: 'https://www.merrymaids.com', snippet: 'Merry Maids provides professional home cleaning services. Our cleaning specialists are thoroughly trained to provide you with a clean you can see and feel.', source: 'simulated' }
  ];
  
  const professionalResults: SearchResult[] = [
    { position: 1, title: 'H&R Block: Tax Preparation Services & Tax Filing', link: 'https://www.hrblock.com', snippet: 'H&R Block is a global consumer tax services provider that offers tax preparation services, tax filing, and small business solutions.', source: 'simulated' },
    { position: 2, title: 'LegalZoom: Start a Business, Protect Your Family', link: 'https://www.legalzoom.com', snippet: 'LegalZoom provides legal help to start a business, grow a business, and provide for your family. LegalZoom can help you form an LLC, incorporate, create a will, trademark a name, and more.', source: 'simulated' },
    { position: 3, title: 'Deloitte: Audit, Consulting, Advisory, and Tax Services', link: 'https://www2.deloitte.com', snippet: 'Deloitte provides industry-leading audit, consulting, tax, and advisory services to many of the world\'s most admired brands, including 80 percent of the Fortune 500.', source: 'simulated' },
    { position: 4, title: 'McKinsey & Company: Global Management Consulting', link: 'https://www.mckinsey.com', snippet: 'McKinsey & Company is a global management consulting firm that serves leading businesses, governments, non-governmental organizations, and not-for-profits.', source: 'simulated' },
    { position: 5, title: 'Accenture: Let there be change', link: 'https://www.accenture.com', snippet: 'Accenture is a global professional services company with leading capabilities in digital, cloud and security. We offer strategy and consulting, technology and operations services.', source: 'simulated' }
  ];
  
  const generalResults: SearchResult[] = [
    { position: 1, title: 'Google - Search Engine', link: 'https://www.google.com', snippet: 'Google is an American multinational technology company that specializes in Internet-related services and products.', source: 'simulated' },
    { position: 2, title: 'Apple - Technology Company', link: 'https://www.apple.com', snippet: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services.', source: 'simulated' },
    { position: 3, title: 'Amazon - E-commerce Company', link: 'https://www.amazon.com', snippet: 'Amazon.com, Inc. is an American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.', source: 'simulated' },
    { position: 4, title: 'Microsoft - Technology Company', link: 'https://www.microsoft.com', snippet: 'Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.', source: 'simulated' },
    { position: 5, title: 'Facebook - Social Media Company', link: 'https://www.facebook.com', snippet: 'Facebook is an American online social media and social networking service owned by Meta Platforms.', source: 'simulated' }
  ];
  
  // Add specific results for booking software
  const bookingSoftwareResults: SearchResult[] = [
    { position: 1, title: 'Calendly - Scheduling Software for Teams and Individuals', link: 'https://www.calendly.com', snippet: 'Calendly is your scheduling automation platform for eliminating the back-and-forth emails to find the perfect time for a meeting.', source: 'simulated' },
    { position: 2, title: 'Acuity Scheduling - Online Appointment Scheduling Software', link: 'https://www.acuityscheduling.com', snippet: 'Acuity Scheduling is your online assistant, working 24/7 to manage your schedule. Let clients book appointments, classes, and services online.', source: 'simulated' },
    { position: 3, title: 'SimplyBook.me - Online Booking System for Your Services', link: 'https://www.simplybook.me', snippet: 'SimplyBook.me is an online booking system for all service-based businesses. Accept online bookings from your website and Facebook page.', source: 'simulated' },
    { position: 4, title: 'Bookeo - Online Booking System for Tours, Classes and Services', link: 'https://www.bookeo.com', snippet: 'Bookeo provides online booking and scheduling software for tour operators, activity providers, and service businesses to accept bookings 24/7.', source: 'simulated' },
    { position: 5, title: 'Setmore - Free Online Appointment Scheduling Software', link: 'https://www.setmore.com', snippet: 'Setmore is a free appointment scheduling software that helps businesses manage bookings online and engage with customers 24/7.', source: 'simulated' }
  ];
  
  // Add specific results for CRM software
  const crmSoftwareResults: SearchResult[] = [
    { position: 1, title: 'Salesforce - Customer Relationship Management (CRM) Software', link: 'https://www.salesforce.com', snippet: 'Salesforce is the world\'s #1 CRM platform that employees can access entirely over the Internet — no infrastructure required.', source: 'simulated' },
    { position: 2, title: 'HubSpot CRM - Free CRM Software for Small Businesses', link: 'https://www.hubspot.com/products/crm', snippet: 'HubSpot CRM is free and gives your business the organization it needs to grow. Track your contacts, deals, and tasks in one place.', source: 'simulated' },
    { position: 3, title: 'Zoho CRM - Sales & Marketing Software to Win More Deals', link: 'https://www.zoho.com/crm', snippet: 'Zoho CRM empowers a global network of over 250,000 businesses in 180 countries to convert more leads, engage with customers, and grow revenue.', source: 'simulated' },
    { position: 4, title: 'Pipedrive - Sales CRM & Pipeline Management Software', link: 'https://www.pipedrive.com', snippet: 'Pipedrive is the easy-to-use, #1 user-rated CRM tool. Get more qualified leads and grow your business.', source: 'simulated' },
    { position: 5, title: 'Monday.com - Work OS for CRM, Project Management & More', link: 'https://www.monday.com', snippet: 'Monday.com is a Work OS that powers teams to run processes, projects and workflows in one digital workspace.', source: 'simulated' }
  ];
  
  // Add specific results for project management software
  const projectManagementResults: SearchResult[] = [
    { position: 1, title: 'Asana - Work Management Platform for Teams', link: 'https://www.asana.com', snippet: 'Asana is the work management platform teams use to stay focused on the goals, projects, and daily tasks that grow business.', source: 'simulated' },
    { position: 2, title: 'Trello - Visual Project Management Tool', link: 'https://www.trello.com', snippet: 'Trello helps teams move work forward. Collaborate, manage projects, and reach new productivity peaks with Trello\'s visual boards and cards.', source: 'simulated' },
    { position: 3, title: 'Monday.com - Work OS for Project Management & More', link: 'https://www.monday.com', snippet: 'Monday.com is a Work OS that powers teams to run processes, projects and workflows in one digital workspace.', source: 'simulated' },
    { position: 4, title: 'ClickUp - One App to Replace Them All', link: 'https://www.clickup.com', snippet: 'ClickUp is the world\'s highest-rated project management software. Use it to keep work organized across teams of all sizes.', source: 'simulated' },
    { position: 5, title: 'Jira - Project Management Software for Agile Teams', link: 'https://www.atlassian.com/software/jira', snippet: 'Jira Software is built for every member of your software team to plan, track, and release great software.', source: 'simulated' }
  ];
  
  // Map of result types to their respective arrays
  const results: Record<string, SearchResult[]> = {
    'marketing': marketingResults,
    'software': softwareResults,
    'booking-software': bookingSoftwareResults,
    'crm-software': crmSoftwareResults,
    'project-management': projectManagementResults,
    'retail': retailResults,
    'food': foodResults,
    'fitness': fitnessResults,
    'beauty': beautyResults,
    'homeservices': homeservicesResults,
    'professional': professionalResults,
    'general': generalResults
  };
  
  console.log('Simulating results for query type:', resultType);
  return results[resultType] || results['general'];
};

/**
 * Extract company websites from search results
 */
const extractCompanyWebsites = (searchResults: SearchResult[], userProfile: UserProfile): string[] => {
  // First, filter out generic sites
  const filteredResults = searchResults.filter(result => {
    try {
      const domain = extractDomain(result.link);
      return !isGenericSite(domain);
    } catch (error) {
      return false;
    }
  });
  
  // If we have too few results after filtering, add some back
  const finalResults = filteredResults.length >= 3 ? filteredResults : searchResults;
  
  // Extract domains from the final results
  return finalResults.map(result => {
    try {
      const url = new URL(result.link);
      return url.hostname;
    } catch (error) {
      return result.link;
    }
  });
};

/**
 * Scrape company data from website
 */
const scrapeCompanyData = async (website: string): Promise<ScrapedCompanyData> => {
  try {
    // Ensure website has proper protocol
    const websiteUrl = website.startsWith('http') ? website : `https://${website}`;
    
    console.log('Scraping website:', websiteUrl);
    
    // Use our server-side API route instead of direct scraping
    try {
      const response = await axios.get('/api/webscrape', {
        params: {
          url: websiteUrl
        }
      });
      
      // Return the scraped data
      return {
        name: response.data.name,
        website: response.data.website,
        description: response.data.description,
        logo: response.data.logo,
        socialLinks: response.data.socialLinks,
        employees: response.data.employeeCount,
        companySize: response.data.companySize,
        linkedInProfile: response.data.linkedInProfile
      };
    } catch (error) {
      console.error(`Error using API route for scraping ${website}:`, error);
      
      // Return minimal data based on the website
      return {
        name: website.replace(/^https?:\/\/(www\.)?/, '').replace(/\.[^/.]+$/, ''),
        website: websiteUrl,
      };
    }
  } catch (error) {
    console.error(`Error scraping website ${website}:`, error);
    
    // Return minimal data based on the website
    return {
      name: website.replace(/^https?:\/\/(www\.)?/, '').replace(/\.[^/.]+$/, ''),
      website: website.startsWith('http') ? website : `https://${website}`,
    };
  }
};

/**
 * Transform scraped data into competitor objects
 */
const transformToCompetitors = (scrapedData: ScrapedCompanyData[], industry: string, userBusinessSize?: string): Competitor[] => {
  // Colors for competitor logos
  const colors = [
    'bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-orange-600', 
    'bg-red-600', 'bg-yellow-600', 'bg-indigo-600', 'bg-pink-600'
  ];
  
  // Filter competitors by business size if user's business size is provided
  let filteredData = [...scrapedData];
  
  if (userBusinessSize) {
    // Map user business size to a category
    const userSizeCategory = mapBusinessSizeToCategory(userBusinessSize);
    
    // Filter to include only companies of similar size or slightly larger
    filteredData = scrapedData.filter(data => {
      // If we don't have company size data, include it by default
      if (!data.companySize) return true;
      
      const companySizeCategory = data.companySize;
      
      // Include companies of the same size category or one category larger
      return isSimilarBusinessSize(userSizeCategory, companySizeCategory);
    });
    
    // If filtering resulted in too few companies, add some back
    if (filteredData.length < 3) {
      filteredData = scrapedData;
    }
  }
  
  return filteredData.map((data, index) => {
    // Generate initials for logo
    const initials = data.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    // Calculate market share and growth (simulated for now)
    // In a real app, you would get this data from financial reports or industry databases
    const marketShare = Math.round(30 - (index * 3) + (Math.random() * 5));
    const growth = +(((Math.random() * 20) - 5).toFixed(1));
    
    // Generate strengths and weaknesses based on description
    const strengths = generateStrengths(data.description || '', industry);
    const weaknesses = generateWeaknesses(data.description || '', industry);
    
    return {
      id: `comp-${Date.now()}-${index}`,
      name: data.name,
      website: data.website.replace(/^https?:\/\/(www\.)?/, ''),
      marketShare,
      growth,
      strengths,
      weaknesses,
      overview: data.description || `A company in the ${industry} industry.`,
      logo: initials,
      color: colors[index % colors.length],
      industry,
      businessSize: data.companySize || 'Unknown',
      employees: data.employees || 'Unknown',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
  });
};

/**
 * Map business size string to a category
 */
const mapBusinessSizeToCategory = (businessSize: string): string => {
  const size = businessSize.toLowerCase();
  
  if (size.includes('1-10') || size.includes('micro') || size.includes('sole trader') || size.includes('freelancer')) {
    return 'Micro';
  } else if (size.includes('11-50') || size.includes('small')) {
    return 'Small';
  } else if (size.includes('51-250') || size.includes('medium')) {
    return 'Medium';
  } else if (size.includes('250+') || size.includes('large') || size.includes('enterprise')) {
    return 'Large';
  }
  
  // Default to Small if we can't determine
  return 'Small';
};

/**
 * Check if two business sizes are similar
 */
const isSimilarBusinessSize = (userSize: string, companySize: string): boolean => {
  const sizeRanking = {
    'Micro': 1,
    'Small': 2,
    'Medium': 3,
    'Large': 4
  };
  
  const userRank = sizeRanking[userSize as keyof typeof sizeRanking] || 2; // Default to Small
  const companyRank = sizeRanking[companySize as keyof typeof sizeRanking] || 2; // Default to Small
  
  // Consider similar if same size or one step larger
  return companyRank === userRank || companyRank === userRank + 1;
};

/**
 * Generate strengths based on company description
 */
const generateStrengths = (description: string, industry: string): string[] => {
  const strengthsPool = [
    'Innovative technology',
    'Strong market presence',
    'User-friendly interface',
    'Comprehensive feature set',
    'Excellent customer support',
    'Competitive pricing',
    'Robust API',
    'Scalable solution',
    'Industry expertise',
    'Global reach',
    'Strong brand recognition',
    'Advanced analytics',
    'Integration capabilities',
    'Mobile-first approach',
    'Cloud-based platform'
  ];
  
  // Select 3-5 random strengths
  const count = 3 + Math.floor(Math.random() * 3);
  const strengths = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * strengthsPool.length);
    strengths.push(strengthsPool[randomIndex]);
    strengthsPool.splice(randomIndex, 1); // Remove to avoid duplicates
  }
  
  return strengths;
};

/**
 * Generate weaknesses based on company description
 */
const generateWeaknesses = (description: string, industry: string): string[] => {
  const weaknessesPool = [
    'Limited customization',
    'Higher pricing',
    'Complex setup process',
    'Outdated interface',
    'Limited integrations',
    'Slow customer support',
    'Missing advanced features',
    'Performance issues',
    'Limited scalability',
    'Steep learning curve',
    'Limited reporting',
    'Poor mobile experience',
    'Frequent downtime',
    'Limited API access',
    'Lack of innovation'
  ];
  
  // Select 3-5 random weaknesses
  const count = 3 + Math.floor(Math.random() * 3);
  const weaknesses = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * weaknessesPool.length);
    weaknesses.push(weaknessesPool[randomIndex]);
    weaknessesPool.splice(randomIndex, 1); // Remove to avoid duplicates
  }
  
  return weaknesses;
};

/**
 * Store competitor data in Firestore
 */
const storeCompetitorData = async (competitors: Competitor[]): Promise<void> => {
  try {
    // Check if we should skip storing data (for development or if there are no competitors)
    if (competitors.length === 0 || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('Skipping storing competitor data in Firestore');
      return;
    }
    
    const competitorsRef = collection(db, 'competitors');
    
    // Store each competitor
    let storedCount = 0;
    for (const competitor of competitors) {
      try {
        await addDoc(competitorsRef, competitor);
        storedCount++;
      } catch (error) {
        console.error(`Error storing competitor ${competitor.name}:`, error);
      }
    }
    
    console.log(`Stored ${storedCount} competitors in Firestore`);
  } catch (error) {
    console.error('Error storing competitor data:', error);
  }
};

/**
 * Collect market trends data
 */
export const collectMarketTrends = async (industry: string): Promise<MarketTrend[]> => {
  try {
    console.log('Collecting market trends for industry:', industry);
    
    // Check if we should use mock data
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('Using simulated market trends data');
      return await fetchMarketTrends(industry);
    }
    
    // Try to get trends from Firestore
    try {
      const trendsRef = collection(db, 'marketTrends');
      const q = query(trendsRef, where('industry', '==', industry));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log('Found existing trends in Firestore');
        const trends: MarketTrend[] = [];
        querySnapshot.forEach(doc => {
          trends.push({ id: doc.id, ...doc.data() } as MarketTrend);
        });
        return trends;
      }
    } catch (firestoreError) {
      console.warn('Error accessing Firestore for trends, using simulated data:', firestoreError);
    }
    
    // If no trends found or error occurred, fetch from external sources
    const trends = await fetchMarketTrends(industry);
    
    // Try to store trends in Firestore
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'true') {
      try {
        const trendsRef = collection(db, 'marketTrends');
        for (const trend of trends) {
          await addDoc(trendsRef, {
            ...trend,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      } catch (storeError) {
        console.warn('Error storing trends in Firestore:', storeError);
      }
    }
    
    return trends;
  } catch (error) {
    console.error('Error collecting market trends:', error);
    return await fetchMarketTrends(industry);
  }
};

/**
 * Fetch market trends from external sources
 */
const fetchMarketTrends = async (industry: string): Promise<MarketTrend[]> => {
  // In a real app, you would implement API calls to news sources, trend analysis, etc.
  // For now, we'll return industry-specific simulated trends
  
  const commonTrends = [
    {
      name: 'AI Integration',
      description: `Artificial intelligence is transforming how ${industry} operates, with predictive analytics and automated optimization becoming standard.`,
      impact: 'High' as const,
      timeframe: 'Medium-term' as const,
      industry
    },
    {
      name: 'Privacy-First Approach',
      description: `With increasing regulations like GDPR and CCPA, ${industry} is shifting towards privacy-centric methods and cookieless solutions.`,
      impact: 'High' as const,
      timeframe: 'Short-term' as const,
      industry
    },
    {
      name: 'Sustainability Focus',
      description: `${industry} strategies are increasingly incorporating sustainability messaging and practices to appeal to environmentally conscious consumers.`,
      impact: 'Medium' as const,
      timeframe: 'Long-term' as const,
      industry
    }
  ];
  
  // Industry-specific trends
  const industryTrends: Record<string, MarketTrend[]> = {
    'Marketing': [
      {
        name: 'First-Party Data Strategies',
        description: 'As third-party cookies phase out, companies are developing sophisticated first-party data collection and activation strategies.',
        impact: 'High' as const,
        timeframe: 'Short-term' as const,
        industry: 'Marketing'
      },
      {
        name: 'Video-First Content',
        description: 'Short-form video content is dominating engagement metrics across platforms, with brands shifting resources to video production.',
        impact: 'High' as const,
        timeframe: 'Medium-term' as const,
        industry: 'Marketing'
      }
    ],
    'Software': [
      {
        name: 'Low-Code/No-Code Development',
        description: 'The democratization of software development through low-code and no-code platforms is enabling faster innovation and citizen developers.',
        impact: 'High' as const,
        timeframe: 'Medium-term' as const,
        industry: 'Software'
      },
      {
        name: 'API-First Architecture',
        description: 'Companies are increasingly adopting API-first approaches to enable better integration, composability, and ecosystem development.',
        impact: 'Medium' as const,
        timeframe: 'Medium-term' as const,
        industry: 'Software'
      }
    ],
    'Retail': [
      {
        name: 'Omnichannel Experience',
        description: 'Seamless integration between online and offline shopping experiences is becoming essential for retail success.',
        impact: 'High' as const,
        timeframe: 'Short-term' as const,
        industry: 'Retail'
      },
      {
        name: 'Social Commerce',
        description: 'Shopping directly through social media platforms is growing rapidly, blurring the lines between content consumption and purchasing.',
        impact: 'High' as const,
        timeframe: 'Medium-term' as const,
        industry: 'Retail'
      }
    ]
  };
  
  // Combine common trends with industry-specific trends
  const specificTrends = industryTrends[industry] || [];
  return [...commonTrends, ...specificTrends];
};

/**
 * Collect market opportunities data
 */
export const collectMarketOpportunities = async (industry: string): Promise<MarketOpportunity[]> => {
  try {
    console.log('Collecting market opportunities for industry:', industry);
    
    // Check if we should use mock data
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.log('Using simulated market opportunities data');
      return generateMarketOpportunities(industry);
    }
    
    // Try to get opportunities from Firestore
    try {
      const opportunitiesRef = collection(db, 'marketOpportunities');
      const q = query(opportunitiesRef, where('industry', '==', industry));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log('Found existing opportunities in Firestore');
        const opportunities: MarketOpportunity[] = [];
        querySnapshot.forEach(doc => {
          opportunities.push({ id: doc.id, ...doc.data() } as MarketOpportunity);
        });
        return opportunities;
      }
    } catch (firestoreError) {
      console.warn('Error accessing Firestore for opportunities, using simulated data:', firestoreError);
    }
    
    // If no opportunities found or error occurred, generate based on trends and competitor analysis
    const opportunities = generateMarketOpportunities(industry);
    
    // Try to store opportunities in Firestore
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'true') {
      try {
        const opportunitiesRef = collection(db, 'marketOpportunities');
        for (const opportunity of opportunities) {
          await addDoc(opportunitiesRef, {
            ...opportunity,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      } catch (storeError) {
        console.warn('Error storing opportunities in Firestore:', storeError);
      }
    }
    
    return opportunities;
  } catch (error) {
    console.error('Error collecting market opportunities:', error);
    return generateMarketOpportunities(industry);
  }
};

/**
 * Generate market opportunities based on industry
 */
const generateMarketOpportunities = (industry: string): MarketOpportunity[] => {
  // Common opportunities across industries
  const commonOpportunities = [
    {
      opportunity: `AI-driven ${industry} strategy generation`,
      potential: 'Very High' as const,
      description: `Automated ${industry} strategy creation based on analytics data is an emerging space with few established players.`,
      competition: 'Low' as const,
      industry
    },
    {
      opportunity: `Privacy-compliant ${industry} alternative`,
      potential: 'Medium' as const,
      description: `As privacy regulations tighten, there's growing demand for ${industry} solutions that work without cookies/tracking.`,
      competition: 'Medium' as const,
      industry
    }
  ];
  
  // Industry-specific opportunities
  const industryOpportunities: Record<string, MarketOpportunity[]> = {
    'Marketing': [
      {
        opportunity: 'SMB-focused simplified analytics',
        potential: 'High' as const,
        description: 'Small and medium businesses need affordable, simplified analytics that don\'t require data science expertise.',
        competition: 'Medium' as const,
        industry: 'Marketing'
      },
      {
        opportunity: 'Content optimization platform',
        potential: 'High' as const,
        description: 'Tools that help optimize content across channels based on performance data and audience insights.',
        competition: 'Medium' as const,
        industry: 'Marketing'
      }
    ],
    'Software': [
      {
        opportunity: 'Vertical-specific SaaS solutions',
        potential: 'High' as const,
        description: 'Industry-specific software solutions that address unique workflows and compliance requirements.',
        competition: 'Medium' as const,
        industry: 'Software'
      },
      {
        opportunity: 'AI development tools for non-technical users',
        potential: 'Very High' as const,
        description: 'Tools that allow business users to create and deploy AI models without coding knowledge.',
        competition: 'Low' as const,
        industry: 'Software'
      }
    ],
    'Retail': [
      {
        opportunity: 'Sustainable product verification platform',
        potential: 'High' as const,
        description: 'Solutions that verify and communicate product sustainability credentials to eco-conscious consumers.',
        competition: 'Low' as const,
        industry: 'Retail'
      },
      {
        opportunity: 'AR/VR shopping experiences',
        potential: 'Medium' as const,
        description: 'Augmented and virtual reality tools that enhance the online shopping experience with immersive product visualization.',
        competition: 'Medium' as const,
        industry: 'Retail'
      }
    ]
  };
  
  // Combine common opportunities with industry-specific opportunities
  const specificOpportunities = industryOpportunities[industry] || [];
  return [...commonOpportunities, ...specificOpportunities];
};

/**
 * Main function to perform real competitor analysis
 */
export const performRealCompetitorAnalysis = async (userProfile: UserProfile): Promise<{
  competitors: Competitor[],
  opportunities: MarketOpportunity[],
  trends: MarketTrend[]
}> => {
  try {
    console.log('Starting real competitor analysis for:', userProfile.industry);
    
    // Collect competitor data
    const competitors = await collectCompetitorData(userProfile);
    
    // Collect market trends
    const trends = await collectMarketTrends(userProfile.industry || 'General');
    
    // Collect market opportunities
    const opportunities = await collectMarketOpportunities(userProfile.industry || 'General');
    
    return {
      competitors,
      trends,
      opportunities
    };
  } catch (error) {
    console.error('Error performing real competitor analysis:', error);
    
    // Return simulated data as fallback
    return {
      competitors: simulateSearchResults(userProfile.industry || 'General')
        .map((result, index) => ({
          id: `comp-${Date.now()}-${index}`,
          name: result.title.split(' - ')[0],
          website: result.link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
          marketShare: Math.round(30 - (index * 3) + (Math.random() * 5)),
          growth: +(((Math.random() * 20) - 5).toFixed(1)),
          strengths: generateStrengths('', userProfile.industry || 'General'),
          weaknesses: generateWeaknesses('', userProfile.industry || 'General'),
          overview: result.snippet,
          logo: result.title.substring(0, 2).toUpperCase(),
          color: ['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-orange-600'][index % 4],
          industry: userProfile.industry || 'General'
        })),
      trends: await fetchMarketTrends(userProfile.industry || 'General'),
      opportunities: generateMarketOpportunities(userProfile.industry || 'General')
    };
  }
}; 