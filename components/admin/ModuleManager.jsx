'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Upload, Edit, Trash2, Eye, Download, Plus, Search, Filter, Clock, Users, Award } from 'lucide-react';

export default function ModuleManager() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockModules = [
      {
        id: '1',
        title: 'ECG Fundamentals',
        description: 'Learn the basics of electrocardiography including heart anatomy, electrical conduction, and basic rhythm recognition.',
        difficulty: 'beginner',
        status: 'published',
        duration: 120,
        slides: 4,
        students: 45,
        completions: 32,
        averageScore: 85,
        createdDate: '2024-01-15',
        lastUpdated: '2024-09-20',
        tags: ['anatomy', 'basics', 'fundamentals'],
        objectives: [
          'Understand heart anatomy and electrical conduction system',
          'Identify normal ECG components',
          'Recognize basic cardiac rhythms'
        ]
      },
      {
        id: '2',
        title: 'Cardiac Rhythm Recognition',
        description: 'Identify and interpret various cardiac rhythms, from normal sinus rhythm to life-threatening arrhythmias.',
        difficulty: 'intermediate',
        status: 'published',
        duration: 90,
        slides: 3,
        students: 28,
        completions: 18,
        averageScore: 82,
        createdDate: '2024-01-20',
        lastUpdated: '2024-09-15',
        tags: ['rhythms', 'arrhythmias', 'recognition'],
        objectives: [
          'Recognize normal sinus rhythm and variations',
          'Identify common arrhythmias',
          'Distinguish between atrial and ventricular rhythms'
        ]
      },
      {
        id: '3',
        title: 'STEMI and NSTEMI',
        description: 'Understanding myocardial infarction patterns and their clinical significance.',
        difficulty: 'advanced',
        status: 'draft',
        duration: 180,
        slides: 6,
        students: 0,
        completions: 0,
        averageScore: 0,
        createdDate: '2024-02-01',
        lastUpdated: '2024-10-01',
        tags: ['STEMI', 'NSTEMI', 'infarction'],
        objectives: [
          'Understand STEMI vs NSTEMI differences',
          'Recognize ECG patterns in MI',
          'Apply clinical management principles'
        ]
      }
    ];
    
    setModules(mockModules);
    setLoading(false);
  }, []);

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || module.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === 'all' || module.status === statusFilter;
    
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

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

  const handleEditModule = (module) => {
    setSelectedModule(module);
    setShowEditModal(true);
  };

  const handleDeleteModule = (moduleId) => {
    if (confirm('Are you sure you want to delete this module?')) {
      setModules(prev => prev.filter(module => module.id !== moduleId));
    }
  };

  const handlePublishModule = (moduleId) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId 
          ? { ...module, status: 'published' }
          : module
      )
    );
  };

  const handleArchiveModule = (moduleId) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId 
          ? { ...module, status: 'archived' }
          : module
      )
    );
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
          <h2 className="text-2xl font-bold text-gray-900">Module Manager</h2>
          <p className="text-gray-500">Create, edit, and manage ECG learning modules</p>
        </div>
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
            <Award className="h-8 w-8 text-purple-600" />
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

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button className="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredModules.map((module) => (
                <tr key={module.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{module.title}</div>
                        <div className="text-sm text-gray-500">{module.description.substring(0, 60)}...</div>
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{module.duration} min</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{module.slides} slides</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(module.status)}>
                      {module.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center justify-between mb-1">
                        <span>Students: {module.students}</span>
                        <span>Completions: {module.completions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Avg Score: {module.averageScore}%</span>
                        <span>Rate: {module.students > 0 ? Math.round((module.completions / module.students) * 100) : 0}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {module.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditModule(module)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit module"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View module"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {module.status === 'draft' && (
                        <button
                          onClick={() => handlePublishModule(module.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Publish module"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      )}
                      {module.status === 'published' && (
                        <button
                          onClick={() => handleArchiveModule(module.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Archive module"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete module"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {filteredModules.length} of {modules.length} modules
      </div>
    </div>
  );
}