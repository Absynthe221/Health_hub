'use client';

import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Award, Clock, Search, Filter, Download, Eye, Mail } from 'lucide-react';

export default function StudentProgress() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockStudents = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        enrollmentDate: '2024-09-01',
        modules: [
          { id: '1', title: 'ECG Fundamentals', progress: 100, score: 88, completedDate: '2024-09-15' },
          { id: '2', title: 'Cardiac Rhythm Recognition', progress: 75, score: 82, completedDate: null },
          { id: '3', title: 'STEMI and NSTEMI', progress: 0, score: null, completedDate: null }
        ],
        totalProgress: 58,
        averageScore: 85,
        lastActive: '2024-10-07'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        enrollmentDate: '2024-09-05',
        modules: [
          { id: '1', title: 'ECG Fundamentals', progress: 100, score: 92, completedDate: '2024-09-20' },
          { id: '2', title: 'Cardiac Rhythm Recognition', progress: 100, score: 89, completedDate: '2024-10-01' },
          { id: '3', title: 'STEMI and NSTEMI', progress: 45, score: null, completedDate: null }
        ],
        totalProgress: 82,
        averageScore: 91,
        lastActive: '2024-10-06'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        enrollmentDate: '2024-09-10',
        modules: [
          { id: '1', title: 'ECG Fundamentals', progress: 60, score: null, completedDate: null },
          { id: '2', title: 'Cardiac Rhythm Recognition', progress: 0, score: null, completedDate: null },
          { id: '3', title: 'STEMI and NSTEMI', progress: 0, score: null, completedDate: null }
        ],
        totalProgress: 20,
        averageScore: null,
        lastActive: '2024-09-25'
      }
    ];
    
    setStudents(mockStudents);
    setLoading(false);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterModule === 'all') return matchesSearch;
    
    const hasModule = student.modules.some(module => module.id === filterModule);
    return matchesSearch && hasModule;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'progress':
        return b.totalProgress - a.totalProgress;
      case 'score':
        return (b.averageScore || 0) - (a.averageScore || 0);
      case 'lastActive':
        return new Date(b.lastActive) - new Date(a.lastActive);
      default:
        return 0;
    }
  });

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(
      selectedStudents.length === sortedStudents.length 
        ? [] 
        : sortedStudents.map(student => student.id)
    );
  };

  const exportProgress = () => {
    console.log('Exporting student progress...');
    // Implement export functionality
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
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
          <h2 className="text-2xl font-bold text-gray-900">Student Progress</h2>
          <p className="text-gray-500">Monitor and track student learning progress</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportProgress}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Students</p>
              <p className="text-2xl font-semibold text-gray-900">
                {students.filter(s => s.lastActive && new Date(s.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(students.reduce((acc, s) => acc + s.totalProgress, 0) / students.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(students.filter(s => s.averageScore).reduce((acc, s) => acc + s.averageScore, 0) / students.filter(s => s.averageScore).length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Module Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Modules</option>
              <option value="1">ECG Fundamentals</option>
              <option value="2">Cardiac Rhythm Recognition</option>
              <option value="3">STEMI and NSTEMI</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="name">Sort by Name</option>
              <option value="progress">Sort by Progress</option>
              <option value="score">Sort by Score</option>
              <option value="lastActive">Sort by Last Active</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedStudents.length > 0 && (
            <div className="flex space-x-2">
              <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Send Message
              </button>
              <button className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                Export Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === sortedStudents.length && sortedStudents.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modules
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(student.totalProgress)}`}
                          style={{ width: `${student.totalProgress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">{student.totalProgress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getScoreColor(student.averageScore)}`}>
                      {student.averageScore ? `${student.averageScore}%` : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.modules.filter(m => m.progress === 100).length}/{student.modules.length} completed
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Student Details */}
      {selectedStudents.length === 1 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Progress</h3>
          {(() => {
            const student = students.find(s => s.id === selectedStudents[0]);
            return student ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{student.name}</h4>
                  <span className="text-sm text-gray-500">Enrolled: {student.enrollmentDate}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {student.modules.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">{module.title}</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progress:</span>
                          <span className="font-medium">{module.progress}%</span>
                        </div>
                        {module.score && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Score:</span>
                            <span className={`font-medium ${getScoreColor(module.score)}`}>{module.score}%</span>
                          </div>
                        )}
                        {module.completedDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Completed:</span>
                            <span className="text-green-600">{module.completedDate}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                        <div
                          className={`h-1 rounded-full ${getProgressColor(module.progress)}`}
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {sortedStudents.length} of {students.length} students
        {selectedStudents.length > 0 && ` (${selectedStudents.length} selected)`}
      </div>
    </div>
  );
}

