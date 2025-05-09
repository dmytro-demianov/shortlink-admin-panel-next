
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TagActions } from "./TagActions";
import { Tag } from "@/types";
import { EditTagDialog } from "./EditTagDialog";
import { toast } from "sonner";

interface TagsListProps {
  tags: Tag[];
  onTagUpdated: () => void;
}

export const TagsList = ({ tags, onTagUpdated }: TagsListProps) => {
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  
  const handleError = (error: any) => {
    console.error("Error in TagsList:", error);
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
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell className="font-medium">{tag.name}</TableCell>
              <TableCell>
                {tag.createdAt && new Date(tag.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {Math.floor(Math.random() * 10)} links {/* Mock data - in production would use real counts */}
              </TableCell>
              <TableCell className="text-right">
                <TagActions 
                  tag={tag} 
                  onEdit={() => setTagToEdit(tag)} 
                  onTagUpdated={onTagUpdated} 
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {tagToEdit && (
        <EditTagDialog
          tag={tagToEdit}
          isOpen={!!tagToEdit}
          onClose={() => setTagToEdit(null)}
          onTagUpdated={() => {
            onTagUpdated();
            setTagToEdit(null);
          }}
        />
      )}
    </>
  );
};
