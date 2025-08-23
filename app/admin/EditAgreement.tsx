"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Agreement,
  AgreementStatus,
  JurisdictionStatusType,
} from "@/lib/types";
import { AGREEMENT_STATUSES, JURISDICTIONS } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

export default function EditAgreement({
  agreement,
  onAgreementUpdated,
}: {
  agreement: Agreement;
  onAgreementUpdated?: (updatedAgreement: Agreement) => void;
}) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    description: "",
    status: "Awaiting Sponsorship" as AgreementStatus, // Set a default value
    deadline: "",
    sourceUrl: "",
    jurisdictions: [] as string[],
    jurisdictionStatuses: [] as Array<{
      name: string;
      status: JurisdictionStatusType;
      notes: string;
    }>,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when agreement prop changes
  useEffect(() => {
    if (agreement) {
      const initialFormData = {
        title: agreement.title,
        summary: agreement.summary,
        description: agreement.description,
        status: agreement.status,
        deadline: agreement.deadline || "",
        sourceUrl: agreement.sourceUrl || "",
        jurisdictions: agreement.jurisdictions,
        jurisdictionStatuses: agreement.jurisdictionStatuses || [],
      };
      setFormData(initialFormData);
    }
  }, [agreement]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleJurisdictionToggle = (jurisdiction: string) => {
    setFormData((prev) => {
      const isSelected = prev.jurisdictions.includes(jurisdiction);
      let newJurisdictions: string[];

      if (isSelected) {
        newJurisdictions = prev.jurisdictions.filter((j) => j !== jurisdiction);
        // Remove from jurisdictionStatuses as well
        const newJurisdictionStatuses = prev.jurisdictionStatuses.filter(
          (js) => js.name !== jurisdiction,
        );
        return {
          ...prev,
          jurisdictions: newJurisdictions,
          jurisdictionStatuses: newJurisdictionStatuses,
        };
      } else {
        newJurisdictions = [...prev.jurisdictions, jurisdiction];
        // Add to jurisdictionStatuses with default values
        const newJurisdictionStatuses = [
          ...prev.jurisdictionStatuses,
          {
            name: jurisdiction,
            status: "Unknown" as JurisdictionStatusType,
            notes: "",
          },
        ];
        return {
          ...prev,
          jurisdictions: newJurisdictions,
          jurisdictionStatuses: newJurisdictionStatuses,
        };
      }
    });
  };

  const handleJurisdictionStatusChange = (
    jurisdictionName: string,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      jurisdictionStatuses: prev.jurisdictionStatuses.map((js) =>
        js.name === jurisdictionName ? { ...js, [field]: value } : js,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.summary ||
        !formData.description ||
        !formData.status
      ) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      if (formData.jurisdictions.length === 0) {
        toast({
          title: "No Jurisdictions",
          description: "Please select at least one jurisdiction.",
          variant: "destructive",
        });
        return;
      }

      // Create the updated agreement object
      const updatedAgreement: Omit<
        Agreement,
        "id" | "createdAt" | "updatedAt"
      > = {
        title: formData.title,
        summary: formData.summary,
        description: formData.description,
        status: formData.status,
        deadline: formData.deadline || null,
        sourceUrl: formData.sourceUrl || null,
        jurisdictions: formData.jurisdictions,
        jurisdictionStatuses: formData.jurisdictionStatuses,
      };

      // Send the updated agreement to the API
      const response = await fetch(
        `/trade-barriers/api/agreements/${agreement.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAgreement),
        },
      );

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // If we can't parse the response, use the default error message
          console.error("Could not parse error response:", parseError);
        }

        throw new Error(errorMessage);
      }

      // Update the local agreement with the new agreement data
      const finalUpdatedAgreement = {
        ...agreement,
        ...updatedAgreement,
        updatedAt: new Date().toISOString(),
      };

      toast({
        title: "Success!",
        description: "Agreement has been updated successfully.",
      });

      // Update the parent component
      if (onAgreementUpdated) {
        onAgreementUpdated(finalUpdatedAgreement);
      }
    } catch (error) {
      console.error("Error updating agreement:", error);

      // Extract error message based on error type
      let errorMessage = "Failed to update agreement. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as any).message; // eslint-disable-line @typescript-eslint/no-explicit-any
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Brief title for the agreement"
              className="border-[#d3c7b9]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <Select
              key={formData.status}
              value={formData.status}
              onValueChange={(value) =>
                handleInputChange("status", value as AgreementStatus)
              }
              required
            >
              <SelectTrigger className="border-[#d3c7b9]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AGREEMENT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Summary *
          </label>
          <Input
            value={formData.summary}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("summary", e.target.value)
            }
            placeholder="One sentence summary of the agreement"
            className="border-[#d3c7b9]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <Input
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("description", e.target.value)
            }
            placeholder="Detailed description (3-5 sentences)"
            className="border-[#d3c7b9]"
            required
          />
        </div>

        {/* Deadline and Source URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange("deadline", e.target.value)}
              className="border-[#d3c7b9]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source URL
            </label>
            <Input
              type="url"
              value={formData.sourceUrl}
              onChange={(e) => handleInputChange("sourceUrl", e.target.value)}
              placeholder="https://..."
              className="border-[#d3c7b9]"
            />
          </div>
        </div>

        {/* Jurisdictions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Jurisdictions *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {JURISDICTIONS.map((jurisdiction) => (
              <label
                key={jurisdiction}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.jurisdictions.includes(jurisdiction)}
                  onChange={() => handleJurisdictionToggle(jurisdiction)}
                  className="rounded border-[#d3c7b9] text-primary focus:ring-primary hover:bg-primary/10"
                />
                <span className="text-sm text-gray-700">{jurisdiction}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Jurisdiction Statuses */}
        {formData.jurisdictions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Jurisdiction Status Details
            </label>
            <div className="space-y-3">
              {formData.jurisdictionStatuses.map((js) => (
                <div
                  key={js.name}
                  className="p-3 border border-[#d3c7b9] rounded-md"
                >
                  <div className="font-medium text-gray-900 mb-2">
                    {js.name}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Status
                      </label>
                      <Select
                        value={js.status}
                        onValueChange={(value) =>
                          handleJurisdictionStatusChange(
                            js.name,
                            "status",
                            value as JurisdictionStatusType,
                          )
                        }
                      >
                        <SelectTrigger className="border-[#d3c7b9] text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                          <SelectItem value="Aware">Aware</SelectItem>
                          <SelectItem value="Considering">
                            Considering
                          </SelectItem>
                          <SelectItem value="Engaged">Engaged</SelectItem>
                          <SelectItem value="Committed">Committed</SelectItem>
                          <SelectItem value="Implementing">
                            Implementing
                          </SelectItem>
                          <SelectItem value="Complete">Complete</SelectItem>
                          <SelectItem value="Declined">Declined</SelectItem>
                          <SelectItem value="Not Applicable">
                            Not Applicable
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Notes
                      </label>
                      <Input
                        value={js.notes}
                        onChange={(e) =>
                          handleJurisdictionStatusChange(
                            js.name,
                            "notes",
                            e.target.value,
                          )
                        }
                        placeholder="Additional context"
                        className="border-[#d3c7b9] text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#d3c7b9]">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2"
          >
            {isSubmitting ? "Updating..." : "Update Agreement"}
          </Button>
        </div>
      </form>
    </div>
  );
}
