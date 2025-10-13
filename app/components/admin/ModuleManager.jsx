'use client';

import { useState } from 'react';
import { Upload, FileText, Settings } from 'lucide-react';

export default function ModuleManager({ editingModuleId, onEditModule }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Presentation & Module Manager</h2>
        <p className="text-gray-600">Upload and manage ECG presentations and learning modules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Upload className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold">Upload Presentations</h3>
          </div>
          <p className="text-gray-600 mb-4">Upload PPTX files to create interactive learning modules</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Upload PPTX File
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold">Module Settings</h3>
          </div>
          <p className="text-gray-600 mb-4">Configure module settings and learning objectives</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
            Manage Settings
          </button>
        </div>
      </div>
    </div>
  );
}

