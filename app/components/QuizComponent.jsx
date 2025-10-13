'use client';

import { useMemo, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

/**
 * QuizComponent
 * Reusable multiple-choice quiz block with validation, feedback, and error handling.
 */
export default function QuizComponent({
  question = null,
  options = [],
  correctAnswer = null,
  explanation = '',
  disabled = false,
  onAnswer,
  className = ''
}) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const isValid = useMemo(() => {
    if (!question || !Array.isArray(options) || options.length === 0) return false;
    if (typeof correctAnswer !== 'number' || correctAnswer < 0 || correctAnswer >= options.length) return false;
    return true;
  }, [question, options, correctAnswer]);

  const handleSubmit = () => {
    if (!isValid) {
      setError('Quiz is not properly configured.');
      return;
    }
    if (selected === null) {
      setError('Please select an answer.');
      return;
    }
    setError(null);
    setSubmitted(true);
    if (typeof onAnswer === 'function') onAnswer(selected === correctAnswer);
  };

  if (!isValid) {
    return (
      <div className={`bg-yellow-50 rounded-lg p-4 border border-yellow-200 ${className}`}>
        <div className="flex items-start space-x-2 text-yellow-800">
          <AlertTriangle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">Invalid quiz configuration</p>
            <p className="text-sm">Question, options, or correct answer missing.</p>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = submitted && selected === correctAnswer;

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Quiz</h3>
      <p className="text-gray-800 mb-4">{question}</p>

      <div className="space-y-2">
        {options.map((opt, idx) => (
          <label
            key={idx}
            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors border ${
              selected === idx
                ? 'bg-blue-50 border-blue-300'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="quiz-option"
              value={idx}
              checked={selected === idx}
              onChange={() => !disabled && setSelected(idx)}
              className="mr-3"
              disabled={disabled || submitted}
            />
            <span className="text-gray-800">{opt}</span>
          </label>
        ))}
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <button
          onClick={handleSubmit}
          disabled={disabled || submitted}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitted ? 'Answered' : 'Submit Answer'}
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {submitted && (
        <div className={`mt-4 p-3 rounded-lg flex items-start space-x-2 ${
          isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {isCorrect ? (
            <CheckCircle className="w-5 h-5 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 mt-0.5" />
          )}
          <div>
            <p className="font-medium">{isCorrect ? 'Correct!' : 'Not quite.'}</p>
            {!isCorrect && (
              <p className="text-sm">Correct answer: {options[correctAnswer]}</p>
            )}
            {explanation && (
              <p className="text-sm mt-1 text-gray-700">
                <span className="font-medium text-gray-800">Explanation: </span>
                {explanation}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


