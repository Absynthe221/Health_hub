#!/usr/bin/env node

/**
 * Health Hub Admin Dashboard Routing Fix Script
 * 
 * This script fixes the Admin Dashboard routing and CRUD functionality:
 * 1. Updates ModuleManager component for proper navigation
 * 2. Fixes action button wiring and functionality
 * 3. Ensures instructor name fields work correctly
 * 4. Updates API endpoints for new modules
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Admin Dashboard Routing and CRUD...\n');

// Fix ModuleManager component
function fixModuleManager() {
  console.log('📝 Updating ModuleManager component...');
  
  const moduleManagerPath = path.join(process.cwd(), 'components/admin/ModuleManager.jsx');
  
  if (!fs.existsSync(moduleManagerPath)) {
    console.log('  ⚠️  ModuleManager.jsx not found, creating...');
    createModuleManager();
    return;
  }
  
  let content = fs.readFileSync(moduleManagerPath, 'utf8');
  
  // Fix missing function
  if (!content.includes('handleModuleUploaded')) {
    content = content.replace(
      'const handleUploadSuccess = (newModule) => {',
      `const handleModuleUploaded = (newModule) => {
    setModules(prev => [...prev, newModule]);
    showNotification({
      type: 'success',
      title: 'Module Uploaded',
      message: 'New module has been uploaded successfully.'
    });
  };

  const handleUploadSuccess = (newModule) => {`
    );
  }
  
  // Fix missing imports
  if (!content.includes('User, Save')) {
    content = content.replace(
      "import { Plus, Edit, Eye, Trash2, Upload, FileText, Image, Volume2, CheckCircle, Clock, User, Save } from 'lucide-react';",
      "import { Plus, Edit, Eye, Trash2, Upload, FileText, Image, Volume2, CheckCircle, Clock, User, Save } from 'lucide-react';"
    );
  }
  
  fs.writeFileSync(moduleManagerPath, content);
  console.log('  ✅ ModuleManager component updated');
}

// Create ModuleManager if it doesn't exist
function createModuleManager() {
  console.log('  📝 Creating ModuleManager component...');
  
  const moduleManagerContent = `'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Eye, Trash2, Upload, FileText, Image, Volume2, CheckCircle, Clock, User, Save } from 'lucide-react';
import PresentationUpload from './PresentationUpload';
import ModuleEditor from './ModuleEditor';
import { showNotification } from './NotificationSystem';

export default function ModuleManager({ editingModuleId, onEditModule }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manage');
  const [editingModule, setEditingModule] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [instructorNames, setInstructorNames] = useState({});
  const [editingInstructor, setEditingInstructor] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (editingModuleId) {
      const module = modules.find(m => m.id === editingModuleId);
      if (module) {
        setEditingModule(module);
        setActiveTab('edit');
      }
    }
  }, [editingModuleId, modules]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/modules');
      const data = await response.json();
      setModules(data.modules || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      showNotification({
        type: 'error',
        title: 'Failed to Load Modules',
        message: 'Unable to fetch modules. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setActiveTab('edit');
    if (onEditModule) {
      onEditModule(module.id);
    }
  };

  const handleCloseEditor = () => {
    setEditingModule(null);
    setActiveTab('manage');
    if (onEditModule) {
      onEditModule(null);
    }
  };

  const handleSaveModule = async (updatedModule) => {
    try {
      const response = await fetch('/api/modules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedModule)
      });

      if (response.ok) {
        setModules(prev => prev.map(m => m.id === updatedModule.id ? updatedModule : m));
        setEditingModule(null);
        setActiveTab('manage');
        showNotification({
          type: 'success',
          title: 'Module Updated',
          message: 'Module has been updated successfully.'
        });
      } else {
        throw new Error('Failed to update module');
      }
    } catch (error) {
      console.error('Error updating module:', error);
      showNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update module. Please try again.'
      });
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module?')) return;

    try {
      const response = await fetch(\`/api/modules?id=\${moduleId}\`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setModules(prev => prev.filter(m => m.id !== moduleId));
        showNotification({
          type: 'success',
          title: 'Module Deleted',
          message: 'Module has been deleted successfully.'
        });
      } else {
        throw new Error('Failed to delete module');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      showNotification({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete module. Please try again.'
      });
    }
  };

  const handlePublishModule = async (moduleId) => {
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: moduleId, status: 'published' })
      });

      if (response.ok) {
        setModules(prev => prev.map(m => 
          m.id === moduleId ? { ...m, status: 'published' } : m
        ));
        showNotification({
          type: 'success',
          title: 'Module Published',
          message: 'Module has been published successfully.'
        });
      } else {
        throw new Error('Failed to publish module');
      }
    } catch (error) {
      console.error('Error publishing module:', error);
      showNotification({
        type: 'error',
        title: 'Publish Failed',
        message: 'Failed to publish module. Please try again.'
      });
    }
  };

  const handlePreviewModule = (moduleId) => {
    window.open(\`/ecg-training/\${moduleId}\`, '_blank');
  };

  const handleUploadFile = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  const handleModuleUploaded = (newModule) => {
    setModules(prev => [...prev, newModule]);
    setShowUploadModal(false);
    showNotification({
      type: 'success',
      title: 'Module Uploaded',
      message: 'New module has been uploaded successfully.'
    });
  };

  const handleUploadSuccess = (newModule) => {
    setModules(prev => [...prev, newModule]);
    setShowUploadModal(false);
    showNotification({
      type: 'success',
      title: 'Upload Successful',
      message: 'Presentation has been uploaded successfully.'
    });
  };

  const handleInstructorNameChange = (moduleId, name) => {
    setInstructorNames(prev => ({
      ...prev,
      [moduleId]: name
    }));
  };

  const handleSaveInstructorName = async (moduleId) => {
    const instructorName = instructorNames[moduleId];
    if (!instructorName || instructorName.trim() === '') {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter an instructor name'
      });
      return;
    }

    try {
      const response = await fetch('/api/modules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: moduleId, 
          instructorName: instructorName.trim() 
        })
      });

      if (response.ok) {
        setModules(prev => prev.map(m => 
          m.id === moduleId ? { ...m, instructorName: instructorName.trim() } : m
        ));
        setEditingInstructor(null);
        showNotification({
          type: 'success',
          title: 'Instructor Name Saved',
          message: 'Instructor name has been updated successfully.'
        });
      } else {
        throw new Error('Failed to save instructor name');
      }
    } catch (error) {
      console.error('Error saving instructor name:', error);
      showNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save instructor name. Please try again.'
      });
    }
  };

  const handleEditInstructorName = (moduleId) => {
    setEditingInstructor(moduleId);
    if (!instructorNames[moduleId]) {
      const module = modules.find(m => m.id === moduleId);
      setInstructorNames(prev => ({
        ...prev,
        [moduleId]: module?.instructorName || ''
      }));
    }
  };

  const filteredModules = modules.filter(module => {
    if (filter === 'all') return true;
    if (filter === 'draft') return module.status === 'draft';
    if (filter === 'published') return module.status === 'published';
    if (filter === 'uploaded') return module.type === 'uploaded';
    return true;
  });

  const tabs = [
    { id: 'upload', name: 'Upload Presentation', icon: Upload },
    { id: 'manage', name: 'Manage Modules', icon: FileText },
    { id: 'drafts', name: 'Drafts', icon: Clock },
    { id: 'published', name: 'Published', icon: CheckCircle }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (editingModule) {
    return (
      <ModuleEditor
        module={editingModule}
        onSave={handleSaveModule}
        onCancel={handleCloseEditor}
      />
    );
  }

  if (showUploadModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upload New Presentation</h2>
            <button
              onClick={handleCloseUploadModal}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <PresentationUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={\`py-2 px-1 border-b-2 font-medium text-sm \${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex items-center space-x-2\`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' && <PresentationUpload onUploadSuccess={handleModuleUploaded} />}

      {activeTab === 'manage' && (
        <div className="space-y-6">
          {/* Filters and Actions */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Modules</option>
                <option value="draft">Drafts</option>
                <option value="published">Published</option>
                <option value="uploaded">Uploaded</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {filteredModules.length} modules
              </div>
              <button
                onClick={handleUploadFile}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Presentation
              </button>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow border">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {module.description}
                      </p>
                    </div>
                    <span className={\`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full \${
                      module.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }\`}>
                      {module.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      {module.slideCount || 0} slides
                    </div>
                    {module.hasAudio && (
                      <div className="flex items-center">
                        <Volume2 className="h-4 w-4 mr-1" />
                        <span>Audio</span>
                      </div>
                    )}
                    {module.hasQuiz && (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Quiz
                      </div>
                    )}
                  </div>

                  {/* Instructor Name Field */}
                  <div className="mb-4">
                    {editingInstructor === module.id ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={instructorNames[module.id] || ''}
                            onChange={(e) => handleInstructorNameChange(module.id, e.target.value)}
                            placeholder="Enter instructor name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <button
                          onClick={() => handleSaveInstructorName(module.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Save Instructor Name"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingInstructor(null)}
                          className="text-gray-600 hover:text-gray-800"
                          title="Cancel"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => handleEditInstructorName(module.id)}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {module.instructorName || 'Click to add instructor name'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      {module.type} • {module.difficulty || 'N/A'}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditModule(module)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Module"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePreviewModule(module.id)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Preview Module"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Module"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {module.status === 'draft' && (
                        <button
                          onClick={() => handlePublishModule(module.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Publish Module"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
              <p className="text-gray-500">Get started by uploading a new presentation.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'drafts' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Draft Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.filter(m => m.status === 'draft').map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow border">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{module.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                      Draft
                    </span>
                    <button
                      onClick={() => handlePublishModule(module.id)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'published' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Published Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.filter(m => m.status === 'published').map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow border">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{module.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      Published
                    </span>
                    <button
                      onClick={() => handlePreviewModule(module.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}`;

  const moduleManagerDir = path.join(process.cwd(), 'components/admin');
  if (!fs.existsSync(moduleManagerDir)) {
    fs.mkdirSync(moduleManagerDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(moduleManagerDir, 'ModuleManager.jsx'), moduleManagerContent);
  console.log('  ✅ ModuleManager component created');
}

// Update API routes
function updateAPIRoutes() {
  console.log('\n🔗 Updating API routes...');
  
  // Update modules API to handle instructor names
  const modulesAPIPath = path.join(process.cwd(), 'app/api/modules/route.js');
  
  if (fs.existsSync(modulesAPIPath)) {
    let content = fs.readFileSync(modulesAPIPath, 'utf8');
    
    // Add instructor name support to existing modules
    if (!content.includes('instructorName')) {
      content = content.replace(
        'allModules.push(...ecgModules.map(module => ({',
        'allModules.push(...ecgModules.map(module => ({'
      );
      
      content = content.replace(
        'slideCount: 1,',
        'slideCount: 1,\n        instructorName: module.instructorName || null,'
      );
    }
    
    fs.writeFileSync(modulesAPIPath, content);
    console.log('  ✅ Modules API updated');
  }
  
  // Create uploads API if it doesn't exist
  const uploadsAPIPath = path.join(process.cwd(), 'app/api/uploads/route.js');
  if (!fs.existsSync(uploadsAPIPath)) {
    const uploadsDir = path.join(process.cwd(), 'app/api/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const uploadsContent = `import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('presentation');
    const title = formData.get('title');
    const description = formData.get('description');

    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      );
    }

    // Generate unique module ID
    const moduleId = \`module-\${Date.now().toString(36)}-\${Math.random().toString(36).substr(2, 5)}\`;
    
    // Create directories
    const uploadDir = path.join(process.cwd(), 'public/uploads/slides', moduleId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Simulate file processing (in real implementation, you would process the actual file)
    const newModule = {
      id: moduleId,
      title: title,
      description: description || '',
      type: 'uploaded',
      status: 'draft',
      slideCount: 5, // Simulated
      hasAudio: false,
      hasQuiz: false,
      instructorName: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      module: newModule,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}`;

    fs.writeFileSync(uploadsAPIPath, uploadsContent);
    console.log('  ✅ Uploads API created');
  }
}

// Create NotificationSystem if it doesn't exist
function createNotificationSystem() {
  console.log('\n🔔 Creating NotificationSystem...');
  
  const notificationPath = path.join(process.cwd(), 'components/admin/NotificationSystem.jsx');
  
  if (!fs.existsSync(notificationPath)) {
    const notificationContent = `'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleNotification = (event) => {
      const { type, title, message, duration = 5000 } = event.detail;
      
      const notification = {
        id: Date.now(),
        type,
        title,
        message,
        duration
      };

      setNotifications(prev => [...prev, notification]);

      // Auto remove after duration
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, duration);
    };

    window.addEventListener('showNotification', handleNotification);
    return () => window.removeEventListener('showNotification', handleNotification);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={\`max-w-sm w-full border rounded-lg p-4 shadow-lg \${getBgColor(notification.type)}\`}
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;

// Global notification function
export const showNotification = (notification) => {
  window.dispatchEvent(new CustomEvent('showNotification', { detail: notification }));
};`;

    fs.writeFileSync(notificationPath, notificationContent);
    console.log('  ✅ NotificationSystem created');
  }
}

// Main execution
function main() {
  try {
    // Step 1: Fix ModuleManager component
    fixModuleManager();
    
    // Step 2: Update API routes
    updateAPIRoutes();
    
    // Step 3: Create NotificationSystem
    createNotificationSystem();
    
    console.log('\n✅ Admin Dashboard Routing Fix Complete!');
    console.log('\n🎯 Next steps:');
    console.log('  1. Run create_media_placeholders.js to add media assets');
    console.log('  2. Run update_module_data.js to integrate new modules');
    console.log('  3. Test the dashboard functionality');
    
  } catch (error) {
    console.error('❌ Error fixing dashboard routing:', error);
    process.exit(1);
  }
}

// Run the script
main();



