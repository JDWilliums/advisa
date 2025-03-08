"use client";

import { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Industry options
const industries = [
  "Retail",
  "Food & Beverage",
  "Professional Services",
  "Health & Wellness",
  "Technology",
  "Education",
  "Real Estate",
  "Home Services",
  "Arts & Entertainment",
  "Manufacturing",
  "Other"
];

// Business size options
const businessSizes = [
  "Solo Entrepreneur",
  "2-5 Employees",
  "6-10 Employees",
  "11-25 Employees",
  "26-50 Employees",
  "51-100 Employees",
  "100+ Employees"
];

export default function BusinessInfoPage() {
  const { 
    onboardingData, 
    updateOnboardingData, 
    goToNextStep, 
    goToPreviousStep
  } = useOnboarding();
  
  // Local form state
  const [formData, setFormData] = useState({
    displayName: onboardingData.displayName || "",
    businessName: onboardingData.businessName || "",
    industry: onboardingData.industry || "",
    businessSize: onboardingData.businessSize || "",
    location: onboardingData.location || "",
    website: onboardingData.website || "",
    phone: onboardingData.phone || ""
  });
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Update local form state when onboardingData changes
  useEffect(() => {
    setFormData({
      displayName: onboardingData.displayName || "",
      businessName: onboardingData.businessName || "",
      industry: onboardingData.industry || "",
      businessSize: onboardingData.businessSize || "",
      location: onboardingData.location || "",
      website: onboardingData.website || "",
      phone: onboardingData.phone || ""
    });
  }, [onboardingData]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Your name is required";
    }
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }
    
    if (!formData.industry) {
      newErrors.industry = "Please select an industry";
    }
    
    if (!formData.businessSize) {
      newErrors.businessSize = "Please select a business size";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      updateOnboardingData(formData);
      goToNextStep();
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Tell us about your business
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          We'll customize your marketing platform based on your business details.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Your Name</Label>
            <Input
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={errors.displayName ? "border-red-500" : ""}
            />
            {errors.displayName && (
              <p className="text-sm text-red-500">{errors.displayName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="Acme Inc."
              className={errors.businessName ? "border-red-500" : ""}
            />
            {errors.businessName && (
              <p className="text-sm text-red-500">{errors.businessName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => handleSelectChange("industry", value)}
            >
              <SelectTrigger 
                id="industry"
                className={errors.industry ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-sm text-red-500">{errors.industry}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessSize">Business Size</Label>
            <Select
              value={formData.businessSize}
              onValueChange={(value) => handleSelectChange("businessSize", value)}
            >
              <SelectTrigger 
                id="businessSize"
                className={errors.businessSize ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select business size" />
              </SelectTrigger>
              <SelectContent>
                {businessSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.businessSize && (
              <p className="text-sm text-red-500">{errors.businessSize}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="New York, NY"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
        
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