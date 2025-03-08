'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Competitor } from '@/lib/marketResearchService';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface MarketSharePieChartProps {
  competitors: Competitor[];
}

const MarketSharePieChart: React.FC<MarketSharePieChartProps> = ({ competitors }) => {
  // Calculate total market share of competitors
  const totalCompetitorShare = competitors.reduce((sum, competitor) => sum + competitor.marketShare, 0);
  
  // Calculate "Others" market share (assuming the total market is 100%)
  const othersShare = Math.max(0, 100 - totalCompetitorShare);
  
  // Prepare data for the pie chart
  const data: ChartData<'pie'> = {
    labels: [...competitors.map(comp => comp.name), othersShare > 0 ? 'Others' : ''].filter(label => label !== ''),
    datasets: [
      {
        data: [...competitors.map(comp => comp.marketShare), othersShare > 0 ? othersShare : 0].filter(value => value > 0),
        backgroundColor: [
          ...competitors.map(comp => {
            // Extract color from Tailwind class
            const colorClass = comp.color || 'bg-gray-400';
            return getColorFromTailwindClass(colorClass);
          }),
          othersShare > 0 ? '#CBD5E0' : ''
        ].filter(color => color !== ''),
        borderColor: [
          ...competitors.map(() => '#FFFFFF'),
          othersShare > 0 ? '#FFFFFF' : ''
        ].filter(color => color !== ''),
        borderWidth: 2,
      },
    ],
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend as we'll display it separately
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    },
  };
  
  return (
    <div className="h-64 w-full">
      <Pie data={data} options={options} />
    </div>
  );
};

// Helper function to convert Tailwind color classes to hex colors
function getColorFromTailwindClass(colorClass: string): string {
  const colorMap: Record<string, string> = {
    'bg-blue-600': '#2563EB',
    'bg-purple-600': '#9333EA',
    'bg-green-600': '#16A34A',
    'bg-orange-600': '#EA580C',
    'bg-red-600': '#DC2626',
    'bg-yellow-600': '#CA8A04',
    'bg-indigo-600': '#4F46E5',
    'bg-pink-600': '#DB2777',
    'bg-gray-400': '#9CA3AF'
  };
  
  return colorMap[colorClass] || '#9CA3AF'; // Default to gray if color not found
}

export default MarketSharePieChart; 