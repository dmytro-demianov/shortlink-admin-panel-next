
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TagsList } from "@/components/tags/TagsList";
import { CreateTagDialog } from "@/components/tags/CreateTagDialog";
import { tagsApi } from "@/services/api";
import { Tag } from "@/types";
import { Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const TagsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [mockTags, setMockTags] = useState<Tag[]>([
    {
      id: "1",
      name: "Marketing",
    },
    {
      id: "2",
      name: "Social Media",
    },
    {
      id: "3",
      name: "Product",
    }
  ]);
  
  const [useMockData, setUseMockData] = useState(false);
  
  const { data: tags, refetch, isLoading, error } = useQuery({
    queryKey: ["tags"],
    queryFn: tagsApi.getAll,
  });
  
  useEffect(() => {
    // If API returns HTML instead of JSON, use mock data
    if (error) {
      console.error("Error fetching tags, using mock data instead", error);
      setUseMockData(true);
    }
  }, [error]);
  
  const handleTagCreated = () => {
    if (useMockData) {
      // Generate a random ID and add to mock tags
      const newTag: Tag = {
        id: Math.random().toString(36).substr(2, 9),
        name: "New Tag " + Math.floor(Math.random() * 1000),
      };
      setMockTags([...mockTags, newTag]);
    } else {
      refetch();
    }
  };
  
  const handleTagUpdated = () => {
    if (useMockData) {
      // In a real app, we would update the specific tag
      // For mock, we'll just refresh the mock data
      setMockTags([...mockTags]);
    } else {
      refetch();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tag
        </Button>
      </div>
      
      {useMockData && (
        <Alert variant="warning">
          <AlertTitle>API Unavailable</AlertTitle>
          <AlertDescription>
            Using mock data. Tags operations will be simulated.
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading && !useMockData ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading tags...</span>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <TagsList 
            tags={useMockData ? mockTags : (tags || [])} 
            onTagUpdated={handleTagUpdated} 
          />
        </div>
      )}
      
      <CreateTagDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onTagCreated={handleTagCreated}
      />
    </div>
  );
};
