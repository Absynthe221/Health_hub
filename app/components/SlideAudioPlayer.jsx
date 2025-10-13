'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Settings, Loader } from 'lucide-react';

export default function SlideAudioPlayer({ 
  slideContent,
  slideTitle,
  autoPlay = false,
  onComplete
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioGenerated, setAudioGenerated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      setAudioGenerated(true);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (autoPlay && audioGenerated) {
      handlePlay();
    }
  }, [autoPlay, audioGenerated]);

  const generateAudioText = () => {
    let text = '';

    // Add title
    if (slideTitle) {
      text += slideTitle + '. ';
    }

    // Add content based on type
    if (typeof slideContent === 'string') {
      text += slideContent;
    } else if (slideContent?.clinicalPresentation) {
      // Clinical case narration
      const cp = slideContent.clinicalPresentation;
      text += `Clinical presentation. `;
      text += `${cp.age}, presenting with ${cp.chiefComplaint}. `;
      if (cp.duration) text += `Duration: ${cp.duration}. `;
      if (cp.associatedSymptoms) text += `Associated symptoms include ${cp.associatedSymptoms}. `;
      
      if (cp.vitalSigns) {
        text += `Vital signs: `;
        if (cp.vitalSigns.bp) text += `Blood pressure ${cp.vitalSigns.bp}, `;
        if (cp.vitalSigns.hr) text += `Heart rate ${cp.vitalSigns.hr}, `;
        if (cp.vitalSigns.rr) text += `Respiratory rate ${cp.vitalSigns.rr}. `;
      }
    }

    // Add ECG findings
    if (slideContent?.ecgFindings) {
      text += ` ECG findings include: `;
      slideContent.ecgFindings.forEach((finding, index) => {
        text += `${index + 1}. ${finding}. `;
      });
    }

    // Add diagnosis
    if (slideContent?.diagnosis) {
      text += ` The diagnosis is: ${slideContent.diagnosis}. `;
    }

    // Add management
    if (slideContent?.immediateManagement) {
      text += ` Immediate management steps: `;
      slideContent.immediateManagement.forEach((step, index) => {
        text += `${index + 1}. ${step}. `;
      });
    }

    // Add learning points
    if (slideContent?.keyLearningPoints) {
      text += ` Key learning points: `;
      slideContent.keyLearningPoints.forEach((point, index) => {
        text += `${index + 1}. ${point}. `;
      });
    }

    return text || 'No audio content available for this slide.';
  };

  const handlePlay = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsPlaying(true);
      } else {
        // Create new utterance
        const text = generateAudioText();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice (prefer UK English for healthcare)
        const voices = synthRef.current.getVoices();
        const ukVoice = voices.find(v => v.lang === 'en-GB') || voices[0];
        if (ukVoice) {
          utterance.voice = ukVoice;
        }

        utterance.rate = speed;
        utterance.pitch = 1.0;
        utterance.volume = isMuted ? 0 : 1;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => {
          setIsPlaying(false);
          if (onComplete) onComplete();
        };
        utterance.onerror = (error) => {
          console.error('Speech error:', error);
          setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = isMuted ? 1 : 0;
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      handleStop();
      setTimeout(() => handlePlay(), 100);
    }
  };

  if (!audioGenerated) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center text-gray-400 text-sm">
          <VolumeX className="h-4 w-4 mr-2" />
          <span>Audio not available in this browser</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-4 border-2 border-purple-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlay}
            className="flex items-center justify-center w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full transition-all transform hover:scale-110"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white ml-0.5" />
            )}
          </button>

          {/* Stop/Reset Button */}
          <button
            onClick={handleStop}
            className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full transition-all"
            title="Stop"
          >
            <RotateCcw className="h-5 w-5 text-white" />
          </button>

          {/* Mute Button */}
          <button
            onClick={handleMute}
            className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full transition-all"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-white" />
            ) : (
              <Volume2 className="h-5 w-5 text-white" />
            )}
          </button>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            {isPlaying && (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-green-400 animate-pulse"></div>
                <div className="w-1 h-6 bg-green-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-5 bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
            <span className="text-sm text-purple-200">
              {isPlaying ? 'Playing...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Speed Control */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-800 bg-opacity-50 rounded-lg px-3 py-2">
            <span className="text-xs text-purple-300">Speed:</span>
            {[0.75, 1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  speed === s
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Settings indicator */}
          <div className="flex items-center space-x-1 text-xs text-purple-300">
            <Settings className="h-4 w-4" />
            <span>AI TTS</span>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-3 pt-3 border-t border-purple-700">
        <p className="text-xs text-purple-200 flex items-center">
          <Volume2 className="h-3 w-3 mr-2" />
          Auto-generated narration using AI Text-to-Speech • Click play to listen
        </p>
      </div>
    </div>
  );
}

