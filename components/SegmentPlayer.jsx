'use client';

import React, { useEffect, useRef, useState } from 'react';
import MCQQuiz from './MCQQuiz';
import ProgressBar from './ProgressBar';
import LoadingSpinner from './LoadingSpinner';

const SegmentPlayer = ({ module, user }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState(new Set());
  const videoRef = useRef(null);
  const segments = module?.segments || [];

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(() => {});
    }
  }, [isPlaying, currentIndex]);

  if (!segments.length) {
    return (
      <div className="p-6">
        <div className="text-gray-600">No segments available.</div>
      </div>
    );
  }

  const seg = segments[currentIndex];
  const total = segments.length;
  const progress = total ? Math.round((completed.size / total) * 100) : 0;

  const handleComplete = async () => {
    setCompleted((prev) => new Set([...prev, seg.id || currentIndex + 1]));
    try {
      if (user?.id && (module?.title || module?.moduleName)) {
        const moduleId = module.title || module.moduleName;
        const { ecgAPI } = await import('../lib/api');
        await ecgAPI.updateSegmentProgress(
          user.id,
          encodeURIComponent(moduleId),
          seg.id || currentIndex + 1,
          100,
          { totalSegments: total }
        );
      }
    } catch (e) {}
  };

  const handleEnded = async () => {
    await handleComplete();
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <ProgressBar current={completed.size} total={total} />
      </div>
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Segment {currentIndex + 1}</h2>
        <video
          ref={videoRef}
          src={seg.video}
          controls
          className="w-full rounded-lg bg-black"
          onEnded={handleEnded}
        />
        {seg.subtitles && (
          <div className="text-sm text-gray-600">Subtitles available</div>
        )}

        {seg.mcqs && seg.mcqs.length > 0 && (
          <div className="mt-4">
            <MCQQuiz
              questions={seg.mcqs}
              onComplete={async (results) => {
                try {
                  if (user?.id && (module?.title || module?.moduleName)) {
                    const moduleId = module.title || module.moduleName;
                    const { ecgAPI } = await import('../lib/api');
                    await ecgAPI.updateProgress(user.id, encodeURIComponent(moduleId), {
                      quizResults: { [`segment-${seg.id || currentIndex + 1}`]: results },
                    });
                  }
                } catch {}
              }}
            />
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            className="px-4 py-2 rounded bg-gray-600 text-white disabled:opacity-50"
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <div className="space-x-2">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleComplete}
              className="px-4 py-2 rounded bg-green-600 text-white"
            >
              Mark Complete
            </button>
          </div>
          <button
            onClick={() => currentIndex < total - 1 && setCurrentIndex(currentIndex + 1)}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            disabled={currentIndex >= total - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SegmentPlayer;






