# 🚀 Setup Guide

## Getting Your API Keys

1. **Get OpenAI API Key**
   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Sign in with your OpenAI account
   - Click "Create API Key"
   - Copy the generated API key

2. **Get Fal AI Key**
   - Go to [https://console.fal.ai/](https://console.fal.ai/)
   - Sign in and create a new project
   - Get your API key from the project settings

3. **Configure Environment**
   - Create a `.env.local` file in the root directory
   - Add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   FAL_KEY=your_fal_key_here
   ```

4. **Restart Development Server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

## Testing the Application

1. **Start the app**: `npm run dev`
2. **Open browser**: Navigate to `http://localhost:3000`
3. **Try a prompt**: Type something like "A robot learns to paint with emotions"
4. **Watch the magic**: The AI will generate a complete storybook!

## Troubleshooting

### API Key Issues
- Make sure the `.env.local` file is in the root directory
- Verify all API keys are correct and have no extra spaces
- Check that you've restarted the development server

### Common Errors
- **"OpenAI API key not configured"**: Check your `.env.local` file for OPENAI_API_KEY
- **"Fal AI key not configured"**: Check your `.env.local` file for FAL_KEY
- **"Failed to generate story"**: Verify your API keys have proper permissions
- **Network errors**: Check your internet connection

## Next Steps

Once everything is working:
1. Try different story prompts
2. Explore the storybook navigation
3. Test on different devices
4. Consider deploying to Vercel or another platform

Happy storytelling! ✨ 