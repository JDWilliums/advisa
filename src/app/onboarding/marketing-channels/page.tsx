"use client";

import { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, WifiOff } from "lucide-react";

// Marketing channels options
const marketingChannels = [
  {
    id: "website",
    label: "Website",
    description: "Your business website or online store"
  },
  {
    id: "social-media",
    label: "Social Media",
    description: "Facebook, Instagram, Twitter, LinkedIn, etc."
  },
  {
    id: "email",
    label: "Email Marketing",
    description: "Newsletters, promotional emails, and campaigns"
  },
  {
    id: "seo",
    label: "Search Engine Optimization (SEO)",
    description: "Improving your visibility in search results"
  },
  {
    id: "paid-ads",
    label: "Paid Advertising",
    description: "Google Ads, Facebook Ads, display advertising"
  },
  {
    id: "content",
    label: "Content Marketing",
    description: "Blog posts, videos, podcasts, and other content"
  },
  {
    id: "local",
    label: "Local Marketing",
    description: "Google My Business, local directories, local events"
  },
  {
    id: "influencer",
    label: "Influencer Marketing",
    description: "Partnerships with influencers in your industry"
  },
  {
    id: "print",
    label: "Print Marketing",
    description: "Brochures, flyers, business cards, direct mail"
  }
];

export default function MarketingChannelsPage() {
  const { 
    onboardingData, 
    updateOnboardingData, 
    goToNextStep, 
    goToPreviousStep,
    isOffline
  } = useOnboarding();
  
  // Local state for selected channels
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    onboardingData.marketingChannels || []
  );
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Update local state when onboardingData changes
  useEffect(() => {
    if (onboardingData.marketingChannels) {
      setSelectedChannels(onboardingData.marketingChannels);
    }
  }, [onboardingData.marketingChannels]);
  
  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
    
    // Clear error when a channel is selected
    if (error) {
      setError(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedChannels.length === 0) {
      setError("Please select at least one marketing channel");
      return;
    }
    
    updateOnboardingData({ marketingChannels: selectedChannels });
    goToNextStep();
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Which marketing channels do you use?
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Select all the marketing channels you currently use or plan to use.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketingChannels.map((channel) => {
            const isSelected = selectedChannels.includes(channel.id);
            
            return (
              <div 
                key={channel.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border ${
                  isSelected
                    ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-sm"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                } hover:border-primary transition-colors cursor-pointer`}
                onClick={() => handleChannelToggle(channel.id)}
              >
                <div className="mt-1 h-4 w-4">
                  {isSelected ? (
                    <div className="h-4 w-4 rounded-sm bg-primary flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-white dark:text-gray-900">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-sm border border-gray-400 dark:border-gray-500"></div>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor={channel.id}
                    className={`text-base font-medium cursor-pointer ${
                      isSelected ? "text-primary dark:text-primary-foreground" : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {channel.label}
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {channel.description}
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