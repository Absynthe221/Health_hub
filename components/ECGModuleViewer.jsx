'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, BookOpen, FileText, Video, Brain, CheckCircle } from 'lucide-react';
import ProgressBar from './dashboard/ProgressBar';
import QuizCard from './dashboard/QuizCard';

export default function ECGModuleViewer({ module, onComplete, onProgress }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedSlides, setCompletedSlides] = useState(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  // Initialize module data
  useEffect(() => {
    if (module) {
      setCurrentSlide(0);
      setProgress(0);
      setCompletedSlides(new Set());
      setQuizResults([]);
    }
  }, [module]);

  // Calculate progress
  useEffect(() => {
    const totalSlides = module?.slides?.length || 0;
    const completedCount = completedSlides.size;
    const newProgress = totalSlides > 0 ? (completedCount / totalSlides) * 100 : 0;
    setProgress(newProgress);
    
    if (onProgress) {
      onProgress(newProgress);
    }
  }, [completedSlides, module, onProgress]);

  const handleSlideComplete = () => {
    const newCompleted = new Set(completedSlides);
    newCompleted.add(currentSlide);
    setCompletedSlides(newCompleted);
  };

  const handleNextSlide = () => {
    if (currentSlide < (module?.slides?.length || 0) - 1) {
      handleSlideComplete();
      setCurrentSlide(currentSlide + 1);
    } else {
      // Module completed
      handleSlideComplete();
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleQuizStart = (quiz) => {
    setCurrentQuiz(quiz);
    setShowQuiz(true);
  };

  const handleQuizComplete = (results) => {
    setQuizResults(prev => [...prev, { slide: currentSlide, results }]);
    setShowQuiz(false);
    setCurrentQuiz(null);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!module) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No module selected</div>
      </div>
    );
  }

  const currentSlideData = module.slides?.[currentSlide];
  const hasVideo = currentSlideData?.video;
  const hasQuiz = currentSlideData?.quiz;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{module.title}</h1>
            <p className="text-blue-100 mt-1">{module.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Progress</div>
            <div className="text-2xl font-bold">{Math.round(progress)}%</div>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar progress={progress} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-96">
        {/* Slide Content */}
        <div className="flex-1 p-6">
          {currentSlideData && (
            <div className="h-full flex flex-col">
              {/* Slide Title */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileText className="mr-2" />
                  {currentSlideData.name || `Slide ${currentSlide + 1}`}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {currentSlide + 1} of {module.slides?.length || 0}
                  </span>
                  {completedSlides.has(currentSlide) && (
                    <CheckCircle className="text-green-500" size={20} />
                  )}
                </div>
              </div>

              {/* Slide Content */}
              <div className="flex-1 bg-gray-50 rounded-lg p-6 mb-4">
                {hasVideo ? (
                  <div className="relative">
                    <video 
                      className="w-full h-48 object-cover rounded-lg"
                      controls
                      autoPlay={isPlaying}
                      muted={isMuted}
                      volume={volume}
                    >
                      <source src={currentSlideData.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute bottom-2 left-2 flex space-x-2">
                      <button
                        onClick={togglePlayPause}
                        className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <FileText className="mx-auto text-gray-400 mb-2" size={48} />
                      <p className="text-gray-500">Slide content will be displayed here</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {currentSlideData.content || 'No content available for this slide'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Slide Description */}
                {currentSlideData.description && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{currentSlideData.description}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePreviousSlide}
                  disabled={currentSlide === 0}
                  className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipBack size={16} className="mr-2" />
                  Previous
                </button>

                <div className="flex space-x-2">
                  {hasQuiz && (
                    <button
                      onClick={() => handleQuizStart(currentSlideData.quiz)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <Brain size={16} className="mr-2" />
                      Take Quiz
                    </button>
                  )}
                  
                  <button
                    onClick={handleNextSlide}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {currentSlide === (module.slides?.length || 0) - 1 ? 'Complete' : 'Next'}
                    <SkipForward size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-l p-4">
          <h3 className="font-semibold mb-4 flex items-center">
            <BookOpen className="mr-2" />
            Module Overview
          </h3>

          {/* Learning Objectives */}
          {module.objectives && (
            <div className="mb-6">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Learning Objectives</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {module.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={14} />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Module Info */}
          <div className="mb-6">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Module Information</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Duration:</strong> {module.duration} minutes</div>
              <div><strong>Difficulty:</strong> {module.difficulty}</div>
              {module.prerequisites && (
                <div><strong>Prerequisites:</strong> {module.prerequisites}</div>
              )}
            </div>
          </div>

          {/* Slide Navigation */}
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Slides</h4>
            <div className="space-y-1">
              {module.slides?.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-full text-left p-2 rounded text-sm transition-colors ${
                    index === currentSlide
                      ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                      : completedSlides.has(index)
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{slide.name || `Slide ${index + 1}`}</span>
                    {completedSlides.has(index) && (
                      <CheckCircle className="text-green-500" size={14} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && currentQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <QuizCard
              quiz={currentQuiz}
              onComplete={handleQuizComplete}
              onClose={() => setShowQuiz(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
