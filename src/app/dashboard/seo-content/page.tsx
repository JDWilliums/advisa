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
  Search,
  FileText,
  Download,
  Save,
  Sparkles,
  BarChart2,
  RefreshCw,
  Edit,
  Globe,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Check,
  X,
  Copy,
  Calendar,
  Filter,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  List,
  PlusCircle,
  Star,
  Clock,
  Maximize2,
  Scissors,
  Layers,
  Send,
  Info,
  Eye,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock data for keyword analysis
const keywordsData = [
  {
    id: 1,
    keyword: "marketing analytics software",
    volume: 8200,
    difficulty: 78,
    cpc: 12.45,
    yourRanking: 8,
    change: 2,
    intent: "commercial",
  },
  {
    id: 2,
    keyword: "best marketing analytics tools",
    volume: 5400,
    difficulty: 65,
    cpc: 9.30,
    yourRanking: 12,
    change: -3,
    intent: "commercial",
  },
  {
    id: 3,
    keyword: "how to analyze marketing data",
    volume: 3800,
    difficulty: 42,
    cpc: 5.15,
    yourRanking: 4,
    change: 5,
    intent: "informational",
  },
  {
    id: 4,
    keyword: "marketing roi calculator",
    volume: 2900,
    difficulty: 51,
    cpc: 7.80,
    yourRanking: 15,
    change: 0,
    intent: "transactional",
  },
  {
    id: 5,
    keyword: "b2b marketing analytics",
    volume: 2200,
    difficulty: 68,
    cpc: 14.25,
    yourRanking: 7,
    change: 1,
    intent: "commercial",
  },
];

// Mock data for content suggestions
const contentSuggestions = [
  {
    id: 1,
    title: "10 Advanced Marketing Analytics Techniques Every CMO Should Know",
    type: "Blog Post",
    targetKeywords: ["advanced marketing analytics", "marketing analytics techniques", "cmo analytics"],
    difficulty: "Medium",
    estimatedImpact: "High",
    description: "Educational piece on cutting-edge analytics tactics with actionable takeaways for marketing leaders."
  },
  {
    id: 2,
    title: "The Ultimate Guide to Marketing Attribution Models",
    type: "Pillar Content",
    targetKeywords: ["marketing attribution", "attribution models", "marketing attribution guide"],
    difficulty: "High",
    estimatedImpact: "Very High",
    description: "Comprehensive guide explaining different attribution models with examples and implementation steps."
  },
  {
    id: 3,
    title: "Marketing Analytics ROI Calculator [Interactive Tool]",
    type: "Interactive Tool",
    targetKeywords: ["marketing roi calculator", "marketing analytics roi", "calculate marketing return"],
    difficulty: "Medium",
    estimatedImpact: "High",
    description: "Interactive calculator that helps marketers quantify the return on their analytics investments."
  },
  {
    id: 4,
    title: "5-Minute Marketing Analytics Audit Template [Download]",
    type: "Lead Magnet",
    targetKeywords: ["marketing analytics audit", "marketing data audit", "analytics audit template"],
    difficulty: "Low",
    estimatedImpact: "Medium",
    description: "Downloadable template that helps marketers quickly assess their analytics implementation."
  },
];

// Mock data for competitor content analysis
const competitorContent = [
  {
    id: 1,
    competitor: "MarketMaster",
    title: "The Complete Guide to Marketing Analytics Dashboards",
    url: "https://marketmaster.com/marketing-analytics-dashboards",
    publishDate: "Feb 15, 2025",
    wordCount: 3850,
    keywordsTargeted: ["marketing analytics dashboards", "marketing dashboards", "analytics visualization"],
    backlinks: 145,
    socialShares: 1280,
    estimatedTraffic: 4200
  },
  {
    id: 2,
    competitor: "PromoPro",
    title: "How to Choose the Right Marketing Analytics Platform: 7 Critical Factors",
    url: "https://promopro.io/marketing-analytics-platform-selection",
    publishDate: "Jan 22, 2025",
    wordCount: 2650,
    keywordsTargeted: ["marketing analytics platform", "analytics platform selection", "marketing analytics tools"],
    backlinks: 87,
    socialShares: 950,
    estimatedTraffic: 2800
  },
  {
    id: 3,
    competitor: "DataMarket",
    title: "Marketing Analytics vs Business Intelligence: Understanding the Difference",
    url: "https://datamarket.co/analytics-vs-bi",
    publishDate: "Mar 3, 2025",
    wordCount: 3100,
    keywordsTargeted: ["marketing analytics vs business intelligence", "analytics vs bi", "marketing bi"],
    backlinks: 62,
    socialShares: 745,
    estimatedTraffic: 1950
  },
];

// Mock data for content performance
const contentPerformance = [
  {
    id: 1,
    title: "How AI is Revolutionizing Marketing Analytics",
    url: "/blog/ai-marketing-analytics",
    publishDate: "Feb 10, 2025",
    pageviews: 8750,
    uniqueVisitors: 6240,
    avgTimeOnPage: "4:32",
    bounceRate: "32%",
    conversionRate: "3.8%",
    backlinks: 85,
    rankings: [
      { keyword: "ai marketing analytics", position: 3 },
      { keyword: "artificial intelligence marketing", position: 8 },
      { keyword: "marketing ai tools", position: 5 }
    ]
  },
  {
    id: 2,
    title: "The Beginner's Guide to Marketing Attribution",
    url: "/blog/marketing-attribution-guide",
    publishDate: "Jan 15, 2025",
    pageviews: 12350,
    uniqueVisitors: 9840,
    avgTimeOnPage: "6:15",
    bounceRate: "28%",
    conversionRate: "5.2%",
    backlinks: 132,
    rankings: [
      { keyword: "marketing attribution guide", position: 2 },
      { keyword: "marketing attribution basics", position: 1 },
      { keyword: "attribution models marketing", position: 4 }
    ]
  },
  {
    id: 3,
    title: "10 Marketing Analytics KPIs Every Business Should Track",
    url: "/blog/essential-marketing-kpis",
    publishDate: "Mar 5, 2025",
    pageviews: 6420,
    uniqueVisitors: 5340,
    avgTimeOnPage: "3:45",
    bounceRate: "35%",
    conversionRate: "2.9%",
    backlinks: 57,
    rankings: [
      { keyword: "marketing analytics kpis", position: 6 },
      { keyword: "essential marketing metrics", position: 9 },
      { keyword: "marketing kpi tracking", position: 7 }
    ]
  },
];
export default function SeoContentPage() {
    const [activeTab, setActiveTab] = useState("keyword-research");
    const [currentContentType, setCurrentContentType] = useState("all");
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">SEO & Content Optimization</h1>
          <p className="text-muted-foreground">
            Optimize your content strategy with data-driven keyword insights and AI-powered content generation
          </p>
        </div>
  
        <Tabs defaultValue="keyword-research" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="keyword-research">Keyword Research</TabsTrigger>
            <TabsTrigger value="content-ideas">Content Ideas</TabsTrigger>
            <TabsTrigger value="content-optimizer">Content Optimizer</TabsTrigger>
            <TabsTrigger value="content-performance">Performance</TabsTrigger>
          </TabsList>
          
          {/* Keyword Research Tab */}
          <TabsContent value="keyword-research" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search keywords or add new ones..." 
                    className="pl-9"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="volume">Search Volume</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                      <SelectItem value="ranking">Your Ranking</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Intent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Intents</SelectItem>
                      <SelectItem value="informational">Informational</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                      <SelectItem value="navigational">Navigational</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Keywords
                </Button>
              </div>
            </div>
            
            {/* Keyword Overview Cards */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Tracked Keywords</h3>
                      <Badge className="bg-blue-500">67</Badge>
                    </div>
                    <div className="mt-6">
                      <div className="text-2xl font-bold">67</div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 font-medium">12</span>
                        <span>new this month</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Avg. Position</h3>
                      <Badge className={12 <= 10 ? "bg-green-500" : "bg-yellow-500"}>
                        12
                      </Badge>
                    </div>
                    <div className="mt-6">
                      <div className="text-2xl font-bold">12.4</div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 font-medium">2.3</span>
                        <span>positions up</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Top 10 Rankings</h3>
                      <Badge className="bg-green-500">23</Badge>
                    </div>
                    <div className="mt-6">
                      <div className="text-2xl font-bold">23</div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 font-medium">5</span>
                        <span>from last month</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Estimated Traffic</h3>
                      <Badge className="bg-blue-500">46.2K</Badge>
                    </div>
                    <div className="mt-6">
                      <div className="text-2xl font-bold">46,235</div>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <ArrowUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-500 font-medium">18.4%</span>
                        <span>growth</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Keywords Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Keyword Analysis</CardTitle>
              <CardDescription>
                Track your keyword rankings and opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-sm font-medium">
                  <div className="col-span-4">Keyword</div>
                  <div className="col-span-1 text-center">Volume</div>
                  <div className="col-span-2 text-center">Difficulty</div>
                  <div className="col-span-1 text-center">CPC</div>
                  <div className="col-span-2 text-center">Your Ranking</div>
                  <div className="col-span-1 text-center">Intent</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {keywordsData.map((keyword) => (
                  <div key={keyword.id} className="grid grid-cols-12 gap-2 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="col-span-4 font-medium">{keyword.keyword}</div>
                    
                    <div className="col-span-1 text-center">
                      {keyword.volume.toLocaleString()}
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex flex-col items-center">
                        <div className="w-full flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${
                            keyword.difficulty >= 70 ? "text-red-500" : 
                            keyword.difficulty >= 40 ? "text-yellow-500" : 
                            "text-green-500"
                          }`}>
                            {keyword.difficulty}/100
                          </span>
                        </div>
                        <Progress 
                            value={keyword.difficulty} 
                            className="h-1.5 w-full" 
                            // Remove the indicatorClassName property and use something like this:
                            // style={{
                            //   '--progress-foreground': keyword.difficulty >= 70 ? 'rgb(239, 68, 68)' : 
                            //                            keyword.difficulty >= 40 ? 'rgb(234, 179, 8)' : 
                            //                            'rgb(34, 197, 94)'
                            // }}
                            />
                      </div>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      ${keyword.cpc.toFixed(2)}
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex items-center justify-center gap-2">
                        <Badge className={
                          keyword.yourRanking <= 3 ? "bg-green-500" : 
                          keyword.yourRanking <= 10 ? "bg-blue-500" : 
                          "bg-yellow-500"
                        }>
                          {keyword.yourRanking}
                        </Badge>
                        
                        {keyword.change !== 0 && (
                          <div className="flex items-center">
                            {keyword.change > 0 ? (
                              <ChevronUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-xs ${keyword.change > 0 ? "text-green-500" : "text-red-500"}`}>
                              {Math.abs(keyword.change)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <Badge variant="outline" className={`text-xs ${
                        keyword.intent === "informational" ? "border-blue-200 text-blue-700 dark:text-blue-400" :
                        keyword.intent === "commercial" ? "border-purple-200 text-purple-700 dark:text-purple-400" :
                        keyword.intent === "transactional" ? "border-green-200 text-green-700 dark:text-green-400" :
                        "border-gray-200 text-gray-700 dark:text-gray-400"
                      }`}>
                        {keyword.intent}
                      </Badge>
                    </div>
                    
                    <div className="col-span-1 flex justify-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="text-sm text-muted-foreground">
                Showing 5 of 67 keywords
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Keyword Clusters */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Keyword Clusters</CardTitle>
              <CardDescription>
                AI-generated topic clusters based on your keyword data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    Marketing Analytics Basics
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>marketing analytics tools</span>
                      <span className="text-xs">5.4K</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>marketing analytics software</span>
                      <span className="text-xs">8.2K</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>best marketing analytics</span>
                      <span className="text-xs">3.1K</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    12 keywords in this cluster
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    ROI & Performance
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>marketing roi calculator</span>
                      <span className="text-xs">2.9K</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>measure marketing performance</span>
                      <span className="text-xs">2.3K</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>marketing analytics roi</span>
                      <span className="text-xs">1.8K</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    9 keywords in this cluster
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                    B2B Marketing
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>b2b marketing analytics</span>
                      <span className="text-xs">2.2K</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>b2b analytics tools</span>
                      <span className="text-xs">1.7K</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>b2b marketing data</span>
                      <span className="text-xs">1.5K</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    8 keywords in this cluster
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm">
                  View All Clusters
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Content Ideas Tab */}
        <TabsContent value="content-ideas" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search content ideas..." 
                  className="pl-9"
                />
              </div>
              
              <div className="flex gap-2">
                <Select defaultValue="all" onValueChange={setCurrentContentType}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="blog">Blog Posts</SelectItem>
                    <SelectItem value="pillar">Pillar Content</SelectItem>
                    <SelectItem value="lead-magnet">Lead Magnets</SelectItem>
                    <SelectItem value="interactive">Interactive Tools</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="impact">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impact">Highest Impact</SelectItem>
                    <SelectItem value="difficulty-asc">Easiest to Create</SelectItem>
                    <SelectItem value="difficulty-desc">Most Challenging</SelectItem>
                    <SelectItem value="recent">Recently Added</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Ideas
              </Button>
            </div>
          </div>
          
          {/* AI Content Suggestion Cards */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {contentSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge className={
                      suggestion.type === "Blog Post" ? "bg-blue-500" :
                      suggestion.type === "Pillar Content" ? "bg-purple-500" :
                      suggestion.type === "Interactive Tool" ? "bg-orange-500" :
                      "bg-green-500"
                    }>
                      {suggestion.type}
                    </Badge>
                    <div className="flex items-center">
                      <div className="flex items-center mr-3">
                        <span className="text-xs mr-1">Impact:</span>
                        <Badge className={
                          suggestion.estimatedImpact === "Very High" || suggestion.estimatedImpact === "High" ? "bg-green-500" :
                          suggestion.estimatedImpact === "Medium" ? "bg-yellow-500" :
                          "bg-gray-500"
                        }>
                          {suggestion.estimatedImpact}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs mr-1">Difficulty:</span>
                        <Badge variant="outline" className={
                          suggestion.difficulty === "High" ? "border-red-200 text-red-600" :
                          suggestion.difficulty === "Medium" ? "border-yellow-200 text-yellow-600" :
                          "border-green-200 text-green-600"
                        }>
                          {suggestion.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    {suggestion.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.targetKeywords.map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
                    <Button size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Content Generation */}
          <Card className="shadow-sm border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                AI Content Generator
              </CardTitle>
              <CardDescription>
                Generate optimized content based on your target keywords and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-title">Content Title</Label>
                <Input 
                  id="content-title" 
                  placeholder="Enter a title for your content" 
                  defaultValue="The Ultimate Guide to Marketing Attribution Models"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select defaultValue="pillar">
                    <SelectTrigger id="content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="pillar">Pillar Content</SelectItem>
                      <SelectItem value="case-study">Case Study</SelectItem>
                      <SelectItem value="white-paper">White Paper</SelectItem>
                      <SelectItem value="ebook">E-Book</SelectItem>
                      <SelectItem value="landing-page">Landing Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="word-count">Word Count</Label>
                  <Select defaultValue="2000">
                    <SelectTrigger id="word-count">
                      <SelectValue placeholder="Select word count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">~500 words (Short)</SelectItem>
                      <SelectItem value="1000">~1,000 words (Medium)</SelectItem>
                      <SelectItem value="2000">~2,000 words (Comprehensive)</SelectItem>
                      <SelectItem value="3000">~3,000+ words (In-depth)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Target Keywords (up to 5)</Label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="flex items-center gap-1">
                      marketing attribution
                      <button className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                    <Badge className="flex items-center gap-1">
                      attribution models
                      <button className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                    <Badge className="flex items-center gap-1">
                      marketing attribution guide
                      <button className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                    <Input 
                      className="border-0 bg-transparent w-32 p-0 h-6 text-sm"
                      placeholder="Add keyword..." 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content-brief">Content Brief</Label>
                <Textarea 
                  id="content-brief" 
                  placeholder="Describe what you want the content to cover..."
                  defaultValue="A comprehensive guide explaining different attribution models with examples and implementation steps. Should cover first-click, last-click, linear, position-based, and data-driven attribution models. Include practical advice for choosing the right model based on business type."
                  className="min-h-20"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Content Tone</Label>
                <RadioGroup defaultValue="educational" className="flex flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="educational" id="educational" />
                    <Label htmlFor="educational" className="cursor-pointer">Educational</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional" className="cursor-pointer">Professional</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="conversational" id="conversational" />
                    <Label htmlFor="conversational" className="cursor-pointer">Conversational</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="persuasive" id="persuasive" />
                    <Label htmlFor="persuasive" className="cursor-pointer">Persuasive</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="seo-focus">SEO Optimization Level</Label>
                  <span className="text-xs text-muted-foreground">Balanced</span>
                </div>
                <Slider 
                  id="seo-focus"
                  defaultValue={[50]} 
                  max={100} 
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Reader-focused</span>
                  <span>SEO-focused</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button variant="outline">
                Save as Draft
              </Button>
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        {/* Content Optimizer Tab */}
<TabsContent value="content-optimizer" className="space-y-6">
  <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
    <div>
      <h2 className="text-lg font-bold">Content Optimizer</h2>
      <p className="text-sm text-muted-foreground">
        Get real-time SEO recommendations as you write and edit your content
      </p>
    </div>
    
    <div className="flex gap-2">
      <Button variant="outline">
        <Upload className="h-4 w-4 mr-2" />
        Import Content
      </Button>
      
      <Button>
        <Lightbulb className="h-4 w-4 mr-2" />
        Optimize Content
      </Button>
    </div>
  </div>
  
  {/* Content Editor Area */}
  <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
    <div className="lg:col-span-2 space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Content Editor</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Scissors className="h-4 w-4 mr-2" />
                Trim
              </Button>
              <Button variant="ghost" size="sm">
                <Layers className="h-4 w-4 mr-2" />
                Simplify
              </Button>
              <Button variant="ghost" size="sm">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content-title">Title</Label>
              <Input 
                id="content-title" 
                placeholder="Enter content title" 
                defaultValue="The Ultimate Guide to Marketing Attribution Models" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content-body">Content</Label>
              <Textarea 
                id="content-body" 
                placeholder="Write your content here..."
                className="min-h-[300px] font-mono"
                defaultValue={`# The Ultimate Guide to Marketing Attribution Models

## Introduction

Understanding how your marketing efforts influence customer conversions is essential for optimizing your marketing strategy and budget allocation. Marketing attribution models provide a framework for determining which touchpoints and channels deserve credit for driving conversions.

This comprehensive guide will explore different attribution models, their pros and cons, and how to select the right model for your business needs.

## What is Marketing Attribution?

Marketing attribution is the process of identifying which marketing tactics and touchpoints contribute to sales or conversions. By implementing attribution models, marketers can:

- Determine which channels drive the most value
- Optimize marketing spend allocation
- Understand the customer journey
- Improve ROI on marketing investments

## Common Attribution Models

### First-Click Attribution

First-click attribution gives 100% credit to the first touchpoint a customer interacts with. This model...`}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <div className="space-y-4">
      {/* SEO Score */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>SEO Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold">83</div>
                <div className="text-sm">/100</div>
              </div>
              {/* This would be a circular progress indicator in a real implementation */}
              <div className="absolute inset-0 rounded-full border-8 border-green-500 opacity-60"></div>
            </div>
            
            <div className="w-full space-y-3 mt-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Content Length</span>
                  <span className="font-medium text-green-600">Good</span>
                </div>
                <Progress value={90} className="h-1.5" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Keyword Usage</span>
                  <span className="font-medium text-green-600">Good</span>
                </div>
                <Progress value={85} className="h-1.5" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Readability</span>
                  <span className="font-medium text-yellow-600">Fair</span>
                </div>
                <Progress value={68} className="h-1.5" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Link Structure</span>
                  <span className="font-medium text-red-600">Poor</span>
                </div>
                <Progress value={45} className="h-1.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Keyword Optimization */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Keyword Optimization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Primary Keyword</h4>
                <Badge className="bg-green-500">Optimized</Badge>
              </div>
              <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <span className="text-sm font-medium">marketing attribution models</span>
                <span className="ml-auto text-xs">5 uses</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Secondary Keywords</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span className="text-sm">marketing attribution</span>
                  <div className="flex items-center">
                    <span className="text-xs mr-2">8 uses</span>
                    <Badge className="bg-green-500">✓</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span className="text-sm">attribution models</span>
                  <div className="flex items-center">
                    <span className="text-xs mr-2">6 uses</span>
                    <Badge className="bg-green-500">✓</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span className="text-sm">first-click attribution</span>
                  <div className="flex items-center">
                    <span className="text-xs mr-2">1 use</span>
                    <Badge className="bg-yellow-500">+</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Suggested Keywords</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span className="text-sm">multi-touch attribution</span>
                  <div className="flex items-center">
                    <span className="text-xs mr-2">0 uses</span>
                    <Button variant="ghost" size="sm" className="h-6 py-0 px-2">
                      <PlusCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <span className="text-sm">data-driven attribution</span>
                  <div className="flex items-center">
                    <span className="text-xs mr-2">0 uses</span>
                    <Button variant="ghost" size="sm" className="h-6 py-0 px-2">
                      <PlusCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Improvement Suggestions */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Improvement Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                  Add more internal links
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                  Content has only 1 internal link. Try adding 3-5 more links to related content.
                </p>
              </div>
            </div>
            
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Improve readability
                </p>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                  Some paragraphs are too long. Break down paragraphs longer than 3-4 sentences.
                </p>
              </div>
            </div>
            
            <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Good heading structure
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                  Headers are well-structured with proper H1, H2, and H3 hierarchy.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Optimization Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</TabsContent>

        {/* Content Performance Tab */}
        <TabsContent value="content-performance" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
            <div>
              <h2 className="text-lg font-bold">Content Performance</h2>
              <p className="text-sm text-muted-foreground">
                Track and analyze how your content is performing in search and with users
              </p>
            </div>
            
            <div className="flex gap-2">
              <Select defaultValue="30days">
                <SelectTrigger className="w-[160px]">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">Last 12 months</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          
          {/* Content Performance Stats */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Pageviews</h3>
                    <Badge className="bg-blue-500">27.5K</Badge>
                  </div>
                  <div className="mt-6">
                    <div className="text-2xl font-bold">27,520</div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 font-medium">12.3%</span>
                      <span>vs. previous period</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Avg. Time on Page</h3>
                    <Badge className="bg-green-500">4:12</Badge>
                  </div>
                  <div className="mt-6">
                    <div className="text-2xl font-bold">4:12</div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 font-medium">0:42</span>
                      <span>vs. previous period</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Conversion Rate</h3>
                    <Badge className="bg-green-500">3.8%</Badge>
                  </div>
                  <div className="mt-6">
                    <div className="text-2xl font-bold">3.8%</div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 font-medium">0.5%</span>
                      <span>vs. previous period</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Backlinks</h3>
                    <Badge className="bg-blue-500">274</Badge>
                  </div>
                  <div className="mt-6">
                    <div className="text-2xl font-bold">274</div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500 font-medium">42</span>
                      <span>new this period</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Performing Content */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>
                Your best performing content based on pageviews and engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-sm font-medium">
                  <div className="col-span-4">Page Title</div>
                  <div className="col-span-1 text-center">Pageviews</div>
                  <div className="col-span-2 text-center">Avg. Time</div>
                  <div className="col-span-1 text-center">Bounce</div>
                  <div className="col-span-1 text-center">Conv.</div>
                  <div className="col-span-2 text-center">Rankings</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {contentPerformance.map((content) => (
                  <div key={content.id} className="grid grid-cols-12 gap-2 px-6 py-4 items-center text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="col-span-4">
                      <div>
                        <p className="font-medium mb-1">{content.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Globe className="h-3 w-3 mr-1" />
                          <span>{content.url}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{content.publishDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      {content.pageviews.toLocaleString()}
                    </div>
                    
                    <div className="col-span-2 text-center">
                      {content.avgTimeOnPage}
                    </div>
                    
                    <div className="col-span-1 text-center">
                      {content.bounceRate}
                    </div>
                    
                    <div className="col-span-1 text-center">
                      {content.conversionRate}
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex flex-col space-y-1">
                        {content.rankings.slice(0, 2).map((ranking, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="truncate max-w-24">{ranking.keyword}</span>
                            <Badge className={
                              ranking.position <= 3 ? "bg-green-500" :
                              ranking.position <= 10 ? "bg-blue-500" :
                              "bg-yellow-500"
                            }>
                              #{ranking.position}
                            </Badge>
                          </div>
                        ))}
                        {content.rankings.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{content.rankings.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-span-1 flex justify-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="text-sm text-muted-foreground">
                Showing 3 of 24 pages
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Competitor Content Analysis */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Competitor Content Analysis</CardTitle>
              <CardDescription>
                Top performing content from your competitors
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-sm font-medium">
                  <div className="col-span-4">Content Title</div>
                  <div className="col-span-2">Competitor</div>
                  <div className="col-span-1 text-center">Words</div>
                  <div className="col-span-1 text-center">Links</div>
                  <div className="col-span-1 text-center">Shares</div>
                  <div className="col-span-2 text-center">Est. Traffic</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {competitorContent.map((content) => (
                  <div key={content.id} className="grid grid-cols-12 gap-2 px-6 py-4 items-center text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="col-span-4">
                      <div>
                        <p className="font-medium mb-1">{content.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Globe className="h-3 w-3 mr-1" />
                          <a 
                            href={content.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center hover:text-blue-500"
                          >
                            {content.url.replace(/^https?:\/\//, '')}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{content.publishDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <Badge variant="outline" className="font-medium">
                        {content.competitor}
                      </Badge>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      {content.wordCount.toLocaleString()}
                    </div>
                    
                    <div className="col-span-1 text-center">
                      {content.backlinks}
                    </div>
                    
                    <div className="col-span-1 text-center">
                      {content.socialShares.toLocaleString()}
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <Badge className="bg-blue-500">
                        {content.estimatedTraffic.toLocaleString()}
                      </Badge>
                    </div>
                    
                    <div className="col-span-1 flex justify-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Create better content">
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="text-sm text-muted-foreground">
                Showing 3 of 18 competitor articles
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Content Gap Analysis */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Content Gap Analysis
              </CardTitle>
              <CardDescription>
                Topics and keywords that competitors rank for but you don't
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-100 dark:border-amber-800">
                  <h4 className="font-medium flex items-center gap-2">
                    <Info className="h-4 w-4 text-amber-500" />
                    Content Opportunity
                  </h4>
                  <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                    Competitors have 45 pieces of content ranking on page 1 for keywords where you're not ranking at all. These represent your biggest content gap opportunities.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Top Content Gap Keywords</h4>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    <div className="grid grid-cols-12 gap-2 py-2 text-sm">
                      <div className="col-span-4">marketing attribution tools</div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="font-medium">
                          MarketMaster
                        </Badge>
                      </div>
                      <div className="col-span-1 text-center">4.2K</div>
                      <div className="col-span-2 text-center">
                        <Badge className="bg-green-500">#3</Badge>
                      </div>
                      <div className="col-span-1 text-center">
                        <Badge className="bg-red-500">-</Badge>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button variant="ghost" size="sm">Create Content</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-2 py-2 text-sm">
                      <div className="col-span-4">google analytics attribution</div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="font-medium">
                          PromoPro
                        </Badge>
                      </div>
                      <div className="col-span-1 text-center">3.8K</div>
                      <div className="col-span-2 text-center">
                        <Badge className="bg-green-500">#5</Badge>
                      </div>
                      <div className="col-span-1 text-center">
                        <Badge className="bg-red-500">-</Badge>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button variant="ghost" size="sm">Create Content</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-2 py-2 text-sm">
                      <div className="col-span-4">data-driven marketing dashboard</div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="font-medium">
                          DataMarket
                        </Badge>
                      </div>
                      <div className="col-span-1 text-center">2.9K</div>
                      <div className="col-span-2 text-center">
                        <Badge className="bg-green-500">#7</Badge>
                      </div>
                      <div className="col-span-1 text-center">
                        <Badge className="bg-red-500">-</Badge>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button variant="ghost" size="sm">Create Content</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 flex justify-center">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Gap Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );}