'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Download, Mail } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface FormData {
  businessName: string;
  industry: string;
  companySize: string;
  topChallenges: string;
  budget: string;
  email: string;
}

export default function StrategyReport() {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    industry: '',
    companySize: '',
    topChallenges: '',
    budget: '',
    email: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call an API endpoint
      // that generates the report using AI
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      
      setIsSuccess(true);
      
      // In a real implementation, this would trigger an email sequence
      console.log('Sending follow-up email sequence to:', formData.email);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadReport = () => {
    setIsDownloading(true);
    
    try {
      // Generate report content
      const reportContent = generateReportContent();
      
      // Create a new PDF document with better settings
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: true
      });
      
      // Document metadata
      try {
        (doc as any).setProperties({
          title: `FastTrack AI Strategy Report for ${formData.businessName}`,
          subject: 'AI Strategy Assessment',
          author: 'FastTrack AI Solutions',
          keywords: 'AI, Strategy, Digital Transformation',
          creator: 'FastTrack AI Report Generator'
        });
      } catch (e) {
        console.warn('Could not set PDF properties:', e);
      }
      
      // Brand colors - updated to match website purple theme
      const primaryPurple = [79, 44, 143]; // Deep purple from the site
      const darkPurple = [55, 28, 95]; // Darker purple for accents
      const accentColor = [187, 134, 252]; // Light purple accent
      
      // Get specific customized insights based on user data
      const { 
        industryMap, 
        companySizeMap, 
        budgetMap 
      } = getDataMaps();
      
      // Industry-specific insights
      const industryInsights = getIndustryInsights(formData.industry);
      
      // Challenge-specific recommendations
      const challengeRecommendations = generateChallengeResponse(formData.topChallenges);
      
      // Customize based on company size
      const companySizeStrategies = getCompanySizeStrategies(formData.companySize);
      
      // Budget-appropriate implementation paths
      const budgetStrategies = getBudgetStrategies(formData.budget);
      
      // Generate a unique recommendation ID based on user inputs
      const recommendationId = generateRecommendationId(formData);

      // ===== COVER PAGE =====
      
      // Add gradient background to match site
      // Create top-to-bottom gradient effect
      const gradientSteps = 20;
      for (let i = 0; i < gradientSteps; i++) {
        const ratio = i / gradientSteps;
        // Blend from dark to medium purple
        const r = Math.floor(darkPurple[0] + (primaryPurple[0] - darkPurple[0]) * ratio);
        const g = Math.floor(darkPurple[1] + (primaryPurple[1] - darkPurple[1]) * ratio);
        const b = Math.floor(darkPurple[2] + (primaryPurple[2] - darkPurple[2]) * ratio);
        
        doc.setFillColor(r, g, b);
        const yPosition = ratio * 297; // A4 height
        const height = 297 / gradientSteps;
        doc.rect(0, yPosition, 210, height + 1, 'F'); // +1 to avoid gaps
      }
      
      // Add geometric design element for professional look
      for (let i = 0; i < 5; i++) {
        doc.setFillColor(255, 255, 255, 0.05);
        doc.triangle(
          210, 50 + i * 40, 
          170, 70 + i * 40, 
          210, 90 + i * 40, 
          'F'
        );
      }
      
      // Add logo placeholder (would be an actual logo in production)
      doc.setFillColor(255, 255, 255, 0.9);
      doc.roundedRect(30, 30, 50, 50, 5, 5, 'F');
      
      // Add "logo" text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
      doc.text("FastTrack", 55, 55, { align: 'center' });
      doc.text("AI", 55, 65, { align: 'center' });
      
      // Add title with more professional styling
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("STRATEGIC AI", 105, 40, { align: 'center' });
      doc.text("ASSESSMENT", 105, 52, { align: 'center' });
      
      // Add a semi-transparent overlay for business information
      doc.setFillColor(0, 0, 0, 0.3);
      doc.roundedRect(30, 80, 150, 60, 3, 3, 'F');
      
      // Add report info
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text("PREPARED EXCLUSIVELY FOR:", 105, 95, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text(formData.businessName.toUpperCase(), 105, 110, { align: 'center' });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Industry: ${industryMap[formData.industry] || formData.industry}`, 105, 125, { align: 'center' });
      
      // Add document identifiers for professional appearance
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2], 0.7);
      doc.roundedRect(30, 150, 150, 25, 3, 3, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`RECOMMENDATION ID: ${recommendationId}`, 40, 160);
      doc.text(`GENERATED: ${new Date().toLocaleDateString()}`, 40, 170);
      
      // Add professional decorative elements
      doc.setDrawColor(255, 255, 255, 0.5);
      doc.setLineWidth(0.5);
      // Horizontal lines
      doc.line(30, 190, 180, 190);
      doc.line(30, 192, 180, 192);
      
      // Add professional footer
      doc.setFillColor(0, 0, 0, 0.5);
      doc.rect(0, 260, 210, 37, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text("CONFIDENTIAL AND PROPRIETARY", 105, 275, { align: 'center' });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("© FastTrack AI Solutions", 105, 282, { align: 'center' });
      doc.text("This document contains proprietary insights tailored for your organization.", 105, 287, { align: 'center' });
      
      // ===== REPORT CONTENT =====
      
      // Add a new page for content
      doc.addPage();
      
      // Helper function to add header to each page - updated for more professional look
      const addPageHeader = (pageTitle: string) => {
        // Add header bar with purple gradient
        const gradientHeight = 18;
        for (let i = 0; i < gradientHeight; i++) {
          const ratio = i / gradientHeight;
          const r = Math.floor(primaryPurple[0] - ratio * 20);
          const g = Math.floor(primaryPurple[1] - ratio * 20);
          const b = Math.floor(primaryPurple[2] - ratio * 20);
          
          doc.setFillColor(r, g, b);
          doc.rect(0, i, 210, 1, 'F');
        }
        
        // Add professional corner accent
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2], 0.7);
        doc.triangle(0, 0, 0, 30, 30, 0, 'F');
        
        // Add header text
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text("FASTTRACK AI", 15, 10);
        doc.text(pageTitle, 195, 10, { align: 'right' });
        
        // Add the company name on each page for a more personalized look
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.text(`${formData.businessName} | Strategic Assessment`, 105, 10, { align: 'center' });
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
      };
      
      // Helper function to add footer - updated for professional look
      const addPageFooter = (pageNum: number) => {
        // Add footer background
        doc.setFillColor(245, 245, 250);
        doc.rect(0, 277, 210, 20, 'F');
        
        // Add footer divider
        doc.setDrawColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
        doc.setLineWidth(0.5);
        doc.line(15, 277, 195, 277);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
        doc.text(`Page ${pageNum}`, 195, 287, { align: 'right' });
        doc.text("FastTrack AI - Confidential", 15, 287);
        
        // Add recommendation ID to every page for professional appearance
        doc.text(`Recommendation ID: ${recommendationId}`, 105, 287, { align: 'center' });
      };
      
      // Add header to first content page
      addPageHeader("AI STRATEGY ASSESSMENT");
      
      // Add an executive summary box - customized based on input data
      doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2], 0.1);
      doc.roundedRect(15, 25, 180, 70, 3, 3, 'F');
      
      // Add executive summary title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
      doc.text("EXECUTIVE SUMMARY", 20, 35);
      
      // Add personalized summary text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      
      const executiveSummary = [
        `Based on your profile as a ${companySizeMap[formData.companySize] || formData.companySize} organization in the ${industryMap[formData.industry] || formData.industry} sector, we've identified strategic AI opportunities tailored to your specific challenges.`,
        `Your indicated budget range of ${budgetMap[formData.budget] || formData.budget} allows for a ${budgetStrategies.approach} implementation approach that can address your specific challenges while providing measurable ROI.`,
        `The following assessment outlines recommended strategies, implementation considerations, and potential outcomes specific to your organization's needs.`
      ];
      
      let summaryY = 45;
      executiveSummary.forEach((paragraph) => {
        const lines = doc.splitTextToSize(paragraph, 170);
        lines.forEach((line: string) => {
          doc.text(line, 20, summaryY);
          summaryY += 6;
        });
        summaryY += 2;
      });
      
      // Parse the report content into sections
      const sections = reportContent.split(/^[A-Z\s]+$/m);
      const sectionTitles = reportContent.match(/^[A-Z\s]+$/gm) || [];
      
      // Current Y position for content
      let yPosition = 105; // Start after the executive summary
      let currentPage = 1;
      
      // Function to check page break and add new page if needed
      const checkPageBreak = (requiredSpace: number = 15) => {
        if (yPosition + requiredSpace > 270) {
          // Add footer
          addPageFooter(currentPage);
          
          // Add a new page
          doc.addPage();
          currentPage++;
          
          // Add header
          addPageHeader("AI STRATEGY ASSESSMENT");
          
          // Reset Y position
          yPosition = 25;
          
          return true;
        }
        return false;
      };
      
      // Process each section
      for (let i = 0; i < sectionTitles.length; i++) {
        const title = sectionTitles[i].trim();
        const content = sections[i + 1] || "";
        
        // Skip introduction - we've already added an executive summary
        if (title === "INTRODUCTION") {
          continue;
        }
        
        // Check if we need a new page for this section
        checkPageBreak(30);
        
        // Add section title with styling - updated to match site's purple theme
        doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
        doc.rect(15, yPosition - 5, 5, 20, 'F'); // Add left accent bar
        
        doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2], 0.1);
        doc.rect(20, yPosition - 5, 175, 20, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
        doc.text(title, 25, yPosition + 5);
        
        yPosition += 20;
        
        // Reset text formatting for content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        
        // Process section content
        const contentLines = content.split('\n');
        
        for (let line of contentLines) {
          line = line.trim();
          if (!line) {
            yPosition += 2;
            continue;
          }
          
          // Check for subsection (lines followed by dashes)
          if (contentLines.indexOf(line) < contentLines.length - 1 && 
              contentLines[contentLines.indexOf(line) + 1].match(/^-+$/)) {
            // Skip the dash line in the next iteration
            contentLines[contentLines.indexOf(line) + 1] = '';
            
            // Check for page break
            checkPageBreak();
            
            // Style as subsection header - updated to match site colors
            doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2], 0.05);
            doc.rect(20, yPosition - 3, 175, 10, 'F');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
            doc.text(line, 25, yPosition + 2);
            
            yPosition += 12;
            
            // Reset text formatting
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
          }
          // Check for bullet points
          else if (line.startsWith('•') || line.startsWith('-')) {
            // Check for page break
            checkPageBreak();
            
            const bulletText = line.substring(1).trim();
            const wrappedText = doc.splitTextToSize(bulletText, 160);
            
            // Add a professional bullet point
            doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
            doc.circle(22, yPosition - 1, 1.5, 'F');
            doc.setTextColor(0, 0, 0);
            doc.text(wrappedText, 28, yPosition);
            
            // Move position based on number of wrapped lines
            yPosition += (wrappedText.length - 1) * 5 + 7;
          }
          // Check for numbered points (e.g., "1. Text")
          else if (/^\d+\./.test(line)) {
            // Check for page break
            checkPageBreak();
            
            const match = line.match(/^(\d+\.\s*)(.+)$/);
            if (match) {
              const num = match[1];
              const text = match[2];
              
              const wrappedText = doc.splitTextToSize(text, 160);
              
              // Add number with accent background
              doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2], 0.1);
              doc.circle(22, yPosition - 1, 5, 'F');
              
              doc.setFont("helvetica", "bold");
              doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
              doc.text(num.trim().replace(".", ""), 22, yPosition, { align: 'center' });
              
              doc.setFont("helvetica", "normal");
              doc.setTextColor(0, 0, 0);
              doc.text(wrappedText, 30, yPosition);
              
              yPosition += (wrappedText.length - 1) * 5 + 7;
            } else {
              // Fallback if regex match fails
              const wrappedText = doc.splitTextToSize(line, 170);
              doc.text(wrappedText, 20, yPosition);
              yPosition += wrappedText.length * 5 + 2;
            }
          }
          // Regular text
          else {
            // Check for page break
            checkPageBreak();
            
            const wrappedText = doc.splitTextToSize(line, 170);
            doc.text(wrappedText, 20, yPosition);
            
            yPosition += wrappedText.length * 5 + 2;
          }
        }
        
        // Add space after section
        yPosition += 5;
      }
      
      // Add customized recommendations page - tailored to the user's inputs
      checkPageBreak(150);
      if (yPosition > 150) {
        // Add footer
        addPageFooter(currentPage);
        
        // Add a new page
        doc.addPage();
        currentPage++;
        
        // Add header
        addPageHeader("TAILORED RECOMMENDATIONS");
        
        // Reset position
        yPosition = 25;
      }
      
      // Add tailored recommendations title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
      doc.text("YOUR TAILORED AI STRATEGY RECOMMENDATIONS", 105, yPosition, { align: 'center' });
      
      yPosition += 10;
      
      // Add divider
      doc.setDrawColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
      doc.setLineWidth(0.5);
      doc.line(40, yPosition, 170, yPosition);
      
      yPosition += 10;
      
      // Add customized recommendation boxes
      const addRecommendationBox = (title: string, content: string) => {
        // Check for page break
        checkPageBreak(40);
        
        // Add recommendation box
        doc.setFillColor(245, 245, 250);
        doc.setDrawColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(20, yPosition, 170, 30, 3, 3, 'FD');
        
        // Add accent bar
        doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
        doc.rect(20, yPosition, 5, 30, 'F');
        
        // Add title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
        doc.text(title, 30, yPosition + 10);
        
        // Add content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        const contentLines = doc.splitTextToSize(content, 155);
        doc.text(contentLines, 30, yPosition + 18);
        
        yPosition += 35;
      };
      
      // Add industry-specific recommendation
      addRecommendationBox(
        `${industryMap[formData.industry] || formData.industry} - Specific Approach`, 
        industryInsights.recommendation
      );
      
      // Add company size recommendation
      addRecommendationBox(
        `Implementation Strategy for ${companySizeMap[formData.companySize] || formData.companySize} Organizations`, 
        companySizeStrategies.recommendation
      );
      
      // Add budget-specific recommendation
      addRecommendationBox(
        `Resource Optimization for ${budgetMap[formData.budget] || formData.budget} Budget Range`, 
        budgetStrategies.recommendation
      );
      
      // Add challenge-specific recommendation
      addRecommendationBox(
        "Addressing Your Specific Challenges", 
        "Based on the challenges you've described, we recommend focusing on: " + 
        challengeRecommendations.primaryRecommendation
      );
      
      // Add footer to the last page
      addPageFooter(currentPage);
      
      // Add a call-to-action page with purple gradient background
      doc.addPage();
      currentPage++;
      
      // Add header
      addPageHeader("NEXT STEPS");
      
      // Add a gradient background to the call-to-action page
      for (let i = 18; i < 297; i += 2) {
        const ratio = (i - 18) / (297 - 18);
        // Create a subtle purple gradient
        const r = Math.floor(255 - (255 - primaryPurple[0]) * ratio * 0.2);
        const g = Math.floor(255 - (255 - primaryPurple[1]) * ratio * 0.2);
        const b = Math.floor(255 - (255 - primaryPurple[2]) * ratio * 0.2);
        
        doc.setFillColor(r, g, b);
        doc.rect(0, i, 210, 2, 'F');
      }
      
      // Add decorative elements
      doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2], 0.05);
      doc.circle(30, 80, 20, 'F');
      doc.circle(180, 200, 30, 'F');
      doc.circle(50, 250, 15, 'F');
      
      // Add contact info section
      doc.setFillColor(255, 255, 255, 0.9);
      doc.setDrawColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
      doc.roundedRect(35, 40, 140, 160, 5, 5, 'FD');
      
      // Add decorative header to contact box
      doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
      doc.rect(35, 40, 140, 10, 'F');
      
      // Add your unique reference number text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`YOUR REFERENCE: ${recommendationId}`, 105, 47, { align: 'center' });
      
      // Add title text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
      doc.text("ACCELERATE YOUR", 105, 65, { align: 'center' });
      doc.text("AI TRANSFORMATION", 105, 75, { align: 'center' });
      
      // Add personalized closing message
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text(`Thank you for allowing us to create this custom assessment for ${formData.businessName}.`, 105, 90, { align: 'center' });
      
      // Add contact steps
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.text("Your next steps to implement these recommendations:", 105, 105, { align: 'center' });
      
      // Add steps with visual elements
      const steps = [
        "Schedule a complimentary strategy call with our experts",
        "Receive a detailed implementation roadmap customized for your needs",
        "Begin your AI transformation with ongoing support from our team"
      ];
      
      let stepY = 120;
      steps.forEach((step, index) => {
        // Add step number circle
        doc.setFillColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
        doc.circle(50, stepY - 1, 7, 'F');
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        doc.text((index + 1).toString(), 50, stepY + 2, { align: 'center' });
        
        // Add step text
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        const stepLines = doc.splitTextToSize(step, 100);
        doc.text(stepLines, 65, stepY);
        
        stepY += 20;
      });
      
      // Add contact information
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(primaryPurple[0], primaryPurple[1], primaryPurple[2]);
      doc.text("Contact us:", 105, 170, { align: 'center' });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text("www.fasttrackAI.com", 105, 180, { align: 'center' });
      doc.text("contact@fasttrackAI.com", 105, 190, { align: 'center' });
      doc.text("1-800-FASTTRACK", 105, 200, { align: 'center' });
      
      // Add footer
      addPageFooter(currentPage);
      
      // Save the PDF
      const filename = `${formData.businessName.replace(/\s+/g, '-')}-FastTrackAI-Strategy-Report.pdf`;
      doc.save(filename);
      
      console.log('Report downloaded successfully as PDF');
    } catch (error: any) {
      console.error('Error downloading report:', error);
      // Show error to user
      alert(`Error generating PDF: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Function to create a watermark effect
  const createWatermark = (doc: jsPDF, text: string, angle: number, opacity: number, color: number[]) => {
    const docInternal = (doc as any).internal;
    const pageHeight = docInternal.pageSize.height || 297;
    const pageWidth = docInternal.pageSize.width || 210;
    
    doc.saveGraphicsState();
    doc.setGState(new (doc as any).GState({ opacity: opacity }));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(60);
    doc.setTextColor(color[0], color[1], color[2]);
    
    // Use a different approach to create rotated text without using translate/rotate
    // Calculate center position
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    
    // Convert angle to radians
    const angleInRadians = angle * Math.PI / 180;
    
    // Use textWithTransform (available in newer jsPDF versions)
    try {
      // Newer approach - try this first
      doc.text(text, centerX, centerY, {
        align: 'center',
        rotationDirection: 0,
        angle: angle,
        renderingMode: 'fill'
      });
    } catch (error) {
      // Fallback for older versions - try to add text without rotation
      doc.text(text, centerX, centerY, { align: 'center' });
      console.log('Watermark rotation not supported in this jsPDF version');
    }
    
    // Restore the graphics state
    doc.restoreGraphicsState();
  };
  
  // Function to create a premium document header
  const addDocumentHeader = (doc: jsPDF, sectionTitle: string, primaryColor: number[], accentColor: number[]) => {
    // Add header bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 20, 'F');
    
    // Add accent line
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, 20, 210, 2, 'F');
    
    // Add logo and section title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("FASTTRACK AI", 15, 13);
    
    // Add vertical separator
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(100, 5, 100, 15);
    
    // Add section title
    doc.setFontSize(11);
    doc.text(sectionTitle, 195, 13, { align: 'right' });
    
    // Reset styles
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  };
  
  // Function to add a professional footer
  const addProfessionalFooter = (doc: jsPDF) => {
    const docInternal = (doc as any).internal;
    const pageCount = docInternal.getNumberOfPages ? docInternal.getNumberOfPages() : 1;
    const currentPage = docInternal.getCurrentPageInfo ? docInternal.getCurrentPageInfo().pageNumber : 1;
    
    // Add footer line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, 280, 195, 280);
    
    // Add page number and copyright in a more professional way
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`Page ${currentPage} of ${pageCount}`, 105, 286, { align: 'center' });
    doc.text("© FastTrack AI - Confidential & Proprietary", 15, 286);
    doc.text(`Report ID: FT-${Date.now().toString().substring(5, 13)}`, 195, 286, { align: 'right' });
  };
  
  // Function to create a custom premium checkmark
  const createPremiumCheckmark = (primaryColor: number[], accentColor: number[]) => {
    try {
      // Create a canvas to draw the checkmark
      const canvas = document.createElement('canvas');
      canvas.width = 60;
      canvas.height = 60;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';
      
      // Draw circle background
      ctx.fillStyle = `rgb(${primaryColor[0]}, ${primaryColor[1]}, ${primaryColor[2]})`;
      ctx.beginPath();
      ctx.arc(30, 30, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw check
      ctx.fillStyle = `rgb(${accentColor[0]}, ${accentColor[1]}, ${accentColor[2]})`;
      ctx.beginPath();
      ctx.moveTo(15, 30);
      ctx.lineTo(25, 40);
      ctx.lineTo(45, 20);
      ctx.lineTo(40, 15);
      ctx.lineTo(25, 30);
      ctx.lineTo(20, 25);
      ctx.closePath();
      ctx.fill();
      
      // Return as data URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error creating checkmark:', error);
      return '';
    }
  };
  
  // Function to create an arrow bullet
  const createArrowBullet = (accentColor: number[]) => {
    try {
      // Create a canvas to draw the arrow
      const canvas = document.createElement('canvas');
      canvas.width = 40;
      canvas.height = 40;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';
      
      // Draw arrow shape
      ctx.fillStyle = `rgb(${accentColor[0]}, ${accentColor[1]}, ${accentColor[2]})`;
      ctx.beginPath();
      ctx.moveTo(5, 20);
      ctx.lineTo(20, 20);
      ctx.lineTo(20, 15);
      ctx.lineTo(30, 22);
      ctx.lineTo(20, 29);
      ctx.lineTo(20, 24);
      ctx.lineTo(5, 24);
      ctx.closePath();
      ctx.fill();
      
      // Return as data URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error creating arrow bullet:', error);
      return '';
    }
  };
  
  // Function to create a diamond bullet
  const createDiamondBullet = () => {
    try {
      // Create a canvas to draw the diamond
      const canvas = document.createElement('canvas');
      canvas.width = 40;
      canvas.height = 40;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';
      
      // Draw diamond shape
      ctx.fillStyle = '#005eff';
      ctx.beginPath();
      ctx.moveTo(20, 10);
      ctx.lineTo(30, 20);
      ctx.lineTo(20, 30);
      ctx.lineTo(10, 20);
      ctx.closePath();
      ctx.fill();
      
      // Return as data URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error creating diamond bullet:', error);
      return '';
    }
  };

  const getDataMaps = () => {
    // Map form values to readable text
    const industryMap: Record<string, string> = {
      'retail': 'Retail',
      'healthcare': 'Healthcare',
      'finance': 'Finance',
      'manufacturing': 'Manufacturing',
      'technology': 'Technology',
      'education': 'Education',
      'hospitality': 'Hospitality',
      'other': 'Other'
    };
    
    const companySizeMap: Record<string, string> = {
      '1-10': '1-10 employees',
      '11-50': '11-50 employees',
      '51-200': '51-200 employees',
      '201-500': '201-500 employees',
      '501+': '501+ employees'
    };
    
    const budgetMap: Record<string, string> = {
      '25000-50000': '$25,000 - $50,000',
      '50000-100000': '$50,000 - $100,000',
      '100000-150000': '$100,000 - $150,000',
      '150000-250000': '$150,000 - $250,000',
      '250000+': '$250,000+'
    };
    
    return { industryMap, companySizeMap, budgetMap };
  };

  const generateReportContent = () => {
    // These maps moved to getDataMaps function
    const { industryMap, companySizeMap, budgetMap } = getDataMaps();
    
    // Industry observations - general trends without specific statistics
    const industryInsights: Record<string, { overview: string, focus_areas: string[] }> = {
      'retail': {
        overview: "Retail companies are increasingly looking at AI to enhance customer experiences, optimize inventory, and streamline operations in a competitive market. Your position in this evolving landscape presents opportunities for strategic transformation.",
        focus_areas: [
          "Customer behavior analysis to improve personalization and targeted marketing",
          "Inventory management optimization to reduce costs and improve product availability",
          "Dynamic pricing strategies to maximize revenue opportunities"
        ]
      },
      'healthcare': {
        overview: "Healthcare organizations are exploring AI to improve patient outcomes, optimize resource allocation, and streamline administrative processes. The healthcare AI landscape continues to evolve with new applications emerging regularly.",
        focus_areas: [
          "Patient data analysis for improved care planning and preventive measures",
          "Administrative workflow optimization to reduce documentation burden",
          "Diagnostic support tools to enhance clinical decision-making"
        ]
      },
      'finance': {
        overview: "Financial institutions are looking at AI to create more secure, efficient, and personalized experiences. With increasing competition from fintech disruptors, established organizations can leverage AI strategically.",
        focus_areas: [
          "Fraud detection and security enhancements through pattern recognition",
          "Personalized financial guidance and product recommendations",
          "Process automation for loan underwriting and documentation"
        ]
      },
      'manufacturing': {
        overview: "Manufacturing companies are exploring how AI can transform production processes, enhance quality control, and optimize supply chains. In today's competitive landscape, strategic AI implementation can support operational excellence.",
        focus_areas: [
          "Predictive maintenance to reduce downtime and extend equipment life",
          "Quality control automation through computer vision and analytics",
          "Supply chain optimization and demand forecasting"
        ]
      },
      'technology': {
        overview: "Technology companies are exploring AI not just as a product offering but to transform their own operations and accelerate innovation. As technology evolves rapidly, integrating AI into your processes can enhance capabilities.",
        focus_areas: [
          "Development workflow optimization through code assistance and testing",
          "Customer support enhancement through predictive issue identification",
          "Product development informed by usage pattern analysis"
        ]
      },
      'education': {
        overview: "Educational institutions are looking at AI to personalize learning experiences, optimize administrative processes, and gain deeper insights into student performance. AI can potentially enhance educational outcomes while addressing operational challenges.",
        focus_areas: [
          "Personalized learning approaches based on student progress and preferences",
          "Early intervention systems to identify and support struggling students",
          "Administrative automation to reduce paperwork and documentation burden"
        ]
      },
      'hospitality': {
        overview: "Hospitality businesses are exploring how AI can transform guest experiences and operational efficiency. In a market with evolving consumer expectations, AI offers opportunities to enhance personalization while optimizing operations.",
        focus_areas: [
          "Guest experience personalization based on preferences and past interactions",
          "Revenue management through demand forecasting and pricing optimization",
          "Operational efficiency improvements in staff scheduling and service delivery"
        ]
      },
      'other': {
        overview: "Organizations across sectors are exploring transformative applications for AI, from enhancing customer experiences to optimizing operations and driving innovation. Your specific industry may present unique opportunities for AI application.",
        focus_areas: [
          "Process automation to reduce manual tasks and improve consistency",
          "Data analysis to uncover insights and support decision-making",
          "Customer experience enhancement through personalization and service improvements"
        ]
      }
    };
    
    // Select appropriate industry insights
    const industry = industryMap[formData.industry] || 'Other';
    const insights = industryInsights[formData.industry.toLowerCase()] || industryInsights['other'];
    
    // Generate a formatted report
    return `
==================================================================================================================
                                  INITIAL AI STRATEGY ASSESSMENT FOR
                                  ${formData.businessName.toUpperCase()}
==================================================================================================================

INTRODUCTION
-----------
Thank you for sharing information about ${formData.businessName}. This initial assessment outlines potential 
AI strategy directions based on the limited information provided. A comprehensive strategy would require deeper 
analysis of your specific operations, data readiness, and business objectives.

This document highlights opportunities to explore and questions to consider as you evaluate AI implementation. 
It's designed to start a meaningful conversation about how AI might benefit your organization.

COMPANY INFORMATION
------------------
Business Name: ${formData.businessName}
Industry: ${industryMap[formData.industry] || formData.industry}
Company Size: ${companySizeMap[formData.companySize] || formData.companySize}
AI Investment Range: ${budgetMap[formData.budget] || formData.budget}

INDUSTRY CONTEXT
--------------
${insights.overview}

Based on our experience with similar organizations, common focus areas include:
• ${insights.focus_areas[0]}
• ${insights.focus_areas[1]}
• ${insights.focus_areas[2]}

BUSINESS CHALLENGES ASSESSMENT
----------------------------
You shared the following challenges:
"${formData.topChallenges}"

${generateChallengeResponse(formData.topChallenges)}

POTENTIAL STRATEGIC DIRECTIONS
----------------------------
Based on your industry context and described challenges, several approaches might be worth exploring:

1. DISCOVERY PHASE
   • Conduct a comprehensive assessment of your current processes and pain points
   • Evaluate your data readiness and technology infrastructure
   • Identify quick wins and longer-term strategic opportunities
   • Key Question: Which operational areas would benefit most from immediate improvement?

2. INITIAL IMPLEMENTATION
   • Focus on a high-value, contained use case to demonstrate impact
   • Establish measurement frameworks to track results
   • Build internal capabilities through hands-on involvement
   • Key Question: What would a successful first project look like for your organization?

3. SCALING STRATEGY
   • Develop a roadmap for expanding successful approaches
   • Consider governance frameworks for responsible AI use
   • Plan for ongoing optimization and capability building
   • Key Question: How would AI initiatives align with your broader business strategy?

IMPORTANT CONSIDERATIONS
----------------------
Every successful AI implementation requires attention to several key factors:

DATA READINESS:
• What data do you currently collect and store?
• How accessible and organized is your data?
• Are there quality or completeness issues to address?

ORGANIZATIONAL READINESS:
• How might existing workflows need to change?
• What skills and capabilities will your team need?
• How will you manage change and build buy-in?

IMPLEMENTATION APPROACH:
• Build vs. buy decisions for AI capabilities
• Integration with existing systems and processes
• Success metrics and evaluation frameworks

NEXT STEPS TO CONSIDER
---------------------
Based on our experience guiding organizations through AI transformation, we recommend:

1. Strategic Discovery Workshop
   • Bring together key stakeholders to align on objectives and priorities
   • Identify concrete use cases and potential value
   • Develop evaluation criteria for success

2. Readiness Assessment
   • Evaluate your current data, technology, and process capabilities
   • Identify gaps and requirements for successful implementation
   • Develop an action plan to address readiness issues

3. Pilot Planning
   • Define scope and success metrics for an initial implementation
   • Identify resource requirements and timeline
   • Create a learning framework to capture insights

To discuss these recommendations further and explore how we might support your AI journey, 
please contact us at contact@fasttrackAI.com or call 1-800-AI-STRATEGY.

We will reach out to you at ${formData.email} within the next business day to schedule 
a follow-up conversation.

==================================================================================================================
This assessment is based on limited information and represents initial thinking rather than a comprehensive 
strategy. A more detailed engagement would be required to develop specific recommendations and implementation plans.

Generated on: ${new Date().toLocaleDateString()}
==================================================================================================================
`;
  };

  const sendReportByEmail = () => {
    // In a real implementation, this would call an API to send the email
    console.log(`Sending report to ${formData.email}`);
    
    // Create the mailto URL
    const mailtoUrl = `mailto:${formData.email}?subject=Your%20AI%20Strategy%20Report&body=Thank%20you%20for%20using%20our%20AI%20Strategy%20Report%20Generator.%20Your%20report%20is%20attached.`;
    
    // Open the email client in a way that works with React
    window.open(mailtoUrl, '_blank');
  };

  // Add these helper functions to generate customized content

  const getIndustryInsights = (industry: string) => {
    const industryInsights: Record<string, { recommendation: string }> = {
      'retail': {
        recommendation: "For retail organizations, we recommend starting with customer behavior analysis AI to enhance personalization and dynamic pricing. Based on your specific challenges, our proven implementation approach focuses on quick-win use cases around inventory optimization and customer journey enhancement."
      },
      'healthcare': {
        recommendation: "For healthcare organizations, we recommend starting with patient outcome prediction models and operational efficiency tools. Based on your specific challenges, our healthcare-specific approach balances regulatory compliance with innovation through targeted pilot programs."
      },
      'finance': {
        recommendation: "For financial services organizations, we recommend starting with risk assessment AI and customer personalization tools. Our finance-specific implementation approach emphasizes security and compliance while delivering measurable ROI through process automation."
      },
      'manufacturing': {
        recommendation: "For manufacturing organizations, we recommend starting with predictive maintenance AI and quality control systems. Our manufacturing-focused implementation strategy prioritizes operational integration and workforce adoption to deliver measurable efficiency gains."
      },
      'technology': {
        recommendation: "For technology organizations, we recommend starting with AI-enhanced development tools and product intelligence systems. Our tech-centered implementation approach leverages your existing technical capabilities while accelerating time-to-value."
      },
      'education': {
        recommendation: "For education organizations, we recommend starting with personalized learning AI and administrative efficiency tools. Our education-focused implementation approach emphasizes privacy and accessibility while providing measurable learning outcome improvements."
      },
      'hospitality': {
        recommendation: "For hospitality organizations, we recommend starting with guest experience AI and operational optimization tools. Our hospitality-specific implementation approach balances enhancing the human touch with automation to improve guest satisfaction."
      },
      'other': {
        recommendation: "Based on your industry profile, we recommend starting with process automation and data intelligence tools. Our implementation approach is customized to your specific sector challenges while providing measurable business outcomes and ROI."
      }
    };

    return industryInsights[industry.toLowerCase()] || industryInsights['other'];
  };

  const getCompanySizeStrategies = (companySize: string) => {
    const strategies: Record<string, { approach: string, recommendation: string }> = {
      '1-10': {
        approach: "agile",
        recommendation: "For smaller organizations (1-10 employees), we recommend a tightly focused implementation with highest-ROI use cases first. Our small business AI integration method emphasizes quick implementation, minimal disruption, and rapid value demonstration."
      },
      '11-50': {
        approach: "focused",
        recommendation: "For small organizations (11-50 employees), we recommend a departmental implementation approach starting with your most critical business function. Our implementation methodology balances easy wins with sustainable capability building."
      },
      '51-200': {
        approach: "staged",
        recommendation: "For mid-sized organizations (51-200 employees), we recommend a staged multi-department implementation approach. Our methodology emphasizes cross-functional integration while building internal capabilities through knowledge transfer."
      }, 
      '201-500': {
        approach: "strategic",
        recommendation: "For larger organizations (201-500 employees), we recommend a strategic enterprise-wide implementation with pilot projects in key divisions. Our approach emphasizes governance, scale, and sustainable adoption across diverse business units."
      },
      '501+': {
        approach: "enterprise",
        recommendation: "For enterprise organizations (501+ employees), we recommend a comprehensive transformation program with center of excellence creation. Our enterprise implementation methodology addresses complex integration, governance, and change management needs."
      }
    };

    return strategies[companySize] || strategies['11-50'];
  };

  const getBudgetStrategies = (budget: string) => {
    const strategies: Record<string, { approach: string, recommendation: string }> = {
      '25000-50000': {
        approach: "targeted",
        recommendation: "With your budget range ($25,000-$50,000), we recommend a targeted implementation focusing on 1-2 high-impact use cases. Our efficient implementation approach maximizes value through focused scope and leveraging pre-built components where possible."
      },
      '50000-100000': {
        approach: "balanced",
        recommendation: "With your budget range ($50,000-$100,000), we recommend a balanced implementation with 2-3 interconnected use cases. Our approach emphasizes knowledge transfer and building internal capabilities for future expansion."
      },
      '100000-150000': {
        approach: "comprehensive",
        recommendation: "With your budget range ($100,000-$150,000), we recommend a comprehensive approach with multiple use cases and foundation building. Our implementation methodology includes robust training and process integration for sustainable results."
      },
      '150000-250000': {
        approach: "transformative",
        recommendation: "With your budget range ($150,000-$250,000), we recommend a transformative approach with department-wide AI integration. Our implementation includes advanced custom models, comprehensive training, and robust governance frameworks."
      },
      '250000+': {
        approach: "enterprise",
        recommendation: "With your enterprise budget range ($250,000+), we recommend a full enterprise transformation program. Our implementation includes custom model development, organization-wide integration, and establishing a center of excellence for ongoing innovation."
      }
    };

    return strategies[budget] || strategies['50000-100000'];
  };

  const generateChallengeResponse = (challenges: string) => {
    // Extract key words from challenges
    const challengeLower = challenges.toLowerCase();
    
    // Default recommendation
    let primaryRecommendation = "implementing a multi-phase AI adoption strategy tailored to your specific needs with focus on quick wins and organizational readiness.";
    
    if (challengeLower.includes('cost') || challengeLower.includes('expense') || challengeLower.includes('budget')) {
      primaryRecommendation = "cost optimization through process automation and AI-enhanced resource allocation, with typical efficiency improvements of 15-30% in targeted processes.";
    }
    
    if (challengeLower.includes('customer') || challengeLower.includes('client') || challengeLower.includes('service')) {
      primaryRecommendation = "customer experience enhancement through AI-powered personalization and service optimization, with demonstrated improvements in satisfaction metrics and retention rates.";
    }
    
    if (challengeLower.includes('data') || challengeLower.includes('information') || challengeLower.includes('insight')) {
      primaryRecommendation = "implementing a comprehensive data strategy with advanced analytics capabilities to uncover actionable insights and enable data-driven decision making across your organization.";
    }
    
    if (challengeLower.includes('staff') || challengeLower.includes('talent') || challengeLower.includes('employee') || challengeLower.includes('workforce')) {
      primaryRecommendation = "workforce enhancement through AI-assisted task automation and knowledge augmentation, enabling your team to focus on higher-value activities and reducing routine work.";
    }
    
    if (challengeLower.includes('compet') || challengeLower.includes('market') || challengeLower.includes('industry')) {
      primaryRecommendation = "competitive differentiation through AI-enabled capabilities and market intelligence tools that provide actionable insights about your industry landscape and customer preferences.";
    }
    
    if (challengeLower.includes('grow') || challengeLower.includes('scale') || challengeLower.includes('expand')) {
      primaryRecommendation = "scalable growth enablement through AI-optimized processes and intelligent automation that allows your business to scale without proportional increases in operational costs.";
    }
    
    return { primaryRecommendation };
  };

  const generateRecommendationId = (formData: FormData) => {
    // Create a unique ID based on user inputs
    const date = new Date();
    const datePart = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    // Get first letter of business name
    const businessInitial = formData.businessName.charAt(0).toUpperCase();
    // Get first letter of industry
    const industryInitial = (formData.industry || 'X').charAt(0).toUpperCase();
    
    // Get first digit of company size
    const sizeDigit = (formData.companySize || '0').replace(/[^\d]/g, '').charAt(0);
    
    // Random numbers
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `FT-${datePart}-${businessInitial}${industryInitial}${sizeDigit}-${randomPart}`;
  };

  return (
    <main className="min-h-screen py-20 gradient-primary">
      <div className="container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="heading-1 text-center mb-4 text-white"
            variants={fadeInUp}
          >
            FastTrack AI Strategy Report Generator
          </motion.h1>
          <motion.p 
            className="body-large text-white text-center mb-12"
            variants={fadeInUp}
          >
            Get a personalized AI strategy report for your business in minutes.
          </motion.p>

          {!isSuccess ? (
            <motion.div 
              className="card"
              variants={fadeInUp}
            >
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-purple-700 mr-3" />
                <h2 className="heading-3 text-gray-900">Tell Us About Your Business</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                      Industry
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select your industry</option>
                      <option value="retail">Retail</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="technology">Technology</option>
                      <option value="education">Education</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="topChallenges" className="block text-sm font-medium text-gray-700 mb-2">
                    Top Business Challenges
                  </label>
                  <textarea
                    id="topChallenges"
                    name="topChallenges"
                    value={formData.topChallenges}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your top 2-3 business challenges that you think AI could help with..."
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Budget for AI Solutions
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select budget range</option>
                    <option value="25000-50000">$25,000 - $50,000</option>
                    <option value="50000-100000">$50,000 - $100,000</option>
                    <option value="100000-150000">$100,000 - $150,000</option>
                    <option value="150000-250000">$150,000 - $250,000</option>
                    <option value="250000+">$250,000+</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button-primary w-full flex items-center justify-center disabled:bg-purple-400"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Your Report...
                    </>
                  ) : (
                    <>
                      Generate My AI Strategy Report
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              className="card text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="heading-3 mb-2 text-gray-900">Your AI Strategy Report is Ready!</h2>
                <p className="text-gray-700 mb-6">
                  We've analyzed your business information and created a personalized FastTrack AI strategy report.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <button 
                  onClick={downloadReport}
                  disabled={isDownloading}
                  className="button-primary flex items-center justify-center"
                >
                  {isDownloading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Download Report
                    </>
                  )}
                </button>
                <button 
                  onClick={sendReportByEmail}
                  className="button-secondary flex items-center justify-center"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Send Report via Email
                </button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 text-sm">
                  <strong>What's next?</strong> We've sent a copy of your report to your email. You'll also receive a series of follow-up resources tailored to your business needs over the next few days.
                </p>
              </div>
              
              <div className="mt-6">
                <Link 
                  href="/schedule-consultation"
                  className="button-primary inline-flex items-center"
                >
                  Schedule a Consultation
                </Link>
              </div>
            </motion.div>
          )}
          
          <motion.div 
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg"
              variants={fadeInUp}
            >
              <h3 className="font-bold text-lg mb-2 text-gray-900">Personalized Insights</h3>
              <p className="text-gray-700">
                Get AI recommendations specific to your industry, company size, and business challenges.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg"
              variants={fadeInUp}
            >
              <h3 className="font-bold text-lg mb-2 text-gray-900">ROI Projections</h3>
              <p className="text-gray-700">
                See potential cost savings and revenue gains from implementing AI solutions.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg"
              variants={fadeInUp}
            >
              <h3 className="font-bold text-lg mb-2 text-gray-900">Implementation Roadmap</h3>
              <p className="text-gray-700">
                Get a step-by-step plan for integrating AI into your business operations.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
} 