
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { tagsApi } from "@/services/api";
import { Tag } from "@/types";

interface DeleteTagDialogProps {
  tag: Tag;
  isOpen: boolean;
  onClose: () => void;
  onTagDeleted: () => void;
}

export const DeleteTagDialog = ({ 
  tag, 
  isOpen, 
  onClose, 
  onTagDeleted 
}: DeleteTagDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await tagsApi.delete(tag.id);
      toast.success("Tag deleted successfully");
      onTagDeleted();
      onClose();
    } catch (error) {
      console.error("Failed to delete tag:", error);
      toast.error("Failed to delete tag. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the tag "{tag.name}" and remove it from all links.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
