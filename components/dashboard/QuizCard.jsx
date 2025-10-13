'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function QuizCard({ 
  quiz = [], 
  onSubmit = () => {}, 
  showFeedback = false,
  initialFeedback = {}
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = quiz[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-center">No quiz questions available</p>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex) => {
    if (submitted) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    const results = {
      totalQuestions: quiz.length,
      correctAnswers: Object.keys(selectedAnswers).filter(
        qIndex => selectedAnswers[qIndex] === quiz[qIndex].correctAnswer
      ).length,
      answers: selectedAnswers,
      passed: Object.keys(selectedAnswers).filter(
        qIndex => selectedAnswers[qIndex] === quiz[qIndex].correctAnswer
      ).length >= Math.ceil(quiz.length * 0.7) // 70% pass rate
    };
    
    onSubmit(results);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getAnswerClass = (answerIndex) => {
    if (!submitted) {
      return selectedAnswers[currentQuestionIndex] === answerIndex
        ? "bg-blue-100 border-blue-500 text-blue-700"
        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
    }
    
    if (answerIndex === currentQuestion.correctAnswer) {
      return "bg-green-100 border-green-500 text-green-700";
    }
    
    if (selectedAnswers[currentQuestionIndex] === answerIndex && answerIndex !== currentQuestion.correctAnswer) {
      return "bg-red-100 border-red-500 text-red-700";
    }
    
    return "bg-gray-100 border-gray-300 text-gray-500";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Question {currentQuestionIndex + 1} of {quiz.length}
          </h3>
          {submitted && (
            <div className="flex items-center space-x-2">
              {selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 mb-4">{currentQuestion.question}</p>
        
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={submitted}
              className={`w-full p-3 text-left border rounded-lg transition-colors ${getAnswerClass(index)} ${
                !submitted ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
        
        {submitted && currentQuestion.explanation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex space-x-2">
          {currentQuestionIndex === quiz.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitted || selectedAnswers[currentQuestionIndex] === undefined}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitted ? 'Submitted' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Next
              <ArrowRight className="ml-1 h-4 w-4 inline" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function QuizEditor({ quiz, onSave, onCancel }) {
  const [questions, setQuestions] = useState(quiz || []);
  
  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]);
  };
  
  const updateQuestion = (index, field, value) => {
    setQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    ));
  };
  
  const removeQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Quiz Editor</h3>
        <button
          onClick={addQuestion}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Question
        </button>
      </div>
      
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Question {index + 1}</h4>
              <button
                onClick={() => removeQuestion(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Enter your question here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={question.correctAnswer === optionIndex}
                        onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[optionIndex] = e.target.value;
                          updateQuestion(index, 'options', newOptions);
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Explanation
                </label>
                <textarea
                  value={question.explanation}
                  onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Explanation for the correct answer..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(questions)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Save Quiz
        </button>
      </div>
    </div>
  );
}

