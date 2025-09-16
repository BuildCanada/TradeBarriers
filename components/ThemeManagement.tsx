"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Plus, Tag, Edit2, Check, X } from "lucide-react";
import { authenticatedFetch } from "@/lib/api-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Theme {
  id: string;
  name: string;
}

export default function ThemeManagement() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newThemeName, setNewThemeName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [themeToDelete, setThemeToDelete] = useState<Theme | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch themes on component mount
  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch("/trade-barriers/api/themes");
      if (response.ok) {
        const themesData = await response.json();
        setThemes(themesData);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch themes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching themes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch themes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeName.trim()) return;

    setIsAdding(true);
    try {
      const response = await authenticatedFetch("/trade-barriers/api/themes", {
        method: "POST",
        body: JSON.stringify({ name: newThemeName.trim() }),
      });

      if (response.ok) {
        const result = await response.json();
        setThemes((prev) =>
          [...prev, result.data].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setNewThemeName("");
        toast({
          title: "Success!",
          description: "Theme added successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to add theme",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding theme:", error);
      toast({
        title: "Error",
        description: "Failed to add theme",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTheme = async () => {
    if (!themeToDelete) return;

    setIsDeleting(true);
    try {
      const response = await authenticatedFetch(
        `/trade-barriers/api/themes/${themeToDelete.id}?name=${themeToDelete.name}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setThemes((prev) =>
          prev.filter((theme) => theme.id !== themeToDelete.id),
        );
        setThemeToDelete(null);
        toast({
          title: "Success!",
          description: "Theme deleted successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete theme",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting theme:", error);
      toast({
        title: "Error",
        description: "Failed to delete theme",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditTheme = (theme: Theme) => {
    setEditingTheme(theme);
    setEditingName(theme.name);
  };

  const handleCancelEdit = () => {
    setEditingTheme(null);
    setEditingName("");
  };

  const handleUpdateTheme = async () => {
    if (!editingTheme || !editingName.trim()) return;

    setIsUpdating(true);
    try {
      const response = await authenticatedFetch(
        `/trade-barriers/api/themes/${editingTheme.id}`,
        {
          method: "PUT",
          body: JSON.stringify({ name: editingName.trim() }),
        },
      );

      if (response.ok) {
        setThemes((prev) =>
          prev
            .map((theme) =>
              theme.id === editingTheme.id
                ? { ...theme, name: editingName.trim() }
                : theme,
            )
            .sort((a, b) => a.name.localeCompare(b.name)),
        );
        setEditingTheme(null);
        setEditingName("");
        toast({
          title: "Success!",
          description: "Theme updated successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to update theme",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating theme:", error);
      toast({
        title: "Error",
        description: "Failed to update theme",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Theme Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading themes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Theme Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Theme Form */}
          <form onSubmit={handleAddTheme} className="flex gap-2">
            <Input
              value={newThemeName}
              onChange={(e) => setNewThemeName(e.target.value)}
              placeholder="Theme..."
              className="flex-1"
              required
            />
            <Button type="submit" disabled={isAdding || !newThemeName.trim()}>
              <Plus className="w-4 h-4 mr-1" />
              {isAdding ? "Adding..." : "Add Theme"}
            </Button>
          </form>

          {/* Themes List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">
              Existing Themes
            </h3>
            {themes.length === 0 ? (
              <p className="text-sm text-gray-500">No themes found</p>
            ) : (
              <div className="space-y-2">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className="flex items-center gap-2 p-2 border rounded-md"
                  >
                    {editingTheme?.id === theme.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 h-8"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleUpdateTheme}
                          disabled={isUpdating || !editingName.trim()}
                          className="h-6 w-6 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Badge variant="outline" className="text-sm flex-1">
                          {theme.name}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTheme(theme)}
                          className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setThemeToDelete(theme)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!themeToDelete}
        onOpenChange={() => setThemeToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Theme</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the theme &quot;
              {themeToDelete?.name}&quot;? This action cannot be undone and will
              only work if no agreements are using this theme.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setThemeToDelete(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteTheme}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
