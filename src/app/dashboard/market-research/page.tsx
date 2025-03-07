"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Market Research</h1>
          <p className="text-muted-foreground">
            Analyze competitors and identify market trends and opportunities
          </p>
        </div>
  
        <Tabs defaultValue="competitors">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>
          
          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="relative w-full md:w-64">
                  <Input placeholder="Search competitors..." />
                </div>
                
                <Select defaultValue="marketshare">
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
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                
                <Button size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
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
                <div className="h-64 relative flex items-center">
                  {/* This would be a pie chart in a real implementation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PieChart className="h-40 w-40 text-muted-foreground" />
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute right-0 top-0 space-y-2">
                    {competitors.map((competitor) => (
                      <div key={competitor.id} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${competitor.color}`}></div>
                        <span className="text-sm">{competitor.name} ({competitor.marketShare}%)</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm">Others (17%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Competitors List/Grid */}
          {competitorView === "grid" ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {competitors.map((competitor) => (
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
                  <CardContent className="pb-2">
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
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {competitors.map((competitor) => (
                    <div key={competitor.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm">
                      <div className="col-span-3 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${competitor.color} flex items-center justify-center text-white font-bold text-xs`}>
                          {competitor.logo}
                        </div>
                        <div>
                          <p className="font-medium">{competitor.name}</p>
                          <p className="text-xs text-muted-foreground">{competitor.website}</p>
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Progress value={competitor.marketShare} className="h-2 w-20" />
                          <span>{competitor.marketShare}%</span>
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
        </TabsContent>
        {/* Market Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <Select defaultValue="growth">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="growth">Highest Growth</SelectItem>
                  <SelectItem value="relevance">Highest Relevance</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Relevance</SelectItem>
                  <SelectItem value="high">High Relevance</SelectItem>
                  <SelectItem value="medium">Medium Relevance</SelectItem>
                  <SelectItem value="low">Low Relevance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              
              <Button size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Analysis
              </Button>
            </div>
          </div>
          
          {/* Market Trends Overview */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Top Market Trends</CardTitle>
              <CardDescription>
                Key trends in the marketing analytics industry
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {marketTrends.map((trend) => (
                  <div key={trend.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{trend.trend}</h3>
                            <Badge variant="outline" className={
                              trend.relevance === "High" 
                                ? "border-green-200 text-green-600" 
                                : trend.relevance === "Medium"
                                ? "border-yellow-200 text-yellow-600"
                                : "border-gray-200 text-gray-600"
                            }>
                              {trend.relevance} Relevance
                            </Badge>
                          </div>
                          <Badge className="bg-blue-500 md:ml-auto">
                            {trend.growth}% Growth
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{trend.description}</p>
                      </div>
                      
                      <div className="flex md:flex-col items-center gap-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">Details</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 py-4">
              <Button variant="ghost" size="sm">
                Previous
              </Button>
              <Button variant="ghost" size="sm">
                Next
              </Button>
            </CardFooter>
          </Card>
          
          {/* AI Insights */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                AI Market Insights
              </CardTitle>
              <CardDescription>
                AI-generated insights based on market trends analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Based on current trends, we predict the marketing analytics industry will grow by 18.5% in the next 12 months, with AI-powered solutions seeing the highest adoption rate.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Strategic Recommendations:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm">
                        <span className="font-medium">Accelerate AI features development:</span> Focus on predictive analytics and automated insights to capitalize on the growing AI trend.
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm">
                        <span className="font-medium">Target privacy-conscious market segment:</span> Develop and market privacy-first analytics features to address growing concerns.
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm">
                        <span className="font-medium">Consider strategic partnerships:</span> Potential collaborations with real-time data visualization providers could accelerate product development.
                      </p>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-muted-foreground">
                    Last updated: March 2, 2025 • AI confidence level: High
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
            <div className="flex gap-2">
              <Select defaultValue="potential">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="potential">Highest Potential</SelectItem>
                  <SelectItem value="competition">Lowest Competition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Opportunities
              </Button>
            </div>
          </div>
          
          {/* Opportunities List */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Market Opportunities</CardTitle>
              <CardDescription>
                AI-identified opportunities based on market gaps and trends
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {marketOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <h3 className="font-medium">{opportunity.opportunity}</h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={
                              opportunity.potential === "Very High" || opportunity.potential === "High"
                                ? "bg-green-500"
                                : opportunity.potential === "Medium"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                            }>
                              {opportunity.potential} Potential
                            </Badge>
                            <Badge variant="outline" className={
                              opportunity.competition === "Low"
                                ? "border-green-200 text-green-600"
                                : opportunity.competition === "Medium"
                                ? "border-yellow-200 text-yellow-600"
                                : "border-red-200 text-red-600"
                            }>
                              {opportunity.competition} Competition
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{opportunity.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Estimated Market Size</p>
                            <p className="text-sm font-medium">$120M - $180M</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Development Timeline</p>
                            <p className="text-sm font-medium">6-8 months</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Resource Requirement</p>
                            <p className="text-sm font-medium">Medium</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">ROI Potential</p>
                            <p className="text-sm font-medium">High (3-4x)</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button variant="default" size="sm">
                          Explore Opportunity
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* AI Strategy Recommendations */}
          <Card className="shadow-sm border-green-200 dark:border-green-900">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <AlertCircle className="h-5 w-5" />
                Strategic Recommendation
              </CardTitle>
              <CardDescription>
                AI-generated strategic recommendation based on opportunity analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  Based on our analysis, focusing on "AI-driven marketing strategy generation" offers the highest potential return with the lowest competition.
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  This aligns with your current strengths in AI technology and addresses a significant gap in the market.
                </p>
              </div>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Implementation Roadmap:</h4>
                  <ol className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium">1</div>
                      <p className="text-sm flex-1">
                        <span className="font-medium">Phase 1 (2 months):</span> Develop core AI marketing strategy algorithm and basic UI
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium">2</div>
                      <p className="text-sm flex-1">
                        <span className="font-medium">Phase 2 (2 months):</span> Beta testing with select customers, integrating feedback
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium">3</div>
                      <p className="text-sm flex-1">
                        <span className="font-medium">Phase 3 (4 months):</span> Full launch with premium tier, content generation, and analytics integration
                      </p>
                    </li>
                  </ol>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Create Development Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );}