'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen,
  Plus,
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  Play,
  FileText,
  Image,
  Video,
  Mic,
  Award,
  Users,
  Clock,
  BarChart3,
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Share2,
  Settings,
  Layers
} from 'lucide-react';

export default function ModuleManagement({ onActionClick }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedModules, setSelectedModules] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [expandedModule, setExpandedModule] = useState(null);
  const [showAddModule, setShowAddModule] = useState(false);

  // Fetch modules from API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/modules');
        const data = await res.json();
        if (data.success && data.modules) {
          setModules(data.modules);
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModules();
  }, []);

  // Calculate statistics from actual modules
  const stats = {
    totalModules: modules.length,
    published: modules.filter(m => m.status === 'published').length,
    draft: modules.filter(m => m.status === 'draft').length,
    totalSlides: modules.reduce((acc, m) => acc + (m.slides?.length || 0), 0),
    totalImages: modules.reduce((acc, m) => {
      const slideImages = m.slides?.reduce((s, slide) => s + (slide.images?.length || 0), 0) || 0;
      return acc + slideImages;
    }, 0),
    avgSlidesPerModule: modules.length > 0 
      ? Math.round(modules.reduce((acc, m) => acc + (m.slides?.length || 0), 0) / modules.length)
      : 0,
    interactiveSlides: modules.reduce((acc, m) => {
      const interactive = m.slides?.filter(s => s.interactive).length || 0;
      return acc + interactive;
    }, 0)
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
      case 'basic':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
      case 'expert':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Published</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Draft</span>;
      case 'archived':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Archived</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{status}</span>;
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = 
      module.moduleTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.moduleId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || module.difficulty?.toLowerCase() === filterDifficulty;
    const matchesStatus = filterStatus === 'all' || module.status === filterStatus;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const handleSelectModule = (id) => {
    if (selectedModules.includes(id)) {
      setSelectedModules(selectedModules.filter(mId => mId !== id));
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedModules.length === filteredModules.length) {
      setSelectedModules([]);
    } else {
      setSelectedModules(filteredModules.map(m => m.moduleId));
    }
  };

  const handleBulkAction = (action) => {
    if (onActionClick) {
      onActionClick(`Bulk ${action}: ${selectedModules.length} modules`);
    }
    setSelectedModules([]);
  };

  const toggleModuleExpand = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Modules</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalModules}</p>
              <p className="text-sm text-blue-600 mt-1">{stats.published} published</p>
            </div>
            <BookOpen className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Slides</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSlides}</p>
              <p className="text-sm text-gray-500 mt-1">{stats.avgSlidesPerModule} avg per module</p>
            </div>
            <Layers className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Media Assets</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalImages}</p>
              <p className="text-sm text-purple-600 mt-1">Images</p>
            </div>
            <Image className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Interactive</p>
              <p className="text-3xl font-bold text-gray-900">{stats.interactiveSlides}</p>
              <p className="text-sm text-orange-600 mt-1">Interactive slides</p>
            </div>
            <Play className="h-12 w-12 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Module Management</h3>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowAddModule(true);
                onActionClick && onActionClick('Create New Module');
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Module
            </button>
            
            <button
              onClick={() => onActionClick && onActionClick('Upload PPTX')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload PPTX
            </button>
            
            <button
              onClick={() => onActionClick && onActionClick('Import Modules')}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Import
            </button>
            
            <button
              onClick={() => {
                setViewMode(viewMode === 'grid' ? 'list' : 'grid');
                onActionClick && onActionClick(`Switch to ${viewMode === 'grid' ? 'List' : 'Grid'} View`);
              }}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules by title, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {selectedModules.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedModules.length} selected</span>
              <button
                onClick={() => handleBulkAction('Publish')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('Archive')}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Archive
              </button>
              <button
                onClick={() => handleBulkAction('Delete')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredModules.length} of {modules.length} modules
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading modules...</p>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <div 
                  key={module.moduleId}
                  className={`bg-white rounded-lg shadow hover:shadow-lg transition-all ${
                    selectedModules.includes(module.moduleId) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="p-6">
                    {/* Header with Checkbox */}
                    <div className="flex items-start justify-between mb-3">
                      <input
                        type="checkbox"
                        checked={selectedModules.includes(module.moduleId)}
                        onChange={() => handleSelectModule(module.moduleId)}
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(module.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(module.difficulty)}`}>
                          {module.difficulty || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Module Info */}
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {module.moduleTitle}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                        {module.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <BookOpen className="h-3 w-3 mr-1" />
                        <span className="font-mono">{module.moduleId}</span>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-gray-600">{module.slides?.length || 0} slides</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Image className="h-4 w-4 text-purple-500 mr-2" />
                        <span className="text-gray-600">
                          {module.slides?.reduce((acc, s) => acc + (s.images?.length || 0), 0) || 0} images
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Play className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-600">
                          {module.slides?.filter(s => s.interactive).length || 0} interactive
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-orange-500 mr-2" />
                        <span className="text-gray-600">
                          {module.metadata?.estimatedDuration || `${(module.slides?.length || 0) * 2} min`}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleModuleExpand(module.moduleId)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        {expandedModule === module.moduleId ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Slides
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            View Slides
                          </>
                        )}
                      </button>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onActionClick && onActionClick(`Edit ${module.moduleTitle}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onActionClick && onActionClick(`Preview ${module.moduleTitle}`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onActionClick && onActionClick(`Copy ${module.moduleTitle}`)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onActionClick && onActionClick(`Delete ${module.moduleTitle}`)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Slides View */}
                    {expandedModule === module.moduleId && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="text-sm font-semibold text-gray-900 mb-3">
                          Slides ({module.slides?.length || 0})
                        </h5>
                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {module.slides?.map((slide, index) => (
                            <div 
                              key={slide.id || index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs hover:bg-gray-100"
                            >
                              <div className="flex items-center flex-1 min-w-0">
                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full font-medium mr-2">
                                  {index + 1}
                                </span>
                                <span className="text-gray-700 truncate">
                                  {slide.title || `Slide ${index + 1}`}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                                {slide.images?.length > 0 && (
                                  <Image className="h-3 w-3 text-purple-500" title={`${slide.images.length} images`} />
                                )}
                                {slide.interactive && (
                                  <Play className="h-3 w-3 text-green-500" title="Interactive" />
                                )}
                                {slide.quiz && (
                                  <Award className="h-3 w-3 text-orange-500" title="Has quiz" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedModules.length === filteredModules.length && filteredModules.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredModules.map((module) => (
                    <tr 
                      key={module.moduleId}
                      className={`hover:bg-gray-50 ${selectedModules.includes(module.moduleId) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedModules.includes(module.moduleId)}
                          onChange={() => handleSelectModule(module.moduleId)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <BookOpen className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {module.moduleTitle}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              {module.moduleId}
                            </div>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center text-gray-600">
                            <FileText className="h-3 w-3 mr-1" />
                            {module.slides?.length || 0} slides
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Image className="h-3 w-3 mr-1" />
                            {module.slides?.reduce((acc, s) => acc + (s.images?.length || 0), 0) || 0} images
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {module.metadata?.estimatedDuration || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(module.difficulty)}`}>
                          {module.difficulty || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(module.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleModuleExpand(module.moduleId)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Slides"
                          >
                            {expandedModule === module.moduleId ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => onActionClick && onActionClick(`Edit ${module.moduleTitle}`)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onActionClick && onActionClick(`Preview ${module.moduleTitle}`)}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                            title="Preview"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onActionClick && onActionClick(`Delete ${module.moduleTitle}`)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Expanded Row - Slides Detail */}
              {expandedModule && filteredModules.find(m => m.moduleId === expandedModule) && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="max-w-6xl">
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">
                      Slide Details for {filteredModules.find(m => m.moduleId === expandedModule)?.moduleTitle}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredModules.find(m => m.moduleId === expandedModule)?.slides?.map((slide, index) => (
                        <div 
                          key={slide.id || index}
                          className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full font-medium text-xs">
                              {index + 1}
                            </span>
                            <div className="flex items-center space-x-1">
                              {slide.images?.length > 0 && (
                                <span className="text-xs text-purple-600">{slide.images.length}📷</span>
                              )}
                              {slide.interactive && (
                                <Play className="h-3 w-3 text-green-500" />
                              )}
                              {slide.quiz && (
                                <Award className="h-3 w-3 text-orange-500" />
                              )}
                            </div>
                          </div>
                          <h6 className="text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                            {slide.title || `Slide ${index + 1}`}
                          </h6>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {slide.content?.substring(0, 80)}...
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">{slide.contentType}</span>
                            <button
                              onClick={() => onActionClick && onActionClick(`Edit Slide ${index + 1}`)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {filteredModules.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No modules found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}

      {/* Add Module Modal */}
      {showAddModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Module</h3>
                <button
                  onClick={() => setShowAddModule(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Advanced ECG Interpretation"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module ID</label>
                  <input
                    type="text"
                    placeholder="e.g., mod_020"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of the module content..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="ecg_basics">ECG Basics</option>
                    <option value="arrhythmias">Arrhythmias</option>
                    <option value="conduction_abnormalities">Conduction Abnormalities</option>
                    <option value="myocardial_infarction">Myocardial Infarction</option>
                    <option value="emergency_protocols">Emergency Protocols</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives</label>
                <textarea
                  rows="2"
                  placeholder="Enter learning objectives, one per line..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="60"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Instructor</option>
                    <option value="instructor_001">Dr. Jane Smith</option>
                    <option value="instructor_002">Dr. Diana Prince</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="ecg, cardiology, diagnosis"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModule(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onActionClick && onActionClick('Create Module');
                  setShowAddModule(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
