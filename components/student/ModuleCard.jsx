'use client';

import React from 'react';
import { Play, Clock, CheckCircle, BookOpen, Award } from 'lucide-react';

export default function ModuleCard({ 
  module, 
  onStart, 
  onContinue, 
  progress = 0,
  isCompleted = false 
}) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (progress > 50) return 'bg-blue-500';
    if (progress > 25) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {module.title || module.moduleTitle || 'Untitled Module'}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getDifficultyColor(module.difficulty)}`}>
            {module.difficulty || 'General'}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {module.description || module.overview || 'No description available.'}
        </p>

        {/* Module Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{module.duration || module.estimatedTime || 0} min</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{module.slides?.length || 0} slides</span>
          </div>
          {module.objectives && (
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-1" />
              <span>{module.objectives.length} objectives</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {isCompleted ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            ) : progress > 0 ? (
              <div className="flex items-center text-blue-600">
                <span className="text-sm font-medium">In Progress</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-500">
                <span className="text-sm font-medium">Not Started</span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => {
              if (isCompleted) return;
              if (progress > 0) {
                onContinue?.(module);
              } else {
                onStart?.(module);
              }
            }}
            disabled={isCompleted}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isCompleted
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : progress > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Play className="h-4 w-4 mr-2" />
            {isCompleted ? 'Completed' : progress > 0 ? 'Continue' : 'Start'}
          </button>
        </div>
      </div>

      {/* Module Tags */}
      {module.tags && module.tags.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t">
          <div className="flex flex-wrap gap-2">
            {module.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
              >
                {tag}
              </span>
            ))}
            {module.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                +{module.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}