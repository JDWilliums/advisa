"use client";

import {
  BarChart,
  LineChart,
  PieChart,
  Activity,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Visitors" 
          value="12,345" 
          change="+12%" 
          icon={<Users className="h-6 w-6 text-blue-500" />} 
        />
        <StatCard 
          title="Conversion Rate" 
          value="3.2%" 
          change="+0.8%" 
          icon={<Activity className="h-6 w-6 text-green-500" />} 
        />
        <StatCard 
          title="Revenue" 
          value="$24,780" 
          change="+18%" 
          icon={<DollarSign className="h-6 w-6 text-yellow-500" />} 
        />
        <StatCard 
          title="Growth" 
          value="42%" 
          change="+8%" 
          icon={<TrendingUp className="h-6 w-6 text-purple-500" />} 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Website Traffic" 
          subtitle="Last 30 days" 
          icon={<LineChart className="h-5 w-5 text-gray-500 dark:text-gray-400" />} 
        />
        <ChartCard 
          title="Revenue Breakdown" 
          subtitle="By channel" 
          icon={<PieChart className="h-5 w-5 text-gray-500 dark:text-gray-400" />} 
        />
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <ActivityItem 
              key={i}
              title={`Activity ${i}`}
              description={`This is a description for activity ${i}. It provides some context about what happened.`}
              time={`${i} hour${i > 1 ? 's' : ''} ago`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          {icon}
        </div>
      </div>
      <div className={`mt-2 flex items-center text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        <span>{change}</span>
        <span className="ml-1.5">from last month</span>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Chart Placeholder</p>
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time }: { title: string; description: string; time: string }) {
  return (
    <div className="flex space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
        <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}