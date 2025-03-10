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
    const industry = userProfile.industry || 'General';
    
    // For now, return mock data
    return getMockCompetitors(industry);
  } catch (error) {
    console.error('Error finding similar businesses:', error);
    return [];
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
      opportunities: getMockOpportunities(userProfile),
      trends: getMockTrends(userProfile)
    };
  } catch (error) {
    console.error('Error performing competitor analysis:', error);
    // Return mock data in case of error
    return {
      competitors: getMockCompetitors(userProfile.industry || 'Marketing'),
      opportunities: getMockOpportunities(userProfile),
      trends: getMockTrends(userProfile)
    };
  }
};

// Function to get market opportunities
const getMarketOpportunities = async (industry: string): Promise<MarketOpportunity[]> => {
  try {
    // Create a mock user profile with just the industry
    const mockUserProfile: UserProfile = {
      uid: '',
      email: '',
      industry: industry,
      hasCompletedOnboarding: true
    };
    
    // Return mock data for now
    return getMockOpportunities(mockUserProfile);
  } catch (error) {
    console.error('Error getting market opportunities:', error);
    return [];
  }
};

// Function to get market trends
const getMarketTrends = async (industry: string): Promise<MarketTrend[]> => {
  try {
    // Create a mock user profile with just the industry
    const mockUserProfile: UserProfile = {
      uid: '',
      email: '',
      industry: industry,
      hasCompletedOnboarding: true
    };
    
    // Return mock data for now
    return getMockTrends(mockUserProfile);
  } catch (error) {
    console.error('Error getting market trends:', error);
    return [];
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

const getMockOpportunities = (userProfile: UserProfile): MarketOpportunity[] => {
  const industry = userProfile.industry || 'Marketing';
  const businessType = userProfile.businessType || '';
  const specializations = userProfile.specializations || [];
  const targetAudience = userProfile.targetAudience || '';
  
  // Base opportunities that apply to most businesses
  const baseOpportunities: MarketOpportunity[] = [
    {
      id: '1',
      opportunity: `SMB-focused simplified ${industry} solutions`,
      potential: 'High',
      description: `Small and medium businesses need affordable, simplified ${industry} solutions that don't require specialized expertise.`,
      competition: 'Medium',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
  ];
  
  // Business type specific opportunities
  const businessTypeOpportunities: Record<string, MarketOpportunity[]> = {
    'SaaS': [
      {
        id: 'saas-1',
        opportunity: 'Vertical-specific SaaS solutions',
        potential: 'Very High',
        description: `Developing specialized SaaS solutions for specific industries rather than one-size-fits-all approaches.`,
        competition: 'Medium',
        industry: industry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'saas-2',
        opportunity: 'No-code/low-code functionality',
        potential: 'High',
        description: 'Incorporating no-code/low-code capabilities to allow customers to customize solutions without developer resources.',
        competition: 'Medium',
        industry: industry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ],
    'Personal Trainer': [
      {
        id: 'pt-1',
        opportunity: 'Online training programs',
        potential: 'High',
        description: 'Developing comprehensive online training programs that clients can follow remotely.',
        competition: 'Medium',
        industry: industry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'pt-2',
        opportunity: 'Specialized fitness niches',
        potential: 'Very High',
        description: 'Focusing on underserved fitness niches like senior fitness, prenatal/postnatal, or specific medical conditions.',
        competition: 'Low',
        industry: industry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ]
  };
  
  // Specialization-based opportunities
  const specializationOpportunities: MarketOpportunity[] = [];
  
  if (specializations.some(s => s.toLowerCase().includes('booking') || s.toLowerCase().includes('appointment'))) {
    specializationOpportunities.push({
      id: 'spec-booking',
      opportunity: 'Mobile-first booking experience',
      potential: 'High',
      description: 'Optimizing the booking experience specifically for mobile users with streamlined interfaces.',
      competition: 'Medium',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  
  if (specializations.some(s => s.toLowerCase().includes('ai') || s.toLowerCase().includes('machine learning'))) {
    specializationOpportunities.push({
      id: 'spec-ai',
      opportunity: 'AI-powered personalization',
      potential: 'Very High',
      description: 'Using AI to deliver highly personalized experiences based on user behavior and preferences.',
      competition: 'Medium',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  
  // Combine all opportunities
  const allOpportunities = [
    ...baseOpportunities,
    ...(businessTypeOpportunities[businessType] || []),
    ...specializationOpportunities
  ];
  
  // If we still have fewer than 3 opportunities, add some generic ones
  if (allOpportunities.length < 3) {
    allOpportunities.push({
      id: 'generic-1',
      opportunity: `AI-driven ${industry} strategy generation`,
      potential: 'Very High',
      description: `Automated ${industry} strategy creation based on analytics data is an emerging space with few established players.`,
      competition: 'Low',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    allOpportunities.push({
      id: 'generic-2',
      opportunity: `Privacy-compliant ${industry} alternative`,
      potential: 'Medium',
      description: `As privacy regulations tighten, there's growing demand for ${industry} solutions that work without cookies/tracking.`,
      competition: 'Medium',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  
  // Return up to 5 opportunities
  return allOpportunities.slice(0, 5);
};

const getMockTrends = (userProfile: UserProfile): MarketTrend[] => {
  const industry = userProfile.industry || 'Marketing';
  const businessType = userProfile.businessType || '';
  const specializations = userProfile.specializations || [];
  
  // Base trends that apply to most businesses
  const baseTrends: MarketTrend[] = [
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
    }
  ];
  
  // Business type specific trends
  const businessTypeTrends: Record<string, MarketTrend[]> = {
    'SaaS': [
      {
        id: 'saas-trend-1',
        name: 'Vertical SaaS Growth',
        description: 'Industry-specific SaaS solutions are growing faster than horizontal platforms as businesses seek more tailored functionality.',
        impact: 'High',
        timeframe: 'Short-term',
        industry: industry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'saas-trend-2',
        name: 'Product-Led Growth',
        description: 'SaaS companies are increasingly adopting product-led growth strategies, letting the product itself drive customer acquisition and expansion.',
        impact: 'Medium',
        timeframe: 'Medium-term',
        industry: industry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ],
    'Personal Trainer': [
      {
        id: 'pt-trend-1',
        name: 'Hybrid Training Models',
        description: 'Combining in-person and virtual training sessions to offer clients more flexibility while maintaining personal connections.',
        impact: 'High',
        timeframe: 'Short-term',
        industry: industry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        id: 'pt-trend-2',
        name: 'Wearable Integration',
        description: 'Integration with wearable fitness devices to track client progress and provide more data-driven coaching.',
        impact: 'Medium',
        timeframe: 'Medium-term',
        industry: industry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ]
  };
  
  // Specialization-based trends
  const specializationTrends: MarketTrend[] = [];
  
  if (specializations.some(s => s.toLowerCase().includes('booking') || s.toLowerCase().includes('appointment'))) {
    specializationTrends.push({
      id: 'spec-trend-booking',
      name: 'Contactless Booking & Check-in',
      description: 'Streamlined, contactless booking and check-in processes are becoming expected by customers across industries.',
      impact: 'Medium',
      timeframe: 'Short-term',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  
  if (specializations.some(s => s.toLowerCase().includes('ai') || s.toLowerCase().includes('machine learning'))) {
    specializationTrends.push({
      id: 'spec-trend-ai',
      name: 'Explainable AI',
      description: 'As AI becomes more prevalent, the ability to explain AI decisions in human terms is becoming a key differentiator.',
      impact: 'High',
      timeframe: 'Medium-term',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  
  // Combine all trends
  const allTrends = [
    ...baseTrends,
    ...(businessTypeTrends[businessType] || []),
    ...specializationTrends
  ];
  
  // If we still have fewer than 4 trends, add some generic ones
  if (allTrends.length < 4) {
    allTrends.push({
      id: 'generic-trend-1',
      name: 'Omnichannel Integration',
      description: `Seamless integration across all ${industry} channels is becoming essential, with customers expecting consistent experiences.`,
      impact: 'Medium',
      timeframe: 'Medium-term',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    allTrends.push({
      id: 'generic-trend-2',
      name: 'Sustainability Focus',
      description: `${industry} strategies are increasingly incorporating sustainability messaging and practices to appeal to environmentally conscious consumers.`,
      impact: 'Medium',
      timeframe: 'Long-term',
      industry: industry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
  
  // Return up to 6 trends
  return allTrends.slice(0, 6);
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