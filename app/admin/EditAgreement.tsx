"use client";

import { useState, useEffect } from "react";
import {
  Agreement,
  AgreementFormData,
  AgreementHistory,
  Jurisdiction,
  Theme,
  AgreementStatus,
} from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import AgreementForm from "@/components/AgreementForm";

export default function EditAgreement({
  agreement,
  onAgreementUpdated,
}: {
  agreement: Agreement;
  onAgreementUpdated?: (updatedAgreement: Agreement) => void;
}) {
  const [formData, setFormData] = useState<AgreementFormData>({
    title: "",
    summary: "",
    description: "",
    status: "Awaiting Sponsorship" as AgreementStatus,
    deadline: "",
    source_url: "",
    jurisdictions: [] as Jurisdiction[],
    launch_date: "",
    theme: "" as Theme,
    agreement_history: [] as AgreementHistory[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when agreement prop changes
  useEffect(() => {
    if (agreement) {
      const initialFormData: AgreementFormData = {
        title: agreement.title,
        summary: agreement.summary,
        description: agreement.description,
        status: agreement.status,
        deadline: agreement.deadline || "",
        source_url: agreement.source_url || "",
        jurisdictions: agreement.jurisdictions,
        launch_date: agreement.launch_date || "",
        theme: agreement.theme,
        agreement_history: agreement.agreement_history,
      };
      setFormData(initialFormData);
    }
  }, [agreement]);

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

      // Validate history entries
      for (let i = 0; i < formData.agreement_history.length; i++) {
        const history = formData.agreement_history[i];
        if (!history.status || !history.date_entered) {
          toast({
            title: "Invalid History Entry",
            description: `History entry #${i + 1} is missing required fields (status and date).`,
            variant: "destructive",
          });
          return;
        }
      }

      // Create the updated agreement object
      const updatedAgreement: Omit<
        Agreement,
        "id" | "created_at" | "updated_at"
      > = {
        title: formData.title,
        summary: formData.summary,
        description: formData.description,
        status: formData.status,
        deadline: formData.deadline || null,
        source_url: formData.source_url || null,
        jurisdictions: formData.jurisdictions,
        launch_date: formData.launch_date || null,
        theme: formData.theme,
        agreement_history: formData.agreement_history,
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
    <AgreementForm
      formData={formData}
      onFormDataChange={handleFormDataChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Update Agreement"
    />
  );
}
