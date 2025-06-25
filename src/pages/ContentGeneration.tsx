import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hash, MessageSquare, FileText, Music, Sparkles, Copy, Brain } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { generateContentWithChatGPT, ContentGenerationResponse } from "@/lib/openai";
import { PostgrestError } from '@supabase/supabase-js';

const ContentGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ContentGenerationResponse | null>(null);
  const [rawApiResponse, setRawApiResponse] = useState<string | null>(null);
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
    setRawApiResponse(null);
    console.log('Starting content generation for:', activeTab, 'with prompt:', prompt);

    try {
      const content: ContentGenerationResponse = await generateContentWithChatGPT({
        contentType: activeTab,
        prompt: prompt
      });
      setGeneratedContent(content);
      setRawApiResponse(null); // clear previous raw response
      // Save to database
      const { error }: { error: PostgrestError | null } = await supabase
        .from('content_generations')
        .insert({
          user_id: user.id,
          content_type: activeTab,
          prompt: prompt,
          generated_content: content as any
        });
      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      toast.success(`${contentTypes[activeTab as keyof typeof contentTypes].title} generated successfully with AI!`);
    } catch (error) {
      // Use 'unknown' type and type guard for error
      const err = error as Error;
      console.error('Generation error:', err);
      if (typeof err.message === 'string' && err.message.includes('Invalid JSON response from OpenAI API:')) {
        setRawApiResponse(err.message.replace('Invalid JSON response from OpenAI API: ', ''));
      }
      // Provide fallback content if API fails
      const fallbackContent: ContentGenerationResponse = {};
      if (activeTab === 'hashtags') {
        fallbackContent.hashtags = {
          trending: ["#viral", "#trending", "#fyp", "#reels", "#instagram"],
          niche: ["#content", "#socialmedia", "#digital"],
          long_tail: ["#specificcontent", "#nicheaudience", "#targetedcontent"]
        };
      } else if (activeTab === 'captions') {
        fallbackContent.captions = {
          hook: "Stop scrolling! Here's what you need to know...",
          main_content: "This content will change everything you thought you knew about this topic.",
          cta: "Save this post and try it today! What's your experience? Comment below! 👇"
        };
      } else if (activeTab === 'scripts') {
        fallbackContent.scripts = {
          hook: "You've been doing this wrong your entire life",
          steps: [
            "First, start with the basics",
            "Next, build on that foundation", 
            "Finally, master the advanced techniques"
          ],
          outro: "Try this for 7 days and watch what happens!"
        };
      } else if (activeTab === 'songs') {
        fallbackContent.songs = {
          trending: ["Popular Song - Artist", "Trending Track - Artist"],
          mood_based: ["Upbeat: Energetic Song - Artist", "Chill: Relaxing Track - Artist"],
          genre: ["Pop", "Hip-Hop", "Electronic"]
        };
      }
      setGeneratedContent(fallbackContent);
      toast.error("AI generation failed, showing fallback content. Please try again.");
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
                {generatedContent.hashtags?.trending?.map((tag: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Niche Hashtags</h4>
              <div className="flex flex-wrap gap-2">
                {generatedContent.hashtags?.niche?.map((tag: string, index: number) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Long-tail Hashtags</h4>
              <div className="flex flex-wrap gap-2">
                {generatedContent.hashtags?.long_tail?.map((tag: string, index: number) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
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
              <p className="text-gray-700">{generatedContent.captions?.hook}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(generatedContent.captions?.hook || '')}
                className="mt-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Main Content</h4>
              <p className="text-gray-700">{generatedContent.captions?.main_content}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(generatedContent.captions?.main_content || '')}
                className="mt-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Call to Action</h4>
              <p className="text-gray-700">{generatedContent.captions?.cta}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(generatedContent.captions?.cta || '')}
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
              <p className="text-gray-700">{generatedContent.scripts?.hook}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Main Content</h4>
              <ol className="list-decimal list-inside space-y-2">
                {generatedContent.scripts?.steps?.map((step: string, index: number) => (
                  <li key={index} className="text-gray-700">{step}</li>
                ))}
              </ol>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold mb-2">Outro/CTA</h4>
              <p className="text-gray-700">{generatedContent.scripts?.outro}</p>
            </div>
          </div>
        );

      case "songs":
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Trending Now</h4>
              <ul className="space-y-2">
                {generatedContent.songs?.trending?.map((song: string, index: number) => (
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
                {generatedContent.songs?.mood_based?.map((song: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Music className="h-4 w-4 text-blue-600" />
                    <span>{song}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recommended Genres</h4>
              <div className="flex flex-wrap gap-2">
                {generatedContent.songs?.genre?.map((genre: string, index: number) => (
                  <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
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
            AI Content Generation
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered content creation for hashtags, captions, scripts, and music
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Generate Content with AI
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
                          <Brain className="h-4 w-4 animate-spin" />
                          AI Generating...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Generate {config.title} with AI
                        </div>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {generatedContent && (
              <div className="mt-8 p-6 bg-white border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">AI-Generated Content</h3>
                {renderContent()}
              </div>
            )}

            {rawApiResponse && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
                <h4 className="font-semibold mb-2">Raw API Response</h4>
                <pre className="text-xs whitespace-pre-wrap">{rawApiResponse}</pre>
                <p className="text-xs text-yellow-700 mt-2">The AI response could not be parsed as JSON. This is the raw output from the API.</p>
              </div>
            )}

            {/* Debug/Test Section */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Test API Connection</h4>
              <p className="text-sm text-gray-600 mb-3">
                If content generation isn't working, try this test to check the API connection.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    console.log('Testing API connection...');
                    const testContent = await generateContentWithChatGPT({
                      contentType: 'songs',
                      prompt: 'new song of honey singh'
                    });
                    console.log('Test successful:', testContent);
                    toast.success('API connection working! Check console for details.');
                  } catch (error) {
                    console.error('API test failed:', error);
                    toast.error('API connection failed. Check console for details.');
                  }
                }}
              >
                Test API Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentGeneration;
