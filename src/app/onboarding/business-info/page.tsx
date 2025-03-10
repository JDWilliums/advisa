"use client";

import { useEffect, useState } from "react";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BusinessDetailsForm from "@/components/BusinessDetailsForm";

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

// Business type options by industry
const businessTypesByIndustry: Record<string, string[]> = {
  "Retail": [
    "Clothing & Apparel",
    "Electronics",
    "Home Goods",
    "Specialty Store",
    "Department Store",
    "Grocery",
    "E-commerce",
    "Bookstore",
    "Jewelry",
    "Sporting Goods",
    "Pet Supplies",
    "Toy Store",
    "Gift Shop",
    "Furniture Store",
    "Other Retail"
  ],
  "Food & Beverage": [
    "Restaurant",
    "Cafe",
    "Bakery",
    "Food Truck",
    "Catering",
    "Bar/Pub",
    "Brewery/Winery",
    "Food Delivery",
    "Juice/Smoothie Bar",
    "Ice Cream Shop",
    "Coffee Shop",
    "Specialty Food Store",
    "Meal Prep Service",
    "Other Food & Beverage"
  ],
  "Professional Services": [
    "Accounting",
    "Legal",
    "Consulting",
    "Marketing Agency",
    "Financial Services",
    "HR Services",
    "IT Services",
    "Design Agency",
    "PR Agency",
    "Business Coaching",
    "Translation Services",
    "Event Planning",
    "Photography",
    "Videography",
    "Other Professional Services"
  ],
  "Health & Wellness": [
    "Gym/Fitness Center",
    "Personal Trainer",
    "Yoga Studio",
    "Spa/Salon",
    "Nutritionist",
    "Mental Health",
    "Physical Therapy",
    "Chiropractic",
    "Medical Practice",
    "Dental Practice",
    "Massage Therapy",
    "Acupuncture",
    "Wellness Coaching",
    "Other Health & Wellness"
  ],
  "Technology": [
    "Software Development",
    "Web Development",
    "App Development",
    "IT Consulting",
    "Hardware",
    "SaaS",
    "E-commerce Platform",
    "AI/Machine Learning",
    "Cybersecurity",
    "Cloud Services",
    "Data Analytics",
    "IoT Solutions",
    "Game Development",
    "Other Technology"
  ],
  "Education": [
    "Tutoring",
    "Online Courses",
    "Training",
    "Coaching",
    "School",
    "Educational Technology",
    "Language Learning",
    "Test Preparation",
    "Music Lessons",
    "Art Classes",
    "Vocational Training",
    "Early Childhood Education",
    "Special Education",
    "Other Education"
  ],
  "Real Estate": [
    "Residential Sales",
    "Commercial Sales",
    "Property Management",
    "Real Estate Development",
    "Real Estate Investment",
    "Vacation Rentals",
    "Real Estate Photography",
    "Home Staging",
    "Real Estate Appraisal",
    "Mortgage Brokerage",
    "Real Estate Consulting",
    "Other Real Estate"
  ],
  "Home Services": [
    "Cleaning",
    "Landscaping",
    "Plumbing",
    "Electrical",
    "HVAC",
    "Renovation",
    "Interior Design",
    "Painting",
    "Carpentry",
    "Roofing",
    "Flooring",
    "Home Inspection",
    "Pest Control",
    "Moving Services",
    "Other Home Services"
  ],
  "Arts & Entertainment": [
    "Music",
    "Visual Arts",
    "Performing Arts",
    "Photography",
    "Videography",
    "Event Planning",
    "DJ Services",
    "Band/Musical Group",
    "Art Gallery",
    "Theater Company",
    "Film Production",
    "Dance Studio",
    "Recording Studio",
    "Other Arts & Entertainment"
  ],
  "Manufacturing": [
    "Food Production",
    "Textiles",
    "Electronics",
    "Furniture",
    "Automotive",
    "Metalworking",
    "Woodworking",
    "Plastics",
    "Printing",
    "Jewelry Making",
    "Craft Brewing/Distilling",
    "Custom Fabrication",
    "Other Manufacturing"
  ],
  "Other": [
    "Transportation",
    "Agriculture",
    "Construction",
    "Nonprofit",
    "Childcare",
    "Pet Services",
    "Travel Agency",
    "Environmental Services",
    "Security Services",
    "Automotive Services",
    "Repair Services",
    "Other Business Type"
  ]
};

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
    businessType: onboardingData.businessType || "",
    businessSize: onboardingData.businessSize || "",
    location: onboardingData.location || "",
    website: onboardingData.website || "",
    phone: onboardingData.phone || "",
    about: onboardingData.about || "",
    
    // Detailed business information
    targetAudience: onboardingData.targetAudience || "",
    specializations: onboardingData.specializations || [],
    businessModel: onboardingData.businessModel || "",
    yearsInBusiness: onboardingData.yearsInBusiness || "",
    priceRange: onboardingData.priceRange || "",
    serviceArea: onboardingData.serviceArea || "",
    keyDifferentiators: onboardingData.keyDifferentiators || []
  });
  
  // Get business types for the selected industry
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  
  // Update business types when industry changes
  useEffect(() => {
    if (formData.industry) {
      setBusinessTypes(businessTypesByIndustry[formData.industry] || []);
      
      // If current business type is not in the new list, reset it
      if (formData.businessType && !businessTypesByIndustry[formData.industry]?.includes(formData.businessType)) {
        setFormData(prev => ({ ...prev, businessType: "" }));
      }
    } else {
      setBusinessTypes([]);
    }
  }, [formData.industry]);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Update local form state when onboardingData changes
  useEffect(() => {
    setFormData({
      displayName: onboardingData.displayName || "",
      businessName: onboardingData.businessName || "",
      industry: onboardingData.industry || "",
      businessType: onboardingData.businessType || "",
      businessSize: onboardingData.businessSize || "",
      location: onboardingData.location || "",
      website: onboardingData.website || "",
      phone: onboardingData.phone || "",
      about: onboardingData.about || "",
      
      // Detailed business information
      targetAudience: onboardingData.targetAudience || "",
      specializations: onboardingData.specializations || [],
      businessModel: onboardingData.businessModel || "",
      yearsInBusiness: onboardingData.yearsInBusiness || "",
      priceRange: onboardingData.priceRange || "",
      serviceArea: onboardingData.serviceArea || "",
      keyDifferentiators: onboardingData.keyDifferentiators || []
    });
  }, [onboardingData]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    
    if (formData.industry && businessTypes.length > 0 && !formData.businessType) {
      newErrors.businessType = "Please select a business type";
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
  
  // Handle business details form changes
  const handleBusinessDetailsChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error if there is one
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
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
          
          {/* Business Type - Only show if industry is selected */}
          {formData.industry && businessTypes.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleSelectChange("businessType", value)}
              >
                <SelectTrigger 
                  id="businessType"
                  className={errors.businessType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.businessType && (
                <p className="text-sm text-red-500">{errors.businessType}</p>
              )}
            </div>
          )}
          
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
        
        {/* Business About Section - Full Width */}
        <div className="space-y-2">
          <Label htmlFor="about">
            Business Description
            <span className="ml-1 text-sm text-gray-500">(This helps us find relevant competitors)</span>
          </Label>
          <Textarea
            id="about"
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            placeholder="Describe your business, products/services, target audience, and what makes you unique..."
            className="min-h-[120px]"
          />
          <p className="text-sm text-gray-500">
            A detailed description helps us provide more accurate market research and competitor analysis.
          </p>
        </div>
        
        {/* Show Business Details Form only if industry and business type are selected */}
        {formData.industry && formData.businessType && (
          <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
            <BusinessDetailsForm
              industry={formData.industry}
              businessType={formData.businessType}
              formData={{
                targetAudience: formData.targetAudience,
                specializations: formData.specializations,
                businessModel: formData.businessModel,
                yearsInBusiness: formData.yearsInBusiness,
                priceRange: formData.priceRange,
                serviceArea: formData.serviceArea,
                keyDifferentiators: formData.keyDifferentiators
              }}
              onChange={handleBusinessDetailsChange}
            />
          </div>
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