
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FoldersList } from "@/components/folders/FoldersList";
import { CreateFolderDialog } from "@/components/folders/CreateFolderDialog";
import { useQuery } from "@tanstack/react-query";
import { foldersApi } from "@/services/api";
import { Folder } from "@/types";

export const FoldersPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { 
    data: folders = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['folders'],
    queryFn: foldersApi.getAll
  });
  
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

      <Card>
        <CardHeader>
          <CardTitle>Your Folders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No folders found.</p>
              <p className="text-sm">Create a folder to organize your links.</p>
            </div>
          ) : (
            <FoldersList folders={folders as Folder[]} onFolderUpdated={refetch} />
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
