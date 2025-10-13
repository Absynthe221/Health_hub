'use client'

import React, { useState, useRef, useEffect } from 'react'

/**
 * SegmentPlayer Component
 * 
 * Advanced media player for segmented content with precise timing control
 * Used in learner dashboard for interactive learning experiences
 */
export default function SegmentPlayer({
  segments = [],
  autoplay = false,
  onSegmentComplete = null,
  onAllComplete = null,
  className = ''
}) {
  const [currentSegment, setCurrentSegment] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  
  const videoRef = useRef(null)
  const progressRef = useRef(null)
  const hideControlsTimeout = useRef(null)

  const currentSegmentData = segments[currentSegment]

  // Update duration when segment changes
  useEffect(() => {
    if (videoRef.current && currentSegmentData) {
      const video = videoRef.current
      video.addEventListener('loadedmetadata', () => {
        setDuration(video.duration)
      })
      
      // Set video source
      if (currentSegmentData.mediaFile) {
        video.src = currentSegmentData.mediaFile
      }
    }
  }, [currentSegment, currentSegmentData])

  // Handle time updates
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      
      // Check if segment is complete
      if (video.currentTime >= duration && duration > 0) {
        handleSegmentComplete()
      }
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [duration])

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying && showControls) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current)
      }
    }
  }, [isPlaying, showControls])

  const handleSegmentComplete = () => {
    if (onSegmentComplete) {
      onSegmentComplete(currentSegmentData, currentSegment)
    }

    // Move to next segment
    if (currentSegment < segments.length - 1) {
      setCurrentSegment(currentSegment + 1)
      setCurrentTime(0)
    } else {
      // All segments complete
      setIsPlaying(false)
      if (onAllComplete) {
        onAllComplete(segments)
      }
    }
  }

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      video.play()
      setIsPlaying(true)
    }
  }

  const handleSeek = (event) => {
    const video = videoRef.current
    if (!video) return

    const rect = progressRef.current.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.muted = false
      setIsMuted(false)
    } else {
      video.muted = true
      setIsMuted(true)
    }
  }

  const goToSegment = (segmentIndex) => {
    if (segmentIndex >= 0 && segmentIndex < segments.length) {
      setCurrentSegment(segmentIndex)
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!currentSegmentData) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center h-64 ${className}`}>
        <div className="text-gray-500">No segments available</div>
      </div>
    )
  }

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        poster={currentSegmentData.poster}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleSegmentComplete}
        onClick={togglePlayPause}
      >
        <source src={currentSegmentData.mediaFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay Controls */}
      {showControls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex flex-col justify-between p-4">
          {/* Top Controls */}
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h3 className="text-lg font-semibold">{currentSegmentData.title}</h3>
              <p className="text-sm opacity-80">
                Segment {currentSegment + 1} of {segments.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 p-2"
              >
                {isMuted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L5.617 14H3a1 1 0 01-1-1V7a1 1 0 011-1h2.617l2.766-2.814a1 1 0 011-.11zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L5.617 14H3a1 1 0 01-1-1V7a1 1 0 011-1h2.617l2.766-2.814a1 1 0 011-.11zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Center Play Button */}
          <div className="flex justify-center items-center">
            <button
              onClick={togglePlayPause}
              className="text-white hover:text-gray-300 p-4"
            >
              {isPlaying ? (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">{formatTime(currentTime)}</span>
              <div
                ref={progressRef}
                className="flex-1 h-2 bg-gray-600 rounded-lg cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-blue-500 rounded-lg transition-all duration-200"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-white text-sm">{formatTime(duration)}</span>
            </div>

            {/* Segment Navigation */}
            {segments.length > 1 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => goToSegment(currentSegment - 1)}
                  disabled={currentSegment === 0}
                  className="px-3 py-1 text-white bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {segments.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSegment(index)}
                    className={`px-2 py-1 text-sm rounded ${
                      index === currentSegment
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => goToSegment(currentSegment + 1)}
                  disabled={currentSegment === segments.length - 1}
                  className="px-3 py-1 text-white bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Segment Info Overlay */}
      {currentSegmentData.content && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-3 rounded-lg">
          <p className="text-sm">{currentSegmentData.content}</p>
        </div>
      )}
    </div>
  )
}

/**
 * AudioSegmentPlayer Component
 * For audio-only segments
 */
export function AudioSegmentPlayer({
  segments = [],
  onSegmentComplete = null,
  onAllComplete = null,
  className = ''
}) {
  const [currentSegment, setCurrentSegment] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  const currentSegmentData = segments[currentSegment]

  useEffect(() => {
    if (audioRef.current && currentSegmentData) {
      const audio = audioRef.current
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })
      
      if (currentSegmentData.mediaFile) {
        audio.src = currentSegmentData.mediaFile
      }
    }
  }, [currentSegment, currentSegmentData])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleEnded = () => {
    if (currentSegment < segments.length - 1) {
      setCurrentSegment(currentSegment + 1)
      setCurrentTime(0)
    } else {
      setIsPlaying(false)
      onAllComplete && onAllComplete(segments)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">{currentSegmentData?.title}</h3>
          <p className="text-sm text-gray-600">
            Segment {currentSegment + 1} of {segments.length}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => currentSegment > 0 && setCurrentSegment(currentSegment - 1)}
            disabled={currentSegment === 0}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
            </svg>
          </button>

          <button
            onClick={togglePlayPause}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={() => currentSegment < segments.length - 1 && setCurrentSegment(currentSegment + 1)}
            disabled={currentSegment === segments.length - 1}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-lg">
            <div
              className="h-full bg-blue-500 rounded-lg transition-all duration-200"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>

        {currentSegmentData?.content && (
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {currentSegmentData.content}
          </div>
        )}
      </div>
    </div>
  )
}

