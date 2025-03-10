"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart2,
  TrendingUp,
  Download,
  ExternalLink,
  Eye,
  Calendar,
  Filter,
  List,
  Grid3X3,
  PieChart,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/lib/userService";
import { performCompetitorAnalysis, saveCompetitorAnalysis, Competitor, MarketOpportunity, MarketTrend } from "@/lib/marketResearchService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import MarketSharePieChart from "@/components/MarketSharePieChart";

// Mock data for competitors
const competitors = [
  {
    id: 1,
    name: "MarketMaster",
    website: "marketmaster.com",
    marketShare: 28,
    growth: 12.5,
    strengths: ["Great UI/UX", "Advanced analytics", "Strong API"],
    weaknesses: ["Expensive", "Complex setup", "Limited integrations"],
    overview: "Market leader with comprehensive marketing analytics. Their platform offers advanced features but at a premium price point.",
    logo: "MM",
    color: "bg-blue-600",
  },
  {
    id: 2,
    name: "PromoPro",
    website: "promopro.io",
    marketShare: 22,
    growth: 15.8,
    strengths: ["Affordable", "User-friendly", "Good for beginners"],
    weaknesses: ["Limited features", "Basic analytics", "Poor support"],
    overview: "Growing rapidly with focus on SMBs. Offers a simplified marketing analytics solution with competitive pricing.",
    logo: "PP",
    color: "bg-purple-600",
  },
  {
    id: 3,
    name: "AdInsights",
    website: "adinsights.com",
    marketShare: 18,
    growth: -2.5,
    strengths: ["Ad-focused analytics", "Strong reporting", "Industry expertise"],
    weaknesses: ["Outdated UI", "Slow updates", "Limited scope"],
    overview: "Specializes in advertising analytics with deep insights for ad performance. Losing market share due to outdated technology.",
    logo: "AI",
    color: "bg-green-600",
  },
  {
    id: 4,
    name: "DataMarket",
    website: "datamarket.co",
    marketShare: 15,
    growth: 8.2,
    strengths: ["Data visualization", "Integration ecosystem", "Modern tech stack"],
    weaknesses: ["Newer player", "Less established", "Some reliability issues"],
    overview: "Modern marketing analytics platform focusing on data visualization and integrations with other marketing tools.",
    logo: "DM",
    color: "bg-orange-600",
  },
];

// Mock data for market trends
const marketTrends = [
  {
    id: 1,
    trend: "AI-Powered Marketing Analytics",
    growth: 68,
    description: "AI and machine learning being integrated into marketing analytics platforms for predictive insights and automated optimizations.",
    relevance: "High",
  },
  {
    id: 2,
    trend: "Privacy-First Analytics",
    growth: 42,
    description: "Shift towards analytics solutions that prioritize user privacy and comply with regulations like GDPR and CCPA.",
    relevance: "Medium",
  },
  {
    id: 3,
    trend: "Unified Marketing Platforms",
    growth: 35,
    description: "Growing demand for all-in-one platforms that integrate analytics, automation, and campaign management.",
    relevance: "High",
  },
  {
    id: 4,
    trend: "Real-time Analytics Dashboards",
    growth: 28,
    description: "Increasing preference for real-time data visualization and dashboards for immediate decision making.",
    relevance: "Medium",
  },
  {
    id: 5,
    trend: "Voice and Visual Search Analytics",
    growth: 22,
    description: "New analytics tools emerging to track and optimize for voice search and visual search behavior.",
    relevance: "Low",
  },
];

// Mock data for market opportunities
const marketOpportunities = [
  {
    id: 1,
    opportunity: "SMB-focused simplified analytics",
    potential: "High",
    description: "Small and medium businesses need affordable, simplified analytics that don't require data science expertise.",
    competition: "Medium",
  },
  {
    id: 2,
    opportunity: "AI-driven marketing strategy generation",
    potential: "Very High",
    description: "Automated marketing strategy creation based on analytics data is an emerging space with few established players.",
    competition: "Low",
  },
  {
    id: 3,
    opportunity: "Privacy-compliant analytics alternative",
    potential: "Medium",
    description: "As privacy regulations tighten, there's growing demand for marketing analytics that work without cookies/tracking.",
    competition: "Medium",
  },
];

export default function MarketResearchPage() {
    const [competitorView, setCompetitorView] = useState<"grid" | "list">("grid");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
    const [trends, setTrends] = useState<MarketTrend[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("marketshare");
    const [isAnalysisUpdating, setIsAnalysisUpdating] = useState<boolean>(false);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
    const [isRealDataCollection, setIsRealDataCollection] = useState<boolean>(false);
    
    const { user } = useAuth();
    
    useEffect(() => {
      const fetchMarketResearch = async () => {
        if (!user) return;
        
        try {
          setLoading(true);
          setError(null);
          
          // Get user profile
          const userProfile = await getUserProfile(user.uid);
          
          if (!userProfile) {
            setError("User profile not found. Please complete your profile first.");
            setLoading(false);
            return;
          }
          
          // Perform competitor analysis
          const analysis = await performCompetitorAnalysis(userProfile);
          
          setCompetitors(analysis.competitors);
          setOpportunities(analysis.opportunities);
          setTrends(analysis.trends);
        } catch (error) {
          console.error("Error fetching market research:", error);
          setError("Failed to load market research data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchMarketResearch();
    }, [user]);
    
    const handleUpdateAnalysis = async () => {
      if (!user) return;
      
      try {
        setIsAnalysisUpdating(true);
        setError(null);
        
        // Get user profile
        const userProfile = await getUserProfile(user.uid);
        
        if (!userProfile) {
          setError("User profile not found. Please complete your profile first.");
          return;
        }
        
        // Perform competitor analysis
        const analysis = await performCompetitorAnalysis(userProfile);
        
        setCompetitors(analysis.competitors);
        setOpportunities(analysis.opportunities);
        setTrends(analysis.trends);
        
        // Show success message
        setError(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error("Error updating market research:", error);
        setError("Failed to update market research data. Please try again later.");
      } finally {
        setIsAnalysisUpdating(false);
      }
    };
    
    const handleSaveAnalysis = async () => {
      if (!user) return;
      
      try {
        await saveCompetitorAnalysis(user.uid, {
          competitors,
          opportunities,
          trends
        });
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error("Error saving analysis:", error);
        setError("Failed to save analysis. Please try again later.");
      }
    };
    
    // Filter competitors based on search term
    const filteredCompetitors = competitors.filter(competitor => 
      competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competitor.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competitor.overview.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Sort competitors based on sort option
    const sortedCompetitors = [...filteredCompetitors].sort((a, b) => {
      if (sortBy === "marketshare") {
        return b.marketShare - a.marketShare;
      } else if (sortBy === "growth") {
        return b.growth - a.growth;
      } else if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Market Research</h1>
          <p className="text-muted-foreground">
            Analyze competitors and identify market trends and opportunities
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {saveSuccess && (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Analysis saved successfully!</AlertDescription>
          </Alert>
        )}
        
        {isRealDataCollection && (
          <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900 dark:text-blue-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Collecting Real Data</AlertTitle>
            <AlertDescription>We're collecting real-time data about your competitors. This may take a moment...</AlertDescription>
          </Alert>
        )}
  
        <Tabs defaultValue="competitors">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>
          
          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-center">Loading competitor analysis...</span>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  We're analyzing your industry and finding relevant competitors based on your business profile.
                </p>
              </div>
            ) : (
              <>
                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="relative w-full md:w-64">
                      <Input 
                        placeholder="Search competitors..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select 
                      defaultValue="marketshare"
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value)}
                    >
                      <SelectTrigger className="w-full md:w-[160px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketshare">Market Share</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant={competitorView === "grid" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setCompetitorView("grid")}
                    >
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Grid
                    </Button>
                    <Button 
                      variant={competitorView === "list" ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setCompetitorView("list")}
                    >
                      <List className="h-4 w-4 mr-2" />
                      List
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={handleSaveAnalysis}>
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    
                    <Button 
                      size="sm" 
                      onClick={handleUpdateAnalysis}
                      disabled={isAnalysisUpdating}
                    >
                      {isAnalysisUpdating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Update Analysis
                    </Button>
                  </div>
                </div>
                
                {/* Market Share Overview */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Market Share Distribution</CardTitle>
                    <CardDescription>
                      Competitive landscape in your industry
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-auto">
                      <MarketSharePieChart competitors={sortedCompetitors} />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Competitor Grid/List View */}
                {sortedCompetitors.length === 0 ? (
                  <Card className="shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center h-64">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No competitors found matching your search criteria.</p>
                    </CardContent>
                  </Card>
                ) : competitorView === "grid" ? (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {sortedCompetitors.map((competitor) => (
                      <Card key={competitor.id} className="shadow-sm">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full ${competitor.color} flex items-center justify-center text-white font-bold`}>
                                {competitor.logo}
                              </div>
                              <div>
                                <CardTitle>{competitor.name}</CardTitle>
                                <CardDescription className="flex items-center">
                                  <a href={`https://${competitor.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                                    {competitor.website}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </CardDescription>
                              </div>
                            </div>
                            <div>
                              <Badge className={competitor.growth >= 0 ? "bg-green-500" : "bg-red-500"}>
                                {competitor.growth >= 0 ? "+" : ""}{competitor.growth}% Growth
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium mb-1">Market Share</p>
                              <div className="flex items-center gap-2">
                                <Progress value={competitor.marketShare} className="h-2 flex-1" />
                                <span className="text-sm font-medium">{competitor.marketShare}%</span>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Overview</p>
                              <p className="text-sm text-muted-foreground">{competitor.overview}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium mb-1 text-green-600">Strengths</p>
                                <ul className="space-y-1">
                                  {competitor.strengths.map((strength, i) => (
                                    <li key={i} className="text-sm flex items-start gap-1">
                                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                      <span>{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium mb-1 text-red-600">Weaknesses</p>
                                <ul className="space-y-1">
                                  {competitor.weaknesses.map((weakness, i) => (
                                    <li key={i} className="text-sm flex items-start gap-1">
                                      <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                      <span>{weakness}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-2" />
                            View Detailed Report
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle>Competitor List</CardTitle>
                      <CardDescription>
                        Detailed comparison of key competitors
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="border-b border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-sm font-medium">
                          <div className="col-span-3">Company</div>
                          <div className="col-span-2">Market Share</div>
                          <div className="col-span-2">Growth</div>
                          <div className="col-span-2">Strengths</div>
                          <div className="col-span-2">Weaknesses</div>
                          <div className="col-span-1">Actions</div>
                        </div>
                      </div>
                      
                      <div>
                        {sortedCompetitors.map((competitor) => (
                          <div key={competitor.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700 items-center">
                            <div className="col-span-3 flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full ${competitor.color} flex items-center justify-center text-white font-bold text-xs`}>
                                {competitor.logo}
                              </div>
                              <div>
                                <p className="font-medium">{competitor.name}</p>
                                <a href={`https://${competitor.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground flex items-center hover:underline">
                                  {competitor.website}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <Progress value={competitor.marketShare} className="h-2 w-16" />
                                <span className="text-sm">{competitor.marketShare}%</span>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <Badge className={competitor.growth >= 0 ? "bg-green-500" : "bg-red-500"}>
                                {competitor.growth >= 0 ? "+" : ""}{competitor.growth}%
                              </Badge>
                            </div>
                            <div className="col-span-2">
                              <ul className="space-y-1">
                                {competitor.strengths.slice(0, 2).map((strength, i) => (
                                  <li key={i} className="text-xs flex items-start gap-1">
                                    <Check className="h-3 w-3 text-green-500 shrink-0 mt-0.5" />
                                    <span>{strength}</span>
                                  </li>
                                ))}
                                {competitor.strengths.length > 2 && (
                                  <li className="text-xs text-muted-foreground">+{competitor.strengths.length - 2} more</li>
                                )}
                              </ul>
                            </div>
                            <div className="col-span-2">
                              <ul className="space-y-1">
                                {competitor.weaknesses.slice(0, 2).map((weakness, i) => (
                                  <li key={i} className="text-xs flex items-start gap-1">
                                    <X className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                                    <span>{weakness}</span>
                                  </li>
                                ))}
                                {competitor.weaknesses.length > 2 && (
                                  <li className="text-xs text-muted-foreground">+{competitor.weaknesses.length - 2} more</li>
                                )}
                              </ul>
                            </div>
                            <div className="col-span-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
          
          {/* Market Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-center">Loading market trends...</span>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  We're analyzing industry publications and news sources to identify relevant market trends.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Current Market Trends</h3>
                  <Button variant="outline" size="sm" onClick={handleSaveAnalysis}>
                    <Download className="h-4 w-4 mr-2" />
                    Save Trends
                  </Button>
                </div>
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {trends.map((trend) => (
                    <Card key={trend.id} className="shadow-sm">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{trend.name}</CardTitle>
                          <Badge variant={
                            trend.impact === 'High' ? 'default' : 
                            trend.impact === 'Medium' ? 'outline' : 'secondary'
                          }>
                            {trend.impact} Impact
                          </Badge>
                        </div>
                        <CardDescription>
                          {trend.timeframe} trend
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{trend.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          View Trend Data
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
          
          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-4">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-center">Loading market opportunities...</span>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  We're analyzing market gaps and competitor weaknesses to identify potential opportunities for your business.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Market Opportunities</h3>
                  <Button variant="outline" size="sm" onClick={handleSaveAnalysis}>
                    <Download className="h-4 w-4 mr-2" />
                    Save Opportunities
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {opportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="shadow-sm">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{opportunity.opportunity}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant={
                              opportunity.potential === 'Very High' || opportunity.potential === 'High' ? 'default' : 
                              opportunity.potential === 'Medium' ? 'outline' : 'secondary'
                            }>
                              {opportunity.potential} Potential
                            </Badge>
                            <Badge variant="outline">
                              {opportunity.competition} Competition
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm">
                          <BarChart2 className="h-4 w-4 mr-2" />
                          View Market Data
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
}