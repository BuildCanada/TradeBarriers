import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Agreement,
  AgreementStatus,
  Jurisdiction,
  JURISDICTIONS,
  JurisdictionStatus,
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Status color mapping. Returns a string of tailwind classes.
export const getStatusColor = (status: AgreementStatus) => {
  switch (status) {
    case "Deferred":
      return "bg-red-100 text-bloomberg-red border-red-300";
    case "Awaiting Sponsorship":
      return "bg-gray-100 text-gray-600 border-gray-300";
    case "Under Negotiation":
      return "bg-yellow-100 text-yellow-400 border-yellow-300";
    case "Agreement Reached":
      return "bg-orange-100 text-orange-400 border-orange-300";
    case "Partially Implemented":
      return "bg-blue-100 text-blue-600 border-blue-300";
    case "Implemented":
      return "bg-green-100 text-green-600 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// Government status color mapping. Returns a string of tailwind classes.
export const getGovernmentStatusColor = (status: JurisdictionStatus) => {
  switch (status) {
    case "Unknown":
      return "bg-gray-100 text-gray-700 border-gray-300";
    case "Aware":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Considering":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "Engaged":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Committed":
      return "bg-green-50 text-green-700 border-green-200";
    case "Implementing":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Complete":
      return "bg-green-100 text-green-800 border-green-300";
    case "Declined":
      return "bg-red-50 text-red-700 border-red-200";
    case "Not Applicable":
      return "bg-gray-50 text-gray-600 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// Format the date (e.g. "Jan 1, 2025"). Returns a string.
export const formatDate = (dateString: string | null) => {
  if (!dateString) return "No date set";
  return new Date(dateString).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get the number of days until the deadline. Returns a number.
export const getDaysUntilDeadline = (deadline: string | null) => {
  if (!deadline) return null;
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Get the total number of agreements in each status. Returns an object.
export const getAgreementStats = (agreements: Agreement[]) => {
  return {
    total: agreements.length,
    awaitingSponsorship: agreements.filter(
      (c) => c.status === "Awaiting Sponsorship",
    ).length,
    underNegotiation: agreements.filter((c) => c.status === "Under Negotiation")
      .length,
    agreementReached: agreements.filter((c) => c.status === "Agreement Reached")
      .length,
    partiallyImplemented: agreements.filter(
      (c) => c.status === "Partially Implemented",
    ).length,
    implemented: agreements.filter((c) => c.status === "Implemented").length,
    deferred: agreements.filter((c) => c.status === "Deferred").length,
  };
};

// Determines if the jurisdiction is labeled as participating (for the badges). Returns a boolean.
export const checkIfParticipating = (jurisdictions: Jurisdiction[]) => {
  return jurisdictions.some(
    (jurisdiction) =>
      jurisdiction.status !== "Declined" &&
      jurisdiction.status !== "Not Applicable" &&
      jurisdiction.status !== "Unknown",
  );
};

// Gets the participating jurisdictions (for the badges). Returns an array of jurisdictions.
export const getParticipatingJurisdictions = (
  jurisdictions: Jurisdiction[],
) => {
  return jurisdictions.filter(
    (jurisdiction) =>
      jurisdiction.status !== "Declined" &&
      jurisdiction.status !== "Not Applicable" &&
      jurisdiction.status !== "Unknown",
  );
};

// Check if the deadline is overdue, unless the status is "Implemented" in which case it is "Completed". Returns a boolean.
export const checkIfOverdue = (
  deadline: string | null,
  status: AgreementStatus,
) => {
  const daysUntilDeadline = getDaysUntilDeadline(deadline);
  return (
    daysUntilDeadline !== null &&
    daysUntilDeadline < 0 &&
    status !== "Implemented"
  );
};

// Generates the jurisdictions with the default status of "Unknown". Returns an array of jurisdictions.
export const generateJurisdictions = () => {
  return JURISDICTIONS.map((jurisdiction) => ({
    name: jurisdiction,
    status: "Unknown" as JurisdictionStatus,
    notes: "",
  }));
};

// Extract unique themes from agreements
export const getUniqueThemes = (agreements: Agreement[]): string[] => {
  const themes = agreements
    .map((agreement) => agreement.theme)
    .filter(
      (theme): theme is string =>
        theme !== null && theme !== undefined && theme.trim() !== "",
    );

  return Array.from(new Set(themes)).sort();
};
