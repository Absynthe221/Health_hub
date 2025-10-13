'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Plus, Edit, Trash2, Eye, Upload, Download, Play, Users, Clock } from 'lucide-react';

export default function ModuleManagement() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedModules, setSelectedModules] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockModules = [
      {
        id: '1',
        title: 'ECG Fundamentals',
        description: 'Learn the basics of electrocardiography',
        difficulty: 'beginner',
        status: 'published',
        duration: 120,
        slides: 4,
        students: 45,
        completions: 32,
        createdDate: '2024-01-15',
        lastUpdated: '2024-09-20'
      },
      {
        id: '2',
        title: 'Cardiac Rhythm Recognition',
        description: 'Identify and interpret various cardiac rhythms',
        difficulty: 'intermediate',
        status: 'published',
        duration: 90,
        slides: 3,
        students: 28,
        completions: 18,
        createdDate: '2024-01-20',
        lastUpdated: '2024-09-15'
      },
      {
        id: '3',
        title: 'STEMI and NSTEMI',
        description: 'Understanding myocardial infarction patterns',
        difficulty: 'advanced',
        status: 'draft',
        duration: 180,
        slides: 6,
        students: 0,
        completions: 0,
        createdDate: '2024-02-01',
        lastUpdated: '2024-10-01'
      }
    ];
    
    setModules(mockModules);
    setLoading(false);
  }, []);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || module.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'all' || module.status === statusFilter;
    
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const handleSelectModule = (moduleId) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSelectAll = () => {
    setSelectedModules(
      selectedModules.length === filteredModules.length 
        ? [] 
        : filteredModules.map(module => module.id)
    );
  };

  const handleBulkAction = (action) => {
    console.log(`${action} modules:`, selectedModules);
    // Implement bulk actions
    setSelectedModules([]);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
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

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'published':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'draft':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'archived':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const calculateCompletionRate = (completions, students) => {
    if (students === 0) return 0;
    return Math.round((completions / students) * 100);
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
        <h2 className="text-2xl font-bold text-gray-900">Module Management</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Module
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Modules</p>
              <p className="text-2xl font-semibold text-gray-900">{modules.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">
                {modules.reduce((acc, module) => acc + module.students, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Completions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {modules.reduce((acc, module) => acc + module.completions, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Duration</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(modules.reduce((acc, module) => acc + module.duration, 0) / modules.length)} min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedModules.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('archive')}
                className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Archive
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            {/* Module Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {module.title}
                </h3>
                <input
                  type="checkbox"
                  checked={selectedModules.includes(module.id)}
                  onChange={() => handleSelectModule(module.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {module.description}
              </p>
              
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </span>
                <span className={getStatusBadge(module.status)}>
                  {module.status}
                </span>
              </div>
            </div>

            {/* Module Stats */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">Duration</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{module.duration} min</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <BookOpen className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">Slides</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{module.slides}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Students Enrolled</span>
                  <span className="font-medium">{module.students}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completions</span>
                  <span className="font-medium">{module.completions}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completion Rate</span>
                  <span className="font-medium">
                    {calculateCompletionRate(module.completions, module.students)}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${calculateCompletionRate(module.completions, module.students)}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Created: {module.createdDate}</span>
                <span>Updated: {module.lastUpdated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {filteredModules.length} of {modules.length} modules
        {selectedModules.length > 0 && ` (${selectedModules.length} selected)`}
      </div>
    </div>
  );
}