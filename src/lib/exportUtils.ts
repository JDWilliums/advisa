import { Competitor, MarketOpportunity, MarketTrend } from './marketResearchService';
import { UserProfile } from './userService';
// Import jsPDF and jspdf-autotable
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export market analysis data to PDF
 */
export const exportAnalysisToPDF = (
  competitors: Competitor[],
  opportunities: MarketOpportunity[],
  trends: MarketTrend[],
  userProfile: UserProfile
) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Market Research Analysis', 14, 22);
    
    // Add subtitle with date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add business info
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Business Information', 14, 45);
    
    doc.setFontSize(10);
    doc.text(`Business Name: ${userProfile.businessName || 'N/A'}`, 14, 55);
    doc.text(`Industry: ${userProfile.industry || 'N/A'}`, 14, 62);
    doc.text(`Business Type: ${userProfile.businessType || 'N/A'}`, 14, 69);
    doc.text(`Target Audience: ${userProfile.targetAudience || 'N/A'}`, 14, 76);
    
    // Add competitor analysis section
    doc.setFontSize(14);
    doc.text('Competitor Analysis', 14, 90);
    
    // Sort competitors by market share
    const sortedCompetitors = [...competitors].sort((a, b) => b.marketShare - a.marketShare);
    
    // Create competitor table
    const competitorTableData = sortedCompetitors.map(comp => [
      comp.name,
      `${comp.marketShare}%`,
      `${comp.growth >= 0 ? '+' : ''}${comp.growth}%`,
      comp.strengths.slice(0, 2).join(', '),
      comp.weaknesses.slice(0, 2).join(', ')
    ]);
    
    // Use autoTable directly
    autoTable(doc, {
      startY: 95,
      head: [['Company', 'Market Share', 'Growth', 'Key Strengths', 'Key Weaknesses']],
      body: competitorTableData,
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 50 },
        4: { cellWidth: 50 }
      }
    });
    
    // Get the final Y position after the table
    const competitorTableEndY = (doc as any).lastAutoTable.finalY;
    
    // Add market opportunities section
    const opportunitiesY = competitorTableEndY + 15;
    doc.setFontSize(14);
    doc.text('Market Opportunities', 14, opportunitiesY);
    
    // Create opportunities table
    const opportunitiesTableData = opportunities.map(opp => [
      opp.opportunity,
      opp.potential,
      opp.competition,
      opp.description
    ]);
    
    // Use autoTable directly
    autoTable(doc, {
      startY: opportunitiesY + 5,
      head: [['Opportunity', 'Potential', 'Competition', 'Description']],
      body: opportunitiesTableData,
      headStyles: { fillColor: [46, 204, 113], textColor: 255 },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 90 }
      }
    });
    
    // Get the final Y position after the table
    const opportunitiesTableEndY = (doc as any).lastAutoTable.finalY;
    
    // Add market trends section
    const trendsY = opportunitiesTableEndY + 15;
    
    // Check if we need a new page
    if (trendsY > 250) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Market Trends', 14, 20);
      
      // Create trends table
      const trendsTableData = trends.map(trend => [
        trend.name,
        trend.impact,
        trend.timeframe,
        trend.description
      ]);
      
      // Use autoTable directly
      autoTable(doc, {
        startY: 25,
        head: [['Trend', 'Impact', 'Timeframe', 'Description']],
        body: trendsTableData,
        headStyles: { fillColor: [155, 89, 182], textColor: 255 },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 85 }
        }
      });
    } else {
      doc.setFontSize(14);
      doc.text('Market Trends', 14, trendsY);
      
      // Create trends table
      const trendsTableData = trends.map(trend => [
        trend.name,
        trend.impact,
        trend.timeframe,
        trend.description
      ]);
      
      // Use autoTable directly
      autoTable(doc, {
        startY: trendsY + 5,
        head: [['Trend', 'Impact', 'Timeframe', 'Description']],
        body: trendsTableData,
        headStyles: { fillColor: [155, 89, 182], textColor: 255 },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 85 }
        }
      });
    }
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated by Advisa - Market Research Tool | Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    doc.save(`Market_Analysis_${userProfile.businessName || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again later.');
  }
};

/**
 * Export market analysis data to CSV
 */
export const exportAnalysisToCSV = (
  competitors: Competitor[],
  opportunities: MarketOpportunity[],
  trends: MarketTrend[]
) => {
  // Helper function to convert array to CSV
  const arrayToCSV = (data: any[], headers: string[]) => {
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header.toLowerCase().replace(/\s/g, '')];
        return `"${value ? value.toString().replace(/"/g, '""') : ''}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };
  
  // Prepare competitor data
  const competitorData = competitors.map(comp => ({
    name: comp.name,
    website: comp.website,
    marketshare: comp.marketShare,
    growth: comp.growth,
    strengths: comp.strengths.join('; '),
    weaknesses: comp.weaknesses.join('; '),
    overview: comp.overview,
    industry: comp.industry,
    businesssize: comp.businessSize || '',
    location: comp.location || ''
  }));
  
  // Prepare opportunity data
  const opportunityData = opportunities.map(opp => ({
    opportunity: opp.opportunity,
    potential: opp.potential,
    competition: opp.competition,
    description: opp.description,
    industry: opp.industry
  }));
  
  // Prepare trend data
  const trendData = trends.map(trend => ({
    name: trend.name,
    impact: trend.impact,
    timeframe: trend.timeframe,
    description: trend.description,
    industry: trend.industry
  }));
  
  // Create CSV content
  const competitorCSV = arrayToCSV(competitorData, ['Name', 'Website', 'MarketShare', 'Growth', 'Strengths', 'Weaknesses', 'Overview', 'Industry', 'BusinessSize', 'Location']);
  const opportunityCSV = arrayToCSV(opportunityData, ['Opportunity', 'Potential', 'Competition', 'Description', 'Industry']);
  const trendCSV = arrayToCSV(trendData, ['Name', 'Impact', 'Timeframe', 'Description', 'Industry']);
  
  // Combine all CSVs
  const combinedCSV = `COMPETITORS\n${competitorCSV}\n\nOPPORTUNITIES\n${opportunityCSV}\n\nTRENDS\n${trendCSV}`;
  
  // Create download link
  const blob = new Blob([combinedCSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Market_Analysis_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 