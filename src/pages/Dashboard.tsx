
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart2, 
  Link as LinkIcon, 
  BarChart, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Folder,
  Tag
} from "lucide-react";
import { StatsSummary } from "@/types";
import { getStatsSummary, getAllLinks, getAllFolders, getAllTags } from "@/services/mockData";
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Dashboard = () => {
  const [summaryStats, setSummaryStats] = useState<StatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalFolders, setTotalFolders] = useState(0);
  const [totalTags, setTotalTags] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load stats summary
        const stats = await getStatsSummary() as StatsSummary;
        setSummaryStats(stats);
        
        // Load counts
        const links = await getAllLinks();
        setTotalLinks(links.length);
        
        const folders = await getAllFolders();
        setTotalFolders(folders.length);
        
        const tags = await getAllTags();
        setTotalTags(tags.length);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Prepare chart data
  const chartData = summaryStats ? Object.entries(summaryStats.clicksByDay)
    .slice(-14) // Last 14 days
    .map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      clicks: count
    }))
    .reverse() : [];
  
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto border-4 border-t-brand-500 border-opacity-25 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Link to="/links/create">
          <Button className="bg-brand-600 hover:bg-brand-700">
            <Plus className="mr-2 h-4 w-4" />
            Create New Link
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Links
            </CardTitle>
            <LinkIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLinks}</div>
            <p className="text-xs text-gray-500 mt-1">
              Active: {summaryStats?.activeLinks || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Clicks
            </CardTitle>
            <BarChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryStats?.totalClicks?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Folders
            </CardTitle>
            <Folder className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFolders}</div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Tags
            </CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTags}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Click Analytics</CardTitle>
            <CardDescription>
              Last 14 days of link traffic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} clicks`, 'Clicks']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar 
                    dataKey="clicks" 
                    fill="#0ea5e9" 
                    radius={[4, 4, 0, 0]}
                    name="Clicks"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Links</CardTitle>
            <CardDescription>
              Most popular links by clicks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryStats?.topLinks.slice(0, 5).map((link) => (
                <div 
                  key={link.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {link.shortCode}
                    </p>
                    <p className="text-xs text-gray-500 truncate-text">
                      {link.originalUrl}
                    </p>
                  </div>
                  <div className="ml-2 flex items-center text-sm">
                    <span className="font-medium">{link.totalClicks}</span>
                    <ArrowUp className="ml-1 h-3 w-3 text-green-500" />
                  </div>
                </div>
              ))}

              <Link to="/links">
                <Button variant="outline" className="w-full mt-4">
                  View All Links
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Countries & Referrers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summaryStats?.clicksByCountry && 
                Object.entries(summaryStats.clicksByCountry)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([country, count]) => (
                    <div 
                      key={country}
                      className="flex items-center justify-between py-2"
                    >
                      <span>{country}</span>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">
                          {count} clicks
                        </div>
                        <div className="w-16 h-2 bg-gray-100 rounded overflow-hidden">
                          <div 
                            className="h-full bg-brand-500"
                            style={{ 
                              width: `${Math.min(100, (count / (summaryStats?.totalClicks || 1) * 100))}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summaryStats?.topLinks.slice(0, 5).map((link, idx) => (
                <div 
                  key={link.id}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <LinkIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Link <span className="text-brand-600">{link.shortCode}</span> was created
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(link.createdAt).toLocaleDateString()} · {link.totalClicks} clicks so far
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
