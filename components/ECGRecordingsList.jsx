'use client';

import { useState, useEffect } from 'react';

export default function ECGRecordingsList({ userId }) {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockRecordings = [
      {
        id: 'ecg1',
        name: 'normal_sinus_rhythm.csv',
        uploadedAt: '2024-01-20T10:30:00Z',
        duration: 10,
        heartRate: 72
      },
      {
        id: 'ecg2',
        name: 'atrial_fibrillation.csv',
        uploadedAt: '2024-01-19T14:15:00Z',
        duration: 15,
        heartRate: 95
      }
    ];
    
    setTimeout(() => {
      setRecordings(mockRecordings);
      setLoading(false);
    }, 1000);
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ECG Recordings</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ECG Recordings</h3>
      <div className="space-y-3">
        {recordings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No ECG recordings found</p>
        ) : (
          recordings.map((recording) => (
            <div key={recording.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{recording.name}</h4>
                  <p className="text-sm text-gray-500">
                    Duration: {recording.duration}s | Heart Rate: {recording.heartRate} bpm
                  </p>
                  <p className="text-xs text-gray-400">
                    Uploaded: {new Date(recording.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
