import React from 'react';
import { Competitor, MarketOpportunity, MarketTrend } from '@/lib/marketResearchService';
import { UserProfile } from '@/lib/userService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Target, Shield, Zap } from 'lucide-react';

interface RecommendationEngineProps {
  competitors: Competitor[];
  opportunities: MarketOpportunity[];
  trends: MarketTrend[];
  userProfile: UserProfile;
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  competitors,
  opportunities,
  trends,
  userProfile
}) => {
  // Generate recommendations based on the analysis
  const generateRecommendations = () => {
    const recommendations: {
      id: string;
      title: string;
      description: string;
      type: 'competitive' | 'opportunity' | 'trend' | 'general';
      priority: 'high' | 'medium' | 'low';
      icon: React.ReactNode;
    }[] = [];
    
    // 1. Analyze market leaders to identify gaps
    const marketLeaders = competitors
      .filter(comp => comp.marketShare > 20)
      .sort((a, b) => b.marketShare - a.marketShare);
    
    if (marketLeaders.length > 0) {
      const leader = marketLeaders[0];
      
      // Find weaknesses in the market leader
      if (leader.weaknesses.length > 0) {
        recommendations.push({
          id: 'leader-weakness',
          title: `Address ${leader.name}'s Weaknesses`,
          description: `Focus on addressing these weaknesses of the market leader: ${leader.weaknesses.slice(0, 2).join(', ')}. This could be a key differentiator for your business.`,
          type: 'competitive',
          priority: 'high',
          icon: <Shield className="h-5 w-5" />
        });
      }
    }
    
    // 2. Identify fast-growing competitors to watch
    const fastGrowingCompetitors = competitors
      .filter(comp => comp.growth > 10)
      .sort((a, b) => b.growth - a.growth);
    
    if (fastGrowingCompetitors.length > 0) {
      const fastestGrower = fastGrowingCompetitors[0];
      
      recommendations.push({
        id: 'fast-grower',
        title: `Monitor ${fastestGrower.name}'s Growth`,
        description: `${fastestGrower.name} is growing rapidly (${fastestGrower.growth}%). Analyze their strategies and consider what's driving their success.`,
        type: 'competitive',
        priority: 'medium',
        icon: <TrendingUp className="h-5 w-5" />
      });
    }
    
    // 3. Leverage high-potential opportunities
    const highPotentialOpportunities = opportunities
      .filter(opp => opp.potential === 'High' || opp.potential === 'Very High')
      .sort((a, b) => {
        const potentialValue = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return potentialValue[b.potential] - potentialValue[a.potential];
      });
    
    if (highPotentialOpportunities.length > 0) {
      const topOpportunity = highPotentialOpportunities[0];
      
      recommendations.push({
        id: 'top-opportunity',
        title: `Pursue ${topOpportunity.opportunity}`,
        description: topOpportunity.description,
        type: 'opportunity',
        priority: 'high',
        icon: <Target className="h-5 w-5" />
      });
    }
    
    // 4. Adapt to high-impact trends
    const highImpactTrends = trends
      .filter(trend => trend.impact === 'High')
      .sort((a, b) => {
        const timeframeValue = { 'Short-term': 3, 'Medium-term': 2, 'Long-term': 1 };
        return timeframeValue[a.timeframe] - timeframeValue[b.timeframe];
      });
    
    if (highImpactTrends.length > 0) {
      const urgentTrend = highImpactTrends[0];
      
      recommendations.push({
        id: 'urgent-trend',
        title: `Adapt to ${urgentTrend.name}`,
        description: `This ${urgentTrend.timeframe} trend has a high impact on your industry. ${urgentTrend.description}`,
        type: 'trend',
        priority: 'medium',
        icon: <Zap className="h-5 w-5" />
      });
    }
    
    // 5. Identify unique positioning based on user profile
    if (userProfile.specializations && userProfile.specializations.length > 0) {
      // Check if competitors mention similar specializations
      const uniqueSpecializations = userProfile.specializations.filter(spec => {
        return !competitors.some(comp => 
          comp.overview.toLowerCase().includes(spec.toLowerCase()) ||
          comp.strengths.some(str => str.toLowerCase().includes(spec.toLowerCase()))
        );
      });
      
      if (uniqueSpecializations.length > 0) {
        recommendations.push({
          id: 'unique-specialization',
          title: 'Leverage Your Unique Specializations',
          description: `Your focus on ${uniqueSpecializations.join(', ')} appears to be unique among competitors. Consider emphasizing this in your marketing.`,
          type: 'general',
          priority: 'high',
          icon: <Lightbulb className="h-5 w-5" />
        });
      }
    }
    
    // 6. General recommendation if we don't have enough
    if (recommendations.length < 3) {
      recommendations.push({
        id: 'general-differentiation',
        title: 'Develop a Clear Differentiation Strategy',
        description: 'Based on the competitive landscape, focus on developing a clear value proposition that sets your business apart from competitors.',
        type: 'general',
        priority: 'medium',
        icon: <Lightbulb className="h-5 w-5" />
      });
    }
    
    return recommendations;
  };
  
  const recommendations = generateRecommendations();
  
  // Group recommendations by priority
  const highPriorityRecs = recommendations.filter(rec => rec.priority === 'high');
  const mediumPriorityRecs = recommendations.filter(rec => rec.priority === 'medium');
  const lowPriorityRecs = recommendations.filter(rec => rec.priority === 'low');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategic Recommendations</CardTitle>
        <CardDescription>
          Based on your competitive landscape and market analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* High Priority Recommendations */}
        {highPriorityRecs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center">
              <Badge variant="destructive" className="mr-2">Priority</Badge>
              High-Impact Actions
            </h3>
            <div className="space-y-3">
              {highPriorityRecs.map(rec => (
                <div key={rec.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      {rec.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Medium Priority Recommendations */}
        {mediumPriorityRecs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center">
              <Badge variant="outline" className="mr-2">Recommended</Badge>
              Strategic Opportunities
            </h3>
            <div className="space-y-3">
              {mediumPriorityRecs.map(rec => (
                <div key={rec.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      {rec.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Low Priority Recommendations */}
        {lowPriorityRecs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center">
              <Badge variant="secondary" className="mr-2">Consider</Badge>
              Additional Insights
            </h3>
            <div className="space-y-3">
              {lowPriorityRecs.map(rec => (
                <div key={rec.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      {rec.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {recommendations.length === 0 && (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Not enough data to generate recommendations. 
              Try updating your business profile or refreshing the analysis.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationEngine; 