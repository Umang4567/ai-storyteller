'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, RotateCcw, Download } from 'lucide-react';
import { Story } from '@/lib/openai';

interface StorybookProps {
  story: Story;
  onBack: () => void;
}

export default function Storybook({ story, onBack }: StorybookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Simulate image loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingImages(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (currentPage > 0) setCurrentPage(currentPage - 1);
          break;
        case 'ArrowRight':
          if (currentPage < story.pages.length - 1) setCurrentPage(currentPage + 1);
          break;
        case 'Home':
          setCurrentPage(0);
          break;
        case 'End':
          setCurrentPage(story.pages.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, story.pages.length]);

  const handleImageLoad = (pageNumber: number) => {
    setLoadedImages(prev => new Set(prev).add(pageNumber));
  };

  const nextPage = () => {
    if (currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const restartStory = () => {
    setCurrentPage(0);
  };

  const currentPageData = story.pages[currentPage];
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === story.pages.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Chat
          </motion.button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {story.title}
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Page {currentPage + 1} of {story.pages.length}
            </p>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartStory}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2 text-white hover:bg-white/20 transition-all"
              title="Restart Story"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-2 text-white hover:bg-white/20 transition-all"
              title="Download Story"
            >
              <Download className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Storybook */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Book Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl shadow-2xl border-8 border-amber-800 relative overflow-hidden"
              style={{
                minHeight: '70vh',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)',
              }}
            >
              {/* Book Pages */}
              <div className="relative h-full p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="h-full flex flex-col"
                  >
                    {/* Page Content */}
                    <div className="flex-1 flex flex-col lg:flex-row gap-8">
                      {/* Text Section */}
                      <div className="flex-1 flex flex-col justify-center">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
                        >
                          <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Page {currentPageData.pageNumber}
                          </h2>
                          <p className="text-lg text-gray-700 leading-relaxed">
                            {currentPageData.text}
                          </p>
                        </motion.div>
                      </div>

                      {/* Image Section */}
                      <div className="flex-1 flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="relative w-full max-w-md aspect-square"
                        >
                          {isLoadingImages ? (
                            <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl flex items-center justify-center">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                                <p className="text-purple-600 font-semibold">Generating illustration...</p>
                              </div>
                            </div>
                                                     ) : (
                             <div className="relative w-full h-full">
                               <img
                                 src={currentPageData.imageUrl || `https://source.unsplash.com/800x800/?${encodeURIComponent(currentPageData.imagePrompt)}`}
                                 alt={`Illustration for page ${currentPageData.pageNumber}`}
                                 className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white/50"
                                 onLoad={() => handleImageLoad(currentPageData.pageNumber)}
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                             </div>
                           )}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Page Turn Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-amber-600 to-transparent opacity-50"></div>
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-amber-600 to-transparent opacity-50"></div>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevPage}
                disabled={isFirstPage}
                className="pointer-events-auto bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all -ml-6"
              >
                <ChevronLeft className="w-8 h-8" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextPage}
                disabled={isLastPage}
                className="pointer-events-auto bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all -mr-6"
              >
                <ChevronRight className="w-8 h-8" />
              </motion.button>
            </div>
          </div>

          {/* Page Indicators */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {story.pages.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentPage
                      ? 'bg-purple-400 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 