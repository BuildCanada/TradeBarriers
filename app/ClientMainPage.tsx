"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Agreement } from "@/lib/types";
import { getAgreementStats } from "@/lib/utils";
import { Search, ChevronDown, ChevronUp, Mail, CircleHelp } from "lucide-react";
import AgreementsList from "@/components/AgreementsList";
import FiltersPanel from "@/components/FiltersPanel";
import ActivityChart from "@/components/ActivityChart";
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

  useEffect(() => {
    setStats(getAgreementStats(filteredAgreements));
  }, [filteredAgreements]);

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
    },
    [],
  );

  const handleFiltersChange = useCallback((filteredAgreements: Agreement[]) => {
    setFilteredByFilters(filteredAgreements);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setFilteredByFilters(initialAgreements);
  }, [initialAgreements]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      {/* Left Column - Branding, Title, and Filters */}
      <div className="w-full lg:w-80 flex-shrink-0 p-6 border-r border-border">
        <div className="mb-6">
          <Image
            src="/trade-barriers/buildcanada-logo.svg"
            alt="Build Canada"
            width={60}
            height={36}
          />
        </div>

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
                  Negotiation
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-mono text-orange-400">
                  {stats.agreementReached}
                </div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                  Reached
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-mono text-green-400">
                  {stats.partiallyImplemented}
                </div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                  Partial
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border border-border col-span-2 md:col-span-1">
              <CardContent className="p-4">
                <div className="text-2xl font-bold font-mono text-green-600">
                  {stats.implemented}
                </div>
                <div className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                  Complete
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
                % COMPLETE
              </span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-lg overflow-hidden">
              {/* Awaiting Sponsorship - Start from left */}
              <div
                className="absolute top-0 left-0 h-full bg-gray-300"
                style={{
                  width: `${(stats.awaitingSponsorship / stats.total) * 100}%`,
                }}
              ></div>

              {/* Under Negotiation */}
              <div
                className="absolute top-0 h-full bg-yellow-400"
                style={{
                  left: `${(stats.awaitingSponsorship / stats.total) * 100}%`,
                  width: `${(stats.underNegotiation / stats.total) * 100}%`,
                }}
              ></div>

              {/* Agreement Reached */}
              <div
                className="absolute top-0 h-full bg-orange-400"
                style={{
                  left: `${((stats.awaitingSponsorship + stats.underNegotiation) / stats.total) * 100}%`,
                  width: `${(stats.agreementReached / stats.total) * 100}%`,
                }}
              ></div>

              {/* Partially Implemented */}
              <div
                className="absolute top-0 h-full bg-green-400"
                style={{
                  left: `${((stats.awaitingSponsorship + stats.agreementReached + stats.underNegotiation) / stats.total) * 100}%`,
                  width: `${(stats.partiallyImplemented / stats.total) * 100}%`,
                }}
              ></div>

              {/* Implemented (Complete) */}
              <div
                className="absolute top-0 h-full bg-green-600"
                style={{
                  left: `${((stats.awaitingSponsorship + stats.agreementReached + stats.underNegotiation + stats.partiallyImplemented) / stats.total) * 100}%`,
                  width: `${(stats.implemented / stats.total) * 100}%`,
                }}
              ></div>

              {/* Deferred */}
              <div
                className="absolute top-0 h-full bg-bloomberg-red"
                style={{
                  left: `${((stats.awaitingSponsorship + stats.agreementReached + stats.underNegotiation + stats.partiallyImplemented + stats.implemented) / stats.total) * 100}%`,
                  width: `${(stats.deferred / stats.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="mb-8">
          <ActivityChart agreements={filteredAgreements} />
        </div>

        {/* Agreements Section */}
        <div>
          <div className="mb-6">
            {/* Desktop layout */}
            <div className="hidden md:flex items-center justify-between mb-2">
              <h2 className="text-xl font-mono font-semibold uppercase tracking-wide text-foreground">
                Agreements ({filteredAgreements.length})
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
                  Agreements ({filteredAgreements.length})
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

            {filteredAgreements.length !== initialAgreements.length && (
              <p className="text-sm text-muted-foreground font-mono uppercase tracking-wide">
                Showing {filteredAgreements.length} of{" "}
                {initialAgreements.length} agreements
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AgreementsList agreements={filteredAgreements} />
          </div>

          {/* Empty State */}
          {filteredAgreements.length === 0 && (
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
