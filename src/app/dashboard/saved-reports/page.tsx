"use client"

import React, { useState } from 'react';
import { Search, Filter, Download, Trash2, Calendar, Eye, MoreHorizontal } from 'lucide-react';

// Define types for our report data
interface Report {
  id: number;
  title: string;
  toolType: string;
  createdAt: string;
  createdBy: string;
  avatarUrl: string;
  status: string;
  format: string;
  fileSize: string;
  starred: boolean;
}

// Sample data for demonstration
const mockReports = [
  {
    id: 1,
    title: 'Q1 2025 Social Media Analysis',
    toolType: 'Brand Monitor',
    createdAt: 'Feb 28, 2025',
    createdBy: 'Alex Johnson',
    avatarUrl: '/api/placeholder/40/40',
    status: 'Complete',
    format: 'PDF',
    fileSize: '4.2 MB',
    starred: true,
  },
  {
    id: 2,
    title: 'Competitor SEO Strategy Analysis',
    toolType: 'Market Research',
    createdAt: 'Feb 15, 2025',
    createdBy: 'Sarah Miller',
    avatarUrl: '/api/placeholder/40/40',
    status: 'Complete',
    format: 'XLSX',
    fileSize: '8.7 MB',
    starred: false,
  },
  {
    id: 3,
    title: 'Ad Campaign Performance - Q4 2024',
    toolType: 'Ad Performance Analyzer',
    createdAt: 'Jan 10, 2025',
    createdBy: 'Alex Johnson',
    avatarUrl: '/api/placeholder/40/40',
    status: 'Complete',
    format: 'PDF',
    fileSize: '5.1 MB',
    starred: true,
  },
  {
    id: 4,
    title: 'Tech Industry Content Strategy',
    toolType: 'SEO & Content Optimization',
    createdAt: 'Feb 05, 2025',
    createdBy: 'Miguel Sanchez',
    avatarUrl: '/api/placeholder/40/40',
    status: 'Complete',
    format: 'PDF',
    fileSize: '3.8 MB',
    starred: false,
  },
  {
    id: 5,
    title: 'New Product Launch Strategy',
    toolType: 'AI Marketing Strategy',
    createdAt: 'Feb 22, 2025',
    createdBy: 'Jordan Lee',
    avatarUrl: '/api/placeholder/40/40',
    status: 'Draft',
    format: 'PDF',
    fileSize: '2.9 MB',
    starred: false,
  },
  {
    id: 6,
    title: 'Monthly Brand Sentiment Tracker',
    toolType: 'Brand Monitor',
    createdAt: 'Jan 31, 2025',
    createdBy: 'Sarah Miller',
    avatarUrl: '/api/placeholder/40/40',
    status: 'Complete',
    format: 'PDF',
    fileSize: '6.2 MB',
    starred: false,
  }
];

// Tool types for filter options
const toolTypes = [
  'All Tools',
  'Brand Monitor',
  'Market Research',
  'SEO & Content Optimization',
  'Ad Performance Analyzer',
  'AI Marketing Strategy',
];

// Report formats for filter options
const reportFormats = ['All Formats', 'PDF', 'XLSX', 'CSV', 'PPTX'];

const SavedReportsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolType, setSelectedToolType] = useState('All Tools');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [currentView, setCurrentView] = useState('all');
  const [reports, setReports] = useState(mockReports);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter reports based on search query, tool type, and format
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesToolType = selectedToolType === 'All Tools' || report.toolType === selectedToolType;
    const matchesFormat = selectedFormat === 'All Formats' || report.format === selectedFormat;
    const matchesView = currentView === 'all' || (currentView === 'starred' && report.starred);
    
    return matchesSearch && matchesToolType && matchesFormat && matchesView;
  });

  // Toggle star status
  const toggleStar = (id: number) => {
    setReports(
      reports.map((report) =>
        report.id === id ? { ...report, starred: !report.starred } : report
      )
    );
  };

  // Delete report
  const deleteReport = (id: number) => {
    setReports(reports.filter((report) => report.id !== id));
  };

  // Get badge color based on tool type
  const getToolTypeBadgeColor = (toolType: string) => {
    switch (toolType) {
      case 'Brand Monitor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Market Research':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'SEO & Content Optimization':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Ad Performance Analyzer':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'AI Marketing Strategy':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Saved Reports</h1>
          <p className="text-muted-foreground">Access, manage, and download your marketing reports</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-2 text-sm border rounded-md shadow-sm bg-card dark:bg-accent hover:bg-accent/50 dark:hover:bg-accent/80 text-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </button>
          <button className="flex items-center px-3 py-2 text-sm border rounded-md shadow-sm bg-card dark:bg-accent hover:bg-accent/50 dark:hover:bg-accent/80 text-foreground">
            <Filter className="mr-2 h-4 w-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex border border-border rounded-md overflow-hidden">
            <button 
              className={`px-4 py-2 text-sm font-medium ${currentView === 'all' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-card text-foreground hover:bg-accent/50'}`}
              onClick={() => setCurrentView('all')}
              type="button"
            >
              All Reports
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${currentView === 'starred' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-card text-foreground hover:bg-accent/50'}`}
              onClick={() => setCurrentView('starred')}
              type="button"
            >
              Starred
            </button>
          </div>
          <div className="flex space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full border border-input rounded-md pl-8 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <select 
              className="border border-input rounded-md px-3 py-2 text-sm w-40 bg-card text-foreground"
              value={selectedToolType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedToolType(e.target.value)}
            >
              {toolTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select 
              className="border border-input rounded-md px-3 py-2 text-sm w-40 bg-card text-foreground"
              value={selectedFormat}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedFormat(e.target.value)}
            >
              {reportFormats.map((format) => (
                <option key={format} value={format}>
                  {format}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Report</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tool</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Format</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          className="h-5 w-5 mr-2 text-muted-foreground hover:text-foreground focus:outline-none"
                          onClick={() => toggleStar(report.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={report.starred ? "currentColor" : "none"}
                            stroke={report.starred ? "none" : "currentColor"}
                            className={`h-5 w-5 ${report.starred ? "text-yellow-400 dark:text-yellow-300" : "text-muted-foreground"}`}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                        <span className="font-medium text-foreground">{report.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getToolTypeBadgeColor(report.toolType)}`}>
                        {report.toolType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-muted mr-2 overflow-hidden">
                          <img src={report.avatarUrl} alt={report.createdBy} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <div className="text-sm text-foreground">{report.createdAt}</div>
                          <div className="text-xs text-muted-foreground">{report.createdBy}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {report.format}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {report.fileSize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'Complete' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-muted-foreground hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground">
                          <Download className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button 
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              // This would normally toggle a dropdown menu
                              // For simplicity, we'll directly call deleteReport
                              if (window.confirm(`Delete report "${report.title}"?`)) {
                                deleteReport(report.id);
                              }
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                    No reports found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Storage Card */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-4">
          <h3 className="text-sm font-medium mb-2 text-foreground">Report Storage</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Used Space</span>
              <span className="text-sm font-medium text-foreground">32.8 MB</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-blue-500 dark:bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>32.8 MB used</span>
              <span>100 MB total</span>
            </div>
          </div>
        </div>
        
        {/* Recent Activity Card */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-4">
          <h3 className="text-sm font-medium mb-2 text-foreground">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Download className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Downloaded "Q1 2025 Social Media Analysis"</p>
                <p className="text-xs text-muted-foreground">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Created "New Product Launch Strategy"</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-4">
          <h3 className="text-sm font-medium mb-2 text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-start px-3 py-2 text-sm border border-border rounded-md hover:bg-accent/50 text-foreground">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              New Report
            </button>
            <button className="flex items-center justify-start px-3 py-2 text-sm border border-border rounded-md hover:bg-accent/50 text-foreground">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export All
            </button>
            <button className="flex items-center justify-start px-3 py-2 text-sm border border-border rounded-md hover:bg-accent/50 text-foreground">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Create Folder
            </button>
            <button className="flex items-center justify-start px-3 py-2 text-sm border border-border rounded-md hover:bg-accent/50 text-foreground">
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Bulk Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedReportsPage;