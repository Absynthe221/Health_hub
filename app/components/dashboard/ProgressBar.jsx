'use client'

import React from 'react'

/**
 * ProgressBar Component
 * 
 * A reusable progress bar component for displaying completion percentages
 * across different dashboard views (learner progress, module completion, etc.)
 */
export default function ProgressBar({ 
  progress = 0, 
  label = '', 
  showPercentage = true,
  size = 'md',
  color = 'blue',
  animated = true,
  className = ''
}) {
  // Validate progress value
  const validProgress = Math.min(Math.max(progress, 0), 100)
  
  // Size variants
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  }
  
  // Color variants
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  }
  
  const bgColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100',
    indigo: 'bg-indigo-100'
  }
  
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-500">
              {Math.round(validProgress)}%
            </span>
          )}
        </div>
      )}
      
      {/* Progress Bar */}
      <div className={`w-full ${sizeClasses[size]} ${bgColorClasses[color]} rounded-full overflow-hidden`}>
        <div 
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-300 ease-in-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ 
            width: `${validProgress}%`,
            transition: animated ? 'width 0.3s ease-in-out' : 'none'
          }}
        />
      </div>
      
      {/* Progress Text (for small sizes) */}
      {size === 'sm' && !label && showPercentage && (
        <div className="text-xs text-gray-500 mt-1 text-center">
          {Math.round(validProgress)}%
        </div>
      )}
    </div>
  )
}

/**
 * Circular Progress Component
 * Alternative circular progress indicator
 */
export function CircularProgress({ 
  progress = 0, 
  size = 60, 
  strokeWidth = 6,
  color = 'blue',
  showPercentage = true,
  className = ''
}) {
  const validProgress = Math.min(Math.max(progress, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (validProgress / 100) * circumference
  
  const colorClasses = {
    blue: 'stroke-blue-500',
    green: 'stroke-green-500',
    yellow: 'stroke-yellow-500',
    red: 'stroke-red-500',
    purple: 'stroke-purple-500',
    indigo: 'stroke-indigo-500'
  }
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClasses[color]} transition-all duration-300 ease-in-out`}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Percentage text */}
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(validProgress)}%
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Multi-step Progress Component
 * For complex workflows with multiple steps
 */
export function MultiStepProgress({ 
  steps = [], 
  currentStep = 0,
  className = ''
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep
          
          return (
            <div key={index} className="flex items-center">
              {/* Step indicator */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Step label */}
              <div className="ml-2">
                <div className={`text-sm font-medium ${
                  isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-500">{step.description}</div>
                )}
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 mx-4" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

