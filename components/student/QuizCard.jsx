'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function QuizCard({ quiz, onComplete }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const correct = selectedAnswer === quiz.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    onComplete?.(correct);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Quiz</h3>
        <p className="text-gray-700">{quiz.question}</p>
      </div>

      <div className="space-y-3 mb-6">
        {quiz.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={showResult}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              showResult
                ? option === quiz.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : selectedAnswer === option
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
                : selectedAnswer === option
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
              <span>{option}</span>
              {showResult && option === quiz.correctAnswer && (
                <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
              )}
              {showResult && selectedAnswer === option && option !== quiz.correctAnswer && (
                <XCircle className="w-5 h-5 text-red-600 ml-auto" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleReset}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </button>

        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Incorrect</span>
                </>
              )}
            </div>
            {quiz.explanation && (
              <div className="text-sm text-gray-600 max-w-md">
                <strong>Explanation:</strong> {quiz.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



