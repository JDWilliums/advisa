"use client"

import React, { useState } from 'react';
import { 
  Calendar, 
  Edit2, 
  Github, 
  Globe, 
  Linkedin, 
  Mail,
  MapPin,
  Briefcase,
  Download,
  Phone
} from 'lucide-react';

// Type definitions
interface ProfileData {
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  bio: string;
  joinDate: string;
  avatarUrl: string;
  skills: string[];
}

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

// Sample data
const profileData: ProfileData = {
  name: 'Alex Johnson',
  jobTitle: 'Marketing Director',
  company: 'Acme Inc.',
  location: 'New York, NY',
  website: 'alexjohnson.example.com',
  email: 'alex.johnson@example.com',
  phone: '(555) 123-4567',
  bio: 'Marketing professional with over 10 years of experience specializing in digital strategy and analytics. Passionate about data-driven marketing and emerging technologies in the MarTech space.',
  joinDate: 'January 2021',
  avatarUrl: '/api/placeholder/200/200',
  skills: [
    'Digital Marketing', 'SEO', 'Content Strategy', 'Social Media', 
    'Marketing Analytics', 'Data Visualization', 'Campaign Management',
    'A/B Testing', 'Marketing Automation', 'Brand Strategy'
  ]
};

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

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Bio Section */}
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
              <p className="text-muted-foreground leading-relaxed">{profileData.bio}</p>
            </div>
            
            {/* Skills Section */}
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-lg font-semibold text-foreground mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-accent/50 text-foreground rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Experience Section */}
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="text-lg font-semibold text-foreground mb-3">Experience</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Marketing Director</h4>
                      <p className="text-sm text-muted-foreground">Acme Inc.</p>
                    </div>
                    <p className="text-sm text-muted-foreground">2021 - Present</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Leading the marketing department and developing strategies across digital and traditional channels.
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Senior Marketing Manager</h4>
                      <p className="text-sm text-muted-foreground">TechCorp</p>
                    </div>
                    <p className="text-sm text-muted-foreground">2018 - 2021</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Managed digital marketing campaigns and analytics for B2B technology products.
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Marketing Specialist</h4>
                      <p className="text-sm text-muted-foreground">Global Innovations</p>
                    </div>
                    <p className="text-sm text-muted-foreground">2015 - 2018</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Focused on content marketing and social media strategy for consumer products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">Reports</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Format</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reportsData.map((report) => (
                    <tr key={report.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-foreground">{report.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{report.description}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getToolTypeBadgeColor(report.toolType)}`}>
                          {report.toolType}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                        {report.date}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                        {report.format}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                        {report.fileSize}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'projects':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Projects</h3>
            {projectsData.map((project) => (
              <div key={project.id} className="bg-card border border-border rounded-lg p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground">{project.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(project.status)}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" /> 
                    <span>{project.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" /> 
                    <span>Client: {project.client}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background">
                <img
                  src={profileData.avatarUrl}
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{profileData.name}</h1>
                  <p className="text-lg text-muted-foreground">{profileData.jobTitle} at {profileData.company}</p>
                </div>
                <button
                  type="button"
                  className="mt-2 md:mt-0 px-3 py-2 bg-accent text-foreground border border-border rounded-md hover:bg-accent/80 transition-colors inline-flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                </button>
              </div>
              
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" /> {profileData.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" /> {profileData.email}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" /> {profileData.phone}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Globe className="h-4 w-4 mr-2" /> {profileData.website}
                </div>
              </div>
              
              {/* Professional Links */}
              <div className="flex items-center space-x-2 mt-4">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
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