'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Award, 
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  Search
} from 'lucide-react';

export default function ProgressManagement({ onActionClick }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');
  const [sortBy, setSortBy] = useState('progress');

  // Mock data - in production, this would come from API
  const stats = {
    totalStudents: 156,
    activeStudents: 142,
    avgCompletion: 68,
    avgScore: 76,
    completedModules: 892,
    inProgressModules: 234,
    strugglingStudents: 12
  };

  const modules = [
    { id: 'mod_001', name: 'ECG Basics', enrolled: 142, completed: 98, avgScore: 82, avgTime: '45 min' },
    { id: 'mod_002', name: 'STEMI Recognition', enrolled: 128, completed: 76, avgScore: 74, avgTime: '52 min' },
    { id: 'mod_003', name: 'Arrhythmias', enrolled: 115, completed: 62, avgScore: 69, avgTime: '48 min' },
    { id: 'mod_004', name: 'Heart Blocks', enrolled: 98, completed: 45, avgScore: 71, avgTime: '55 min' },
    { id: 'mod_005', name: 'Ventricular Rhythms', enrolled: 87, completed: 38, avgScore: 68, avgTime: '50 min' }
  ];

  const studentProgress = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com',
      modulesCompleted: 12, 
      modulesInProgress: 2,
      modulesTotal: 19,
      avgScore: 85, 
      lastActive: '2 hours ago',
      status: 'excellent',
      currentModule: 'STEMI Recognition',
      completionRate: 74,
      timeSpent: '18.5 hours'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      modulesCompleted: 15, 
      modulesInProgress: 1,
      modulesTotal: 19,
      avgScore: 92, 
      lastActive: '1 hour ago',
      status: 'excellent',
      currentModule: 'Arrhythmias',
      completionRate: 84,
      timeSpent: '22.3 hours'
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob@example.com',
      modulesCompleted: 8, 
      modulesInProgress: 3,
      modulesTotal: 19,
      avgScore: 68, 
      lastActive: '1 day ago',
      status: 'good',
      currentModule: 'ECG Basics',
      completionRate: 58,
      timeSpent: '12.7 hours'
    },
    { 
      id: 4, 
      name: 'Alice Williams', 
      email: 'alice@example.com',
      modulesCompleted: 5, 
      modulesInProgress: 2,
      modulesTotal: 19,
      avgScore: 58, 
      lastActive: '3 days ago',
      status: 'struggling',
      currentModule: 'Heart Blocks',
      completionRate: 37,
      timeSpent: '8.2 hours'
    },
    { 
      id: 5, 
      name: 'Charlie Brown', 
      email: 'charlie@example.com',
      modulesCompleted: 18, 
      modulesInProgress: 1,
      modulesTotal: 19,
      avgScore: 95, 
      lastActive: '30 min ago',
      status: 'excellent',
      currentModule: 'Final Assessment',
      completionRate: 95,
      timeSpent: '28.1 hours'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'struggling':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'good':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'struggling':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const filteredStudents = studentProgress.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || student.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeStudents}</p>
              <p className="text-sm text-gray-500 mt-1">of {stats.totalStudents} total</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Completion</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgCompletion}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-sm text-green-600">+5% this week</p>
              </div>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgScore}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-sm text-green-600">+3% this month</p>
              </div>
            </div>
            <Award className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Need Attention</p>
              <p className="text-3xl font-bold text-gray-900">{stats.strugglingStudents}</p>
              <p className="text-sm text-red-600 mt-1">Students struggling</p>
            </div>
            <AlertCircle className="h-12 w-12 text-red-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Module Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Module Performance</h3>
          <button 
            onClick={() => onActionClick && onActionClick('Export Module Stats')}
            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {modules.map((module) => {
                const completionRate = Math.round((module.completed / module.enrolled) * 100);
                return (
                  <tr key={module.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{module.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.enrolled}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.completed}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2" style={{ width: '100px' }}>
                          <div 
                            className={`h-2 rounded-full ${completionRate >= 70 ? 'bg-green-500' : completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        module.avgScore >= 80 ? 'bg-green-100 text-green-800' :
                        module.avgScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {module.avgScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        {module.avgTime}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Progress Tracking */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Student Progress Tracking</h3>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Students</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="struggling">Struggling</option>
            </select>

            {/* Export */}
            <button 
              onClick={() => onActionClick && onActionClick('Export Student Progress')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modules</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            student.completionRate >= 80 ? 'bg-green-500' :
                            student.completionRate >= 60 ? 'bg-blue-500' :
                            student.completionRate >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${student.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{student.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.modulesCompleted} / {student.modulesTotal}
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.modulesInProgress} in progress
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      student.avgScore >= 80 ? 'bg-green-100 text-green-800' :
                      student.avgScore >= 70 ? 'bg-blue-100 text-blue-800' :
                      student.avgScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.avgScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {student.timeSpent}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(student.status)}`}>
                      {getStatusIcon(student.status)}
                      <span className="ml-1 capitalize">{student.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => onActionClick && onActionClick(`View ${student.name} Details`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => onActionClick && onActionClick(`Message ${student.name}`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No students found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

