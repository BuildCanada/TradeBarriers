"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Agreement } from "@/lib/types";
import { getAgreementStats } from "@/lib/utils";
import { Search } from "lucide-react";
import AgreementsList from "@/components/AgreementsList";
import FiltersPanel from "@/components/FiltersPanel";
import NavButton from "@/components/NavButton";

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

  // Update stats when filtered agreements change
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
    <div className="flex">
      {/* Left Column - Branding, Title, and Filters */}
      <div className="w-80 flex-shrink-0 p-6">
        <div className="mb-8">
          <NavButton />
          <h1 className="text-4xl lg:text-5xl font-bold mb-3 font-soehne">
            Trade Barriers Tracker
          </h1>
          <p className="text-gray-600">
            A non-partisan platform tracking progress of interprovincial trade
            reform agreements across Canada.
          </p>
        </div>

        {/* Filters Panel */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Filters</h3>
          <FiltersPanel
            agreements={initialAgreements}
            onFiltersChange={handleFiltersChange}
            onClearAll={clearAllFilters}
          />
        </div>
      </div>

      {/* Right Column - Main Content */}
      <div className="flex-1 p-6">
        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-5 gap-4">
            <Card className="bg-white border-[#cdc4bd]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#cdc4bd]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.awaitingSponsorship}
                </div>
                <div className="text-sm text-gray-600">
                  Awaiting Sponsorship
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#cdc4bd]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.underNegotiation}
                </div>
                <div className="text-sm text-gray-600">Under Negotiation</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#cdc4bd]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.partiallyImplemented}
                </div>
                <div className="text-sm text-gray-600">
                  Partially Implemented
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-[#cdc4bd]">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.implemented}
                </div>
                <div className="text-sm text-gray-600">
                  Implemented
                  <span className="text-sm text-gray-600">
                    {" "}
                    ({((stats.implemented / stats.total) * 100).toFixed(0)}%)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Agreements Section */}
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-[#272727]">
                Agreements ({filteredAgreements.length})
              </h2>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search agreements..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-[#cdc4bd] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
                />
              </div>
            </div>

            {filteredAgreements.length !== initialAgreements.length && (
              <p className="text-sm text-gray-600">
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
            <Card className="bg-white border-[#cdc4bd] text-center py-12">
              <CardContent>
                <div className="text-gray-500 text-lg">
                  No agreements match your filters
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  Try adjusting your filter criteria
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
