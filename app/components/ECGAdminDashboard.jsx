'use client';

import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const ECGAdminDashboard = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('modules');
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const response = await fetch('/api/ecg/modules');
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files, type, moduleId) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('type', type);
    formData.append('moduleId', moduleId);

    try {
      setUploadProgress(prev => ({ ...prev, [type]: 'uploading' }));
      
      const response = await fetch('/api/ecg/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setUploadProgress(prev => ({ ...prev, [type]: 'success' }));
        loadModules(); // Refresh modules
      } else {
        setUploadProgress(prev => ({ ...prev, [type]: 'error' }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(prev => ({ ...prev, [type]: 'error' }));
    }
  };

  const FileUploadZone = ({ type, moduleId, accept, multiple = true }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: accept,
      multiple: multiple,
      onDrop: (files) => handleFileUpload(files, type, moduleId)
    });

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-gray-600">
          {isDragActive ? (
            <p>Drop files here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium">Upload {type}</p>
              <p className="text-sm">Drag & drop or click to select files</p>
            </div>
          )}
        </div>
        {uploadProgress[type] === 'uploading' && (
          <div className="mt-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        )}
        {uploadProgress[type] === 'success' && (
          <div className="mt-2 text-green-600">
            <p className="text-sm">Upload successful!</p>
          </div>
        )}
        {uploadProgress[type] === 'error' && (
          <div className="mt-2 text-red-600">
            <p className="text-sm">Upload failed. Please try again.</p>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'modules', name: 'Modules', icon: '📚' },
    { id: 'upload', name: 'Upload Files', icon: '📤' },
    { id: 'questions', name: 'Questions', icon: '❓' },
    { id: 'analytics', name: 'Analytics', icon: '📊' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ECG Training Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage modules, upload content, and monitor progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'modules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">ECG Training Modules</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create New Module
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{module.duration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span className="capitalize">{module.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Slides:</span>
                      <span>{module.slides?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Videos:</span>
                      <span>{module.videos?.length || 0}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedModule(module)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Upload Content</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload PDFs</h3>
                <FileUploadZone
                  type="pdfs"
                  moduleId={selectedModule?.id || 'new'}
                  accept={{ 'application/pdf': ['.pdf'] }}
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Videos</h3>
                <FileUploadZone
                  type="videos"
                  moduleId={selectedModule?.id || 'new'}
                  accept={{ 'video/mp4': ['.mp4'], 'video/webm': ['.webm'] }}
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h3>
                <FileUploadZone
                  type="images"
                  moduleId={selectedModule?.id || 'new'}
                  accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
                />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Questions (CSV)</h3>
                <FileUploadZone
                  type="questions"
                  moduleId={selectedModule?.id || 'new'}
                  accept={{ 'text/csv': ['.csv'] }}
                  multiple={false}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Question Management</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Question
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Question Bank</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">Question management interface will be implemented here.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Analytics & Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600">Total Modules</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-gray-600">Active Learners</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-yellow-600">89%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-purple-600">342</div>
                <div className="text-sm text-gray-600">Certificates Issued</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Performance</h3>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Completion Rate</div>
                      <div className="text-lg font-semibold text-blue-600">85%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ECGAdminDashboard;





