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
    console.log('Starting competitor data collection for:', userProfile.industry);
    
    // Step 1: Search for competitors in the user's industry
    const searchResults = await searchCompetitors(userProfile);
    
    // Step 2: Extract company websites from search results
    const companyWebsites = extractCompanyWebsites(searchResults);
    
    // Step 3: Scrape company data from websites
    const scrapedData = await Promise.all(
      companyWebsites.map(website => scrapeCompanyData(website))
    );
    
    // Step 4: Analyze and transform the data into competitor objects
    // Pass the user's business size for filtering
    const competitors = transformToCompetitors(scrapedData, userProfile.industry || 'General', userProfile.businessSize);
    
    // Step 5: Store the data in Firestore for future use
    await storeCompetitorData(competitors);
    
    return competitors;
  } catch (error) {
    console.error('Error collecting competitor data:', error);
    throw error;
  }
};

/**
 * Search for competitors using SerpAPI
 */
const searchCompetitors = async (userProfile: UserProfile): Promise<SearchResult[]> => {
  try {
    // Construct search query based on user profile
    const industry = userProfile.industry || '';
    const location = userProfile.location || '';
    const businessSize = userProfile.businessSize || '';
    const businessDescription = userProfile.bio || '';
    
    // Extract key terms from business description
    const keyTerms = extractKeyTerms(businessDescription);
    
    // Build a more targeted search query
    let searchQuery = `top ${industry} companies`;
    
    // Add key terms from business description if available
    if (keyTerms.length > 0) {
      searchQuery += ` for ${keyTerms.join(' ')}`;
    }
    
    // Add location if available
    if (location) {
      searchQuery += ` in ${location}`;
    }
    
    // Add business size if available
    if (businessSize) {
      searchQuery += ` for ${businessSize} businesses`;
    }
    
    console.log('Search query:', searchQuery);
    
    // Use our server-side API route instead of calling SerpAPI directly
    try {
      const response = await axios.get('/api/serpapi', {
        params: {
          q: searchQuery
        }
      });
      
      // Extract organic results
      const organicResults = response.data.organic_results || [];
      
      return organicResults.map((result: any, index: number) => ({
        position: index + 1,
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        source: 'serpapi'
      }));
    } catch (error) {
      console.warn('Error using API route for SerpAPI, falling back to simulated results:', error);
      return simulateSearchResults(searchQuery);
    }
  } catch (error) {
    console.error('Error searching for competitors:', error);
    return simulateSearchResults(userProfile.industry || 'General');
  }
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
    'business', 'company', 'provide', 'service', 'services', 'product', 'products'
  ];
  
  // Split into words and filter out stop words
  const words = cleanedText.split(' ').filter(word => 
    word.length > 3 && !stopWords.includes(word)
  );
  
  // Count word frequency
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Sort by frequency and get top 3-5 terms
  const sortedTerms = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return sortedTerms.slice(0, 5);
};

/**
 * Simulate search results for development without API key
 */
const simulateSearchResults = (query: string): SearchResult[] => {
  const industry = query.includes('marketing') ? 'marketing' : 
                  query.includes('software') ? 'software' :
                  query.includes('retail') ? 'retail' : 'general';
  
  // Simulated results based on industry
  const results: Record<string, SearchResult[]> = {
    'marketing': [
      { position: 1, title: 'HubSpot - Inbound Marketing, Sales, and Service Software', link: 'https://www.hubspot.com', snippet: 'HubSpot offers a full platform of marketing, sales, customer service, and CRM software — plus the methodology, resources, and support — to help businesses grow better.', source: 'simulated' },
      { position: 2, title: 'Mailchimp - Marketing Platform for Small Businesses', link: 'https://www.mailchimp.com', snippet: 'Mailchimp is the All-In-One integrated marketing platform for small businesses, to grow your business on your terms.', source: 'simulated' },
      { position: 3, title: 'Semrush - Online Visibility Management Platform', link: 'https://www.semrush.com', snippet: 'Semrush is a powerful and versatile competitive intelligence suite for online marketing, from SEO and PPC to social media and video advertising research.', source: 'simulated' },
      { position: 4, title: 'Moz - SEO Software, Tools & Resources for Smarter Marketing', link: 'https://moz.com', snippet: 'Backed by the largest community of SEOs on the planet, Moz builds tools that make SEO, inbound marketing, link building, and content marketing easy.', source: 'simulated' },
      { position: 5, title: 'Constant Contact - Email Marketing Software', link: 'https://www.constantcontact.com', snippet: 'Email marketing software and services to help you grow your business. Create, send, and track email marketing campaigns that drive results.', source: 'simulated' }
    ],
    'software': [
      { position: 1, title: 'Microsoft - Official Home Page', link: 'https://www.microsoft.com', snippet: 'Microsoft is the leading platform and productivity company for the mobile-first, cloud-first world, and its mission is to empower every person and every organization on the planet to achieve more.', source: 'simulated' },
      { position: 2, title: 'Oracle | Cloud Applications and Cloud Platform', link: 'https://www.oracle.com', snippet: 'Oracle offers a comprehensive and fully integrated stack of cloud applications and platform services.', source: 'simulated' },
      { position: 3, title: 'SAP Software Solutions | Business Applications and Technology', link: 'https://www.sap.com', snippet: 'SAP helps companies of all sizes and industries run better. From back office to boardroom, warehouse to storefront, desktop to mobile device – SAP empowers people and organizations.', source: 'simulated' },
      { position: 4, title: 'Salesforce: We Bring Companies and Customers Together', link: 'https://www.salesforce.com', snippet: 'Salesforce unites your marketing, sales, commerce, service, and IT teams from anywhere with Customer 360 — one integrated CRM platform.', source: 'simulated' },
      { position: 5, title: 'Adobe: Creative, marketing and document management solutions', link: 'https://www.adobe.com', snippet: 'Adobe is changing the world through digital experiences. We help our customers create, deliver and optimize content and applications.', source: 'simulated' }
    ],
    'retail': [
      { position: 1, title: 'Amazon.com: Online Shopping for Electronics, Apparel, Computers & More', link: 'https://www.amazon.com', snippet: 'Online shopping from the earth\'s biggest selection of books, magazines, music, DVDs, videos, electronics, computers, software, apparel & accessories, shoes, and more.', source: 'simulated' },
      { position: 2, title: 'Walmart.com | Save Money. Live Better', link: 'https://www.walmart.com', snippet: 'Shop Walmart.com for Every Day Low Prices. Free Shipping on Orders $35+ or Pickup In-Store and get a Pickup Discount. Grocery delivery available in select areas.', source: 'simulated' },
      { position: 3, title: 'Target : Expect More. Pay Less.', link: 'https://www.target.com', snippet: 'Shop Target online and in-store for everything from groceries and essentials to clothing and electronics. Choose contactless delivery or Drive Up for same-day delivery.', source: 'simulated' },
      { position: 4, title: 'Best Buy: Expert Service. Unbeatable Price.', link: 'https://www.bestbuy.com', snippet: 'Shop Best Buy for electronics, computers, appliances, cell phones, video games & more new tech. In-store pickup & free shipping on thousands of items.', source: 'simulated' },
      { position: 5, title: 'Home Depot: Shop Online for Home Improvement, Home Décor & More', link: 'https://www.homedepot.com', snippet: 'Shop online for all your home improvement needs: appliances, bathroom decorating ideas, kitchen remodeling, patio furniture, power tools, bbq grills, carpeting, lumber, concrete, lighting, ceiling fans and more at The Home Depot.', source: 'simulated' }
    ],
    'general': [
      { position: 1, title: 'Google - Search Engine', link: 'https://www.google.com', snippet: 'Google is an American multinational technology company that specializes in Internet-related services and products.', source: 'simulated' },
      { position: 2, title: 'Apple - Technology Company', link: 'https://www.apple.com', snippet: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services.', source: 'simulated' },
      { position: 3, title: 'Amazon - E-commerce Company', link: 'https://www.amazon.com', snippet: 'Amazon.com, Inc. is an American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.', source: 'simulated' },
      { position: 4, title: 'Microsoft - Technology Company', link: 'https://www.microsoft.com', snippet: 'Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services.', source: 'simulated' },
      { position: 5, title: 'Facebook - Social Media Company', link: 'https://www.facebook.com', snippet: 'Facebook is an American online social media and social networking service owned by Meta Platforms.', source: 'simulated' }
    ]
  };
  
  return results[industry] || results['general'];
};

/**
 * Extract company websites from search results
 */
const extractCompanyWebsites = (searchResults: SearchResult[]): string[] => {
  return searchResults.map(result => {
    // Extract domain from URL
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