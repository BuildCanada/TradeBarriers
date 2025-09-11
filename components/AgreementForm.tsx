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
  AgreementFormData,
  AgreementHistory,
  AgreementStatus,
  JurisdictionStatus,
} from "@/lib/types";
import { AGREEMENT_STATUSES } from "@/lib/types";

interface AgreementFormProps {
  formData: AgreementFormData;
  onFormDataChange: (data: AgreementFormData) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText: string;
}

// This form is shared between AddAgreement and EditAgreement. Main difference is what happens when the form is submitted.
export default function AgreementForm({
  formData,
  onFormDataChange,
  onSubmit,
  isSubmitting,
  submitButtonText,
}: AgreementFormProps) {
  const [availableThemes, setAvailableThemes] = useState<string[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);

  // Fetch available themes on component mount
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch("/trade-barriers/api/themes");
        if (response.ok) {
          const themesData = await response.json();
          setAvailableThemes(themesData.map((theme: any) => theme.name)); // eslint-disable-line @typescript-eslint/no-explicit-any
        }
      } catch (error) {
        console.error("Error fetching themes:", error);
      } finally {
        setIsLoadingThemes(false);
      }
    };

    fetchThemes();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  const handleJurisdictionStatusChange = (
    jurisdictionName: string,
    field: string,
    value: string,
  ) => {
    onFormDataChange({
      ...formData,
      jurisdictions: formData.jurisdictions.map((js) =>
        js.name === jurisdictionName ? { ...js, [field]: value } : js,
      ),
    });
  };

  const handleHistoryChange = (index: number, field: string, value: string) => {
    onFormDataChange({
      ...formData,
      agreement_history: formData.agreement_history.map((history, i) =>
        i === index ? { ...history, [field]: value } : history,
      ),
    });
  };

  const addHistoryEntry = () => {
    const newHistoryEntry: AgreementHistory = {
      status: "Awaiting Sponsorship" as AgreementStatus,
      date_entered: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    };

    onFormDataChange({
      ...formData,
      agreement_history: [...formData.agreement_history, newHistoryEntry],
    });
  };

  const removeHistoryEntry = (index: number) => {
    onFormDataChange({
      ...formData,
      agreement_history: formData.agreement_history.filter(
        (_, i) => i !== index,
      ),
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-6">
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
                {AGREEMENT_STATUSES.map((status: AgreementStatus) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <Select
              key={formData.theme}
              value={formData.theme}
              onValueChange={(value) => handleInputChange("theme", value)}
              disabled={isLoadingThemes}
            >
              <SelectTrigger className="border-[#d3c7b9]">
                <SelectValue
                  placeholder={
                    isLoadingThemes ? "Loading themes..." : "Select theme"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableThemes.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingThemes && (
              <p className="text-xs text-gray-500 mt-1">
                Loading existing themes...
              </p>
            )}
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

        {/* Deadline and Source URL and Launch Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.status === "Implemented" ? "Completed" : "Deadline"}
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
              Launch Date
            </label>
            <Input
              type="date"
              value={formData.launch_date}
              onChange={(e) => handleInputChange("launch_date", e.target.value)}
              className="border-[#d3c7b9]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source URL
            </label>
            <Input
              type="url"
              value={formData.source_url}
              onChange={(e) => handleInputChange("source_url", e.target.value)}
              placeholder="https://..."
              className="border-[#d3c7b9]"
            />
          </div>
        </div>

        {/* Jurisdiction Statuses */}
        {formData.jurisdictions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Jurisdiction Status Details
            </label>
            <div className="space-y-3">
              {formData.jurisdictions.map((js) => (
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
                            value as JurisdictionStatus,
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

        {/* Agreement History - only show if enabled */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Agreement History
            </label>
            <Button
              type="button"
              onClick={addHistoryEntry}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
            >
              Add History Entry
            </Button>
          </div>

          {formData.agreement_history.length > 0 ? (
            <div className="space-y-3">
              {formData.agreement_history.map((history, index) => (
                <div
                  key={index}
                  className="p-3 border border-[#d3c7b9] rounded-md"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        Status
                      </label>
                      <Select
                        value={history.status}
                        onValueChange={(value) =>
                          handleHistoryChange(
                            index,
                            "status",
                            value as AgreementStatus,
                          )
                        }
                      >
                        <SelectTrigger className="border-[#d3c7b9] text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AGREEMENT_STATUSES.map((status: AgreementStatus) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">
                        Date Entered
                      </label>
                      <Input
                        type="date"
                        value={history.date_entered}
                        onChange={(e) =>
                          handleHistoryChange(
                            index,
                            "date_entered",
                            e.target.value,
                          )
                        }
                        className="border-[#d3c7b9] text-sm"
                        required
                      />
                    </div>
                    <div className="col-span-1 md:col-span-1 flex items-end">
                      <Button
                        type="button"
                        onClick={() => removeHistoryEntry(index)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-1 py-0.5 w-full h-10"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 border border-[#d3c7b9] rounded-md">
              No history entries yet. Click &quot;Add History Entry&quot; to get
              started.
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#d3c7b9]">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2"
          >
            {isSubmitting ? "Processing..." : submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
