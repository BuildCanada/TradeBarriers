"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NavButton from "@/components/NavButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { LogOut, Plus, Search } from "lucide-react";
import AddAgreement from "./AddAgreement";
import { Agreement } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import AgreementsList from "@/components/AgreementsList";
import ThemeManagement from "@/components/ThemeManagement";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleAgreementDeleted = (deletedId: string) => {
    setData(data.filter((agreement) => agreement.id !== deletedId));
    setFilteredData(
      filteredData.filter((agreement) => agreement.id !== deletedId),
    );
  };

  const handleAgreementUpdated = (updatedAgreement: Agreement) => {
    setData(
      data.map((agreement) =>
        agreement.id === updatedAgreement.id ? updatedAgreement : agreement,
      ),
    );
    setFilteredData(
      filteredData.map((agreement) =>
        agreement.id === updatedAgreement.id ? updatedAgreement : agreement,
      ),
    );
  };

  // Filter agreements based on search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const filtered = data.filter((agreement) =>
        agreement.title.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Show all agreements if search is empty
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f6ebe3] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            {/* Desktop layout - keep as is */}
            <div className="hidden md:flex items-center gap-4 mb-4">
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

            {/* Mobile layout - welcome text on its own row */}
            <div className="md:hidden">
              <div className="flex items-center gap-4 mb-4">
                <NavButton />
                <h1 className="text-3xl font-bold font-soehne">
                  Admin Dashboard
                </h1>
              </div>
              <div className="flex items-center justify-between">
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
            {/* Desktop layout */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold">Agreements</h2>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search agreements by title..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 border-[#d3c7b9] bg-white"
                />
              </div>
            </div>

            {/* Mobile layout - search bar on its own row */}
            <div className="md:hidden mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-semibold">Agreements</h2>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {/* Search Bar - full width on mobile */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search agreements by title..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 border-[#d3c7b9] bg-white"
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Sidebar - Theme Management */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <ThemeManagement />
              </div>

              {/* Right Content - Agreements List */}
              <div className="flex-1">
                <AgreementsList
                  agreements={filteredData}
                  onAgreementDeleted={handleAgreementDeleted}
                  onAgreementUpdated={handleAgreementUpdated}
                  isAdmin={true}
                />
              </div>
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
