import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { UserProfile } from './userService';
import { performRealCompetitorAnalysis } from './dataCollectionService';

// Define interfaces for our data models
export interface Competitor {
  id?: string;
  name: string;
  website: string;
  marketShare: number;
  growth: number;
  strengths: string[];
  weaknesses: string[];
  overview: string;
  logo?: string;
  color?: string;
  industry: string;
  businessSize?: string;
  location?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface MarketOpportunity {
  id?: string;
  opportunity: string;
  potential: 'Low' | 'Medium' | 'High' | 'Very High';
  description: string;
  competition: 'Low' | 'Medium' | 'High';
  industry: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface MarketTrend {
  id?: string;
  name: string;
  description: string;
  impact: 'Low' | 'Medium' | 'High';
  timeframe: 'Short-term' | 'Medium-term' | 'Long-term';
  industry: string;
  createdAt?: any;
  updatedAt?: any;
}

// Function to find similar businesses based on user profile
export const findSimilarBusinesses = async (userProfile: UserProfile): Promise<Competitor[]> => {
  try {
    // Extract relevant information from user profile
    const { industry, businessSize, location } = userProfile;
    
    // Create a query to find similar businesses in the same industry
    const competitorsRef = collection(db, 'competitors');
    const competitorQuery = query(competitorsRef, where('industry', '==', industry || 'Marketing'));
    
    // Execute the query
    const querySnapshot = await getDocs(competitorQuery);
    
    // Transform the results
    const competitors: Competitor[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Competitor;
      competitors.push({
        id: doc.id,
        ...data
      });
    });
    
    // If no competitors found, use real data collection
    if (competitors.length === 0) {
      console.log('No competitors found in database, collecting real data...');
      // Use the real data collection service to find competitors
      const realCompetitors = await performRealCompetitorAnalysis(userProfile);
      return realCompetitors.competitors;
    }
    
    return competitors;
  } catch (error) {
    console.error('Error finding similar businesses:', error);
    // Return mock data in case of error
    return getMockCompetitors(userProfile.industry || 'Marketing');
  }
};

// Function to perform competitor analysis
export const performCompetitorAnalysis = async (userProfile: UserProfile): Promise<{
  competitors: Competitor[],
  opportunities: MarketOpportunity[],
  trends: MarketTrend[]
}> => {
  try {
    // Check if we should use real data collection or mock data
    const useRealData = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'true';
    
    if (useRealData) {
      console.log('Using real data collection for competitor analysis');
      try {
        return await performRealCompetitorAnalysis(userProfile);
      } catch (error) {
        console.error('Error with real data collection, falling back to mock data:', error);
        // Fall back to mock data if real data collection fails
      }
    }
    
    console.log('Using mock data for competitor analysis');
    // Use mock data
    return {
      competitors: getMockCompetitors(userProfile.industry || 'Marketing'),
      opportunities: getMockOpportunities(userProfile.industry || 'Marketing'),
      trends: getMockTrends(userProfile.industry || 'Marketing')
    };
  } catch (error) {
    console.error('Error performing competitor analysis:', error);
    // Return mock data in case of error
    return {
      competitors: getMockCompetitors(userProfile.industry || 'Marketing'),
      opportunities: getMockOpportunities(userProfile.industry || 'Marketing'),
      trends: getMockTrends(userProfile.industry || 'Marketing')
    };
  }
};

// Function to get market opportunities
const getMarketOpportunities = async (industry: string): Promise<MarketOpportunity[]> => {
  try {
    const opportunitiesRef = collection(db, 'marketOpportunities');
    const opportunityQuery = query(opportunitiesRef, where('industry', '==', industry));
    
    const querySnapshot = await getDocs(opportunityQuery);
    
    const opportunities: MarketOpportunity[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as MarketOpportunity;
      opportunities.push({
        id: doc.id,
        ...data
      });
    });
    
    // If no opportunities found, return mock data
    if (opportunities.length === 0) {
      return getMockOpportunities(industry);
    }
    
    return opportunities;
  } catch (error) {
    console.error('Error getting market opportunities:', error);
    return getMockOpportunities(industry);
  }
};

// Function to get market trends
const getMarketTrends = async (industry: string): Promise<MarketTrend[]> => {
  try {
    const trendsRef = collection(db, 'marketTrends');
    const trendQuery = query(trendsRef, where('industry', '==', industry));
    
    const querySnapshot = await getDocs(trendQuery);
    
    const trends: MarketTrend[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as MarketTrend;
      trends.push({
        id: doc.id,
        ...data
      });
    });
    
    // If no trends found, return mock data
    if (trends.length === 0) {
      return getMockTrends(industry);
    }
    
    return trends;
  } catch (error) {
    console.error('Error getting market trends:', error);
    return getMockTrends(industry);
  }
};

// Mock data functions (will be used until real data is available in Firestore)
const getMockCompetitors = (industry: string): Competitor[] => {
  // Generate industry-specific mock competitors
  const competitors: Competitor[] = [
    {
      id: '1',
      name: "MarketMaster",
      website: "marketmaster.com",
      marketShare: 28,
      growth: 12.5,
      strengths: ["Great UI/UX", "Advanced analytics", "Strong API"],
      weaknesses: ["Expensive", "Complex setup", "Limited integrations"],
      overview: `Market leader in ${industry} with comprehensive analytics. Their platform offers advanced features but at a premium price point.`,
      logo: "MM",
      color: "bg-blue-600",
      industry: industry,
      businessSize: "Enterprise",
      location: "United States",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      id: '2',
      name: "PromoPro",
      website: "promopro.io",
      marketShare: 22,
      growth: 15.8,
      strengths: ["Affordable", "User-friendly", "Good for beginners"],
      weaknesses: ["Limited features", "Basic analytics", "Poor support"],
      overview: `Growing rapidly in the ${industry} space with focus on SMBs. Offers a simplified solution with competitive pricing.`,
      logo: "PP",
      color: "bg-purple-600",
      industry: industry,
      businessSize: "SMB",
      location: "Global",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      id: '3',
      name: "AdInsights",
      website: "adinsights.com",
      marketShare: 18,
      growth: -2.5,
      strengths: [`${industry}-focused analytics`, "Strong reporting", "Industry expertise"],
      weaknesses: ["Outdated UI", "Slow updates", "Limited scope"],
      overview: `Specializes in ${industry} analytics with deep insights. Losing market share due to outdated technology.`,
      logo: "AI",
      color: "bg-green-600",
      industry: industry,
      businessSize: "Mid-market",
      location: "Europe",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      id: '4',
      name: "DataMarket",
      website: "datamarket.co",
      marketShare: 15,
      growth: 8.2,
      strengths: ["Data visualization", "Integration ecosystem", "Modern tech stack"],
      weaknesses: ["Newer player", "Less established", "Some reliability issues"],
      overview: `Modern ${industry} platform focusing on data visualization and integrations with other tools.`,
      logo: "DM",
      color: "bg-orange-600",
      industry: industry,
      businessSize: "All sizes",
      location: "Asia-Pacific",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];
  
  return competitors;
};

const getMockOpportunities = (industry: string): MarketOpportunity[] => {
  return [
    {
      id: '1',
      opportunity: `SMB-focused simplified ${industry} solutions`,
      potential: 'High',
      description: `Small and medium businesses need affordable, simplified ${industry} solutions that don't require specialized expertise.`,
      competition: 'Medium',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      id: '2',
      opportunity: `AI-driven ${industry} strategy generation`,
      potential: 'Very High',
      description: `Automated ${industry} strategy creation based on analytics data is an emerging space with few established players.`,
      competition: 'Low',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      id: '3',
      opportunity: `Privacy-compliant ${industry} alternative`,
      potential: 'Medium',
      description: `As privacy regulations tighten, there's growing demand for ${industry} solutions that work without cookies/tracking.`,
      competition: 'Medium',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];
};

const getMockTrends = (industry: string): MarketTrend[] => {
  return [
    {
      id: '1',
      name: `AI Integration in ${industry}`,
      description: `Artificial intelligence is transforming how ${industry} operates, with predictive analytics and automated optimization becoming standard.`,
      impact: 'High',
      timeframe: 'Medium-term',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      id: '2',
      name: 'Privacy-First Approach',
      description: `With increasing regulations like GDPR and CCPA, ${industry} is shifting towards privacy-centric methods and cookieless solutions.`,
      impact: 'High',
      timeframe: 'Short-term',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      id: '3',
      name: 'Omnichannel Integration',
      description: `Seamless integration across all ${industry} channels is becoming essential, with customers expecting consistent experiences.`,
      impact: 'Medium',
      timeframe: 'Medium-term',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    {
      id: '4',
      name: 'Sustainability Focus',
      description: `${industry} strategies are increasingly incorporating sustainability messaging and practices to appeal to environmentally conscious consumers.`,
      impact: 'Medium',
      timeframe: 'Long-term',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];
};

// Function to save competitor analysis to user's saved reports
export const saveCompetitorAnalysis = async (
  userId: string, 
  analysis: { 
    competitors: Competitor[], 
    opportunities: MarketOpportunity[], 
    trends: MarketTrend[] 
  }
): Promise<string> => {
  try {
    const reportsRef = collection(db, 'users', userId, 'savedReports');
    
    const docRef = await addDoc(reportsRef, {
      type: 'competitorAnalysis',
      data: analysis,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving competitor analysis:', error);
    throw error;
  }
}; 