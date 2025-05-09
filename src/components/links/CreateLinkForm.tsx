
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Info, LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Folder, Tag } from "@/types";
import { linksApi } from "@/services/api";
import { getAllFolders, getAllTags } from "@/services/mockData";

// Form schema
const createLinkSchema = z.object({
  originalUrl: z.string().url({ message: "Please enter a valid URL" }),
  shortCode: z.string().optional(),
  folderId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  password: z.string().optional(),
  expireAt: z.date().optional().nullable(),
  clickLimit: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().default(true),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

type CreateLinkFormValues = z.infer<typeof createLinkSchema>;

export function CreateLinkForm() {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Initialize form
  const form = useForm<CreateLinkFormValues>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      originalUrl: "",
      shortCode: "",
      folderId: undefined,
      tags: [],
      password: "",
      expireAt: null,
      clickLimit: null,
      isActive: true,
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
    },
  });

  // Load folders and tags
  useState(() => {
    const fetchData = async () => {
      try {
        const [foldersData, tagsData] = await Promise.all([
          getAllFolders(),
          getAllTags(),
        ]);
        setFolders(foldersData);
        setTags(tagsData);
      } catch (error) {
        console.error("Failed to load form data:", error);
        toast({
          title: "Error",
          description: "Failed to load folders and tags",
          variant: "destructive",
        });
      }
    };

    fetchData();
  });

  // Handle form submission
  const onSubmit = async (data: CreateLinkFormValues) => {
    setIsLoading(true);
    try {
      // Format UTM parameters if any are provided
      const utmParams: Record<string, string> = {};
      if (data.utmSource) utmParams.source = data.utmSource;
      if (data.utmMedium) utmParams.medium = data.utmMedium;
      if (data.utmCampaign) utmParams.campaign = data.utmCampaign;

      // Prepare link data
      const linkData = {
        originalUrl: data.originalUrl,
        shortCode: data.shortCode || undefined, // Let server generate if empty
        folderId: data.folderId || null,
        passwordHash: data.password || null,
        expireAt: data.expireAt || null,
        clickLimit: data.clickLimit || null,
        isActive: data.isActive,
        utmParams: Object.keys(utmParams).length > 0 ? utmParams : null,
        tags: data.tags || [],
      };

      // In a real app, we'd call the API here
      // const response = await linksApi.create(linkData);
      
      // Mock successful creation for now
      console.log("Creating link with data:", linkData);
      
      toast({
        title: "Link created",
        description: "Your shortened link has been created successfully",
      });
      
      // Navigate back to links page
      navigate("/links");
    } catch (error) {
      console.error("Failed to create link:", error);
      toast({
        title: "Error",
        description: "Failed to create the link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Original URL */}
        <FormField
          control={form.control}
          name="originalUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Original URL*</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/your-long-url" {...field} />
              </FormControl>
              <FormDescription>
                The original URL you want to shorten.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Custom Short Code */}
        <FormField
          control={form.control}
          name="shortCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Short Code</FormLabel>
              <FormControl>
                <Input placeholder="custom-code" {...field} />
              </FormControl>
              <FormDescription>
                Optional. Leave empty to generate automatically.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Folder */}
        <FormField
          control={form.control}
          name="folderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a folder" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no-folder">No Folder</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Organize your link in a folder.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Toggle advanced options */}
        <div className="border-t pt-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>
        </div>

        {showAdvanced && (
          <div className="space-y-6 border rounded-md p-4 bg-gray-50">
            {/* Password Protection */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Protection</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter a password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional. Protect this link with a password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expiration Date */}
            <FormField
              control={form.control}
              name="expireAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiration Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Optional. Link will expire after this date.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Click Limit */}
            <FormField
              control={form.control}
              name="clickLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Click Limit</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Maximum clicks allowed" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)} 
                      value={field.value?.toString() || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional. Link will be deactivated after reaching this number of clicks.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* UTM Parameters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">UTM Parameters</h3>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="utmSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <FormControl>
                        <Input placeholder="google" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="utmMedium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medium</FormLabel>
                      <FormControl>
                        <Input placeholder="cpc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="utmCampaign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign</FormLabel>
                      <FormControl>
                        <Input placeholder="spring_sale" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Is Active */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Active
                    </FormLabel>
                    <FormDescription>
                      This link will be active and can be used immediately.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" type="button" asChild>
            <Link to="/links">Cancel</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-brand-600 hover:bg-brand-700"
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Create Link
          </Button>
        </div>
      </form>
    </Form>
  );
}
