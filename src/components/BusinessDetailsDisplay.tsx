import React from 'react';
import { UserProfile } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Edit2 } from 'lucide-react';

interface BusinessDetailsDisplayProps {
  profile: UserProfile;
  onEdit: () => void;
}

const BusinessDetailsDisplay: React.FC<BusinessDetailsDisplayProps> = ({
  profile,
  onEdit
}) => {
  // Format marketing goals and channels for display
  const formatLabel = (id: string): string => {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Basic Business Information */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-foreground">Business Information</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEdit}
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Business Name</p>
            <p className="text-foreground">{profile?.businessName || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Industry</p>
            <p className="text-foreground">{profile?.industry || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Business Type</p>
            <p className="text-foreground">{profile?.businessType || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Business Size</p>
            <p className="text-foreground">{profile?.businessSize || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="text-foreground">{profile?.location || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Years in Business</p>
            <p className="text-foreground">{profile?.yearsInBusiness || 'Not specified'}</p>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
        <p className="text-muted-foreground leading-relaxed">
          {profile?.bio || 'No bio information available. Click Edit to add information about your business.'}
        </p>
      </div>
      
      {/* Detailed Business Information */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold text-foreground mb-3">Detailed Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Business Model</p>
            <p className="text-foreground">{profile?.businessModel || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Target Audience</p>
            <p className="text-foreground">{profile?.targetAudience || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Price Range</p>
            <p className="text-foreground">{profile?.priceRange || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Service Area</p>
            <p className="text-foreground">{profile?.serviceArea || 'Not specified'}</p>
          </div>
        </div>
      </div>
      
      {/* Specializations */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold text-foreground mb-3">Specializations</h3>
        {profile?.specializations && profile.specializations.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.specializations.map((specialization, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {specialization}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No specializations specified.</p>
        )}
      </div>
      
      {/* Key Differentiators */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold text-foreground mb-3">Key Differentiators</h3>
        {profile?.keyDifferentiators && profile.keyDifferentiators.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.keyDifferentiators.map((differentiator, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {differentiator}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No key differentiators specified.</p>
        )}
      </div>
      
      {/* Marketing Goals Section */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold text-foreground mb-3">Marketing Goals</h3>
        {profile?.goals && profile.goals.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.goals.map((goal, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm"
              >
                {formatLabel(goal)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No marketing goals specified.</p>
        )}
      </div>
      
      {/* Marketing Channels Section */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-lg font-semibold text-foreground mb-3">Marketing Channels</h3>
        {profile?.marketingChannels && profile.marketingChannels.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.marketingChannels.map((channel, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-primary/20 text-primary rounded-md text-sm border border-primary/20"
              >
                {formatLabel(channel)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No marketing channels specified.</p>
        )}
      </div>
    </div>
  );
};

export default BusinessDetailsDisplay; 