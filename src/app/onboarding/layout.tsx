"use client";

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import OnboardingProgress from "@/components/OnboardingProgress";
import Image from "next/image";

interface OnboardingLayoutProps {
  children: ReactNode;
}

// Map URL paths to onboarding steps
const getStepFromPath = (path: string) => {
  if (path === "/onboarding") return "welcome";
  if (path.includes("/business-info")) return "business-info";
  if (path.includes("/marketing-goals")) return "marketing-goals";
  if (path.includes("/marketing-channels")) return "marketing-channels";
  if (path.includes("/complete")) return "complete";
  return "welcome"; // Default
};

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userProfile, loading, checkOnboardingStatus } = useAuth();

  useEffect(() => {
    const checkStatus = async () => {
      if (user && userProfile?.hasCompletedOnboarding) {
        // If user has already completed onboarding, redirect to dashboard
        router.push("/dashboard");
      }
    };

    if (!loading) {
      checkStatus();
    }
  }, [user, userProfile, loading, router, checkOnboardingStatus]);

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Don't render the onboarding if not authenticated
  // (The redirect will be handled by AuthContext)
  if (!user) {
    return null;
  }

  // Get the current step from the URL path
  const initialStep = pathname ? getStepFromPath(pathname) : "welcome";

  return (
    <OnboardingProvider initialStep={initialStep}>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Left sidebar with logo and progress */}
        <div className="hidden md:flex md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 flex-col p-8 border-r border-gray-200 dark:border-gray-700">
          <div className="mb-12">
            <Image 
              src="/advisa-logo.png" 
              alt="Advisa Logo" 
              width={150} 
              height={40} 
              sizes="150px"
              className="dark:hidden"
            />
            <Image 
              src="/advisa-logo-no-bg.png" 
              alt="Advisa Logo" 
              width={150} 
              height={40} 
              sizes="150px"
              className="hidden dark:block"
            />
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
              Welcome to Advisa
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Let's set up your marketing platform to help your small business succeed.
            </p>
            
            {/* Progress steps */}
            <OnboardingProgress />
          </div>
          
          <div className="mt-auto">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help? <a href="mailto:support@advisa.com" className="text-primary hover:underline">Contact support</a>
            </p>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </OnboardingProvider>
  );
} 