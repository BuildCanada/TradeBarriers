"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Agreement } from "@/lib/types";
import { getAgreementStats } from "@/lib/utils";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  CircleHelp,
  X,
} from "lucide-react";
import AgreementsList from "@/components/AgreementsList";
import FiltersPanel from "@/components/FiltersPanel";
import ActivityChart, { ChartSelection } from "@/components/ActivityChart";
import KPICards from "@/components/KPICards";
import FAQModal from "@/components/FAQModal";

interface ClientMainPageProps {
  initialAgreements: Agreement[];
  initialStats: ReturnType<typeof getAgreementStats>;
}

export default function ClientMainPage({
  initialAgreements,
  initialStats,
}: ClientMainPageProps) {
  const [filteredByFilters, setFilteredByFilters] =
    useState<Agreement[]>(initialAgreements);
  const [filteredAgreements, setFilteredAgreements] =
    useState<Agreement[]>(initialAgreements);
  const [stats, setStats] = useState(initialStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [chartSelection, setChartSelection] = useState<ChartSelection | null>(
    null,
  );

  // Agreements narrowed further by a clicked bar in the activity chart. The
  // chart itself keeps reading `filteredAgreements` so its bars stay put.
  const visibleAgreements = useMemo(() => {
    if (!chartSelection) return filteredAgreements;

    return filteredAgreements.filter((agreement) =>
      (agreement.agreement_history || []).some((history) => {
        const date = new Date(history.date_entered);
        if (Number.isNaN(date.getTime())) return false;
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (monthKey !== chartSelection.month) return false;
        return (
          !chartSelection.status || history.status === chartSelection.status
        );
      }),
    );
  }, [filteredAgreements, chartSelection]);

  useEffect(() => {
    setStats(getAgreementStats(visibleAgreements));
  }, [visibleAgreements]);

  // Share of the current result set; 0 when nothing matches so the progress
  // bar doesn't render `NaN%` widths.
  const pct = useCallback(
    (count: number) => (stats.total > 0 ? (count / stats.total) * 100 : 0),
    [stats.total],
  );

  // Apply search to the filtered results from filters
  useEffect(() => {
    if (searchQuery.trim()) {
      const searchFiltered = filteredByFilters.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredAgreements(searchFiltered);
    } else {
      setFilteredAgreements(filteredByFilters);
    }
  }, [searchQuery, filteredByFilters]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      // A search can remove the selected bar from the chart entirely; don't
      // leave an invisible month filter applied.
      setChartSelection(null);
    },
    [],
  );

  const handleFiltersChange = useCallback((filteredAgreements: Agreement[]) => {
    setFilteredByFilters(filteredAgreements);
    setChartSelection(null);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setChartSelection(null);
    setFilteredByFilters(initialAgreements);
  }, [initialAgreements]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Left Column - Branding, Title, and Filters */}
      <div className="w-full lg:w-80 flex-shrink-0 p-6 border-r border-border">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3 font-mono uppercase tracking-wider text-foreground">
            Trade Barriers Tracker
          </h1>
          <p className="text-muted-foreground text-sm tracking-wide">
            Tracking progress of interprovincial trade agreements across Canada.
          </p>
        </div>

        {/* FAQ and Feedback Button */}
        <div className="mb-2">
          <button
            onClick={() => setFaqOpen(true)}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-mono uppercase tracking-wide border border-border bg-card text-foreground hover:bg-muted transition-colors rounded-md"
          >
            <CircleHelp className="w-4 h-4 mr-2" />
            FAQ
          </button>
        </div>
        <div className="mb-6">
          <a
            href="mailto:hi@buildcanada.com?subject=Trade Barriers Feedback"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-mono uppercase tracking-wide border border-border bg-card text-foreground hover:bg-muted transition-colors rounded-md"
          >
            <Mail className="w-4 h-4 mr-2" />
            Feedback
          </a>
        </div>

        {/* Filters Panel */}
        <div>
          {/* Mobile-only collapsible header */}
          <div className="lg:hidden">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center justify-between w-full p-3 bg-card border border-border hover:bg-muted transition-colors"
            >
              <h3 className="text-lg font-mono font-semibold uppercase tracking-wide text-foreground">
                Filters
              </h3>
              {filtersOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Desktop always-visible header */}
          <h3 className="hidden lg:block text-xl font-mono font-semibold mb-4 uppercase tracking-wide text-foreground">
            Filters
          </h3>

          {/* Filters content - hidden on mobile when collapsed */}
          <div className={`lg:block ${filtersOpen ? "block" : "hidden"}`}>
            <FiltersPanel
              agreements={initialAgreements}
              onFiltersChange={handleFiltersChange}
              onClearAll={clearAllFilters}
            />
          </div>
        </div>
      </div>

      {/* Right Column - Main Content */}
      <div className="flex-1 p-6">
        {/* Overview Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-mono font-semibold uppercase tracking-wide text-foreground">
              Overview
            </h2>
            <span className="text-sm font-mono text-muted-foreground uppercase tracking-wide">
              {stats.total} total trade agreements
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card className="bg-card border border-border col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-mono text-gray-600">
                  {stats.awaitingSponsorship}
                </div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                  Awaiting
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-mono text-yellow-400">
                  {stats.underNegotiation}
                </div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                  Negotiations Initiated
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-mono text-orange-400">
                  {stats.agreementReached}
                </div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                  Agreements Reached
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-mono text-green-400">
                  {stats.partiallyImplemented}
                </div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                  Partially Implemented
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-mono text-green-600">
                  {stats.implemented}
                </div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                  Fully Implemented
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-mono text-bloomberg-red">
                  {stats.deferred}
                </div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                  Deferred
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar Visualization */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono font-semibold text-foreground">
                {stats.total > 0
                  ? ((stats.implemented / stats.total) * 100).toFixed(0)
                  : 0}
                % Implemented
              </span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-lg overflow-hidden">
              {/* Awaiting Sponsorship - Start from left */}
              <div
                className="absolute top-0 left-0 h-full bg-gray-300"
                style={{
                  width: `${pct(stats.awaitingSponsorship)}%`,
                }}
              ></div>

              {/* Under Negotiation */}
              <div
                className="absolute top-0 h-full bg-yellow-400"
                style={{
                  left: `${pct(stats.awaitingSponsorship)}%`,
                  width: `${pct(stats.underNegotiation)}%`,
                }}
              ></div>

              {/* Agreement Reached */}
              <div
                className="absolute top-0 h-full bg-orange-400"
                style={{
                  left: `${pct(stats.awaitingSponsorship + stats.underNegotiation)}%`,
                  width: `${pct(stats.agreementReached)}%`,
                }}
              ></div>

              {/* Partially Implemented */}
              <div
                className="absolute top-0 h-full bg-green-400"
                style={{
                  left: `${pct(stats.awaitingSponsorship + stats.agreementReached + stats.underNegotiation)}%`,
                  width: `${pct(stats.partiallyImplemented)}%`,
                }}
              ></div>

              {/* Implemented (Complete) */}
              <div
                className="absolute top-0 h-full bg-green-600"
                style={{
                  left: `${pct(stats.awaitingSponsorship + stats.agreementReached + stats.underNegotiation + stats.partiallyImplemented)}%`,
                  width: `${pct(stats.implemented)}%`,
                }}
              ></div>

              {/* Deferred */}
              <div
                className="absolute top-0 h-full bg-bloomberg-red"
                style={{
                  left: `${pct(stats.awaitingSponsorship + stats.agreementReached + stats.underNegotiation + stats.partiallyImplemented + stats.implemented)}%`,
                  width: `${pct(stats.deferred)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="mb-8">
          <ActivityChart
            agreements={filteredAgreements}
            selection={chartSelection}
            onSelectionChange={setChartSelection}
          />
        </div>

        {/* KPI Cards */}
        <KPICards agreements={visibleAgreements} />

        {/* Agreements Section */}
        <div>
          <div className="mb-6">
            {/* Desktop layout */}
            <div className="hidden md:flex items-center justify-between mb-2">
              <h2 className="text-xl font-mono font-semibold uppercase tracking-wide text-foreground">
                Agreements ({visibleAgreements.length})
              </h2>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search agreements..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-border bg-card text-sm font-mono uppercase tracking-wide text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-bloomberg-blue focus:border-bloomberg-blue w-64"
                />
              </div>
            </div>

            {/* Mobile layout - search bar on its own row */}
            <div className="md:hidden">
              <div className="mb-4">
                <h2 className="text-xl font-mono font-semibold uppercase tracking-wide text-foreground">
                  Agreements ({visibleAgreements.length})
                </h2>
              </div>

              {/* Search Bar - full width on mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search agreements..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-border bg-card text-sm font-mono uppercase tracking-wide text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-bloomberg-blue focus:border-bloomberg-blue"
                />
              </div>
            </div>

            {chartSelection && (
              <button
                onClick={() => setChartSelection(null)}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase tracking-wide border border-border bg-card text-foreground hover:bg-muted transition-colors"
              >
                {chartSelection.status
                  ? `${chartSelection.status} · ${chartSelection.label}`
                  : chartSelection.label}
                <X className="w-3 h-3" />
              </button>
            )}

            {visibleAgreements.length !== initialAgreements.length && (
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                Showing {visibleAgreements.length} of {initialAgreements.length}{" "}
                agreements
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AgreementsList agreements={visibleAgreements} />
          </div>

          {/* Empty State */}
          {visibleAgreements.length === 0 && (
            <Card className="bg-card border border-border text-center py-12">
              <CardContent>
                <div className="text-muted-foreground text-lg font-mono uppercase tracking-wide">
                  No agreements match your filters
                </div>
                <div className="text-muted-foreground text-sm mt-2 font-mono uppercase tracking-wide">
                  Try adjusting your filter criteria
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* FAQ Modal */}
      <FAQModal isOpen={faqOpen} onClose={() => setFaqOpen(false)} />
    </div>
  );
}
