import OpenAI from 'openai';
import { falAIService } from './fal-ai';

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface Story {
  title: string;
  pages: StoryPage[];
  prompt: string;
}

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateStory(prompt: string): Promise<Story> {
    try {
      const storyPrompt = `
        Create a 5-6 page children's storybook based on this prompt: "${prompt}"
        
        Generate the story in this exact JSON format:
        {
          "title": "Story Title",
          "pages": [
            {
              "pageNumber": 1,
              "text": "Page 1 story text (2-3 sentences)",
              "imagePrompt": "Detailed description for generating an illustration for this page"
            },
            {
              "pageNumber": 2,
              "text": "Page 2 story text (2-3 sentences)",
              "imagePrompt": "Detailed description for generating an illustration for this page"
            }
            // ... continue for 5-6 pages
          ]
        }
        
        Make the story engaging, age-appropriate, and ensure each page flows naturally to the next.
        Keep text concise but descriptive. Make image prompts detailed and specific for good illustrations.
        Return ONLY the JSON object, no additional text.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a creative children's story writer. Always respond with valid JSON only."
          },
          {
            role: "user",
            content: storyPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      });

      const text = completion.choices[0]?.message?.content;
      if (!text) {
        throw new Error('No response from OpenAI');
      }
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse story JSON');
      }
      
      const storyData = JSON.parse(jsonMatch[0]);
      return storyData as Story;
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story');
    }
  }

  async generateImage(prompt: string): Promise<string> {
    return falAIService.generateImage(prompt);
  }
}

export const openaiService = new OpenAIService(); 