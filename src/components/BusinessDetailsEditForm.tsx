import React, { useState, useEffect } from 'react';
import { UserProfile, updateUserProfile } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

interface BusinessDetailsEditFormProps {
  profile: UserProfile;
  onSave: () => void;
  onCancel: () => void;
}

// Marketing goals and channels options
const MARKETING_GOALS = [
  'increase-brand-awareness',
  'generate-leads',
  'increase-sales',
  'improve-customer-retention',
  'expand-to-new-markets',
  'launch-new-product',
  'improve-online-presence',
  'increase-website-traffic',
  'improve-customer-experience',
  'reduce-marketing-costs'
];

const MARKETING_CHANNELS = [
  'social-media',
  'email-marketing',
  'content-marketing',
  'seo',
  'paid-advertising',
  'influencer-marketing',
  'events',
  'pr',
  'direct-mail',
  'affiliate-marketing',
  'referral-programs',
  'video-marketing'
];

const BusinessDetailsEditForm: React.FC<BusinessDetailsEditFormProps> = ({
  profile,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    businessName: profile.businessName || '',
    industry: profile.industry || '',
    businessType: profile.businessType || '',
    businessSize: profile.businessSize || '',
    location: profile.location || '',
    website: profile.website || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    targetAudience: profile.targetAudience || '',
    specializations: profile.specializations || [],
    businessModel: profile.businessModel || '',
    yearsInBusiness: profile.yearsInBusiness || '',
    priceRange: profile.priceRange || '',
    serviceArea: profile.serviceArea || '',
    keyDifferentiators: profile.keyDifferentiators || [],
    goals: profile.goals || [],
    marketingChannels: profile.marketingChannels || []
  });

  const [newSpecialization, setNewSpecialization] = useState('');
  const [newDifferentiator, setNewDifferentiator] = useState('');
  const [saving, setSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSpecialization = () => {
    if (newSpecialization.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  const handleAddDifferentiator = () => {
    if (newDifferentiator.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        keyDifferentiators: [...prev.keyDifferentiators, newDifferentiator.trim()]
      }));
      setNewDifferentiator('');
    }
  };

  const handleRemoveDifferentiator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyDifferentiators: prev.keyDifferentiators.filter((_, i) => i !== index)
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => {
      const isSelected = prev.goals.includes(goal);
      return {
        ...prev,
        goals: isSelected
          ? prev.goals.filter(g => g !== goal)
          : [...prev.goals, goal]
      };
    });
  };

  const handleChannelToggle = (channel: string) => {
    setFormData(prev => {
      const isSelected = prev.marketingChannels.includes(channel);
      return {
        ...prev,
        marketingChannels: isSelected
          ? prev.marketingChannels.filter(c => c !== channel)
          : [...prev.marketingChannels, channel]
      };
    });
  };

  const formatLabel = (id: string): string => {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateUserProfile(profile.uid, formData);
      toast.success('Business details updated successfully');
      onSave();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update business details');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="Your Business Name"
          />
        </div>
        
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            placeholder="e.g., Technology, Health & Wellness"
            readOnly
          />
        </div>
        
        <div>
          <Label htmlFor="businessType">Business Type</Label>
          <Input
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleInputChange}
            placeholder="e.g., SaaS, Personal Trainer"
            readOnly
          />
        </div>
        
        <div>
          <Label htmlFor="businessSize">Business Size</Label>
          <Input
            id="businessSize"
            name="businessSize"
            value={formData.businessSize}
            onChange={handleInputChange}
            placeholder="e.g., Small, Medium, Enterprise"
          />
        </div>
        
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="City, Country"
          />
        </div>
        
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://yourwebsite.com"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Your phone number"
          />
        </div>
        
        <div>
          <Label htmlFor="businessModel">Business Model</Label>
          <Input
            id="businessModel"
            name="businessModel"
            value={formData.businessModel}
            onChange={handleInputChange}
            placeholder="e.g., Subscription, One-time service"
          />
        </div>
        
        <div>
          <Label htmlFor="yearsInBusiness">Years in Business</Label>
          <Input
            id="yearsInBusiness"
            name="yearsInBusiness"
            value={formData.yearsInBusiness}
            onChange={handleInputChange}
            placeholder="e.g., 2, 5+"
          />
        </div>
        
        <div>
          <Label htmlFor="priceRange">Price Range</Label>
          <Input
            id="priceRange"
            name="priceRange"
            value={formData.priceRange}
            onChange={handleInputChange}
            placeholder="e.g., Budget, Premium"
          />
        </div>
        
        <div>
          <Label htmlFor="serviceArea">Service Area</Label>
          <Input
            id="serviceArea"
            name="serviceArea"
            value={formData.serviceArea}
            onChange={handleInputChange}
            placeholder="e.g., Local, National, International"
          />
        </div>
        
        <div>
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleInputChange}
            placeholder="Who your business serves"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="bio">About Your Business</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Tell us about your business"
          rows={4}
        />
      </div>
      
      {/* Specializations */}
      <div>
        <Label>Specializations</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.specializations.map((specialization, index) => (
            <div key={index} className="flex items-center bg-primary/10 text-primary rounded-md px-3 py-1">
              <span className="text-sm">{specialization}</span>
              <button
                type="button"
                onClick={() => handleRemoveSpecialization(index)}
                className="ml-2 text-primary/70 hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newSpecialization}
            onChange={(e) => setNewSpecialization(e.target.value)}
            placeholder="Add a specialization"
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddSpecialization}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Key Differentiators */}
      <div>
        <Label>Key Differentiators</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.keyDifferentiators.map((differentiator, index) => (
            <div key={index} className="flex items-center bg-primary/10 text-primary rounded-md px-3 py-1">
              <span className="text-sm">{differentiator}</span>
              <button
                type="button"
                onClick={() => handleRemoveDifferentiator(index)}
                className="ml-2 text-primary/70 hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newDifferentiator}
            onChange={(e) => setNewDifferentiator(e.target.value)}
            placeholder="Add a key differentiator"
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddDifferentiator}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Marketing Goals */}
      <div>
        <Label className="mb-2 block">Marketing Goals</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {MARKETING_GOALS.map((goal) => (
            <div key={goal} className="flex items-center space-x-2">
              <Checkbox 
                id={`goal-${goal}`} 
                checked={formData.goals.includes(goal)}
                onCheckedChange={() => handleGoalToggle(goal)}
              />
              <label 
                htmlFor={`goal-${goal}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {formatLabel(goal)}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Marketing Channels */}
      <div>
        <Label className="mb-2 block">Marketing Channels</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {MARKETING_CHANNELS.map((channel) => (
            <div key={channel} className="flex items-center space-x-2">
              <Checkbox 
                id={`channel-${channel}`} 
                checked={formData.marketingChannels.includes(channel)}
                onCheckedChange={() => handleChannelToggle(channel)}
              />
              <label 
                htmlFor={`channel-${channel}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {formatLabel(channel)}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={saving}
          className="gap-2"
        >
          {saving ? 'Saving...' : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default BusinessDetailsEditForm; 