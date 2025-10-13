'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Award, Calendar, Filter, Download } from 'lucide-react';

export default function ProgressTracking() {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week');
  const [selectedMetrics, setSelectedMetrics] = useState(['completions', 'enrollments']);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockData = {
      overview: {
        totalStudents: 156,
        activeStudents: 89,
        totalCompletions: 234,
        averageScore: 78,
        completionRate: 65
      },
      trends: {
        week: [
          { date: '2024-10-01', completions: 12, enrollments: 8, activeUsers: 45 },
          { date: '2024-10-02', completions: 15, enrollments: 12, activeUsers: 52 },
          { date: '2024-10-03', completions: 18, enrollments: 15, activeUsers: 48 },
          { date: '2024-10-04', completions: 22, enrollments: 18, activeUsers: 61 },
          { date: '2024-10-05', completions: 25, enrollments: 22, activeUsers: 67 },
          { date: '2024-10-06', completions: 28, enrollments: 25, activeUsers: 71 },
          { date: '2024-10-07', completions: 32, enrollments: 28, activeUsers: 89 }
        ],
        month: [
          { month: 'Jan', completions: 45, enrollments: 32, activeUsers: 120 },
          { month: 'Feb', completions: 52, enrollments: 38, activeUsers: 135 },
          { month: 'Mar', completions: 48, enrollments: 42, activeUsers: 142 },
          { month: 'Apr', completions: 61, enrollments: 55, activeUsers: 158 },
          { month: 'May', completions: 67, enrollments: 61, activeUsers: 165 },
          { month: 'Jun', completions: 71, enrollments: 68, activeUsers: 172 },
          { month: 'Jul', completions: 89, enrollments: 75, activeUsers: 189 }
        ]
      },
      topModules: [
        { id: '1', title: 'ECG Fundamentals', completions: 89, averageScore: 85, completionRate: 78 },
        { id: '2', title: 'Cardiac Rhythm Recognition', completions: 67, averageScore: 82, completionRate: 72 },
        { id: '3', title: 'STEMI and NSTEMI', completions: 45, averageScore: 79, completionRate: 68 }
      ],
      studentProgress: [
        { student: 'John Doe', modulesCompleted: 3, averageScore: 88, lastActive: '2024-10-07' },
        { student: 'Jane Smith', modulesCompleted: 2, averageScore: 92, lastActive: '2024-10-06' },
        { student: 'Mike Johnson', modulesCompleted: 1, averageScore: 85, lastActive: '2024-10-05' },
        { student: 'Sarah Wilson', modulesCompleted: 4, averageScore: 90, lastActive: '2024-10-07' }
      ]
    };
    
    setProgressData(mockData);
    setLoading(false);
  }, []);

  const getTrendData = () => {
    if (!progressData) return [];
    return progressData.trends[timeFilter] || [];
  };

  const handleMetricToggle = (metric) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const exportReport = () => {
    // Implement export functionality
    console.log('Exporting progress report...');
  };

  if (loading || !progressData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Progress Tracking</h2>
        <div className="flex space-x-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{progressData.overview.totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Students</p>
              <p className="text-2xl font-semibold text-gray-900">{progressData.overview.activeStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Completions</p>
              <p className="text-2xl font-semibold text-gray-900">{progressData.overview.totalCompletions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">{progressData.overview.averageScore}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{progressData.overview.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Learning Trends</h3>
          <div className="flex space-x-4">
            {['completions', 'enrollments', 'activeUsers'].map((metric) => (
              <label key={metric} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric)}
                  onChange={() => handleMetricToggle(metric)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{metric}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Simple Bar Chart Representation */}
        <div className="h-64 flex items-end justify-between space-x-2">
          {getTrendData().map((dataPoint, index) => {
            const maxValue = Math.max(
              ...getTrendData().map(d => Math.max(d.completions, d.enrollments, d.activeUsers))
            );
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                <div className="w-full flex flex-col justify-end h-48 space-y-1">
                  {selectedMetrics.includes('completions') && (
                    <div
                      className="bg-blue-500 rounded-t"
                      style={{ 
                        height: `${(dataPoint.completions / maxValue) * 100}%`,
                        minHeight: '2px'
                      }}
                    />
                  )}
                  {selectedMetrics.includes('enrollments') && (
                    <div
                      className="bg-green-500"
                      style={{ 
                        height: `${(dataPoint.enrollments / maxValue) * 100}%`,
                        minHeight: '2px'
                      }}
                    />
                  )}
                  {selectedMetrics.includes('activeUsers') && (
                    <div
                      className="bg-purple-500 rounded-b"
                      style={{ 
                        height: `${(dataPoint.activeUsers / maxValue) * 100}%`,
                        minHeight: '2px'
                      }}
                    />
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {timeFilter === 'week' ? dataPoint.date.split('-')[2] : dataPoint.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Modules */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Modules</h3>
          <div className="space-y-4">
            {progressData.topModules.map((module, index) => (
              <div key={module.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{module.title}</p>
                    <p className="text-sm text-gray-500">{module.completions} completions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{module.averageScore}% avg score</p>
                  <p className="text-sm text-gray-500">{module.completionRate}% completion</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress</h3>
          <div className="space-y-4">
            {progressData.studentProgress.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{student.student}</p>
                  <p className="text-sm text-gray-500">{student.modulesCompleted} modules completed</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{student.averageScore}% avg score</p>
                  <p className="text-sm text-gray-500">Last active: {student.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Rate by Module */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Rate by Module</h3>
        <div className="space-y-3">
          {progressData.topModules.map((module) => (
            <div key={module.id} className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">{module.title}</span>
                  <span className="text-sm text-gray-500">{module.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${module.completionRate}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500 ml-4">
                {module.completions} completions
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}