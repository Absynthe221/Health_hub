'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  BookOpen, 
  Brain, 
  Target, 
  CheckCircle, 
  Clock, 
  BarChart3,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  FileText,
  Video,
  Image,
  Headphones
} from 'lucide-react';
import QuizCard from './dashboard/QuizCard';

export default function ECGLearningInterface({ moduleId, onComplete, onProgress }) {
  const [module, setModule] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizActive, setQuizActive] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [caseStudy, setCaseStudy] = useState(null);
  const [aiChatActive, setAiChatActive] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const [mediaPlaying, setMediaPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fullScreen, setFullScreen] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);

  // Load module data
  useEffect(() => {
    if (moduleId) {
      loadModuleData();
    }
  }, [moduleId]);

  // Calculate progress
  useEffect(() => {
    if (module && module.slides) {
      const progress = ((currentSlideIndex + 1) / module.slides.length) * 100;
      setLearningProgress(progress);
      onProgress(progress);
    }
  }, [currentSlideIndex, module, onProgress]);

  const loadModuleData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load basic module data
      const response = await fetch(`/api/ecg-modules/${moduleId}`);
      if (!response.ok) {
        throw new Error('Module not found');
      }

      const moduleData = await response.json();
      setModule(moduleData);

      // Load AI-enhanced content if available
      await loadAIContent(moduleData);

    } catch (err) {
      console.error('Error loading module:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAIContent = async (moduleData) => {
    try {
      // Generate adaptive quiz for this module
      const quizResponse = await fetch('/api/ai/generateECGQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideContent: moduleData.slides?.slice(0, 3) || [],
          moduleContext: moduleData.title,
          questionCount: 5,
          difficulty: 'mixed',
          includeCaseStudies: true
        })
      });

      if (quizResponse.ok) {
        const quizData = await quizResponse.json();
        if (quizData.success && quizData.questions) {
          setQuizQuestions(quizData.questions);
        }
      }

      // Generate case study
      const caseStudyResponse = await fetch('/api/ai/generateCaseStudy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleContent: moduleData,
          caseType: 'clinical',
          difficulty: 'intermediate',
          includeECG: true
        })
      });

      if (caseStudyResponse.ok) {
        const caseStudyData = await caseStudyResponse.json();
        if (caseStudyData.success && caseStudyData.caseStudy) {
          setCaseStudy(caseStudyData.caseStudy);
        }
      }

      // Generate AI insights for current slide
      generateSlideInsights(moduleData.slides?.[currentSlideIndex]);

    } catch (error) {
      console.error('Error loading AI content:', error);
    }
  };

  const generateSlideInsights = async (slide) => {
    if (!slide) return;

    try {
      const response = await fetch('/api/ai/summarizeSlide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideContent: slide,
          moduleContext: module?.title
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAiInsights(data.summary);
        }
      }
    } catch (error) {
      console.error('Error generating slide insights:', error);
    }
  };

  const handleNextSlide = useCallback(() => {
    if (module && currentSlideIndex < module.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setQuizActive(false);
      setQuizCompleted(false);
      setAiInsights(null);
      generateSlideInsights(module.slides[currentSlideIndex + 1]);
    }
  }, [module, currentSlideIndex]);

  const handlePreviousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setQuizActive(false);
      setQuizCompleted(false);
      setAiInsights(null);
      generateSlideInsights(module.slides[currentSlideIndex - 1]);
    }
  }, [currentSlideIndex, module]);

  const handleStartQuiz = () => {
    setQuizActive(true);
    setQuizCompleted(false);
  };

  const handleQuizComplete = (results) => {
    setQuizCompleted(true);
    console.log('Quiz completed:', results);
  };

  const handleModuleComplete = () => {
    setLearningProgress(100);
    onComplete(module);
  };

  const toggleMediaPlayback = () => {
    setMediaPlaying(!mediaPlaying);
  };

  const toggleVolume = () => {
    setVolume(volume === 0 ? 1 : 0);
  };

  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading ECG module...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <HelpCircle className="h-8 w-8 text-red-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Module</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-8 text-gray-600">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <p>No module selected</p>
      </div>
    );
  }

  const currentSlide = module.slides?.[currentSlideIndex];
  const hasNextSlide = currentSlideIndex < module.slides.length - 1;
  const hasPreviousSlide = currentSlideIndex > 0;

  return (
    <div className={`space-y-6 ${fullScreen ? 'fixed inset-0 z-50 bg-white p-6' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
          <p className="text-gray-600 mt-1">{module.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAiChatActive(!aiChatActive)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Tutor
          </button>
          <button
            onClick={toggleFullScreen}
            className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {fullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Learning Progress</span>
          <span className="text-sm text-gray-500">
            Slide {currentSlideIndex + 1} of {module.slides?.length || 0}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${learningProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{Math.round(learningProgress)}% Complete</span>
          <span>{module.duration} minutes estimated</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slide Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Slide */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative h-96 bg-gray-100 flex items-center justify-center">
              {currentSlide?.image ? (
                <img 
                  src={currentSlide.image} 
                  alt={currentSlide.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>{currentSlide?.name || 'Slide Content'}</p>
                </div>
              )}
              
              {/* Media Controls Overlay */}
              {(currentSlide?.video || currentSlide?.audio) && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg flex items-center space-x-2">
                  <button onClick={toggleMediaPlayback}>
                    {mediaPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  {currentSlide.audio && <Headphones className="h-4 w-4" />}
                  {currentSlide.video && <Video className="h-4 w-4" />}
                  <button onClick={toggleVolume}>
                    {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {currentSlide?.name || `Slide ${currentSlideIndex + 1}`}
              </h3>
              <p className="text-gray-700 mb-4">
                {currentSlide?.content || 'Slide content will be displayed here.'}
              </p>
              
              {/* AI Insights */}
              {aiInsights && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Insights
                  </h4>
                  <p className="text-blue-700">{aiInsights}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousSlide}
              disabled={!hasPreviousSlide}
              className="flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SkipBack className="h-5 w-5 mr-2" />
              Previous
            </button>
            
            <div className="flex space-x-3">
              {quizQuestions.length > 0 && (
                <button
                  onClick={handleStartQuiz}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Target className="h-5 w-5 mr-2" />
                  Take Quiz
                </button>
              )}
              
              <button
                onClick={handleNextSlide}
                disabled={!hasNextSlide}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <SkipForward className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Module Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Duration: {module.duration} minutes</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Slides: {module.slides?.length || 0}</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-sm text-gray-600">Progress: {Math.round(learningProgress)}%</span>
              </div>
            </div>
          </div>

          {/* Quiz Section */}
          {quizQuestions.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Quiz</h3>
              <p className="text-sm text-gray-600 mb-4">
                Test your knowledge with AI-generated questions
              </p>
              <button
                onClick={handleStartQuiz}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Target className="h-4 w-4 mr-2" />
                Start Quiz ({quizQuestions.length} questions)
              </button>
            </div>
          )}

          {/* Case Study */}
          {caseStudy && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Case Study</h3>
              <p className="text-sm text-gray-600 mb-4">
                {caseStudy.title}
              </p>
              <button
                onClick={() => setCaseStudy(null)}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Case Study
              </button>
            </div>
          )}

          {/* AI Chat */}
          {aiChatActive && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Tutor Chat</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4 h-48 overflow-y-auto">
                <p className="text-sm text-gray-600">Ask questions about this ECG module...</p>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Modal */}
      {quizActive && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">ECG Knowledge Quiz</h3>
              <QuizCard
                quiz={{ questions: quizQuestions }}
                onSubmit={handleQuizComplete}
                showFeedback={quizCompleted}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setQuizActive(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

