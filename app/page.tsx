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

export default function MainPage() {
  const [data, setData] = useState<Commitment[]>([]); // All the commitments
  const [filteredData, setFilteredData] = useState<Commitment[]>([]); // Filtered commitments for display
  const [stats, setStats] = useState(getCommitmentStats(mockCommitments)); // Stats based on the commitments
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null); // The commitment that will be displayed in the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Memoize the callback to prevent infinite loops
  const handleFiltersChange = useCallback(
    (filteredCommitments: Commitment[]) => {
      setFilteredData(filteredCommitments);
      setStats(getCommitmentStats(filteredCommitments));
    },
    [],
  );

  return (
    <div className="min-h-screen bg-[#f6ebe3]">
      <div className="flex">
        {/* Left Column - Branding, Title, and Filters */}
        <div className="w-80 flex-shrink-0 p-6 ">
          <div className="mb-8">
            <NavButton />
            <h1 className="text-4xl lg:text-5xl font-bold text-[#272727] mb-3 font-soehne">
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
            />
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="flex-1 p-6">
          {/* Overview Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#272727] mb-4">Overview</h2>
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-white border-[#d3c7b9]">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {stats.total}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#d3c7b9]">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {stats.awaitingSponsorship}
                  </div>
                  <div className="text-sm text-gray-600">Awaiting</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#d3c7b9]">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {stats.underNegotiation}
                  </div>
                  <div className="text-sm text-gray-600">Negotiating</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#d3c7b9]">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {stats.partiallyImplemented}
                  </div>
                  <div className="text-sm text-gray-600">Partial</div>
                </CardContent>
              </Card>
              <Card className="bg-white border-[#d3c7b9]">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {stats.implemented}
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Commitments Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#272727] mb-2">
                Commitments ({filteredData.length})
              </h2>
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
                    className="bg-white border-[#d3c7b9] hover:shadow-lg transition-shadow cursor-pointer"
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

                    <CardContent className="pt-0">
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
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[#d3c7b9]">
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
              <Card className="bg-white border-[#d3c7b9] text-center py-12">
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
