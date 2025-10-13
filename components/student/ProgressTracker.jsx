'use client';

import React from 'react';
import { TrendingUp, Target, Award, Calendar, BarChart3 } from 'lucide-react';

export default function ProgressTracker({ 
  progressData = null, 
  modules = [],
  showDetailed = true 
}) {
  // Calculate overall statistics
  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.progress?.status === 'completed').length;
  const inProgressModules = modules.filter(m => m.progress?.status === 'in-progress').length;
  const notStartedModules = modules.filter(m => !m.progress?.status || m.progress?.status === 'not-started').length;
  
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  
  // Calculate learning time
  const totalLearningTime = modules.reduce((acc, module) => {
    return acc + (module.duration || 0) * (module.progress?.completionPercentage || 0) / 100;
  }, 0);
  
  // Calculate average score
  const modulesWithScores = modules.filter(m => m.progress?.score);
  const averageScore = modulesWithScores.length > 0 
    ? Math.round(modulesWithScores.reduce((acc, m) => acc + (m.progress?.score || 0), 0) / modulesWithScores.length)
    : 0;

  const stats = [
    {
      label: 'Overall Progress',
      value: `${overallProgress}%`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Completed Modules',
      value: `${completedModules}/${totalModules}`,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Learning Time',
      value: `${Math.round(totalLearningTime)} min`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Average Score',
      value: averageScore > 0 ? `${averageScore}%` : 'N/A',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress Overview</h3>
        
        {/* Overall Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Completion</span>
            <span className="text-sm text-gray-500">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-2`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Progress Breakdown */}
      {showDetailed && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Progress</h3>
          
          {modules.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No modules assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {modules.map((module, index) => {
                const progress = module.progress?.completionPercentage || 0;
                const status = module.progress?.status || 'not-started';
                
                return (
                  <div key={module.moduleId || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {status === 'completed' ? 'Completed' : 
                         status === 'in-progress' ? 'In Progress' : 'Not Started'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span>{module.duration || 0} minutes</span>
                      <span>{module.slides?.length || 0} slides</span>
                      {module.progress?.score && (
                        <span>Score: {module.progress.score}%</span>
                      )}
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Learning Streak */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Activity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">7</p>
            <p className="text-sm text-gray-500">Days Active</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-500">Current Streak</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500">Hours This Week</p>
          </div>
        </div>
      </div>
    </div>
  );
}