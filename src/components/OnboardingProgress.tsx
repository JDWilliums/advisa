"use client";

import { useOnboarding, OnboardingStep } from "@/contexts/OnboardingContext";
import { CheckCircle2, Circle } from "lucide-react";

interface StepInfo {
  id: OnboardingStep;
  label: string;
}

const steps: StepInfo[] = [
  { id: "welcome", label: "Welcome" },
  { id: "business-info", label: "Business Info" },
  { id: "marketing-goals", label: "Marketing Goals" },
  { id: "marketing-channels", label: "Marketing Channels" },
  { id: "complete", label: "Complete" }
];

export default function OnboardingProgress() {
  const { currentStep, setCurrentStep } = useOnboarding();
  
  // Find the index of the current step
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  
  // Handle step click - only allow navigating to completed steps or the current step
  const handleStepClick = (step: OnboardingStep, index: number) => {
    // Only allow navigating to completed steps or the current step
    if (index <= currentStepIndex) {
      setCurrentStep(step);
    }
  };
  
  return (
    <div className="mt-8 mb-12">
      <div className="space-y-4">
        {steps.map((step, index) => {
          // Determine if this step is completed, active, or upcoming
          const isCompleted = index < currentStepIndex;
          const isActive = step.id === currentStep;
          const isClickable = index <= currentStepIndex;
          
          return (
            <div 
              key={step.id} 
              className={`flex items-center ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={() => handleStepClick(step.id, index)}
            >
              <div className="flex items-center">
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                ) : isActive ? (
                  <div className="h-6 w-6 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                )}
              </div>
              
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  isActive 
                    ? "text-primary" 
                    : isCompleted 
                      ? "text-gray-700 dark:text-gray-300 hover:text-primary transition-colors" 
                      : "text-gray-500 dark:text-gray-500"
                }`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="mt-8 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out" 
          style={{ 
            width: `${Math.max(5, (currentStepIndex / (steps.length - 1)) * 100)}%` 
          }}
        ></div>
      </div>
    </div>
  );
} 