"use client";

import { useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingCompletePage() {
  const { 
    onboardingData, 
    completeOnboardingProcess,
    isOffline
  } = useOnboarding();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      
      console.log("Starting onboarding completion process...");
      
      // Call the completeOnboardingProcess function
      await completeOnboardingProcess();
      
      // Show success message
      setSuccess("Profile saved successfully! Redirecting to dashboard...");
      console.log("Onboarding completion process successful");
      
      // The navigation should be handled by completeOnboardingProcess
      // But we'll add a fallback just in case
      setTimeout(() => {
        if (window.location.pathname.includes('/onboarding')) {
          console.log("Fallback navigation: still on onboarding page after 2 seconds");
          router.push("/dashboard");
        }
      }, 2000);
    } catch (err) {
      console.error("Error in handleComplete:", err);
      setError("An error occurred while saving your profile. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          You're all set!
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Thanks for completing your profile. We've customized your marketing platform based on your information.
        </p>
      </div>
      
      {isOffline && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            You are currently offline. Your profile will be saved locally and synced when you're back online.
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Your Profile Summary
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Business Information
            </h3>
            <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
              {onboardingData.businessName || "Your Business"} • {onboardingData.industry || "Your Industry"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {onboardingData.businessSize || "Business Size"} • {onboardingData.location || "Location"}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Marketing Goals
            </h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {onboardingData.goals?.map((goal) => (
                <span 
                  key={goal}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {goal.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Marketing Channels
            </h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {onboardingData.marketingChannels?.map((channel) => (
                <span 
                  key={channel}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground border border-primary/20 dark:border-primary/40"
                >
                  {channel.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your marketing dashboard has been customized based on your profile. You can always update your information in your account settings.
        </p>
        
        <Button 
          onClick={handleComplete} 
          size="lg"
          className="gap-2 px-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving profile..." : "Complete & Go to Dashboard"} {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
} 