'use client';

import { useState } from 'react';

export default function ECGUpload() {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    // Mock upload process
    setTimeout(() => {
      setUploading(false);
      alert('ECG file uploaded successfully!');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload ECG Recording</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".csv,.txt,.edf"
          onChange={handleFileUpload}
          className="hidden"
          id="ecg-upload"
        />
        <label
          htmlFor="ecg-upload"
          className="cursor-pointer"
        >
          <div className="text-4xl mb-4">📁</div>
          <p className="text-gray-600 mb-2">Click to upload ECG file</p>
          <p className="text-sm text-gray-500">Supports CSV, TXT, and EDF formats</p>
        </label>
        {uploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
