'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Award, Clock, Download, Filter, Calendar } from 'lucide-react';

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState(['enrollments', 'completions']);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockData = {
      overview: {
        totalUsers: 1247,
        activeUsers: 892,
        totalModules: 23,
        totalCompletions: 3456,
        averageScore: 82.5,
        completionRate: 68.2,
        averageTimeToComplete: 145,
        userSatisfactionScore: 4.3
      },
      trends: {
        daily: [
          { date: '2024-10-01', enrollments: 45, completions: 32, activeUsers: 234 },
          { date: '2024-10-02', enrollments: 52, completions: 38, activeUsers: 267 },
          { date: '2024-10-03', enrollments: 38, completions: 45, activeUsers: 289 },
          { date: '2024-10-04', enrollments: 61, completions: 52, activeUsers: 312 },
          { date: '2024-10-05', enrollments: 47, completions: 41, activeUsers: 298 },
          { date: '2024-10-06', enrollments: 53, completions: 48, activeUsers: 334 },
          { date: '2024-10-07', enrollments: 49, completions: 43, activeUsers: 356 }
        ],
        weekly: [
          { week: 'Week 1', enrollments: 312, completions: 267, activeUsers: 1456 },
          { week: 'Week 2', enrollments: 298, completions: 289, activeUsers: 1523 },
          { week: 'Week 3', enrollments: 334, completions: 312, activeUsers: 1589 },
          { week: 'Week 4', enrollments: 356, completions: 334, activeUsers: 1645 }
        ],
        monthly: [
          { month: 'Jan', enrollments: 1234, completions: 987, activeUsers: 5432 },
          { month: 'Feb', enrollments: 1345, completions: 1123, activeUsers: 5678 },
          { month: 'Mar', enrollments: 1456, completions: 1234, activeUsers: 5890 },
          { month: 'Apr', enrollments: 1567, completions: 1345, activeUsers: 6123 },
          { month: 'May', enrollments: 1678, completions: 1456, activeUsers: 6345 },
          { month: 'Jun', enrollments: 1789, completions: 1567, activeUsers: 6567 }
        ]
      },
      topModules: [
        { id: '1', title: 'ECG Fundamentals', enrollments: 456, completions: 389, avgScore: 85.2, completionRate: 85.3 },
        { id: '2', title: 'Cardiac Rhythm Recognition', enrollments: 389, completions: 312, avgScore: 82.7, completionRate: 80.2 },
        { id: '3', title: 'STEMI and NSTEMI', enrollments: 334, completions: 267, avgScore: 79.8, completionRate: 79.9 },
        { id: '4', title: 'Atrial Arrhythmias', enrollments: 298, completions: 234, avgScore: 81.5, completionRate: 78.5 },
        { id: '5', title: 'Ventricular Arrhythmias', enrollments: 267, completions: 198, avgScore: 77.3, completionRate: 74.2 }
      ],
      userSegments: [
        { segment: 'Students', count: 1089, percentage: 87.3, avgCompletion: 3.2 },
        { segment: 'Residents', count: 98, percentage: 7.9, avgCompletion: 5.7 },
        { segment: 'Physicians', count: 45, percentage: 3.6, avgCompletion: 8.3 },
        { segment: 'Nurses', count: 15, percentage: 1.2, avgCompletion: 2.8 }
      ],
      geographicData: [
        { region: 'North America', users: 456, completions: 1234 },
        { region: 'Europe', users: 334, completions: 987 },
        { region: 'Asia', users: 267, completions: 765 },
        { region: 'Other', users: 190, completions: 470 }
      ]
    };
    
    setAnalyticsData(mockData);
    setLoading(false);
  }, []);

  const getTrendData = () => {
    if (!analyticsData) return [];
    return analyticsData.trends[timeRange === '7d' ? 'daily' : timeRange === '30d' ? 'weekly' : 'monthly'] || [];
  };

  const handleMetricToggle = (metric) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const exportAnalytics = () => {
    // Implement export functionality
    console.log('Exporting analytics data...');
  };

  if (loading || !analyticsData) {
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-500">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            onClick={exportAnalytics}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Completions</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.totalCompletions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Time to Complete</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.averageTimeToComplete} min</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.averageScore}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-pink-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">User Satisfaction</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.userSatisfactionScore}/5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-teal-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Modules</p>
              <p className="text-2xl font-semibold text-gray-900">{analyticsData.overview.totalModules}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Platform Trends</h3>
          <div className="flex space-x-4">
            {['enrollments', 'completions', 'activeUsers'].map((metric) => (
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
        
        {/* Simple Chart Representation */}
        <div className="h-64 flex items-end justify-between space-x-2">
          {getTrendData().map((dataPoint, index) => {
            const maxValue = Math.max(
              ...getTrendData().map(d => Math.max(d.enrollments, d.completions, d.activeUsers))
            );
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                <div className="w-full flex flex-col justify-end h-48 space-y-1">
                  {selectedMetrics.includes('enrollments') && (
                    <div
                      className="bg-blue-500 rounded-t"
                      style={{ 
                        height: `${(dataPoint.enrollments / maxValue) * 100}%`,
                        minHeight: '2px'
                      }}
                    />
                  )}
                  {selectedMetrics.includes('completions') && (
                    <div
                      className="bg-green-500"
                      style={{ 
                        height: `${(dataPoint.completions / maxValue) * 100}%`,
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
                  {timeRange === '7d' ? dataPoint.date?.split('-')[2] : 
                   timeRange === '30d' ? dataPoint.week?.split(' ')[1] : 
                   dataPoint.month}
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
            {analyticsData.topModules.map((module, index) => (
              <div key={module.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{module.title}</p>
                    <p className="text-sm text-gray-500">{module.enrollments} enrollments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{module.completionRate}% completion</p>
                  <p className="text-sm text-gray-500">{module.avgScore}% avg score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Segments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Segments</h3>
          <div className="space-y-4">
            {analyticsData.userSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{segment.segment}</p>
                    <p className="text-sm text-gray-500">{segment.count} users ({segment.percentage}%)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{segment.avgCompletion} avg completions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData.geographicData.map((region, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{region.region}</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Users:</span>
                  <span className="font-medium">{region.users}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completions:</span>
                  <span className="font-medium">{region.completions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Avg per user:</span>
                  <span className="font-medium">
                    {Math.round(region.completions / region.users)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}