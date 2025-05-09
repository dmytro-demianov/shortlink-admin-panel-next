
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { foldersApi } from "@/services/api";
import { Folder } from "@/types";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(50, "Folder name cannot exceed 50 characters")
});

interface EditFolderDialogProps {
  folder: Folder;
  isOpen: boolean;
  onClose: () => void;
  onFolderUpdated: () => void;
}

export const EditFolderDialog = ({ 
  folder, 
  isOpen, 
  onClose, 
  onFolderUpdated 
}: EditFolderDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: folder.name,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await foldersApi.rename(folder.id, values.name);
      toast.success("Folder updated successfully");
      onFolderUpdated();
    } catch (error) {
      toast.error("Failed to update folder");
      console.error("Error updating folder:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Folder</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
