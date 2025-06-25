const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set. Please define VITE_OPENAI_API_KEY in your .env file.');
}

export interface VideoAnalysisRequest {
  userVideoDescription: string;
  viralVideoDescription: string;
  userVideoName: string;
  viralVideoName: string;
}

export interface VideoAnalysisResponse {
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
  detailed_analysis: string;
}

export interface ContentGenerationRequest {
  contentType: string;
  prompt: string;
}

export interface ContentGenerationResponse {
  hashtags?: {
    trending: string[];
    niche: string[];
    long_tail: string[];
  };
  captions?: {
    hook: string;
    main_content: string;
    cta: string;
  };
  scripts?: {
    hook: string;
    steps: string[];
    outro: string;
  };
  songs?: {
    trending: string[];
    mood_based: string[];
    genre: string[];
  };
}

export const generateContentWithChatGPT = async (
  request: ContentGenerationRequest
): Promise<ContentGenerationResponse> => {
  const getPromptForType = (type: string, userPrompt: string) => {
    switch (type) {
      case 'hashtags':
        return `You are an expert social media hashtag strategist. Generate trending hashtags for the following content:

Content Description: ${userPrompt}

Please provide hashtags in the following JSON format:
{
  "trending": ["#viral", "#trending", "#fyp", "#reels", "#instagram"],
  "niche": ["#specific", "#relevant", "#targeted"],
  "long_tail": ["#specificlongtail", "#detailedhashtag", "#nichekeyword"]
}

Focus on:
- Trending hashtags that are currently popular
- Niche hashtags relevant to the specific content
- Long-tail hashtags for better discoverability
- Mix of popular and less competitive hashtags

Be specific and relevant to the user's request.`;

      case 'captions':
        return `You are an expert social media copywriter. Create engaging captions for the following content:

Content Description: ${userPrompt}

Please provide captions in the following JSON format:
{
  "hook": "Attention-grabbing opening line (first 3-5 words)",
  "main_content": "Engaging middle section that provides value",
  "cta": "Strong call-to-action that encourages engagement"
}

Focus on:
- Hook that stops the scroll in the first 3 seconds
- Main content that provides value and builds connection
- CTA that encourages comments, saves, or shares
- Emotional appeal and relatability

Be specific to the user's content request.`;

      case 'scripts':
        return `You are an expert video script writer. Create a compelling script for the following content:

Content Description: ${userPrompt}

Please provide a script in the following JSON format:
{
  "hook": "Opening line that grabs attention (0-3 seconds)",
  "steps": [
    "Step 1: Clear, actionable instruction",
    "Step 2: Next important point",
    "Step 3: Additional value or insight"
  ],
  "outro": "Strong closing with call-to-action"
}

Focus on:
- Hook that immediately captures attention
- Clear, actionable steps that are easy to follow
- Engaging storytelling throughout
- Strong outro that encourages engagement

Be specific to the user's content request.`;

      case 'songs':
        return `You are an expert music curator for social media content. Suggest trending music for the following content:

Content Description: ${userPrompt}

Please provide music suggestions in the following JSON format:
{
  "trending": ["Song Name - Artist", "Song Name - Artist"],
  "mood_based": ["Upbeat: Song Name - Artist", "Chill: Song Name - Artist", "Motivational: Song Name - Artist"],
  "genre": ["Pop", "Hip-Hop", "Electronic", "Indie"]
}

SPECIAL INSTRUCTIONS:
- If the user mentions a specific artist (like "Honey Singh"), provide actual songs by that artist
- If they ask for "new songs", provide recent releases or popular tracks by that artist
- For Honey Singh specifically, include songs like "Blue Eyes", "Lungi Dance", "Dope Shope", "First Kiss", "Desi Kalakaar", "Angreji Beat", "Brown Rang", "High Heels", "Diljit Dosanjh", "Hookah Bar", etc.
- Always provide real song names and artists
- Focus on songs that are trending on social media platforms

Focus on:
- Currently trending songs on TikTok, Instagram, and YouTube
- Music that matches the content mood and energy
- Popular genres that work well for the content type
- Songs that are likely to be available for use
- If specific artist requested, provide their actual songs

Be very specific and provide real song names and artists.`;

      default:
        return `Generate content for: ${userPrompt}`;
    }
  };

  const prompt = getPromptForType(request.contentType, request.prompt);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert social media content creator. Provide detailed, actionable content in the exact JSON format requested. Ensure all responses are in valid JSON format. Be specific and provide real, actionable content based on the user\'s request.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI API');
    }

    console.log('OpenAI Response:', content); // Debug log

    // Parse the JSON response
    let generatedContent: ContentGenerationResponse;
    try {
      generatedContent = JSON.parse(content);
      // Hashtags
      if (
        request.contentType === 'hashtags' &&
        generatedContent.trending &&
        generatedContent.niche &&
        generatedContent.long_tail
      ) {
        generatedContent = { hashtags: {
          trending: generatedContent.trending,
          niche: generatedContent.niche,
          long_tail: generatedContent.long_tail
        }};
      }
      // Captions
      if (
        request.contentType === 'captions' &&
        generatedContent.hook &&
        generatedContent.main_content &&
        generatedContent.cta
      ) {
        generatedContent = { captions: {
          hook: generatedContent.hook,
          main_content: generatedContent.main_content,
          cta: generatedContent.cta
        }};
      }
      // Scripts
      if (
        request.contentType === 'scripts' &&
        generatedContent.hook &&
        generatedContent.steps &&
        generatedContent.outro
      ) {
        generatedContent = { scripts: {
          hook: generatedContent.hook,
          steps: generatedContent.steps,
          outro: generatedContent.outro
        }};
      }
      // Songs
      if (
        request.contentType === 'songs' &&
        generatedContent.trending &&
        generatedContent.mood_based &&
        generatedContent.genre
      ) {
        generatedContent = { songs: {
          trending: generatedContent.trending,
          mood_based: generatedContent.mood_based,
          genre: generatedContent.genre
        }};
      }
    } catch (parseError) {
      // Try to extract JSON from the response using regex
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          generatedContent = JSON.parse(match[0]);
          // Hashtags
          if (
            request.contentType === 'hashtags' &&
            generatedContent.trending &&
            generatedContent.niche &&
            generatedContent.long_tail
          ) {
            generatedContent = { hashtags: {
              trending: generatedContent.trending,
              niche: generatedContent.niche,
              long_tail: generatedContent.long_tail
            }};
          }
          // Captions
          if (
            request.contentType === 'captions' &&
            generatedContent.hook &&
            generatedContent.main_content &&
            generatedContent.cta
          ) {
            generatedContent = { captions: {
              hook: generatedContent.hook,
              main_content: generatedContent.main_content,
              cta: generatedContent.cta
            }};
          }
          // Scripts
          if (
            request.contentType === 'scripts' &&
            generatedContent.hook &&
            generatedContent.steps &&
            generatedContent.outro
          ) {
            generatedContent = { scripts: {
              hook: generatedContent.hook,
              steps: generatedContent.steps,
              outro: generatedContent.outro
            }};
          }
          // Songs
          if (
            request.contentType === 'songs' &&
            generatedContent.trending &&
            generatedContent.mood_based &&
            generatedContent.genre
          ) {
            generatedContent = { songs: {
              trending: generatedContent.trending,
              mood_based: generatedContent.mood_based,
              genre: generatedContent.genre
            }};
          }
        } catch (e) {
          throw new Error('Invalid JSON response from OpenAI API: ' + content);
        }
      } else {
        throw new Error('Invalid JSON response from OpenAI API: ' + content);
      }
    }

    // Validate and provide fallbacks
    const validatedContent: ContentGenerationResponse = {};
    
    if (request.contentType === 'hashtags') {
      validatedContent.hashtags = {
        trending: generatedContent.hashtags?.trending || ["#viral", "#trending", "#fyp"],
        niche: generatedContent.hashtags?.niche || ["#content", "#socialmedia"],
        long_tail: generatedContent.hashtags?.long_tail || ["#specificcontent", "#nicheaudience"]
      };
    } else if (request.contentType === 'captions') {
      validatedContent.captions = {
        hook: generatedContent.captions?.hook || "Stop scrolling! Here's what you need to know...",
        main_content: generatedContent.captions?.main_content || "This content will change everything you thought you knew about this topic.",
        cta: generatedContent.captions?.cta || "Save this post and try it today! What's your experience? Comment below! 👇"
      };
    } else if (request.contentType === 'scripts') {
      validatedContent.scripts = {
        hook: generatedContent.scripts?.hook || "You've been doing this wrong your entire life",
        steps: generatedContent.scripts?.steps || ["First, start with the basics", "Next, build on that foundation", "Finally, master the advanced techniques"],
        outro: generatedContent.scripts?.outro || "Try this for 7 days and watch what happens!"
      };
    } else if (request.contentType === 'songs') {
      validatedContent.songs = {
        trending: generatedContent.songs?.trending || ["Popular Song - Artist", "Trending Track - Artist"],
        mood_based: generatedContent.songs?.mood_based || ["Upbeat: Energetic Song - Artist", "Chill: Relaxing Track - Artist"],
        genre: generatedContent.songs?.genre || ["Pop", "Hip-Hop", "Electronic"]
      };
    }
    
    return validatedContent;
  } catch (error) {
    console.error('Error calling OpenAI API for content generation:', error);
    throw error;
  }
};

export const analyzeVideosWithChatGPT = async (
  request: VideoAnalysisRequest
): Promise<VideoAnalysisResponse> => {
  const prompt = `You are an expert social media video analyst specializing in viral content analysis. 

I have two videos to analyze:

1. USER VIDEO: ${request.userVideoName}
   Description: ${request.userVideoDescription}

2. VIRAL VIDEO: ${request.viralVideoName}
   Description: ${request.viralVideoDescription}

Please provide a comprehensive analysis comparing these videos and give specific recommendations for improvement. 

Your response should be in the following JSON format:

{
  "overall_score": 85,
  "target_audience": {
    "primary_age_group": "18-34",
    "gender_split": {"male": 45, "female": 55},
    "interests": ["Fashion", "Music", "Technology"]
  },
  "technical_analysis": {
    "video_quality": 8,
    "audio_quality": 7,
    "visual_appeal": 9,
    "editing_quality": 8,
    "lighting": 7,
    "composition": 8
  },
  "content_strategy": {
    "hook_effectiveness": 9,
    "storytelling": 8,
    "call_to_action": 7,
    "trending_elements": 8,
    "authenticity": 9,
    "emotional_impact": 8
  },
  "performance_prediction": {
    "estimated_views": 50000,
    "estimated_engagement_rate": "8.5",
    "viral_potential": 75,
    "optimal_posting_time": "6:00 PM - 9:00 PM",
    "trending_score": 80
  },
  "recommendations": [
    "Improve lighting setup for better video quality",
    "Add more trending hashtags to increase discoverability"
  ],
  "missing_elements": [
    "Trending music",
    "Strong call-to-action"
  ],
  "detailed_analysis": "Provide a detailed written analysis of the comparison between the two videos, highlighting strengths, weaknesses, and specific areas for improvement. This should be 2-3 paragraphs of comprehensive analysis."
}

Please ensure all scores are realistic (1-10 scale) and provide actionable, specific recommendations based on current social media trends.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert social media video analyst. Provide detailed, actionable insights in the exact JSON format requested. Ensure all numeric values are numbers, not strings.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI API');
    }

    // Parse the JSON response
    let analysisResult: VideoAnalysisResponse;
    try {
      analysisResult = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from OpenAI API');
    }

    // Validate and ensure all required fields exist
    const validatedResult: VideoAnalysisResponse = {
      overall_score: analysisResult.overall_score || 50,
      target_audience: {
        primary_age_group: analysisResult.target_audience?.primary_age_group || "18-34",
        gender_split: {
          male: analysisResult.target_audience?.gender_split?.male || 50,
          female: analysisResult.target_audience?.gender_split?.female || 50
        },
        interests: analysisResult.target_audience?.interests || ["General"]
      },
      technical_analysis: {
        video_quality: analysisResult.technical_analysis?.video_quality || 5,
        audio_quality: analysisResult.technical_analysis?.audio_quality || 5,
        visual_appeal: analysisResult.technical_analysis?.visual_appeal || 5,
        editing_quality: analysisResult.technical_analysis?.editing_quality || 5,
        lighting: analysisResult.technical_analysis?.lighting || 5,
        composition: analysisResult.technical_analysis?.composition || 5
      },
      content_strategy: {
        hook_effectiveness: analysisResult.content_strategy?.hook_effectiveness || 5,
        storytelling: analysisResult.content_strategy?.storytelling || 5,
        call_to_action: analysisResult.content_strategy?.call_to_action || 5,
        trending_elements: analysisResult.content_strategy?.trending_elements || 5,
        authenticity: analysisResult.content_strategy?.authenticity || 5,
        emotional_impact: analysisResult.content_strategy?.emotional_impact || 5
      },
      performance_prediction: {
        estimated_views: analysisResult.performance_prediction?.estimated_views || 10000,
        estimated_engagement_rate: analysisResult.performance_prediction?.estimated_engagement_rate || "5.0",
        viral_potential: analysisResult.performance_prediction?.viral_potential || 50,
        optimal_posting_time: analysisResult.performance_prediction?.optimal_posting_time || "6:00 PM - 9:00 PM",
        trending_score: analysisResult.performance_prediction?.trending_score || 50
      },
      recommendations: analysisResult.recommendations || ["Focus on improving overall content quality"],
      missing_elements: analysisResult.missing_elements || ["Basic content elements"],
      detailed_analysis: analysisResult.detailed_analysis || "Analysis completed successfully."
    };
    
    return validatedResult;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}; 