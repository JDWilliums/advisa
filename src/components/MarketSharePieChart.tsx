'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Competitor } from '@/lib/marketResearchService';
import { Badge } from '@/components/ui/badge';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface MarketSharePieChartProps {
  competitors: Competitor[];
}

const MarketSharePieChart: React.FC<MarketSharePieChartProps> = ({ competitors }) => {
  // Normalize market share data to ensure it adds up to 100%
  const normalizeMarketShare = (competitors: Competitor[]) => {
    // Calculate the total of all market shares
    const totalShare = competitors.reduce((sum, comp) => sum + comp.marketShare, 0);
    
    // If the total is 0, return the original competitors (avoid division by zero)
    if (totalShare === 0) return competitors;
    
    // If the total is already 100 (or very close), return the original competitors
    if (Math.abs(totalShare - 100) < 0.1) return competitors;
    
    // Otherwise, normalize the market shares to add up to 100%
    return competitors.map(comp => ({
      ...comp,
      marketShare: Math.round((comp.marketShare / totalShare) * 100)
    }));
  };
  
  // Normalize the competitors' market shares
  const normalizedCompetitors = normalizeMarketShare(competitors);
  
  // Calculate total market share of competitors
  const totalCompetitorShare = normalizedCompetitors.reduce((sum, competitor) => sum + competitor.marketShare, 0);
  
  // Calculate "Others" market share (assuming the total market is 100%)
  const othersShare = Math.max(0, 100 - totalCompetitorShare);
  
  // Prepare data for the pie chart
  const data: ChartData<'pie'> = {
    labels: [...normalizedCompetitors.map(comp => comp.name), othersShare > 0 ? 'Others' : ''].filter(label => label !== ''),
    datasets: [
      {
        data: [...normalizedCompetitors.map(comp => comp.marketShare), othersShare > 0 ? othersShare : 0].filter(value => value > 0),
        backgroundColor: [
          ...normalizedCompetitors.map(comp => {
            // Extract color from Tailwind class
            const colorClass = comp.color || 'bg-gray-400';
            return getColorFromTailwindClass(colorClass);
          }),
          othersShare > 0 ? '#CBD5E0' : ''
        ].filter(color => color !== ''),
        borderColor: [
          ...normalizedCompetitors.map(() => '#FFFFFF'),
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
    <div className="flex flex-col">
      <div className="h-64 w-full">
        <Pie data={data} options={options} />
      </div>
      
      {/* Tags below the chart */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {normalizedCompetitors.map((competitor) => (
          <Badge 
            key={competitor.id} 
            variant="outline" 
            className="flex items-center gap-1 px-3 py-1"
            style={{ 
              borderColor: getColorFromTailwindClass(competitor.color || 'bg-gray-400'),
              backgroundColor: `${getColorFromTailwindClass(competitor.color || 'bg-gray-400')}20` // 20% opacity
            }}
          >
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: getColorFromTailwindClass(competitor.color || 'bg-gray-400') }}
            ></div>
            <span>{competitor.name} ({competitor.marketShare}%)</span>
          </Badge>
        ))}
        {othersShare > 0 && (
          <Badge 
            variant="outline" 
            className="flex items-center gap-1 px-3 py-1"
            style={{ 
              borderColor: '#CBD5E0',
              backgroundColor: '#CBD5E020' // 20% opacity
            }}
          >
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span>Others ({othersShare}%)</span>
          </Badge>
        )}
      </div>
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