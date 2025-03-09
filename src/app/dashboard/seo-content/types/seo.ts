// Types for SEO analysis results
export interface SEOResult {
    overallScore: number;
    categories: {
      metaTags: MetaTagsAnalysis;
      headings: HeadingsAnalysis;
      content: ContentAnalysis;
      images: ImagesAnalysis;
      performance: PerformanceAnalysis;
      links: LinksAnalysis;
      security: SecurityAnalysis;
      mobileOptimization?: MobileOptimizationAnalysis;
      accessibility?: AccessibilityAnalysis;
      structuredData?: StructuredDataAnalysis;
    };
    recommendations: string[];
    analyzedUrl: string;
    timestamp: string;
    analysisDepth: string;
    warning?: string; // Optional warning message for fallback scenarios
  }
  
  export interface AnalysisBase {
    score: number;
    issues: string[];
  }
  
  export interface MetaTagsAnalysis extends AnalysisBase {
    title: {
      exists: boolean;
      length: number;
      optimal: boolean;
      value: string;
      includesSiteName?: boolean;
    };
    description: {
      exists: boolean;
      length: number;
      optimal: boolean;
      value: string;
    };
    keywords: {
      exists: boolean;
      value?: string;
    };
    canonical: {
      exists: boolean;
      value?: string;
    };
    socialTags: {
      openGraph: boolean;
      twitterCard: boolean;
    };
  }
  
  export interface HeadingsAnalysis extends AnalysisBase {
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
    h4?: {
      count: number;
    };
    h5?: {
      count: number;
    };
    h6?: {
      count: number;
    };
    structure: string;
  }
  
  export interface ContentAnalysis extends AnalysisBase {
    wordCount: number;
    paragraphs: number;
    readabilityScore: string;
    keywordDensity: string;
    sentenceCount?: number;
    avgSentenceLength?: number;
    avgParagraphLength?: number;
  }
  
  export interface ImagesAnalysis extends AnalysisBase {
    total: number;
    withAlt: number;
    withoutAlt: number;
    largeImages: number;
    avgSize?: number;
  }
  
  export interface PerformanceAnalysis extends AnalysisBase {
    loadTime: string;
    ttfb: string;
    tti: string;
    fcp: string;
    resources: {
      total: number;
      byType: Record<string, number>;
      totalSize: string;
    };
  }
  
  export interface LinksAnalysis extends AnalysisBase {
    internal: number;
    external: number;
    broken: number;
    nofollow?: number;
    total?: number;
    uniqueUrls?: number;
  }
  
  export interface SecurityAnalysis extends AnalysisBase {
    https: boolean;
    contentSecurityPolicy?: boolean;
    xFrameOptions?: boolean;
    strictTransportSecurity?: boolean;
    xContentTypeOptions?: boolean;
  }
  
  export interface MobileOptimizationAnalysis extends AnalysisBase {
    viewportMeta: boolean;
    responsiveDesign: boolean;
    touchTargets: boolean;
    fontSizes: boolean;
    tapTargetResults?: {
      passed: boolean;
      tooSmall: number;
    };
  }
  
  export interface AccessibilityAnalysis extends AnalysisBase {
    hasAriaLabels: boolean;
    imageAltTexts: boolean;
    contrastRatio: boolean;
    semanticElements: boolean;
    formLabels: boolean;
  }
  
  export interface StructuredDataAnalysis extends AnalysisBase {
    hasStructuredData: boolean;
    types: string[];
    validStructure: boolean;
  }
  
  export type AnalysisDepth = 'basic' | 'standard' | 'deep';