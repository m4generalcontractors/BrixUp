/** ZeroClaw agent registry — maps slugs to ports and metadata */

export interface AgentConfig {
  slug: string;
  name: string;
  port: number;
  department: string;
  slackChannel: string;
  description: string;
}

export const AGENT_REGISTRY: AgentConfig[] = [
  {
    slug: "ops-commander",
    name: "OPS Commander",
    port: 3001,
    department: "Operations",
    slackChannel: "#ops-commander",
    description: "Central orchestrator for all M4 department agents",
  },
  {
    slug: "marketing-command",
    name: "Marketing Command",
    port: 3002,
    department: "Marketing",
    slackChannel: "#dept-marketing",
    description: "Social media, ad campaigns, listings, and analytics",
  },
  {
    slug: "sales-command",
    name: "Sales Command",
    port: 3003,
    department: "Sales",
    slackChannel: "#dept-sales",
    description: "Lead management, pipeline tracking, and client communications",
  },
  {
    slug: "estimating-command",
    name: "Estimating Command",
    port: 3004,
    department: "Estimating",
    slackChannel: "#dept-estimating",
    description: "Quantity takeoffs, cost analysis, and proposal generation",
  },
  {
    slug: "precon-command",
    name: "Preconstruction Command",
    port: 3005,
    department: "Preconstruction",
    slackChannel: "#dept-preconstruction",
    description: "Bid solicitation, leveling, and subcontract management",
  },
  {
    slug: "pm-command",
    name: "PM Command",
    port: 3006,
    department: "Project Management",
    slackChannel: "#dept-pm",
    description: "Schedule, daily logs, budget tracking, and draw requests",
  },
  {
    slug: "accounting-command",
    name: "Accounting Command",
    port: 3007,
    department: "Accounting",
    slackChannel: "#dept-accounting",
    description: "Transactions, invoicing, and financial reporting",
  },
  {
    slug: "document-command",
    name: "Document Command",
    port: 3008,
    department: "Documents",
    slackChannel: "#dept-documents",
    description: "File management, drawing control, and photo organization",
  },
  {
    slug: "permit-command",
    name: "Permit Command",
    port: 3009,
    department: "Permits",
    slackChannel: "#dept-permits",
    description: "Permit applications, inspections, and compliance tracking",
  },
  {
    slug: "hr-command",
    name: "HR Command",
    port: 3010,
    department: "Human Resources",
    slackChannel: "#dept-hr",
    description: "Recruiting, crew scheduling, and workforce management",
  },
  {
    slug: "investor-command",
    name: "Investor Command",
    port: 3011,
    department: "Investor Relations",
    slackChannel: "#dept-investor",
    description: "Capital raising, portfolio reporting, and distributions",
  },
];

export const AGENT_PORT_MAP: Record<string, number> = Object.fromEntries(
  AGENT_REGISTRY.map((a) => [a.slug, a.port]),
);

export function getAgentConfig(slug: string): AgentConfig | undefined {
  return AGENT_REGISTRY.find((a) => a.slug === slug);
}

export function getAgentBaseUrl(slug: string): string | null {
  const config = getAgentConfig(slug);
  if (!config) return null;
  const host = process.env.ZEROCLAW_HOST ?? "127.0.0.1";
  return `http://${host}:${config.port}`;
}
