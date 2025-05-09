
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { tagsApi } from "@/services/api";
import { Tag } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50, "Tag name can't exceed 50 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditTagDialogProps {
  tag: Tag;
  isOpen: boolean;
  onClose: () => void;
  onTagUpdated: () => void;
}

export const EditTagDialog = ({
  tag,
  isOpen,
  onClose,
  onTagUpdated,
}: EditTagDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tag.name,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (values.name === tag.name) {
      onClose();
      return;
    }
    
    setIsSubmitting(true);
    try {
      await tagsApi.rename(tag.id, values.name);
      toast.success("Tag renamed successfully");
      onTagUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to rename tag:", error);
      toast.error("Failed to rename tag. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
          <DialogDescription>
            Update the tag name below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
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
