/**
 * BrixUp Deal Data Layer
 *
 * This module defines the deal data model and provides sample deals
 * for the marketplace. In production, deals are sourced from:
 * - Direct submissions by wholesalers/agents on BrixUp
 * - InvestorLift API integration (wholesale deal feed)
 * - PropStream API (property data enrichment)
 * - BatchLeads API (off-market leads)
 * - Privy API (skip tracing and owner data)
 * - MLS IDX feed (on-market listings)
 *
 * API keys are configured in .env — see web/.env.example
 */

export interface Deal {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType: "Flip" | "New Build" | "Value-Add" | "Wholesale" | "Land";
  status: "Open" | "Funding" | "Funded" | "Active" | "Completed";
  source: "BrixUp" | "InvestorLift" | "PropStream" | "Direct" | "MLS";

  // Financial
  askingPrice: number;
  rehabBudget: number;
  arv: number;
  totalCapitalNeeded: number;
  fundedAmount: number;
  projectedROI: number;
  projectedTimeline: string; // e.g. "6 months"
  investorInterestRate: number; // annualized, e.g. 10 for 10%

  // Property Details
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  lotSize: string;
  description: string;

  // Deal Team
  dealmaker: { name: string; brixScore: number };
  gc: { name: string; brixScore: number } | null;

  // Metadata
  listedDate: string;
  fundingDeadline: string;
  estCompletion: string;
  investorCount: number;
  minInvestment: number;
  photos: string[]; // placeholder URLs

  // Pro Forma
  proForma: {
    purchasePrice: number;
    closingCosts: number;
    rehabBudget: number;
    holdingCosts: number;
    totalCost: number;
    arv: number;
    sellingCosts: number;
    projectedProfit: number;
    roi: number;
  };

  // Draw Schedule
  drawSchedule: {
    milestone: string;
    amount: number;
    status: "Completed" | "In Progress" | "Pending";
    date: string;
  }[];

  // Trades Needed (for builder matching)
  tradesNeeded: {
    trade: string;
    brixRate: number;
    timeline: string;
    filled: boolean;
  }[];
}

/**
 * Sample deals — represents the kind of data that would come from
 * InvestorLift, PropStream, or direct wholesaler submissions.
 */
export const sampleDeals: Deal[] = [
  {
    id: "deal-001",
    address: "1847 Oakwood Dr",
    city: "Charlotte",
    state: "NC",
    zip: "28205",
    propertyType: "Flip",
    status: "Active",
    source: "BrixUp",
    askingPrice: 165000,
    rehabBudget: 85000,
    arv: 310000,
    totalCapitalNeeded: 285000,
    fundedAmount: 285000,
    projectedROI: 22,
    projectedTimeline: "6 months",
    investorInterestRate: 10,
    beds: 3,
    baths: 2,
    sqft: 1850,
    yearBuilt: 1978,
    lotSize: "0.28 acres",
    description:
      "Classic NoDa area ranch needing full cosmetic rehab. New roof 2023. Strong comps support $310K ARV. Ideal flip with solid margins in one of Charlotte's hottest neighborhoods.",
    dealmaker: { name: "Carlos Reyes", brixScore: 920 },
    gc: { name: "Miguel H. Peña (M4 GC)", brixScore: 950 },
    listedDate: "Jan 5, 2026",
    fundingDeadline: "Feb 15, 2026",
    estCompletion: "Jul 2026",
    investorCount: 8,
    minInvestment: 500,
    photos: [],
    proForma: {
      purchasePrice: 165000,
      closingCosts: 8250,
      rehabBudget: 85000,
      holdingCosts: 12000,
      totalCost: 270250,
      arv: 310000,
      sellingCosts: 18600,
      projectedProfit: 21150,
      roi: 22,
    },
    drawSchedule: [
      { milestone: "Foundation & Demo", amount: 17000, status: "Completed", date: "Feb 1, 2026" },
      { milestone: "Framing & Structural", amount: 21250, status: "Completed", date: "Feb 20, 2026" },
      { milestone: "MEP Rough-In", amount: 21250, status: "In Progress", date: "Mar 15, 2026" },
      { milestone: "Finishes & Interior", amount: 17000, status: "Pending", date: "Apr 15, 2026" },
      { milestone: "Final / Certificate of Occupancy", amount: 8500, status: "Pending", date: "May 15, 2026" },
    ],
    tradesNeeded: [
      { trade: "Electrical", brixRate: 3200, timeline: "2 weeks", filled: true },
      { trade: "Plumbing", brixRate: 2800, timeline: "2 weeks", filled: true },
      { trade: "HVAC", brixRate: 4500, timeline: "1 week", filled: false },
      { trade: "Drywall", brixRate: 2200, timeline: "1 week", filled: false },
      { trade: "Painting", brixRate: 1800, timeline: "1 week", filled: false },
      { trade: "Flooring", brixRate: 2400, timeline: "1 week", filled: false },
    ],
  },
  {
    id: "deal-002",
    address: "412 Magnolia Ln",
    city: "Raleigh",
    state: "NC",
    zip: "27601",
    propertyType: "New Build",
    status: "Funding",
    source: "Direct",
    askingPrice: 95000,
    rehabBudget: 320000,
    arv: 580000,
    totalCapitalNeeded: 520000,
    fundedAmount: 223600,
    projectedROI: 28,
    projectedTimeline: "12 months",
    investorInterestRate: 12,
    beds: 4,
    baths: 3,
    sqft: 2400,
    yearBuilt: 2026,
    lotSize: "0.35 acres",
    description:
      "Vacant lot in fast-growing SE Raleigh corridor. Plans approved for 2,400 sqft 4BR/3BA new construction. Strong rental demand if held. Recent sales at $560-600K within 0.5 miles.",
    dealmaker: { name: "Amanda Torres", brixScore: 875 },
    gc: { name: "Miguel H. Peña (M4 GC)", brixScore: 950 },
    listedDate: "Jan 20, 2026",
    fundingDeadline: "Mar 15, 2026",
    estCompletion: "Mar 2027",
    investorCount: 5,
    minInvestment: 1000,
    photos: [],
    proForma: {
      purchasePrice: 95000,
      closingCosts: 4750,
      rehabBudget: 320000,
      holdingCosts: 36000,
      totalCost: 455750,
      arv: 580000,
      sellingCosts: 34800,
      projectedProfit: 89450,
      roi: 28,
    },
    drawSchedule: [
      { milestone: "Site Prep & Foundation", amount: 64000, status: "Pending", date: "Apr 2026" },
      { milestone: "Framing & Roofing", amount: 80000, status: "Pending", date: "Jun 2026" },
      { milestone: "MEP Rough-In", amount: 64000, status: "Pending", date: "Aug 2026" },
      { milestone: "Interior Finishes", amount: 80000, status: "Pending", date: "Nov 2026" },
      { milestone: "Final Punch & CO", amount: 32000, status: "Pending", date: "Feb 2027" },
    ],
    tradesNeeded: [
      { trade: "Concrete", brixRate: 8500, timeline: "3 weeks", filled: false },
      { trade: "Framing", brixRate: 12000, timeline: "4 weeks", filled: false },
      { trade: "Electrical", brixRate: 6500, timeline: "3 weeks", filled: false },
      { trade: "Plumbing", brixRate: 5800, timeline: "3 weeks", filled: false },
      { trade: "HVAC", brixRate: 7200, timeline: "2 weeks", filled: false },
      { trade: "Roofing", brixRate: 4800, timeline: "1 week", filled: false },
    ],
  },
  {
    id: "deal-003",
    address: "903 Pine Valley Rd",
    city: "Greenville",
    state: "SC",
    zip: "29605",
    propertyType: "Value-Add",
    status: "Active",
    source: "InvestorLift",
    askingPrice: 125000,
    rehabBudget: 35000,
    arv: 195000,
    totalCapitalNeeded: 175000,
    fundedAmount: 155750,
    projectedROI: 16,
    projectedTimeline: "4 months",
    investorInterestRate: 8,
    beds: 3,
    baths: 1.5,
    sqft: 1400,
    yearBuilt: 1965,
    lotSize: "0.18 acres",
    description:
      "Light value-add opportunity in established Greenville neighborhood. Needs cosmetic updates: kitchen, bathrooms, paint, flooring. Solid bones, good roof, updated HVAC. Quick turnaround deal.",
    dealmaker: { name: "Derek Johnson", brixScore: 810 },
    gc: { name: "Ray Williams", brixScore: 780 },
    listedDate: "Jan 10, 2026",
    fundingDeadline: "Feb 1, 2026",
    estCompletion: "May 2026",
    investorCount: 12,
    minInvestment: 500,
    photos: [],
    proForma: {
      purchasePrice: 125000,
      closingCosts: 6250,
      rehabBudget: 35000,
      holdingCosts: 6000,
      totalCost: 172250,
      arv: 195000,
      sellingCosts: 11700,
      projectedProfit: 11050,
      roi: 16,
    },
    drawSchedule: [
      { milestone: "Demo & Prep", amount: 7000, status: "Completed", date: "Feb 5, 2026" },
      { milestone: "Kitchen & Bath", amount: 14000, status: "In Progress", date: "Feb 25, 2026" },
      { milestone: "Paint & Flooring", amount: 10500, status: "Pending", date: "Mar 15, 2026" },
      { milestone: "Final Punch", amount: 3500, status: "Pending", date: "Apr 1, 2026" },
    ],
    tradesNeeded: [
      { trade: "Plumbing", brixRate: 2100, timeline: "1 week", filled: true },
      { trade: "Tile", brixRate: 1800, timeline: "1 week", filled: true },
      { trade: "Painting", brixRate: 1500, timeline: "1 week", filled: false },
      { trade: "Flooring", brixRate: 2000, timeline: "1 week", filled: false },
    ],
  },
  {
    id: "deal-004",
    address: "2215 Bayshore Blvd",
    city: "Tampa",
    state: "FL",
    zip: "33611",
    propertyType: "Flip",
    status: "Funding",
    source: "PropStream",
    askingPrice: 225000,
    rehabBudget: 95000,
    arv: 410000,
    totalCapitalNeeded: 340000,
    fundedAmount: 176800,
    projectedROI: 25,
    projectedTimeline: "8 months",
    investorInterestRate: 10,
    beds: 4,
    baths: 2.5,
    sqft: 2100,
    yearBuilt: 1982,
    lotSize: "0.22 acres",
    description:
      "South Tampa flip in prime location near Bayshore. Needs full gut renovation. Huge upside — neighboring homes selling $400-450K. Pool potential adds $20-30K to ARV.",
    dealmaker: { name: "Maria Santos", brixScore: 890 },
    gc: null,
    listedDate: "Feb 1, 2026",
    fundingDeadline: "Mar 10, 2026",
    estCompletion: "Oct 2026",
    investorCount: 6,
    minInvestment: 500,
    photos: [],
    proForma: {
      purchasePrice: 225000,
      closingCosts: 11250,
      rehabBudget: 95000,
      holdingCosts: 18000,
      totalCost: 349250,
      arv: 410000,
      sellingCosts: 24600,
      projectedProfit: 36150,
      roi: 25,
    },
    drawSchedule: [
      { milestone: "Demo & Foundation", amount: 19000, status: "Pending", date: "Apr 2026" },
      { milestone: "Framing & Structural", amount: 23750, status: "Pending", date: "May 2026" },
      { milestone: "MEP Rough-In", amount: 23750, status: "Pending", date: "Jun 2026" },
      { milestone: "Finishes", amount: 19000, status: "Pending", date: "Aug 2026" },
      { milestone: "Final / CO", amount: 9500, status: "Pending", date: "Sep 2026" },
    ],
    tradesNeeded: [
      { trade: "General Labor", brixRate: 2500, timeline: "2 weeks", filled: false },
      { trade: "Electrical", brixRate: 5200, timeline: "3 weeks", filled: false },
      { trade: "Plumbing", brixRate: 4800, timeline: "3 weeks", filled: false },
      { trade: "HVAC", brixRate: 6000, timeline: "2 weeks", filled: false },
      { trade: "Drywall", brixRate: 3200, timeline: "2 weeks", filled: false },
      { trade: "Painting", brixRate: 2800, timeline: "2 weeks", filled: false },
    ],
  },
  {
    id: "deal-005",
    address: "567 Elm Creek Way",
    city: "Charlotte",
    state: "NC",
    zip: "28216",
    propertyType: "New Build",
    status: "Funding",
    source: "BrixUp",
    askingPrice: 80000,
    rehabBudget: 280000,
    arv: 510000,
    totalCapitalNeeded: 450000,
    fundedAmount: 139500,
    projectedROI: 30,
    projectedTimeline: "14 months",
    investorInterestRate: 12,
    beds: 4,
    baths: 3.5,
    sqft: 2800,
    yearBuilt: 2026,
    lotSize: "0.42 acres",
    description:
      "Premium lot in West Charlotte growth corridor. Approved plans for 2,800 sqft modern farmhouse. Walking distance to new light rail station. Strong pre-sale interest from buyers.",
    dealmaker: { name: "Miguel H. Peña", brixScore: 950 },
    gc: { name: "Miguel H. Peña (M4 GC)", brixScore: 950 },
    listedDate: "Feb 5, 2026",
    fundingDeadline: "Apr 1, 2026",
    estCompletion: "Apr 2027",
    investorCount: 3,
    minInvestment: 2000,
    photos: [],
    proForma: {
      purchasePrice: 80000,
      closingCosts: 4000,
      rehabBudget: 280000,
      holdingCosts: 42000,
      totalCost: 406000,
      arv: 510000,
      sellingCosts: 30600,
      projectedProfit: 73400,
      roi: 30,
    },
    drawSchedule: [
      { milestone: "Site Prep & Foundation", amount: 56000, status: "Pending", date: "May 2026" },
      { milestone: "Framing & Roof", amount: 70000, status: "Pending", date: "Jul 2026" },
      { milestone: "MEP Rough-In", amount: 56000, status: "Pending", date: "Sep 2026" },
      { milestone: "Interior Finishes", amount: 70000, status: "Pending", date: "Dec 2026" },
      { milestone: "Final / CO", amount: 28000, status: "Pending", date: "Mar 2027" },
    ],
    tradesNeeded: [
      { trade: "Concrete", brixRate: 9500, timeline: "3 weeks", filled: false },
      { trade: "Framing", brixRate: 15000, timeline: "5 weeks", filled: false },
      { trade: "Electrical", brixRate: 8500, timeline: "4 weeks", filled: false },
      { trade: "Plumbing", brixRate: 7200, timeline: "3 weeks", filled: false },
      { trade: "HVAC", brixRate: 8800, timeline: "2 weeks", filled: false },
      { trade: "Roofing", brixRate: 6200, timeline: "1 week", filled: false },
    ],
  },
  {
    id: "deal-006",
    address: "1100 Riverside Ave",
    city: "Raleigh",
    state: "NC",
    zip: "27603",
    propertyType: "Value-Add",
    status: "Funding",
    source: "InvestorLift",
    askingPrice: 155000,
    rehabBudget: 42000,
    arv: 255000,
    totalCapitalNeeded: 210000,
    fundedAmount: 157500,
    projectedROI: 19,
    projectedTimeline: "5 months",
    investorInterestRate: 9,
    beds: 3,
    baths: 2,
    sqft: 1650,
    yearBuilt: 1972,
    lotSize: "0.25 acres",
    description:
      "Solid brick ranch in established Raleigh neighborhood near NC State. Cosmetic rehab — update kitchen, baths, flooring, fresh paint. Great rental potential if investor wants to hold.",
    dealmaker: { name: "James Park", brixScore: 845 },
    gc: { name: "Ray Williams", brixScore: 780 },
    listedDate: "Jan 28, 2026",
    fundingDeadline: "Feb 28, 2026",
    estCompletion: "Jun 2026",
    investorCount: 9,
    minInvestment: 500,
    photos: [],
    proForma: {
      purchasePrice: 155000,
      closingCosts: 7750,
      rehabBudget: 42000,
      holdingCosts: 8000,
      totalCost: 212750,
      arv: 255000,
      sellingCosts: 15300,
      projectedProfit: 26950,
      roi: 19,
    },
    drawSchedule: [
      { milestone: "Demo & Prep", amount: 8400, status: "Completed", date: "Feb 10, 2026" },
      { milestone: "Kitchen & Bath Reno", amount: 16800, status: "In Progress", date: "Mar 1, 2026" },
      { milestone: "Flooring & Paint", amount: 12600, status: "Pending", date: "Mar 20, 2026" },
      { milestone: "Final Punch", amount: 4200, status: "Pending", date: "Apr 5, 2026" },
    ],
    tradesNeeded: [
      { trade: "Plumbing", brixRate: 2400, timeline: "1 week", filled: true },
      { trade: "Tile", brixRate: 2100, timeline: "1 week", filled: true },
      { trade: "Painting", brixRate: 1800, timeline: "1 week", filled: false },
      { trade: "Flooring", brixRate: 2500, timeline: "1 week", filled: false },
    ],
  },
  {
    id: "deal-007",
    address: "3421 Blanche St",
    city: "Charlotte",
    state: "NC",
    zip: "28208",
    propertyType: "Flip",
    status: "Completed",
    source: "BrixUp",
    askingPrice: 140000,
    rehabBudget: 72000,
    arv: 275000,
    totalCapitalNeeded: 235000,
    fundedAmount: 235000,
    projectedROI: 24,
    projectedTimeline: "5 months",
    investorInterestRate: 10,
    beds: 3,
    baths: 2,
    sqft: 1600,
    yearBuilt: 1970,
    lotSize: "0.20 acres",
    description:
      "Successfully completed flip in West Charlotte. Full rehab: new kitchen, baths, HVAC, electrical panel, roof repair, fresh landscaping. Sold for $278K — above ARV estimate.",
    dealmaker: { name: "Carlos Reyes", brixScore: 920 },
    gc: { name: "Miguel H. Peña (M4 GC)", brixScore: 950 },
    listedDate: "Sep 1, 2025",
    fundingDeadline: "Oct 1, 2025",
    estCompletion: "Feb 2026",
    investorCount: 11,
    minInvestment: 500,
    photos: [],
    proForma: {
      purchasePrice: 140000,
      closingCosts: 7000,
      rehabBudget: 72000,
      holdingCosts: 10000,
      totalCost: 229000,
      arv: 275000,
      sellingCosts: 16500,
      projectedProfit: 29500,
      roi: 24,
    },
    drawSchedule: [
      { milestone: "Demo & Foundation", amount: 14400, status: "Completed", date: "Oct 15, 2025" },
      { milestone: "Framing & Structural", amount: 18000, status: "Completed", date: "Nov 5, 2025" },
      { milestone: "MEP Rough-In", amount: 18000, status: "Completed", date: "Nov 25, 2025" },
      { milestone: "Finishes", amount: 14400, status: "Completed", date: "Jan 10, 2026" },
      { milestone: "Final / CO", amount: 7200, status: "Completed", date: "Jan 30, 2026" },
    ],
    tradesNeeded: [],
  },
  {
    id: "deal-008",
    address: "445 Creekside Dr",
    city: "Fort Mill",
    state: "SC",
    zip: "29708",
    propertyType: "Land",
    status: "Open",
    source: "PropStream",
    askingPrice: 120000,
    rehabBudget: 350000,
    arv: 620000,
    totalCapitalNeeded: 500000,
    fundedAmount: 0,
    projectedROI: 27,
    projectedTimeline: "16 months",
    investorInterestRate: 12,
    beds: 5,
    baths: 3.5,
    sqft: 3200,
    yearBuilt: 2026,
    lotSize: "0.55 acres",
    description:
      "Half-acre lot in booming Fort Mill, SC — just across the border from Charlotte. Zoned residential. Approved for 3,200 sqft custom home. Lake Wylie area with premium school district. Massive growth area.",
    dealmaker: { name: "Miguel H. Peña", brixScore: 950 },
    gc: { name: "Miguel H. Peña (M4 GC)", brixScore: 950 },
    listedDate: "Feb 12, 2026",
    fundingDeadline: "Apr 15, 2026",
    estCompletion: "Jun 2027",
    investorCount: 0,
    minInvestment: 2500,
    photos: [],
    proForma: {
      purchasePrice: 120000,
      closingCosts: 6000,
      rehabBudget: 350000,
      holdingCosts: 48000,
      totalCost: 524000,
      arv: 620000,
      sellingCosts: 37200,
      projectedProfit: 58800,
      roi: 27,
    },
    drawSchedule: [
      { milestone: "Site Prep & Foundation", amount: 70000, status: "Pending", date: "May 2026" },
      { milestone: "Framing & Roof", amount: 87500, status: "Pending", date: "Jul 2026" },
      { milestone: "MEP Rough-In", amount: 70000, status: "Pending", date: "Oct 2026" },
      { milestone: "Interior Finishes", amount: 87500, status: "Pending", date: "Jan 2027" },
      { milestone: "Final / CO", amount: 35000, status: "Pending", date: "Apr 2027" },
    ],
    tradesNeeded: [
      { trade: "Excavation", brixRate: 8000, timeline: "2 weeks", filled: false },
      { trade: "Concrete", brixRate: 12000, timeline: "3 weeks", filled: false },
      { trade: "Framing", brixRate: 18000, timeline: "5 weeks", filled: false },
      { trade: "Electrical", brixRate: 9500, timeline: "4 weeks", filled: false },
      { trade: "Plumbing", brixRate: 8200, timeline: "3 weeks", filled: false },
      { trade: "HVAC", brixRate: 9800, timeline: "2 weeks", filled: false },
      { trade: "Roofing", brixRate: 7500, timeline: "1 week", filled: false },
    ],
  },
  {
    id: "deal-009",
    address: "2890 Market St",
    city: "Wilmington",
    state: "NC",
    zip: "28403",
    propertyType: "Value-Add",
    status: "Open",
    source: "InvestorLift",
    askingPrice: 185000,
    rehabBudget: 55000,
    arv: 310000,
    totalCapitalNeeded: 260000,
    fundedAmount: 0,
    projectedROI: 21,
    projectedTimeline: "6 months",
    investorInterestRate: 9,
    beds: 4,
    baths: 2,
    sqft: 1900,
    yearBuilt: 1985,
    lotSize: "0.30 acres",
    description:
      "Wilmington beach-area property with huge upside. Needs kitchen/bath refresh, new flooring, exterior paint. Strong Airbnb potential if held — beach rental income year-round.",
    dealmaker: { name: "Sarah Mitchell", brixScore: 830 },
    gc: null,
    listedDate: "Feb 13, 2026",
    fundingDeadline: "Mar 30, 2026",
    estCompletion: "Aug 2026",
    investorCount: 0,
    minInvestment: 500,
    photos: [],
    proForma: {
      purchasePrice: 185000,
      closingCosts: 9250,
      rehabBudget: 55000,
      holdingCosts: 12000,
      totalCost: 261250,
      arv: 310000,
      sellingCosts: 18600,
      projectedProfit: 30150,
      roi: 21,
    },
    drawSchedule: [
      { milestone: "Demo & Prep", amount: 11000, status: "Pending", date: "Apr 2026" },
      { milestone: "Kitchen & Bath", amount: 22000, status: "Pending", date: "May 2026" },
      { milestone: "Flooring & Paint", amount: 16500, status: "Pending", date: "Jun 2026" },
      { milestone: "Final Punch", amount: 5500, status: "Pending", date: "Jul 2026" },
    ],
    tradesNeeded: [
      { trade: "Plumbing", brixRate: 3200, timeline: "2 weeks", filled: false },
      { trade: "Tile", brixRate: 2800, timeline: "1 week", filled: false },
      { trade: "Painting", brixRate: 2200, timeline: "2 weeks", filled: false },
      { trade: "Flooring", brixRate: 3000, timeline: "1 week", filled: false },
    ],
  },
  {
    id: "deal-010",
    address: "1755 Industrial Blvd",
    city: "Charlotte",
    state: "NC",
    zip: "28206",
    propertyType: "Value-Add",
    status: "Open",
    source: "Direct",
    askingPrice: 380000,
    rehabBudget: 120000,
    arv: 680000,
    totalCapitalNeeded: 540000,
    fundedAmount: 0,
    projectedROI: 26,
    projectedTimeline: "10 months",
    investorInterestRate: 11,
    beds: 0,
    baths: 2,
    sqft: 4800,
    yearBuilt: 1995,
    lotSize: "0.75 acres",
    description:
      "Flex space conversion opportunity in NoDa/Plaza Midwood industrial corridor. Convert to mixed-use: coworking + 2 residential lofts upstairs. Zoning approved. Massive upside in Charlotte's hottest commercial corridor.",
    dealmaker: { name: "Miguel H. Peña", brixScore: 950 },
    gc: { name: "Miguel H. Peña (M4 GC)", brixScore: 950 },
    listedDate: "Feb 14, 2026",
    fundingDeadline: "Apr 30, 2026",
    estCompletion: "Dec 2026",
    investorCount: 0,
    minInvestment: 5000,
    photos: [],
    proForma: {
      purchasePrice: 380000,
      closingCosts: 19000,
      rehabBudget: 120000,
      holdingCosts: 25000,
      totalCost: 544000,
      arv: 680000,
      sellingCosts: 40800,
      projectedProfit: 95200,
      roi: 26,
    },
    drawSchedule: [
      { milestone: "Demo & Structural Assessment", amount: 24000, status: "Pending", date: "May 2026" },
      { milestone: "Structural & Framing", amount: 30000, status: "Pending", date: "Jun 2026" },
      { milestone: "MEP Systems", amount: 30000, status: "Pending", date: "Aug 2026" },
      { milestone: "Interior Build-Out", amount: 24000, status: "Pending", date: "Oct 2026" },
      { milestone: "Final / CO", amount: 12000, status: "Pending", date: "Nov 2026" },
    ],
    tradesNeeded: [
      { trade: "Structural Steel", brixRate: 14000, timeline: "3 weeks", filled: false },
      { trade: "Electrical (Commercial)", brixRate: 12000, timeline: "4 weeks", filled: false },
      { trade: "Plumbing", brixRate: 8500, timeline: "3 weeks", filled: false },
      { trade: "HVAC (Commercial)", brixRate: 11000, timeline: "3 weeks", filled: false },
      { trade: "Drywall", brixRate: 5500, timeline: "2 weeks", filled: false },
      { trade: "Flooring", brixRate: 6000, timeline: "2 weeks", filled: false },
    ],
  },
];

/**
 * Deal Source Integration Layer
 *
 * In production, these functions call external APIs to source deals.
 * Currently returns sample data. Replace with real API calls when
 * API keys are configured.
 *
 * Supported integrations:
 * - InvestorLift: POST https://api.investorlift.com/v1/properties
 * - PropStream: GET https://api.propstream.com/v1/properties
 * - BatchLeads: GET https://api.batchleads.io/v1/properties
 * - Privy: GET https://api.privyapp.com/v1/deals
 */

export function getDeals(filters?: {
  location?: string;
  propertyType?: string;
  minROI?: number;
  maxCapital?: number;
  status?: string;
  source?: string;
}): Deal[] {
  let deals = [...sampleDeals];

  if (filters?.location && filters.location !== "All") {
    deals = deals.filter(
      (d) => `${d.city}, ${d.state}` === filters.location
    );
  }
  if (filters?.propertyType && filters.propertyType !== "All") {
    deals = deals.filter((d) => d.propertyType === filters.propertyType);
  }
  if (filters?.minROI) {
    deals = deals.filter((d) => d.projectedROI >= filters.minROI!);
  }
  if (filters?.maxCapital) {
    deals = deals.filter(
      (d) => d.totalCapitalNeeded <= filters.maxCapital!
    );
  }
  if (filters?.status && filters.status !== "All") {
    deals = deals.filter((d) => d.status === filters.status);
  }
  if (filters?.source && filters.source !== "All") {
    deals = deals.filter((d) => d.source === filters.source);
  }

  return deals;
}

export function getDealById(id: string): Deal | undefined {
  return sampleDeals.find((d) => d.id === id);
}

export function getDealsBySource(source: Deal["source"]): Deal[] {
  return sampleDeals.filter((d) => d.source === source);
}

export function getOpenDeals(): Deal[] {
  return sampleDeals.filter(
    (d) => d.status === "Open" || d.status === "Funding"
  );
}

export function getActiveDeals(): Deal[] {
  return sampleDeals.filter((d) => d.status === "Active");
}

export function getCompletedDeals(): Deal[] {
  return sampleDeals.filter((d) => d.status === "Completed");
}
