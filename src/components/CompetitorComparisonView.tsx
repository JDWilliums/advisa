import React from 'react';
import { Competitor } from '@/lib/marketResearchService';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  CheckIcon, 
  XIcon,
  ExternalLinkIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompetitorComparisonViewProps {
  competitors: Competitor[];
  selectedCompetitorIds: string[];
  onClose: () => void;
}

const CompetitorComparisonView: React.FC<CompetitorComparisonViewProps> = ({
  competitors,
  selectedCompetitorIds,
  onClose
}) => {
  // Filter competitors to only show selected ones
  const selectedCompetitors = competitors.filter(comp => 
    selectedCompetitorIds.includes(comp.id || '')
  );
  
  // If no competitors are selected, show a message
  if (selectedCompetitors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Competitor Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Select at least one competitor to compare
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Competitor Comparison</CardTitle>
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Comparison Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 w-1/5">Metric</th>
                {selectedCompetitors.map(competitor => (
                  <th key={competitor.id} className="text-center p-2">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full ${competitor.color} flex items-center justify-center text-white font-bold mb-2`}>
                        {competitor.logo}
                      </div>
                      <span className="font-medium">{competitor.name}</span>
                      <a 
                        href={`https://${competitor.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-muted-foreground flex items-center hover:underline"
                      >
                        {competitor.website}
                        <ExternalLinkIcon className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Market Share */}
              <tr className="border-b">
                <td className="p-2 font-medium">Market Share</td>
                {selectedCompetitors.map(competitor => (
                  <td key={competitor.id} className="p-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold">{competitor.marketShare}%</span>
                      <Progress value={competitor.marketShare} className="h-2 w-24 mt-1" />
                    </div>
                  </td>
                ))}
              </tr>
              
              {/* Growth */}
              <tr className="border-b">
                <td className="p-2 font-medium">Annual Growth</td>
                {selectedCompetitors.map(competitor => (
                  <td key={competitor.id} className="p-2 text-center">
                    <Badge className={competitor.growth >= 0 ? "bg-green-500" : "bg-red-500"}>
                      {competitor.growth >= 0 ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(competitor.growth)}%
                    </Badge>
                  </td>
                ))}
              </tr>
              
              {/* Business Size */}
              <tr className="border-b">
                <td className="p-2 font-medium">Business Size</td>
                {selectedCompetitors.map(competitor => (
                  <td key={competitor.id} className="p-2 text-center">
                    {competitor.businessSize || 'Unknown'}
                  </td>
                ))}
              </tr>
              
              {/* Location */}
              <tr className="border-b">
                <td className="p-2 font-medium">Location</td>
                {selectedCompetitors.map(competitor => (
                  <td key={competitor.id} className="p-2 text-center">
                    {competitor.location || 'Unknown'}
                  </td>
                ))}
              </tr>
              
              {/* Strengths */}
              <tr className="border-b">
                <td className="p-2 font-medium">Strengths</td>
                {selectedCompetitors.map(competitor => (
                  <td key={competitor.id} className="p-2">
                    <ul className="list-disc pl-5 text-sm">
                      {competitor.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              
              {/* Weaknesses */}
              <tr className="border-b">
                <td className="p-2 font-medium">Weaknesses</td>
                {selectedCompetitors.map(competitor => (
                  <td key={competitor.id} className="p-2">
                    <ul className="list-disc pl-5 text-sm">
                      {competitor.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              
              {/* Overview */}
              <tr>
                <td className="p-2 font-medium">Overview</td>
                {selectedCompetitors.map(competitor => (
                  <td key={competitor.id} className="p-2 text-sm">
                    {competitor.overview}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorComparisonView; 