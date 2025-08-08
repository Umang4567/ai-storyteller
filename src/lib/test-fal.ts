import { fal } from '@fal-ai/client';

// Test function to verify Fal AI integration
export async function testFalAI() {
  try {
    // Configure Fal AI
    fal.config({
      credentials: process.env.FAL_KEY,
    });

    console.log('Testing Fal AI image generation...');
    
    const result = await fal.subscribe("fal-ai/ideogram/v2a/turbo", {
      input: {
        prompt: "A beautiful children's book illustration of a magical forest with glowing mushrooms and fairy lights",
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log('Fal AI test successful!');
    console.log('Generated image URL:', result.data?.images?.[0]?.url);
    
    return result.data?.images?.[0]?.url;
  } catch (error) {
    console.error('Fal AI test failed:', error);
    throw error;
  }
} 