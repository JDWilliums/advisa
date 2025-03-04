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
  TrendingUp,
  Download,
  Calendar,
  Filter,
  BarChart2,
  DollarSign,
  Users,
  Eye,
  ThumbsUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  Search,
  Zap,
  Target,
  Info,
  Lightbulb,
  Activity,
  FileText,
  PlusCircle,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock data for ad platforms
const adPlatforms = [
  { id: "google", name: "Google Ads", icon: Search, color: "text-blue-500", campaigns: 8, spend: 12500, conversions: 364, cpa: 34.34 },
  { id: "meta", name: "Meta Ads", icon: ThumbsUp, color: "text-indigo-500", campaigns: 6, spend: 8750, conversions: 218, cpa: 40.14 },
  { id: "linkedin", name: "LinkedIn Ads", icon: Users, color: "text-sky-500", campaigns: 3, spend: 6200, conversions: 94, cpa: 65.96 },
  { id: "twitter", name: "Twitter Ads", icon: TrendingUp, color: "text-cyan-500", campaigns: 2, spend: 2800, conversions: 52, cpa: 53.85 }
];

// Mock data for campaign performance
const campaignPerformance = [
  {
    id: 1,
    name: "Summer Product Launch",
    platform: "Google Ads",
    type: "Search",
    status: "Active",
    startDate: "2025-03-01",
    impressions: 125480,
    clicks: 4890,
    ctr: 3.9,
    conversions: 185,
    conversionRate: 3.78,
    spend: 4350.25,
    cpa: 23.51,
    roas: 4.2,
    change: {
      ctr: 0.5,
      conversions: 12,
      cpa: -2.15
    }
  },
  {
    id: 2,
    name: "Retargeting Campaign",
    platform: "Meta Ads",
    type: "Display",
    status: "Active",
    startDate: "2025-02-15",
    impressions: 98760,
    clicks: 3240,
    ctr: 3.28,
    conversions: 142,
    conversionRate: 4.38,
    spend: 3180.50,
    cpa: 22.40,
    roas: 4.8,
    change: {
      ctr: 0.3,
      conversions: 8,
      cpa: -1.85
    }
  },
  {
    id: 3,
    name: "B2B Lead Generation",
    platform: "LinkedIn Ads",
    type: "Sponsored Content",
    status: "Active",
    startDate: "2025-02-20",
    impressions: 45320,
    clicks: 1850,
    ctr: 4.08,
    conversions: 58,
    conversionRate: 3.14,
    spend: 4120.75,
    cpa: 71.05,
    roas: 3.2,
    change: {
      ctr: -0.2,
      conversions: -3,
      cpa: 4.30
    }
  },
  {
    id: 4,
    name: "Brand Awareness",
    platform: "Twitter Ads",
    type: "Promoted Tweets",
    status: "Paused",
    startDate: "2025-01-10",
    impressions: 32540,
    clicks: 920,
    ctr: 2.83,
    conversions: 28,
    conversionRate: 3.04,
    spend: 1470.30,
    cpa: 52.51,
    roas: 2.5,
    change: {
      ctr: 0.8,
      conversions: 5,
      cpa: -4.20
    }
  },
  {
    id: 5,
    name: "Product Remarketing",
    platform: "Google Ads",
    type: "Display",
    status: "Active",
    startDate: "2025-02-05",
    impressions: 87650,
    clicks: 2340,
    ctr: 2.67,
    conversions: 95,
    conversionRate: 4.06,
    spend: 2560.40,
    cpa: 26.95,
    roas: 3.9,
    change: {
      ctr: 0.2,
      conversions: 15,
      cpa: -3.40
    }
  }
];

// Mock data for ad creative performance
const adCreativesPerformance = [
  {
    id: 1,
    name: "Product Demo Video",
    platform: "Meta Ads",
    format: "Video",
    impressions: 65420,
    clicks: 2540,
    ctr: 3.88,
    conversions: 115,
    conversionRate: 4.53,
    spend: 2980.50,
    cpa: 25.92,
    previewUrl: "/ads/demo-video.mp4",
    thumbnailUrl: "https://placehold.co/300x200/333/white?text=Video+Ad"
  },
  {
    id: 2,
    name: "Customer Testimonial",
    platform: "LinkedIn Ads",
    format: "Image",
    impressions: 28760,
    clicks: 1180,
    ctr: 4.10,
    conversions: 42,
    conversionRate: 3.56,
    spend: 2450.75,
    cpa: 58.35,
    previewUrl: "/ads/testimonial.jpg",
    thumbnailUrl: "https://placehold.co/300x200/2563eb/white?text=Testimonial"
  },
  {
    id: 3,
    name: "Limited Time Offer",
    platform: "Google Ads",
    format: "Responsive",
    impressions: 72840,
    clicks: 3120,
    ctr: 4.28,
    conversions: 128,
    conversionRate: 4.10,
    spend: 3240.60,
    cpa: 25.32,
    previewUrl: "/ads/limited-offer.html",
    thumbnailUrl: "https://placehold.co/300x200/10b981/white?text=Limited+Offer"
  },
  {
    id: 4,
    name: "Product Features",
    platform: "Meta Ads",
    format: "Carousel",
    impressions: 54320,
    clicks: 1980,
    ctr: 3.65,
    conversions: 76,
    conversionRate: 3.84,
    spend: 2180.40,
    cpa: 28.69,
    previewUrl: "/ads/features-carousel.html",
    thumbnailUrl: "https://placehold.co/300x200/8b5cf6/white?text=Carousel"
  }
];

// Mock data for audience insights
const audienceInsights = [
  {
    category: "Age",
    segments: [
      { name: "18-24", percentage: 12, conversions: 42, cpa: 38.50 },
      { name: "25-34", percentage: 34, conversions: 215, cpa: 24.82 },
      { name: "35-44", percentage: 28, conversions: 186, cpa: 28.35 },
      { name: "45-54", percentage: 16, conversions: 95, cpa: 35.40 },
      { name: "55+", percentage: 10, conversions: 48, cpa: 42.75 }
    ]
  },
  {
    category: "Gender",
    segments: [
      { name: "Male", percentage: 58, conversions: 328, cpa: 31.25 },
      { name: "Female", percentage: 42, conversions: 258, cpa: 29.80 }
    ]
  },
  {
    category: "Device",
    segments: [
      { name: "Mobile", percentage: 63, conversions: 362, cpa: 28.40 },
      { name: "Desktop", percentage: 32, conversions: 205, cpa: 34.65 },
      { name: "Tablet", percentage: 5, conversions: 19, cpa: 39.20 }
    ]
  },
  {
    category: "Location",
    segments: [
      { name: "United States", percentage: 68, conversions: 384, cpa: 30.15 },
      { name: "Canada", percentage: 15, conversions: 92, cpa: 32.45 },
      { name: "United Kingdom", percentage: 10, conversions: 65, cpa: 35.80 },
      { name: "Australia", percentage: 7, conversions: 45, cpa: 38.25 }
    ]
  }
];

// Mock data for ROI by channel
const roiByChannel = [
  { channel: "Google Search", spend: 8200.50, revenue: 38540.25, roi: 370 },
  { channel: "Google Display", spend: 4300.75, revenue: 15480.60, roi: 260 },
  { channel: "Facebook Feed", spend: 5620.25, revenue: 24380.80, roi: 334 },
  { channel: "Instagram Stories", spend: 3130.50, revenue: 12850.35, roi: 311 },
  { channel: "LinkedIn Sponsored", spend: 6200.40, revenue: 21700.50, roi: 250 },
  { channel: "Twitter Promoted", spend: 2800.30, revenue: 8400.90, roi: 200 }
];

export default function AdPerformancePage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [dateRange, setDateRange] = useState("30days");
    
    // Calculate totals for overview stats
    const totalSpend = adPlatforms.reduce((sum, platform) => sum + platform.spend, 0);
    const totalConversions = adPlatforms.reduce((sum, platform) => sum + platform.conversions, 0);
    const totalCampaigns = adPlatforms.reduce((sum, platform) => sum + platform.campaigns, 0);
    const avgCpa = totalSpend / totalConversions;
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Ad Performance Analyzer</h1>
          <p className="text-muted-foreground">
            Monitor and optimize your ad campaigns across multiple platforms
          </p>
        </div>
        
  
        {/* Date Range and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <Select defaultValue={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last 12 months</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="meta">Meta Ads</SelectItem>
                  <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                  <SelectItem value="twitter">Twitter Ads</SelectItem>
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
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
  
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="creatives">Ad Creatives</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Platform Performance Summary */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Total Ad Spend
                      </p>
                      <p className="text-2xl font-bold">${totalSpend.toLocaleString()}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-500">
                          8.2%
                        </span>
                        <span className="text-xs text-muted-foreground">vs. last period</span>
                      </div>
                    </div>
                    <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                      <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Total Conversions
                      </p>
                      <p className="text-2xl font-bold">{totalConversions}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-500">
                          12.5%
                        </span>
                        <span className="text-xs text-muted-foreground">vs. last period</span>
                      </div>
                    </div>
                    <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                      <Target className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Average CPA
                      </p>
                      <p className="text-2xl font-bold">${avgCpa.toFixed(2)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-500">
                          3.8%
                        </span>
                        <span className="text-xs text-muted-foreground">vs. last period</span>
                      </div>
                    </div>
                    <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                      <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Active Campaigns
                      </p>
                      <p className="text-2xl font-bold">{totalCampaigns}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-500">
                          2
                        </span>
                        <span className="text-xs text-muted-foreground">new this period</span>
                      </div>
                    </div>
                    <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                      <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Platform Performance Cards */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>
                  Compare the performance of your different ad platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {adPlatforms.map((platform) => (
                    <div 
                      key={platform.id} 
                      className="flex flex-col p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${platform.color}`}>
                          <platform.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium">{platform.name}</h3>
                          <p className="text-sm text-muted-foreground">{platform.campaigns} campaigns</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Spend</p>
                          <p className="text-lg font-medium">${platform.spend.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Conversions</p>
                          <p className="text-lg font-medium">{platform.conversions}</p>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm">Cost Per Acquisition</p>
                          <p className="text-sm font-medium">${platform.cpa.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center">
                          <Progress 
                            value={100 - ((platform.cpa / 100) * 100)} 
                            className="h-1.5 mr-2 flex-1"
                          />
                          <div className="flex items-center gap-1 text-xs">
                            <ArrowDownRight className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-500">2.3%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* ROI by Channel */}
            <Card className="shadow-sm">
              <CardHeader className="flex items-center justify-between pb-2">
                <div>
                  <CardTitle>ROI by Channel</CardTitle>
                  <CardDescription>
                    Return on investment across different ad channels
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  View Detailed Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roiByChannel.map((channel, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{channel.channel}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-28 text-right">
                            ${channel.spend.toLocaleString()} spent
                          </span>
                          <span className="text-xs font-medium w-24 text-right">
                            {channel.roi}% ROI
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={channel.roi / 5} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-28">
                          ${channel.revenue.toLocaleString()} revenue
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 md:hidden">
                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* AI Insights */}
            <Card className="shadow-sm border-blue-200 dark:border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-500" />
                  AI Performance Insights
                </CardTitle>
                <CardDescription>
                  AI-generated recommendations based on your ad performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Your Meta Ads campaigns are outperforming other platforms with a conversion rate 22% higher than the average. Consider reallocating budget from Twitter Ads to Meta for a potential 15% increase in overall conversions.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        Top Performance
                      </h4>
                      <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      &ldquo;Summer Product Launch&rdquo; campaign has the highest ROAS (4.2x) and lowest CPA ($23.51) among all campaigns.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-800">
                      <h4 className="text-sm font-medium text-red-800 dark:text-red-300 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Performance Alert
                      </h4>
                      <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                      &ldquo;B2B Lead Generation&rdquo; on LinkedIn has seen a 3% decrease in conversions and 4.3% increase in CPA in the last 14 days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-100 dark:border-amber-800">
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Optimization Opportunity
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      25-34 age group has 38% higher conversion rates but only receiving 22% of your ad budget. Increasing budget allocation to this demographic could improve overall campaign performance.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 text-right">
                  <Button variant="outline" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Detailed Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        
          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search campaigns..." 
                    className="pl-9"
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="meta">Meta Ads</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    <SelectItem value="twitter">Twitter Ads</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </div>
            
            {/* Campaign Table */}
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left p-4 font-medium text-muted-foreground text-sm">Campaign</th>
                        <th className="text-left p-4 font-medium text-muted-foreground text-sm">Platform</th>
                        <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                        <th className="text-right p-4 font-medium text-muted-foreground text-sm">Impressions</th>
                        <th className="text-right p-4 font-medium text-muted-foreground text-sm">CTR</th>
                        <th className="text-right p-4 font-medium text-muted-foreground text-sm">Conv.</th>
                        <th className="text-right p-4 font-medium text-muted-foreground text-sm">Spend</th>
                        <th className="text-right p-4 font-medium text-muted-foreground text-sm">CPA</th>
                        <th className="text-right p-4 font-medium text-muted-foreground text-sm">ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignPerformance.map((campaign) => (
                        <tr 
                          key={campaign.id} 
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-medium truncate max-w-[180px]">{campaign.name}</p>
                              <p className="text-xs text-muted-foreground">{campaign.type}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{campaign.platform}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge 
                              className={
                                campaign.status === "Active" ? "bg-green-500" :
                                campaign.status === "Paused" ? "bg-amber-500" :
                                "bg-gray-500"
                              }
                            >
                              {campaign.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">{campaign.impressions.toLocaleString()}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {campaign.ctr.toFixed(2)}%
                              {campaign.change.ctr > 0 ? (
                                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 text-red-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {campaign.conversions}
                              {campaign.change.conversions > 0 ? (
                                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <ArrowDownRight className="h-3 w-3 text-red-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">${campaign.spend.toLocaleString()}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              ${campaign.cpa.toFixed(2)}
                              {campaign.change.cpa < 0 ? (
                                <ArrowDownRight className="h-3 w-3 text-emerald-500" />
                              ) : (
                                <ArrowUpRight className="h-3 w-3 text-red-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">{campaign.roas.toFixed(1)}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Ad Creatives Tab */}
          <TabsContent value="creatives" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search ad creatives..." 
                    className="pl-9"
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="meta">Meta Ads</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    <SelectItem value="twitter">Twitter Ads</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="responsive">Responsive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Ad Creative
                </Button>
              </div>
            </div>
            
            {/* Ad Creatives Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {adCreativesPerformance.map((creative) => (
                <Card key={creative.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge className={
                        creative.format === "Video" ? "bg-red-500" :
                        creative.format === "Image" ? "bg-blue-500" :
                        creative.format === "Carousel" ? "bg-purple-500" :
                        "bg-indigo-500"
                      }>
                        {creative.format}
                      </Badge>
                      <Badge variant="outline" className="font-medium">
                        {creative.platform}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2 text-lg">{creative.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-4">
                      <img 
                        src={creative.thumbnailUrl} 
                        alt={creative.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Impressions</p>
                        <p className="text-sm font-medium">{creative.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Clicks</p>
                        <p className="text-sm font-medium">{creative.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">CTR</p>
                        <p className="text-sm font-medium">{creative.ctr.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Conversions</p>
                        <p className="text-sm font-medium">{creative.conversions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Conv. Rate</p>
                        <p className="text-sm font-medium">{creative.conversionRate.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">CPA</p>
                        <p className="text-sm font-medium">${creative.cpa.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Detailed Analytics
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {/* AI Creative Analysis */}
            <Card className="shadow-sm border-indigo-200 dark:border-indigo-900">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  AI Creative Analysis
                </CardTitle>
                <CardDescription>
                  AI-powered insights on your ad creative performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-md border border-indigo-100 dark:border-indigo-800">
                    <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-2">Creative Insights</h4>
                    <p className="text-sm text-indigo-700 dark:text-indigo-400">
                      Video ads are performing 32% better than static images in terms of CTR. The &ldquo;Product Demo Video&rdquo; has the highest conversion rate (4.53%), outperforming other creatives by an average of 22%.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Top Elements</h4>
                      <ul className="mt-2 space-y-1">
                        <li className="text-xs text-green-700 dark:text-green-400 flex items-start gap-1">
                          <Check className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>Clear call-to-action buttons</span>
                        </li>
                        <li className="text-xs text-green-700 dark:text-green-400 flex items-start gap-1">
                          <Check className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>Featuring product benefits prominently</span>
                        </li>
                        <li className="text-xs text-green-700 dark:text-green-400 flex items-start gap-1">
                          <Check className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>Customer testimonials</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-100 dark:border-amber-800">
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Optimization Tips</h4>
                      <ul className="mt-2 space-y-1">
                        <li className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1">
                          <Info className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>Try shorter video length (30-45 seconds)</span>
                        </li>
                        <li className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1">
                          <Info className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>Add urgency elements (limited time offers)</span>
                        </li>
                        <li className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1">
                          <Info className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>Test different color schemes for CTA buttons</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex justify-end">
                    <Button>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Creative Ideas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        
          {/* Audience Tab */}
          <TabsContent value="audience" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
              <div>
                <h2 className="text-lg font-bold">Audience Insights</h2>
                <p className="text-sm text-muted-foreground">
                  Understand which audience segments perform best for your ads
                </p>
              </div>
              
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="meta">Meta Ads</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    <SelectItem value="twitter">Twitter Ads</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            {/* Audience Segments */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {audienceInsights.map((category, index) => (
                <Card key={index} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>{category.category} Breakdown</CardTitle>
                    <CardDescription>
                      Performance by {category.category.toLowerCase()} segments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.segments.map((segment, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{segment.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-medium">
                                {segment.percentage}%
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {segment.conversions} conv.
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={segment.percentage} className="h-2 flex-1" />
                            <span className="text-xs">
                              ${segment.cpa.toFixed(2)} CPA
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Advanced Audience Analysis */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Advanced Audience Analysis</CardTitle>
                  <CardDescription>
                    Detailed performance metrics by demographics and interests
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="show-interests" className="text-sm">Show Interests</Label>
                    <Switch defaultChecked={false} onCheckedChange={() => {}} />
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Detailed View
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Audience Targeting Recommendations</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                          <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Increase budget for 25-34 age group</p>
                          <p className="text-xs text-muted-foreground">This segment has 38% higher conversion rates but only 22% of your ad budget.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                          <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Optimize for mobile devices</p>
                          <p className="text-xs text-muted-foreground">Mobile users account for 63% of traffic and have a 18% lower CPA than desktop.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                          <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Expand targeting in United States</p>
                          <p className="text-xs text-muted-foreground">US audience has the lowest CPA ($30.15) and highest conversion volume.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Audience Overlap Analysis</h3>
                    
                    {/* This would be a Venn diagram or visual representation in a real implementation */}
                    <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Audience overlap visualization would go here</p>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      There is a 45% overlap between your Meta Ads and Google Ads audiences, suggesting an opportunity to differentiate targeting across platforms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Lookalike Audience Opportunities */}
            <Card className="shadow-sm border-purple-200 dark:border-purple-900">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Lookalike Audience Opportunities
                </CardTitle>
                <CardDescription>
                  AI-identified audience segments that resemble your best customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-100 dark:border-purple-800">
                    <p className="text-sm text-purple-800 dark:text-purple-300">
                      Based on your conversion data, we&apos;ve identified new audience segments that match the profile of your highest-converting customers. These lookalike audiences can help expand your reach while maintaining strong performance.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-blue-500" />
                        <h4 className="text-sm font-medium">Meta Lookalike</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs">Based on: Top 5% converters</p>
                        <p className="text-xs">Estimated reach: 1.2M people</p>
                        <p className="text-xs">Similarity: 85%</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Create Audience
                      </Button>
                    </div>
                    
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-sky-500" />
                        <h4 className="text-sm font-medium">LinkedIn Lookalike</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs">Based on: Website converters</p>
                        <p className="text-xs">Estimated reach: 450K people</p>
                        <p className="text-xs">Similarity: 78%</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Create Audience
                      </Button>
                    </div>
                    
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-red-500" />
                        <h4 className="text-sm font-medium">Google Lookalike</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs">Based on: 30-day purchasers</p>
                        <p className="text-xs">Estimated reach: 2.4M people</p>
                        <p className="text-xs">Similarity: 82%</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Create Audience
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    Data last updated: Mar 3, 2025
                  </p>
                  <Button size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Advanced Audience Discovery
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
}