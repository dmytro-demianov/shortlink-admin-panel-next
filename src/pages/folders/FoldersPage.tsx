
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertCircle } from "lucide-react";
import { FoldersList } from "@/components/folders/FoldersList";
import { CreateFolderDialog } from "@/components/folders/CreateFolderDialog";
import { useQuery } from "@tanstack/react-query";
import { foldersApi } from "@/services/api";
import { Folder } from "@/types";

// Mock folders data for development
const mockFolders: Folder[] = [
  { id: "1", userId: "user1", name: "Personal", createdAt: "2023-01-15T08:30:00Z" },
  { id: "2", userId: "user1", name: "Work", createdAt: "2023-01-20T14:45:00Z" },
  { id: "3", userId: "user1", name: "Archive", createdAt: "2023-02-05T11:20:00Z" },
];

export const FoldersPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { 
    data: apiFolders = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['folders'],
    queryFn: foldersApi.getAll,
    retry: 1, // Only retry once to prevent excessive retries on API failure
  });
  
  // Use mock data if API request fails, otherwise use the API data
  const folders = error ? mockFolders : apiFolders as Folder[];
  
  const handleFolderCreated = () => {
    refetch();
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Folders</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Unable to connect to the folder service. Using sample data instead.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Folders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !error ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No folders found.</p>
              <p className="text-sm">Create a folder to organize your links.</p>
            </div>
          ) : (
            <FoldersList folders={folders} onFolderUpdated={refetch} />
          )}
        </CardContent>
      </Card>

      <CreateFolderDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
        onFolderCreated={handleFolderCreated}
      />
    </div>
  );
};
