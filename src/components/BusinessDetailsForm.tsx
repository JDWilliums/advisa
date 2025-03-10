'use client';

import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

// Define the props for the component
interface BusinessDetailsFormProps {
  industry: string;
  businessType: string;
  formData: {
    targetAudience?: string;
    specializations?: string[];
    businessModel?: string;
    yearsInBusiness?: string;
    priceRange?: string;
    serviceArea?: string;
    keyDifferentiators?: string[];
  };
  onChange: (name: string, value: any) => void;
}

// Business model options by industry
const businessModelsByIndustry: Record<string, string[]> = {
  "Health & Wellness": [
    "One-on-one sessions",
    "Group classes",
    "Membership",
    "Pay-per-session",
    "Package deals",
    "Online coaching",
    "Hybrid (in-person/online)",
    "Corporate wellness",
    "Other"
  ],
  "Technology": [
    "SaaS (Software as a Service)",
    "PaaS (Platform as a Service)",
    "IaaS (Infrastructure as a Service)",
    "Subscription",
    "Freemium",
    "One-time license",
    "Open source with paid support",
    "Marketplace",
    "Custom development",
    "Other"
  ],
  "Retail": [
    "Brick and mortar store",
    "E-commerce",
    "Hybrid (online/offline)",
    "Pop-up shop",
    "Marketplace seller",
    "Dropshipping",
    "Subscription box",
    "Direct-to-consumer",
    "Wholesale",
    "Other"
  ],
  "Food & Beverage": [
    "Dine-in restaurant",
    "Fast food",
    "Café",
    "Food truck",
    "Catering",
    "Delivery-only",
    "Subscription meal service",
    "Bakery",
    "Brewery/Winery",
    "Other"
  ],
  "Professional Services": [
    "Hourly billing",
    "Project-based",
    "Retainer",
    "Value-based pricing",
    "Subscription service",
    "Membership model",
    "Contingency fee",
    "Flat fee",
    "Other"
  ],
  "Home Services": [
    "One-time service",
    "Recurring service",
    "Subscription/Membership",
    "Package deals",
    "Emergency service",
    "Estimate-based",
    "Hourly rate",
    "Flat rate",
    "Other"
  ],
  "default": [
    "Service-based",
    "Product-based",
    "Subscription",
    "Membership",
    "Freemium",
    "One-time purchase",
    "Retainer",
    "Project-based",
    "Hourly rate",
    "Other"
  ]
};

// Price range options
const priceRangeOptions = [
  "Budget/Economy",
  "Mid-range",
  "Premium/Luxury",
  "Variable (multiple price points)"
];

// Service area options
const serviceAreaOptions = [
  "Local (city/town)",
  "Regional (state/province)",
  "National",
  "International",
  "Online only"
];

// Years in business options
const yearsInBusinessOptions = [
  "Pre-launch/Just starting",
  "Less than 1 year",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years"
];

// Specialization suggestions by business type
const specializationsByBusinessType: Record<string, string[]> = {
  // Health & Wellness
  "Personal Trainer": [
    "Weight loss",
    "Strength training",
    "Sports performance",
    "Bodybuilding",
    "Functional fitness",
    "Senior fitness",
    "Rehabilitation",
    "Nutrition coaching",
    "Online training",
    "Group training"
  ],
  "Yoga Studio": [
    "Hatha yoga",
    "Vinyasa flow",
    "Hot yoga",
    "Prenatal yoga",
    "Restorative yoga",
    "Meditation",
    "Corporate yoga",
    "Kids yoga",
    "Yoga therapy",
    "Teacher training"
  ],
  "Nutritionist": [
    "Weight management",
    "Sports nutrition",
    "Digestive health",
    "Food allergies/intolerances",
    "Diabetes management",
    "Heart health",
    "Prenatal nutrition",
    "Plant-based diets",
    "Eating disorders",
    "Corporate wellness"
  ],
  
  // Technology
  "SaaS": [
    "CRM",
    "Marketing automation",
    "Project management",
    "Accounting/Finance",
    "HR/Recruiting",
    "E-commerce",
    "Analytics",
    "Communication",
    "Productivity",
    "Security",
    "AI/Machine Learning",
    "Industry-specific solutions"
  ],
  "Web Development": [
    "E-commerce websites",
    "Corporate websites",
    "Web applications",
    "WordPress development",
    "Custom CMS",
    "Frontend development",
    "Backend development",
    "Full-stack development",
    "Responsive design",
    "Website maintenance"
  ],
  
  // Retail
  "Clothing Store": [
    "Women's fashion",
    "Men's fashion",
    "Children's clothing",
    "Activewear",
    "Sustainable/Ethical fashion",
    "Vintage/Second-hand",
    "Accessories",
    "Plus size",
    "Luxury",
    "Budget/Affordable"
  ],
  "Home Goods": [
    "Furniture",
    "Decor",
    "Kitchenware",
    "Bedding & Bath",
    "Outdoor/Garden",
    "Sustainable products",
    "Handmade items",
    "Vintage/Antique",
    "Smart home",
    "Seasonal items"
  ],
  
  // Food & Beverage
  "Restaurant": [
    "Italian cuisine",
    "Asian cuisine",
    "American cuisine",
    "Mexican cuisine",
    "Mediterranean cuisine",
    "Vegetarian/Vegan",
    "Fast casual",
    "Fine dining",
    "Family-friendly",
    "Farm-to-table"
  ],
  "Bakery": [
    "Artisan bread",
    "Cakes & pastries",
    "Gluten-free options",
    "Vegan options",
    "Wedding cakes",
    "Custom orders",
    "Breakfast items",
    "Coffee service",
    "Wholesale",
    "Catering"
  ],
  
  // Professional Services
  "Accounting": [
    "Tax preparation",
    "Bookkeeping",
    "Audit services",
    "Financial planning",
    "Business consulting",
    "Payroll services",
    "Forensic accounting",
    "Nonprofit accounting",
    "Small business specialists",
    "International tax"
  ],
  "Marketing Agency": [
    "Digital marketing",
    "Social media management",
    "Content marketing",
    "SEO/SEM",
    "Email marketing",
    "Branding",
    "Video production",
    "Influencer marketing",
    "Analytics & reporting",
    "Industry-specific marketing"
  ],
  
  // Home Services
  "Cleaning Service": [
    "Residential cleaning",
    "Commercial cleaning",
    "Deep cleaning",
    "Move-in/Move-out cleaning",
    "Post-construction cleaning",
    "Green/Eco-friendly cleaning",
    "Carpet cleaning",
    "Window cleaning",
    "Regular maintenance",
    "One-time services"
  ],
  "Landscaping": [
    "Lawn maintenance",
    "Garden design",
    "Hardscaping",
    "Tree services",
    "Irrigation systems",
    "Seasonal cleanup",
    "Commercial landscaping",
    "Sustainable landscaping",
    "Outdoor lighting",
    "Snow removal"
  ],
  
  "default": [
    "Enter your specializations..."
  ]
};

// Target audience suggestions by business type
const audienceByBusinessType: Record<string, string[]> = {
  // Health & Wellness
  "Personal Trainer": [
    "General fitness enthusiasts",
    "Weight loss clients",
    "Athletes",
    "Bodybuilders",
    "Seniors",
    "Post-rehabilitation clients",
    "Corporate clients",
    "Youth/Teenagers",
    "Pregnant/Postpartum women",
    "Beginners"
  ],
  
  // Technology
  "SaaS": [
    "Small businesses",
    "Mid-market companies",
    "Enterprise organizations",
    "Startups",
    "Specific industry (e.g., healthcare, finance)",
    "Freelancers/Solopreneurs",
    "Developers",
    "Marketing teams",
    "Sales teams",
    "HR departments",
    "IT departments"
  ],
  
  // Retail
  "Clothing Store": [
    "Women 25-45",
    "Men 25-45",
    "Teenagers/Young adults",
    "Children/Parents",
    "Professionals/Office workers",
    "Fitness enthusiasts",
    "Eco-conscious consumers",
    "Budget shoppers",
    "Luxury shoppers",
    "Fashion-forward individuals"
  ],
  
  // Food & Beverage
  "Restaurant": [
    "Families",
    "Young professionals",
    "Business lunch crowd",
    "Date night couples",
    "Health-conscious diners",
    "Foodies/Culinary enthusiasts",
    "Tourists/Visitors",
    "Special occasion celebrants",
    "Vegetarians/Vegans",
    "Local neighborhood residents"
  ],
  
  // Professional Services
  "Accounting": [
    "Small business owners",
    "Self-employed/Freelancers",
    "Startups",
    "High-net-worth individuals",
    "Real estate investors",
    "Nonprofit organizations",
    "E-commerce businesses",
    "Professional service firms",
    "Local businesses",
    "International businesses"
  ],
  
  // Home Services
  "Cleaning Service": [
    "Busy professionals",
    "Dual-income families",
    "Seniors/Elderly",
    "Vacation rental owners",
    "Real estate agents (for listings)",
    "Property managers",
    "New homeowners",
    "People with mobility issues",
    "Small offices/Businesses",
    "Event venues"
  ],
  
  "default": [
    "Enter your target audience..."
  ]
};

// Key differentiator suggestions by business type
const differentiatorsByBusinessType: Record<string, string[]> = {
  // Health & Wellness
  "Personal Trainer": [
    "Specialized certification",
    "Unique training methodology",
    "Personalized nutrition plans",
    "Advanced technology/tracking",
    "Flexible scheduling",
    "Mobile service (come to client)",
    "Guaranteed results",
    "Community/group support",
    "Holistic approach",
    "Specialized equipment"
  ],
  
  // Technology
  "SaaS": [
    "Ease of use",
    "Advanced features",
    "Integration capabilities",
    "AI-powered",
    "Superior customer support",
    "Customization options",
    "Data security",
    "Competitive pricing",
    "Unique methodology",
    "Industry-specific expertise",
    "Proprietary technology"
  ],
  
  // Retail
  "Clothing Store": [
    "Curated selection",
    "Sustainable/Ethical sourcing",
    "Exclusive brands/products",
    "Personalized styling service",
    "Loyalty program",
    "Extended size range",
    "Custom alterations",
    "Exceptional customer service",
    "Unique in-store experience",
    "Community involvement"
  ],
  
  // Food & Beverage
  "Restaurant": [
    "Signature dishes",
    "Local/Organic ingredients",
    "Unique atmosphere/decor",
    "Award-winning chef",
    "Special dietary accommodations",
    "Tableside service/preparation",
    "House-made specialties",
    "Historical/Unique location",
    "Entertainment/Events",
    "Secret recipes/techniques"
  ],
  
  // Professional Services
  "Accounting": [
    "Industry specialization",
    "Advanced technology/software",
    "Fixed/Transparent pricing",
    "24/7 availability",
    "Multilingual service",
    "Fast turnaround times",
    "Money-saving guarantee",
    "Free consultations",
    "Ongoing education/resources",
    "Personalized service"
  ],
  
  // Home Services
  "Cleaning Service": [
    "Eco-friendly products",
    "Trained/Certified staff",
    "Satisfaction guarantee",
    "Same-day service",
    "Online booking/management",
    "Consistent cleaning teams",
    "Detailed checklist system",
    "Insured and bonded",
    "Specialized equipment",
    "Customizable service packages"
  ],
  
  "default": [
    "Enter your key differentiators..."
  ]
};

const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({ 
  industry, 
  businessType, 
  formData, 
  onChange 
}) => {
  // State for new specialization or differentiator input
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newDifferentiator, setNewDifferentiator] = useState('');
  
  // Get the appropriate options based on business type and industry
  const getBusinessModels = () => {
    return businessModelsByIndustry[industry] || businessModelsByIndustry.default;
  };
  
  const getSpecializationSuggestions = () => {
    return specializationsByBusinessType[businessType] || specializationsByBusinessType.default;
  };
  
  const getAudienceSuggestions = () => {
    return audienceByBusinessType[businessType] || audienceByBusinessType.default;
  };
  
  const getDifferentiatorSuggestions = () => {
    return differentiatorsByBusinessType[businessType] || differentiatorsByBusinessType.default;
  };
  
  // Handle adding a new specialization
  const handleAddSpecialization = () => {
    if (newSpecialization.trim() === '') return;
    
    const currentSpecializations = formData.specializations || [];
    if (!currentSpecializations.includes(newSpecialization)) {
      onChange('specializations', [...currentSpecializations, newSpecialization]);
      setNewSpecialization('');
    }
  };
  
  // Handle removing a specialization
  const handleRemoveSpecialization = (specialization: string) => {
    const currentSpecializations = formData.specializations || [];
    onChange('specializations', currentSpecializations.filter(s => s !== specialization));
  };
  
  // Handle adding a new differentiator
  const handleAddDifferentiator = () => {
    if (newDifferentiator.trim() === '') return;
    
    const currentDifferentiators = formData.keyDifferentiators || [];
    if (!currentDifferentiators.includes(newDifferentiator)) {
      onChange('keyDifferentiators', [...currentDifferentiators, newDifferentiator]);
      setNewDifferentiator('');
    }
  };
  
  // Handle removing a differentiator
  const handleRemoveDifferentiator = (differentiator: string) => {
    const currentDifferentiators = formData.keyDifferentiators || [];
    onChange('keyDifferentiators', currentDifferentiators.filter(d => d !== differentiator));
  };
  
  // Handle selecting a suggested specialization
  const handleSelectSpecialization = (specialization: string) => {
    const currentSpecializations = formData.specializations || [];
    if (!currentSpecializations.includes(specialization)) {
      onChange('specializations', [...currentSpecializations, specialization]);
    }
  };
  
  // Handle selecting a suggested differentiator
  const handleSelectDifferentiator = (differentiator: string) => {
    const currentDifferentiators = formData.keyDifferentiators || [];
    if (!currentDifferentiators.includes(differentiator)) {
      onChange('keyDifferentiators', [...currentDifferentiators, differentiator]);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Business Details</h3>
        <p className="text-sm text-muted-foreground">
          These details help us find the most relevant competitors for your specific business.
        </p>
      </div>
      
      {/* Target Audience */}
      <div className="space-y-2">
        <Label htmlFor="targetAudience">Who is your target audience?</Label>
        <Textarea
          id="targetAudience"
          value={formData.targetAudience || ''}
          onChange={(e) => onChange('targetAudience', e.target.value)}
          placeholder="Describe who your ideal customers or clients are..."
          className="min-h-[80px]"
        />
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {getAudienceSuggestions().map((audience) => (
              <Badge 
                key={audience} 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary"
                onClick={() => onChange('targetAudience', audience)}
              >
                {audience}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Specializations */}
      <div className="space-y-2">
        <Label htmlFor="specializations">What are your specializations or areas of expertise?</Label>
        <div className="flex gap-2">
          <Input
            id="newSpecialization"
            value={newSpecialization}
            onChange={(e) => setNewSpecialization(e.target.value)}
            placeholder="Add a specialization..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialization())}
          />
          <Button type="button" size="sm" onClick={handleAddSpecialization}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Display current specializations */}
        {(formData.specializations?.length || 0) > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.specializations?.map((specialization) => (
              <Badge key={specialization} variant="secondary" className="flex items-center gap-1">
                {specialization}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveSpecialization(specialization)}
                />
              </Badge>
            ))}
          </div>
        )}
        
        {/* Specialization suggestions */}
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {getSpecializationSuggestions().map((specialization) => (
              <Badge 
                key={specialization} 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary"
                onClick={() => handleSelectSpecialization(specialization)}
              >
                {specialization}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Business Model */}
      <div className="space-y-2">
        <Label htmlFor="businessModel">Business Model</Label>
        <Select
          value={formData.businessModel || ''}
          onValueChange={(value) => onChange('businessModel', value)}
        >
          <SelectTrigger id="businessModel">
            <SelectValue placeholder="Select your business model" />
          </SelectTrigger>
          <SelectContent>
            {getBusinessModels().map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Years in Business */}
      <div className="space-y-2">
        <Label htmlFor="yearsInBusiness">Years in Business</Label>
        <Select
          value={formData.yearsInBusiness || ''}
          onValueChange={(value) => onChange('yearsInBusiness', value)}
        >
          <SelectTrigger id="yearsInBusiness">
            <SelectValue placeholder="Select years in business" />
          </SelectTrigger>
          <SelectContent>
            {yearsInBusinessOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Price Range */}
      <div className="space-y-2">
        <Label htmlFor="priceRange">Price Range</Label>
        <Select
          value={formData.priceRange || ''}
          onValueChange={(value) => onChange('priceRange', value)}
        >
          <SelectTrigger id="priceRange">
            <SelectValue placeholder="Select your price range" />
          </SelectTrigger>
          <SelectContent>
            {priceRangeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Service Area */}
      <div className="space-y-2">
        <Label htmlFor="serviceArea">Service Area</Label>
        <Select
          value={formData.serviceArea || ''}
          onValueChange={(value) => onChange('serviceArea', value)}
        >
          <SelectTrigger id="serviceArea">
            <SelectValue placeholder="Select your service area" />
          </SelectTrigger>
          <SelectContent>
            {serviceAreaOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Key Differentiators */}
      <div className="space-y-2">
        <Label htmlFor="keyDifferentiators">What makes your business unique?</Label>
        <div className="flex gap-2">
          <Input
            id="newDifferentiator"
            value={newDifferentiator}
            onChange={(e) => setNewDifferentiator(e.target.value)}
            placeholder="Add a key differentiator..."
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDifferentiator())}
          />
          <Button type="button" size="sm" onClick={handleAddDifferentiator}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Display current differentiators */}
        {(formData.keyDifferentiators?.length || 0) > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.keyDifferentiators?.map((differentiator) => (
              <Badge key={differentiator} variant="secondary" className="flex items-center gap-1">
                {differentiator}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveDifferentiator(differentiator)}
                />
              </Badge>
            ))}
          </div>
        )}
        
        {/* Differentiator suggestions */}
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {getDifferentiatorSuggestions().map((differentiator) => (
              <Badge 
                key={differentiator} 
                variant="outline" 
                className="cursor-pointer hover:bg-secondary"
                onClick={() => handleSelectDifferentiator(differentiator)}
              >
                {differentiator}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsForm; 