'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  MessageCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Volume2,
  VolumeX
} from 'lucide-react';

// TutorChat Component
function TutorChat({ slideContent, isOpen, onClose }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: `Current slide content: ${JSON.stringify(slideContent)}`,
        }),
      });

      const data = await response.json();
      const aiMessage = { type: 'ai', content: data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { type: 'ai', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-96 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">AI Tutor Chat</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-blue-500" />
              <p>Ask me anything about this slide!</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about this slide..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// Quiz Component
function QuizComponent({ slide, onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true);
      onAnswer(selectedAnswer === slide.quiz?.correctAnswer);
    }
  };

  if (!slide.quiz) return null;

  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Quiz</h3>
      <p className="text-blue-800 mb-4">{slide.quiz.question}</p>
      
      <div className="space-y-2">
        {slide.quiz.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
              selectedAnswer === index
                ? 'bg-blue-200 border-2 border-blue-500'
                : 'bg-white border border-blue-300 hover:bg-blue-100'
            }`}
          >
            <input
              type="radio"
              name="quiz-answer"
              value={index}
              checked={selectedAnswer === index}
              onChange={() => setSelectedAnswer(index)}
              className="mr-3"
            />
            <span className="text-blue-800">{option}</span>
          </label>
        ))}
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={selectedAnswer === null || showResult}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {showResult ? 'Answered' : 'Submit Answer'}
      </button>
      
      {showResult && (
        <div className="mt-4 p-3 rounded-lg flex items-center">
          {selectedAnswer === slide.quiz.correctAnswer ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Correct! Well done.</span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">
                Not quite. The correct answer is: {slide.quiz.options[slide.quiz.correctAnswer]}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function LearnerModuleView({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { moduleId } = params;
  
  const [module, setModule] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTutorChat, setShowTutorChat] = useState(false);
  const [quizResults, setQuizResults] = useState({});

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/modules/${moduleId}`);
      const data = await response.json();
      setModule(data);
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizAnswer = (isCorrect) => {
    setQuizResults(prev => ({
      ...prev,
      [currentSlide]: isCorrect
    }));
  };

  const nextSlide = () => {
    if (module && currentSlide < module.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h2>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const slide = module.slides[currentSlide];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{module.moduleTitle}</h1>
                <p className="text-sm text-gray-600">Slide {currentSlide + 1} of {module.slides.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTutorChat(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask AI Tutor
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                {/* Slide Header */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{slide.title}</h2>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 text-gray-600 hover:text-gray-900"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-900">
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentSlide + 1) / module.slides.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Slide Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {slide.content || 'Slide content will be displayed here...'}
                    </p>
                  </div>

                  {/* Interactive Elements */}
                  {slide.interactive && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Content</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-yellow-800">
                          This slide contains interactive elements. Complete the quiz below to continue.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Quiz Component */}
                  {slide.quiz && (
                    <div className="mt-6">
                      <QuizComponent slide={slide} onAnswer={handleQuizAnswer} />
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="p-6 border-t flex justify-between">
                  <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center"
                  >
                    <SkipBack className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                  
                  <div className="flex space-x-2">
                    {module.slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentSlide
                            ? 'bg-blue-600'
                            : quizResults[index] !== undefined
                            ? quizResults[index] ? 'bg-green-500' : 'bg-red-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    disabled={currentSlide === module.slides.length - 1}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    Next
                    <SkipForward className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Module Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Total Slides:</span>
                    <span className="ml-2 text-gray-600">{module.slides.length}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Interactive Slides:</span>
                    <span className="ml-2 text-gray-600">
                      {module.slides.filter(s => s.interactive).length}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Quiz Items:</span>
                    <span className="ml-2 text-gray-600">
                      {module.slides.filter(s => s.quiz).length}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Progress:</span>
                    <span className="ml-2 text-gray-600">
                      {Math.round(((currentSlide + 1) / module.slides.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Slide Navigation */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Slide Navigation</h3>
                <div className="space-y-2">
                  {module.slides.map((slideItem, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === currentSlide
                          ? 'bg-blue-100 border border-blue-300'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{slideItem.title}</p>
                          <p className="text-sm text-gray-600">
                            {slideItem.contentType || 'Content'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {slideItem.interactive && (
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          )}
                          {slideItem.quiz && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                          {quizResults[index] !== undefined && (
                            quizResults[index] ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TutorChat Modal */}
      <TutorChat
        slideContent={slide}
        isOpen={showTutorChat}
        onClose={() => setShowTutorChat(false)}
      />
    </div>
  );
}

