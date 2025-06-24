
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, Eye, Heart, MessageCircle, Share } from "lucide-react";

interface MetricsProps {
  data: {
    engagement_rate: number;
    reach: number;
    impressions: number;
    saves: number;
    shares: number;
    comments: number;
    likes: number;
    watch_time: number;
    completion_rate: number;
  };
}

export const AdvancedMetrics = ({ data }: MetricsProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4" />
            Reach & Impressions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span>Reach</span>
                <span className="font-medium">{data.reach.toLocaleString()}</span>
              </div>
              <Progress value={75} className="h-2 mt-1" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Impressions</span>
                <span className="font-medium">{data.impressions.toLocaleString()}</span>
              </div>
              <Progress value={85} className="h-2 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Heart className="h-4 w-4" />
            Engagement Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Engagement Rate</span>
              <Badge variant="secondary">{data.engagement_rate}%</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-red-500">{data.likes}</div>
                <div className="text-xs text-gray-500">Likes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-500">{data.comments}</div>
                <div className="text-xs text-gray-500">Comments</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-500">{data.shares}</div>
                <div className="text-xs text-gray-500">Shares</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            Watch Time Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span>Avg Watch Time</span>
                <span className="font-medium">{data.watch_time}s</span>
              </div>
              <Progress value={data.completion_rate} className="h-2 mt-1" />
            </div>
            <div className="text-xs text-gray-500">
              {data.completion_rate}% completion rate
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
