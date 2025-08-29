export type AgreementStatus =
  | "Awaiting Sponsorship"
  | "Under Negotiation"
  | "Agreement Reached"
  | "Partially Implemented"
  | "Implemented";

export type JurisdictionStatusType =
  | "Unknown"
  | "Aware"
  | "Considering"
  | "Engaged"
  | "Committed"
  | "Implementing"
  | "Complete"
  | "Declined"
  | "Not Applicable";

export interface JurisdictionStatus {
  name: string;
  status: JurisdictionStatusType;
  notes: string;
}

export interface Agreement {
  id: string;
  title: string;
  summary: string;
  description: string;
  jurisdictions: JurisdictionStatus[];
  deadline: string | null;
  status: AgreementStatus;
  sourceUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgreementStats {
  total: number;
  uncommitted: number;
  inNegotiation: number;
  committed: number;
  implemented: number;
}
