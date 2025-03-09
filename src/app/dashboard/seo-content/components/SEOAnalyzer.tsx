<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, Clock, ExternalLink, Layout, Image as ImageIcon, Smartphone, Search, ArrowRight, Globe, RefreshCw, Copy, Sparkles, History, Calendar, X, Download, FileJson, FileText } from 'lucide-react';
=======
// File: /components/SEOAnalyzer.tsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, ExternalLink, Layout, Image as ImageIcon, Smartphone, Search, ArrowRight, Globe, RefreshCw, Copy, Sparkles } from 'lucide-react';
>>>>>>> Stashed changes
=======
// File: /components/SEOAnalyzer.tsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, ExternalLink, Layout, Image as ImageIcon, Smartphone, Search, ArrowRight, Globe, RefreshCw, Copy, Sparkles } from 'lucide-react';
>>>>>>> Stashed changes
=======
// File: /components/SEOAnalyzer.tsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, ExternalLink, Layout, Image as ImageIcon, Smartphone, Search, ArrowRight, Globe, RefreshCw, Copy, Sparkles } from 'lucide-react';
>>>>>>> Stashed changes
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { Separator } from "@/components/ui/separator";
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

// TypeScript interfaces
interface SEOAnalyzerProps {
  initialUrl?: string;
  onUrlChange?: (url: string) => void;
  analyzeSEO: (url: string) => Promise<SEOResult>;
  isAnalyzing?: boolean;
  setIsAnalyzing?: (isAnalyzing: boolean) => void;
  results?: SEOResult | null;
  setResults?: (results: SEOResult | null) => void;
  error?: string;
  setError?: (error: string) => void;
}

interface SEOResult {
  overallScore: number;
  categories: {
    metaTags: {
      score: number;
      title: {
        exists: boolean;
        length: number;
        optimal: boolean;
        value: string;
      };
      description: {
        exists: boolean;
        length: number;
        optimal: boolean;
        value: string;
      };
      keywords: {
        exists: boolean;
      };
    };
    headings: {
      score: number;
      h1: {
        count: number;
        optimal: boolean;
        values: string[];
      };
      h2: {
        count: number;
        optimal: boolean;
        values: string[];
      };
      h3: {
        count: number;
        optimal: boolean;
      };
      structure: string;
    };
    content: {
      score: number;
      wordCount: number;
      paragraphs: number;
      readabilityScore: string;
      keywordDensity: string;
      issuesFound: string[];
    };
    images: {
      score: number;
      total: number;
      withAlt: number;
      withoutAlt: number;
      largeImages: number;
    };
    performance: {
      score: number;
      loadTime: string;
      mobileOptimized: boolean;
      issues: string[];
    };
    links: {
      score: number;
      internal: number;
      external: number;
      broken: number;
    };
    security: {
      score: number;
      https: boolean;
      issues: string[];
    };
  };
  recommendations: string[];
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  analyzedUrl?: string;
  timestamp?: string;
}

interface HistoryItem {
  url: string;
  date: string;
  score?: number;
  results: SEOResult; // Store the full results
}

function SEOAnalyzer(props: SEOAnalyzerProps) {
  const [url, setUrl] = useState<string>(props.initialUrl || '');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(props.isAnalyzing || false);
  const [results, setResults] = useState<SEOResult | null>(props.results || null);
  const [error, setError] = useState<string>(props.error || '');
  const [analysisHistory, setAnalysisHistory] = useState<HistoryItem[]>([]);
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'html'>('json');

  // Outside click handling for export options dropdown
  const exportOptionsRef = useRef<HTMLDivElement>(null);
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
}

const SEOAnalyzer: React.FC<SEOAnalyzerProps> = (props) => {
const [url, setUrl] = useState<string>(props.initialUrl || '');
const [isAnalyzing, setIsAnalyzing] = useState<boolean>(props.isAnalyzing || false);
const [results, setResults] = useState<SEOResult | null>(props.results || null);
const [error, setError] = useState<string>(props.error || '');
const [analysisHistory, setAnalysisHistory] = useState<Array<{url: string, date: string}>>([]);
const [isCopying, setIsCopying] = useState<boolean>(false);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

  // Update parent state if props include setter functions
  useEffect(() => {
    if (props.onUrlChange) props.onUrlChange(url);
    if (props.setResults) props.setResults(results);
    if (props.setIsAnalyzing) props.setIsAnalyzing(isAnalyzing);
    if (props.setError) props.setError(error);
  }, [url, results, isAnalyzing, error, props]);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('seoAnalysisHistory');
    if (savedHistory) {
      try {
        setAnalysisHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse analysis history');
      }
    }
  }, []);

  // Load a previous analysis from history
  const loadFromHistory = (item: HistoryItem) => {
    setUrl(item.url);
    setIsHistoryOpen(false);
    setResults(item.results); // Just load the stored results instead of re-analyzing
  };

  // Helper to ensure URL has https:// prefix
  const ensureHttps = (inputUrl: string): string => {
    if (!inputUrl) return inputUrl;
    
    // Check if the URL already has http:// or https://
    if (!/^https?:\/\//i.test(inputUrl)) {
      // If not, add https://
      return `https://${inputUrl}`;
    }
    
    return inputUrl;
  };

  const handleAnalyze = async (): Promise<void> => {
    // Ensure URL has https:// prefix
    const processedUrl = ensureHttps(url);
    setUrl(processedUrl); // Update the input field with the processed URL
    
    // Basic URL validation (more relaxed now that we ensure https://)
    if (!processedUrl || !processedUrl.match(/^https?:\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      setError('Please enter a valid URL (e.g., example.com)');
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  const handleAnalyze = async (): Promise<void> => {
    // Basic URL validation
    if (!url || !url.match(/^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(\/.*)?$/)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      return;
    }
    
    setError('');
    setIsAnalyzing(true);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    setResults(null); // Clear previous results
    
    try {
      console.log(`Starting analysis for URL: ${processedUrl}`);
      const startTime = Date.now();
      
      const data = await props.analyzeSEO(processedUrl);
      
      const analysisTime = Date.now() - startTime;
      console.log(`Analysis completed in ${analysisTime}ms`);
      
      setResults(data);
      
      // Add to history if successfully analyzed
      const historyItem: HistoryItem = { 
        url: processedUrl, 
        date: new Date().toISOString(),
        score: data.overallScore,
        results: data
      };
      
      const updatedHistory = [historyItem, ...analysisHistory.slice(0, 9)];
      setAnalysisHistory(updatedHistory);
      
      try {
        localStorage.setItem('seoAnalysisHistory', JSON.stringify(updatedHistory));
      } catch (storageErr) {
        console.warn('Failed to update analysis history in localStorage:', storageErr);
      }
    } catch (err) {
      console.error('Error analyzing website:', err);
      
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Failed to analyze the website. Please try again.');
      }
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    
    try {
      const data = await props.analyzeSEO(url);
      setResults(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to analyze the website. Please try again.');
      console.error(err);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper to render score color
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  
  const CategoryCard = ({ icon, title, score, details }: { 
=======

  // Component for each SEO category
  interface CategoryCardProps {
>>>>>>> Stashed changes
=======

  // Component for each SEO category
  interface CategoryCardProps {
>>>>>>> Stashed changes
=======

  // Component for each SEO category
  interface CategoryCardProps {
>>>>>>> Stashed changes
    icon: React.ReactNode;
    title: string;
    score: number;
    details: React.ReactNode;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  }) => (
    <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center dark:text-gray-100">
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  }
  
  const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, score, details }) => (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            {icon}
            <span className="ml-2">{title}</span>
          </CardTitle>
          <Badge className={score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"}>
            {score}/100
          </Badge>
        </div>
      </CardHeader>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      <CardContent className="dark:text-gray-300">
=======
      <CardContent>
>>>>>>> Stashed changes
=======
      <CardContent>
>>>>>>> Stashed changes
=======
      <CardContent>
>>>>>>> Stashed changes
        {details}
      </CardContent>
    </Card>
  );

  // Function to copy recommendations to clipboard
  const copyRecommendations = async () => {
    if (!results || !results.recommendations.length) return;
    
    setIsCopying(true);
    
    try {
      const text = results.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n');
      await navigator.clipboard.writeText(text);
      
      // Show success briefly
      setTimeout(() => {
        setIsCopying(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy recommendations:', err);
      setIsCopying(false);
    }
  };

  // Function to generate a detailed action plan
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  
  const generateDetailedPlan = async () => {
    if (!results) return;
    
    setIsGeneratingPlan(true);
    
    try {
      // This would typically call an API endpoint that uses AI to generate a detailed plan
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would handle the response and display the detailed plan
      // For example, open a modal with the detailed plan
      alert('Detailed action plan would be generated here using AI. This feature is coming soon!');
    } catch (err) {
      console.error('Failed to generate detailed plan:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  // Export report functionality
  const exportReport = async (format: 'json' | 'html') => {
    if (!results) return;
    
    setExportFormat(format);
    setIsExporting(true);
    setShowExportOptions(false);
    
    try {
      // Get clean URL for the filename
      const reportUrl = results.analyzedUrl || url;
      const cleanUrl = reportUrl.replace(/^https?:\/\//, '').replace(/[^\w]/g, '-');
      const timestamp = new Date().toISOString().slice(0, 10);
      
      if (format === 'json') {
        // Export as JSON
        const jsonContent = JSON.stringify(results, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `seo-report-${cleanUrl}-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (format === 'html') {
        // Export as HTML
        const htmlContent = generateHtmlReport(results, reportUrl);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `seo-report-${cleanUrl}-${timestamp}.html`;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Generate HTML report
  const generateHtmlReport = (data: SEOResult, reportUrl: string) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SEO Report for ${reportUrl}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          h1, h2, h3 {
            color: #2c3e50;
          }
          .score-container {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
          }
          .overall-score {
            font-size: 72px;
            font-weight: bold;
            width: 150px;
            height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            margin-right: 30px;
            position: relative;
          }
          .score-90-100 { color: #22c55e; border: 10px solid rgba(34, 197, 94, 0.6); }
          .score-70-89 { color: #84cc16; border: 10px solid rgba(132, 204, 22, 0.6); }
          .score-50-69 { color: #eab308; border: 10px solid rgba(234, 179, 8, 0.6); }
          .score-30-49 { color: #f97316; border: 10px solid rgba(249, 115, 22, 0.6); }
          .score-0-29 { color: #ef4444; border: 10px solid rgba(239, 68, 68, 0.6); }
          .score-details {
            flex: 1;
          }
          .category-scores {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .category {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .category-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .progress-bar {
            height: 10px;
            background: #e2e8f0;
            border-radius: 5px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            border-radius: 5px;
          }
          .recommendations {
            margin-top: 30px;
          }
          .recommendation {
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            margin-bottom: 15px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .priority-high { border-left: 4px solid #ef4444; }
          .priority-medium { border-left: 4px solid #f97316; }
          .priority-low { border-left: 4px solid #eab308; }
          .recommendation h3 {
            margin-top: 0;
            display: flex;
            align-items: center;
          }
          .recommendation-icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
          @media (max-width: 768px) {
            .score-container {
              flex-direction: column;
              align-items: center;
            }
            .overall-score {
              margin-right: 0;
              margin-bottom: 20px;
            }
          }
        </style>
      </head>
      <body>
        <h1>SEO Analysis Report</h1>
        <p>URL: ${reportUrl}</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        
        <div class="score-container">
          <div class="overall-score score-${getScoreRangeClass(data.overallScore)}">
            ${data.overallScore}
          </div>
          <div class="score-details">
            <h2>Overall SEO Score</h2>
            <p>
              ${data.overallScore >= 80 ? 
                'Great job! Your website has strong SEO practices in place.' : 
                data.overallScore >= 60 ? 
                'Your website has decent SEO but there are several areas for improvement.' : 
                'Your website needs significant SEO improvements to rank well in search results.'}
            </p>
          </div>
        </div>
        
        <h2>Category Scores</h2>
        <div class="category-scores">
          <div class="category">
            <div class="category-header">
              <span>Meta Tags</span>
              <span>${data.categories.metaTags.score}/100</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill score-${getScoreRangeClass(data.categories.metaTags.score)}" style="width: ${data.categories.metaTags.score}%"></div>
            </div>
          </div>
          
          <div class="category">
            <div class="category-header">
              <span>Content Quality</span>
              <span>${data.categories.content.score}/100</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill score-${getScoreRangeClass(data.categories.content.score)}" style="width: ${data.categories.content.score}%"></div>
            </div>
          </div>
          
          <div class="category">
            <div class="category-header">
              <span>Performance</span>
              <span>${data.categories.performance.score}/100</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill score-${getScoreRangeClass(data.categories.performance.score)}" style="width: ${data.categories.performance.score}%"></div>
            </div>
          </div>
        </div>
        
        <h2>Recommendations</h2>
        <div class="recommendations">
          ${data.recommendations.map(rec => `
            <div class="recommendation priority-low">
              <h3>
                <span class="recommendation-icon">
                  ℹ️
                </span>
                ${rec}
              </h3>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  };

  // Helper function for HTML report
  const getScoreRangeClass = (score: number) => {
    if (score >= 90) return '90-100';
    if (score >= 70) return '70-89';
    if (score >= 50) return '50-69';
    if (score >= 30) return '30-49';
    return '0-29';
  };

  // Format date string for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Outside click handling for export options dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportOptionsRef.current && !exportOptionsRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    }

    // Add event listener when dropdown is open
    if (showExportOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportOptions]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-md dark:shadow-gray-800">
      <h2 className="text-2xl font-bold text-center mb-6 dark:text-gray-100">Website SEO Analyzer</h2>
      
      {/* URL Input */}
      <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Website SEO Analyzer</h2>
      
      {/* URL Input */}
      <Card className="shadow-sm">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="flex-1">
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                  placeholder="Enter website URL (e.g., example.com)"
                  className="pl-9 pr-4 py-6 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
              </div>
            </div>
            <div className="relative">
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="md:w-auto w-full py-6 relative"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analyze SEO
                  </>
                )}
              </Button>
              
              {/* History dropdown button */}
              {analysisHistory.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 -mr-14 top-1/2 transform -translate-y-1/2 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setIsHistoryOpen(true)}
                >
                  <History className="h-4 w-4" />
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {analysisHistory.length}
                  </span>
                </Button>
              )}
            </div>
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                  placeholder="Enter website URL (e.g., https://example.com)"
                  className="pl-9 pr-4 py-6"
                />
              </div>
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="md:w-auto w-full py-6"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyze SEO
                </>
              )}
            </Button>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          </div>
          
          {/* Error Message */}
          {error && (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-start">
=======
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-start">
>>>>>>> Stashed changes
=======
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-start">
>>>>>>> Stashed changes
=======
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-start">
>>>>>>> Stashed changes
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      {/* Analysis History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium dark:text-gray-100">
                Saved SEO Reports 
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({analysisHistory.length})
                </span>
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-4">
              {analysisHistory.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground dark:text-gray-400">No saved reports yet</p>
              ) : (
                <div className="space-y-3">
                  {analysisHistory.map((item, index) => (
                    <div 
                      key={index}
                      className="p-3 border dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => loadFromHistory(item)}
                    >
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium text-sm truncate max-w-[200px] dark:text-gray-200">{item.url}</h4>
                        {item.score !== undefined && (
                          <span className={`text-sm font-medium ${item.score >= 80 ? 'text-green-500' : item.score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {item.score}/100
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(item.date)}
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
                          Saved Report
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t dark:border-gray-700 flex justify-end">
              <Button variant="outline" onClick={() => setIsHistoryOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Results */}
      {results && (
        <div className="space-y-6 mt-6">
          {/* Overall Score */}
          <Card className="shadow-sm dark:bg-gray-800 dark:border-gray-700">
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="shadow-sm">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div className={`text-5xl font-bold ${getScoreColor(results.overallScore)}`}>
                        {results.overallScore}
                      </div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                      <div className="text-lg text-gray-500 dark:text-gray-400">/100</div>
=======
                      <div className="text-lg text-gray-500">/100</div>
>>>>>>> Stashed changes
=======
                      <div className="text-lg text-gray-500">/100</div>
>>>>>>> Stashed changes
=======
                      <div className="text-lg text-gray-500">/100</div>
>>>>>>> Stashed changes
                    </div>
                    {/* This would be a circular progress indicator in a real implementation */}
                    <div className={`absolute inset-0 rounded-full border-8 ${getScoreColor(results.overallScore)} opacity-60`}></div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold mb-2 dark:text-gray-100">Overall SEO Score</h2>
                      <p className="text-muted-foreground dark:text-gray-300">
                        {results.overallScore >= 80 ? 
                          'Great job! Your website has strong SEO practices in place.' : 
                          results.overallScore >= 60 ? 
                          'Your website has decent SEO but there are several areas for improvement.' : 
                          'Your website needs significant SEO improvements to rank well in search results.'}
                      </p>
                    </div>
                    
                    {/* Export Report Button */}
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setShowExportOptions(!showExportOptions)}
                      >
                        <Download className="h-4 w-4" />
                        Export Report
                        {isExporting && <RefreshCw className="ml-1 h-3 w-3 animate-spin" />}
                      </Button>
                      
                      {/* Export Format Options */}
                      {showExportOptions && (
                        <div 
                          ref={exportOptionsRef}
                          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                        >
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            <button
                              onClick={() => exportReport('json')}
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                            >
                              <FileJson className="mr-2 h-4 w-4" />
                              JSON Format
                            </button>
                            <button
                              onClick={() => exportReport('html')}
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              HTML Report
                            </button>
                          </div>
                        </div>
                      )}
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                  <div>
                    <h2 className="text-xl font-bold mb-2">Overall SEO Score</h2>
                    <p className="text-muted-foreground">
                      {results.overallScore >= 80 ? 
                        'Great job! Your website has strong SEO practices in place.' : 
                        results.overallScore >= 60 ? 
                        'Your website has decent SEO but there are several areas for improvement.' : 
                        'Your website needs significant SEO improvements to rank well in search results.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Meta Tags</span>
                        <span className={getScoreColor(results.categories.metaTags.score)}>
                          {results.categories.metaTags.score}/100
                        </span>
                      </div>
                      <Progress 
                        value={results.categories.metaTags.score} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Content Quality</span>
                        <span className={getScoreColor(results.categories.content.score)}>
                          {results.categories.content.score}/100
                        </span>
                      </div>
                      <Progress 
                        value={results.categories.content.score} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance</span>
                        <span className={getScoreColor(results.categories.performance.score)}>
                          {results.categories.performance.score}/100
                        </span>
                      </div>
                      <Progress 
                        value={results.categories.performance.score} 
                        className="h-2"
                      />
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoryCard 
              icon={<Layout className="h-5 w-5 text-blue-500" />}
              title="Meta Tags" 
              score={results.categories.metaTags.score}
              details={
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                <ul className="list-disc list-inside dark:text-gray-300">
                  <li className={results.categories.metaTags.title.optimal ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}>
                    Title: {results.categories.metaTags.title.length} characters 
                    {!results.categories.metaTags.title.optimal && " (not optimal)"}
                  </li>
                  <li className={results.categories.metaTags.description.optimal ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}>
                    Description: {results.categories.metaTags.description.length} characters
                  </li>
                  <li className={results.categories.metaTags.keywords.exists ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                <ul className="list-disc list-inside">
                  <li className={results.categories.metaTags.title.optimal ? "text-green-600" : "text-yellow-600"}>
                    Title: {results.categories.metaTags.title.length} characters 
                    {!results.categories.metaTags.title.optimal && " (not optimal)"}
                  </li>
                  <li className={results.categories.metaTags.description.optimal ? "text-green-600" : "text-yellow-600"}>
                    Description: {results.categories.metaTags.description.length} characters
                  </li>
                  <li className={results.categories.metaTags.keywords.exists ? "text-green-600" : "text-red-600"}>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                    Keywords: {results.categories.metaTags.keywords.exists ? "Present" : "Missing"}
                  </li>
                </ul>
              }
            />
            
            <CategoryCard 
              icon={<Layout className="h-5 w-5 text-blue-500" />}
              title="Headings Structure" 
              score={results.categories.headings.score}
              details={
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                <ul className="list-disc list-inside dark:text-gray-300">
                  <li className={results.categories.headings.h1.optimal ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    H1: {results.categories.headings.h1.count} {results.categories.headings.h1.count !== 1 && "(should be exactly 1)"}
                  </li>
                  <li className="text-green-600 dark:text-green-400">
                    H2: {results.categories.headings.h2.count}
                  </li>
                  <li className="text-green-600 dark:text-green-400">
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                <ul className="list-disc list-inside">
                  <li className={results.categories.headings.h1.optimal ? "text-green-600" : "text-red-600"}>
                    H1: {results.categories.headings.h1.count} {results.categories.headings.h1.count !== 1 && "(should be exactly 1)"}
                  </li>
                  <li className="text-green-600">
                    H2: {results.categories.headings.h2.count}
                  </li>
                  <li className="text-green-600">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                    H3+: {results.categories.headings.h3.count}
                  </li>
                </ul>
              }
            />
            
            <CategoryCard 
              icon={<Search className="h-5 w-5 text-blue-500" />}
              title="Content Quality" 
              score={results.categories.content.score}
              details={
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                <ul className="list-disc list-inside dark:text-gray-300">
=======
                <ul className="list-disc list-inside">
>>>>>>> Stashed changes
=======
                <ul className="list-disc list-inside">
>>>>>>> Stashed changes
=======
                <ul className="list-disc list-inside">
>>>>>>> Stashed changes
                  <li>Word count: {results.categories.content.wordCount}</li>
                  <li>Readability: {results.categories.content.readabilityScore}</li>
                  <li>Keyword density: {results.categories.content.keywordDensity}</li>
                </ul>
              }
            />
            
            <CategoryCard 
              icon={<ImageIcon className="h-5 w-5 text-blue-500" />}
              title="Images" 
              score={results.categories.images.score}
              details={
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                <ul className="list-disc list-inside dark:text-gray-300">
                  <li>Total images: {results.categories.images.total}</li>
                  <li className="text-green-600 dark:text-green-400">With alt text: {results.categories.images.withAlt}</li>
                  <li className="text-red-600 dark:text-red-400">Without alt text: {results.categories.images.withoutAlt}</li>
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                <ul className="list-disc list-inside">
                  <li className="text-green-600">{results.categories.images.withAlt} images with alt text</li>
                  <li className="text-red-600">{results.categories.images.withoutAlt} images missing alt text</li>
                  <li className="text-yellow-600">{results.categories.images.largeImages} large images need optimization</li>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                </ul>
              }
            />
            
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            {/* Recommendations */}
            <Card className="shadow-sm md:col-span-2 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center dark:text-gray-100">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Recommendations for Improvement
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Actionable tips to improve your SEO performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    {results.recommendations.map((recommendation, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-start"
                      >
                        <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm dark:text-gray-200">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={copyRecommendations} className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                      <Copy className="h-4 w-4 mr-2" />
                      {isCopying ? 'Copied!' : 'Copy All Recommendations'}
                    </Button>
                    
                    <Button onClick={generateDetailedPlan} disabled={isGeneratingPlan}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGeneratingPlan ? 'Generating...' : 'Generate Detailed Action Plan'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            <CategoryCard 
              icon={<Clock className="h-5 w-5 text-blue-500" />}
              title="Performance" 
              score={results.categories.performance.score}
              details={
                <ul className="list-disc list-inside">
                  <li>Load time: {results.categories.performance.loadTime}</li>
                  <li className={results.categories.performance.mobileOptimized ? "text-green-600" : "text-red-600"}>
                    Mobile optimized: {results.categories.performance.mobileOptimized ? "Yes" : "No"}
                  </li>
                  {results.categories.performance.issues.map((issue, i) => (
                    <li key={i} className="text-yellow-600">{issue}</li>
                  ))}
                </ul>
              }
            />
            
            <CategoryCard 
              icon={<ExternalLink className="h-5 w-5 text-blue-500" />}
              title="Links" 
              score={results.categories.links.score}
              details={
                <ul className="list-disc list-inside">
                  <li>Internal links: {results.categories.links.internal}</li>
                  <li>External links: {results.categories.links.external}</li>
                  <li className={results.categories.links.broken === 0 ? "text-green-600" : "text-red-600"}>
                    Broken links: {results.categories.links.broken}
                  </li>
                </ul>
              }
            />
          </div>
          
          {/* Recommendations */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Recommendations for Improvement
              </CardTitle>
              <CardDescription>
                Actionable tips to improve your SEO performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  {results.recommendations.map((recommendation, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start"
                    >
                      <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={copyRecommendations}>
                    <Copy className="h-4 w-4 mr-2" />
                    {isCopying ? 'Copying...' : 'Copy All Recommendations'}
                  </Button>
                  
                  <Button onClick={generateDetailedPlan} disabled={isGeneratingPlan}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGeneratingPlan ? 'Generating...' : 'Generate Detailed Action Plan'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        </div>
      )}
    </div>
  );
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
}

export default SEOAnalyzer; 
=======
};

export default SEOAnalyzer;
>>>>>>> Stashed changes
=======
};

export default SEOAnalyzer;
>>>>>>> Stashed changes
=======
};

export default SEOAnalyzer;
>>>>>>> Stashed changes
