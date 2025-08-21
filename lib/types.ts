export type CommitmentStatus =
    | "Awaiting Sponsorship"
    | "Under Negotiation"
    | "Agreement Reached"
    | "Partially Implemented"
    | "Implemented"

export type JurisdictionStatusType =
    | "Unknown"
    | "Aware"
    | "Considering"
    | "Engaged"
    | "Committed"
    | "Implementing"
    | "Complete"
    | "Declined"
    | "Not Applicable"

export interface JurisdictionStatus {
    name: string
    status: JurisdictionStatusType
    notes: string
}

export interface Commitment {
    id: string
    title: string
    summary: string
    description: string
    jurisdictions: string[]
    jurisdictionStatuses?: JurisdictionStatus[]
    deadline: string | null
    status: CommitmentStatus
    sourceUrl: string | null
    createdAt: string
    updatedAt: string
}

export interface CommitmentStats {
    total: number
    uncommitted: number
    inNegotiation: number
    committed: number
    implemented: number
}
