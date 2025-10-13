'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, BookOpen, AlertTriangle } from 'lucide-react';

/**
 * SlidePlayer
 * A reusable slide player with navigation, progress, keyboard control, and basic error handling.
 */
export default function SlidePlayer({
  slides = [],
  initialIndex = 0,
  onIndexChange,
  onComplete,
  showThumbnails = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, Math.min(initialIndex, slides.length - 1)));
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  const totalSlides = slides?.length || 0;
  const currentSlide = useMemo(() => (totalSlides > 0 ? slides[currentIndex] : null), [slides, currentIndex, totalSlides]);

  useEffect(() => {
    setError(null);
  }, [currentIndex]);

  useEffect(() => {
    if (typeof onIndexChange === 'function') onIndexChange(currentIndex);
  }, [currentIndex, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key.toLowerCase() === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex, totalSlides]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsPlaying(false);
      if (typeof onComplete === 'function') onComplete();
    }
  }, [currentIndex, totalSlides, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  // Simple autoplay: advance every 10s if playing and slide has no duration, or use slide.duration if provided
  useEffect(() => {
    if (!isPlaying || totalSlides === 0) return;
    const seconds = Number(currentSlide?.duration) || 10;
    const timeout = setTimeout(() => handleNext(), seconds * 1000);
    return () => clearTimeout(timeout);
  }, [isPlaying, currentSlide, handleNext, totalSlides]);

  if (!Array.isArray(slides) || totalSlides === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-3 text-yellow-700">
          <AlertTriangle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">No slides available</p>
            <p className="text-sm text-yellow-800">Please check the module content or try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and progress */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Slide {currentIndex + 1} of {totalSlides}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
              aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === totalSlides - 1}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
          />
        </div>
      </div>

      {/* Slide body */}
      <div className="bg-white rounded-lg shadow p-6">
        {error ? (
          <div className="flex items-start space-x-3 text-red-700">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-medium">Failed to display slide</p>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{currentSlide?.title || 'Untitled Slide'}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>{currentSlide?.contentType || 'Content'}</span>
              {currentSlide?.duration ? <span>{currentSlide.duration} min</span> : null}
              {currentSlide?.interactive ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Interactive</span>
              ) : null}
            </div>

            {/* Text content */}
            {currentSlide?.content && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 whitespace-pre-line">{currentSlide.content}</p>
              </div>
            )}

            {/* Images */}
            {Array.isArray(currentSlide?.images) && currentSlide.images.length > 0 && (
              <div className="mb-6 space-y-4">
                {currentSlide.images.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Slide ${currentIndex + 1} - Image ${idx + 1}`}
                    className="w-full h-auto rounded-lg shadow-sm"
                    onError={() => setError('One or more images failed to load.')}
                  />
                ))}
              </div>
            )}

            {/* Quiz block placeholder */}
            {currentSlide?.quiz && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h5 className="text-lg font-semibold text-gray-900 mb-2">Quiz</h5>
                <p className="text-sm text-gray-700">Interactive quiz content goes here.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && totalSlides > 1 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-16 h-12 rounded-md border-2 transition-colors ${
                  idx === currentIndex ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-700">
                  {idx + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


