"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Agreement } from "@/lib/types";
import { mockAgreements } from "@/lib/mock-data";
import { toast } from "@/components/ui/use-toast";
import FiltersPanel from "@/components/FiltersPanel";
import { getAgreementStats } from "@/lib/utils";
import NavButton from "@/components/NavButton";
import { Search } from "lucide-react";
import AgreementsList from "@/components/AgreementsList";

export default function MainPage() {
  const [data, setData] = useState<Agreement[]>([]); // All the agreements
  const [filteredData, setFilteredData] = useState<Agreement[]>([]); // Filtered agreements for display
  const [stats, setStats] = useState(getAgreementStats(mockAgreements)); // Stats based on the agreements
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering by name

  useEffect(() => {
    fetch("/trade-barriers/api/agreements")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(data); // Default to no filters applied
        setStats(getAgreementStats(data));
      })
      .catch(() => {
        console.error("Error fetching agreements");
        toast({
          title: "Error",
          description: "Failed to fetch agreements. Please try again later.",
          variant: "destructive",
        });
      });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Re-apply filters with new search query
    if (data.length > 0) {
      let filtered = data;

      // Apply search filter
      if (query.trim()) {
        filtered = data.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase()),
        );
      }

      setFilteredData(filtered);
      setStats(getAgreementStats(filtered));
    }
  };

  // Memoize the callback to prevent infinite loops
  const handleFiltersChange = useCallback(
    (filteredAgreements: Agreement[]) => {
      // Apply both filters and search
      let finalFiltered = filteredAgreements;

      if (searchQuery.trim()) {
        finalFiltered = filteredAgreements.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      setFilteredData(finalFiltered);
      setStats(getAgreementStats(finalFiltered));
    },
    [searchQuery],
  );

  const clearAllFilters = useCallback(() => {
    setSearchQuery(""); // Clear search query
    setFilteredData(data); // Reset to show all data
    setStats(getAgreementStats(data)); // Reset stats
  }, [data]);

  return (
    <div className="min-h-screen bg-[#f6ebe3]">
      <div className="flex">
        {/* Left Column - Branding, Title, and Filters */}
        <div className="w-80 flex-shrink-0 p-6 ">
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
              agreements={data}
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
                  Agreements ({filteredData.length})
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

              {filteredData.length !== data.length && (
                <p className="text-sm text-gray-600">
                  Showing {filteredData.length} of {data.length} agreements
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AgreementsList agreements={filteredData} />
            </div>

            {/* Empty State */}
            {filteredData.length === 0 && (
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
    </div>
  );
}
