'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Clock, TrendingUp, Download, ChartBar, FileText, FileIcon, ChevronDown, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';

interface ROIInputs {
  revenue: number;
  employees: number;
  customerServiceHours: number;
  dataProcessingHours: number;
  averageHourlyRate: number;
  selectedPackage: 'grow' | 'optimize' | 'sell';
}

interface ROICalculation {
  automationSavings: number;
  productivityGain: number;
  customerRetention: number;
  totalBenefit: number;
  roi: number;
  paybackPeriod: number;
  yearlyBreakdown: {
    year: number;
    automationSavings: number;
    productivityGain: number;
    customerRetention: number;
    totalBenefit: number;
    roi: number;
  }[];
}

interface PackageDetails {
  name: string;
  basePrice: number;
  monthlyFee: number;
  efficiencyMultiplier: number;
  adoptionSpeed: number;
  errorReductionRate: number;
  revenueLiftRate: number;
  churnReductionBoost: number;
  implementationTimeMonths: number;
  features: string[];
}

export default function ROICalculator() {
  const router = useRouter();
  const [inputs, setInputs] = useState<ROIInputs>({
    revenue: 1000000,
    employees: 50,
    customerServiceHours: 40,
    dataProcessingHours: 20,
    averageHourlyRate: 25,
    selectedPackage: 'optimize'
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showFormatOptions, setShowFormatOptions] = useState(false);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const yearlyChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartInstance = useRef<Chart | null>(null);
  const barChartInstance = useRef<Chart | null>(null);
  const yearlyChartInstance = useRef<Chart | null>(null);

  // Package details with different ROI parameters
  const packageDetails: Record<string, PackageDetails> = {
    grow: {
      name: 'Priced to Grow',
      basePrice: 25000,
      monthlyFee: 1000,
      efficiencyMultiplier: 1.0,
      adoptionSpeed: 1.0,
      errorReductionRate: 0.25,
      revenueLiftRate: 0.02,
      churnReductionBoost: 1.0,
      implementationTimeMonths: 2.5,
      features: [
        'AI-powered customer service automation',
        'Basic data analytics and reporting',
        'Single workflow automation',
        'Employee training and onboarding',
        'Standard support package',
        '6-month growth roadmap'
      ]
    },
    optimize: {
      name: 'Priced to Optimize',
      basePrice: 50000,
      monthlyFee: 2000,
      efficiencyMultiplier: 1.5,
      adoptionSpeed: 1.2,
      errorReductionRate: 0.35,
      revenueLiftRate: 0.035,
      churnReductionBoost: 1.3,
      implementationTimeMonths: 3,
      features: [
        'Custom AI solution development',
        'Process optimization analysis',
        'Advanced workflow automation',
        'Business intelligence dashboard',
        'ROI tracking and optimization',
        'Enhanced support package',
        'Quarterly performance reviews'
      ]
    },
    sell: {
      name: 'Priced to Sell',
      basePrice: 150000,
      monthlyFee: 3500,
      efficiencyMultiplier: 2.0,
      adoptionSpeed: 1.5,
      errorReductionRate: 0.5,
      revenueLiftRate: 0.05,
      churnReductionBoost: 1.8,
      implementationTimeMonths: 3.5,
      features: [
        'Full AI infrastructure implementation',
        'Advanced analytics and predictive modeling',
        'Multiple workflow automations',
        'Custom AI model development',
        'M&A readiness assessment',
        'Technical due diligence preparation',
        'Valuation optimization strategy',
        'Priority support package'
      ]
    }
  };

  const calculateROI = (): ROICalculation => {
    const selectedPackageDetails = packageDetails[inputs.selectedPackage];
    
    // Implementation costs based on package and company size
    const baseImplementationCost = selectedPackageDetails.basePrice;
    const perEmployeeCost = 150; // Additional cost per employee for setup and configuration
    const implementationCost = baseImplementationCost + (inputs.employees * perEmployeeCost);
    
    // Monthly subscription based on selected package
    const monthlySubscription = selectedPackageDetails.monthlyFee;
    
    // Include training costs
    const trainingCostPerEmployee = 100;
    const trainingCost = inputs.employees * trainingCostPerEmployee;
    
    // Total first-year cost including implementation, subscription, and training
    const annualCost = implementationCost + (monthlySubscription * 12) + trainingCost;
    
    // Implementation time based on package
    const implementationMonths = selectedPackageDetails.implementationTimeMonths;
    
    // 1. Automation Savings with adoption curve based on package
    const weeklyHours = inputs.dataProcessingHours;
    const hourlyRate = inputs.averageHourlyRate;
    
    // Adjust efficiency gains based on package
    const efficiencyMultiplier = selectedPackageDetails.efficiencyMultiplier;
    const adoptionSpeed = selectedPackageDetails.adoptionSpeed;
    
    // Calculate automation savings with package-specific parameters
    // No savings during setup period
    const setupMonths = Math.max(1, Math.round(implementationMonths));
    const remainingMonths = 12 - setupMonths;
    
    // Adjust adoption curve based on package
    const initialAdoptionMonths = Math.max(1, Math.round(3 / adoptionSpeed));
    const growingAdoptionMonths = Math.max(1, Math.round(4 / adoptionSpeed));
    const matureAdoptionMonths = remainingMonths - initialAdoptionMonths - growingAdoptionMonths;
    
    // Calculate savings for each phase
    const automationSavingsSetup = 0;
    
    // Initial adoption period
    const initialEfficiency = 0.2 * efficiencyMultiplier;
    const automationSavingsInitial = (weeklyHours * 4 * initialAdoptionMonths * hourlyRate) * initialEfficiency;
    
    // Growing adoption period
    const growingEfficiency = 0.4 * efficiencyMultiplier;
    const automationSavingsGrowing = (weeklyHours * 4 * growingAdoptionMonths * hourlyRate) * growingEfficiency;
    
    // Mature adoption period
    const matureEfficiency = 0.6 * efficiencyMultiplier;
    const automationSavingsMature = (weeklyHours * 4 * matureAdoptionMonths * hourlyRate) * matureEfficiency;
    
    // Total first-year automation savings
    const automationSavings = automationSavingsSetup + automationSavingsInitial + automationSavingsGrowing + automationSavingsMature;
    
    // 2. Productivity Gains with package-specific parameters
    // Direct gains: Cost reduction from efficiency in customer service
    const directGainEfficiency = 0.15 * efficiencyMultiplier;
    const directGains = (inputs.customerServiceHours * 52 * hourlyRate) * directGainEfficiency;
    
    // Error reduction based on package
    const errorReductionRate = selectedPackageDetails.errorReductionRate;
    const errorReductionSavings = (inputs.revenue * 0.03) * errorReductionRate;
    
    // Revenue lift based on package
    const revenueLiftRate = selectedPackageDetails.revenueLiftRate;
    // Adjust adoption factor based on package
    const adoptionFactor = 0.6 + (0.1 * (adoptionSpeed - 1));
    const revenueLift = inputs.revenue * revenueLiftRate * adoptionFactor;
    
    const productivityGain = directGains + errorReductionSavings + revenueLift;
    
    // 3. Customer Retention Value with package-specific adjustments
    // Base churn reduction rates
    let baseChurnReduction = 0;
    if (inputs.employees <= 20) {
      baseChurnReduction = 0.02; // 2% reduction for small companies
    } else if (inputs.employees <= 100) {
      baseChurnReduction = 0.015; // 1.5% reduction for medium companies
    } else {
      baseChurnReduction = 0.01; // 1% reduction for large companies
    }
    
    // Apply package-specific boost to churn reduction
    const churnReduction = baseChurnReduction * selectedPackageDetails.churnReductionBoost;
    
    // Customer estimation based on revenue
    const avgAnnualRevenuePerCustomer = 5000;
    const estimatedCustomers = Math.max(10, Math.round(inputs.revenue / avgAnnualRevenuePerCustomer));
    
    // Customer lifetime value calculation
    const avgCustomerLifespan = 2 + (0.5 * (selectedPackageDetails.churnReductionBoost - 1));
    const avgCustomerValue = inputs.revenue / estimatedCustomers;
    const customerLTV = avgCustomerValue * avgCustomerLifespan;
    
    // Apply adoption factor to customer retention
    const customerRetention = churnReduction * customerLTV * estimatedCustomers * adoptionFactor;
    
    // Calculate total benefit
    const totalBenefit = automationSavings + productivityGain + customerRetention;
    
    // Calculate ROI
    const roi = ((totalBenefit - annualCost) / annualCost) * 100;
    
    // Payback Period Calculation
    const effectiveMonths = 12 - setupMonths;
    const monthlyBenefitAtMaturity = totalBenefit / effectiveMonths;
    const paybackPeriod = setupMonths + (implementationCost / monthlyBenefitAtMaturity);
    
    // Multi-year projection with continuous growth (no diminishing returns)
    const yearlyBreakdown = [
      // Year 1: Implementation and initial adoption phase
      {
        year: 1,
        automationSavings,
        productivityGain,
        customerRetention,
        totalBenefit,
        roi
      },
      // Year 2: Full adoption and optimization
      {
        year: 2,
        automationSavings: automationSavings * 1.8,
        productivityGain: productivityGain * 1.8,
        customerRetention: customerRetention * 1.8,
        totalBenefit: 0, // Will be calculated below
        roi: 0 // Will be calculated below
      },
      // Year 3: Continued growth and expansion
      {
        year: 3,
        automationSavings: automationSavings * 2.5,
        productivityGain: productivityGain * 2.5,
        customerRetention: customerRetention * 2.5,
        totalBenefit: 0, // Will be calculated below
        roi: 0 // Will be calculated below
      }
    ];
    
    // Calculate total benefits and ROI for years 2 and 3
    yearlyBreakdown[1].totalBenefit = yearlyBreakdown[1].automationSavings + 
                                      yearlyBreakdown[1].productivityGain + 
                                      yearlyBreakdown[1].customerRetention;
    
    yearlyBreakdown[2].totalBenefit = yearlyBreakdown[2].automationSavings + 
                                      yearlyBreakdown[2].productivityGain + 
                                      yearlyBreakdown[2].customerRetention;
    
    // Only ongoing subscription costs for years 2 and 3
    const year2Cost = monthlySubscription * 12;
    const year3Cost = monthlySubscription * 12;
    
    yearlyBreakdown[1].roi = ((yearlyBreakdown[1].totalBenefit - year2Cost) / year2Cost) * 100;
    yearlyBreakdown[2].roi = ((yearlyBreakdown[2].totalBenefit - year3Cost) / year3Cost) * 100;

    return {
      automationSavings,
      productivityGain,
      customerRetention,
      totalBenefit,
      roi,
      paybackPeriod,
      yearlyBreakdown
    };
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Create charts when input values change
  useEffect(() => {
    if (pieChartRef.current && barChartRef.current && yearlyChartRef.current) {
      // Destroy previous chart instances if they exist
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
      if (yearlyChartInstance.current) {
        yearlyChartInstance.current.destroy();
      }
      
      const results = calculateROI();
      const selectedPackageDetails = packageDetails[inputs.selectedPackage];
      
      // Create pie chart for ROI breakdown
      const pieCtx = pieChartRef.current.getContext('2d');
      if (pieCtx) {
        pieChartInstance.current = new Chart(pieCtx, {
          type: 'pie',
          data: {
            labels: ['Automation Savings', 'Productivity Gains', 'Customer Retention'],
            datasets: [{
              data: [
                results.automationSavings,
                results.productivityGain,
                results.customerRetention
              ],
              backgroundColor: [
                'rgba(147, 51, 234, 0.7)',  // Purple
                'rgba(59, 130, 246, 0.7)',  // Blue
                'rgba(251, 191, 36, 0.7)'   // Amber
              ],
              borderColor: [
                'rgba(147, 51, 234, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(251, 191, 36, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'ROI Breakdown'
              }
            }
          }
        });
      }
      
      // Create bar chart for revenue impact
      const barCtx = barChartRef.current.getContext('2d');
      if (barCtx) {
        const currentRevenue = parseFloat(inputs.revenue.toString());
        const projectedRevenue = currentRevenue + results.totalBenefit;
        
        barChartInstance.current = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: ['Current Revenue', 'Projected Revenue with AI'],
            datasets: [{
              label: 'Revenue',
              data: [currentRevenue, projectedRevenue],
              backgroundColor: [
                'rgba(107, 114, 128, 0.7)',  // Gray
                'rgba(147, 51, 234, 0.7)'    // Purple
              ],
              borderColor: [
                'rgba(107, 114, 128, 1)',
                'rgba(147, 51, 234, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Revenue Impact'
              }
            }
          }
        });
      }
      
      // Create line chart for yearly breakdown with continuous growth
      const yearlyCtx = yearlyChartRef.current.getContext('2d');
      if (yearlyCtx) {
        const yearlyData = results.yearlyBreakdown;
        
        yearlyChartInstance.current = new Chart(yearlyCtx, {
          type: 'line',
          data: {
            labels: ['Year 1', 'Year 2', 'Year 3'],
            datasets: [
              {
                label: 'Total Benefits',
                data: yearlyData.map(year => year.totalBenefit),
                borderColor: 'rgba(147, 51, 234, 1)',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                fill: true,
                yAxisID: 'y',
              },
              {
                label: 'ROI %',
                data: yearlyData.map(year => year.roi),
                borderColor: 'rgba(251, 191, 36, 1)',
                backgroundColor: 'rgba(251, 191, 36, 0.0)',
                borderDash: [5, 5],
                fill: false,
                yAxisID: 'y1',
              }
            ]
          },
          options: {
            responsive: true,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Total Benefits ($)'
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'ROI (%)'
                },
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                },
                grid: {
                  drawOnChartArea: false,
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: '3-Year Projection with Continuous Growth'
              }
            }
          }
        });
      }
    }
  }, [inputs.revenue, inputs.employees, inputs.customerServiceHours, inputs.dataProcessingHours, inputs.averageHourlyRate, inputs.selectedPackage]);

  const generateReportData = (results: ROICalculation) => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    const selectedPackageDetails = packageDetails[inputs.selectedPackage];
    
    // Calculate implementation costs based on package and company size
    const baseImplementationCost = selectedPackageDetails.basePrice;
    const perEmployeeCost = 150;
    const implementationCost = baseImplementationCost + (inputs.employees * perEmployeeCost);
    
    // Calculate subscription costs based on selected package
    const monthlySubscription = selectedPackageDetails.monthlyFee;
    
    // Calculate training costs
    const trainingCostPerEmployee = 100;
    const trainingCost = inputs.employees * trainingCostPerEmployee;
    
    // Total first-year cost
    const annualCost = implementationCost + (monthlySubscription * 12) + trainingCost;
    
    // Calculate estimated customers
    const avgAnnualRevenuePerCustomer = 5000;
    const estimatedCustomers = Math.max(10, Math.round(inputs.revenue / avgAnnualRevenuePerCustomer));
    
    // Determine company size category for recommendations
    let companySizeCategory = "small";
    if (inputs.employees > 100) {
      companySizeCategory = "large";
    } else if (inputs.employees > 20) {
      companySizeCategory = "medium";
    }
    
    // Determine industry-specific recommendations based on revenue per employee
    const revenuePerEmployee = inputs.revenue / inputs.employees;
    let industryType = "service";
    if (revenuePerEmployee > 500000) {
      industryType = "technology";
    } else if (revenuePerEmployee > 250000) {
      industryType = "manufacturing";
    } else if (revenuePerEmployee > 150000) {
      industryType = "retail";
    }
    
    // Implementation timeline based on package
    const implementationTimeMonths = selectedPackageDetails.implementationTimeMonths;
    const implementationTimeWeeks = Math.round(implementationTimeMonths * 4.33);
    
    // Calculate adoption speed and efficiency metrics based on package
    const adoptionSpeed = selectedPackageDetails.adoptionSpeed;
    const efficiencyMultiplier = selectedPackageDetails.efficiencyMultiplier;
    
    // Calculate customer lifetime value with package-specific adjustments
    const avgCustomerLifespan = 2 + (0.5 * (selectedPackageDetails.churnReductionBoost - 1));
    
    return {
      title: "AI Implementation ROI Analysis",
      date: `${date} at ${time}`,
      companyInfo: {
        revenue: inputs.revenue,
        employees: inputs.employees,
        customerServiceHours: inputs.customerServiceHours,
        dataProcessingHours: inputs.dataProcessingHours,
        averageHourlyRate: inputs.averageHourlyRate,
        estimatedCustomers: estimatedCustomers,
        companySizeCategory: companySizeCategory,
        industryType: industryType
      },
      selectedPackage: {
        name: selectedPackageDetails.name,
        features: selectedPackageDetails.features,
        implementationTimeMonths: implementationTimeMonths,
        implementationTimeWeeks: implementationTimeWeeks,
        efficiencyMultiplier: efficiencyMultiplier,
        adoptionSpeed: adoptionSpeed,
        errorReductionRate: selectedPackageDetails.errorReductionRate,
        revenueLiftRate: selectedPackageDetails.revenueLiftRate,
        churnReductionBoost: selectedPackageDetails.churnReductionBoost
      },
      results: {
        automationSavings: results.automationSavings,
        productivityGain: results.productivityGain,
        customerRetention: results.customerRetention,
        totalBenefit: results.totalBenefit,
        roi: results.roi,
        paybackPeriod: results.paybackPeriod
      },
      costs: {
        implementationCost: implementationCost,
        monthlySubscription: monthlySubscription,
        trainingCost: trainingCost,
        annualCost: annualCost
      },
      yearlyBreakdown: results.yearlyBreakdown,
      automationAdoption: {
        setup: `Initial ${Math.round(implementationTimeMonths)} months: Setup and configuration (0% efficiency gain)`,
        initial: `Early adoption phase: ${Math.round(20 * efficiencyMultiplier)}% efficiency gain`,
        growing: `Growing adoption phase: ${Math.round(40 * efficiencyMultiplier)}% efficiency gain`,
        mature: `Mature adoption phase: ${Math.round(60 * efficiencyMultiplier)}% efficiency gain`
      },
      productivityBreakdown: {
        directGains: (inputs.customerServiceHours * 52 * inputs.averageHourlyRate) * (0.15 * efficiencyMultiplier),
        errorReduction: (inputs.revenue * 0.03) * selectedPackageDetails.errorReductionRate,
        revenueLift: inputs.revenue * selectedPackageDetails.revenueLiftRate * (0.6 + (0.1 * (adoptionSpeed - 1)))
      },
      customerRetentionDetails: {
        churnReduction: `${(inputs.employees <= 20 ? 2 : (inputs.employees <= 100 ? 1.5 : 1)) * selectedPackageDetails.churnReductionBoost}%`,
        avgCustomerValue: inputs.revenue / estimatedCustomers,
        avgCustomerLifespan: avgCustomerLifespan
      },
      recommendations: getRecommendations(companySizeCategory, industryType, inputs, selectedPackageDetails),
      risks: [
        "Implementation delays may extend the payback period",
        "Staff resistance to adoption can reduce efficiency gains",
        "Integration challenges with existing systems may increase costs",
        "Benefits may take longer to realize in complex organizational structures"
      ],
      successFactors: [
        "Executive sponsorship and clear communication of AI strategy",
        "Dedicated implementation team with proper training",
        "Phased rollout approach with measurable milestones",
        "Regular assessment of adoption rates and ROI tracking",
        "Continuous improvement process to optimize AI solutions"
      ]
    };
  };

  // Helper function to generate tailored recommendations
  const getRecommendations = (
    companySizeCategory: string, 
    industryType: string, 
    inputs: ROIInputs,
    packageDetails: PackageDetails
  ) => {
    const recommendations = [];
    
    // Package-specific recommendations
    recommendations.push(`Implement the ${packageDetails.name} package for optimal ROI`);
    
    // Core recommendations for all companies
    recommendations.push("Establish clear metrics to track ROI from day one");
    
    // Size-specific recommendations
    if (companySizeCategory === "small") {
      recommendations.push("Utilize pre-built AI solutions to minimize implementation costs");
      recommendations.push("Focus on customer service automation for immediate impact");
    } else if (companySizeCategory === "medium") {
      recommendations.push("Implement a phased approach starting with department-specific solutions");
      recommendations.push("Balance automation with process redesign for optimal results");
    } else {
      recommendations.push("Develop a comprehensive AI governance framework");
      recommendations.push("Consider a center of excellence approach to scale AI adoption");
    }
    
    // Industry-specific recommendations
    if (industryType === "technology") {
      recommendations.push("Integrate AI with existing development workflows for maximum efficiency");
    } else if (industryType === "manufacturing") {
      recommendations.push("Focus on predictive maintenance and quality control applications");
    } else if (industryType === "retail") {
      recommendations.push("Prioritize customer experience and inventory optimization AI solutions");
    } else {
      recommendations.push("Implement AI-driven service delivery optimization");
    }
    
    // Data processing specific recommendations
    if (inputs.dataProcessingHours > 30) {
      recommendations.push("Prioritize document processing automation for immediate ROI");
    }
    
    // Customer service specific recommendations
    if (inputs.customerServiceHours > 40) {
      recommendations.push("Implement AI chatbots with human escalation paths for complex issues");
    }
    
    return recommendations;
  };

  const downloadTextReport = async () => {
    setIsGeneratingReport(true);
    const results = calculateROI();
    const reportData = generateReportData(results);
    
    try {
      // Create a simple text-based report
      const reportContent = `
=======================================================================
                AI Implementation ROI Analysis
=======================================================================
Generated on: ${reportData.date}

EXECUTIVE SUMMARY
----------------
Based on your business profile and the selected ${reportData.selectedPackage.name} package, 
we project a ${Math.round(reportData.results.roi)}% return on investment within 
the first year. This translates to a potential annual benefit of 
${formatCurrency(reportData.results.totalBenefit)} against a total first-year investment 
of ${formatCurrency(reportData.costs.annualCost)}.

Estimated Payback Period: ${Math.round(reportData.results.paybackPeriod * 10) / 10} months
(Note: This includes a ${Math.round(reportData.selectedPackage.implementationTimeMonths)} month implementation period)

SELECTED PACKAGE: ${reportData.selectedPackage.name.toUpperCase()}
-----------------
Implementation Timeline: ${reportData.selectedPackage.implementationTimeWeeks} weeks
Efficiency Multiplier: ${reportData.selectedPackage.efficiencyMultiplier}x
Adoption Speed: ${reportData.selectedPackage.adoptionSpeed}x

Key Features:
${reportData.selectedPackage.features.map(feature => `• ${feature}`).join('\n')}

COST BREAKDOWN
-------------
Implementation Cost: ${formatCurrency(reportData.costs.implementationCost)}
Monthly Subscription: ${formatCurrency(reportData.costs.monthlySubscription)}
Training Cost: ${formatCurrency(reportData.costs.trainingCost)}
Total First-Year Cost: ${formatCurrency(reportData.costs.annualCost)}

COMPANY INFORMATION & ANALYSIS
-----------------------------
Annual Revenue: ${formatCurrency(reportData.companyInfo.revenue)}
Number of Employees: ${reportData.companyInfo.employees}
Weekly Customer Service Hours: ${reportData.companyInfo.customerServiceHours} hours
Weekly Data Processing Hours: ${reportData.companyInfo.dataProcessingHours} hours
Average Hourly Rate: ${formatCurrency(reportData.companyInfo.averageHourlyRate)}
Estimated Customer Base: ${reportData.companyInfo.estimatedCustomers}

Business Profile Analysis:
Your organization operates with a revenue-to-employee ratio of ${formatCurrency(reportData.companyInfo.revenue / reportData.companyInfo.employees)} per employee. 
Your team currently dedicates ${reportData.companyInfo.customerServiceHours + reportData.companyInfo.dataProcessingHours} total hours weekly to 
customer service and data processing tasks, representing approximately 
${Math.round(((reportData.companyInfo.customerServiceHours + reportData.companyInfo.dataProcessingHours) / (reportData.companyInfo.employees * 40)) * 100)}% 
of your workforce's capacity. Based on this profile, you are classified as a 
${reportData.companyInfo.companySizeCategory}-sized company in the ${reportData.companyInfo.industryType} sector.

PROJECTED RETURNS (DETAILED BREAKDOWN)
------------------------------------
1. Annual Automation Savings: ${formatCurrency(reportData.results.automationSavings)}
   - Based on a realistic adoption curve over 12 months:
     * ${reportData.automationAdoption.setup}
     * ${reportData.automationAdoption.initial}
     * ${reportData.automationAdoption.growing}
     * ${reportData.automationAdoption.mature}
   - The ${reportData.selectedPackage.name} package accelerates adoption by ${reportData.selectedPackage.adoptionSpeed}x and 
     increases efficiency gains by ${reportData.selectedPackage.efficiencyMultiplier}x

2. Productivity Gains: ${formatCurrency(reportData.results.productivityGain)}
   - Direct cost reduction from efficiency: ${formatCurrency(reportData.productivityBreakdown.directGains)}
     (Based on a ${Math.round(15 * reportData.selectedPackage.efficiencyMultiplier)}% efficiency improvement in customer service)
   - Error reduction savings: ${formatCurrency(reportData.productivityBreakdown.errorReduction)}
     (Assuming 3% of revenue is currently lost to errors, with a ${Math.round(reportData.selectedPackage.errorReductionRate * 100)}% reduction)
   - Revenue lift from increased throughput: ${formatCurrency(reportData.productivityBreakdown.revenueLift)}
     (${Math.round(reportData.selectedPackage.revenueLiftRate * 100)}% increase with optimized adoption)

3. Customer Retention Value: ${formatCurrency(reportData.results.customerRetention)}
   - Based on a ${reportData.customerRetentionDetails.churnReduction} reduction in customer churn
     (Enhanced by the ${reportData.selectedPackage.name} package)
   - Average customer value: ${formatCurrency(reportData.customerRetentionDetails.avgCustomerValue)}
   - Average customer lifespan: ${reportData.customerRetentionDetails.avgCustomerLifespan} years
   - Estimated customer base: ${reportData.companyInfo.estimatedCustomers}

TOTAL ANNUAL BENEFIT: ${formatCurrency(reportData.results.totalBenefit)}
PROJECTED ROI: ${Math.round(reportData.results.roi)}%
PAYBACK PERIOD: ${Math.round(reportData.results.paybackPeriod * 10) / 10} months

3-YEAR PROJECTION WITH CONTINUOUS GROWTH
--------------------------------------
Year 1 (Implementation and initial adoption):
- Total Benefit: ${formatCurrency(reportData.yearlyBreakdown[0].totalBenefit)}
- ROI: ${Math.round(reportData.yearlyBreakdown[0].roi)}%

Year 2 (Full adoption and optimization):
- Total Benefit: ${formatCurrency(reportData.yearlyBreakdown[1].totalBenefit)}
- ROI: ${Math.round(reportData.yearlyBreakdown[1].roi)}%
- Note: Year 2 excludes one-time implementation and training costs

Year 3 (Continued growth and expansion):
- Total Benefit: ${formatCurrency(reportData.yearlyBreakdown[2].totalBenefit)}
- ROI: ${Math.round(reportData.yearlyBreakdown[2].roi)}%
- Note: Year 3 reflects continued optimization and expansion of AI capabilities

IMPLEMENTATION METHODOLOGY
------------------------
Our ROI calculations are based on a proven model developed from analyzing 
real-world AI implementations across various industries and company sizes. 
The model incorporates:

1. Package-Specific Adoption Timeline: The ${reportData.selectedPackage.name} package includes
   a ${reportData.selectedPackage.implementationTimeWeeks}-week implementation plan with dedicated resources.

2. Efficiency Multipliers: The ${reportData.selectedPackage.name} package provides a 
   ${reportData.selectedPackage.efficiencyMultiplier}x efficiency multiplier compared to standard implementations.

3. Accelerated Adoption: Our implementation methodology accelerates adoption by
   ${reportData.selectedPackage.adoptionSpeed}x, allowing you to realize benefits faster.

4. Comprehensive Cost Structure: Includes implementation, subscription, and training costs
   tailored to your organization size and needs.

5. Company-Specific Adjustments: Tailored estimates based on your company size, 
   industry, and operational profile.

TAILORED RECOMMENDATIONS
----------------------
${reportData.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

IMPLEMENTATION RISKS
------------------
${reportData.risks.map((risk, index) => `${index + 1}. ${risk}`).join('\n')}

SUCCESS FACTORS
-------------
${reportData.successFactors.map((factor, index) => `${index + 1}. ${factor}`).join('\n')}

NEXT STEPS
---------
1. Schedule a detailed assessment to validate these projections against your specific workflows
2. Develop a phased implementation plan with clear milestones and success metrics
3. Identify internal champions and establish a governance structure for the AI initiative
4. Create a change management plan to address potential adoption challenges

DISCLAIMERS
----------
• This analysis provides estimates based on industry benchmarks and the selected package
• Actual results will vary based on implementation quality, user adoption, and market conditions
• The ROI timeline assumes proper change management and user training
• This report is not a guarantee of results but a data-driven projection to guide decision-making
• We recommend revisiting these projections quarterly during implementation

=======================================================================
                          CONFIDENTIAL
         For internal planning and evaluation purposes only
=======================================================================
`;
      
      // Create a Blob with the report content
      const blob = new Blob([reportContent], { type: 'text/plain' });
      
      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_ROI_Analysis_${reportData.selectedPackage.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Show success message
      showSuccessMessage('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('There was an error generating your report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
      setShowFormatOptions(false);
    }
  };

  const downloadPdfReport = async () => {
    setIsGeneratingReport(true);
    const results = calculateROI();
    const reportData = generateReportData(results);
    
    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Load company logo
      const logoImg = document.createElement('img');
      logoImg.src = '/images/fasttrackai-logo.svg';
      
      // Wait for logo to load
      await new Promise<void>((resolve) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => {
          console.warn('Logo failed to load, continuing without it');
          resolve();
        };
      });
      
      // Add header with logo
      pdf.setFillColor(249, 250, 251); // Light gray background
      pdf.rect(0, 0, 210, 40, 'F');
      
      try {
        // Try to add the logo if it loaded successfully
        if (logoImg.complete) {
          pdf.addImage(logoImg, 'SVG', 10, 10, 50, 15);
        }
      } catch (logoError) {
        console.warn('Error adding logo to PDF:', logoError);
        // Continue without the logo
      }
      
      // Add title and date
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(147, 51, 234); // Purple
      pdf.setFontSize(20);
      pdf.text('ROI Analysis Report', 70, 20);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(107, 114, 128); // Gray
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${reportData.date}`, 70, 30);
      
      // Add decorative line
      pdf.setDrawColor(147, 51, 234); // Purple
      pdf.setLineWidth(0.5);
      pdf.line(10, 45, 200, 45);
      
      // Executive Summary
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Executive Summary', 10, 55);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      const summary = `Based on your business profile and the selected ${reportData.selectedPackage.name} package, 
we project a ${Math.round(reportData.results.roi)}% return on investment within 
the first year. This translates to a potential annual benefit of 
${formatCurrency(reportData.results.totalBenefit)} against a total first-year investment 
of ${formatCurrency(reportData.costs.annualCost)}.`;
      
      const summaryLines = pdf.splitTextToSize(summary, 180);
      pdf.text(summaryLines, 15, 65);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Estimated Payback Period: ${Math.round(reportData.results.paybackPeriod * 10) / 10} months`, 15, 75);
      
      // Company Information Section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Company Information & Analysis', 10, 85);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      pdf.text(`Annual Revenue: ${formatCurrency(reportData.companyInfo.revenue)}`, 15, 95);
      pdf.text(`Number of Employees: ${reportData.companyInfo.employees}`, 15, 100);
      pdf.text(`Weekly Customer Service Hours: ${reportData.companyInfo.customerServiceHours} hours`, 15, 105);
      pdf.text(`Weekly Data Processing Hours: ${reportData.companyInfo.dataProcessingHours} hours`, 15, 110);
      pdf.text(`Average Hourly Rate: ${formatCurrency(reportData.companyInfo.averageHourlyRate)}`, 15, 115);
      
      pdf.setFont('helvetica', 'italic');
      pdf.text('Business Profile Analysis:', 15, 125);
      pdf.setFont('helvetica', 'normal');
      
      const profileAnalysis = `Your organization operates with a revenue-to-employee ratio of ${formatCurrency(reportData.companyInfo.revenue / reportData.companyInfo.employees)} per employee. 
Your team currently dedicates ${reportData.companyInfo.customerServiceHours + reportData.companyInfo.dataProcessingHours} total hours weekly to 
customer service and data processing tasks, representing approximately 
${Math.round(((reportData.companyInfo.customerServiceHours + reportData.companyInfo.dataProcessingHours) / (reportData.companyInfo.employees * 40)) * 100)}% 
of your workforce's capacity. Based on this profile, you are classified as a 
${reportData.companyInfo.companySizeCategory}-sized company in the ${reportData.companyInfo.industryType} sector.`;
      
      const profileLines = pdf.splitTextToSize(profileAnalysis, 180);
      pdf.text(profileLines, 15, 130);
      
      // Add new page for Projected Returns
      pdf.addPage();
      
      // Projected Returns Section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Projected Returns (Detailed Breakdown)', 10, 20);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      pdf.text(`1. Annual Automation Savings: ${formatCurrency(reportData.results.automationSavings)}`, 15, 30);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`- Based on a realistic adoption curve over 12 months:`, 20, 35);
      pdf.text(`  * ${reportData.automationAdoption.setup}`, 20, 40);
      pdf.text(`  * ${reportData.automationAdoption.initial}`, 20, 45);
      pdf.text(`  * ${reportData.automationAdoption.growing}`, 20, 50);
      pdf.text(`  * ${reportData.automationAdoption.mature}`, 20, 55);
      pdf.text(`- The ${reportData.selectedPackage.name} package accelerates adoption by ${reportData.selectedPackage.adoptionSpeed}x and 
      increases efficiency gains by ${reportData.selectedPackage.efficiencyMultiplier}x`, 20, 60);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(`2. Productivity Gains: ${formatCurrency(reportData.results.productivityGain)}`, 15, 65);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`- Direct cost reduction from efficiency: ${formatCurrency(reportData.productivityBreakdown.directGains)}`, 20, 70);
      pdf.text(`- Error reduction savings: ${formatCurrency(reportData.productivityBreakdown.errorReduction)}`, 20, 75);
      pdf.text(`- Revenue lift from increased throughput: ${formatCurrency(reportData.productivityBreakdown.revenueLift)}`, 20, 80);
      pdf.text(`- Enhanced by the ${reportData.selectedPackage.name} package for optimal results`, 20, 85);
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(`3. Customer Retention Value: ${formatCurrency(reportData.results.customerRetention)}`, 15, 95);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`- Based on a ${reportData.customerRetentionDetails.churnReduction} reduction in customer churn`, 20, 100);
      pdf.text(`- Average customer value: ${formatCurrency(reportData.customerRetentionDetails.avgCustomerValue)}`, 20, 105);
      pdf.text(`- Average customer lifespan: ${reportData.customerRetentionDetails.avgCustomerLifespan} years`, 20, 110);
      pdf.text(`- Estimated customer base: ${reportData.companyInfo.estimatedCustomers}`, 20, 115);
      
      // Highlight total benefit and ROI
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(147, 51, 234); // Purple
      pdf.setFontSize(11);
      pdf.text(`Total Annual Benefit: ${formatCurrency(reportData.results.totalBenefit)}`, 15, 125);
      pdf.text(`Projected ROI: ${Math.round(reportData.results.roi)}%`, 15, 130);
      pdf.text(`Payback Period: ${Math.round(reportData.results.paybackPeriod * 10) / 10} months`, 15, 135);
      
      // 3-Year Projection Section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('3-Year Projection with Diminishing Returns', 10, 150);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      
      // Year 1
      pdf.setFont('helvetica', 'bold');
      pdf.text('Year 1 (Implementation and initial adoption):', 15, 160);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`- Total Benefit: ${formatCurrency(reportData.yearlyBreakdown[0].totalBenefit)}`, 20, 165);
      pdf.text(`- ROI: ${Math.round(reportData.yearlyBreakdown[0].roi)}%`, 20, 170);
      
      // Year 2
      pdf.setFont('helvetica', 'bold');
      pdf.text('Year 2 (Full adoption and optimization):', 15, 180);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`- Total Benefit: ${formatCurrency(reportData.yearlyBreakdown[1].totalBenefit)}`, 20, 185);
      pdf.text(`- ROI: ${Math.round(reportData.yearlyBreakdown[1].roi)}%`, 20, 190);
      
      // Year 3
      pdf.setFont('helvetica', 'bold');
      pdf.text('Year 3 (Continued growth and expansion):', 15, 200);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`- Total Benefit: ${formatCurrency(reportData.yearlyBreakdown[2].totalBenefit)}`, 20, 205);
      pdf.text(`- ROI: ${Math.round(reportData.yearlyBreakdown[2].roi)}%`, 20, 210);
      
      // Implementation Costs Section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Implementation Costs', 10, 225);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      pdf.text(`Implementation Cost: ${formatCurrency(reportData.costs.implementationCost)}`, 15, 235);
      pdf.text(`Monthly Subscription: ${formatCurrency(reportData.costs.monthlySubscription)}`, 15, 240);
      pdf.text(`Training Cost: ${formatCurrency(reportData.costs.trainingCost)}`, 15, 245);
      pdf.text(`Total First-Year Cost: ${formatCurrency(reportData.costs.annualCost)}`, 15, 250);
      
      // Add charts
      if (pieChartRef.current && barChartRef.current && yearlyChartRef.current) {
        // Add new page for charts
        pdf.addPage();
        
        // Add charts title
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(31, 41, 55); // Dark gray
        pdf.setFontSize(14);
        pdf.text('ROI Visualization', 10, 20);
        
        // Capture pie chart
        const pieChartCanvas = await html2canvas(pieChartRef.current);
        const pieChartImgData = pieChartCanvas.toDataURL('image/png');
        pdf.addImage(pieChartImgData, 'PNG', 10, 30, 90, 60);
        
        // Capture bar chart
        const barChartCanvas = await html2canvas(barChartRef.current);
        const barChartImgData = barChartCanvas.toDataURL('image/png');
        pdf.addImage(barChartImgData, 'PNG', 110, 30, 90, 60);
        
        // Add chart descriptions
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(55, 65, 81); // Medium gray
        pdf.setFontSize(9);
        pdf.text('ROI Breakdown: Visual representation of the three main value drivers', 10, 95);
        pdf.text('Revenue Impact: Comparison of current revenue vs. projected revenue with AI implementation', 110, 95);
        
        // Capture yearly breakdown chart
        const yearlyChartCanvas = await html2canvas(yearlyChartRef.current);
        const yearlyChartImgData = yearlyChartCanvas.toDataURL('image/png');
        pdf.addImage(yearlyChartImgData, 'PNG', 10, 105, 190, 80);
        
        // Add chart description
        pdf.text('3-Year Projection: Shows the evolution of benefits and ROI over time, including diminishing returns', 10, 190);
      }
      
      // Add methodology page
      pdf.addPage();
      
      // Methodology Section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Methodology', 10, 20);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      
      const methodology = `Our ROI calculations are based on a proven model developed from analyzing 
real-world AI implementations across various industries and company sizes. 
The model incorporates:

1. Package-Specific Adoption Timeline: The ${reportData.selectedPackage.name} package includes
   a ${reportData.selectedPackage.implementationTimeWeeks}-week implementation plan with dedicated resources.

2. Efficiency Multipliers: The ${reportData.selectedPackage.name} package provides a 
   ${reportData.selectedPackage.efficiencyMultiplier}x efficiency multiplier compared to standard implementations.

3. Accelerated Adoption: Our implementation methodology accelerates adoption by
   ${reportData.selectedPackage.adoptionSpeed}x, allowing you to realize benefits faster.

4. Comprehensive Cost Structure: Includes implementation, subscription, and training costs
   tailored to your organization size and needs.

5. Company-Specific Adjustments: Tailored estimates based on your company size, 
   industry, and operational profile.

The model applies conservative estimates and includes adjustment factors for company size, 
industry type, and current operational efficiency.`;
      
      const methodologyLines = pdf.splitTextToSize(methodology, 180);
      pdf.text(methodologyLines, 15, 30);
      
      // Recommendations Section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Recommendations', 10, 100);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      
      let yPos = 110;
      reportData.recommendations.forEach((rec, index) => {
        pdf.text(`${index + 1}. ${rec}`, 15, yPos);
        yPos += 10;
      });
      
      // Next Steps Section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Next Steps', 10, yPos + 10);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      
      const nextSteps = `1. Schedule a detailed assessment to validate these projections against your specific workflows
2. Develop a phased implementation plan with clear milestones and success metrics
3. Identify internal champions and establish a governance structure for the AI initiative
4. Create a change management plan to address potential adoption challenges`;
      
      const nextStepsLines = pdf.splitTextToSize(nextSteps, 180);
      pdf.text(nextStepsLines, 15, yPos + 20);
      
      pdf.text('Contact us at: contact@fasttrackai.com', 15, yPos + 35);
      pdf.text('Or schedule directly at: fasttrackai.com/schedule-consultation', 15, yPos + 45);
      
      // Add implementation risks section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Implementation Risks', 10, yPos + 65);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      
      let riskYPos = yPos + 75;
      reportData.risks.forEach((risk, index) => {
        pdf.text(`${index + 1}. ${risk}`, 15, riskYPos);
        riskYPos += 10;
      });
      
      // Success factors section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Success Factors', 10, riskYPos + 10);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(10);
      
      let factorYPos = riskYPos + 20;
      reportData.successFactors.forEach((factor, index) => {
        pdf.text(`${index + 1}. ${factor}`, 15, factorYPos);
        factorYPos += 10;
      });
      
      // Disclaimers Section
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(31, 41, 55); // Dark gray
      pdf.setFontSize(14);
      pdf.text('Disclaimers', 10, factorYPos + 10);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // Medium gray
      pdf.setFontSize(9);
      
      const disclaimers = `• This analysis provides estimates based on industry benchmarks and the selected package
• Actual results will vary based on implementation quality, user adoption, and market conditions
• The ROI timeline assumes proper change management and user training
• This report is not a guarantee of results but a data-driven projection to guide decision-making
• We recommend revisiting these projections quarterly during implementation`;
      
      const disclaimerLines = pdf.splitTextToSize(disclaimers, 180);
      pdf.text(disclaimerLines, 15, factorYPos + 20);
      
      // Add footer
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(107, 114, 128); // Gray
      pdf.setFontSize(8);
      pdf.text(`CONFIDENTIAL - For internal planning and evaluation purposes only`, 10, 280);
      
      // Add decorative elements
      pdf.setDrawColor(107, 114, 128); // Gray
      pdf.setLineWidth(0.3);
      pdf.line(10, 285, 200, 285);
      
      // Save the PDF
      pdf.save(`AI_ROI_Analysis_${reportData.selectedPackage.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      // Show success message
      showSuccessMessage('PDF report generated successfully. The file has been downloaded to your device.');
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('There was an error generating your PDF report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
      setShowFormatOptions(false);
    }
  };

  const showSuccessMessage = (message: string) => {
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successMessage.textContent = message;
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const results = calculateROI();
  const roiCalculation: ROICalculation = results;

  return (
    <main className="min-h-screen py-20 bg-gradient-to-b from-purple-900 to-black">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">AI Implementation ROI Calculator</h1>
            <p className="text-xl text-white">
              Generate a detailed assessment of potential returns from AI implementation with our optimized packages
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Business Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Revenue
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <input
                        type="number"
                        value={inputs.revenue}
                        onChange={(e) => setInputs(prev => ({ ...prev, revenue: Number(e.target.value) }))}
                        className="pl-10 w-full p-3 border border-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Employees
                    </label>
                    <input
                      type="number"
                      value={inputs.employees}
                      onChange={(e) => setInputs(prev => ({ ...prev, employees: Number(e.target.value) }))}
                      className="w-full p-3 border border-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weekly Customer Service Hours
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <input
                        type="number"
                        value={inputs.customerServiceHours}
                        onChange={(e) => setInputs(prev => ({ ...prev, customerServiceHours: Number(e.target.value) }))}
                        className="pl-10 w-full p-3 border border-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weekly Data Processing Hours
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <input
                        type="number"
                        value={inputs.dataProcessingHours}
                        onChange={(e) => setInputs(prev => ({ ...prev, dataProcessingHours: Number(e.target.value) }))}
                        className="pl-10 w-full p-3 border border-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Hourly Rate
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <input
                        type="number"
                        value={inputs.averageHourlyRate}
                        onChange={(e) => setInputs(prev => ({ ...prev, averageHourlyRate: Number(e.target.value) }))}
                        className="pl-10 w-full p-3 border border-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Package
                    </label>
                    <select
                      value={inputs.selectedPackage}
                      onChange={(e) => setInputs(prev => ({ ...prev, selectedPackage: e.target.value as 'grow' | 'optimize' | 'sell' }))}
                      className="w-full p-3 border border-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="grow">Priced to Grow</option>
                      <option value="optimize">Priced to Optimize</option>
                      <option value="sell">Priced to Sell</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-sm p-8"
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Projected Returns</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Annual Automation Savings</h3>
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5 text-purple-600" />
                      <span className="text-2xl font-bold text-gray-900">{formatCurrency(results.automationSavings)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Productivity Gains</h3>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span className="text-2xl font-bold text-gray-900">{formatCurrency(results.productivityGain)}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Customer Retention Value</h3>
                    <div className="flex items-center space-x-2">
                      <ChartBar className="h-5 w-5 text-purple-600" />
                      <span className="text-2xl font-bold text-gray-900">{formatCurrency(results.customerRetention)}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Total Annual Benefit</h3>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-6 w-6 text-green-600" />
                      <span className="text-3xl font-bold text-green-600">
                        {formatCurrency(results.totalBenefit)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Projected ROI</h3>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <span className="text-3xl font-bold text-green-600">
                        {Math.round(roiCalculation.roi)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Package</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-purple-600">
                        {packageDetails[inputs.selectedPackage].name}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Implementation: {Math.round(packageDetails[inputs.selectedPackage].implementationTimeMonths * 4.33)} weeks</p>
                      <p>Efficiency Multiplier: {packageDetails[inputs.selectedPackage].efficiencyMultiplier}x</p>
                      <p>Adoption Speed: {packageDetails[inputs.selectedPackage].adoptionSpeed}x</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => router.push('/schedule-consultation')}
                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Schedule Consultation
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowFormatOptions(!showFormatOptions)}
                      disabled={isGeneratingReport}
                      className="w-full border border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center"
                    >
                      {isGeneratingReport ? (
                        <>
                          <div className="animate-spin h-5 w-5 mr-2 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                          Generating Analysis...
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5 mr-2" />
                          Download Pragmatic ROI Analysis
                          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFormatOptions ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                    
                    {showFormatOptions && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <button
                          onClick={downloadPdfReport}
                          className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center"
                        >
                          <FileIcon className="h-5 w-5 mr-2 text-purple-600" />
                          <span>Comprehensive PDF Report with Charts</span>
                        </button>
                        <button
                          onClick={downloadTextReport}
                          className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center"
                        >
                          <FileText className="h-5 w-5 mr-2 text-purple-600" />
                          <span>Plain Text Analysis</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Package Features Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                {packageDetails[inputs.selectedPackage].name} Package Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packageDetails[inputs.selectedPackage].features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">ROI Visualization</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <canvas ref={pieChartRef} />
                </div>
                <div>
                  <canvas ref={barChartRef} />
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">3-Year Projection</h3>
                <canvas ref={yearlyChartRef} className="w-full h-64" />
                <p className="text-sm text-gray-500 mt-2">
                  This chart shows the evolution of benefits and ROI over time with the {packageDetails[inputs.selectedPackage].name} package, 
                  demonstrating continuous growth as AI capabilities expand within your organization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 