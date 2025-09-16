"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Agreement,
  AgreementStatus,
  AGREEMENT_STATUSES,
  DEADLINE_TYPES,
  JURISDICTIONS,
  DeadlineType,
  Theme,
} from "@/lib/types";
import {
  checkIfParticipating,
  getDaysUntilDeadline,
  getUniqueThemes,
} from "@/lib/utils";

type FiltersPanelProps = {
  agreements: Agreement[];
  onFiltersChange: (filteredAgreements: Agreement[]) => void;
  onClearAll?: () => void;
};

type Filters = {
  statuses: AgreementStatus[];
  deadlineTypes: DeadlineType[];
  jurisdictions: string[];
  themes: Theme[];
};

export default function FiltersPanel({
  agreements,
  onFiltersChange,
  onClearAll,
}: FiltersPanelProps) {
  const [filters, setFilters] = useState<Filters>({
    statuses: [],
    deadlineTypes: [],
    jurisdictions: [],
    themes: [],
  });

  // Memoize the filtering function to prevent unnecessary re-renders
  const applyFilters = useCallback(
    (currentFilters: Filters, currentAgreements: Agreement[]) => {
      let filtered = [...currentAgreements];

      // Filter by status
      if (currentFilters.statuses.length > 0) {
        filtered = filtered.filter((agreement) =>
          currentFilters.statuses.includes(agreement.status),
        );
      }

      // Filter by deadline type
      if (currentFilters.deadlineTypes.length > 0) {
        filtered = filtered.filter((agreement) => {
          const daysUntilDeadline = getDaysUntilDeadline(agreement.deadline);

          if (
            currentFilters.deadlineTypes.includes("Overdue") &&
            daysUntilDeadline !== null &&
            daysUntilDeadline < 0 &&
            agreement.status !== "Implemented"
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
        filtered = filtered.filter((agreement) =>
          agreement.jurisdictions?.some(
            (js) =>
              currentFilters.jurisdictions.includes(js.name) &&
              checkIfParticipating([js]),
          ),
        );
      }

      // Filter by theme
      if (currentFilters.themes.length > 0) {
        filtered = filtered.filter((agreement) =>
          currentFilters.themes.includes(agreement.theme),
        );
      }

      return filtered;
    },
    [],
  );

  // Apply filters and notify parent
  useEffect(() => {
    const filtered = applyFilters(filters, agreements);
    onFiltersChange(filtered);
  }, [filters, agreements, applyFilters, onFiltersChange]);

  const toggleFilter = <T extends keyof Filters>(
    filterType: T,
    value: Filters[T][number],
  ) => {
    setFilters((prev) => {
      const currentArray = prev[filterType] as readonly Filters[T][number][];
      const isIncluded = currentArray.includes(value);

      return {
        ...prev,
        [filterType]: isIncluded
          ? currentArray.filter((v) => v !== value)
          : [...currentArray, value],
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      statuses: [],
      deadlineTypes: [],
      jurisdictions: [],
      themes: [],
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
      filters.jurisdictions.length +
      filters.themes.length
    );
  };

  return (
    <Card className="bg-background border-border h-fit">
      <CardContent className="space-y-6">
        {/* Status Filters */}
        <div>
          <h3 className="text-sm font-semibold text-foreground my-3 uppercase tracking-wide font-mono">
            STATUS
          </h3>
          <div>
            {AGREEMENT_STATUSES.map((status: AgreementStatus) => (
              <label
                key={status}
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted py-1"
              >
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(status)}
                  onChange={() => toggleFilter("statuses", status)}
                  className="border-border text-bloomberg-blue focus:ring-bloomberg-blue"
                />
                <span className="text-sm text-foreground">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Deadline Type Filters */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide font-mono">
            DEADLINE
          </h3>
          <div>
            {DEADLINE_TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted py-1"
              >
                <input
                  type="checkbox"
                  checked={filters.deadlineTypes.includes(type)}
                  onChange={() => toggleFilter("deadlineTypes", type)}
                  className="border-border text-bloomberg-blue focus:ring-bloomberg-blue"
                />
                <span className="text-sm text-foreground">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Jurisdiction Filters */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide font-mono">
            JURISDICTIONS
          </h3>
          <div>
            {JURISDICTIONS.map((jurisdiction: string) => (
              <label
                key={jurisdiction}
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted py-1"
              >
                <input
                  type="checkbox"
                  aria-checked={filters.jurisdictions.includes(jurisdiction)}
                  checked={filters.jurisdictions.includes(jurisdiction)}
                  onChange={() => toggleFilter("jurisdictions", jurisdiction)}
                  className="border-border text-bloomberg-blue focus:ring-bloomberg-blue"
                />
                <span className="text-sm text-foreground">{jurisdiction}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Theme Filters */}
        {getUniqueThemes(agreements).length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide font-mono">
              THEMES
            </h3>
            <div>
              {getUniqueThemes(agreements).map((theme: Theme) => (
                <label
                  key={theme}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted py-1"
                >
                  <input
                    type="checkbox"
                    checked={filters.themes.includes(theme)}
                    onChange={() => toggleFilter("themes", theme)}
                    className="border-border text-bloomberg-blue focus:ring-bloomberg-blue"
                  />
                  <span className="text-sm text-foreground">{theme}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-2">
              ACTIVE FILTERS: {getActiveFiltersCount()}
            </div>
            <div className="flex flex-wrap gap-1">
              {filters.statuses.map((status) => (
                <Badge
                  key={status}
                  variant="outline"
                  className="text-xs border-border text-foreground font-mono uppercase tracking-wide"
                >
                  {status}
                </Badge>
              ))}
              {filters.deadlineTypes.map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className="text-xs border-border text-foreground font-mono uppercase tracking-wide"
                >
                  {type}
                </Badge>
              ))}
              {filters.jurisdictions.map((jurisdiction) => (
                <Badge
                  key={jurisdiction}
                  variant="outline"
                  className="text-xs border-border text-foreground font-mono uppercase tracking-wide"
                >
                  {jurisdiction}
                </Badge>
              ))}
              {filters.themes.map((theme) => (
                <Badge
                  key={theme}
                  variant="outline"
                  className="text-xs border-border text-foreground font-mono uppercase tracking-wide"
                >
                  {theme}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pb-4">
        <div className="mx-auto">
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs mx-auto font-mono uppercase tracking-wide border-border text-foreground hover:bg-muted"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
