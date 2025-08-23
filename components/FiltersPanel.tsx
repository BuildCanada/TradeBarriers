"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Commitment, CommitmentStatus } from "@/lib/types";
import {
  COMMITMENT_STATUSES,
  DEADLINE_TYPES,
  getDaysUntilDeadline,
  JURISDICTIONS,
} from "@/lib/utils";

type FiltersPanelProps = {
  commitments: Commitment[];
  onFiltersChange: (filteredCommitments: Commitment[]) => void;
  onClearAll?: () => void;
};

type Filters = {
  statuses: CommitmentStatus[];
  deadlineTypes: string[];
  jurisdictions: string[];
};

export default function FiltersPanel({
  commitments,
  onFiltersChange,
  onClearAll,
}: FiltersPanelProps) {
  const [filters, setFilters] = useState<Filters>({
    statuses: [],
    deadlineTypes: [],
    jurisdictions: [],
  });

  // Memoize the filtering function to prevent unnecessary re-renders
  const applyFilters = useCallback(
    (currentFilters: Filters, currentCommitments: Commitment[]) => {
      let filtered = [...currentCommitments];

      // Filter by status
      if (currentFilters.statuses.length > 0) {
        filtered = filtered.filter((commitment) =>
          currentFilters.statuses.includes(commitment.status),
        );
      }

      // Filter by deadline type
      if (currentFilters.deadlineTypes.length > 0) {
        filtered = filtered.filter((commitment) => {
          const daysUntilDeadline = getDaysUntilDeadline(commitment.deadline);

          if (
            currentFilters.deadlineTypes.includes("Overdue") &&
            daysUntilDeadline !== null &&
            daysUntilDeadline < 0
          )
            return true;
          if (
            currentFilters.deadlineTypes.includes("Due Soon (30 days)") &&
            daysUntilDeadline !== null &&
            daysUntilDeadline <= 30 &&
            daysUntilDeadline >= 0
          )
            return true;
          if (
            currentFilters.deadlineTypes.includes("On Track") &&
            daysUntilDeadline !== null &&
            daysUntilDeadline > 30
          )
            return true;
          if (
            currentFilters.deadlineTypes.includes("No Deadline") &&
            daysUntilDeadline === null
          )
            return true;

          return false;
        });
      }

      // Filter by jurisdictions
      if (currentFilters.jurisdictions.length > 0) {
        filtered = filtered.filter((commitment) =>
          commitment.jurisdictions?.some((js) =>
            currentFilters.jurisdictions.includes(js),
          ),
        );
      }

      return filtered;
    },
    [],
  );

  // Apply filters and notify parent
  useEffect(() => {
    const filtered = applyFilters(filters, commitments);
    onFiltersChange(filtered);
  }, [filters, commitments, applyFilters, onFiltersChange]);

  const toggleFilter = (filterType: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value as any) // eslint-disable-line @typescript-eslint/no-explicit-any
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value as any], // eslint-disable-line @typescript-eslint/no-explicit-any
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      statuses: [],
      deadlineTypes: [],
      jurisdictions: [],
    });

    // Call parent's clearAll function if provided
    if (onClearAll) {
      onClearAll();
    }
  };

  const getActiveFiltersCount = () => {
    return (
      filters.statuses.length +
      filters.deadlineTypes.length +
      filters.jurisdictions.length
    );
  };

  return (
    <Card className="bg-white border-[#d3c7b9] h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs mx-auto font-founders uppercase tracking-wide border-[#d3c7b9] text-gray-600 hover:bg-gray-50"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Filters */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide font-founders">
            Status
          </h3>
          <div>
            {COMMITMENT_STATUSES.map((status) => (
              <label
                key={status}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 py-1 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(status)}
                  onChange={() => toggleFilter("statuses", status)}
                  className="rounded border-[#d3c7b9] text-[#8b2332] focus:ring-[#8b2332]"
                />
                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Deadline Type Filters */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide font-founders">
            Deadline
          </h3>
          <div>
            {DEADLINE_TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 py-1 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={filters.deadlineTypes.includes(type)}
                  onChange={() => toggleFilter("deadlineTypes", type)}
                  className="rounded border-[#d3c7b9] text-[#8b2332] focus:ring-[#8b2332]"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Jurisdiction Filters */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide font-founders">
            Jurisdictions
          </h3>
          <div>
            {JURISDICTIONS.map((jurisdiction: string) => (
              <label
                key={jurisdiction}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 py-1 rounded-md"
              >
                <input
                  type="checkbox"
                  aria-checked={filters.jurisdictions.includes(jurisdiction)}
                  checked={filters.jurisdictions.includes(jurisdiction)}
                  onChange={() => toggleFilter("jurisdictions", jurisdiction)}
                  className="rounded border-[#d3c7b9] text-[#8b2332] focus:ring-[#8b2332]"
                />
                <span className="text-sm text-gray-700">{jurisdiction}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-4 border-t border-[#d3c7b9]">
            <div className="text-xs text-gray-500 font-founders uppercase tracking-wide mb-2">
              Active Filters: {getActiveFiltersCount()}
            </div>
            <div className="flex flex-wrap gap-1">
              {filters.statuses.map((status) => (
                <Badge
                  key={status}
                  variant="outline"
                  className="text-xs border-[#d3c7b9] text-gray-600"
                >
                  {status}
                </Badge>
              ))}
              {filters.deadlineTypes.map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className="text-xs border-[#d3c7b9] text-gray-600"
                >
                  {type}
                </Badge>
              ))}
              {filters.jurisdictions.map((jurisdiction) => (
                <Badge
                  key={jurisdiction}
                  variant="outline"
                  className="text-xs border-[#d3c7b9] text-gray-600"
                >
                  {jurisdiction}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
