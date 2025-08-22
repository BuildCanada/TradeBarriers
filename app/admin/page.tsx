"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Commitment, CommitmentStatus, JurisdictionStatusType } from "@/lib/types";
import { COMMITMENT_STATUSES, JURISDICTIONS } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import NavButton from "@/components/NavButton";

export default function AdminPage() {
    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        description: "",
        status: "" as CommitmentStatus,
        deadline: "",
        sourceUrl: "",
        jurisdictions: [] as string[],
        jurisdictionStatuses: [] as Array<{
            name: string;
            status: JurisdictionStatusType;
            notes: string;
        }>
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleJurisdictionToggle = (jurisdiction: string) => {
        setFormData(prev => {
            const isSelected = prev.jurisdictions.includes(jurisdiction);
            let newJurisdictions: string[];

            if (isSelected) {
                newJurisdictions = prev.jurisdictions.filter(j => j !== jurisdiction);
                // Remove from jurisdictionStatuses as well
                const newJurisdictionStatuses = prev.jurisdictionStatuses.filter(js => js.name !== jurisdiction);
                return {
                    ...prev,
                    jurisdictions: newJurisdictions,
                    jurisdictionStatuses: newJurisdictionStatuses
                };
            } else {
                newJurisdictions = [...prev.jurisdictions, jurisdiction];
                // Add to jurisdictionStatuses with default values
                const newJurisdictionStatuses = [...prev.jurisdictionStatuses, {
                    name: jurisdiction,
                    status: "Unknown" as JurisdictionStatusType,
                    notes: ""
                }];
                return {
                    ...prev,
                    jurisdictions: newJurisdictions,
                    jurisdictionStatuses: newJurisdictionStatuses
                };
            }
        });
    };

    const handleJurisdictionStatusChange = (jurisdictionName: string, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            jurisdictionStatuses: prev.jurisdictionStatuses.map(js =>
                js.name === jurisdictionName
                    ? { ...js, [field]: value }
                    : js
            )
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate required fields
            if (!formData.title || !formData.summary || !formData.description || !formData.status) {
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

            // Create the commitment object
            const newCommitment: Omit<Commitment, 'id' | 'createdAt' | 'updatedAt'> = {
                title: formData.title,
                summary: formData.summary,
                description: formData.description,
                status: formData.status,
                deadline: formData.deadline || null,
                sourceUrl: formData.sourceUrl || null,
                jurisdictions: formData.jurisdictions,
                jurisdictionStatuses: formData.jurisdictionStatuses
            };

            // Send the commitment to the API
            const response = await fetch("/trade-barriers/api/commitments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCommitment)
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
                    console.log("Could not parse error response:", parseError);
                }

                throw new Error(errorMessage);
            }

            toast({
                title: "Success!",
                description: "Commitment has been added successfully.",
            });

            // Reset form
            setFormData({
                title: "",
                summary: "",
                description: "",
                status: "" as CommitmentStatus,
                deadline: "",
                sourceUrl: "",
                jurisdictions: [],
                jurisdictionStatuses: []
            });

        } catch (error) {
            console.log("Error submitting commitment:", error);
            console.log(typeof error);

            // Extract error message based on error type
            let errorMessage = "Failed to add commitment. Please try again.";

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object' && 'message' in error) {
                errorMessage = (error as any).message;
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
        <div className="min-h-screen bg-[#f6ebe3] p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <NavButton />
                        <h1 className="text-3xl font-bold font-soehne">
                            Add New Commitment
                        </h1>
                    </div>
                </div>
                <p className="text-gray-600 text-center">
                    Use this form to add new trade barrier commitments to the system.
                </p>

                <Card className="bg-white border-[#d3c7b9]">
                    <CardHeader>
                        <CardTitle className="text-xl text-[#272727]">Commitment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Brief title for the commitment"
                                        className="border-[#d3c7b9]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status *
                                    </label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleInputChange('status', value as CommitmentStatus)}
                                        required
                                    >
                                        <SelectTrigger className="border-[#d3c7b9]">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COMMITMENT_STATUSES.map(status => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Summary *
                                </label>
                                <Input
                                    value={formData.summary}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('summary', e.target.value)}
                                    placeholder="One sentence summary of the commitment"
                                    className="border-[#d3c7b9]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <Input
                                    value={formData.description}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value)}
                                    placeholder="Detailed description (3-5 sentences)"
                                    className="border-[#d3c7b9]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Deadline
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => handleInputChange('deadline', e.target.value)}
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
                                        onChange={(e) => handleInputChange('sourceUrl', e.target.value)}
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
                                    {JURISDICTIONS.map(jurisdiction => (
                                        <label key={jurisdiction} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.jurisdictions.includes(jurisdiction)}
                                                onChange={() => handleJurisdictionToggle(jurisdiction)}
                                                className="rounded border-[#d3c7b9] text-primary focus:ring-primary"
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
                                        {formData.jurisdictionStatuses.map((js, index) => (
                                            <div key={js.name} className="p-3 border border-[#d3c7b9] rounded-md">
                                                <div className="font-medium text-gray-900 mb-2">{js.name}</div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Status</label>
                                                        <Select
                                                            value={js.status}
                                                            onValueChange={(value) => handleJurisdictionStatusChange(js.name, 'status', value as JurisdictionStatusType)}
                                                        >
                                                            <SelectTrigger className="border-[#d3c7b9] text-sm">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Unknown">Unknown</SelectItem>
                                                                <SelectItem value="Aware">Aware</SelectItem>
                                                                <SelectItem value="Considering">Considering</SelectItem>
                                                                <SelectItem value="Engaged">Engaged</SelectItem>
                                                                <SelectItem value="Committed">Committed</SelectItem>
                                                                <SelectItem value="Implementing">Implementing</SelectItem>
                                                                <SelectItem value="Complete">Complete</SelectItem>
                                                                <SelectItem value="Declined">Declined</SelectItem>
                                                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Notes</label>
                                                        <Input
                                                            value={js.notes}
                                                            onChange={(e) => handleJurisdictionStatusChange(js.name, 'notes', e.target.value)}
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
                                    {isSubmitting ? "Adding..." : "Add Commitment"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}