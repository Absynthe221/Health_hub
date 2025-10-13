'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, Star, Play, CheckCircle, Award, Brain, Video, FileText } from 'lucide-react';
import ProgressBar from './dashboard/ProgressBar';

export default function ECGModuleSelector({ onModuleSelect, userProgress }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('order');

  useEffect(() => {
    fetchECGModules();
  }, []);

  const fetchECGModules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ecg-modules');
      if (response.ok) {
        const data = await response.json();
        setModules(data.modules || []);
      } else {
        console.error('Failed to fetch ECG modules from API');
        setModules([]);
      }
    } catch (error) {
      console.error('Error fetching ECG modules:', error);
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

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

  const getProgressForModule = (moduleId) => {
    return userProgress?.[moduleId] || 0;
  };

  const isModuleCompleted = (moduleId) => {
    return getProgressForModule(moduleId) >= 100;
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || 
                             module.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  const sortedModules = [...filteredModules].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title?.localeCompare(b.title);
      case 'duration':
        return (a.duration || 0) - (b.duration || 0);
      case 'difficulty':
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return (difficultyOrder[a.difficulty?.toLowerCase()] || 0) - 
               (difficultyOrder[b.difficulty?.toLowerCase()] || 0);
      default:
        return (a.id || 0) - (b.id || 0);
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading ECG modules...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ECG Learning Modules</h1>
        <p className="text-gray-600">Master electrocardiography with our comprehensive learning modules</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="order">Default Order</option>
              <option value="title">Title</option>
              <option value="duration">Duration</option>
              <option value="difficulty">Difficulty</option>
            </select>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedModules.map((module) => {
          const progress = getProgressForModule(module.id);
          const isCompleted = isModuleCompleted(module.id);
          
          return (
            <div
              key={module.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => onModuleSelect(module)}
            >
              {/* Module Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{module.title}</h3>
                    <p className="text-blue-100 text-sm line-clamp-2">{module.description}</p>
                  </div>
                  {isCompleted && (
                    <CheckCircle className="text-green-300 ml-2 flex-shrink-0" size={24} />
                  )}
                </div>
              </div>

              {/* Module Content */}
              <div className="p-4">
                {/* Progress */}
                {progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>
                )}

                {/* Module Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2" size={16} />
                    <span>{module.duration || 0} min</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="mr-2" size={16} />
                    <span>{module.slides?.length || 0} slides</span>
                  </div>
                </div>

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty || 'Unknown'}
                  </span>
                  {module.videos?.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Video className="mr-1" size={14} />
                      <span>{module.videos.length} videos</span>
                    </div>
                  )}
                </div>

                {/* Learning Objectives Preview */}
                {module.objectives && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Key Learning Points</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {module.objectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={12} />
                          <span className="line-clamp-2">{objective}</span>
                        </li>
                      ))}
                      {module.objectives.length > 2 && (
                        <li className="text-xs text-gray-500">
                          +{module.objectives.length - 2} more objectives
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : progress > 0
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onModuleSelect(module);
                  }}
                >
                  <div className="flex items-center justify-center">
                    {isCompleted ? (
                      <>
                        <Award className="mr-2" size={16} />
                        Review Module
                      </>
                    ) : progress > 0 ? (
                      <>
                        <Play className="mr-2" size={16} />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <Play className="mr-2" size={16} />
                        Start Learning
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {sortedModules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
