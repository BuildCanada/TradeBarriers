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
  checkIfOverdue,
} from "@/lib/utils";
import { Calendar, MapPin, ExternalLink, Tag, Share2 } from "lucide-react";
import Timeline from "./Timeline";
import { toast } from "./ui/use-toast";

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

  const isOverdue = checkIfOverdue(agreement.deadline, agreement.status);

  const handleShare = () => {
    const url = `${window.location.origin}/trade-barriers?agreement=${agreement.id}`;
    navigator.clipboard.writeText(url);

    toast({
      title: "Link copied!",
      description: "The agreement link has been copied to your clipboard.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-soehne">
            {agreement.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="w-fit">
            <div
              className={`text-xs p-1 rounded-md border ${getStatusColor(agreement.status)}`}
            >
              {agreement.status}
            </div>
            {agreement.theme && (
              <div className="mt-2 text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {agreement.theme}
              </div>
            )}
          </div>

          <div
            className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="font-medium">
                {agreement.status === "Implemented" ? "Completed" : "Deadline"}:
              </span>{" "}
              {formatDate(agreement.deadline)}
              {isOverdue && <span className="text-red-600"> (Overdue)</span>}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Launch Date:</span>{" "}
              {formatDate(agreement.launch_date)}
            </div>
          </div>

          <div className="hidden md:block">
            <h3 className="text-lg font-mono tracking-wide mb-2">Timeline</h3>
            <Timeline history={agreement.agreement_history} />
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-lg font-mono tracking-wide mb-2">Summary</h3>
            <p className="text-gray-700">{agreement.summary}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-mono tracking-wide mb-2">
              Description
            </h3>
            <p className="text-gray-700">{agreement.description}</p>
          </div>

          {/* Jurisdiction Status Table */}
          <div>
            <h3 className="text-lg font-mono tracking-wide mb-4 flex items-center gap-2">
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
                  {agreement.jurisdictions?.map((jurisdiction, index) => (
                    <tr
                      key={jurisdiction.name}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="p-3 text-gray-900">{jurisdiction.name}</td>
                      <td className="p-3">
                        <Badge
                          className={`${getGovernmentStatusColor(jurisdiction.status)} border text-xs hover:bg-inherit`}
                        >
                          {jurisdiction.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600 text-sm">
                        <div>{jurisdiction.notes}</div>
                        {jurisdiction.jurisdiction_history &&
                          jurisdiction.jurisdiction_history.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              <div className="font-medium mb-1">Recent:</div>
                              {jurisdiction.jurisdiction_history
                                .slice(-1)
                                .map((history, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1"
                                  >
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    <span>{history.status}</span>
                                    <span>•</span>
                                    <span>
                                      {formatDate(history.date_entered)}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Agreement History */}
          {agreement.agreement_history &&
            agreement.agreement_history.length > 0 && (
              <div>
                <h3 className="text-lg font-mono tracking-wide mb-4">
                  Agreement History
                </h3>
                <div className="space-y-3">
                  {agreement.agreement_history.map((history, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(history.status).replace("text-", "bg-").replace("border-", "bg-")}`}
                      ></div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {history.status}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(history.date_entered)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Footer Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(agreement.created_at)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {formatDate(agreement.updated_at)}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-mono uppercase tracking-wide border border-border bg-card text-foreground hover:bg-muted transition-colors rounded-md"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                {agreement.source_url && (
                  <a
                    href={agreement.source_url}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
