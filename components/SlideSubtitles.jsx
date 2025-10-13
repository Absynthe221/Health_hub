'use client';

import React, { useState, useEffect } from 'react';

const SlideSubtitles = ({ subtitleSrc, isPlaying }) => {
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (subtitleSrc) {
      fetch(subtitleSrc)
        .then(response => response.text())
        .then(text => {
          const parsed = parseSRT(text);
          setSubtitles(parsed);
        })
        .catch(error => {
          console.error('Error loading subtitles:', error);
        });
    }
  }, [subtitleSrc]);

  useEffect(() => {
    if (!isPlaying || subtitles.length === 0) {
      setCurrentSubtitle(null);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const current = subtitles.find(sub => {
        const start = timeToMs(sub.start);
        const end = timeToMs(sub.end);
        return now >= start && now <= end;
      });
      setCurrentSubtitle(current);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, subtitles]);

  const parseSRT = (text) => {
    const blocks = text.trim().split(/\n\s*\n/);
    return blocks.map(block => {
      const lines = block.trim().split('\n');
      if (lines.length < 3) return null;
      
      const [index, timeRange, ...textLines] = lines;
      const [start, end] = timeRange.split(' --> ');
      
      return {
        index: parseInt(index),
        start: start.trim(),
        end: end.trim(),
        text: textLines.join(' ')
      };
    }).filter(Boolean);
  };

  const timeToMs = (timeStr) => {
    const [time, ms] = timeStr.split(',');
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000 + parseInt(ms);
  };

  if (!subtitleSrc) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-300">Subtitles</h4>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isVisible ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
        </button>
      </div>
      
      {isVisible && (
        <div className="min-h-[60px] flex items-center justify-center">
          {currentSubtitle ? (
            <p className="text-center text-lg leading-relaxed">
              {currentSubtitle.text}
            </p>
          ) : (
            <p className="text-gray-500 text-center">
              {isPlaying ? 'Loading subtitles...' : 'Subtitles will appear here when audio plays'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SlideSubtitles;




