'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ECGTrainingPage = () => {
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    const loadModules = async () => {
      try {
        console.log('Starting to load modules...');
        const response = await fetch('/api/ecg/modules');
        console.log('Response received:', response.status, response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Modules loaded:', data.length, 'modules');
        setModules(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading modules:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  const handleStartModule = (module) => {
    setSelectedModule(module);
    console.log('Starting module:', module.title);
    // Navigate to module detail page
    const moduleId = encodeURIComponent(module.title);
    router.push(`/ecg-training/${moduleId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ECG Training Modules...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Error Loading Modules</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="bg-yellow-50 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-yellow-900 mb-4">Troubleshooting:</h3>
              <div className="text-left text-yellow-800 space-y-2">
                <p>1. Make sure the server is running: <code className="bg-yellow-100 px-2 py-1 rounded">npm run dev</code></p>
                <p>2. Check if modules exist: <code className="bg-yellow-100 px-2 py-1 rounded">ls assets/ecg-modules.json</code></p>
                <p>3. Try refreshing the page</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">ECG Training Modules</h1>
        <p className="text-center text-gray-600 mb-12">
          Interactive ECG learning platform with hands-on activities
        </p>
        
        {modules.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">📚 No Modules Found</h2>
            <p className="text-gray-600 mb-6">
              No ECG training modules have been processed yet.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-4">How to Add Your Files:</h3>
              <div className="text-left text-blue-800 space-y-2">
                <p>1. Save your files in: <code className="bg-blue-100 px-2 py-1 rounded">/Users/som/Health_Hub/presentations/</code></p>
                <p>2. Run: <code className="bg-blue-100 px-2 py-1 rounded">npm run cursor-ecg-ultimate</code></p>
                <p>3. Refresh this page</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <div className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 line-clamp-2 leading-tight">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {module.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span className="flex items-center">
                        ⏱️ {module.duration} min
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {module.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        📄 {module.numSlides} slides
                      </span>
                      <span className="flex items-center">
                        ❓ {module.questionCount} questions
                      </span>
                    </div>
                    
                    {module.hasImages && (
                      <div className="text-xs text-blue-600 flex items-center">
                        🖼️ {module.imageCount} visual assets
                      </div>
                    )}
                    
                    {module.hasAudio && (
                      <div className="text-xs text-green-600 flex items-center">
                        🔊 Audio narration available
                      </div>
                    )}
                    
                    {module.hasSubtitles && (
                      <div className="text-xs text-purple-600 flex items-center">
                        📝 Subtitles available
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleStartModule(module)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                  >
                    Start Module
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ECGTrainingPage;


