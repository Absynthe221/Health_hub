'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Clock,
  Target,
  Activity,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  Eye,
  MousePointer,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Percent
} from 'lucide-react';

export default function AnalyticsManagement({ onActionClick }) {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Platform-wide analytics
  const analytics = {
    overview: {
      totalUsers: 200,
      activeUsers: 178,
      newUsers: 23,
      userGrowth: 12.5,
      totalModules: 7,
      publishedModules: 7,
      totalSlides: 114,
      avgCompletionRate: 68,
      avgScore: 76,
      totalCertificates: 89,
      totalTimeSpent: '2,847 hours',
      dailyActiveUsers: 142,
      weeklyActiveUsers: 178,
      monthlyActiveUsers: 198
    },

    engagement: {
      avgSessionDuration: '24.5 min',
      avgModulesPerUser: 3.2,
      completionRate: 68,
      dropoffRate: 12,
      returnRate: 85,
      streakMaintenance: 67,
      dailyLogins: 156,
      weeklyLogins: 178,
      peakHours: ['9:00-11:00', '14:00-16:00', '19:00-21:00'],
      bounceRate: 8.5,
      avgPagesPerSession: 12.3
    },

    learning: {
      totalEnrollments: 1248,
      completedModules: 892,
      inProgressModules: 234,
      notStartedModules: 122,
      avgQuizScore: 76,
      quizPassRate: 88,
      quizFailRate: 12,
      retakeRate: 15,
      certificateIssueRate: 71,
      avgTimeToCompletion: '18.5 hours',
      fastestCompletion: '8.2 hours',
      slowestCompletion: '45.6 hours'
    },

    content: {
      mostPopularModules: [
        { name: 'ECG Basics', views: 342, completions: 234, rating: 4.7 },
        { name: 'STEMI Recognition', views: 289, completions: 198, rating: 4.5 },
        { name: 'Arrhythmias', views: 256, completions: 176, rating: 4.3 },
        { name: 'Heart Blocks', views: 198, completions: 134, rating: 4.2 },
        { name: 'Ventricular Rhythms', views: 167, completions: 112, rating: 4.4 }
      ],
      slideEngagement: {
        avgViewTime: '2.3 min',
        skipRate: 8,
        rewatchRate: 23,
        interactiveEngagement: 78
      },
      quizPerformance: {
        avgAttempts: 1.3,
        firstTimePassRate: 76,
        avgScore: 76,
        hardestQuizzes: ['Conduction Abnormalities', 'Advanced Arrhythmias'],
        easiestQuizzes: ['ECG Basics', 'Lead Placement']
      }
    },

    performance: {
      topPerformers: [
        { name: 'Charlie Brown', score: 95, modules: 18, time: '28.1h' },
        { name: 'Jane Smith', score: 92, modules: 15, time: '22.3h' },
        { name: 'Fiona Green', score: 88, modules: 14, time: '21.7h' },
        { name: 'John Doe', score: 85, modules: 12, time: '18.5h' },
        { name: 'Bob Johnson', score: 82, modules: 11, time: '16.8h' }
      ],
      strugglingStudents: [
        { name: 'Alice Williams', score: 58, modules: 5, lastActive: '3 days ago' },
        { name: 'Ethan Hunt', score: 62, modules: 3, lastActive: '23 days ago' }
      ],
      avgImprovementRate: 12,
      studentRetention: 91,
      courseSatisfaction: 4.6
    },

    trends: {
      daily: {
        users: [120, 135, 142, 138, 145, 156, 142],
        sessions: [180, 210, 225, 215, 232, 245, 228],
        completions: [45, 52, 48, 61, 58, 64, 72],
        quizzes: [78, 89, 82, 95, 88, 102, 94]
      },
      weekly: {
        registrations: [12, 15, 18, 23],
        completions: [245, 278, 312, 358],
        certificates: [156, 189, 234, 289],
        activeUsers: [145, 156, 167, 178]
      },
      monthly: {
        revenue: [2400, 2800, 3200, 3600],
        satisfaction: [4.3, 4.4, 4.5, 4.6],
        retention: [87, 89, 90, 91],
        growth: [8, 10, 11, 12.5]
      }
    },

    devices: {
      desktop: 62,
      mobile: 28,
      tablet: 10
    },

    locations: {
      'United Kingdom': 142,
      'United States': 34,
      'Canada': 12,
      'Australia': 8,
      'Other': 4
    },

    timeDistribution: {
      '00:00-06:00': 12,
      '06:00-09:00': 34,
      '09:00-12:00': 156,
      '12:00-15:00': 89,
      '15:00-18:00': 67,
      '18:00-21:00': 98,
      '21:00-00:00': 45
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    if (onActionClick) {
      onActionClick('Refresh Analytics Data');
    }
    setTimeout(() => setLoading(false), 1000);
  };

  const handleExport = (type) => {
    if (onActionClick) {
      onActionClick(`Export ${type} Analytics`);
    }
  };

  const getPercentageColor = (value) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (value) => {
    return value >= 0 
      ? <TrendingUp className="h-4 w-4 text-green-500" />
      : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Platform Analytics</h3>
            <p className="text-sm text-gray-500 mt-1">Comprehensive insights and performance metrics</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>

            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            <button
              onClick={() => handleExport('Full')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex items-center text-sm">
              {getTrendIcon(analytics.overview.userGrowth)}
              <span className="text-green-600 ml-1">+{analytics.overview.userGrowth}%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">Total Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.overview.totalUsers}</p>
          <p className="text-xs text-gray-500 mt-2">
            {analytics.overview.activeUsers} active • {analytics.overview.newUsers} new this month
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center text-sm">
              {getTrendIcon(5)}
              <span className="text-green-600 ml-1">+5%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.overview.avgCompletionRate}%</p>
          <p className="text-xs text-gray-500 mt-2">
            {analytics.learning.completedModules} modules completed
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex items-center text-sm">
              {getTrendIcon(3)}
              <span className="text-green-600 ml-1">+3%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">Average Score</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.overview.avgScore}%</p>
          <p className="text-xs text-gray-500 mt-2">
            {analytics.learning.quizPassRate}% pass rate
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex items-center text-sm">
              {getTrendIcon(8)}
              <span className="text-green-600 ml-1">+8%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500">Engagement</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.engagement.dailyLogins}</p>
          <p className="text-xs text-gray-500 mt-2">
            {analytics.engagement.avgSessionDuration} avg session
          </p>
        </div>
      </div>

      {/* Quick Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium opacity-90">Learning Hours</h4>
            <Clock className="h-5 w-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{analytics.overview.totalTimeSpent}</p>
          <p className="text-sm opacity-75 mt-2">Across all students</p>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-75">Avg per student:</span>
              <span className="font-semibold">{analytics.learning.avgTimeToCompletion}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium opacity-90">Certificates Issued</h4>
            <Award className="h-5 w-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{analytics.overview.totalCertificates}</p>
          <p className="text-sm opacity-75 mt-2">{analytics.learning.certificateIssueRate}% of enrolled</p>
          <div className="mt-4 pt-4 border-t border-purple-400">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-75">This month:</span>
              <span className="font-semibold">+34 certificates</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium opacity-90">Student Retention</h4>
            <TrendingUp className="h-5 w-5 opacity-75" />
          </div>
          <p className="text-3xl font-bold">{analytics.performance.studentRetention}%</p>
          <p className="text-sm opacity-75 mt-2">Active learners retained</p>
          <div className="mt-4 pt-4 border-t border-green-400">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-75">Return rate:</span>
              <span className="font-semibold">{analytics.engagement.returnRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trends Visualization (Text-based charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900">Daily Activity (Last 7 Days)</h4>
            <button
              onClick={() => handleExport('Daily Activity')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Export
            </button>
          </div>
          <div className="space-y-3">
            {analytics.trends.daily.users.map((value, index) => {
              const max = Math.max(...analytics.trends.daily.users);
              const percentage = (value / max) * 100;
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              
              return (
                <div key={index} className="flex items-center">
                  <span className="text-xs text-gray-500 w-10">{days[index]}</span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-6">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs text-white font-medium">{value}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">{Math.round(percentage)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900">Module Completions (Last 7 Days)</h4>
            <button
              onClick={() => handleExport('Completions')}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Export
            </button>
          </div>
          <div className="space-y-3">
            {analytics.trends.daily.completions.map((value, index) => {
              const max = Math.max(...analytics.trends.daily.completions);
              const percentage = (value / max) * 100;
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              
              return (
                <div key={index} className="flex items-center">
                  <span className="text-xs text-gray-500 w-10">{days[index]}</span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-6">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs text-white font-medium">{value}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">{Math.round(percentage)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Performers & Struggling Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <Award className="h-4 w-4 text-yellow-500 mr-2" />
              Top Performers
            </h4>
            <span className="text-xs text-gray-500">Top 5</span>
          </div>
          <div className="space-y-3">
            {analytics.performance.topPerformers.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center flex-1">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-400 text-white rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-600">{student.modules} modules • {student.time}</p>
                  </div>
                </div>
                <div className="ml-3 text-right">
                  <p className={`text-lg font-bold ${getPercentageColor(student.score)}`}>
                    {student.score}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
              Need Attention
            </h4>
            <span className="text-xs text-red-500">{analytics.performance.strugglingStudents.length} students</span>
          </div>
          <div className="space-y-3">
            {analytics.performance.strugglingStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-600">{student.modules} modules • Last active: {student.lastActive}</p>
                </div>
                <div className="ml-3 flex items-center space-x-2">
                  <span className="text-sm font-bold text-red-600">{student.score}%</span>
                  <button
                    onClick={() => onActionClick && onActionClick(`Contact ${student.name}`)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onActionClick && onActionClick('Send Bulk Reminder to Struggling Students')}
            className="mt-4 w-full py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
          >
            Send Encouragement Email
          </button>
        </div>
      </div>

      {/* Most Popular Modules */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-900">Most Popular Modules</h4>
          <button
            onClick={() => handleExport('Module Popularity')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Export
          </button>
        </div>
        <div className="space-y-3">
          {analytics.content.mostPopularModules.map((module, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center flex-1">
                  <BookOpen className="h-5 w-5 text-blue-500 mr-3" />
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900">{module.name}</h5>
                    <div className="flex items-center mt-1 space-x-4">
                      <span className="text-xs text-gray-500">
                        <Eye className="inline h-3 w-3 mr-1" />
                        {module.views} views
                      </span>
                      <span className="text-xs text-gray-500">
                        <CheckCircle className="inline h-3 w-3 mr-1" />
                        {module.completions} completed
                      </span>
                      <span className="text-xs text-gray-500">
                        ⭐ {module.rating}/5.0
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {Math.round((module.completions / module.views) * 100)}%
                    </p>
                    <p className="text-xs text-gray-500">Completion</p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${(module.completions / module.views) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Device Usage</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Monitor className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Desktop</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${analytics.devices.desktop}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.devices.desktop}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Mobile</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analytics.devices.mobile}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.devices.mobile}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">Tablet</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${analytics.devices.tablet}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{analytics.devices.tablet}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Peak Usage Times</h4>
          <div className="space-y-2">
            {Object.entries(analytics.timeDistribution).map(([time, count], index) => {
              const max = Math.max(...Object.values(analytics.timeDistribution));
              const percentage = (count / max) * 100;
              
              return (
                <div key={index} className="flex items-center">
                  <span className="text-xs text-gray-500 w-24">{time}</span>
                  <div className="flex-1 mx-2">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full ${
                          percentage > 80 ? 'bg-green-500' :
                          percentage > 50 ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Geographic Distribution</h4>
          <div className="space-y-3">
            {Object.entries(analytics.locations).map(([location, count], index) => {
              const total = Object.values(analytics.locations).reduce((a, b) => a + b, 0);
              const percentage = Math.round((count / total) * 100);
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <Globe className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700">{location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">{count}</span>
                    <span className="text-xs font-medium text-gray-900">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Detailed Engagement Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Avg Session Duration</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.engagement.avgSessionDuration}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Avg Modules/User</p>
            <p className="text-2xl font-bold text-gray-900">{analytics.engagement.avgModulesPerUser}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Drop-off Rate</p>
            <p className="text-2xl font-bold text-red-600">{analytics.engagement.dropoffRate}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Streak Maintenance</p>
            <p className="text-2xl font-bold text-green-600">{analytics.engagement.streakMaintenance}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Quiz Pass Rate</p>
            <p className="text-2xl font-bold text-green-600">{analytics.learning.quizPassRate}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Retake Rate</p>
            <p className="text-2xl font-bold text-yellow-600">{analytics.learning.retakeRate}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Satisfaction</p>
            <p className="text-2xl font-bold text-purple-600">{analytics.performance.courseSatisfaction}/5.0</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Retention Rate</p>
            <p className="text-2xl font-bold text-blue-600">{analytics.performance.studentRetention}%</p>
          </div>
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-900">Weekly Trends (Last 4 Weeks)</h4>
          <button
            onClick={() => handleExport('Weekly Trends')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Export
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2">New Registrations</p>
            <div className="flex items-end space-x-1 h-20">
              {analytics.trends.weekly.registrations.map((value, index) => {
                const max = Math.max(...analytics.trends.weekly.registrations);
                const height = (value / max) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-1">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2">Module Completions</p>
            <div className="flex items-end space-x-1 h-20">
              {analytics.trends.weekly.completions.map((value, index) => {
                const max = Math.max(...analytics.trends.weekly.completions);
                const height = (value / max) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-1">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2">Certificates Issued</p>
            <div className="flex items-end space-x-1 h-20">
              {analytics.trends.weekly.certificates.map((value, index) => {
                const max = Math.max(...analytics.trends.weekly.certificates);
                const height = (value / max) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-purple-500 rounded-t transition-all hover:bg-purple-600"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-1">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2">Active Users</p>
            <div className="flex items-end space-x-1 h-20">
              {analytics.trends.weekly.activeUsers.map((value, index) => {
                const max = Math.max(...analytics.trends.weekly.activeUsers);
                const height = (value / max) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-orange-500 rounded-t transition-all hover:bg-orange-600"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-1">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Learning Progress Breakdown</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium text-green-600">{analytics.learning.completedModules} modules</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${(analytics.learning.completedModules / analytics.learning.totalEnrollments) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="text-sm font-medium text-blue-600">{analytics.learning.inProgressModules} modules</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${(analytics.learning.inProgressModules / analytics.learning.totalEnrollments) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Not Started</span>
                <span className="text-sm font-medium text-gray-600">{analytics.learning.notStartedModules} modules</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gray-400 h-3 rounded-full"
                  style={{ width: `${(analytics.learning.notStartedModules / analytics.learning.totalEnrollments) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Quiz Performance</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-gray-700">Pass Rate</span>
              </div>
              <span className="text-lg font-bold text-green-600">{analytics.learning.quizPassRate}%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-gray-700">Fail Rate</span>
              </div>
              <span className="text-lg font-bold text-red-600">{analytics.learning.quizFailRate}%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm text-gray-700">Retake Rate</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">{analytics.learning.retakeRate}%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Target className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-gray-700">Avg Score</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{analytics.learning.avgQuizScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Platform Health Indicators</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Zap className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">System Uptime</p>
            <p className="text-xl font-bold text-green-600">99.9%</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">API Response</p>
            <p className="text-xl font-bold text-blue-600">&lt;100ms</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">Concurrent Users</p>
            <p className="text-xl font-bold text-purple-600">142</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">Success Rate</p>
            <p className="text-xl font-bold text-orange-600">94.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

