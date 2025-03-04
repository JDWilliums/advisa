"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart2,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Target,
  FileText,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Dummy data for the dashboard
const marketingStats = [
  {
    name: "Brand Mentions",
    value: 524,
    change: 12.5,
    increasing: true,
    icon: Search,
  },
  {
    name: "Ad Performance",
    value: "8.2%",
    change: -2.3,
    increasing: false,
    icon: TrendingUp,
  },
  {
    name: "Market Share",
    value: "23%",
    change: 3.1,
    increasing: true,
    icon: BarChart2,
  },
  {
    name: "ROI",
    value: "142%",
    change: 5.4,
    increasing: true,
    icon: DollarSign,
  },
];

const recentActivities = [
  {
    id: 1,
    action: "New competitor detected",
    description: "AI detected a new competitor in your market space",
    time: "Just now",
    tool: "Market Research",
  },
  {
    id: 2,
    action: "Negative brand mention spike",
    description: "Unusual increase in negative mentions on Twitter",
    time: "2 hours ago",
    tool: "Brand Monitor",
  },
  {
    id: 3,
    action: "Ad campaign performance report",
    description: "Your Google Ads campaign 'Summer Sale' report is ready",
    time: "Yesterday",
    tool: "Ad Performance Analyzer",
  },
  {
    id: 4,
    action: "New AI marketing strategy",
    description: "AI has generated new content strategy recommendations",
    time: "2 days ago",
    tool: "AI Marketing Strategy",
  },
];

const toolsUsage = [
  { name: "Brand Monitor", usage: 72 },
  { name: "Market Research", usage: 56 },
  { name: "SEO & Content", usage: 84 },
  { name: "Ad Performance", usage: 62 },
  { name: "Marketing Strategy", usage: 45 },
];

export default function DashboardOverview() {
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{greeting}, User</h1>
        <p className="text-muted-foreground">
          Here's an overview of your marketing performance and recent activities.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketingStats.map((stat, i) => (
          <Card key={i} className="shadow-sm bg-card text-card-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.increasing ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.increasing
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.change}%
                    </span>
                  </div>
                </div>
                <div className="rounded-full p-3 bg-accent">
                  <stat.icon className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="shadow-sm md:col-span-2 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 items-start pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="rounded-full p-2 bg-accent shrink-0">
                    {activity.tool === "Brand Monitor" && (
                      <Search className="h-4 w-4 text-blue-500" />
                    )}
                    {activity.tool === "Market Research" && (
                      <BarChart2 className="h-4 w-4 text-emerald-500" />
                    )}
                    {activity.tool === "Ad Performance Analyzer" && (
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                    )}
                    {activity.tool === "AI Marketing Strategy" && (
                      <Target className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {activity.tool}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tool Usage */}
        <Card className="shadow-sm bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Tool Usage</CardTitle>
            <CardDescription>
              Your most used marketing tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {toolsUsage.map((tool) => (
                <div key={tool.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{tool.name}</p>
                    <span className="text-sm text-muted-foreground">
                      {tool.usage}%
                    </span>
                  </div>
                  <Progress value={tool.usage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <Card className="shadow-sm cursor-pointer hover:bg-accent/50 transition-colors bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Search className="h-6 w-6 mb-2 text-blue-500" />
            <p className="text-sm font-medium text-center">Brand Monitor</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm cursor-pointer hover:bg-accent/50 transition-colors bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <BarChart2 className="h-6 w-6 mb-2 text-emerald-500" />
            <p className="text-sm font-medium text-center">Market Research</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm cursor-pointer hover:bg-accent/50 transition-colors bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <FileText className="h-6 w-6 mb-2 text-indigo-500" />
            <p className="text-sm font-medium text-center">SEO & Content</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm cursor-pointer hover:bg-accent/50 transition-colors bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <TrendingUp className="h-6 w-6 mb-2 text-purple-500" />
            <p className="text-sm font-medium text-center">Ad Performance</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm cursor-pointer hover:bg-accent/50 transition-colors bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <Target className="h-6 w-6 mb-2 text-orange-500" />
            <p className="text-sm font-medium text-center">AI Strategy</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm cursor-pointer hover:bg-accent/50 transition-colors bg-card text-card-foreground">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <FileText className="h-6 w-6 mb-2 text-gray-500" />
            <p className="text-sm font-medium text-center">Saved Reports</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}