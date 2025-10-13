'use client';

import React, { useState } from 'react';
import MCQQuestion from './MCQQuestion';

const MCQQuiz = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswerSelect = (questionIndex, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedAnswer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      calculateScore();
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correct++;
      }
    });
    setScore(Math.round((correct / totalQuestions) * 100));
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleFinish = () => {
    onComplete({
      score,
      answers,
      totalQuestions,
      correctAnswers: questions.filter((q, i) => answers[i] === q.answer).length
    });
  };

  if (showResults) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
          <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
          <p className="text-gray-600">
            You got {questions.filter((q, i) => answers[i] === q.answer).length} out of {totalQuestions} questions correct
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {questions.map((question, index) => {
            const isCorrect = answers[index] === question.answer;
            const userAnswer = answers[index];
            
            return (
              <div key={index} className={`p-4 rounded-lg border ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => {
                        const isSelected = userAnswer === option;
                        const isCorrectAnswer = option === question.answer;
                        
                        return (
                          <div key={optIndex} className={`text-sm p-2 rounded ${
                            isCorrectAnswer ? 'bg-green-100 text-green-800 font-medium' :
                            isSelected && !isCorrectAnswer ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {option}
                            {isCorrectAnswer && ' (Correct Answer)'}
                            {isSelected && !isCorrectAnswer && ' (Your Answer)'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleRetake}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Retake Quiz
          </button>
          <button
            onClick={handleFinish}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Quiz</h3>
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <MCQQuestion
        question={currentQuestion}
        questionIndex={currentQuestionIndex}
        selectedAnswer={answers[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentQuestionIndex === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleNextQuestion}
          disabled={!answers[currentQuestionIndex]}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !answers[currentQuestionIndex]
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default MCQQuiz;




