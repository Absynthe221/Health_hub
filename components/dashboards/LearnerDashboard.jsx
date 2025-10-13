'use client';

import React from 'react';
import { useUser } from '../../contexts/UserContext';
import { useModuleData } from '../../hooks/useModuleData';
import ProgressBar from '../ProgressBar';
import Badge from '../Badge';
import LoadingSpinner from '../LoadingSpinner';
import { useRouter } from 'next/navigation';

const LearnerDashboard = () => {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { modules, loading: modulesLoading, error } = useModuleData();

  if (userLoading || modulesLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        Failed to load modules: {String(error)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => {
          const slideCount = m.totalSlides || m.numSlides || 0;
          return (
            <div key={m.id || m.title} className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{m.title}</h3>
                <Badge variant="primary" size="sm">{slideCount} slides</Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{m.description || 'ECG training module'}</p>
              <div className="mb-3">
                <ProgressBar current={0} total={slideCount} showPercentage={true} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/ecg-training/${encodeURIComponent(m.title)}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue
                </button>
                {m.hasMCQs && <Badge variant="orange" size="sm">MCQs</Badge>}
                {m.hasAudio && <Badge variant="purple" size="sm">Audio</Badge>}
                {m.hasSubtitles && <Badge variant="success" size="sm">Subtitles</Badge>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearnerDashboard;






