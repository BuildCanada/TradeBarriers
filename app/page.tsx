"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Commitment } from "@/lib/types";
import { mockCommitments } from "@/lib/mock-data";
import { toast } from "@/components/ui/use-toast";
import CommitmentModal from "@/components/CommitmentModal";
import FiltersPanel from "@/components/FiltersPanel";
import { getStatusColor, getDaysUntilDeadline, formatDate, getCommitmentStats } from "@/lib/utils";
import NavButton from "@/components/NavButton";
import { Search } from "lucide-react";

export default function MainPage() {
  const [data, setData] = useState<Commitment[]>([]); // All the commitments
  const [filteredData, setFilteredData] = useState<Commitment[]>([]); // Filtered commitments for display
  const [stats, setStats] = useState(getCommitmentStats(mockCommitments)); // Stats based on the commitments
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null); // The commitment that will be displayed in the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering by name

  useEffect(() => {
    fetch("/trade-barriers/api/commitments")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(data); // Default to no filters applied
        setStats(getCommitmentStats(data));
      })
      .catch(() => {
        console.error("Error fetching commitments");
        toast({
          title: "Error",
          description: "Failed to fetch commitments. Please try again later.",
          variant: "destructive",
        });
      });
  }, []);

  const handleCardClick = (commitment: Commitment) => {
    setSelectedCommitment(commitment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCommitment(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Re-apply filters with new search query
    if (data.length > 0) {
      let filtered = data;

      // Apply search filter
      if (query.trim()) {
        filtered = data.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );
      }

      setFilteredData(filtered);
      setStats(getCommitmentStats(filtered));
    }
  };

  // Memoize the callback to prevent infinite loops
  const handleFiltersChange = useCallback(
    (filteredCommitments: Commitment[]) => {
      // Apply both filters and search
      let finalFiltered = filteredCommitments;

      if (searchQuery.trim()) {
        finalFiltered = filteredCommitments.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredData(finalFiltered);
      setStats(getCommitmentStats(finalFiltered));
    },
    [searchQuery],
  );

  const clearAllFilters = useCallback(() => {
    setSearchQuery(""); // Clear search query
    setFilteredData(data); // Reset to show all data
    setStats(getCommitmentStats(data)); // Reset stats
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
              A non-partisan platform tracking progress of interprovincial trade reform commitments across Canada.
            </p>
          </div>

          {/* Filters Panel */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Filters</h3>
            <FiltersPanel
              commitments={data}
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
                  <div className="text-sm text-gray-600">Awaiting Sponsorship</div>
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
                  <div className="text-sm text-gray-600">Partially Implemented</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#cdc4bd]">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {stats.implemented}
                  </div>
                  <div className="text-sm text-gray-600">
                    Implemented
                    <span className="text-sm text-gray-600"> ({((stats.implemented / stats.total) * 100).toFixed(0)}%)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Commitments Section */}
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-[#272727]">
                  Commitments ({filteredData.length})
                </h2>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search commitments..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2 border border-[#cdc4bd] rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
                  />
                </div>
              </div>

              {filteredData.length !== data.length && (
                <p className="text-sm text-gray-600">
                  Showing {filteredData.length} of {data.length} commitments
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredData.map((item) => {
                const daysUntilDeadline = getDaysUntilDeadline(item.deadline);
                const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0;

                return (
                  <Card
                    key={item.id}
                    className="bg-white border-[#cdc4bssd] hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                    onClick={() => handleCardClick(item)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-[#272727] mb-2">
                            {item.title}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="w-fit">
                        <div className={`text-xs p-1 rounded-md border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 flex-1 flex flex-col">
                      {/* Quick Jurisdiction Overview */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide font-founders">
                          Participating Jurisdictions
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {item.jurisdictions
                            .slice(0, 3)
                            .map((jurisdiction) => (
                              <span
                                key={jurisdiction}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {jurisdiction}
                              </span>
                            ))}
                          {item.jurisdictions.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{item.jurisdictions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[#cdc4bd]">
                        <div className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">Deadline:</span>{" "}
                            {formatDate(item.deadline)}
                            {isOverdue && (
                              <span className="text-red-600"> (Overdue)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredData.length === 0 && (
              <Card className="bg-white border-[#cdc4bd] text-center py-12">
                <CardContent>
                  <div className="text-gray-500 text-lg">
                    No commitments match your filters
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    Try adjusting your filter criteria
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Commitment Modal */}
        <CommitmentModal commitment={selectedCommitment} isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </div>
  );
}
