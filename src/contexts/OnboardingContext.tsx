"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { updateUserProfile, completeOnboarding, UserProfile } from "@/lib/userService";
import { FirebaseError } from "firebase/app";

// Define the steps in the onboarding process
export type OnboardingStep = 
  | "welcome" 
  | "business-info" 
  | "marketing-goals" 
  | "marketing-channels" 
  | "complete";

interface OnboardingData {
  // Business Info
  displayName?: string;
  email?: string;
  businessName?: string;
  industry?: string;
  businessSize?: string;
  location?: string;
  website?: string;
  phone?: string;
  about?: string; // Business description/about section
  
  // Marketing Goals
  goals?: string[];
  
  // Marketing Channels
  marketingChannels?: string[];
}

interface OnboardingContextType {
  currentStep: OnboardingStep;
  onboardingData: OnboardingData;
  setCurrentStep: (step: OnboardingStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboardingProcess: () => Promise<void>;
  isLastStep: boolean;
  isFirstStep: boolean;
  isOffline: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

// Order of steps in the onboarding process
const STEPS: OnboardingStep[] = [
  "welcome",
  "business-info",
  "marketing-goals",
  "marketing-channels",
  "complete"
];

// Map steps to their corresponding URLs
const STEP_URLS: Record<OnboardingStep, string> = {
  "welcome": "/onboarding",
  "business-info": "/onboarding/business-info",
  "marketing-goals": "/onboarding/marketing-goals",
  "marketing-channels": "/onboarding/marketing-channels",
  "complete": "/onboarding/complete"
};

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

interface OnboardingProviderProps {
  children: ReactNode;
  initialStep?: OnboardingStep;
}

export function OnboardingProvider({ children, initialStep = "welcome" }: OnboardingProviderProps) {
  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(initialStep);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isOffline, setIsOffline] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  // Initialize onboarding data with user info if available
  useEffect(() => {
    if (user) {
      setOnboardingData(prevData => ({
        ...prevData,
        displayName: user.displayName || undefined,
        email: user.email || undefined
      }));
    }
  }, [user]);

  // Set the initial step only on the first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setCurrentStep(initialStep);
    }
  }, [initialStep]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isFirstStep = currentStep === STEPS[0];
  const isLastStep = currentStep === STEPS[STEPS.length - 1];

  // Navigate to a specific step
  const navigateToStep = useCallback((step: OnboardingStep) => {
    setCurrentStep(step);
    router.push(STEP_URLS[step]);
  }, [router]);

  const goToNextStep = useCallback(() => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      const nextStep = STEPS[currentIndex + 1];
      navigateToStep(nextStep);
    }
  }, [currentStep, navigateToStep]);

  const goToPreviousStep = useCallback(() => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = STEPS[currentIndex - 1];
      navigateToStep(prevStep);
    }
  }, [currentStep, navigateToStep]);

  const updateOnboardingData = useCallback((data: Partial<OnboardingData>) => {
    setOnboardingData(prevData => ({
      ...prevData,
      ...data
    }));
  }, []);

  // Helper function to ensure navigation to dashboard
  const navigateToDashboard = useCallback(() => {
    console.log("Attempting to navigate to dashboard");
    
    // Store data in localStorage as a backup
    localStorage.setItem('pendingOnboardingData', JSON.stringify(onboardingData));
    
    try {
      // Try using the Next.js router first
      router.push("/dashboard");
      
      // Set a fallback in case the router navigation doesn't work
      setTimeout(() => {
        if (window.location.pathname !== "/dashboard") {
          console.log("Fallback: using window.location for navigation");
          window.location.href = "/dashboard";
        }
      }, 1000);
    } catch (navError) {
      console.error("Navigation error:", navError);
      // Force a hard navigation if router.push fails
      window.location.href = "/dashboard";
    }
  }, [onboardingData, router]);

  const completeOnboardingProcess = useCallback(async () => {
    if (!user) {
      console.error("Cannot complete onboarding: No authenticated user");
      // Still navigate to dashboard even if there's no user
      navigateToDashboard();
      return;
    }

    if (isOffline) {
      console.warn("You are currently offline. Your data will be saved when you're back online.");
      localStorage.setItem('pendingOnboardingData', JSON.stringify(onboardingData));
      navigateToDashboard();
      return;
    }

    try {
      // Ensure we have the user's email in the onboarding data
      const dataToSave = {
        ...onboardingData,
        email: user.email || onboardingData.email || 'unknown@example.com',
        displayName: onboardingData.displayName || user.displayName || undefined,
        // Map the 'about' field to the 'bio' field in UserProfile
        bio: onboardingData.about
      };
      
      // Log the data we're about to save
      console.log("Preparing to save onboarding data to Firestore:", dataToSave);
      
      // Save all onboarding data to the user profile
      await completeOnboarding(user.uid, dataToSave as Partial<UserProfile>);
      console.log("Successfully saved onboarding data to Firestore");
      
      // Clear any pending data from localStorage
      localStorage.removeItem('pendingOnboardingData');
      
      // Navigate to dashboard after successful save
      navigateToDashboard();
    } catch (error) {
      console.error("Error completing onboarding:", error);
      
      // Log detailed error information
      if (error instanceof FirebaseError) {
        console.error("Firebase error code:", error.code);
        console.error("Firebase error message:", error.message);
      }
      
      // Store data in localStorage as a backup
      localStorage.setItem('pendingOnboardingData', JSON.stringify(onboardingData));
      
      // Still navigate to dashboard even if there's an error
      navigateToDashboard();
    }
  }, [user, isOffline, onboardingData, navigateToDashboard]);

  const value = {
    currentStep,
    onboardingData,
    setCurrentStep: navigateToStep,
    goToNextStep,
    goToPreviousStep,
    updateOnboardingData,
    completeOnboardingProcess,
    isLastStep,
    isFirstStep,
    isOffline
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
} 