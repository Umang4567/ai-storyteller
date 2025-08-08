'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';
import { Story } from '@/lib/openai';
import Storybook from './Storybook';

export default function Chatbot() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
  }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: prompt,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsGenerating(true);

    try {
      // Call the API to generate story
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const generatedStory = await response.json();
      setStory(generatedStory);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot' as const,
        content: `I've created a magical story called "${generatedStory.title}" for you! Let me show you the storybook.`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating story:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot' as const,
        content: "I'm sorry, I encountered an error while creating your story. Please try again!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {!story ? (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6"
              >
                <Sparkles className="w-16 h-16 text-purple-400" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                AI Storybook
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Transform your imagination into magical illustrated stories with AI
              </p>
            </motion.div>

            {/* Chat Interface */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl"
            >
              {/* Messages */}
              <div className="h-96 overflow-y-auto mb-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-white/20 backdrop-blur-sm text-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {message.type === 'bot' && (
                            <Bot className="w-4 h-4 text-purple-300" />
                          )}
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/20 backdrop-blur-sm text-gray-100 px-4 py-3 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-purple-300" />
                        <div className="flex space-x-1">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                          />
                        </div>
                        <span className="text-sm">Creating your story...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Tell me what story you'd like to create... (e.g., 'A boy finds a portal to another planet')"
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    disabled={isGenerating}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Create Story
                </motion.button>
              </form>
            </motion.div>
          </div>
        ) : (
          <Storybook story={story} onBack={() => setStory(null)} />
        )}
      </div>
    </div>
  );
} 