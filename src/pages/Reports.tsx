
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Calendar, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Mail,
  Share,
  Settings,
  Clock,
  Eye,
  Users,
  Heart
} from "lucide-react";

const Reports = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState("");
  const [dateRange, setDateRange] = useState("30d");

  const reportTemplates = [
    {
      id: "performance",
      name: "Performance Overview",
      description: "Comprehensive analysis of your content performance across all platforms",
      icon: <BarChart3 className="h-6 w-6" />,
      type: "Analytics",
      estimatedTime: "2-3 min"
    },
    {
      id: "audience",
      name: "Audience Insights",
      description: "Detailed demographics and behavior patterns of your followers",
      icon: <Users className="h-6 w-6" />,
      type: "Demographics",
      estimatedTime: "1-2 min"
    },
    {
      id: "engagement",
      name: "Engagement Analysis",
      description: "Deep dive into likes, comments, shares, and overall engagement trends",
      icon: <Heart className="h-6 w-6" />,
      type: "Engagement",
      estimatedTime: "2-3 min"
    },
    {
      id: "content",
      name: "Content Performance",
      description: "Analysis of your top and bottom performing content with recommendations",
      icon: <TrendingUp className="h-6 w-6" />,
      type: "Content",
      estimatedTime: "3-4 min"
    },
    {
      id: "competitor",
      name: "Competitor Benchmarking",
      description: "Compare your performance against industry competitors",
      icon: <PieChart className="h-6 w-6" />,
      type: "Competitive",
      estimatedTime: "4-5 min"
    },
    {
      id: "growth",
      name: "Growth Tracking",
      description: "Track follower growth, reach expansion, and audience development",
      icon: <TrendingUp className="h-6 w-6" />,
      type: "Growth",
      estimatedTime: "2-3 min"
    }
  ];

  const recentReports = [
    {
      name: "Monthly Performance Report",
      type: "Performance Overview",
      generated: "2 hours ago",
      status: "Ready",
      size: "2.3 MB"
    },
    {
      name: "Audience Demographics Q4",
      type: "Audience Insights",
      generated: "1 day ago",
      status: "Ready",
      size: "1.8 MB"
    },
    {
      name: "Content Analysis November",
      type: "Content Performance",
      generated: "3 days ago",
      status: "Ready",
      size: "3.1 MB"
    },
    {
      name: "Competitor Report October",
      type: "Competitor Benchmarking",
      generated: "1 week ago",
      status: "Ready",
      size: "4.2 MB"
    }
  ];

  const handleGenerateReport = () => {
    if (!selectedReport) {
      toast({
        title: "No Report Selected",
        description: "Please select a report type before generating.",
        variant: "destructive",
      });
      return;
    }

    const reportName = reportTemplates.find(r => r.id === selectedReport)?.name;
    toast({
      title: "Report Generation Started",
      description: `Your ${reportName} report is being generated. You'll receive an email when it's ready.`,
    });
  };

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${reportName}...`,
    });
  };

  const handleEmailReport = (reportName: string) => {
    toast({
      title: "Report Emailed",
      description: `${reportName} has been sent to your email address.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate comprehensive reports and export your data</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Report Settings
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Reports
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Generation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generate New Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Generate New Report</span>
                </CardTitle>
                <CardDescription>
                  Create custom reports based on your specific analytics needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select value={selectedReport} onValueChange={setSelectedReport}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {reportTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name (Optional)</Label>
                  <Input
                    id="reportName"
                    placeholder="Enter custom report name"
                  />
                </div>

                <Button onClick={handleGenerateReport} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Report Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Available Report Templates</CardTitle>
                <CardDescription>
                  Choose from our pre-built report templates for quick insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedReport === template.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedReport(template.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {template.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary" className="text-xs">{template.type}</Badge>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {template.estimatedTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span>Recent Reports</span>
                </CardTitle>
                <CardDescription>
                  Your recently generated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{report.name}</h4>
                          <p className="text-xs text-gray-500">{report.type}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{report.generated}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{report.size}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {report.status}
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDownloadReport(report.name)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEmailReport(report.name)}
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                        >
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Report Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Reports Generated</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Most Popular</span>
                  <span className="font-medium">Performance Overview</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Generated</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>
                  Choose your preferred export format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Export as Excel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="h-4 w-4 mr-2" />
                  Generate Shareable Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
