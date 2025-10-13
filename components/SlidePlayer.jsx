'use client';

import React, { useState, useEffect, useRef } from 'react';
import SlideControls from './SlideControls';
import SlideVisual from './SlideVisual';
import SlideAudio from './SlideAudio';
import SlideSubtitles from './SlideSubtitles';
import MCQQuiz from './MCQQuiz';
import ProgressBar from './ProgressBar';

const SlidePlayer = ({ module, onComplete, user }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedSlides, setCompletedSlides] = useState(new Set());
  const [quizResults, setQuizResults] = useState({});
  
  const audioRef = useRef(null);
  const currentSlide = module?.slides?.[currentSlideIndex];

  const totalSlides = module?.slides?.length || 0;
  const progress = totalSlides > 0 ? (completedSlides.size / totalSlides) * 100 : 0;

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setShowQuiz(false);
    } else {
      // Module completed
      onComplete?.();
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setShowQuiz(false);
    }
  };

  const handleSlideComplete = async () => {
    setCompletedSlides(prev => new Set([...prev, currentSlideIndex]));
    setShowQuiz(true);
    // Persist slide completion
    try {
      if (user?.id && (module?.title || module?.moduleName)) {
        const moduleId = module.title || module.moduleName;
        const slideNumber = currentSlideIndex + 1;
        const totalSlides = module?.slides?.length || 0;
        const completedCount = completedSlides.size + 1;
        const overall = Math.round((completedCount / totalSlides) * 100);
        const { ecgAPI } = await import('../lib/api');
        await ecgAPI.updateProgress(user.id, encodeURIComponent(moduleId), {
          slideNumber,
          slideProgress: 100,
          totalSlides,
          progress: overall
        });
      }
    } catch (e) {
      console.error('Failed to persist slide progress', e);
    }
  };

  const handleQuizComplete = (results) => {
    setQuizResults(prev => ({
      ...prev,
      [currentSlideIndex]: results
    }));
    setShowQuiz(false);
    handleNextSlide();
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    handleSlideComplete();
  };

  if (!module || !currentSlide) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No slide data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Progress Bar */}
      <div className="p-4 border-b">
        <ProgressBar 
          current={currentSlideIndex + 1} 
          total={totalSlides} 
          progress={progress}
        />
      </div>

      {/* Slide Content */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentSlide.title || `Slide ${currentSlideIndex + 1}`}
          </h2>
          <p className="text-gray-600">
            {currentSlide.text || 'No content available for this slide.'}
          </p>
        </div>

        {/* Visual Content */}
        <div className="mb-6">
          <SlideVisual 
            slide={currentSlide}
            slideNumber={currentSlideIndex + 1}
          />
        </div>

        {/* Audio Player */}
        {currentSlide.audio && (
          <div className="mb-6">
            <SlideAudio
              audioSrc={currentSlide.audio}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onEnded={handleAudioEnd}
              ref={audioRef}
            />
          </div>
        )}

        {/* Subtitles */}
        {currentSlide.subtitles && (
          <div className="mb-6">
            <SlideSubtitles
              subtitleSrc={currentSlide.subtitles}
              isPlaying={isPlaying}
            />
          </div>
        )}

        {/* Quiz */}
        {showQuiz && currentSlide.mcqs && currentSlide.mcqs.length > 0 && (
          <div className="mb-6">
            <MCQQuiz
              questions={currentSlide.mcqs}
              onComplete={async (results) => {
                try {
                  if (user?.id && (module?.title || module?.moduleName)) {
                    const moduleId = module.title || module.moduleName;
                    const slideNumber = currentSlideIndex + 1;
                    const { ecgAPI } = await import('../lib/api');
                    await ecgAPI.updateProgress(user.id, encodeURIComponent(moduleId), {
                      quizResults: { [slideNumber]: results },
                    });
                  }
                } catch (e) {
                  console.error('Failed to persist quiz results', e);
                }
                handleQuizComplete(results);
              }}
            />
          </div>
        )}

        {/* Controls */}
        <SlideControls
          currentSlide={currentSlideIndex + 1}
          totalSlides={totalSlides}
          onPrevious={handlePreviousSlide}
          onNext={handleNextSlide}
          onComplete={handleSlideComplete}
          canGoNext={currentSlideIndex < totalSlides - 1}
          canGoPrevious={currentSlideIndex > 0}
        />
      </div>
    </div>
  );
};

export default SlidePlayer;
