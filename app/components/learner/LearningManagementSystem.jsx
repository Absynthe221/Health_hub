'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen,
  TrendingUp,
  Award,
  Bell,
  Target,
  Clock,
  Play,
  CheckCircle,
  Star,
  Trophy,
  Calendar,
  Bookmark,
  Heart,
  Download,
  Share2,
  MessageSquare,
  Users,
  Zap,
  Filter,
  Search,
  ChevronRight,
  AlertCircle,
  Lock,
  BarChart3
} from 'lucide-react';

export default function LearningManagementSystem({ userId = 'student-001' }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch modules on mount
  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/modules');
      const result = await response.json();
      
      if (result.success && result.modules) {
        // Enrich with mock progress data
        const enrichedModules = result.modules.map((m, index) => ({
          ...m,
          progress: {
            status: index % 3 === 0 ? 'completed' : index % 3 === 1 ? 'in-progress' : 'not-started',
            completionPercentage: index % 3 === 0 ? 100 : index % 3 === 1 ? 45 + (index * 5) : 0,
            lastAccessed: index % 3 !== 2 ? `${3 - index % 3} days ago` : null,
            timeSpent: index % 3 === 0 ? `${12 + index}h ${30 + index * 5}m` : index % 3 === 1 ? `${6 + index}h ${15 + index * 3}m` : '0h 0m',
            currentSlide: index % 3 === 1 ? Math.floor((m.slides?.length || 10) * 0.45) : 0,
            quizScore: index % 3 === 0 ? 85 + index * 2 : index % 3 === 1 ? 70 + index * 3 : null,
            bookmarked: index % 2 === 0,
            favorite: index % 3 === 0
          }
        }));
        setModules(enrichedModules);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock user data
  const userData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@healthhub.com',
    enrollmentDate: 'September 15, 2024',
    totalModules: modules.length,
    completedModules: modules.filter(m => m.progress?.status === 'completed').length,
    inProgressModules: modules.filter(m => m.progress?.status === 'in-progress').length,
    totalTimeSpent: '127h 45m',
    avgScore: 82,
    streak: 12,
    level: 'Intermediate',
    points: 2450,
    rank: 23,
    certificates: 3,
    badges: [
      { name: 'Early Bird', icon: '🌅', earned: true },
      { name: 'Week Warrior', icon: '💪', earned: true },
      { name: 'Quiz Master', icon: '🎯', earned: true },
      { name: 'Perfect Score', icon: '💯', earned: false },
      { name: 'Course Crusher', icon: '🚀', earned: false }
    ],
    upcomingDeadlines: [
      { module: 'Advanced Arrhythmias', date: '2024-10-15', daysLeft: 7 },
      { module: 'ECG Case Studies', date: '2024-10-22', daysLeft: 14 }
    ],
    recentActivity: [
      { action: 'Completed', item: 'STEMI Recognition', time: '2 hours ago', icon: CheckCircle, color: 'green' },
      { action: 'Started', item: 'Heart Blocks', time: '1 day ago', icon: Play, color: 'blue' },
      { action: 'Quiz Passed', item: 'Ventricular Rhythms', time: '3 days ago', icon: Target, color: 'purple' }
    ],
    notifications: [
      { type: 'success', message: 'New certificate available!', time: '1 hour ago' },
      { type: 'info', message: 'New module: Advanced ECG', time: '2 days ago' },
      { type: 'warning', message: 'Assignment due in 7 days', time: '5 days ago' }
    ],
    recommendations: [
      { module: 'Advanced Arrhythmias', reason: 'Based on your progress', match: 92 },
      { module: 'ECG Case Studies', reason: 'Popular in your level', match: 88 },
      { module: 'Pediatric ECG', reason: 'Complete your pathway', match: 85 }
    ]
  };

  // Filter modules
  const filteredModules = modules.filter(m => {
    const matchesSearch = m.moduleTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || m.difficulty === filterDifficulty;
    const matchesStatus = filterStatus === 'all' || m.progress?.status === filterStatus;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <BookOpen className="h-8 w-8 opacity-80" />
            <span className="text-2xl font-bold">{userData.completedModules}/{userData.totalModules}</span>
          </div>
          <p className="text-sm opacity-90">Modules Completed</p>
          <div className="mt-3 pt-3 border-t border-blue-400">
            <p className="text-xs opacity-75">{Math.round((userData.completedModules / userData.totalModules) * 100)}% of total</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Target className="h-8 w-8 opacity-80" />
            <span className="text-2xl font-bold">{userData.avgScore}%</span>
          </div>
          <p className="text-sm opacity-90">Average Score</p>
          <div className="mt-3 pt-3 border-t border-purple-400">
            <p className="text-xs opacity-75">Excellent performance!</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Zap className="h-8 w-8 opacity-80" />
            <span className="text-2xl font-bold">{userData.streak}</span>
          </div>
          <p className="text-sm opacity-90">Day Streak</p>
          <div className="mt-3 pt-3 border-t border-green-400">
            <p className="text-xs opacity-75">Keep it up! 🔥</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-8 w-8 opacity-80" />
            <span className="text-2xl font-bold">{userData.totalTimeSpent.split('h')[0]}h</span>
          </div>
          <p className="text-sm opacity-90">Total Time</p>
          <div className="mt-3 pt-3 border-t border-orange-400">
            <p className="text-xs opacity-75">{userData.totalTimeSpent} learning</p>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Continue Learning</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules
            .filter(m => m.progress?.status === 'in-progress')
            .slice(0, 2)
            .map((m, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{m.moduleTitle}</h4>
                    <p className="text-xs text-gray-500">Last accessed: {m.progress.lastAccessed}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {m.progress.completionPercentage}%
                  </span>
                </div>
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${m.progress.completionPercentage}%` }}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => router.push(`/view-slides/${m.moduleId}`)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Continue
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {userData.recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center">
                  <div className={`p-2 rounded-lg bg-${activity.color}-100 mr-3`}>
                    <Icon className={`h-4 w-4 text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action} <span className="font-normal text-gray-600">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
          {userData.upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {userData.upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{deadline.module}</p>
                      <p className="text-xs text-gray-500">{deadline.date}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    {deadline.daysLeft} days left
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No upcoming deadlines</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {userData.recommendations.map((rec, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600">{rec.match}% match</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{rec.module}</h4>
              <p className="text-xs text-gray-500 mb-3">{rec.reason}</p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((m) => (
            <div key={m.moduleId} className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow">
              {/* Module Header */}
              <div className={`p-4 rounded-t-lg ${
                m.progress?.status === 'completed' ? 'bg-green-50' :
                m.progress?.status === 'in-progress' ? 'bg-blue-50' :
                'bg-gray-50'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{m.moduleTitle}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        m.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        m.difficulty === 'advanced' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {m.difficulty || 'intermediate'}
                      </span>
                      {m.progress?.favorite && <Heart className="h-4 w-4 text-red-500 fill-current" />}
                      {m.progress?.bookmarked && <Bookmark className="h-4 w-4 text-blue-500 fill-current" />}
                    </div>
                  </div>
                  {m.progress?.status === 'completed' && (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                </div>
              </div>

              {/* Module Body */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{m.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {m.metadata?.totalSlides || m.slides?.length || 0} slides
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {m.metadata?.estimatedDuration || `${(m.slides?.length || 0) * 2} min`}
                  </span>
                </div>

                {/* Progress Bar */}
                {m.progress && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">Progress</span>
                      <span className="text-xs text-gray-500">{m.progress.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          m.progress.status === 'completed' ? 'bg-green-600' :
                          m.progress.status === 'in-progress' ? 'bg-blue-600' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${m.progress.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Quiz Score (if completed) */}
                {m.progress?.quizScore && (
                  <div className="mb-4 p-2 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Quiz Score:</span>
                      <span className={`text-sm font-bold ${
                        m.progress.quizScore >= 80 ? 'text-green-600' :
                        m.progress.quizScore >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {m.progress.quizScore}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => router.push(`/view-slides/${m.moduleId}`)}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-lg text-white transition-colors ${
                    m.progress?.status === 'completed' ? 'bg-green-600 hover:bg-green-700' :
                    m.progress?.status === 'in-progress' ? 'bg-blue-600 hover:bg-blue-700' :
                    'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {m.progress?.status === 'completed' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Review
                    </>
                  ) : m.progress?.status === 'in-progress' ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Continue
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Learning
                    </>
                  )}
                </button>
              </div>

              {/* Module Footer */}
              {m.progress && (
                <div className="px-4 py-3 bg-gray-50 rounded-b-lg border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Time: {m.progress.timeSpent}</span>
                    {m.progress.lastAccessed && (
                      <span>{m.progress.lastAccessed}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredModules.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Progress Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - (userData.completedModules / userData.totalModules))}`}
                  className="text-blue-600"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-gray-900">
                {Math.round((userData.completedModules / userData.totalModules) * 100)}%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">Course Completion</p>
            <p className="text-xs text-gray-500">{userData.completedModules} of {userData.totalModules} modules</p>
          </div>

          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - (userData.avgScore / 100))}`}
                  className="text-green-600"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-gray-900">
                {userData.avgScore}%
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">Average Score</p>
            <p className="text-xs text-gray-500">Across all quizzes</p>
          </div>

          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - (userData.streak / 30))}`}
                  className="text-orange-600"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-gray-900">
                {userData.streak}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-900">Day Streak</p>
            <p className="text-xs text-gray-500">Keep learning daily!</p>
          </div>
        </div>

        {/* Module Progress Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Module Breakdown</h4>
          {modules.slice(0, 5).map((m, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{m.moduleTitle}</span>
                <span className="text-gray-500">{m.progress?.completionPercentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    m.progress?.status === 'completed' ? 'bg-green-600' :
                    m.progress?.status === 'in-progress' ? 'bg-blue-600' :
                    'bg-gray-400'
                  }`}
                  style={{ width: `${m.progress?.completionPercentage || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium text-gray-900 mb-4">Learning Time</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-700">Total Time</span>
              <span className="text-lg font-bold text-blue-600">{userData.totalTimeSpent}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-gray-700">Avg. Per Module</span>
              <span className="text-lg font-bold text-purple-600">18h 32m</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">This Week</span>
              <span className="text-lg font-bold text-green-600">12h 15m</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium text-gray-900 mb-4">Achievement Stats</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm text-gray-700">Points Earned</span>
              <span className="text-lg font-bold text-yellow-600">{userData.points}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-700">Certificates</span>
              <span className="text-lg font-bold text-green-600">{userData.certificates}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-gray-700">Global Rank</span>
              <span className="text-lg font-bold text-purple-600">#{userData.rank}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      {/* Badges */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {userData.badges.map((badge, index) => (
            <div 
              key={index}
              className={`text-center p-4 rounded-lg border-2 transition-all ${
                badge.earned 
                  ? 'border-yellow-400 bg-yellow-50 hover:shadow-md' 
                  : 'border-gray-200 bg-gray-50 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="text-sm font-medium text-gray-900">{badge.name}</p>
              {badge.earned && (
                <p className="text-xs text-green-600 mt-1">✓ Earned</p>
              )}
              {!badge.earned && (
                <p className="text-xs text-gray-500 mt-1">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Locked
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Certificates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules
            .filter(m => m.progress?.status === 'completed')
            .slice(0, 3)
            .map((m, index) => (
              <div key={index} className="border-2 border-purple-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-white">
                <div className="flex items-center justify-center mb-4">
                  <Award className="h-16 w-16 text-purple-600" />
                </div>
                <h4 className="text-center font-semibold text-gray-900 mb-2">{m.moduleTitle}</h4>
                <p className="text-center text-xs text-gray-500 mb-4">Completed with {m.progress.quizScore}% score</p>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
          <Trophy className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="space-y-2">
          {[
            { name: 'Sarah Williams', points: 3450, rank: 1 },
            { name: 'Michael Chen', points: 3200, rank: 2 },
            { name: 'Emma Davis', points: 2890, rank: 3 },
            { name: 'You (Alex Johnson)', points: userData.points, rank: userData.rank, highlight: true }
          ].map((user, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.highlight 
                  ? 'bg-purple-50 border-2 border-purple-200' 
                  : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm mr-3 ${
                  user.rank === 1 ? 'bg-yellow-400 text-white' :
                  user.rank === 2 ? 'bg-gray-300 text-white' :
                  user.rank === 3 ? 'bg-orange-400 text-white' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {user.rank}
                </span>
                <span className={`text-sm ${user.highlight ? 'font-semibold text-purple-900' : 'text-gray-700'}`}>
                  {user.name}
                </span>
              </div>
              <span className={`text-sm font-medium ${user.highlight ? 'text-purple-600' : 'text-gray-600'}`}>
                {user.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notifications</h3>
        <div className="space-y-3">
          {userData.notifications.map((notif, index) => (
            <div 
              key={index}
              className={`flex items-start p-4 rounded-lg border-l-4 ${
                notif.type === 'success' ? 'border-green-500 bg-green-50' :
                notif.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}
            >
              <div className={`p-2 rounded-lg mr-3 ${
                notif.type === 'success' ? 'bg-green-100' :
                notif.type === 'warning' ? 'bg-yellow-100' :
                'bg-blue-100'
              }`}>
                {notif.type === 'success' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                 notif.type === 'warning' ? <AlertCircle className="h-5 w-5 text-yellow-600" /> :
                 <Bell className="h-5 w-5 text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Tab configuration
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'modules', label: 'My Modules', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'modules':
        return renderModules();
      case 'progress':
        return renderProgress();
      case 'achievements':
        return renderAchievements();
      case 'notifications':
        return renderNotifications();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
}

