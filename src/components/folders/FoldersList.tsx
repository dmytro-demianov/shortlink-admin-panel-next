
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FolderActions } from "./FolderActions";
import { Folder } from "@/types";
import { EditFolderDialog } from "./EditFolderDialog";
import { toast } from "sonner";

interface FoldersListProps {
  folders: Folder[];
  onFolderUpdated: () => void;
}

export const FoldersList = ({ folders, onFolderUpdated }: FoldersListProps) => {
  const [folderToEdit, setFolderToEdit] = useState<Folder | null>(null);
  
  const countLinksInFolder = (folderId: string) => {
    // This is a mock implementation - in a real app, this would come from the API
    return Math.floor(Math.random() * 10);
  };
  
  const handleError = (error: any) => {
    console.error("Error in FoldersList:", error);
    toast.error("An error occurred while performing this action");
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Links</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folders.map((folder) => (
            <TableRow key={folder.id}>
              <TableCell className="font-medium">{folder.name}</TableCell>
              <TableCell>
                {new Date(folder.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {countLinksInFolder(folder.id)} links
              </TableCell>
              <TableCell className="text-right">
                <FolderActions 
                  folder={folder} 
                  onEdit={() => setFolderToEdit(folder)} 
                  onFolderUpdated={onFolderUpdated} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {folderToEdit && (
        <EditFolderDialog
          folder={folderToEdit}
          isOpen={!!folderToEdit}
          onClose={() => setFolderToEdit(null)}
          onFolderUpdated={() => {
            onFolderUpdated();
            setFolderToEdit(null);
          }}
        />
      )}
    </>
  );
};
