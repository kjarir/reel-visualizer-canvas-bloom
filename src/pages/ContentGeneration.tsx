
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hash, MessageSquare, FileText, Music, Sparkles, Copy } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ContentGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("hashtags");
  const { user } = useAuth();

  const contentTypes = {
    hashtags: {
      icon: Hash,
      title: "Hashtags",
      description: "Generate trending hashtags for your content",
      placeholder: "e.g., fitness workout, home cooking, travel vlog"
    },
    captions: {
      icon: MessageSquare,
      title: "Captions",
      description: "Create engaging captions that drive engagement",
      placeholder: "e.g., motivational fitness post, food recipe showcase"
    },
    scripts: {
      icon: FileText,
      title: "Scripts",
      description: "Generate scripts for your reels and videos",
      placeholder: "e.g., 30-second workout tutorial, cooking recipe explanation"
    },
    songs: {
      icon: Music,
      title: "Music Suggestions",
      description: "Get trending music recommendations",
      placeholder: "e.g., upbeat workout music, calm cooking background"
    }
  };

  const generateMockContent = (type: string, userPrompt: string) => {
    const mockData = {
      hashtags: {
        trending: ["#viral", "#trending", "#fyp", "#reels", "#instagram"],
        niche: ["#fitness", "#workout", "#gym", "#health", "#motivation"],
        long_tail: ["#homeworkout2024", "#fitnessjourney", "#workoutmotivation"]
      },
      captions: {
        hook: "Stop scrolling! Here's what you need to know...",
        main_content: "This simple technique will change everything you thought you knew about [topic]. Here's how to do it right:",
        cta: "Save this post and try it today! What's your experience? Comment below! 👇"
      },
      scripts: {
        hook: "You've been doing this wrong your entire life",
        steps: [
          "First, start with proper form - here's what that looks like",
          "Next, focus on controlled movements - speed isn't everything",
          "Finally, consistency beats perfection every time"
        ],
        outro: "Try this for 7 days and watch what happens!"
      },
      songs: {
        trending: ["Heat Waves - Glass Animals", "As It Was - Harry Styles", "About Damn Time - Lizzo"],
        mood_based: ["Upbeat: Good 4 U - Olivia Rodrigo", "Chill: Levitating - Dua Lipa", "Motivational: Stronger - Kelly Clarkson"],
        genre: ["Pop", "Hip-Hop", "Electronic", "Indie"]
      }
    };

    return mockData[type as keyof typeof mockData] || {};
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate content.");
      return;
    }

    if (!user) {
      toast.error("Please log in to generate content.");
      return;
    }

    setIsGenerating(true);

    try {
      // Generate mock content (in real app, this would call an AI service)
      const content = generateMockContent(activeTab, prompt);

      // Save to database
      const { error } = await supabase
        .from('content_generations')
        .insert({
          user_id: user.id,
          content_type: activeTab,
          prompt: prompt,
          generated_content: content
        });

      if (error) {
        throw error;
      }

      setGeneratedContent(content);
      toast.success(`${contentTypes[activeTab as keyof typeof contentTypes].title} generated successfully!`);

    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const renderContent = () => {
    if (!generatedContent) return null;

    switch (activeTab) {
      case "hashtags":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Trending Hashtags</h4>
              <div className="flex flex-wrap gap-2">
                {generatedContent.trending?.map((tag: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Niche Hashtags</h4>
              <div className="flex flex-wrap gap-2">
                {generatedContent.niche?.map((tag: string, index: number) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case "captions":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Hook</h4>
              <p className="text-gray-700">{generatedContent.hook}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(generatedContent.hook)}
                className="mt-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Main Content</h4>
              <p className="text-gray-700">{generatedContent.main_content}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(generatedContent.main_content)}
                className="mt-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Call to Action</h4>
              <p className="text-gray-700">{generatedContent.cta}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(generatedContent.cta)}
                className="mt-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        );

      case "scripts":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold mb-2">Hook (0-3 seconds)</h4>
              <p className="text-gray-700">{generatedContent.hook}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Main Content</h4>
              <ol className="list-decimal list-inside space-y-2">
                {generatedContent.steps?.map((step: string, index: number) => (
                  <li key={index} className="text-gray-700">{step}</li>
                ))}
              </ol>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">Outro/CTA</h4>
              <p className="text-gray-700">{generatedContent.outro}</p>
            </div>
          </div>
        );

      case "songs":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Trending Now</h4>
              <ul className="space-y-2">
                {generatedContent.trending?.map((song: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Music className="h-4 w-4 text-purple-600" />
                    <span>{song}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">By Mood</h4>
              <ul className="space-y-2">
                {generatedContent.mood_based?.map((song: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Music className="h-4 w-4 text-blue-600" />
                    <span>{song}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Content Generation
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered content creation for hashtags, captions, scripts, and music
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate Content
            </CardTitle>
            <CardDescription>
              Choose a content type and describe what you need
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {Object.entries(contentTypes).map(([key, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <span className="hidden sm:inline">{config.title}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(contentTypes).map(([key, config]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <config.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="text-lg font-semibold">{config.title}</h3>
                    <p className="text-gray-600">{config.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="prompt">Describe your content</Label>
                      <Textarea
                        id="prompt"
                        placeholder={config.placeholder}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Generating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Generate {config.title}
                        </div>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {generatedContent && (
              <div className="mt-8 p-6 bg-white border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Generated Content</h3>
                {renderContent()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentGeneration;
