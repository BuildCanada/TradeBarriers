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
  "Canada",
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

export type Theme = string;

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
  jurisdiction_history: JurisdictionHistory[];
}

export interface JurisdictionHistory {
  status: JurisdictionStatus;
  date_entered: string;
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
  theme: Theme;
  agreement_history: AgreementHistory[];
}

export interface AgreementStats {
  total: number;
  uncommitted: number;
  inNegotiation: number;
  committed: number;
  implemented: number;
  deferred: number;
}

export type AgreementHistory = {
  status: AgreementStatus;
  date_entered: string;
};

// This is the data that is passed to the AgreementForm component used for AddAgreement and EditAgreement.
export interface AgreementFormData {
  title: string;
  summary: string;
  description: string;
  status: AgreementStatus;
  deadline: string;
  source_url: string;
  jurisdictions: Jurisdiction[];
  launch_date: string;
  theme: Theme;
  agreement_history: AgreementHistory[];
}
