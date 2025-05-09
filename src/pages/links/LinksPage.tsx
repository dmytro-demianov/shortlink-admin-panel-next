
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Link as LinkIcon,
  BarChart2,
  QrCode,
  Edit,
  Trash2,
  Plus,
  Search,
  MoreHorizontal,
  ExternalLink,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Folder, Link as LinkType } from "@/types";
import {
  getAllLinks,
  getAllFolders,
  getFormattedTimeAgo,
  deleteLink,
} from "@/services/mockData";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const LinksPage = () => {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linksData, foldersData] = await Promise.all([
          getAllLinks(),
          getAllFolders(),
        ]);

        setLinks(linksData);
        setFolders(foldersData);
      } catch (error) {
        console.error("Failed to load links data:", error);
        toast({
          title: "Error",
          description: "Failed to load links. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLinks = useMemo(() => {
    let filtered = [...links];

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (link) =>
          link.shortCode.toLowerCase().includes(lowerCaseSearch) ||
          link.originalUrl.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Filter by folder
    if (folderFilter && folderFilter !== "all") {
      filtered = filtered.filter((link) => link.folderId === folderFilter);
    }

    return filtered;
  }, [links, searchTerm, folderFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLinks = filteredLinks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Find folder name by ID
  const getFolderName = (folderId: string | null): string => {
    if (!folderId) return "—";
    const folder = folders.find((f) => f.id === folderId);
    return folder ? folder.name : "Unknown";
  };

  // Handle link deletion
  const handleDeleteLink = async (id: string) => {
    try {
      await deleteLink(id);
      
      // Update state to remove the deleted link
      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
      
      toast({
        title: "Link deleted",
        description: "The link has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete link:", error);
      toast({
        title: "Error",
        description: "Failed to delete the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle copying short URL to clipboard
  const handleCopyShortUrl = (shortCode: string) => {
    const shortUrl = `https://short.url/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    
    toast({
      title: "URL copied",
      description: "Short URL copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto border-4 border-t-brand-500 border-opacity-25 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Links</h1>
        <Link to="/links/create">
          <Button className="bg-brand-600 hover:bg-brand-700">
            <Plus className="mr-2 h-4 w-4" />
            Create New Link
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Links</CardTitle>
          <CardDescription>
            Manage and track all your shortened links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search links..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <Select
              value={folderFilter}
              onValueChange={(value) => {
                setFolderFilter(value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Folders</SelectLabel>
                  <SelectItem value="all">All Folders</SelectItem>
                  <SelectItem value="">No Folder</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {paginatedLinks.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Short URL</TableHead>
                    <TableHead className="hidden md:table-cell">Original URL</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="w-[100px] text-right">Clicks</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Folder</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="h-4 w-4 text-brand-500" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span>{link.shortCode}</span>
                              <button
                                onClick={() => handleCopyShortUrl(link.shortCode)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 md:hidden">
                              {link.originalUrl.length > 30
                                ? link.originalUrl.substring(0, 30) + "..."
                                : link.originalUrl}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <span className="truncate max-w-[200px] lg:max-w-md">
                            {link.originalUrl}
                          </span>
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-500">
                        {getFormattedTimeAgo(link.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        {link.totalClicks.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {link.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-500 hover:bg-gray-100">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="truncate">
                          {getFolderName(link.folderId)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link to={`/links/${link.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/links/${link.id}/stats`}>
                                  <BarChart2 className="mr-2 h-4 w-4" />
                                  View Stats
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/qrcodes/${link.id}`}>
                                  <QrCode className="mr-2 h-4 w-4" />
                                  QR Code
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteLink(link.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="flex justify-center">
                <LinkIcon className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No links found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || folderFilter !== "all"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Get started by creating your first short link."}
              </p>
              {!searchTerm && folderFilter === "all" && (
                <Link to="/links/create">
                  <Button className="mt-4 bg-brand-600 hover:bg-brand-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Link
                  </Button>
                </Link>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredLinks.length > itemsPerPage && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    // Show current page, first, last, and 1 page before and after current
                    const shouldShow =
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - currentPage) <= 1;

                    if (!shouldShow) {
                      // Show ellipsis for gaps
                      if (
                        pageNumber === 2 ||
                        pageNumber === totalPages - 1
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <span className="px-1">...</span>
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={currentPage === pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
