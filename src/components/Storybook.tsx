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
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover, 1+ = story pages, last = end page
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isFlipping, setIsFlipping] = useState(false);

  // Total pages including cover and end page
  const totalPages = story.pages.length + 2; // +1 for cover, +1 for end page

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
      if (isFlipping) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          if (currentPage > 0) flipToPage(currentPage - 1);
          break;
        case 'ArrowRight':
          if (currentPage < totalPages - 1) flipToPage(currentPage + 1);
          break;
        case 'Home':
          flipToPage(0);
          break;
        case 'End':
          flipToPage(totalPages - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, totalPages, isFlipping]);

  const handleImageLoad = (pageNumber: number) => {
    setLoadedImages(prev => new Set(prev).add(pageNumber));
  };

  const flipToPage = (newPage: number) => {
    if (isFlipping || newPage === currentPage) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setTimeout(() => setIsFlipping(false), 300);
    }, 300);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      flipToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      flipToPage(currentPage - 1);
    }
  };

  const restartStory = () => {
    flipToPage(0);
  };

  // Get current story page data
  const getCurrentPageData = () => {
    if (currentPage === 0) return null; // Cover page
    if (currentPage === totalPages - 1) return null; // End page
    return story.pages[currentPage - 1]; // Story pages
  };

  const currentPageData = getCurrentPageData();
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;
  const isCoverPage = currentPage === 0;
  const isEndPage = currentPage === totalPages - 1;

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-2">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between "
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

          {/* <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              {story.title}
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              {isCoverPage ? 'Cover' : isEndPage ? 'The End' : `Page ${currentPage} of ${story.pages.length}`}
            </p>
          </div> */}

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

        {/* Navigation Buttons - Positioned to not overlap title */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevPage}
              disabled={isFirstPage || isFlipping}
              className="bg-amber-800/90 backdrop-blur-sm border-2 border-amber-600 rounded-full p-4 text-cream-100 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <div className="text-white/60 text-sm font-medium px-4">
              {currentPage + 1} / {totalPages}
            </div>

            <motion.button
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextPage}
              disabled={isLastPage || isFlipping}
              className="bg-amber-800/90 backdrop-blur-sm border-2 border-amber-600 rounded-full p-4 text-cream-100 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Storybook */}
        <div className="max-w-7xl mx-auto">
          <div className="relative perspective-1000">
            {/* Book Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              className="relative mx-auto"
              style={{
                maxWidth: '1200px',
                minHeight: '80vh',
              }}
            >
              {/* Book Shadow */}
              <div className="absolute inset-0 bg-black/30 blur-xl transform translate-y-8 scale-95 -z-10 rounded-3xl"></div>
              
              {/* Book Spine Effect */}
              <div className="absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 transform -translate-x-1/2 rounded-l-sm shadow-inner z-20">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20"></div>
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 text-amber-100 text-xs font-bold whitespace-nowrap">
                  {story.title.substring(0, 20)}
                </div>
              </div>

              {/* Left Page - Image, Cover, or End Page */}
              <motion.div
                className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-cream-50 to-cream-100 rounded-l-3xl border-8 border-amber-800 border-r-4 shadow-2xl overflow-hidden"
                animate={{
                  rotateY: isFlipping ? -15 : 0,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  background: 'linear-gradient(135deg, #fefdf9 0%, #fef7ed 50%, #fed7aa 100%)',
                }}
              >
                {/* Page texture */}
                <div className="absolute inset-0 bg-paper-texture opacity-10"></div>
                
                <div className="relative z-10 h-full">
                  {isCoverPage ? (
                    // Cover page
                    <div className="h-full flex flex-col justify-center items-center text-center p-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-amber-800"
                      >
                        <div className="mb-8">
                          <div className="w-32 h-32 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
                            <div className="text-4xl">📖</div>
                          </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-6 leading-tight">{story.title}</h1>
                        <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
                        <p className="text-lg italic mb-4">A Magical Story</p>
                        <p className="text-sm opacity-70">Turn the page to begin...</p>
                      </motion.div>
                    </div>
                  ) : isEndPage ? (
                    // End page
                    <div className="h-full flex flex-col justify-center items-center text-center p-8">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-amber-800"
                      >
                        <div className="mb-8">
                          <div className="w-32 h-32 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
                            <div className="text-4xl">🌟</div>
                          </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-6 leading-tight">The End</h1>
                        <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
                        <p className="text-lg italic mb-4">Thank you for reading!</p>
                        <motion.div
                          animate={{ 
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="text-2xl mb-4"
                        >
                          ⭐
                        </motion.div>
                        <p className="text-sm opacity-70">Hope you enjoyed the adventure!</p>
                      </motion.div>
                    </div>
                  ) : (
                    // Story page image - Full size to fit the entire left page
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`image-${currentPage}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="h-full w-full relative"
                      >
                        {isLoadingImages ? (
                          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                              <p className="text-amber-600 font-semibold">Generating illustration...</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <img
                              src={currentPageData?.imageUrl || `https://source.unsplash.com/600x800/?${encodeURIComponent(currentPageData?.imagePrompt || 'storybook illustration')}`}
                              alt={`Illustration for page ${currentPageData?.pageNumber}`}
                              className="w-full h-full object-cover"
                              onLoad={() => handleImageLoad(currentPageData?.pageNumber || 0)}
                            />
                            {/* Subtle vignette overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5"></div>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
                
                {/* Page binding holes */}
                <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-center gap-12 pr-2 z-20">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-amber-700 rounded-full shadow-inner"></div>
                  ))}
                </div>
              </motion.div>

              {/* Right Page - Text */}
              <motion.div
                className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-cream-50 to-cream-100 rounded-r-3xl border-8 border-amber-800 border-l-4 shadow-2xl overflow-hidden"
                animate={{
                  rotateY: isFlipping ? 15 : 0,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                  background: 'linear-gradient(135deg, #fefdf9 0%, #fef7ed 50%, #fed7aa 100%)',
                }}
              >
                {/* Page texture */}
                <div className="absolute inset-0 bg-paper-texture opacity-10"></div>
                
                <div className="p-12 h-full flex flex-col justify-center relative z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`text-${currentPage}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      {isCoverPage ? (
                        // Cover page right side
                        <div className="text-amber-800">
                          <div className="space-y-8">
                            <div>
                              <h2 className="text-2xl font-bold mb-4">Story Details</h2>
                              <div className="space-y-3 text-left">
                                <p className="text-sm"><strong>Pages:</strong> {story.pages.length}</p>
                                <p className="text-sm"><strong>Genre:</strong> Children's Story</p>
                                <p className="text-sm"><strong>Reading Time:</strong> ~{Math.ceil(story.pages.length * 1.5)} minutes</p>
                              </div>
                            </div>
                            
                            <div className="border-t border-amber-300 pt-6">
                              <p className="text-lg italic mb-6">
                                "Every great story begins with turning the first page..."
                              </p>
                              
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.05, 1],
                                  opacity: [0.7, 1, 0.7]
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                className="text-center"
                              >
                                <div className="text-3xl mb-2">→</div>
                                <p className="text-sm font-semibold">Start Reading</p>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      ) : isEndPage ? (
                        // End page right side
                        <div className="text-amber-800">
                          <div className="space-y-8">
                            <div>
                              <h2 className="text-2xl font-bold mb-6">Story Complete!</h2>
                              <div className="space-y-4">
                                <p className="text-lg italic">
                                  "And so our adventure comes to an end, but the memories will last forever..."
                                </p>
                                <div className="flex justify-center space-x-2 text-2xl">
                                  <span>🌟</span>
                                  <span>📖</span>
                                  <span>✨</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border-t border-amber-300 pt-6">
                              <p className="text-sm mb-4">Would you like to:</p>
                              <div className="space-y-2 text-sm">
                                <button 
                                  onClick={restartStory}
                                  className="block w-full bg-amber-200 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors"
                                >
                                  📖 Read Again
                                </button>
                                <button className="block w-full bg-amber-200 hover:bg-amber-300 px-4 py-2 rounded-lg transition-colors">
                                  ⭐ Rate Story
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Story text pages
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                          >
                            <div className="inline-block bg-amber-800 text-cream-50 px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                              Page {currentPageData?.pageNumber}
                            </div>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="prose prose-lg max-w-none"
                          >
                            <p className="text-amber-900 leading-relaxed text-lg font-medium">
                              {currentPageData?.text}
                            </p>
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Page number at bottom */}
                  <div className="absolute bottom-8 right-8 text-amber-600 text-sm font-bold">
                    {isCoverPage ? 'Cover' : isEndPage ? 'End' : currentPage}
                  </div>
                </div>

                {/* Page binding holes */}
                <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-center gap-12 pl-2 z-20">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-amber-700 rounded-full shadow-inner"></div>
                  ))}
                </div>
              </motion.div>

              {/* Page curl effect for right page */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-transparent via-amber-200 to-amber-300 transform rotate-45 opacity-30 pointer-events-none"></div>
            </motion.div>
          </div>

          {/* Page Indicators */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-3 bg-amber-800/20 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-600/30">
              {[...Array(totalPages)].map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.4 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => flipToPage(index)}
                  disabled={isFlipping}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentPage
                      ? 'bg-amber-400 scale-125 shadow-lg ring-2 ring-amber-300'
                      : index === 0 
                      ? 'bg-amber-500 hover:bg-amber-400' // Cover page indicator
                      : index === totalPages - 1
                      ? 'bg-amber-600 hover:bg-amber-500' // End page indicator
                      : 'bg-cream-300 hover:bg-cream-200'
                  }`}
                  title={
                    index === 0 ? 'Cover' : 
                    index === totalPages - 1 ? 'The End' : 
                    `Page ${index}`
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for additional effects */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .bg-paper-texture {
          background-image: 
            radial-gradient(circle at 1px 1px, rgba(139, 69, 19, 0.1) 1px, transparent 0);
          background-size: 25px 25px;
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
