
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteTagDialog } from "./DeleteTagDialog";
import { Tag } from "@/types";

interface TagActionsProps {
  tag: Tag;
  onEdit: () => void;
  onTagUpdated: () => void;
}

export const TagActions = ({ tag, onEdit, onTagUpdated }: TagActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DeleteTagDialog 
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        tag={tag}
        onTagDeleted={onTagUpdated}
      />
    </>
  );
};
