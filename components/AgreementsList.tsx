import { Agreement } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getStatusColor, getDaysUntilDeadline, formatDate } from "@/lib/utils";
import { useState } from "react";
import { Calendar } from "lucide-react";
import AgreementModal from "./AgreementModal";

export default function AgreementsList({
  agreements,
}: {
  agreements: Agreement[];
}) {
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(
    null,
  ); // The agreement that will be displayed in the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (agreement: Agreement) => {
    setSelectedAgreement(agreement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAgreement(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {agreements.map((item) => {
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
                <div
                  className={`text-xs p-1 rounded-md border ${getStatusColor(item.status)}`}
                >
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
                  {item.jurisdictions.slice(0, 3).map((jurisdiction) => (
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
                <div
                  className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}
                >
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

      {/* Agreement Modal */}
      <AgreementModal
        agreement={selectedAgreement}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
