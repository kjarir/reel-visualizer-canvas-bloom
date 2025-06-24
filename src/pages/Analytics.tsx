
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Users,
  Clock,
  Target,
  BarChart3
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

const Analytics = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  const performanceData = [
    { date: '2024-01-01', views: 12000, likes: 890, comments: 45, shares: 23, engagement: 8.1 },
    { date: '2024-01-02', views: 15000, likes: 1200, comments: 67, shares: 34, engagement: 8.7 },
    { date: '2024-01-03', views: 9800, likes: 720, comments: 32, shares: 18, engagement: 7.8 },
    { date: '2024-01-04', views: 18000, likes: 1500, comments: 89, shares: 45, engagement: 9.1 },
    { date: '2024-01-05', views: 14500, likes: 1100, comments: 56, shares: 29, engagement: 8.3 },
    { date: '2024-01-06', views: 22000, likes: 1800, comments: 95, shares: 52, engagement: 8.9 },
    { date: '2024-01-07', views: 16500, likes: 1250, comments: 78, shares: 41, engagement: 8.4 }
  ];

  const platformData = [
    { platform: 'Instagram', posts: 45, avgViews: 15000, avgEngagement: 8.5, growth: 12.3 },
    { platform: 'TikTok', posts: 38, avgViews: 25000, avgEngagement: 12.1, growth: 18.7 },
    { platform: 'YouTube', posts: 12, avgViews: 8500, avgEngagement: 6.2, growth: 8.9 },
    { platform: 'Facebook', posts: 25, avgViews: 5200, avgEngagement: 4.1, growth: -2.1 }
  ];

  const topContent = [
    {
      title: "Summer Workout Routine",
      platform: "Instagram",
      views: 45000,
      likes: 3200,
      comments: 189,
      shares: 156,
      engagement: 14.2,
      posted: "2 days ago"
    },
    {
      title: "Quick Recipe Tutorial",
      platform: "TikTok", 
      views: 89000,
      likes: 8900,
      comments: 456,
      shares: 789,
      engagement: 12.8,
      posted: "1 week ago"
    },
    {
      title: "Behind the Scenes",
      platform: "YouTube",
      views: 23000,
      likes: 1200,
      comments: 89,
      shares: 45,
      engagement: 5.8,
      posted: "3 days ago"
    }
  ];

  const audienceData = [
    { age: '18-24', percentage: 35, color: '#3B82F6' },
    { age: '25-34', percentage: 28, color: '#8B5CF6' },
    { age: '35-44', percentage: 22, color: '#10B981' },
    { age: '45-54', percentage: 10, color: '#F59E0B' },
    { age: '55+', percentage: 5, color: '#EF4444' }
  ];

  const metrics = [
    {
      title: "Total Reach",
      value: "1.2M",
      change: "+15.3%",
      trend: "up",
      icon: <Eye className="h-5 w-5" />
    },
    {
      title: "Engagement Rate",
      value: "8.7%",
      change: "+2.1%",
      trend: "up",
      icon: <Heart className="h-5 w-5" />
    },
    {
      title: "Total Followers",
      value: "85.4K",
      change: "+5.9%",
      trend: "up",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Avg. Watch Time",
      value: "1m 34s",
      change: "-0.8%",
      trend: "down",
      icon: <Clock className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-gray-600">Deep insights into your content performance across all platforms</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[120px] bg-white">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="bg-white">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className="text-gray-500">{metric.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-1 text-xs mt-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {metric.change}
                  </span>
                  <span className="text-gray-500">vs last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Views & Engagement</CardTitle>
                  <CardDescription>Daily performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="views" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="likes" stackId="2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Rate Trend</CardTitle>
                  <CardDescription>Daily engagement rate percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Age Demographics</CardTitle>
                  <CardDescription>Audience breakdown by age group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audienceData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium">{item.age}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${item.percentage}%`, 
                                backgroundColor: item.color 
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Top countries by audience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { country: "United States", percentage: 45, flag: "🇺🇸" },
                      { country: "United Kingdom", percentage: 18, flag: "🇬🇧" },
                      { country: "Canada", percentage: 12, flag: "🇨🇦" },
                      { country: "Australia", percentage: 8, flag: "🇦🇺" },
                      { country: "Germany", percentage: 7, flag: "🇩🇪" },
                      { country: "Others", percentage: 10, flag: "🌍" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{item.flag}</span>
                          <span className="font-medium">{item.country}</span>
                        </div>
                        <span className="text-sm font-medium">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Content</CardTitle>
                <CardDescription>Your best content from the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{content.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Badge variant="outline">{content.platform}</Badge>
                            <span>•</span>
                            <span>{content.posted}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{content.views.toLocaleString()}</div>
                          <div className="text-gray-500">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{content.likes.toLocaleString()}</div>
                          <div className="text-gray-500">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600">{content.engagement}%</div>
                          <div className="text-gray-500">Engagement</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Comparison across all connected platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={platformData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="platform" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgViews" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                  <CardDescription>Detailed metrics by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformData.map((platform, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{platform.platform}</div>
                          <div className="text-sm text-gray-500">{platform.posts} posts</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{platform.avgViews.toLocaleString()} avg views</div>
                          <div className={`text-sm ${platform.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {platform.growth >= 0 ? '+' : ''}{platform.growth}% growth
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
