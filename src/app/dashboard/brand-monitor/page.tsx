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
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Twitter,
  Facebook,
  Instagram,
  Globe,
  TrendingUp,
  AlertCircle,
  Filter,
  Calendar,
  Download,
  Smile,
  Frown,
  Meh,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for brand mentions
const brandMentions = [
  {
    id: 1,
    platform: "Twitter",
    username: "@TechReviewer",
    content: "Just tried out @AdviscaTools for our marketing analytics and I'm impressed with the AI-powered insights. #MarketingTools",
    date: "10 min ago",
    sentiment: "positive",
    icon: Twitter,
    iconColor: "text-blue-400",
  },
  {
    id: 2,
    platform: "News Article",
    username: "TechCrunch",
    content: "Advisa is disrupting the marketing analytics space with its AI-driven approach to gathering competitive insights.",
    date: "2 hours ago",
    sentiment: "positive",
    icon: Globe,
    iconColor: "text-green-400",
  },
  {
    id: 3,
    platform: "Facebook",
    username: "Marketing Today",
    content: "We compared several marketing tools and Advisa seems promising but still lacks some features compared to established players.",
    date: "Yesterday",
    sentiment: "neutral",
    icon: Facebook,
    iconColor: "text-blue-600",
  },
  {
    id: 4,
    platform: "Instagram",
    username: "@digital_marketer",
    content: "Can't believe how buggy the new Advisa dashboard is. Definitely not worth the subscription price.",
    date: "2 days ago",
    sentiment: "negative",
    icon: Instagram,
    iconColor: "text-pink-500",
  },
  {
    id: 5,
    platform: "Review Site",
    username: "G2 Review",
    content: "Advisa's AI marketing tool has completely transformed our approach to content strategy. Highly recommended for SMBs.",
    date: "1 week ago",
    sentiment: "positive",
    icon: Globe,
    iconColor: "text-purple-500",
  },
];

// Data for sentiment analysis
const sentimentData = {
  positive: 65,
  neutral: 25,
  negative: 10,
  total: 524,
  change: 12.5,
};

// Data for mentions by platform
const platformData = [
  { name: "Twitter", value: 42, color: "bg-blue-400" },
  { name: "Facebook", value: 18, color: "bg-blue-600" },
  { name: "Instagram", value: 15, color: "bg-pink-500" },
  { name: "News Sites", value: 12, color: "bg-green-500" },
  { name: "Blogs", value: 8, color: "bg-orange-400" },
  { name: "Others", value: 5, color: "bg-gray-400" },
];

export default function BrandMonitorPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Brand Monitor</h1>
        <p className="text-muted-foreground">
          Track and analyze mentions of your brand across the web
        </p>
      </div>

      {/* Top stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Mentions
                </p>
                <p className="text-2xl font-bold">{sentimentData.total}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-500">
                    {sentimentData.change}%
                  </span>
                </div>
              </div>
              <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                <TrendingUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Positive Sentiment
                </p>
                <p className="text-2xl font-bold">{sentimentData.positive}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-500">
                    3.2%
                  </span>
                </div>
              </div>
              <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                <Smile className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Neutral Sentiment
                </p>
                <p className="text-2xl font-bold">{sentimentData.neutral}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">
                    1.5%
                  </span>
                </div>
              </div>
              <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                <Meh className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Negative Sentiment
                </p>
                <p className="text-2xl font-bold">{sentimentData.negative}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">
                    2.1%
                  </span>
                </div>
              </div>
              <div className="rounded-full p-3 bg-gray-100 dark:bg-gray-800">
                <Frown className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search mentions..." 
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select defaultValue="7days">
              <SelectTrigger className="w-[160px]">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
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
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main content - Mentions Feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Brand Mentions</CardTitle>
              <CardDescription>
                Real-time mentions of your brand across the web
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="grid grid-cols-5 md:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="positive">Positive</TabsTrigger>
                  <TabsTrigger value="neutral">Neutral</TabsTrigger>
                  <TabsTrigger value="negative">Negative</TabsTrigger>
                  <TabsTrigger value="alerts">
                    Alerts
                    <Badge className="ml-1 bg-red-500 hover:bg-red-600">2</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {brandMentions.map((mention) => (
                      <div key={mention.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="flex gap-4">
                          <div>
                            <div className={`rounded-full p-2 ${mention.sentiment === 'positive' ? 'bg-green-100 dark:bg-green-900/20' : mention.sentiment === 'negative' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                              <mention.icon className={`h-5 w-5 ${mention.iconColor}`} />
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{mention.username}</p>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    mention.platform === "Twitter" ? "border-blue-200 text-blue-500" :
                                    mention.platform === "Facebook" ? "border-blue-300 text-blue-600" :
                                    mention.platform === "Instagram" ? "border-pink-200 text-pink-500" :
                                    "border-gray-200 text-gray-600"
                                  }`}
                                >
                                  {mention.platform}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    mention.sentiment === "positive" ? "border-green-200 text-green-600" :
                                    mention.sentiment === "negative" ? "border-red-200 text-red-600" :
                                    "border-gray-200 text-gray-600"
                                  }`}
                                >
                                  {mention.sentiment}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {mention.date}
                              </span>
                            </div>
                            <p className="text-sm">{mention.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-100 dark:border-gray-800 py-4 px-6">
                  <Button variant="outline" className="w-full">
                    Load more mentions
                  </Button>
                </CardFooter>
              </TabsContent>
              
              {/* Positive tab content */}
              <TabsContent value="positive" className="m-0">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {brandMentions
                      .filter(mention => mention.sentiment === "positive")
                      .map((mention) => (
                        <div key={mention.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <div className="flex gap-4">
                            <div>
                              <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/20">
                                <mention.icon className={`h-5 w-5 ${mention.iconColor}`} />
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{mention.username}</p>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      mention.platform === "Twitter" ? "border-blue-200 text-blue-500" :
                                      mention.platform === "Facebook" ? "border-blue-300 text-blue-600" :
                                      mention.platform === "Instagram" ? "border-pink-200 text-pink-500" :
                                      "border-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {mention.platform}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs border-green-200 text-green-600"
                                  >
                                    positive
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {mention.date}
                                </span>
                              </div>
                              <p className="text-sm">{mention.content}</p>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-100 dark:border-gray-800 py-4 px-6">
                  <Button variant="outline" className="w-full">
                    Load more mentions
                  </Button>
                </CardFooter>
              </TabsContent>
              
              {/* Neutral tab content */}
              <TabsContent value="neutral" className="m-0">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {brandMentions
                      .filter(mention => mention.sentiment === "neutral")
                      .map((mention) => (
                        <div key={mention.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <div className="flex gap-4">
                            <div>
                              <div className="rounded-full p-2 bg-gray-100 dark:bg-gray-800">
                                <mention.icon className={`h-5 w-5 ${mention.iconColor}`} />
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{mention.username}</p>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      mention.platform === "Twitter" ? "border-blue-200 text-blue-500" :
                                      mention.platform === "Facebook" ? "border-blue-300 text-blue-600" :
                                      mention.platform === "Instagram" ? "border-pink-200 text-pink-500" :
                                      "border-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {mention.platform}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs border-gray-200 text-gray-600"
                                  >
                                    neutral
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {mention.date}
                                </span>
                              </div>
                              <p className="text-sm">{mention.content}</p>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-100 dark:border-gray-800 py-4 px-6">
                  <Button variant="outline" className="w-full">
                    Load more mentions
                  </Button>
                </CardFooter>
              </TabsContent>
              
              {/* Negative tab content */}
              <TabsContent value="negative" className="m-0">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {brandMentions
                      .filter(mention => mention.sentiment === "negative")
                      .map((mention) => (
                        <div key={mention.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <div className="flex gap-4">
                            <div>
                              <div className="rounded-full p-2 bg-red-100 dark:bg-red-900/20">
                                <mention.icon className={`h-5 w-5 ${mention.iconColor}`} />
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{mention.username}</p>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      mention.platform === "Twitter" ? "border-blue-200 text-blue-500" :
                                      mention.platform === "Facebook" ? "border-blue-300 text-blue-600" :
                                      mention.platform === "Instagram" ? "border-pink-200 text-pink-500" :
                                      "border-gray-200 text-gray-600"
                                    }`}
                                  >
                                    {mention.platform}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs border-red-200 text-red-600"
                                  >
                                    negative
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {mention.date}
                                </span>
                              </div>
                              <p className="text-sm">{mention.content}</p>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-100 dark:border-gray-800 py-4 px-6">
                  <Button variant="outline" className="w-full">
                    Load more mentions
                  </Button>
                </CardFooter>
              </TabsContent>
              
              {/* Alerts tab content */}
              <TabsContent value="alerts" className="m-0">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex gap-4">
                        <div>
                          <div className="rounded-full p-2 bg-red-100 dark:bg-red-900/20">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">Negative Mention Spike</p>
                              <Badge className="bg-red-500">
                                High Priority
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              1 hour ago
                            </span>
                          </div>
                          <p className="text-sm">Detected a 35% increase in negative mentions on Twitter in the last hour. Most mentions reference the recent app update.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex gap-4">
                        <div>
                          <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/20">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">Competitor Mention</p>
                              <Badge className="bg-amber-500">
                                Medium Priority
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              3 hours ago
                            </span>
                          </div>
                          <p className="text-sm">Your competitor &ldquo;MarketMaster&rdquo; is being mentioned alongside your brand in 23 recent posts comparing features.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar - Analytics */}
        <div className="space-y-6">
          {/* Sentiment Analysis */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>
                AI-powered analysis of brand mentions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <p className="text-sm font-medium">Positive</p>
                    </div>
                    <span className="text-sm">{sentimentData.positive}%</span>
                  </div>
                  <Progress value={sentimentData.positive} className="h-2 bg-gray-100 dark:bg-gray-800" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <p className="text-sm font-medium">Neutral</p>
                    </div>
                    <span className="text-sm">{sentimentData.neutral}%</span>
                  </div>
                  <Progress value={sentimentData.neutral} className="h-2 bg-gray-100 dark:bg-gray-800" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <p className="text-sm font-medium">Negative</p>
                    </div>
                    <span className="text-sm">{sentimentData.negative}%</span>
                  </div>
                  <Progress value={sentimentData.negative} className="h-2 bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm font-medium mb-2">Sentiment Trend (Last 30 days)</p>
                {/* This would be a line chart in a real implementation */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-md h-32 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Line chart would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mentions by Platform */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Mentions by Platform</CardTitle>
              <CardDescription>
                Distribution across channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.map((platform) => (
                  <div key={platform.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                        <p className="text-sm font-medium">{platform.name}</p>
                      </div>
                      <span className="text-sm">{platform.value}%</span>
                    </div>
                    <Progress value={platform.value} className={`h-2 bg-gray-100 dark:bg-gray-800`} />

                    </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Alerts */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>
                Important notifications requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-100 dark:border-red-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        Negative Mention Spike
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">
                        35% increase in negative mentions in the last hour
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-100 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Competitor Comparison
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                        Your brand is being compared to competitors in recent posts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View all alerts
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Influencers */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Key Influencers</CardTitle>
              <CardDescription>
                Top accounts mentioning your brand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                      TR
                    </div>
                    <div>
                      <p className="text-sm font-medium">@TechReviewer</p>
                      <p className="text-xs text-muted-foreground">23.5K followers</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Positive</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium">
                      MT
                    </div>
                    <div>
                      <p className="text-sm font-medium">Marketing Today</p>
                      <p className="text-xs text-muted-foreground">42.8K followers</p>
                    </div>
                  </div>
                  <Badge className="bg-gray-500">Neutral</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-600 dark:text-pink-400 font-medium">
                      DM
                    </div>
                    <div>
                      <p className="text-sm font-medium">@digital_marketer</p>
                      <p className="text-xs text-muted-foreground">18.2K followers</p>
                    </div>
                  </div>
                  <Badge className="bg-red-500">Negative</Badge>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View all influencers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}