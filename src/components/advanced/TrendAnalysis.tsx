
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Hash, Music, Zap, Calendar, Globe } from "lucide-react";

interface TrendData {
  hashtags: { tag: string; growth: number; volume: number }[];
  sounds: { name: string; artist: string; usage_count: number; trend_score: number }[];
  content_formats: { type: string; engagement_boost: number; difficulty: number }[];
  seasonal_trends: { period: string; peak_months: string[]; content_suggestions: string[] }[];
}

interface TrendAnalysisProps {
  trends: TrendData;
}

export const TrendAnalysis = ({ trends }: TrendAnalysisProps) => {
  return (
    <div className="space-y-6">
      {/* Trending Hashtags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Trending Hashtags
          </CardTitle>
          <CardDescription>
            High-growth hashtags in your niche with engagement potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {trends.hashtags.map((hashtag, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-600">#{hashtag.tag}</span>
                  <Badge variant={hashtag.growth > 50 ? "default" : "secondary"}>
                    +{hashtag.growth}%
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Volume: {hashtag.volume.toLocaleString()} posts
                </div>
                <Progress value={hashtag.growth} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Sounds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Viral Audio Trends
          </CardTitle>
          <CardDescription>
            Popular sounds and music driving engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trends.sounds.map((sound, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{sound.name}</div>
                  <div className="text-sm text-gray-500">{sound.artist}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {sound.usage_count.toLocaleString()} uses
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">
                      Score: {sound.trend_score}/100
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Format Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            High-Performance Formats
          </CardTitle>
          <CardDescription>
            Content formats that are driving the most engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {trends.content_formats.map((format, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{format.type}</h4>
                  <Badge variant="outline">
                    +{format.engagement_boost}% engagement
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Engagement Boost</span>
                      <span>{format.engagement_boost}%</span>
                    </div>
                    <Progress value={format.engagement_boost} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Difficulty Level</span>
                      <span>{format.difficulty}/10</span>
                    </div>
                    <Progress value={format.difficulty * 10} className="h-2 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Seasonal Content Opportunities
          </CardTitle>
          <CardDescription>
            Plan your content around seasonal trends and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends.seasonal_trends.map((trend, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{trend.period}</h4>
                  <div className="flex gap-1">
                    {trend.peak_months.map((month, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {month}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Content Ideas:</div>
                  <div className="flex flex-wrap gap-1">
                    {trend.content_suggestions.map((suggestion, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
