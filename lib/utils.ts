import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CommitmentStatus, JurisdictionStatusType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Constants
export const COMMITMENT_STATUSES: CommitmentStatus[] = [
  "Awaiting Sponsorship",
  "Under Negotiation",
  "Agreement Reached",
  "Partially Implemented",
  "Implemented",
];
export const DEADLINE_TYPES = [
  "Overdue",
  "Due Soon (30 days)",
  "On Track",
  "No Deadline",
];
export const JURISDICTIONS = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

// Status color mapping. Returns a string of tailwind classes.
export const getStatusColor = (status: CommitmentStatus) => {
  switch (status) {
    case "Awaiting Sponsorship":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "Under Negotiation":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Agreement Reached":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Partially Implemented":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Implemented":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// Government status color mapping. Returns a string of tailwind classes.
export const getGovernmentStatusColor = (status: JurisdictionStatusType) => {
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
  if (!dateString) return "No deadline set";
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
