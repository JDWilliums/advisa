"use client"

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Edit2, 
  FileText, 
  Github, 
  Globe, 
  Linkedin, 
  Mail,
  MapPin,
  MessageSquare,
  Share2,
  Star,
  User,
  Activity,
  Briefcase,
  PieChart,
  Eye,
  Download,
  Phone,
  Building2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, getUserProfile, createUserProfile } from '@/lib/userService';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import BusinessDetailsDisplay from '@/components/BusinessDetailsDisplay';
import BusinessDetailsEditForm from '@/components/BusinessDetailsEditForm';
import { Toaster } from 'sonner';

// Type definitions for sample data
interface Report {
  id: string;
  title: string;
  description: string;
  date: string;
  toolType: string;
  fileSize: string;
  format: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'planning';
  client: string;
}

// Sample data for reports and projects
const reportsData: Report[] = [
  {
    id: '1',
    title: 'Q1 2025 Social Media Analysis',
    description: 'Comprehensive analysis of our social media performance for Q1.',
    date: 'Feb 28, 2025',
    toolType: 'Brand Monitor',
    fileSize: '4.2 MB',
    format: 'PDF'
  },
  {
    id: '2',
    title: 'Competitor SEO Strategy Analysis',
    description: 'Deep dive into our competitors\' SEO strategies.',
    date: 'Feb 15, 2025',
    toolType: 'Market Research',
    fileSize: '8.7 MB',
    format: 'XLSX'
  },
  {
    id: '3',
    title: 'Ad Campaign Performance - Q4 2024',
    description: 'Analysis of the performance metrics for our Q4 ad campaigns.',
    date: 'Jan 10, 2025',
    toolType: 'Ad Performance Analyzer',
    fileSize: '5.1 MB',
    format: 'PDF'
  },
  {
    id: '4',
    title: 'Tech Industry Content Strategy',
    description: 'Content strategy recommendations for targeting the tech industry.',
    date: 'Feb 05, 2025',
    toolType: 'SEO & Content Optimization',
    fileSize: '3.8 MB',
    format: 'PDF'
  }
];

const projectsData: Project[] = [
  {
    id: '1',
    title: 'Website Redesign Project',
    description: 'Complete overhaul of our company website with focus on conversion optimization and user experience.',
    date: 'Jan - Mar 2025',
    status: 'in-progress',
    client: 'Acme Inc.'
  },
  {
    id: '2',
    title: 'Product Launch Campaign',
    description: 'Comprehensive marketing campaign for our new flagship product across all channels.',
    date: 'Nov 2024 - Jan 2025',
    status: 'completed',
    client: 'TechCorp'
  },
  {
    id: '3',
    title: 'Marketing Analytics Dashboard',
    description: 'Development of a centralized analytics dashboard for real-time monitoring of all marketing initiatives.',
    date: 'Apr - Jun 2025',
    status: 'planning',
    client: 'Global Innovations'
  }
];

// Profile Page Component
const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { user, refreshUserProfile } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch user profile data directly from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const profile = await getUserProfile(user.uid);
        console.log("Fetched profile data:", profile);
        
        if (!profile) {
          // If no profile exists, create one
          console.log("No profile found, creating a new one");
          const newProfile = await createUserProfile(
            user.uid, 
            user.email || 'unknown@example.com'
          );
          setProfileData(newProfile);
        } else {
          setProfileData(profile);
        }
        
        setError(null);
        setPermissionError(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        
        // Check if it's a permissions error
        if (err instanceof Error && err.message.includes('permission')) {
          setPermissionError(true);
          setError("Firestore permissions error. Please update your security rules.");
        } else {
          setError("Failed to load profile data. Please try refreshing the page.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  // Handle manual refresh
  const handleRefresh = async () => {
    if (!user) return;
    
    try {
      setRefreshing(true);
      setError(null);
      
      // Try to refresh via AuthContext first
      await refreshUserProfile();
      
      // Also fetch directly to update local state
      const profile = await getUserProfile(user.uid);
      
      if (!profile) {
        // If no profile exists, create one
        console.log("No profile found during refresh, creating a new one");
        const newProfile = await createUserProfile(
          user.uid, 
          user.email || 'unknown@example.com'
        );
        setProfileData(newProfile);
      } else {
        console.log("Profile refreshed:", profile);
        setProfileData(profile);
      }
      
    } catch (err) {
      console.error("Error refreshing profile:", err);
      setError("Failed to refresh profile data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };
  
  // Format marketing goals and channels for display
  const formatLabel = (id: string): string => {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Get badge color based on tool type
  const getToolTypeBadgeColor = (toolType: string): string => {
    switch (toolType) {
      case 'Brand Monitor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Market Research':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'SEO & Content Optimization':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Ad Performance Analyzer':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'planning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show permissions error state with instructions
  if (permissionError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
            <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-300">Firestore Permissions Error</h2>
          </div>
          
          <p className="text-amber-800 dark:text-amber-300 mb-4">
            Your Firestore security rules are currently set to deny all access. To fix this issue, please update your Firestore security rules in the Firebase Console.
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md mb-4 overflow-x-auto">
            <pre className="text-sm text-gray-800 dark:text-gray-200">
{`rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Default rule - deny all access
    match /{document=**} {
      allow read, write: if false;
    }
    
    // User profiles - allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`}
            </pre>
          </div>
          
          <p className="text-amber-800 dark:text-amber-300 mb-4">
            These rules will allow authenticated users to read and write only their own profile data.
          </p>
          
          <ol className="list-decimal list-inside text-amber-800 dark:text-amber-300 mb-4 space-y-2">
            <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
            <li>Select your project</li>
            <li>Click on "Firestore Database" in the left sidebar</li>
            <li>Click on the "Rules" tab</li>
            <li>Replace the current rules with the ones above</li>
            <li>Click "Publish"</li>
          </ol>
          
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-2"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  // Show general error state
  if (error && !permissionError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-800 dark:text-red-300 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="destructive"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  // Show no profile data state with refresh button
  if (!profileData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4">No Profile Data Found</h2>
          <p className="text-blue-800 dark:text-blue-300 mb-6">
            We couldn't find your profile data. This might be because you haven't completed the onboarding process yet, 
            or because your profile hasn't been created in the database.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="gap-2"
            >
              {refreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh Profile
                </>
              )}
            </Button>
            <Button 
              onClick={() => window.location.href = '/onboarding'}
              variant="outline"
            >
              Go to Onboarding
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {isEditing && profileData ? (
              <BusinessDetailsEditForm 
                profile={profileData} 
                onSave={() => {
                  setIsEditing(false);
                  handleRefresh();
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <BusinessDetailsDisplay 
                profile={profileData!} 
                onEdit={() => setIsEditing(true)}
              />
            )}
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportsData.map(report => (
                <div key={report.id} className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-foreground">{report.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getToolTypeBadgeColor(report.toolType)}`}>
                      {report.toolType}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{report.description}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {report.date}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {report.fileSize} • {report.format}
                    </div>
                    <button className="text-primary hover:text-primary/80 flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="space-y-6">
            {projectsData.map(project => (
              <div key={project.id} className="bg-card border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {project.date}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    Client: {project.client}
                  </div>
                  <button className="text-primary hover:text-primary/80 flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Profile Info */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-20 mb-4">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full border-4 border-background bg-muted overflow-hidden mr-4 relative">
              <Image 
                src={profileData?.avatarUrl || '/api/placeholder/200/200'} 
                alt={profileData?.displayName || 'User'} 
                fill
                sizes="(max-width: 768px) 96px, 96px"
                className="object-cover"
                priority
              />
            </div>
            
            {/* Name and Title */}
            <div className="mt-4 md:mt-0 flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {profileData?.displayName || user?.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-muted-foreground">
                {profileData?.businessName ? `${profileData.businessName}` : 'Your Business'}
                {profileData?.industry ? ` • ${profileData.industry}` : ''}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button 
                onClick={handleRefresh} 
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button 
                className="gap-2"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-t border-border">
            {profileData?.email && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profileData.email}</span>
              </div>
            )}
            {profileData?.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profileData.location}</span>
              </div>
            )}
            {profileData?.website && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="hover:text-primary"
                >
                  {profileData.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {profileData?.phone && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{profileData.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-6">
          <button
            type="button"
            className={`pb-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`pb-3 text-sm font-medium ${
              activeTab === 'reports'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
          <button
            type="button"
            className={`pb-3 text-sm font-medium ${
              activeTab === 'projects'
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="pb-12">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProfilePage;