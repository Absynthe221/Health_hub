'use client'

import React, { useState } from 'react'

/**
 * QuizCard Component
 * 
 * A reusable quiz card component for displaying quiz questions and handling answers
 * Used in learner dashboard and instructor quiz management
 */
export default function QuizCard({
  quiz = null,
  onAnswer = null,
  onEdit = null,
  onDelete = null,
  mode = 'display', // 'display', 'edit', 'preview'
  showAnswers = false,
  className = ''
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!quiz) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center text-gray-500">
          No quiz data available
        </div>
      </div>
    )
  }

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex)
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null && onAnswer) {
      const isCorrect = selectedAnswer === quiz.correctAnswer
      onAnswer({
        questionId: quiz.id,
        selectedAnswer,
        isCorrect,
        correctAnswer: quiz.correctAnswer
      })
      setIsSubmitted(true)
    }
  }

  const getAnswerStyle = (index) => {
    if (!showAnswers && !isSubmitted) {
      return selectedAnswer === index
        ? 'bg-blue-100 border-blue-500 text-blue-700'
        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    }

    if (index === quiz.correctAnswer) {
      return 'bg-green-100 border-green-500 text-green-700'
    }

    if (isSubmitted && index === selectedAnswer && index !== quiz.correctAnswer) {
      return 'bg-red-100 border-red-500 text-red-700'
    }

    return 'bg-gray-50 border-gray-200'
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {/* Quiz Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {quiz.question}
          </h3>
          {quiz.category && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
              {quiz.category}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {quiz.difficulty && (
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {quiz.difficulty}
            </span>
          )}
          {mode === 'edit' && (
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit && onEdit(quiz)}
                className="p-1 text-gray-400 hover:text-blue-500"
                title="Edit quiz"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete && onDelete(quiz.id)}
                className="p-1 text-gray-400 hover:text-red-500"
                title="Delete quiz"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Options */}
      <div className="space-y-3 mb-6">
        {quiz.options && quiz.options.map((option, index) => (
          <label
            key={index}
            className={`block p-3 border-2 rounded-lg cursor-pointer transition-colors ${getAnswerStyle(index)}`}
          >
            <input
              type="radio"
              name={`quiz-${quiz.id}`}
              value={index}
              checked={selectedAnswer === index}
              onChange={() => handleAnswerSelect(index)}
              className="sr-only"
              disabled={isSubmitted || mode === 'preview'}
            />
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedAnswer === index ? 'border-current' : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-full h-full rounded-full bg-current opacity-100" />
                  )}
                </div>
              </div>
              <div className="ml-3">
                <span className="text-sm font-medium">{option}</span>
              </div>
              {/* Answer indicators */}
              {showAnswers && index === quiz.correctAnswer && (
                <div className="ml-auto">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {isSubmitted && index === selectedAnswer && index !== quiz.correctAnswer && (
                <div className="ml-auto">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>

      {/* Quiz Actions */}
      {mode === 'display' && !isSubmitted && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* Explanation */}
      {(showAnswers || isSubmitted) && quiz.explanation && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Explanation:</h4>
          <p className="text-sm text-gray-700">{quiz.explanation}</p>
        </div>
      )}

      {/* Quiz Metadata */}
      {quiz.points && (
        <div className="mt-4 text-sm text-gray-500">
          Points: {quiz.points}
        </div>
      )}
    </div>
  )
}

/**
 * QuizList Component
 * For displaying multiple quiz cards
 */
export function QuizList({
  quizzes = [],
  onQuizAnswer = null,
  onQuizEdit = null,
  onQuizDelete = null,
  mode = 'display',
  showAnswers = false,
  className = ''
}) {
  if (quizzes.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-500">No quizzes available</div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {quizzes.map((quiz, index) => (
        <QuizCard
          key={quiz.id || index}
          quiz={quiz}
          onAnswer={onQuizAnswer}
          onEdit={onQuizEdit}
          onDelete={onQuizDelete}
          mode={mode}
          showAnswers={showAnswers}
        />
      ))}
    </div>
  )
}

/**
 * QuizEditor Component
 * For creating and editing quizzes
 */
export function QuizEditor({
  quiz = null,
  onSave = null,
  onCancel = null,
  className = ''
}) {
  const [formData, setFormData] = useState({
    question: quiz?.question || '',
    options: quiz?.options || ['', '', '', ''],
    correctAnswer: quiz?.correctAnswer || 0,
    explanation: quiz?.explanation || '',
    difficulty: quiz?.difficulty || 'medium',
    category: quiz?.category || '',
    points: quiz?.points || 1
  })

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const handleSave = () => {
    if (formData.question.trim() && formData.options.every(opt => opt.trim())) {
      onSave && onSave({
        ...formData,
        id: quiz?.id || Date.now(),
        correctAnswer: parseInt(formData.correctAnswer)
      })
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">
        {quiz ? 'Edit Quiz' : 'Create New Quiz'}
      </h3>

      <div className="space-y-4">
        {/* Question */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <textarea
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Enter the quiz question..."
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer Options
          </label>
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.correctAnswer === index}
                onChange={() => setFormData({ ...formData, correctAnswer: index })}
                className="text-blue-500"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Explanation (Optional)
          </label>
          <textarea
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            placeholder="Explain why this answer is correct..."
          />
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., ECG Basics"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points
            </label>
            <input
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {quiz ? 'Update Quiz' : 'Create Quiz'}
        </button>
      </div>
    </div>
  )
}

