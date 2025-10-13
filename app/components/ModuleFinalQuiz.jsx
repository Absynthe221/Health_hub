'use client';

import { useState, useEffect } from 'react';
import { Award, CheckCircle, XCircle, Clock, Trophy, Target, RotateCcw, ChevronRight } from 'lucide-react';

export default function ModuleFinalQuiz({ 
  moduleTitle,
  questions = [],
  passingScore = 70,
  timeLimit = 30, // minutes
  onComplete,
  onPass,
  onFail
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // convert to seconds
  const [quizState, setQuizState] = useState('intro'); // intro, active, review, completed
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (quizState === 'active' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && quizState === 'active') {
      handleSubmitQuiz();
    }
  }, [quizState, timeRemaining]);

  const startQuiz = () => {
    setQuizState('active');
    setAnswers({});
    setCurrentQuestion(0);
    setTimeRemaining(timeLimit * 60);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctCount++;
      }
    });
    
    const percentage = Math.round((correctCount / questions.length) * 100);
    setScore(percentage);
    setQuizState('review');
    setShowResults(true);
    
    if (onComplete) onComplete(percentage);
    if (percentage >= passingScore && onPass) onPass(percentage);
    if (percentage < passingScore && onFail) onFail(percentage);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Intro Screen
  if (quizState === 'intro') {
    return (
      <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-8 text-white">
        <div className="text-center">
          <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Final Assessment</h2>
          <h3 className="text-xl text-purple-200 mb-6">{moduleTitle}</h3>
          
          <div className="max-w-2xl mx-auto bg-blue-900 bg-opacity-30 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-300">{questions.length}</p>
                <p className="text-sm text-blue-200">Questions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-300">{timeLimit} min</p>
                <p className="text-sm text-purple-200">Time Limit</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-300">{passingScore}%</p>
                <p className="text-sm text-green-200">Passing Score</p>
              </div>
            </div>
          </div>

          <div className="mb-6 text-left max-w-lg mx-auto">
            <h4 className="font-semibold text-purple-300 mb-3">Instructions:</h4>
            <ul className="space-y-2 text-sm text-purple-100">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Answer all {questions.length} questions to the best of your ability</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>You have {timeLimit} minutes to complete the quiz</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>You need {passingScore}% to pass and earn your certificate</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>You can navigate between questions before submitting</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Review your answers before final submission</span>
              </li>
            </ul>
          </div>

          <button
            onClick={startQuiz}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 font-semibold text-lg transition-all transform hover:scale-105"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (quizState === 'review' && showResults) {
    const passed = score >= passingScore;
    
    return (
      <div className={`rounded-lg p-8 text-white ${
        passed 
          ? 'bg-gradient-to-br from-green-900 to-emerald-900' 
          : 'bg-gradient-to-br from-red-900 to-orange-900'
      }`}>
        <div className="text-center">
          {passed ? (
            <>
              <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h2 className="text-4xl font-bold mb-3">Congratulations! 🎉</h2>
              <p className="text-xl text-green-200 mb-6">You passed the quiz!</p>
            </>
          ) : (
            <>
              <Target className="h-20 w-20 text-orange-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-3">Keep Learning!</h2>
              <p className="text-xl text-orange-200 mb-6">You'll get it next time!</p>
            </>
          )}

          <div className="max-w-2xl mx-auto bg-black bg-opacity-30 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-5xl font-bold mb-2" style={{ color: passed ? '#4ade80' : '#fb923c' }}>
                  {score}%
                </p>
                <p className="text-sm opacity-75">Your Score</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-white mb-2">
                  {Object.keys(answers).filter(k => answers[k] === questions[k].correct).length}/{questions.length}
                </p>
                <p className="text-sm opacity-75">Correct Answers</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-blue-300 mb-2">
                  {formatTime(timeLimit * 60 - timeRemaining)}
                </p>
                <p className="text-sm opacity-75">Time Taken</p>
              </div>
            </div>
          </div>

          {passed && (
            <div className="mb-6 p-6 bg-yellow-500 bg-opacity-20 border-2 border-yellow-500 rounded-lg">
              <Award className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-lg font-semibold text-yellow-200">Certificate Unlocked!</p>
              <p className="text-sm text-yellow-100 mt-2">You can now download your certificate of completion</p>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                handleReset();
                setQuizState('intro');
              }}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-semibold"
            >
              <RotateCcw className="inline h-5 w-5 mr-2" />
              Retake Quiz
            </button>
            <button
              onClick={() => setQuizState('review-answers')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Review Answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Answer Review Screen
  if (quizState === 'review-answers') {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Answer Review</h2>
          <button
            onClick={() => setQuizState('review')}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Back to Results
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((q, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === q.correct;

            return (
              <div key={index} className={`p-6 rounded-lg border-2 ${
                isCorrect ? 'border-green-500 bg-green-900 bg-opacity-20' : 'border-red-500 bg-red-900 bg-opacity-20'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Question {index + 1}</h3>
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400" />
                  )}
                </div>

                <p className="text-white mb-4">{q.question}</p>

                <div className="space-y-2 mb-4">
                  {q.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg ${
                        optIndex === q.correct ? 'bg-green-700 bg-opacity-40' :
                        optIndex === userAnswer && optIndex !== q.correct ? 'bg-red-700 bg-opacity-40' :
                        'bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-200">
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </span>
                        {optIndex === q.correct && <span className="text-green-400 text-sm font-semibold">✓ Correct</span>}
                        {optIndex === userAnswer && optIndex !== q.correct && <span className="text-red-400 text-sm font-semibold">Your answer</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <div className="p-4 bg-purple-900 bg-opacity-30 rounded-lg border-l-4 border-purple-500">
                    <p className="text-sm text-purple-200">
                      <strong className="text-purple-300">Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Quiz Screen
  const currentQ = questions[currentQuestion];
  const answered = answers[currentQuestion] !== undefined;
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 text-white">
      {/* Header with Timer */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
        <div>
          <h3 className="text-2xl font-bold text-white">{moduleTitle} - Final Quiz</h3>
          <p className="text-sm text-gray-400">Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center px-4 py-2 rounded-lg ${
            timeRemaining < 300 ? 'bg-red-900 bg-opacity-40' : 'bg-blue-900 bg-opacity-40'
          }`}>
            <Clock className={`h-5 w-5 mr-2 ${timeRemaining < 300 ? 'text-red-400' : 'text-blue-400'}`} />
            <span className={`font-mono text-lg font-bold ${timeRemaining < 300 ? 'text-red-300' : 'text-blue-300'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex space-x-2 mb-6">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`flex-1 h-2 rounded-full transition-all ${
              answers[index] !== undefined ? 'bg-blue-500' :
              index === currentQuestion ? 'bg-purple-500' :
              'bg-gray-700'
            }`}
            title={`Question ${index + 1}${answers[index] !== undefined ? ' (Answered)' : ''}`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-start mb-4">
          <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-purple-600 rounded-full font-bold text-lg mr-4">
            {currentQuestion + 1}
          </span>
          <p className="text-xl text-white font-medium pt-1">{currentQ.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            const isSelected = answers[currentQuestion] === index;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'bg-blue-700 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center">
                  <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 rounded-full mr-3 font-bold ${
                    isSelected ? 'border-white bg-blue-600' : 'border-gray-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-700">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">Progress</p>
          <p className="text-lg font-bold text-white">
            {Object.keys(answers).length}/{questions.length} answered
          </p>
        </div>

        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={!allAnswered}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <Trophy className="h-5 w-5 mr-2" />
            Submit Quiz
          </button>
        )}
      </div>

      {/* Answer Summary */}
      {!allAnswered && (
        <div className="mt-4 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-500 rounded-lg">
          <p className="text-sm text-yellow-200">
            <AlertCircle className="inline h-4 w-4 mr-2" />
            Please answer all questions before submitting ({questions.length - Object.keys(answers).length} remaining)
          </p>
        </div>
      )}
    </div>
  );
}

