
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Target, BarChart3 } from "lucide-react";

interface CompetitorData {
  name: string;
  followers: number;
  engagement_rate: number;
  avg_views: number;
  content_frequency: string;
  top_performing_content: string[];
}

interface CompetitorAnalysisProps {
  competitors: CompetitorData[];
  yourMetrics: {
    engagement_rate: number;
    avg_views: number;
  };
}

export const CompetitorAnalysis = ({ competitors, yourMetrics }: CompetitorAnalysisProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Competitive Landscape
          </CardTitle>
          <CardDescription>
            How you stack up against similar creators in your niche
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitors.map((competitor, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{competitor.name}</h4>
                    <p className="text-sm text-gray-500">
                      {competitor.followers.toLocaleString()} followers
                    </p>
                  </div>
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    {index === 0 ? "Top Performer" : "Competitor"}
                  </Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Engagement Rate</div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{competitor.engagement_rate}%</div>
                      <Progress 
                        value={competitor.engagement_rate * 10} 
                        className="flex-1 h-2" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Avg Views</div>
                    <div className="font-medium">{competitor.avg_views.toLocaleString()}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Posting Frequency</div>
                    <div className="font-medium">{competitor.content_frequency}</div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm text-gray-600 mb-1">Top Content Types</div>
                  <div className="flex flex-wrap gap-1">
                    {competitor.top_performing_content.map((content, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {content}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Performance vs Competitors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Performance Benchmark
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Your Engagement Rate</span>
                <span>{yourMetrics.engagement_rate}%</span>
              </div>
              <Progress value={yourMetrics.engagement_rate * 10} className="h-3" />
              <div className="text-xs text-gray-500 mt-1">
                Industry average: {competitors.reduce((sum, c) => sum + c.engagement_rate, 0) / competitors.length}%
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Your Avg Views</span>
                <span>{yourMetrics.avg_views.toLocaleString()}</span>
              </div>
              <Progress value={60} className="h-3" />
              <div className="text-xs text-gray-500 mt-1">
                Room for improvement in reach and discovery
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
