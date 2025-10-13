'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Lightbulb, Award, RotateCcw } from 'lucide-react';

export default function KnowledgeCheck({ 
  question,
  options = [],
  correctAnswer,
  explanation,
  type = 'single', // 'single', 'multiple', 'true-false'
  onComplete,
  showImmediateFeedback = true
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSingleSelect = (index) => {
    if (!submitted) {
      setSelectedAnswer(index);
    }
  };

  const handleMultipleSelect = (index) => {
    if (!submitted) {
      if (selectedAnswers.includes(index)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== index));
      } else {
        setSelectedAnswers([...selectedAnswers, index]);
      }
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowExplanation(true);
    
    let isCorrect = false;
    if (type === 'multiple') {
      isCorrect = JSON.stringify([...selectedAnswers].sort()) === JSON.stringify([...correctAnswer].sort());
    } else {
      isCorrect = selectedAnswer === correctAnswer;
    }
    
    if (onComplete) {
      onComplete(isCorrect);
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setSubmitted(false);
    setShowExplanation(false);
  };

  const isCorrect = () => {
    if (type === 'multiple') {
      return JSON.stringify([...selectedAnswers].sort()) === JSON.stringify([...correctAnswer].sort());
    }
    return selectedAnswer === correctAnswer;
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-6 border-2 border-blue-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 text-blue-400 mr-2" />
          <h3 className="text-xl font-semibold text-white">
            Knowledge Check
          </h3>
        </div>
        {submitted && (
          <button
            onClick={handleReset}
            className="flex items-center px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Retry
          </button>
        )}
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-lg text-white font-medium mb-2">{question}</p>
        {type === 'multiple' && (
          <p className="text-sm text-blue-300">Select all that apply</p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option, index) => {
          const isSelected = type === 'multiple' 
            ? selectedAnswers.includes(index)
            : selectedAnswer === index;
          
          const isThisCorrect = type === 'multiple'
            ? correctAnswer.includes(index)
            : index === correctAnswer;

          let bgColor = 'bg-gray-800 border-gray-700 hover:bg-gray-700';
          let textColor = 'text-gray-200';

          if (submitted) {
            if (isThisCorrect) {
              bgColor = 'bg-green-900 bg-opacity-40 border-green-500';
              textColor = 'text-green-200';
            } else if (isSelected && !isThisCorrect) {
              bgColor = 'bg-red-900 bg-opacity-40 border-red-500';
              textColor = 'text-red-200';
            } else {
              bgColor = 'bg-gray-800 border-gray-700';
            }
          } else if (isSelected) {
            bgColor = 'bg-blue-700 border-blue-500';
            textColor = 'text-white';
          }

          return (
            <button
              key={index}
              onClick={() => type === 'multiple' ? handleMultipleSelect(index) : handleSingleSelect(index)}
              disabled={submitted}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${bgColor} ${textColor} ${
                submitted ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-current rounded-full mr-3 font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {submitted && isThisCorrect && (
                  <CheckCircle className="h-5 w-5 text-green-400 ml-2" />
                )}
                {submitted && isSelected && !isThisCorrect && (
                  <XCircle className="h-5 w-5 text-red-400 ml-2" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (selectedAnswer !== null || selectedAnswers.length > 0) && (
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
        >
          Submit Answer
        </button>
      )}

      {/* Feedback */}
      {submitted && (
        <div className={`p-4 rounded-lg border-2 ${
          isCorrect() 
            ? 'bg-green-900 bg-opacity-30 border-green-500' 
            : 'bg-red-900 bg-opacity-30 border-red-500'
        }`}>
          <div className="flex items-start">
            {isCorrect() ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-300 mb-1">Correct! Well done! 🎉</p>
                  {showImmediateFeedback && explanation && (
                    <p className="text-sm text-green-200">{explanation}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-300 mb-1">Incorrect. Let's learn from this!</p>
                  {showImmediateFeedback && explanation && (
                    <p className="text-sm text-red-200">{explanation}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Explanation (always show after submission) */}
      {submitted && explanation && (
        <div className="mt-4 p-4 bg-purple-900 bg-opacity-30 border-l-4 border-purple-500 rounded-lg">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-purple-400 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-300 mb-1">Explanation:</p>
              <p className="text-sm text-purple-200">{explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

