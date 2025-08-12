'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, Stars, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-sky-400 rounded-full opacity-30 particle"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-teal-400 rounded-full opacity-40 particle animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-emerald-400 rounded-full opacity-50 particle animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {!story ? (
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-6 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full blur-lg opacity-50"></div>
                <Sparkles className="w-16 h-16 text-sky-400 relative z-10" />
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent mb-4 animate-gradient"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                AI Storybook
              </motion.h1>
              
              <motion.p 
                className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Transform your imagination into magical illustrated stories with AI
              </motion.p>

              {/* Decorative elements */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <Stars className="w-6 h-6 text-sky-400 opacity-60" />
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
                <Zap className="w-6 h-6 text-emerald-400 opacity-60" />
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent"></div>
                <Stars className="w-6 h-6 text-sky-400 opacity-60" />
              </div>
            </motion.div>

            {/* Enhanced Chat Interface */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-teal-500/5 to-emerald-500/5 rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Messages */}
                <div className="h-96 overflow-y-auto mb-6 space-y-4 scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-transparent">
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
                          className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl relative ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-lg'
                              : 'bg-white/20 backdrop-blur-sm text-slate-100 border border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {message.type === 'bot' && (
                              <Bot className="w-4 h-4 text-teal-300" />
                            )}
                            <span className="text-xs opacity-70 font-medium">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{message.content}</p>
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
                      <div className="bg-white/20 backdrop-blur-sm text-slate-100 px-5 py-3 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                          <Bot className="w-4 h-4 text-teal-300" />
                          <div className="flex space-x-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                              className="w-2 h-2 bg-sky-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-teal-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-emerald-400 rounded-full"
                            />
                          </div>
                          <span className="text-sm font-medium">Creating your story...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Input Form */}
                <form onSubmit={handleSubmit} className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Tell me what story you'd like to create... (e.g., 'A boy finds a portal to another planet')"
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all hover:bg-white/15"
                      disabled={isGenerating}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!prompt.trim() || isGenerating}
                    className="bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-4 rounded-2xl font-semibold hover:from-sky-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg btn-modern relative overflow-hidden"
                  >
                    <Send className="w-5 h-5" />
                    Create Story
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        ) : (
          <Storybook story={story} onBack={() => setStory(null)} />
        )}
      </div>
    </div>
  );
} 