"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Agreement } from "@/lib/types";
import {
  getStatusColor,
  getGovernmentStatusColor,
  formatDate,
  getDaysUntilDeadline,
} from "@/lib/utils";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

interface AgreementModalProps {
  agreement: Agreement | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AgreementModal({
  agreement,
  isOpen,
  onClose,
}: AgreementModalProps) {
  if (!agreement) return null;

  const daysUntilDeadline = getDaysUntilDeadline(agreement.deadline);
  const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-soehne">
            {agreement.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div
            className={`w-fit text-xs p-1 rounded-md border ${getStatusColor(agreement.status)}`}
          >
            {agreement.status}
          </div>

          <div
            className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Deadline:</span>{" "}
              {formatDate(agreement.deadline)}
              {isOverdue && <span className="text-red-600"> (Overdue)</span>}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-lg font-semibold text-[#272727] mb-2">
              Summary
            </h3>
            <p className="text-gray-700">{agreement.summary}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-[#272727] mb-2">
              Description
            </h3>
            <p className="text-gray-700">{agreement.description}</p>
          </div>

          {/* Jurisdiction Status Table */}
          <div>
            <h3 className="text-lg font-semibold text-[#272727] mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              Jurisdiction Status
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700 font-founders uppercase tracking-wide text-sm">
                      Jurisdiction
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700 font-founders uppercase tracking-wide text-sm">
                      Status
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700 font-founders uppercase tracking-wide text-sm">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {agreement.jurisdictionStatuses?.map(
                    (jurisdiction, index) => (
                      <tr
                        key={jurisdiction.name}
                        className={`border-b border-gray-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-3 font-medium text-gray-900">
                          {jurisdiction.name}
                        </td>
                        <td className="p-3">
                          <Badge
                            className={`${getGovernmentStatusColor(jurisdiction.status)} border text-xs`}
                          >
                            {jurisdiction.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-gray-600 text-sm">
                          {jurisdiction.notes}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(agreement.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {formatDate(agreement.updatedAt)}
                </div>
              </div>
              {agreement.sourceUrl && (
                <a
                  href={agreement.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium font-founders uppercase tracking-wide rounded-md transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Source
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
