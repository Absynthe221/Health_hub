'use client';

import React, { useState, useEffect } from 'react';

const QuestionEngine = ({ questions, type, moduleId, userId, onProgressUpdate }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;

  useEffect(() => {
    // Set timer for timed assessments
    if (type === 'posttest' && currentQuestion?.timeLimit) {
      setTimeRemaining(currentQuestion.timeLimit);
    }
  }, [currentQuestionIndex, type, currentQuestion?.timeLimit]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleNextQuestion();
    }
  }, [timeRemaining]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;

    setIsSubmitted(true);
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(calculatedScore);
    setShowResults(true);

    // Save results to backend
    try {
      await fetch(`/api/ecg/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId,
          userId,
          type,
          score: calculatedScore,
          answers,
          totalQuestions,
          correctAnswers,
          completedAt: new Date().toISOString()
        })
      });

      // Update progress
      const progress = type === 'pretest' ? 25 : 100;
      onProgressUpdate(progress);
    } catch (error) {
      console.error('Error saving assessment results:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! You have a strong understanding of this topic.';
    if (score >= 60) return 'Good job! Consider reviewing some concepts for better understanding.';
    return 'Consider reviewing the material and retaking this assessment.';
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No questions available for this assessment.</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
            {score}%
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {type === 'pretest' ? 'Pre-Test Complete' : 'Post-Test Complete'}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {getScoreMessage(score)}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{score}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                {Object.values(answers).filter(answer => answer !== undefined).length}
              </div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Question Review</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        Question {index + 1}
                      </span>
                      <span className={`text-sm font-medium ${
                        isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{question.question}</p>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question.correctAnswer === optionIndex;
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded text-sm ${
                              isCorrectAnswer
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : isUserAnswer && !isCorrectAnswer
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}. {option}
                            {isCorrectAnswer && <span className="ml-2">✓</span>}
                            {isUserAnswer && !isCorrectAnswer && <span className="ml-2">✗</span>}
                          </div>
                        );
                      })}
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {type === 'pretest' ? 'Continue to Module' : 'Return to Dashboard'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {type === 'pretest' ? 'Pre-Test Assessment' : 'Post-Test Assessment'}
            </h3>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          {timeRemaining !== null && (
            <div className="text-sm font-medium text-gray-600">
              Time: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-3 bg-gray-50">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {currentQuestion?.question}
          </h4>
          
          {currentQuestion?.image && (
            <div className="mb-4">
              <img
                src={currentQuestion.image}
                alt="Question illustration"
                className="max-w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          )}

          <div className="space-y-3">
            {currentQuestion?.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQuestion.id] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index}
                  checked={answers[currentQuestion.id] === index}
                  onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[currentQuestion.id] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQuestion.id] === index && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-gray-700">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          <div className="text-sm text-gray-600">
            {Object.keys(answers).length} of {totalQuestions} answered
          </div>
          
          <button
            onClick={currentQuestionIndex === totalQuestions - 1 ? handleSubmit : handleNextQuestion}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Submit' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEngine;





