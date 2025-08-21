"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Commitment } from "@/lib/types";
import { mockCommitments, getCommitmentStats } from "@/lib/mock-data";
import { toast } from "@/components/ui/use-toast";
import CommitmentModal from "@/components/CommitmentModal";
import FiltersPanel from "@/components/FiltersPanel";
import { getStatusColor, getDaysUntilDeadline, formatDate } from "@/lib/utils";

export default function MainPage() {
  const [data, setData] = useState<Commitment[]>([]); // All the commitments
  const [filteredData, setFilteredData] = useState<Commitment[]>([]); // Filtered commitments for display
  const [stats, setStats] = useState(getCommitmentStats(mockCommitments)); // Stats based on the commitments
  const [selectedCommitment, setSelectedCommitment] =
    useState<Commitment | null>(null); // The commitment that will be displayed in the modal
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#272727] mb-4 font-soehne">
            Interprovincial Trade Agreements Tracker
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Monitoring interprovincial trade reform progress across Canada
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white border-[#d3c7b9]">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-[#8b2332]">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Commitments</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#d3c7b9]">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-[#8b2332]">
                {stats.awaitingSponsorship}
              </div>
              <div className="text-sm text-gray-600">Awaiting Sponsorship</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#d3c7b9]">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-[#8b2332]">
                {stats.underNegotiation}
              </div>
              <div className="text-sm text-gray-600">Under Negotiation</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#d3c7b9]">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-[#8b2332]">
                {stats.partiallyImplemented}
              </div>
              <div className="text-sm text-gray-600">Partially Implemented</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-[#d3c7b9]">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-[#8b2332]">
                {stats.implemented}
              </div>
              <div className="text-sm text-gray-600">Fully Implemented</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Filters */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Side Panel */}
          <div className="lg:w-80 flex-shrink-0">
            <FiltersPanel
              commitments={data}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Commitments Grid */}
          <div className="flex-1">
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
                const isOverdue =
                  daysUntilDeadline !== null && daysUntilDeadline < 0;
                const isDueSoon =
                  daysUntilDeadline !== null &&
                  daysUntilDeadline <= 30 &&
                  daysUntilDeadline >= 0;

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
                          <CardDescription className="text-base text-gray-700 mb-3">
                            {item.summary}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge
                            className={`${getStatusColor(item.status)} border font-medium`}
                          >
                            {item.status}
                          </Badge>
                          {daysUntilDeadline !== null && (
                            <div
                              className={`text-sm px-3 py-1 rounded-full border ${
                                isOverdue
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : isDueSoon
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                              }`}
                            >
                              {isOverdue
                                ? `${Math.abs(daysUntilDeadline)} days overdue`
                                : isDueSoon
                                  ? `${daysUntilDeadline} days left`
                                  : `${daysUntilDeadline} days left`}
                            </div>
                          )}
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
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Deadline:</span>{" "}
                          {formatDate(item.deadline)}
                        </div>
                        <div className="text-xs text-gray-500 font-founders uppercase tracking-wide">
                          Click to view details
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
        <CommitmentModal
          commitment={selectedCommitment}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
}
