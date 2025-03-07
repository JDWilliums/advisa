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
  Target,
  Download,
  Save,
  Sparkles,
  BarChart2,
  Users,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Star,
  FileText,
  Zap,
  Calendar,
  DollarSign,
  Share2,
  BrainCircuit,
  Send,
  Layers,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Mock data for generated strategies
const generatedStrategies = [
  {
    id: 1,
    title: "Digital Transformation for SaaS Growth",
    description: "A comprehensive digital marketing strategy focused on lead generation and conversion optimization for your SaaS business.",
    rating: 4.8,
    date: "Generated 2 days ago",
    tags: ["SaaS", "Lead Generation", "Conversion"],
    status: "active",
  },
  {
    id: 2,
    title: "E-commerce Holiday Campaign",
    description: "Strategic holiday marketing campaign with social media, email, and PPC components to maximize Q4 sales.",
    rating: 4.2,
    date: "Generated 1 week ago",
    tags: ["E-commerce", "Holiday", "Multi-channel"],
    status: "completed",
  },
  {
    id: 3,
    title: "Content Marketing for B2B",
    description: "Content-focused approach to establish thought leadership and generate high-quality B2B leads.",
    rating: 4.5,
    date: "Generated 2 weeks ago",
    tags: ["B2B", "Content", "Thought Leadership"],
    status: "draft",
  },
];

// Mock data for strategy channels
const strategyChannels = [
  { id: "social", name: "Social Media", icon: Share2, color: "text-blue-500" },
  { id: "content", name: "Content Marketing", icon: FileText, color: "text-green-500" },
  { id: "email", name: "Email Marketing", icon: Send, color: "text-yellow-500" },
  { id: "ppc", name: "Paid Advertising", icon: DollarSign, color: "text-purple-500" },
  { id: "seo", name: "SEO", icon: Target, color: "text-red-500" },
  { id: "events", name: "Events & Webinars", icon: Calendar, color: "text-indigo-500" },
];

// Mock data for strategy goals
const strategyGoals = [
  { id: "awareness", name: "Brand Awareness", description: "Increase visibility and recognition" },
  { id: "traffic", name: "Website Traffic", description: "Drive more visitors to your site" },
  { id: "leads", name: "Lead Generation", description: "Capture potential customer information" },
  { id: "conversion", name: "Conversion", description: "Turn leads into paying customers" },
  { id: "retention", name: "Customer Retention", description: "Keep existing customers engaged" },
  { id: "revenue", name: "Revenue Growth", description: "Increase overall sales and revenue" },
];
// Strategy content component for the content tab
const StrategyContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Digital Transformation for SaaS Growth</h3>
            <p className="text-muted-foreground">Generated on March 1, 2025</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Executive Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  This comprehensive digital marketing strategy aims to accelerate growth for your SaaS business by implementing a multi-channel approach focused on lead generation, conversion optimization, and customer retention. The strategy leverages content marketing, targeted paid advertising, email automation, and strategic partnerships to create a sustainable growth engine.
                </p>
                <p className="text-sm mt-4">
                  Based on your business profile and market research, we project this strategy could generate a 35-45% increase in qualified leads and a 20-25% increase in conversion rates over the next 6 months, resulting in an estimated 30% revenue growth.
                </p>
              </CardContent>
            </Card>
            
            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle>Target Audience Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                    <h4 className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      Primary: B2B Tech Decision Makers
                    </h4>
                    <p className="text-sm mt-1 text-muted-foreground">CTOs, IT Directors, and Tech Managers at mid-market companies (100-1000 employees)</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400">Technical Background</Badge>
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400">Budget Authority</Badge>
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400">Efficiency-Focused</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800">
                    <h4 className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2 text-green-500" />
                      Secondary: Business Executives
                    </h4>
                    <p className="text-sm mt-1 text-muted-foreground">CEOs and COOs at growing startups and small businesses (25-100 employees)</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">Growth-Oriented</Badge>
                      <Badge variant="outline" className="text-xs border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">ROI-Focused</Badge>
                      <Badge variant="outline" className="text-xs border-green-200 text-green-700 dark:border-green-800 dark:text-green-400">Time-Constrained</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Channel Strategy */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Content Marketing</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Develop a comprehensive content strategy focused on educational content that addresses specific pain points of your target audience.
                      </p>
                      <div className="mt-2 space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Key tactics:</span> Technical whitepapers, case studies, comparison guides, how-to blog posts
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Content distribution:</span> Company blog, LinkedIn, Medium, industry publications
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Expected outcomes:</span> Establish thought leadership, improve SEO ranking, generate leads
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Paid Advertising</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implement highly targeted paid campaigns on platforms where your B2B audience is active.
                      </p>
                      <div className="mt-2 space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Key platforms:</span> LinkedIn Ads, Google Search Ads, Retargeting
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Campaign types:</span> Lead gen forms, demo requests, content downloads
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Budget allocation:</span> 60% LinkedIn, 30% Google, 10% Retargeting
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                      <Send className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Email Marketing Automation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create segmented email sequences that nurture leads through your sales funnel.
                      </p>
                      <div className="mt-2 space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Sequence types:</span> Welcome, Product Education, Case Study, Trial Conversion
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Segmentation:</span> By role, company size, industry, engagement level
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Optimization focus:</span> Open rates, click-through rates, conversion to demo
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Content Calendar */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>90-Day Content Calendar</CardTitle>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View Full Calendar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-800 rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 dark:bg-gray-800 text-xs font-medium">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-3">Content Type</div>
                    <div className="col-span-5">Topic</div>
                    <div className="col-span-2">Channel</div>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-800 text-xs">
                    <div className="grid grid-cols-12 gap-2 p-3">
                      <div className="col-span-2">Week 1</div>
                      <div className="col-span-3">Blog Post</div>
                      <div className="col-span-5">10 Ways to Improve Your SaaS Onboarding Process</div>
                      <div className="col-span-2">Blog, LinkedIn</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 p-3">
                      <div className="col-span-2">Week 2</div>
                      <div className="col-span-3">Whitepaper</div>
                      <div className="col-span-5">2025 SaaS Industry Benchmarks Report</div>
                      <div className="col-span-2">Lead Magnet</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 p-3">
                      <div className="col-span-2">Week 3</div>
                      <div className="col-span-3">Case Study</div>
                      <div className="col-span-5">How Company X Increased Efficiency by 45%</div>
                      <div className="col-span-2">Website, Email</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 p-3">
                      <div className="col-span-2">Week 4</div>
                      <div className="col-span-3">Webinar</div>
                      <div className="col-span-5">Digital Transformation: Beyond the Buzzword</div>
                      <div className="col-span-2">Email, LinkedIn</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2 p-3">
                      <div className="col-span-2">Week 5</div>
                      <div className="col-span-3">Email Sequence</div>
                      <div className="col-span-5">Product Feature Spotlight: Advanced Analytics</div>
                      <div className="col-span-2">Email</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button variant="ghost" size="sm">
                    Load more content items
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Metrics & KPIs */}
          <Card>
            <CardHeader>
              <CardTitle>Key Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Lead Generation</h4>
                      <span className="text-xs font-medium text-green-600">+35-45%</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">MQL Growth</span>
                        <span>40%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">SQL Growth</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">CTA Conversion Rate</span>
                        <span>3.5%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Conversion</h4>
                      <span className="text-xs font-medium text-green-600">+20-25%</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Demo Conversion Rate</span>
                        <span>25%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Trial to Paid</span>
                        <span>22%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Avg. Sales Cycle</span>
                        <span>-15%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Customer Growth</h4>
                      <span className="text-xs font-medium text-green-600">+30%</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Customer Acquisition</span>
                        <span>30%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Churn Reduction</span>
                        <span>15%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Average Deal Size</span>
                        <span>+10%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">ROI</h4>
                      <span className="text-xs font-medium text-green-600">4.2x</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">CAC</span>
                        <span>-15%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">LTV:CAC Ratio</span>
                        <span>4.2:1</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Marketing ROI</span>
                        <span>320%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Strategy Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Business Type</p>
                  <p className="text-sm font-medium">B2B SaaS</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Target Market</p>
                  <p className="text-sm font-medium">Mid-market companies (100-1000 employees)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Primary Objective</p>
                  <p className="text-sm font-medium">Lead Generation & Conversion</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                  <p className="text-sm font-medium">6 months</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Budget Range</p>
                  <p className="text-sm font-medium">$20,000 - $30,000 monthly</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Channels</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="secondary">Content</Badge>
                    <Badge variant="secondary">Paid Ads</Badge>
                    <Badge variant="secondary">Email</Badge>
                    <Badge variant="secondary">SEO</Badge>
                    <Badge variant="secondary">Webinars</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Feedback & Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Button variant="outline" size="sm">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Not useful
                </Button>
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Useful
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium mr-2">Strategy Rating:</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                      />
                    ))}
                    <span className="text-sm ml-2">5.0</span>
                  </div>
                </div>
                
                <Textarea 
                  placeholder="Add your comments or feedback..."
                  className="resize-none mt-2"
                />
                
                <Button className="w-full mt-2">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* AI Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
                AI Customization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="channel-focus">Channel Focus</Label>
                    <span className="text-xs text-muted-foreground">Balanced</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">Content</span>
                    <Slider 
                      id="channel-focus"
                      defaultValue={[50]} 
                      max={100} 
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs">Paid</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="timeline">Timeline</Label>
                    <span className="text-xs text-muted-foreground">6 months</span>
                  </div>
                  <Select defaultValue="6mo">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3mo">3 months</SelectItem>
                      <SelectItem value="6mo">6 months</SelectItem>
                      <SelectItem value="12mo">12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="budget-level">Budget Level</Label>
                    <span className="text-xs text-muted-foreground">Medium</span>
                  </div>
                  <Slider 
                    id="budget-level"
                    defaultValue={[50]} 
                    max={100} 
                    step={1}
                  />
                </div>
                
                <Button className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate Strategy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function MarketingStrategyPage() {
    const [activeTab, setActiveTab] = useState("generator");
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">AI Marketing Strategy</h1>
          <p className="text-muted-foreground">
            Generate custom marketing strategies tailored to your business goals
          </p>
        </div>
  
        <Tabs defaultValue="generator" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator">Strategy Generator</TabsTrigger>
            <TabsTrigger value="strategies">My Strategies</TabsTrigger>
          </TabsList>
          {/* Strategy Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          {/* Quick Settings Card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-indigo-500" />
                AI Strategy Generator
              </CardTitle>
              <CardDescription>
                Fill in your business details to generate a custom marketing strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="business-type">Business Type</Label>
                  <Select defaultValue="b2b-saas">
                    <SelectTrigger id="business-type">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b2b-saas">B2B SaaS</SelectItem>
                      <SelectItem value="b2c-saas">B2C SaaS</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="local">Local Business</SelectItem>
                      <SelectItem value="service">Service Provider</SelectItem>
                      <SelectItem value="agency">Agency</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-size">Company Size</Label>
                  <Select defaultValue="startup">
                    <SelectTrigger id="company-size">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo/Freelancer</SelectItem>
                      <SelectItem value="startup">Startup (2-10)</SelectItem>
                      <SelectItem value="small">Small (11-50)</SelectItem>
                      <SelectItem value="medium">Medium (51-200)</SelectItem>
                      <SelectItem value="large">Large (201+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-audience">Primary Target Audience</Label>
                  <Select defaultValue="b2b-tech">
                    <SelectTrigger id="target-audience">
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b2b-tech">B2B Tech Decision Makers</SelectItem>
                      <SelectItem value="b2b-exec">B2B Executives</SelectItem>
                      <SelectItem value="small-business">Small Business Owners</SelectItem>
                      <SelectItem value="consumer-gen-z">Consumers - Gen Z</SelectItem>
                      <SelectItem value="consumer-millennial">Consumers - Millennials</SelectItem>
                      <SelectItem value="consumer-gen-x">Consumers - Gen X</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Marketing Budget</Label>
                  <Select defaultValue="mid">
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">$1,000 - $5,000</SelectItem>
                      <SelectItem value="mid">$5,000 - $20,000</SelectItem>
                      <SelectItem value="high">$20,000 - $50,000</SelectItem>
                      <SelectItem value="enterprise">$50,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Primary Business Goals</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {strategyGoals.map((goal) => (
                    <div key={goal.id} className="flex items-start space-x-2">
                      <Checkbox id={`goal-${goal.id}`} defaultChecked={goal.id === "leads" || goal.id === "conversion"} />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`goal-${goal.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {goal.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Marketing Channels to Include</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {strategyChannels.map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-2">
                      <Checkbox id={`channel-${channel.id}`} defaultChecked={channel.id === "content" || channel.id === "social" || channel.id === "email"} />
                      <label
                        htmlFor={`channel-${channel.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                      >
                        <channel.icon className={`h-4 w-4 ${channel.color}`} />
                        {channel.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additional-info">Additional Information</Label>
                <Textarea 
                  id="additional-info"
                  placeholder="Tell us more about your business, goals, current challenges, or any specific requirements..."
                  className="resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button variant="outline">
                Reset Form
              </Button>
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Strategy
              </Button>
            </CardFooter>
          </Card>
          
          {/* Generated Strategy Display */}
          <StrategyContent />
        </TabsContent>
        {/* My Strategies Tab */}
        <TabsContent value="strategies" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative w-full md:w-64">
                <Input placeholder="Search strategies..." />
              </div>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Strategies</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button>
              <Sparkles className="h-4 w-4 mr-2" />
              New Strategy
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {generatedStrategies.map((strategy) => (
              <Card key={strategy.id} className="shadow-sm overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge
                      className={
                        strategy.status === "active" ? "bg-green-500" :
                        strategy.status === "draft" ? "bg-yellow-500" :
                        "bg-blue-500"
                      }
                    >
                      {strategy.status === "active" ? "Active" :
                       strategy.status === "draft" ? "Draft" :
                       "Completed"}
                    </Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm ml-1">{strategy.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="mt-2">{strategy.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {strategy.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    {strategy.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {strategy.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                  <Button variant="ghost" size="sm">
                    <Layers className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}