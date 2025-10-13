'use client';

import React, { useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import Badge from '../Badge';

const InstructorDashboard = ({ modules = [] }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMockUpload = async () => {
    try {
      setUploading(true);
      setMessage('');
      // Mock pipeline trigger - in a real setup this would call a backend endpoint
      await new Promise((r) => setTimeout(r, 1000));
      setMessage('Mock upload pipeline triggered successfully.');
    } catch (e) {
      setMessage('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  if (!modules) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Module Management</h3>
          <button
            onClick={handleMockUpload}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload PPTX'}
          </button>
        </div>
        {message && <div className="text-sm text-gray-700">{message}</div>}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((m) => (
            <div key={m.id || m.title} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-1">
                <div className="font-medium text-gray-900">{m.title}</div>
                <Badge variant="primary" size="sm">{m.totalSlides || m.numSlides || 0} slides</Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {m.description || 'ECG training module'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learner Progress (by module)</h3>
        <div className="text-sm text-gray-600">Progress table placeholder — wire to /api/ecg/progress/:moduleId if available.</div>
      </div>
    </div>
  );
};

export default InstructorDashboard;






