import { NextRequest, NextResponse } from 'next/server';
import { openaiService } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if API keys are configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: 'Fal AI key not configured' },
        { status: 500 }
      );
    }

    // Generate story using OpenAI
    const story = await openaiService.generateStory(prompt);

    // Generate images for each page
    const storyWithImages = {
      ...story,
      pages: await Promise.all(
        story.pages.map(async (page: any) => {
          try {
            const imageUrl = await openaiService.generateImage(page.imagePrompt);
            return {
              ...page,
              imageUrl,
            };
          } catch (error) {
            console.error(`Error generating image for page ${page.pageNumber}:`, error);
            // Fallback to placeholder image
            return {
              ...page,
              imageUrl: `https://source.unsplash.com/1024x1024/?${encodeURIComponent(page.imagePrompt)}`,
            };
          }
        })
      ),
    };

    return NextResponse.json(storyWithImages);
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
} 