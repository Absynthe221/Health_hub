'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, MessageCircle, Play, Pause } from 'lucide-react';
import TutorChat from '../../components/TutorChat';
import ECGPuzzleGame from '../../components/ECGPuzzleGame';

export default function ECGTrainingModule({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [moduleData, setModuleData] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    if (session.user.role !== 'student') {
      router.push('/');
      return;
    }
    
    fetchModuleData();
  }, [session, status, router, params.moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/modules/${params.moduleId}`);
      const data = await response.json();
      
      if (data.success) {
        setModuleData(data.module);
      } else {
        // Fallback: try to get from our modules directory
        const modulesResponse = await fetch('/api/modules/list');
        const modulesData = await modulesResponse.json();
        const module = modulesData.modules.find(m => m.moduleId === params.moduleId);
        
        if (module) {
          // Fetch full module data
          const fullModuleResponse = await fetch(`/api/modules/${params.moduleId}`);
          if (fullModuleResponse.ok) {
            const fullData = await fullModuleResponse.json();
            setModuleData(fullData.module);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching module data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextSlide = () => {
    if (moduleData && currentSlideIndex < moduleData.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleSlideClick = (index) => {
    setCurrentSlideIndex(index);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h2>
          <p className="text-gray-600 mb-4">The requested module could not be found.</p>
          <button
            onClick={() => router.push('/dashboard/learner')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = moduleData.slides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard/learner')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{moduleData.moduleTitle}</h1>
                <p className="text-sm text-gray-500">Slide {currentSlideIndex + 1} of {moduleData.slides.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-2 rounded-lg transition-colors ${
                  showChat ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-700">Welcome, {session.user.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Slide Navigation */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Slide Navigation</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreviousSlide}
                    disabled={currentSlideIndex === 0}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    disabled={currentSlideIndex === moduleData.slides.length - 1}
                    className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Slide Thumbnails */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {moduleData.slides.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideClick(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg border-2 transition-colors ${
                      index === currentSlideIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-700">
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Slide Content */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentSlide.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{currentSlide.contentType}</span>
                  </span>
                  {currentSlide.duration && (
                    <span className="flex items-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span>{currentSlide.duration} min</span>
                    </span>
                  )}
                  {currentSlide.interactive && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Interactive
                    </span>
                  )}
                </div>
              </div>

              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-700 leading-relaxed">{currentSlide.content}</p>
                </div>

                {/* Audio/Video Content */}
                {currentSlide.audioFile && (
                  <div className="mb-6">
                    <audio controls className="w-full">
                      <source src={currentSlide.audioFile} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {/* Images */}
                {currentSlide.images && currentSlide.images.length > 0 && (
                  <div className="mb-6">
                    {currentSlide.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Slide ${currentSlideIndex + 1} - Image ${index + 1}`}
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    ))}
                  </div>
                )}

                {/* Interactive Quiz */}
                {currentSlide.quiz && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Quiz Question</h4>
                    <p className="text-gray-700 mb-4">{currentSlide.quiz.question}</p>
                    <div className="space-y-2">
                      {currentSlide.quiz.options.map((option, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {currentSlide.quiz.explanation && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Explanation:</strong> {currentSlide.quiz.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Puzzle Game */}
                {currentSlide.puzzleGame && (
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      🧩 Interactive Puzzle Game
                    </h4>
                    <p className="text-gray-700 mb-4">{currentSlide.content}</p>
                    <ECGPuzzleGame
                      puzzleType={currentSlide.puzzleGame.type}
                      difficulty={currentSlide.puzzleGame.difficulty}
                      onComplete={(result) => {
                        console.log('Puzzle completed:', result);
                        // Could save progress here
                      }}
                      className="mb-4"
                    />
                    {currentSlide.puzzleGame.learningObjectives && (
                      <div className="mt-4 p-3 bg-white rounded-lg">
                        <h5 className="font-semibold text-gray-900 mb-2">Learning Objectives:</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {currentSlide.puzzleGame.learningObjectives.map((objective, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Module Info */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Module Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{moduleData.metadata.estimatedDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium">{moduleData.metadata.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slides:</span>
                  <span className="font-medium">{moduleData.metadata.totalSlides}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interactive:</span>
                  <span className="font-medium">{moduleData.metadata.interactiveSlides}</span>
                </div>
              </div>
            </div>

            {/* TutorChat */}
            {showChat && (
              <TutorChat
                moduleId={params.moduleId}
                slideId={currentSlide.id}
                className="h-96"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}