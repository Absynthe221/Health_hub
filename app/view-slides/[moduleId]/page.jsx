'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Home, ChevronLeft, ChevronRight, Gamepad2 } from 'lucide-react';
import ECGPuzzleGame from '../../components/ECGPuzzleGame';
import KnowledgeCheck from '../../components/KnowledgeCheck';
import ModuleFinalQuiz from '../../components/ModuleFinalQuiz';
import SlideAudioPlayer from '../../components/SlideAudioPlayer';

export default function ViewSlides({ params }) {
  const router = useRouter();
  const [moduleData, setModuleData] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModuleData();
  }, [params.moduleId]);

  const fetchModuleData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/modules/${params.moduleId}`);
      const data = await response.json();
      
      if (data.success && data.module) {
        setModuleData(data.module);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Module Not Found</h2>
          <p className="text-gray-400 mb-6">The requested module could not be found.</p>
          <button
            onClick={() => router.push('/dashboard/learner')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = moduleData.slides[currentSlideIndex];
  const progressPercentage = ((currentSlideIndex + 1) / moduleData.slides.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard/learner')}
                className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                Dashboard
              </button>
              <div className="h-6 w-px bg-gray-700"></div>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
                <div>
                  <h1 className="text-sm font-semibold text-white">{moduleData.moduleTitle}</h1>
                  <p className="text-xs text-gray-400">
                    {moduleData.difficulty} • {moduleData.slides.length} slides
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                Slide {currentSlideIndex + 1} of {moduleData.slides.length}
              </div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Slide Thumbnails Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                Slides
              </h3>
              <div className="space-y-2">
                {moduleData.slides.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      index === currentSlideIndex
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded text-xs font-bold mr-2">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {slide.title || `Slide ${index + 1}`}
                        </p>
                        {slide.contentType === 'section-header' && (
                          <span className="text-xs text-purple-300">📖 Section</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {/* Slide Display */}
              <div className="p-8">
                {currentSlide.contentType === 'section-header' ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-6">📖</div>
                    <h2 className="text-4xl font-bold text-white mb-4">
                      {currentSlide.content?.sectionTitle || currentSlide.title}
                    </h2>
                    <p className="text-lg text-gray-400 mb-6">
                      {currentSlide.content?.description}
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-purple-600 bg-opacity-20 rounded-full">
                      <BookOpen className="h-5 w-5 text-purple-400 mr-2" />
                      <span className="text-purple-300">
                        {currentSlide.content?.slideCount} slides in this section
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Slide Title */}
                    <h2 className="text-3xl font-bold text-white mb-6">
                      {currentSlide.title || `Slide ${currentSlideIndex + 1}`}
                    </h2>

                    {/* AI Audio Player */}
                    {currentSlide.contentType !== 'section-header' && (
                      <div className="mb-6">
                        <SlideAudioPlayer
                          slideContent={currentSlide.content}
                          slideTitle={currentSlide.title}
                          autoPlay={false}
                          onComplete={() => console.log('Audio complete')}
                        />
                      </div>
                    )}

                    {/* Slide Content */}
                    <div className="prose prose-invert max-w-none">
                      {/* Clinical Presentation */}
                      {currentSlide.content?.clinicalPresentation && (
                        <div className="mb-8 p-6 bg-gray-700 rounded-lg">
                          <h3 className="text-xl font-semibold text-purple-400 mb-4">📋 Clinical Presentation</h3>
                          <div className="space-y-3 text-gray-300">
                            <p><strong>Patient:</strong> {currentSlide.content.clinicalPresentation.age}</p>
                            <p><strong>Chief Complaint:</strong> {currentSlide.content.clinicalPresentation.chiefComplaint}</p>
                            {currentSlide.content.clinicalPresentation.duration && (
                              <p><strong>Duration:</strong> {currentSlide.content.clinicalPresentation.duration}</p>
                            )}
                            {currentSlide.content.clinicalPresentation.associatedSymptoms && (
                              <p><strong>Symptoms:</strong> {currentSlide.content.clinicalPresentation.associatedSymptoms}</p>
                            )}
                            
                            {currentSlide.content.clinicalPresentation.vitalSigns && (
                              <div className="mt-4 p-4 bg-gray-800 rounded">
                                <p className="font-semibold text-purple-300 mb-2">Vital Signs:</p>
                                <ul className="space-y-1 text-sm">
                                  {Object.entries(currentSlide.content.clinicalPresentation.vitalSigns).map(([key, value]) => (
                                    <li key={key}>
                                      <strong>{key.toUpperCase()}:</strong> {value}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ECG Findings */}
                      {currentSlide.content?.ecgFindings && (
                        <div className="mb-8 p-6 bg-gray-700 rounded-lg">
                          <h3 className="text-xl font-semibold text-green-400 mb-4">📊 ECG Findings</h3>
                          <ul className="space-y-2">
                            {currentSlide.content.ecgFindings.map((finding, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-400 mr-2">✓</span>
                                <span className="text-gray-300">{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Diagnosis */}
                      {currentSlide.content?.diagnosis && (
                        <div className="mb-8 p-6 bg-blue-900 bg-opacity-30 border-l-4 border-blue-500 rounded-lg">
                          <h3 className="text-xl font-semibold text-blue-400 mb-2">🎯 Diagnosis</h3>
                          <p className="text-lg text-white font-medium">{currentSlide.content.diagnosis}</p>
                        </div>
                      )}

                      {/* Management */}
                      {currentSlide.content?.immediateManagement && (
                        <div className="mb-8 p-6 bg-gray-700 rounded-lg">
                          <h3 className="text-xl font-semibold text-red-400 mb-4">🚨 Immediate Management</h3>
                          <ul className="space-y-2">
                            {currentSlide.content.immediateManagement.map((step, index) => (
                              <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full text-sm font-bold mr-3">
                                  {index + 1}
                                </span>
                                <span className="text-gray-300">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentSlide.content?.management && (
                        <div className="mb-8 p-6 bg-gray-700 rounded-lg">
                          <h3 className="text-xl font-semibold text-orange-400 mb-4">💊 Management</h3>
                          <ul className="space-y-2">
                            {currentSlide.content.management.map((step, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-orange-400 mr-2">•</span>
                                <span className="text-gray-300">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Key Learning Points */}
                      {currentSlide.content?.keyLearningPoints && (
                        <div className="mb-8 p-6 bg-purple-900 bg-opacity-30 border-l-4 border-purple-500 rounded-lg">
                          <h3 className="text-xl font-semibold text-purple-400 mb-4">💡 Key Learning Points</h3>
                          <ul className="space-y-2">
                            {currentSlide.content.keyLearningPoints.map((point, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-purple-400 mr-2">→</span>
                                <span className="text-gray-300">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Knowledge Check (Single Question) */}
                      {currentSlide.quiz && currentSlide.contentType !== 'final-quiz' && (
                        <div className="mb-8">
                          <KnowledgeCheck
                            question={currentSlide.quiz.question}
                            options={currentSlide.quiz.options || []}
                            correctAnswer={currentSlide.quiz.correct}
                            explanation={currentSlide.quiz.explanation}
                            type="single"
                            onComplete={(isCorrect) => console.log('Knowledge check:', isCorrect ? 'Correct' : 'Incorrect')}
                          />
                        </div>
                      )}

                      {/* Final Module Quiz */}
                      {currentSlide.contentType === 'final-quiz' && currentSlide.quiz?.questions && (
                        <div className="mb-8">
                          <ModuleFinalQuiz
                            moduleTitle={moduleData.moduleTitle}
                            questions={currentSlide.quiz.questions}
                            passingScore={currentSlide.quiz.passingScore || 70}
                            timeLimit={currentSlide.quiz.timeLimit || 30}
                            onComplete={(score) => console.log('Quiz completed with score:', score)}
                            onPass={(score) => console.log('Passed with', score, '%')}
                            onFail={(score) => console.log('Failed with', score, '%')}
                          />
                        </div>
                      )}

                      {/* Interactive Cases */}
                      {currentSlide.content?.cases && (
                        <div className="mb-8">
                          <h3 className="text-xl font-semibold text-blue-400 mb-4">🔬 Interactive Cases</h3>
                          <div className="space-y-4">
                            {currentSlide.content.cases.map((caseItem, index) => (
                              <div key={index} className="p-6 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                                <h4 className="font-semibold text-white mb-2">
                                  Case {caseItem.caseNumber}: {caseItem.scenario}
                                </h4>
                                <p className="text-sm text-gray-400 mb-3">
                                  <strong>ECG Clue:</strong> {caseItem.ecgClue}
                                </p>
                                <details className="mb-3">
                                  <summary className="cursor-pointer text-yellow-400 hover:text-yellow-300">
                                    💡 Show Hints
                                  </summary>
                                  <ul className="mt-2 space-y-1 ml-4">
                                    {caseItem.hints.map((hint, hintIndex) => (
                                      <li key={hintIndex} className="text-sm text-gray-400">{hint}</li>
                                    ))}
                                  </ul>
                                </details>
                                <div className="p-3 bg-gray-800 rounded">
                                  <p className="text-sm">
                                    <strong className="text-green-400">Diagnosis:</strong>{' '}
                                    <span className="text-gray-300">{caseItem.diagnosis}</span>
                                  </p>
                                  <p className="text-sm mt-2">
                                    <strong className="text-orange-400">Management:</strong>{' '}
                                    <span className="text-gray-300">{caseItem.management}</span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Puzzle Game */}
                      {currentSlide.interactive && currentSlide.contentType === 'puzzle' && (
                        <div className="mb-8">
                          <div className="flex items-center mb-4">
                            <Gamepad2 className="h-6 w-6 text-purple-400 mr-2" />
                            <h3 className="text-xl font-semibold text-purple-400">Interactive Puzzle Game</h3>
                          </div>
                          <div className="bg-gray-700 rounded-lg p-6">
                            <ECGPuzzleGame 
                              puzzleType={currentSlide.puzzleType || 'ecg_components'}
                              difficulty={moduleData.difficulty || 'beginner'}
                              onComplete={(score) => console.log('Puzzle completed with score:', score)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Slide Images */}
                      {currentSlide.images && currentSlide.images.length > 0 && (
                        <div className="mb-6">
                          {currentSlide.images.map((imagePath, index) => (
                            <div key={index} className="mb-4">
                              <img 
                                src={imagePath} 
                                alt={`Slide ${currentSlideIndex + 1} - Image ${index + 1}`}
                                className="w-full rounded-lg border-2 border-gray-700"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Generic Content */}
                      {!currentSlide.content?.clinicalPresentation && 
                       !currentSlide.content?.cases &&
                       currentSlide.contentType !== 'section-header' && (
                        <div className="text-gray-300">
                          <p className="text-lg leading-relaxed whitespace-pre-wrap">
                            {currentSlide.content || currentSlide.subtitle || 'Slide content will be displayed here.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="bg-gray-900 border-t border-gray-700 px-8 py-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePreviousSlide}
                    disabled={currentSlideIndex === 0}
                    className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Previous
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-1">Progress</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(progressPercentage)}%
                    </p>
                  </div>

                  <button
                    onClick={handleNextSlide}
                    disabled={currentSlideIndex === moduleData.slides.length - 1}
                    className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </button>
                </div>

                {/* Keyboard Shortcuts Info */}
                <div className="mt-4 text-center text-xs text-gray-500">
                  <p>Keyboard shortcuts: ← Previous | → Next | Esc Back to Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

