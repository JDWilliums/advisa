"use client";

import { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, WifiOff } from "lucide-react";

// Marketing goals options
const marketingGoals = [
  {
    id: "increase-brand-awareness",
    label: "Increase Brand Awareness",
    description: "Make more people recognize and remember your brand"
  },
  {
    id: "generate-leads",
    label: "Generate Leads",
    description: "Attract potential customers and collect their information"
  },
  {
    id: "increase-website-traffic",
    label: "Increase Website Traffic",
    description: "Get more visitors to your website"
  },
  {
    id: "improve-online-sales",
    label: "Improve Online Sales",
    description: "Sell more products or services through your website"
  },
  {
    id: "retain-customers",
    label: "Retain Existing Customers",
    description: "Keep your current customers coming back"
  },
  {
    id: "local-visibility",
    label: "Improve Local Visibility",
    description: "Get found by customers in your local area"
  },
  {
    id: "social-media-engagement",
    label: "Increase Social Media Engagement",
    description: "Get more likes, comments, and shares on your social posts"
  },
  {
    id: "content-marketing",
    label: "Develop Content Marketing",
    description: "Create valuable content to attract and engage your audience"
  }
];

export default function MarketingGoalsPage() {
  const { 
    onboardingData, 
    updateOnboardingData, 
    goToNextStep, 
    goToPreviousStep,
    isOffline
  } = useOnboarding();
  
  // Local state for selected goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    onboardingData.goals || []
  );
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Update local state when onboardingData changes
  useEffect(() => {
    if (onboardingData.goals) {
      setSelectedGoals(onboardingData.goals);
    }
  }, [onboardingData.goals]);
  
  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
    
    // Clear error when a goal is selected
    if (error) {
      setError(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGoals.length === 0) {
      setError("Please select at least one marketing goal");
      return;
    }
    
    updateOnboardingData({ goals: selectedGoals });
    goToNextStep();
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          What are your marketing goals?
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Select the goals that are most important for your business right now.
        </p>
      </div>
      
      {isOffline && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            You are currently offline. Your selections will be saved locally and synced when you're back online.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {marketingGoals.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            
            return (
              <div 
                key={goal.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-gray-700"
                } hover:border-primary transition-colors cursor-pointer`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <div className="mt-1 h-4 w-4">
                  {isSelected ? (
                    <div className="h-4 w-4 rounded-sm bg-primary flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-primary-foreground">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-sm border border-primary"></div>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor={goal.id}
                    className="text-base font-medium cursor-pointer"
                  >
                    {goal.label}
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {goal.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={goToPreviousStep}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          
          <Button type="submit" className="gap-2">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 