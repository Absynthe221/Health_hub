'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  BarChart3,
  Upload,
  MessageSquare,
  Calendar,
  Award,
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  AlertTriangle,
  Mail,
  FileText,
  Plus,
  RefreshCw,
  Star,
  ThumbsUp,
  MessageCircle,
  Send
} from 'lucide-react';

export default function InstructorManagementSystem({ instructorId = 'instructor-001' }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Fetch modules
  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/modules');
      const result = await response.json();
      
      if (result.success && result.modules) {
        // Enrich with instructor data
        const enrichedModules = result.modules.map((m, index) => ({
          ...m,
          instructor: 'Dr. Sarah Johnson',
          students: 18 + index * 4,
          avgCompletion: 45 + index * 8,
          avgScore: 70 + index * 3,
          reviews: 4.2 + (index * 0.1),
          lastUpdated: `${2 + index} days ago`,
          status: index % 3 === 0 ? 'Published' : index % 3 === 1 ? 'Draft' : 'Archived'
        }));
        setModules(enrichedModules);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock instructor data
  const instructorData = {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@healthhub.com',
    department: 'Cardiology',
    totalModules: modules.length,
    publishedModules: modules.filter(m => m.status === 'Published').length,
    totalStudents: 156,
    activeStudents: 142,
    avgCompletionRate: 78,
    avgStudentScore: 82,
    totalCertificatesIssued: 89,
    studentSatisfaction: 4.6,
    responseRate: 94,
    students: [
      { id: 1, name: 'Alice Williams', progress: 85, score: 92, lastActive: '2 hours ago', status: 'Active', avatar: '👩' },
      { id: 2, name: 'Bob Johnson', progress: 67, score: 78, lastActive: '1 day ago', status: 'Active', avatar: '👨' },
      { id: 3, name: 'Charlie Brown', progress: 100, score: 95, lastActive: '3 hours ago', status: 'Completed', avatar: '👦' },
      { id: 4, name: 'Diana Prince', progress: 45, score: 72, lastActive: '5 hours ago', status: 'Active', avatar: '👩' },
      { id: 5, name: 'Ethan Hunt', progress: 23, score: 65, lastActive: '2 days ago', status: 'At Risk', avatar: '👨' },
      { id: 6, name: 'Fiona Green', progress: 89, score: 88, lastActive: '1 hour ago', status: 'Active', avatar: '👩' },
      { id: 7, name: 'George Miller', progress: 56, score: 74, lastActive: '4 hours ago', status: 'Active', avatar: '👨' },
      { id: 8, name: 'Hannah Lee', progress: 78, score: 85, lastActive: '3 hours ago', status: 'Active', avatar: '👩' }
    ],
    recentActivity: [
      { type: 'submission', student: 'Alice Williams', action: 'Submitted quiz', module: 'STEMI Recognition', time: '2 hours ago' },
      { type: 'completion', student: 'Charlie Brown', action: 'Completed module', module: 'Ventricular Rhythms', time: '3 hours ago' },
      { type: 'question', student: 'Ethan Hunt', action: 'Asked a question', module: 'Heart Blocks', time: '5 hours ago' },
      { type: 'started', student: 'Diana Prince', action: 'Started module', module: 'ECG Basics', time: '1 day ago' }
    ],
    pendingTasks: [
      { task: 'Grade quizzes', count: 12, priority: 'High', dueDate: 'Today' },
      { task: 'Respond to questions', count: 5, priority: 'Medium', dueDate: 'Tomorrow' },
      { task: 'Review assignments', count: 8, priority: 'High', dueDate: 'Today' },
      { task: 'Update module content', count: 3, priority: 'Low', dueDate: 'This week' }
    ],
    announcements: [
      { title: 'New Module Available', content: 'Advanced Arrhythmias module is now live', date: '2 days ago' },
      { title: 'Quiz Deadline', content: 'STEMI Recognition quiz due in 3 days', date: '3 days ago' }
    ]
  };

  const filteredStudents = instructorData.students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <BookOpen className="h-8 w-8 opacity-80" />
            <span className="text-2xl font-bold">{instructorData.publishedModules}/{instructorData.totalModules}</span>
          </div>
          <p className="text-sm opacity-90">Active Modules</p>
          <div className="mt-3 pt-3 border-t border-green-400">
            <p className="text-xs opacity-75">{Math.round((instructorData.publishedModules / instructorData.totalModules) * 100)}% published</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-8 w-8 opacity-80" />
            <span className="text-2xl font-bold">{instructorData.activeStudents}/{instructorData.totalStudents}</span>
          </div>
          <p className="text-sm opacity-90">Active Students</p>
          <div className="mt-3 pt-3 border-t border-blue-400">
            <p className="text-xs opacity-75">{Math.round((instructorData.activeStudents / instructorData.totalStudents) * 100)}% active</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Target className="h-8 w-8 opacity-80" />
            <span className="text-2xl font-bold">{instructorData.avgCompletionRate}%</span>
          </div>
          <p className="text-sm opacity-90">Avg Completion</p>
          <div className="mt-3 pt-3 border-t border-purple-400">
            <p className="text-xs opacity-75">Excellent performance</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <Star className="h-8 w-8 opacity-80" />
            <span className="text-2xl font-bold">{instructorData.studentSatisfaction}/5.0</span>
          </div>
          <p className="text-sm opacity-90">Satisfaction</p>
          <div className="mt-3 pt-3 border-t border-orange-400">
            <p className="text-xs opacity-75">{instructorData.responseRate}% response rate</p>
          </div>
        </div>
      </div>

      {/* Pending Tasks & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              {instructorData.pendingTasks.reduce((sum, t) => sum + t.count, 0)} items
            </span>
          </div>
          <div className="space-y-3">
            {instructorData.pendingTasks.map((task, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
                task.priority === 'High' ? 'border-red-500 bg-red-50' :
                task.priority === 'Medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{task.task}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.count}
                  </span>
                  <button className="p-1 hover:bg-white rounded">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {instructorData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className={`p-2 rounded-lg mr-3 ${
                  activity.type === 'completion' ? 'bg-green-100' :
                  activity.type === 'submission' ? 'bg-blue-100' :
                  activity.type === 'question' ? 'bg-yellow-100' :
                  'bg-purple-100'
                }`}>
                  {activity.type === 'completion' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                   activity.type === 'submission' ? <FileText className="h-4 w-4 text-blue-600" /> :
                   activity.type === 'question' ? <MessageCircle className="h-4 w-4 text-yellow-600" /> :
                   <BookOpen className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.student}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.module} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => {
              setModalType('upload');
              setShowModal(true);
            }}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <Upload className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Upload Module</span>
          </button>

          <button
            onClick={() => {
              setModalType('announcement');
              setShowModal(true);
            }}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <MessageSquare className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Post Announcement</span>
          </button>

          <button
            onClick={() => {
              setModalType('message');
              setShowModal(true);
            }}
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all"
          >
            <Mail className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Message Students</span>
          </button>

          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all">
            <Download className="h-8 w-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Export Reports</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderMyModules = () => (
    <div className="space-y-6">
      {/* Module Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search modules..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={() => {
              setModalType('upload');
              setShowModal(true);
            }}
            className="ml-4 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Module
          </button>
        </div>
      </div>

      {/* Module List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {modules.map((module, index) => (
            <div key={index} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{module.moduleTitle}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        module.status === 'Published' ? 'bg-green-100 text-green-800' :
                        module.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {module.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-blue-600" />
                        <span>{module.students} students</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                        <span>{module.avgCompletion}% avg</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Target className="h-4 w-4 mr-2 text-purple-600" />
                        <span>{module.avgScore}% score</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 mr-2 text-yellow-600" />
                        <span>{module.reviews}/5.0</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Updated {module.lastUpdated}</span>
                    <span>{module.metadata?.totalSlides || module.slides?.length || 0} slides</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button className="ml-4 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{student.avatar}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">ID: {student.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{student.progress}%</span>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          student.progress >= 80 ? 'bg-green-600' :
                          student.progress >= 50 ? 'bg-blue-600' :
                          'bg-yellow-600'
                        }`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    student.score >= 85 ? 'text-green-600' :
                    student.score >= 70 ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {student.score}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    student.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-green-600 hover:text-green-900 mx-1">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 mx-1">
                    <Mail className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Total Enrollments</h4>
          <p className="text-3xl font-bold text-gray-900 mb-2">{instructorData.totalStudents}</p>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+12% this month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Avg Student Score</h4>
          <p className="text-3xl font-bold text-gray-900 mb-2">{instructorData.avgStudentScore}%</p>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+5% improvement</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Certificates Issued</h4>
          <p className="text-3xl font-bold text-gray-900 mb-2">{instructorData.totalCertificatesIssued}</p>
          <div className="flex items-center text-sm text-blue-600">
            <Award className="h-4 w-4 mr-1" />
            <span>57% completion rate</span>
          </div>
        </div>
      </div>

      {/* Module Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Performance</h3>
        <div className="space-y-4">
          {modules.slice(0, 5).map((module, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{module.moduleTitle}</span>
                <span className="text-sm text-gray-600">{module.students} students</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Completion</p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${module.avgCompletion}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{module.avgCompletion}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg Score</p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${module.avgScore}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{module.avgScore}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rating</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-xs font-medium text-gray-700">{module.reviews}/5.0</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="space-y-6">
      {/* Communication Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcements</h3>
          <div className="space-y-3 mb-4">
            {instructorData.announcements.map((announcement, index) => (
              <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900">{announcement.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{announcement.content}</p>
                <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setModalType('announcement');
              setShowModal(true);
            }}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Post New Announcement
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Messages</h3>
          <div className="space-y-3 mb-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-2xl mr-3">👨</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Ethan Hunt</p>
                  <p className="text-xs text-gray-600 mt-1">Question about Heart Blocks module</p>
                  <p className="text-xs text-gray-500 mt-2">5 hours ago</p>
                </div>
                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setModalType('message');
              setShowModal(true);
            }}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Mail className="h-4 w-4 mr-2" />
            Compose Message
          </button>
        </div>
      </div>
    </div>
  );

  // Modal Component
  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />
          
          <div className="relative bg-white rounded-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalType === 'upload' ? 'Upload New Module' :
                 modalType === 'announcement' ? 'Post Announcement' :
                 'Send Message'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {modalType === 'upload' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Enter module title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Drag and drop files here or click to browse</p>
                    </div>
                  </div>
                </>
              )}

              {modalType === 'announcement' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Announcement title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Type your announcement here..." />
                  </div>
                </>
              )}

              {modalType === 'message' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                      <option>All Students</option>
                      <option>Active Students</option>
                      <option>At-Risk Students</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Type your message here..." />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  {modalType === 'upload' ? 'Upload' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'modules', label: 'My Modules', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'communication', label: 'Communication', icon: MessageSquare }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'modules':
        return renderMyModules();
      case 'students':
        return renderStudents();
      case 'analytics':
        return renderAnalytics();
      case 'communication':
        return renderCommunication();
      default:
        return renderOverview();
    }
  };

  return (
    <>
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
                      ? 'border-green-500 text-green-600'
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

      {/* Modal */}
      <Modal />
    </>
  );
}

