
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateLinkForm } from "@/components/links/CreateLinkForm";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CreateLinkPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/links">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Links</span>
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Create New Link</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Short URL</CardTitle>
          <CardDescription>
            Create a new shortened URL link that you can share with anyone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateLinkForm />
        </CardContent>
      </Card>
    </div>
  );
};
