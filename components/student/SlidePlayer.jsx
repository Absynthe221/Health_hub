'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

export default function SlidePlayer({ module, onSlideChange, onComplete }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentSlide = module?.slides?.[currentSlideIndex] || {};
  const totalSlides = module?.slides?.length || 0;
  
  // Handle different slide formats (uploaded vs comprehensive)
  const slideTitle = currentSlide.title || currentSlide.slideTitle || `Slide ${currentSlideIndex + 1}`;
  const slideContent = currentSlide.content || currentSlide.slideContent || '';
  const slideImage = currentSlide.image || currentSlide.slideImage || null;
  const slideAudio = currentSlide.audio || currentSlide.slideAudio || null;
  const slideVideo = currentSlide.video || currentSlide.slideVideo || null;
  const slideQuiz = currentSlide.quiz || currentSlide.slideQuiz || null;
  const slideSubtitle = currentSlide.subtitle || currentSlide.slideSubtitle || '';
  const slideNotes = currentSlide.notes || currentSlide.slideNotes || '';
  const slideAnnotations = currentSlide.annotations || currentSlide.slideAnnotations || [];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNextSlide();
            return 0;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setProgress(0);
      onSlideChange?.(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setProgress(0);
      onSlideChange?.(currentSlideIndex + 1);
    } else {
      onComplete?.();
    }
  };

  const handleSlideClick = (index) => {
    setCurrentSlideIndex(index);
    setProgress(0);
    onSlideChange?.(index);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetProgress = () => {
    setProgress(0);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{module?.title || 'ECG Training Module'}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-2 hover:bg-gray-700 rounded"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-sm text-gray-300 mb-1">
            <span>Slide {currentSlideIndex + 1} of {totalSlides}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="p-6 min-h-[400px]">
        {currentSlide ? (
          <div className="space-y-6">
            {/* Slide Title */}
            <h3 className="text-2xl font-bold text-gray-900">
              {slideTitle}
            </h3>

            {/* Slide Subtitle */}
            {slideSubtitle && (
              <p className="text-lg text-gray-600 mb-4">{slideSubtitle}</p>
            )}

            {/* Slide Content */}
            <div className="prose max-w-none">
              {slideContent && (
                <div className="text-gray-700 leading-relaxed mb-6">
                  {slideContent}
                </div>
              )}

              {/* Slide Image */}
              {slideImage && (
                <div className="my-6">
                  <img 
                    src={slideImage} 
                    alt={slideTitle}
                    className="w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = '/placeholder-ecg.svg';
                    }}
                  />
                </div>
              )}

              {/* Slide Video */}
              {slideVideo && (
                <div className="my-6">
                  <video 
                    src={slideVideo} 
                    controls
                    className="w-full h-auto rounded-lg shadow-md"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Slide Audio */}
              {slideAudio && !isMuted && (
                <div className="my-4">
                  <audio 
                    src={slideAudio} 
                    controls
                    className="w-full"
                    autoPlay={isPlaying}
                    loop={false}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Slide Notes */}
              {slideNotes && (
                <div className="bg-yellow-50 p-4 rounded-lg my-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">Notes:</h4>
                  <p className="text-yellow-800">{slideNotes}</p>
                </div>
              )}

              {/* Slide Annotations */}
              {slideAnnotations && slideAnnotations.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg my-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Points:</h4>
                  <ul className="list-disc list-inside text-blue-800 space-y-1">
                    {slideAnnotations.map((annotation, index) => (
                      <li key={index}>{annotation}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Learning Objectives */}
              {currentSlide.objectives && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Learning Objectives:</h4>
                  <ul className="list-disc list-inside text-blue-800 space-y-1">
                    {currentSlide.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quiz Section */}
              {slideQuiz && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Quick Quiz:</h4>
                  <p className="text-yellow-800">{slideQuiz.question || slideQuiz}</p>
                  {slideQuiz.options && (
                    <div className="mt-3 space-y-2">
                      {slideQuiz.options.map((option, index) => (
                        <label key={index} className="flex items-center space-x-2">
                          <input type="radio" name="quiz" value={option} className="text-yellow-600" />
                          <span className="text-yellow-800">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No slide content available</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-100 p-4 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousSlide}
              disabled={currentSlideIndex === 0}
              className="p-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            
            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex === totalSlides - 1}
              className="p-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={resetProgress}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="text-sm text-gray-600">
            {currentSlideIndex + 1} / {totalSlides}
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => handleSlideClick(index)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  index === currentSlideIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}