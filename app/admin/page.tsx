"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NavButton from "@/components/NavButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { LogOut, Plus } from "lucide-react";
import AddAgreement from "./AddAgreement";
import { Agreement } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import AgreementsList from "@/components/AgreementsList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminPage() {
  const { signOut, user } = useAuth();
  const [data, setData] = useState<Agreement[]>([]); // All the agreements
  const [filteredData, setFilteredData] = useState<Agreement[]>([]); // Filtered agreements for display
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetch("/trade-barriers/api/agreements")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(data); // Default to no filters applied
      })
      .catch(() => {
        console.error("Error fetching agreements");
        toast({
          title: "Error",
          description: "Failed to fetch agreements. Please try again later.",
          variant: "destructive",
        });
      });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAgreementAdded = (newAgreement: Agreement) => {
    setData([...data, newAgreement]);
    setFilteredData([...filteredData, newAgreement]);
    setIsAddModalOpen(false); // Close the modal after successful addition
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f6ebe3] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <NavButton />
              <h1 className="text-3xl font-bold font-soehne">
                Admin Dashboard
              </h1>
              <div className="ml-auto flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user?.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content - Agreements List */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Agreements</h2>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Agreement
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <AgreementsList agreements={filteredData} />
            </div>
          </div>

          {/* Add Agreement Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-[#d3c7b9] p-6 rounded-md">
              <DialogHeader>
                <DialogTitle>Add New Agreement</DialogTitle>
              </DialogHeader>
              <AddAgreement onAgreementAdded={handleAgreementAdded} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}
