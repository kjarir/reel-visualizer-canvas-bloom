import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  overall_score: number;
  target_audience: {
    primary_age_group: string;
    gender_split: { male: number; female: number };
    interests: string[];
  };
  technical_analysis: {
    video_quality: number;
    audio_quality: number;
    visual_appeal: number;
    editing_quality: number;
    lighting: number;
    composition: number;
  };
  content_strategy: {
    hook_effectiveness: number;
    storytelling: number;
    call_to_action: number;
    trending_elements: number;
    authenticity: number;
    emotional_impact: number;
  };
  performance_prediction: {
    estimated_views: number;
    estimated_engagement_rate: string;
    viral_potential: number;
    optimal_posting_time: string;
    trending_score: number;
  };
  recommendations: string[];
  missing_elements: string[];
}

const Analyzer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userVideo, setUserVideo] = useState<File | null>(null);
  const [viralVideo, setViralVideo] = useState<File | null>(null);
  const [userVideoUrl, setUserVideoUrl] = useState<string | null>(null);
  const [viralVideoUrl, setViralVideoUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userAnalyses, setUserAnalyses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserAnalyses();
    }
  }, [user]);

  const fetchUserAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('video_analyses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analyses:', error);
      } else {
        setUserAnalyses(data || []);
      }
    } catch (error) {
      console.error('Error fetching user analyses:', error);
    }
  };

  const handleUserVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserVideo(file);
      setUserVideoUrl(URL.createObjectURL(file));
    }
  };

  const handleViralVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setViralVideo(file);
      setViralVideoUrl(URL.createObjectURL(file));
    }
  };

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined) return "text-gray-500";
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreIcon = (score: number | null | undefined) => {
    if (score === null || score === undefined) return null;
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (score >= 60) return <Lightbulb className="h-4 w-4 text-blue-500" />;
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const calculateOverallScore = (result: AnalysisResult) => {
    const { technical_analysis, content_strategy } = result;
    const technicalScore = Object.values(technical_analysis).reduce((sum, val) => sum + val, 0) / 6;
    const contentScore = Object.values(content_strategy).reduce((sum, val) => sum + val, 0) / 6;
    return Math.round((technicalScore + contentScore) / 2 * 10);
  };

  const handleAnalyze = async () => {
    if (!userVideo || !viralVideo) {
      toast({
        title: "Missing Videos",
        description: "Please upload both videos before analyzing.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to analyze videos.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    
    try {
      // Simulate analysis processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockAnalysisResult = {
        overall_score: Math.floor(Math.random() * 40) + 60,
        target_audience: {
          primary_age_group: "18-34",
          gender_split: { male: 45, female: 55 },
          interests: ["Fashion", "Music", "Technology", "Fitness"]
        },
        technical_analysis: {
          video_quality: Math.floor(Math.random() * 10) + 1,
          audio_quality: Math.floor(Math.random() * 10) + 1,
          visual_appeal: Math.floor(Math.random() * 10) + 1,
          editing_quality: Math.floor(Math.random() * 10) + 1,
          lighting: Math.floor(Math.random() * 10) + 1,
          composition: Math.floor(Math.random() * 10) + 1
        },
        content_strategy: {
          hook_effectiveness: Math.floor(Math.random() * 10) + 1,
          storytelling: Math.floor(Math.random() * 10) + 1,
          call_to_action: Math.floor(Math.random() * 10) + 1,
          trending_elements: Math.floor(Math.random() * 10) + 1,
          authenticity: Math.floor(Math.random() * 10) + 1,
          emotional_impact: Math.floor(Math.random() * 10) + 1
        },
        performance_prediction: {
          estimated_views: Math.floor(Math.random() * 100000) + 10000,
          estimated_engagement_rate: (Math.random() * 10 + 2).toFixed(1),
          viral_potential: Math.floor(Math.random() * 100) + 1,
          optimal_posting_time: "6:00 PM - 9:00 PM",
          trending_score: Math.floor(Math.random() * 100) + 1
        },
        recommendations: [
          "Improve lighting setup for better video quality",
          "Add more trending hashtags to increase discoverability",
          "Create a stronger hook in the first 3 seconds",
          "Include more interactive elements to boost engagement",
          "Optimize posting time based on audience activity"
        ],
        missing_elements: [
          "Trending music",
          "Strong call-to-action",
          "Proper hashtag strategy",
          "Optimal video length"
        ]
      };

      // Save analysis to database
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('video_analyses')
        .insert({
          user_id: user.id,
          original_video_url: viralVideoUrl,
          user_video_file_name: userVideo.name,
          user_video_file_path: 'temp/' + userVideo.name,
          viral_score: mockAnalysisResult.overall_score,
          analysis_result: mockAnalysisResult,
          recommendations: mockAnalysisResult.recommendations,
          missing_elements: mockAnalysisResult.missing_elements
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving analysis:', saveError);
        toast({
          title: "Analysis Complete",
          description: "Analysis completed but couldn't save to database.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis Complete!",
          description: "Your video has been analyzed and saved to your history.",
        });
        
        // Refresh user analyses
        await fetchUserAnalyses();
      }

      setAnalysisResult(mockAnalysisResult);
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Video Analyzer</h1>
          <p className="text-xl text-gray-600">
            Upload your video and compare it with a viral video to get actionable insights
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysisResult}>Analysis Results</TabsTrigger>
            <TabsTrigger value="insights" disabled={!analysisResult}>Deep Insights</TabsTrigger>
            <TabsTrigger value="history">Analysis History</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Videos</CardTitle>
                <CardDescription>
                  Upload your video and a viral video to compare
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userVideo">Your Video</Label>
                    <Input
                      id="userVideo"
                      type="file"
                      accept="video/*"
                      onChange={handleUserVideoUpload}
                    />
                    {userVideoUrl && (
                      <video
                        src={userVideoUrl}
                        controls
                        className="rounded-md aspect-video w-full"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="viralVideo">Viral Video</Label>
                    <Input
                      id="viralVideo"
                      type="file"
                      accept="video/*"
                      onChange={handleViralVideoUpload}
                    />
                    {viralVideoUrl && (
                      <video
                        src={viralVideoUrl}
                        controls
                        className="rounded-md aspect-video w-full"
                      />
                    )}
                  </div>
                </div>

                <Button onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? (
                    <>
                      Analyzing...
                      <Upload className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Analyze Videos
                      <Upload className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {analysisResult ? (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    Here's how your video compares to the viral video
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`text-4xl font-bold ${getScoreColor(analysisResult?.overall_score)}`}>
                      {analysisResult?.overall_score}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Overall Score</h3>
                      <p className="text-sm text-gray-500">
                        {analysisResult?.overall_score >= 80 ? 'Excellent' : 
                         analysisResult?.overall_score >= 60 ? 'Good' : 
                         analysisResult?.overall_score >= 40 ? 'Fair' : 'Needs Work'}
                      </p>
                    </div>
                    {getScoreIcon(analysisResult?.overall_score)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium">Target Audience</h4>
                      <p className="text-sm text-gray-500">
                        Primary Age Group: {analysisResult?.target_audience.primary_age_group}
                      </p>
                      <p className="text-sm text-gray-500">
                        Gender Split: Male {analysisResult?.target_audience.gender_split.male}%, Female {analysisResult?.target_audience.gender_split.female}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Interests: {analysisResult?.target_audience.interests.join(', ')}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium">Performance Prediction</h4>
                      <p className="text-sm text-gray-500">
                        Estimated Views: {analysisResult?.performance_prediction.estimated_views}
                      </p>
                      <p className="text-sm text-gray-500">
                        Engagement Rate: {analysisResult?.performance_prediction.estimated_engagement_rate}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Optimal Posting Time: {analysisResult?.performance_prediction.optimal_posting_time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
                  <p className="text-gray-500 mb-4">
                    Analyze your videos to see the results
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {analysisResult ? (
              <Card>
                <CardHeader>
                  <CardTitle>Deep Insights</CardTitle>
                  <CardDescription>
                    Actionable insights to improve your video's performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Recommendations</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {analysisResult?.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">Missing Elements</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {analysisResult?.missing_elements.map((element, index) => (
                        <li key={index} className="text-sm text-red-700">
                          {element}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
                  <p className="text-gray-500 mb-4">
                    Analyze your videos to unlock deep insights
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab - Updated to use real data */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Analysis History</CardTitle>
                <CardDescription>
                  View and revisit your previous video analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalyses.length > 0 ? (
                  <div className="space-y-4">
                    {userAnalyses.map((analysis, index) => (
                      <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{analysis.user_video_file_name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>Analyzed on {new Date(analysis.created_at).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Viral Score: {analysis.viral_score}/100</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getScoreColor(analysis.viral_score)}`}>
                              {analysis.viral_score}/100
                            </div>
                            <div className="text-sm text-gray-500">
                              {analysis.viral_score >= 80 ? 'Excellent' : 
                               analysis.viral_score >= 60 ? 'Good' : 
                               analysis.viral_score >= 40 ? 'Fair' : 'Needs Work'}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAnalysisResult(analysis.analysis_result);
                              // Switch to results tab - you might need to implement tab switching
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't analyzed any videos yet. Upload your first video to get started!
                    </p>
                    <Button onClick={() => {
                      // Switch to upload tab - implement tab switching
                    }}>
                      Analyze Your First Video
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analyzer;
