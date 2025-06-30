import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Play, 
  TrendingUp, 
  Users, 
  Eye, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  Globe,
  Heart,
  MessageCircle,
  Share,
  Target,
  Sparkles,
  Rocket,
  Star
} from "lucide-react";
import SplitText from "../components/SplitText";

const Index = () => {
  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Deep insights into your reel performance with detailed metrics and trends."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Audience Insights",
      description: "Understand your audience demographics and engagement patterns."
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Real-time Monitoring",
      description: "Track your content performance in real-time across all platforms."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Custom Reports",
      description: "Generate detailed reports with customizable metrics and visualizations."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description: "Get AI-driven recommendations to optimize your content strategy."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Data Security",
      description: "Your data is protected with enterprise-grade security measures."
    }
  ];

  const stats = [
    { number: "0", label: "Reels Analyzed", icon: <Play className="h-5 w-5" /> },
    { number: "0", label: "Active Users", icon: <Users className="h-5 w-5" /> },
    { number: "0", label: "Uptime", icon: <Clock className="h-5 w-5" /> },
    { number: "0", label: "Countries", icon: <Globe className="h-5 w-5" /> }
  ];

  const platforms = [
    { name: "Instagram", icon: "📸", color: "bg-pink-100" },
    { name: "TikTok", icon: "🎵", color: "bg-black text-white" },
    { name: "YouTube", icon: "▶️", color: "bg-red-100" },
    { name: "Facebook", icon: "👥", color: "bg-blue-100" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            {/* Animated SplitText for the headline */}
            <SplitText
              text="Unlock the Power of Your Reels"
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text "
              delay={30}
              duration={0.6}
              ease="power3.out"
            />
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Advanced analytics platform that helps content creators and businesses maximize their social media impact with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="hover:scale-105 transition-transform">
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" className="hover:scale-105 transition-transform">
                <Link to="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center hover:scale-105 transition-transform">
                <div className="flex items-center justify-center mb-2">
                  <div className="text-blue-600">{stat.icon}</div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive analytics tools designed to help you create better content and grow your audience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow hover:scale-105 transform duration-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Works with All Major Platforms
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Analyze your content across all social media platforms from one dashboard.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platforms.map((platform, index) => (
              <div key={index} className={`p-8 rounded-lg ${platform.color} hover:scale-110 transition-transform cursor-pointer`}>
                <div className="text-4xl mb-2">{platform.icon}</div>
                <div className="font-semibold">{platform.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Content Strategy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who are already using ReelAnalyzer to grow their audience and engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="hover:scale-105 transition-transform">
              <Link to="/register">Start Your Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-blue-600 hover:scale-105 transition-all">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
