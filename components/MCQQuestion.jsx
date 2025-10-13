'use client';

import React from 'react';

const MCQQuestion = ({ question, questionIndex, selectedAnswer, onAnswerSelect }) => {
  if (!question) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No question available</p>
      </div>
    );
  }

  const handleAnswerChange = (answer) => {
    onAnswerSelect(questionIndex, answer);
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {question.question}
        </h4>
      </div>

      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <label
            key={index}
            className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${questionIndex}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => handleAnswerChange(option)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-900">{option}</span>
          </label>
        ))}
      </div>

      {selectedAnswer && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Selected:</strong> {selectedAnswer}
          </p>
        </div>
      )}
    </div>
  );
};

export default MCQQuestion;




