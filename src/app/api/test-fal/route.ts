import { NextRequest, NextResponse } from 'next/server';
import { falAIService } from '@/lib/fal-ai';

export async function GET(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: 'Fal AI key not configured' },
        { status: 500 }
      );
    }

    console.log('Testing Fal AI image generation...');
    
    // Test image generation
    const imageUrl = await falAIService.generateImage(
      "A magical forest with glowing mushrooms and fairy lights"
    );

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Fal AI image generation test successful'
    });
  } catch (error) {
    console.error('Fal AI test failed:', error);
    return NextResponse.json(
      { 
        error: 'Fal AI test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 