"use client";

import { Agreement } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface KPICardsProps {
  agreements: Agreement[];
}

export default function KPICards({ agreements }: KPICardsProps) {
  // Calculate KPIs based on last full calendar year
  const kpiData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Last full calendar year (e.g., if current date is March 2024, use 2023)
    const lastFullYear =
      now.getMonth() === 0 && now.getDate() === 1
        ? currentYear - 1
        : currentYear - 1;

    // Current year period (January 1st to now)
    const currentYearStart = new Date(currentYear, 0, 1); // January 1st of current year
    const currentYearEnd = now; // Current date

    // Previous year period (entire last calendar year)
    const previousYearStart = new Date(lastFullYear, 0, 1); // January 1st of last full year
    const previousYearEnd = new Date(lastFullYear, 11, 31, 23, 59, 59); // December 31st of last full year

    // Helper function to check if agreement was stale at a specific point in time
    const getStaleAgreementsAtTime = (asOfDate: Date) => {
      return agreements.filter((agreement) => {
        // Exclude agreements with current status "Awaiting Sponsorship" or "Implemented"
        if (
          agreement.status === "Awaiting Sponsorship" ||
          agreement.status === "Implemented"
        ) {
          return false;
        }

        // Check if there's been a status change before the asOfDate
        if (
          !agreement.agreement_history ||
          agreement.agreement_history.length === 0
        ) {
          return true; // No history means it's stale
        }

        const lastStatusChange =
          agreement.agreement_history[agreement.agreement_history.length - 1];
        const lastChangeDate = new Date(lastStatusChange.date_entered);

        // Check if last change was more than 12 months before the asOfDate
        const twelveMonthsBeforeAsOf = new Date(asOfDate);
        twelveMonthsBeforeAsOf.setFullYear(asOfDate.getFullYear() - 1);
        twelveMonthsBeforeAsOf.setMonth(asOfDate.getMonth());
        twelveMonthsBeforeAsOf.setDate(asOfDate.getDate());

        return lastChangeDate < twelveMonthsBeforeAsOf;
      });
    };

    // Helper function to get negotiations started in a time period
    const getNegotiationsInPeriod = (startDate: Date, endDate: Date) => {
      return agreements.filter((agreement) => {
        if (!agreement.agreement_history) {
          return false;
        }

        // Find when this agreement entered "Under Negotiation" status
        const negotiationEntry = agreement.agreement_history.find(
          (history, index) => {
            // Check if this history entry is "Under Negotiation" and the previous one wasn't
            if (history.status === "Under Negotiation") {
              if (index === 0) {
                // First entry is "Under Negotiation"
                return true;
              } else {
                // Check if previous entry was not "Under Negotiation"
                const previousEntry = agreement.agreement_history[index - 1];
                return previousEntry.status !== "Under Negotiation";
              }
            }
            return false;
          },
        );

        if (!negotiationEntry) {
          return false;
        }

        const negotiationDate = new Date(negotiationEntry.date_entered);
        return negotiationDate >= startDate && negotiationDate <= endDate;
      });
    };

    // Current period calculations
    const currentStaleAgreements = getStaleAgreementsAtTime(now);
    const currentRecentNegotiations = getNegotiationsInPeriod(
      currentYearStart,
      currentYearEnd,
    );

    // Previous year calculations (for YoY comparison)
    const previousStaleAgreements = getStaleAgreementsAtTime(previousYearEnd);
    const previousRecentNegotiations = getNegotiationsInPeriod(
      previousYearStart,
      previousYearEnd,
    );

    // Calculate percentages and changes
    const currentStalePercentage =
      agreements.length > 0
        ? (currentStaleAgreements.length / agreements.length) * 100
        : 0;
    const previousStalePercentage =
      agreements.length > 0
        ? (previousStaleAgreements.length / agreements.length) * 100
        : 0;
    const stalePercentageChange =
      currentStalePercentage - previousStalePercentage;

    const negotiationsChange =
      currentRecentNegotiations.length - previousRecentNegotiations.length;

    return {
      staleAgreementsCount: currentStaleAgreements.length,
      recentNegotiationsCount: currentRecentNegotiations.length,
      stalePercentageChange,
      negotiationsChange,
    };
  }, [agreements]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* KPI 1: Stale Agreements */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide text-foreground">
            Stale Agreements
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold font-mono text-orange-500 mb-2">
            {Math.round(
              (kpiData.staleAgreementsCount / agreements.length) * 100,
            )}
            %
          </div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
            % of Agreements Stagnant for &gt;12 Months
          </div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide mt-1">
            ({kpiData.stalePercentageChange >= 0 ? "+" : ""}
            {Math.round(kpiData.stalePercentageChange)}% v{" "}
            {new Date().getFullYear() - 1})
          </div>
        </CardContent>
      </Card>

      {/* KPI 2: Recent Negotiations */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono font-semibold uppercase tracking-wide text-foreground">
            Recent Negotiations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold font-mono text-blue-500 mb-2">
            {kpiData.recentNegotiationsCount}
          </div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
            Negotiations Started on New Barriers (Last 12 Months)
          </div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide mt-1">
            ({kpiData.negotiationsChange >= 0 ? "+" : ""}
            {kpiData.negotiationsChange} v {new Date().getFullYear() - 1})
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
