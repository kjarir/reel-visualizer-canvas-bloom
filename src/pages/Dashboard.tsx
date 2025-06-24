
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share, 
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Clock
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [videoAnalyses, setVideoAnalyses] = useState<any[]>([]);
  const [contentGenerations, setContentGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else {
        setUserProfile(profile);
      }

      // Fetch video analyses
      const { data: analyses, error: analysesError } = await supabase
        .from('video_analyses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (analysesError) {
        console.error('Error fetching analyses:', analysesError);
      } else {
        setVideoAnalyses(analyses || []);
      }

      // Fetch content generations
      const { data: generations, error: generationsError } = await supabase
        .from('content_generations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (generationsError) {
        console.error('Error fetching generations:', generationsError);
      } else {
        setContentGenerations(generations || []);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from real data
  const totalAnalyses = videoAnalyses.length;
  const avgViralScore = videoAnalyses.length > 0 
    ? Math.round(videoAnalyses.reduce((sum, analysis) => sum + (analysis.viral_score || 0), 0) / videoAnalyses.length)
    : 0;
  const totalContentGenerated = contentGenerations.length;
  const recentActivity = [...videoAnalyses, ...contentGenerations]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Generate chart data from real analyses
  const chartData = videoAnalyses.slice(0, 6).reverse().map((analysis, index) => ({
    name: `Analysis ${index + 1}`,
    score: analysis.viral_score || 0,
    date: new Date(analysis.created_at).toLocaleDateString()
  }));

  const metrics = [
    {
      title: "Total Analyses",
      value: totalAnalyses.toString(),
      change: "+100%",
      trend: "up",
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      title: "Avg Viral Score",
      value: `${avgViralScore}/100`,
      change: avgViralScore > 50 ? "+good" : "needs improvement",
      trend: avgViralScore > 50 ? "up" : "down",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      title: "Content Generated",
      value: totalContentGenerated.toString(),
      change: "+active",
      trend: "up",
      icon: <Zap className="h-4 w-4" />
    },
    {
      title: "Account Age",
      value: userProfile ? new Date(userProfile.created_at).toLocaleDateString() : "New",
      change: "member since",
      trend: "up",
      icon: <Calendar className="h-4 w-4" />
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-600">Here's your content performance overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              All Time
            </Button>
            <Button onClick={fetchUserData}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className="text-gray-500">{metric.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-1 text-xs">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={metric.trend === "up" ? "text-green-500" : "text-blue-500"}>
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Viral Score Progress</CardTitle>
              <CardDescription>Track your video analysis scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No analysis data yet. Start by analyzing a video!
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Types Generated</CardTitle>
              <CardDescription>Breakdown of your AI-generated content</CardDescription>
            </CardHeader>
            <CardContent>
              {contentGenerations.length > 0 ? (
                <div className="space-y-4">
                  {['hashtags', 'captions', 'scripts', 'music_suggestions'].map((type) => {
                    const count = contentGenerations.filter(gen => gen.content_type === type).length;
                    const percentage = contentGenerations.length > 0 ? (count / contentGenerations.length) * 100 : 0;
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="capitalize">{type.replace('_', ' ')}</span>
                          <span>{count} generated</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No content generated yet. Try the content generation tool!
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest analyses and content generations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {item.user_video_file_name ? 'A' : 'C'}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {item.user_video_file_name || `${item.content_type} Generation`}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Badge variant="outline">
                            {item.user_video_file_name ? 'Analysis' : 'Content'}
                          </Badge>
                          <span>•</span>
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      {item.viral_score && (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{item.viral_score}/100</span>
                        </div>
                      )}
                      <span className="text-gray-500">
                        {new Date(item.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity. Start analyzing videos or generating content!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span>Analyze New Video</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Upload and analyze your latest video content.</p>
              <Button className="w-full" onClick={() => window.location.href = '/analyzer'}>
                Start Analysis
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>Generate Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create AI-powered hashtags, captions, and scripts.</p>
              <Button className="w-full" variant="outline" onClick={() => window.location.href = '/content-generation'}>
                Generate Content
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <span>View Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Deep dive into your content performance analytics.</p>
              <Button className="w-full" variant="outline" onClick={() => window.location.href = '/reports'}>
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
