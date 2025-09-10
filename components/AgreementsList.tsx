import { Agreement } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  getStatusColor,
  formatDate,
  getParticipatingJurisdictions,
  checkIfOverdue,
} from "@/lib/utils";
import { useState } from "react";
import { Calendar, Trash2, Edit, Tag } from "lucide-react";
import AgreementModal from "./AgreementModal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditAgreement from "@/app/admin/EditAgreement";

export default function AgreementsList({
  agreements,
  onAgreementDeleted,
  onAgreementUpdated,
  isAdmin = false,
}: {
  agreements: Agreement[];
  onAgreementDeleted?: (deletedId: string) => void;
  onAgreementUpdated?: (updatedAgreement: Agreement) => void;
  isAdmin?: boolean;
}) {
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(
    null,
  ); // The agreement that will be displayed in the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreementToDelete, setAgreementToDelete] = useState<Agreement | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [agreementToEdit, setAgreementToEdit] = useState<Agreement | null>(
    null,
  );

  const handleCardClick = (agreement: Agreement) => {
    setSelectedAgreement(agreement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAgreement(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, agreement: Agreement) => {
    e.stopPropagation(); // Prevent opening the modal
    setAgreementToDelete(agreement);
  };

  const handleEditClick = (e: React.MouseEvent, agreement: Agreement) => {
    e.stopPropagation(); // Prevent opening the modal
    setAgreementToEdit(agreement);
  };

  const handleDeleteConfirm = async () => {
    if (!agreementToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/trade-barriers/api/agreements/${agreementToDelete.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      toast({
        title: "Success!",
        description: "Agreement has been deleted successfully.",
      });

      // Call the callback to update the parent component
      if (onAgreementDeleted) {
        onAgreementDeleted(agreementToDelete.id);
      }
    } catch (error) {
      console.error("Error deleting agreement:", error);
      toast({
        title: "Error",
        description: "Failed to delete agreement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setAgreementToDelete(null);
    }
  };

  return (
    <>
      {agreements.map((item) => {
        const isOverdue = checkIfOverdue(item.deadline, item.status);

        return (
          <Card
            key={item.id}
            className="bg-white border-[#cdc4bssd] hover:shadow-lg transition-shadow cursor-pointer flex flex-col relative group"
            onClick={() => handleCardClick(item)}
          >
            {/* Delete Button - Only visible on hover and when admin */}
            {isAdmin && (
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleEditClick(e, item)}
                  className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                >
                  <Edit className="h-4 w-4 p-2" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => handleDeleteClick(e, item)}
                  className="h-8 w-8 bg-primary hover:bg-primary/90"
                >
                  <Trash2 className="h-4 w-4 p-2" />
                </Button>
              </div>
            )}

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
                {item.theme && (
                  <div className="mt-2 text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {item.theme}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col">
              {/* Quick Jurisdiction Overview */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {/* Individual badges */}
                  {getParticipatingJurisdictions(item.jurisdictions)
                    ?.slice(0, 3)
                    .map((jurisdictionStatus) => (
                      <span
                        key={jurisdictionStatus.name}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {jurisdictionStatus.name}
                      </span>
                    ))}

                  {/* "More" badge */}
                  {item.jurisdictions &&
                    getParticipatingJurisdictions(item.jurisdictions).length >
                      3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +
                        {getParticipatingJurisdictions(item.jurisdictions)
                          .length - 3}{" "}
                        more
                      </span>
                    )}
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[#cdc4bd]">
                <div
                  className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}
                >
                  <div>
                    <Calendar className="w-4 h-4 text-gray-600 inline-block mr-1 relative -top-px" />
                    <span className="font-medium">
                      {item.status === "Implemented" ? "Completed" : "Deadline"}
                      :
                    </span>{" "}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!agreementToDelete}
        onOpenChange={() => setAgreementToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agreement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{agreementToDelete?.title}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setAgreementToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Agreement Modal */}
      <Dialog
        open={!!agreementToEdit}
        onOpenChange={() => setAgreementToEdit(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-[#d3c7b9] p-6 rounded-md">
          <DialogHeader>
            <DialogTitle>Edit Agreement</DialogTitle>
          </DialogHeader>
          {agreementToEdit && (
            <EditAgreement
              agreement={agreementToEdit}
              onAgreementUpdated={(updatedAgreement) => {
                if (onAgreementUpdated) {
                  onAgreementUpdated(updatedAgreement);
                }
                setAgreementToEdit(null); // Close the modal
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
