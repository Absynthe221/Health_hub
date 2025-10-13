'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Eye, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Users,
  BarChart3,
  Filter,
  Search,
  ArrowUpDown
} from 'lucide-react';

export default function InstructorReviewMode() {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [selectedModules, setSelectedModules] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    filterAndSortModules();
  }, [modules, searchTerm, sortBy, sortOrder, filterStatus, filterDifficulty]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/modules/all');
      const data = await response.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      // Fallback to sample data
      setModules(getSampleModules());
    } finally {
      setLoading(false);
    }
  };

  const getSampleModules = () => {
    return [
      {
        moduleId: 'module_1',
        moduleTitle: 'Introduction to ECG',
        description: 'Fundamental concepts of electrocardiography',
        metadata: {
          totalSlides: 3,
          interactiveSlides: 2,
          quizItems: 2,
          estimatedDuration: '10 minutes',
          difficulty: 'Beginner'
        },
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        tags: ['ECG Basics', 'Introduction']
      },
      {
        moduleId: 'module_2',
        moduleTitle: 'ECG Waveforms and Intervals',
        description: 'Understanding ECG waveforms and intervals',
        metadata: {
          totalSlides: 3,
          interactiveSlides: 2,
          quizItems: 2,
          estimatedDuration: '12 minutes',
          difficulty: 'Beginner'
        },
        status: 'active',
        createdAt: '2024-01-02T00:00:00Z',
        tags: ['Waveforms', 'Intervals']
      }
    ];
  };

  const filterAndSortModules = () => {
    let filtered = [...modules];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(module =>
        module.moduleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(module => module.status === filterStatus);
    }

    // Difficulty filter
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(module => module.metadata.difficulty === filterDifficulty);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.moduleTitle.toLowerCase();
          bValue = b.moduleTitle.toLowerCase();
          break;
        case 'slides':
          aValue = a.metadata.totalSlides;
          bValue = b.metadata.totalSlides;
          break;
        case 'duration':
          aValue = parseInt(a.metadata.estimatedDuration);
          bValue = parseInt(b.metadata.estimatedDuration);
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a.moduleTitle.toLowerCase();
          bValue = b.moduleTitle.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredModules(filtered);
  };

  const handleSelectModule = (moduleId) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedModules.length === filteredModules.length) {
      setSelectedModules([]);
    } else {
      setSelectedModules(filteredModules.map(m => m.moduleId));
    }
  };

  const exportToCSV = () => {
    const selectedData = selectedModules.length > 0 
      ? modules.filter(m => selectedModules.includes(m.moduleId))
      : filteredModules;

    const csvContent = generateCSV(selectedData);
    downloadCSV(csvContent, 'ecg-modules-summary.csv');
  };

  const generateCSV = (modulesData) => {
    const headers = [
      'Module ID',
      'Module Title',
      'Description',
      'Status',
      'Difficulty',
      'Total Slides',
      'Interactive Slides',
      'Quiz Items',
      'Estimated Duration',
      'Tags',
      'Created Date'
    ];

    const rows = modulesData.map(module => [
      module.moduleId,
      module.moduleTitle,
      module.description,
      module.status,
      module.metadata.difficulty,
      module.metadata.totalSlides,
      module.metadata.interactiveSlides,
      module.metadata.quizItems,
      module.metadata.estimatedDuration,
      module.tags?.join('; ') || '',
      new Date(module.createdAt).toLocaleDateString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'draft':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'archived':
        return <FileText className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Module Review & Management</h1>
              <p className="text-gray-600 mt-1">
                {filteredModules.length} modules • {selectedModules.length} selected
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </button>
              <button
                onClick={exportToCSV}
                disabled={filteredModules.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              {/* Difficulty Filter */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              {/* Sort */}
              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="title">Sort by Title</option>
                  <option value="slides">Sort by Slides</option>
                  <option value="duration">Sort by Duration</option>
                  <option value="created">Sort by Created</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Module Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <div
                  key={module.moduleId}
                  className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer ${
                    selectedModules.includes(module.moduleId) ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => handleSelectModule(module.moduleId)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-6 h-6 text-green-600" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.metadata.difficulty)}`}>
                          {module.metadata.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(module.status)}
                        <input
                          type="checkbox"
                          checked={selectedModules.includes(module.moduleId)}
                          onChange={() => handleSelectModule(module.moduleId)}
                          className="rounded"
                        />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.moduleTitle}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>{module.metadata.totalSlides} slides</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{module.metadata.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{module.metadata.interactiveSlides} interactive</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                        <span>{module.metadata.quizItems} quizzes</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1">
                      {module.tags?.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedModules.length === filteredModules.length && filteredModules.length > 0}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Module
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slides
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Difficulty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredModules.map((module) => (
                      <tr key={module.moduleId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedModules.includes(module.moduleId)}
                            onChange={() => handleSelectModule(module.moduleId)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{module.moduleTitle}</div>
                            <div className="text-sm text-gray-500">{module.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(module.status)}
                            <span className="text-sm text-gray-900 capitalize">{module.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {module.metadata.totalSlides} ({module.metadata.interactiveSlides} interactive)
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {module.metadata.estimatedDuration}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.metadata.difficulty)}`}>
                            {module.metadata.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-green-600 hover:text-green-900 text-sm">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

