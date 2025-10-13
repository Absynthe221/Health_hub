'use client';

import { useState } from 'react';
import { Play, BookOpen, Clock, Star, ChevronRight } from 'lucide-react';

export default function ModuleCard({ module, onStartModule, onContinueModule }) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'not_started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    if (module.progress.status === 'not_started') {
      onStartModule(module.moduleId);
    } else {
      onContinueModule(module.moduleId);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-300 ${
        isHovered ? 'transform scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {module.moduleTitle}
          </h3>
        </div>
        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isHovered ? 'transform translate-x-1' : ''}`} />
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {module.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
          {module.difficulty}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.progress.status)}`}>
          {module.progress.status.replace('_', ' ')}
        </span>
        {module.tags.slice(0, 2).map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <BookOpen className="w-4 h-4" />
          <span>{module.totalSlides} slides</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{module.estimatedDuration}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {module.progress.status !== 'not_started' && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{module.progress.completedSlides}/{module.totalSlides}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(module.progress.completedSlides / module.totalSlides) * 100}%`
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {module.progress.status === 'completed' && (
            <>
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600">Completed</span>
            </>
          )}
          {module.progress.status === 'in_progress' && (
            <span className="text-sm text-blue-600 font-medium">Continue Learning</span>
          )}
          {module.progress.status === 'not_started' && (
            <span className="text-sm text-green-600 font-medium">Start Module</span>
          )}
        </div>
        <Play className={`w-5 h-5 text-blue-600 transition-transform ${isHovered ? 'transform translate-x-1' : ''}`} />
      </div>
    </div>
  );
}

