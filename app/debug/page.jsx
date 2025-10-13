'use client';

import React, { useState, useEffect } from 'react';

const DebugPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const loadModules = async () => {
      try {
        setDebugInfo('Starting fetch request...');
        const response = await fetch('/api/ecg/modules');
        setDebugInfo(`Response status: ${response.status}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        setDebugInfo('Parsing JSON...');
        const data = await response.json();
        setDebugInfo(`Received ${data.length} modules`);
        setModules(data);
      } catch (err) {
        console.error('Error loading modules:', err);
        setError(err.message);
        setDebugInfo(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Debug ECG Modules</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {debugInfo || 'No debug info yet...'}
          </pre>
        </div>

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ECG Training Modules...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Modules Found: {modules.length}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Duration: {module.duration} min</p>
                    <p>Difficulty: {module.difficulty}</p>
                    <p>Slides: {module.numSlides}</p>
                    <p>Questions: {module.questionCount}</p>
                    <p>Images: {module.imageCount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPage;




