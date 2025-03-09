import { SEOResult, AnalysisBase } from '../../types/seo';

type AnalysisCategories = {
  metaTags: AnalysisBase;
  headings: AnalysisBase;
  content: AnalysisBase;
  images: AnalysisBase;
  performance: AnalysisBase;
  links: AnalysisBase;
  security: AnalysisBase;
  mobileOptimization?: AnalysisBase;
  accessibility?: AnalysisBase;
  structuredData?: AnalysisBase;
};

/**
 * Calculates the overall SEO score based on individual category scores
 * @param categories Object containing all analysis categories
 * @returns A number between 0-100 representing overall SEO score
 */
export function calculateOverallScore(result: AnalysisCategories): number {
  // Define weights for each category
  const weights = {
    metaTags: 0.15,
    headings: 0.1,
    content: 0.2,
    images: 0.1,
    performance: 0.15,
    links: 0.1,
    security: 0.1,
    mobileOptimization: 0.05,
    accessibility: 0.05,
    structuredData: 0.05,
  };

  // Calculate weighted score
  let totalScore = 0;
  let totalWeight = 0;

  // Type-safe iteration through categories
  Object.entries(weights).forEach(([category, weight]) => {
    const categoryKey = category as keyof AnalysisCategories;
    if (result[categoryKey]) {
      totalScore += result[categoryKey].score * weight;
      totalWeight += weight;
    }
  });

  // Normalize score if some categories are missing
  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) / 100 : 0;
}

/**
 * Generates actionable recommendations based on analysis results
 * @param result Complete SEO analysis result
 * @returns Array of recommendation strings
 */
export function generateRecommendations(result: SEOResult): string[] {
  const recommendations: string[] = [];
  const { categories } = result;

  // Collect all issues from each category
  Object.entries(categories).forEach(([category, analysis]) => {
    if (analysis && analysis.issues && analysis.issues.length > 0) {
      recommendations.push(...analysis.issues);
    }
  });

  // Sort recommendations by priority (can be enhanced with more logic)
  // For now just return unique recommendations
  return [...new Set(recommendations)];
} 