'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ videos, onProgressUpdate }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef(null);

  const currentVideo = videos?.[currentVideoIndex];

  useEffect(() => {
    if (currentVideo) {
      setPlayed(0);
      setIsPlaying(false);
      onProgressUpdate((currentVideoIndex / videos.length) * 100);
    }
  }, [currentVideoIndex, currentVideo, videos.length, onProgressUpdate]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
    const progress = ((currentVideoIndex + state.played) / videos.length) * 100;
    onProgressUpdate(progress);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeekChange = (e) => {
    const seekTo = parseFloat(e.target.value);
    setPlayed(seekTo);
    playerRef.current?.seekTo(seekTo);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
  };

  const goToPrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  const goToNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No video files available for this module.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentVideo?.title || 'Video Player'}
            </h3>
            <p className="text-sm text-gray-600">
              Video {currentVideoIndex + 1} of {videos.length}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevVideo}
              disabled={currentVideoIndex === 0}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={goToNextVideo}
              disabled={currentVideoIndex === videos.length - 1}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative">
        <div
          className="relative bg-black"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <ReactPlayer
            ref={playerRef}
            url={currentVideo?.url}
            width="100%"
            height="500px"
            playing={isPlaying}
            volume={volume}
            playbackRate={playbackRate}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              if (currentVideoIndex < videos.length - 1) {
                setTimeout(() => goToNextVideo(), 1000);
              }
            }}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload'
                }
              }
            }}
          />
          
          {/* Custom Controls Overlay */}
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <div className="space-y-3">
                {/* Progress Bar */}
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm font-mono">
                    {formatTime(played * duration)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={played}
                    onChange={handleSeekChange}
                    className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-white text-sm font-mono">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      {isPlaying ? (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </button>

                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handlePlaybackRateChange(rate)}
                          className={`px-2 py-1 text-xs rounded ${
                            playbackRate === rate
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 text-white hover:bg-gray-500'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Description */}
      {currentVideo?.description && (
        <div className="p-6 border-t">
          <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
          <p className="text-gray-700 text-sm">{currentVideo.description}</p>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="border-t px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Progress: {Math.round(((currentVideoIndex + played) / videos.length) * 100)}%
          </div>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentVideoIndex + played) / videos.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;





