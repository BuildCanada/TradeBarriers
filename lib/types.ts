export const AGREEMENT_STATUSES = [
  "Deferred",
  "Awaiting Sponsorship",
  "Under Negotiation",
  "Agreement Reached",
  "Partially Implemented",
  "Implemented",
] as const;
export type AgreementStatus = (typeof AGREEMENT_STATUSES)[number];

export const DEADLINE_TYPES = [
  "Overdue",
  "Due Soon (30 days)",
  "On Track",
  "No Deadline",
] as const;
export type DeadlineType = (typeof DEADLINE_TYPES)[number];

export const JURISDICTIONS = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Northwest Territories",
  "Nova Scotia",
  "Nunavut",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Yukon",
];

export type JurisdictionStatus =
  | "Unknown"
  | "Aware"
  | "Considering"
  | "Engaged"
  | "Committed"
  | "Implementing"
  | "Complete"
  | "Declined"
  | "Not Applicable";

export interface Jurisdiction {
  name: string;
  status: JurisdictionStatus;
  notes: string;
}

export interface Agreement {
  id: string;
  title: string;
  summary: string;
  description: string;
  jurisdictions: Jurisdiction[];
  deadline: string | null;
  status: AgreementStatus;
  source_url: string | null;
  created_at: string;
  updated_at: string;
  launch_date: string | null;
}

export interface AgreementStats {
  total: number;
  uncommitted: number;
  inNegotiation: number;
  committed: number;
  implemented: number;
  deferred: number;
}
