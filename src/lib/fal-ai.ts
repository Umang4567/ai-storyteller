import { fal } from '@fal-ai/client';

export class FalAIService {
  constructor() {
    // Configure Fal AI
    fal.config({
      credentials: process.env.FAL_KEY,
    });
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      console.log('Generating image with Fal AI for prompt:', prompt);
      
      // Try using the REST API approach
      const result = await fal.run("fal-ai/ideogram/v2a/turbo", {
        input: {
          prompt: `Create a beautiful, colorful children's book illustration: ${prompt}. Style: whimsical, magical, child-friendly, vibrant colors, detailed but simple enough for children.`,
        },
      });

      console.log('Fal AI result:', result);

      if (!result || !result.data || !result.data.images || result.data.images.length === 0) {
        console.error('No images in result:', result);
        throw new Error('No image generated');
      }

      const imageUrl = result.data.images[0].url;
      console.log('Generated image URL:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error generating image with Fal AI:', error);
      
      // Try alternative model if the first one fails
      try {
        console.log('Trying alternative Fal AI model...');
        const result = await fal.run("fal-ai/ideogram/v2a", {
          input: {
            prompt: `Create a beautiful, colorful children's book illustration: ${prompt}. Style: whimsical, magical, child-friendly, vibrant colors, detailed but simple enough for children.`,
          },
        });

        if (result && result.data && result.data.images && result.data.images.length > 0) {
          const imageUrl = result.data.images[0].url;
          console.log('Generated image URL (alternative):', imageUrl);
          return imageUrl;
        }
      } catch (altError) {
        console.error('Alternative model also failed:', altError);
      }
      
      // Fallback to Unsplash if Fal AI image generation fails
      const encodedPrompt = encodeURIComponent(prompt);
      const fallbackUrl = `https://source.unsplash.com/1024x1024/?${encodedPrompt}`;
      console.log('Using fallback URL:', fallbackUrl);
      return fallbackUrl;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Fal AI connection...');
      const result = await fal.run("fal-ai/ideogram/v2a/turbo", {
        input: {
          prompt: "A simple test image of a red circle",
        },
      });
      
      console.log('Fal AI test successful:', result);
      return true;
    } catch (error) {
      console.error('Fal AI test failed:', error);
      return false;
    }
  }
}

export const falAIService = new FalAIService(); 