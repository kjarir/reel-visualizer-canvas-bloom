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
  Share,
  Brain
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { analyzeVideosWithChatGPT, VideoAnalysisResponse } from "@/lib/openai";

interface AnalysisResult extends VideoAnalysisResponse {
  // Extends the ChatGPT response interface
}

const Analyzer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userVideo, setUserVideo] = useState<File | null>(null);
  const [viralVideo, setViralVideo] = useState<File | null>(null);
  const [userVideoUrl, setUserVideoUrl] = useState<string | null>(null);
  const [viralVideoUrl, setViralVideoUrl] = useState<string | null>(null);
  const [userVideoDescription, setUserVideoDescription] = useState("");
  const [viralVideoDescription, setViralVideoDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userAnalyses, setUserAnalyses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("upload");

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

    if (!userVideoDescription.trim() || !viralVideoDescription.trim()) {
      toast({
        title: "Missing Descriptions",
        description: "Please provide descriptions for both videos to enable AI analysis.",
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
      // Call ChatGPT API for analysis
      const analysisResult = await analyzeVideosWithChatGPT({
        userVideoDescription,
        viralVideoDescription,
        userVideoName: userVideo.name,
        viralVideoName: viralVideo.name,
      });

      // Save analysis to database
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('video_analyses')
        .insert({
          user_id: user.id,
          original_video_url: viralVideoUrl || '',
          user_video_file_name: userVideo.name,
          user_video_file_path: 'temp/' + userVideo.name,
          viral_score: analysisResult.overall_score,
          analysis_result: analysisResult as any,
          recommendations: analysisResult.recommendations || [],
          missing_elements: analysisResult.missing_elements || []
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
          description: "Your video has been analyzed using AI and saved to your history.",
        });
        
        // Refresh user analyses
        await fetchUserAnalyses();
      }

      setAnalysisResult(analysisResult);
      
    } catch (error) {
      console.error('Analysis error:', error);
      
      // Provide a fallback analysis result if API fails
      const fallbackResult: AnalysisResult = {
        overall_score: 50,
        target_audience: {
          primary_age_group: "18-34",
          gender_split: { male: 50, female: 50 },
          interests: ["General"]
        },
        technical_analysis: {
          video_quality: 5,
          audio_quality: 5,
          visual_appeal: 5,
          editing_quality: 5,
          lighting: 5,
          composition: 5
        },
        content_strategy: {
          hook_effectiveness: 5,
          storytelling: 5,
          call_to_action: 5,
          trending_elements: 5,
          authenticity: 5,
          emotional_impact: 5
        },
        performance_prediction: {
          estimated_views: 10000,
          estimated_engagement_rate: "5.0",
          viral_potential: 50,
          optimal_posting_time: "6:00 PM - 9:00 PM",
          trending_score: 50
        },
        recommendations: ["Please try again with more detailed video descriptions"],
        missing_elements: ["Detailed video analysis"],
        detailed_analysis: "Analysis failed due to an error. Please try again with more detailed descriptions of your videos."
      };
      
      setAnalysisResult(fallbackResult);
      
      toast({
        title: "Analysis Failed",
        description: "An error occurred during AI analysis. Please try again with more detailed descriptions.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleViewAnalysisDetails = (analysis: any) => {
    setAnalysisResult(analysis.analysis_result);
    setActiveTab("results");
  };

  const handleStartNewAnalysis = () => {
    setActiveTab("upload");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">AI Video Analyzer</h1>
          <p className="text-xl text-gray-600">
            Upload your video and compare it with a viral video to get AI-powered insights
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Upload Your Videos
                </CardTitle>
                <CardDescription>
                  Upload your video and a viral video to compare with AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
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
                      <Label htmlFor="userVideoDescription">Describe Your Video</Label>
                      <Textarea
                        id="userVideoDescription"
                        placeholder="Describe your video content, style, target audience, and what you're trying to achieve..."
                        value={userVideoDescription}
                        onChange={(e) => setUserVideoDescription(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="viralVideo">Viral Video (Reference)</Label>
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="viralVideoDescription">Describe Viral Video</Label>
                      <Textarea
                        id="viralVideoDescription"
                        placeholder="Describe the viral video content, why you think it went viral, and what elements you want to analyze..."
                        value={viralVideoDescription}
                        onChange={(e) => setViralVideoDescription(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleAnalyze} 
                  disabled={analyzing || !userVideo || !viralVideo || !userVideoDescription.trim() || !viralVideoDescription.trim()}
                  className="w-full"
                >
                  {analyzing ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-spin" />
                      AI Analyzing Videos...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            {analysisResult ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Analysis Results</CardTitle>
                    <CardDescription>
                      Here's how your video compares to the viral video based on AI analysis
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
                          Primary Age Group: {analysisResult?.target_audience?.primary_age_group || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Gender Split: Male {analysisResult?.target_audience?.gender_split?.male || 0}%, Female {analysisResult?.target_audience?.gender_split?.female || 0}%
                        </p>
                        <p className="text-sm text-gray-500">
                          Interests: {analysisResult?.target_audience?.interests?.join(', ') || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium">Performance Prediction</h4>
                        <p className="text-sm text-gray-500">
                          Estimated Views: {analysisResult?.performance_prediction?.estimated_views?.toLocaleString() || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Engagement Rate: {analysisResult?.performance_prediction?.estimated_engagement_rate || 'N/A'}%
                        </p>
                        <p className="text-sm text-gray-500">
                          Optimal Posting Time: {analysisResult?.performance_prediction?.optimal_posting_time || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Analysis</CardTitle>
                    <CardDescription>AI assessment of video technical quality</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(analysisResult.technical_analysis).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium capitalize">{key.replace('_', ' ')}</span>
                            <span className={`text-sm font-bold ${getScoreColor(value)}`}>{value}/10</span>
                          </div>
                          <Progress value={value * 10} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Content Strategy */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content Strategy</CardTitle>
                    <CardDescription>AI assessment of content strategy effectiveness</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(analysisResult.content_strategy).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium capitalize">{key.replace('_', ' ')}</span>
                            <span className={`text-sm font-bold ${getScoreColor(value)}`}>{value}/10</span>
                          </div>
                          <Progress value={value * 10} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
                  <p className="text-gray-500 mb-4">
                    Analyze your videos to see the AI-powered results
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {analysisResult ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Generated Insights</CardTitle>
                    <CardDescription>
                      Detailed AI analysis and actionable recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Detailed Analysis */}
                    <div>
                      <h4 className="font-medium mb-3">Detailed Analysis</h4>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{analysisResult.detailed_analysis}</p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-medium mb-3">AI Recommendations</h4>
                      <ul className="space-y-2">
                        {(analysisResult.recommendations || []).map((recommendation, index) => (
                          <li key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing Elements */}
                    <div>
                      <h4 className="font-medium mb-3">Missing Elements</h4>
                      <ul className="space-y-2">
                        {(analysisResult.missing_elements || []).map((element, index) => (
                          <li key={index} className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-700">{element}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
                  <p className="text-gray-500 mb-4">
                    Analyze your videos to unlock AI-powered insights
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
                  View and revisit your previous AI-powered video analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userAnalyses.length > 0 ? (
                  <div className="space-y-4">
                    {userAnalyses.map((analysis, index) => (
                      <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{analysis.user_video_file_name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>Analyzed on {new Date(analysis.created_at).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>AI Score: {analysis.viral_score}/100</span>
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
                            onClick={() => handleViewAnalysisDetails(analysis)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't analyzed any videos yet. Upload your first video to get AI-powered insights!
                    </p>
                    <Button onClick={handleStartNewAnalysis}>
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
