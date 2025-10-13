'use client';

import { useState } from 'react';
import { Upload, FileText, Image, Volume2, CheckCircle } from 'lucide-react';
import { showNotification } from './NotificationSystem';

export default function PresentationUpload({ onUploadSuccess, onClose }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    packageLevel: 'standard',
    difficulty: 'Intermediate',
    estimatedDuration: 45,
    file: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Detect Safari and apply stricter limits
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const maxSize = isSafari ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for Safari, 10MB for others
      
      if (file.size > maxSize) {
        showNotification({
          type: 'error',
          title: 'File Too Large',
          message: isSafari 
            ? 'File size must be less than 5MB for Safari safety'
            : 'File size must be less than 10MB for browser safety'
        });
        return;
      }
      
      // Show Safari-specific warning
      if (isSafari && file.size > 2 * 1024 * 1024) { // 2MB warning
        showNotification({
          type: 'warning',
          title: 'Large File Warning',
          message: 'Large files may cause Safari to crash. Consider using a smaller file.'
        });
      }
      
      setFormData({ ...formData, file });
      setUploadedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!formData.file || !formData.title) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please select a file and enter a title'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('packageLevel', formData.packageLevel);
      uploadFormData.append('difficulty', formData.difficulty);
      uploadFormData.append('estimatedDuration', formData.estimatedDuration);

      // Simulate progress updates with more frequent updates for Safari
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 5; // Slower progress for Safari stability
        });
      }, 100); // More frequent updates

      const response = await fetch('/api/upload/pptx', {
        method: 'POST',
        body: uploadFormData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        
        showNotification({
          type: 'success',
          title: 'Upload Successful',
          message: `Presentation "${formData.title}" uploaded and processed successfully!`
        });
        
        // Reset form
        setFormData({ 
          title: '', 
          description: '', 
          packageLevel: 'standard',
          difficulty: 'Intermediate',
          estimatedDuration: 45,
          file: null 
        });
        setUploadedFile(null);
        
        // Call callback if provided
        if (onUploadSuccess) {
          onUploadSuccess(result.module);
        }
        
        // Refresh the page to show the new module
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const error = await response.json();
        showNotification({
          type: 'error',
          title: 'Upload Failed',
          message: error.error || 'Failed to upload presentation'
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      showNotification({
        type: 'error',
        title: 'Upload Error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Upload className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Upload Presentation</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Presentation File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pptx,.pdf,.mp4,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PPTX, PDF, MP4, JPG, PNG up to 10MB</p>
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ Safari users: Use small files (&lt;5MB) to prevent crashes
              </p>
            </div>
          </div>
          
          {uploadedFile && (
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2" />
              <span>{uploadedFile.name}</span>
              <span className="ml-2 text-gray-400">({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>

        {/* Module Details */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Module Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter module title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter module description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Level *
              </label>
              <select
                value={formData.packageLevel}
                onChange={(e) => setFormData({ ...formData, packageLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="free">Free</option>
                <option value="standard">Standard</option>
                <option value="pro">Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 45 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="45"
                min="1"
                max="300"
              />
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Processing presentation...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading || !formData.file || !formData.title}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload & Process
              </>
            )}
          </button>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="mt-8 border-t pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Processing Steps</h4>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Image className="h-4 w-4 mr-3 text-gray-400" />
            <span>Extract slide images</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-3 text-gray-400" />
            <span>Extract text content for subtitles</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Volume2 className="h-4 w-4 mr-3 text-gray-400" />
            <span>Prepare for optional audio narration</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-3 text-gray-400" />
            <span>Generate module.json structure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
