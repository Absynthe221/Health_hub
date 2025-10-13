'use client';

import React, { forwardRef, useEffect, useState } from 'react';

const SlideAudio = forwardRef(({ audioSrc, isPlaying, onPlayPause, onEnded }, ref) => {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (ref?.current) {
      const audio = ref.current;
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        setIsLoading(false);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        onEnded?.();
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [ref, onEnded]);

  useEffect(() => {
    if (ref?.current) {
      if (isPlaying) {
        ref.current.play().catch(console.error);
      } else {
        ref.current.pause();
      }
    }
  }, [isPlaying, ref]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (ref?.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      ref.current.currentTime = newTime;
    }
  };

  if (!audioSrc) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.816a1 1 0 011.617.816z" />
        </svg>
        <p className="mt-2 text-sm text-gray-500">No audio available for this slide</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <button
          onClick={onPlayPause}
          disabled={isLoading}
          className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <div 
              className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all duration-200"
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <audio
        ref={ref}
        src={audioSrc}
        preload="metadata"
        className="hidden"
      />
    </div>
  );
});

SlideAudio.displayName = 'SlideAudio';

export default SlideAudio;




