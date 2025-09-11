"use client";

import { useState } from "react";
import {
  Agreement,
  AgreementFormData,
  Theme,
  Jurisdiction,
  AgreementStatus,
} from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { generateJurisdictions } from "@/lib/utils";
import AgreementForm from "@/components/AgreementForm";

export default function AddAgreement({
  onAgreementAdded,
}: {
  onAgreementAdded?: (newAgreement: Agreement) => void;
}) {
  const [formData, setFormData] = useState<AgreementFormData>({
    title: "",
    summary: "",
    description: "",
    status: "" as AgreementStatus,
    deadline: "",
    source_url: "",
    launch_date: "",
    theme: "" as Theme,
    jurisdictions: generateJurisdictions() as Jurisdiction[],
    agreement_history: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormDataChange = (data: AgreementFormData) => {
    setFormData(data);
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

      // Create the agreement object
      const newAgreement: Omit<Agreement, "id" | "created_at" | "updated_at"> =
        {
          title: formData.title,
          summary: formData.summary,
          description: formData.description,
          status: formData.status,
          deadline: formData.deadline || null,
          source_url: formData.source_url || null,
          launch_date: formData.launch_date || null,
          theme: formData.theme,
          jurisdictions: formData.jurisdictions,
          agreement_history: formData.agreement_history,
        };

      // Send the agreement to the API
      const response = await fetch("/trade-barriers/api/agreements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAgreement),
      });

      if (!response.ok) {
        // Try to get error message from response body
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

      toast({
        title: "Success!",
        description: "Agreement has been added successfully.",
      });

      // Add the new agreement to the current list (to prevent unnecessary api call)
      const newAgreementData = await response.json();
      onAgreementAdded?.(newAgreementData.data);

      // Reset form
      setFormData({
        title: "",
        summary: "",
        description: "",
        status: "" as AgreementStatus,
        deadline: "",
        source_url: "",
        launch_date: "",
        jurisdictions: generateJurisdictions() as Jurisdiction[],
        theme: "" as Theme,
        agreement_history: [],
      });
    } catch (error) {
      console.error("Error submitting agreement:", error);

      // Extract error message based on error type
      let errorMessage = "Failed to add agreement. Please try again.";

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
    <AgreementForm
      formData={formData}
      onFormDataChange={handleFormDataChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Add Agreement"
    />
  );
}
