"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function OnboardingWelcome() {
  const { goToNextStep } = useOnboarding();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Welcome to Advisa
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Let's get your marketing platform set up to help your small business succeed.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          What to expect
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              1
            </div>
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                Tell us about your business
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                We'll customize your experience based on your business type and size.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              2
            </div>
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                Set your marketing goals
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Choose what you want to achieve with your marketing efforts.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              3
            </div>
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                Select your marketing channels
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Tell us which platforms you're using or planning to use.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={goToNextStep} className="gap-2">
          Get Started <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 