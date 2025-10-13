'use client';

import React, { useState } from 'react';

const SimpleECGTraining = () => {
  const [currentModule, setCurrentModule] = useState(null);

  const modules = [
    {
      id: '1',
      title: 'ECG Fundamentals',
      description: 'Learn the basics of electrocardiography',
      duration: 120,
      difficulty: 'Beginner'
    },
    {
      id: '2', 
      title: 'Cardiac Rhythm Recognition',
      description: 'Identify and interpret various cardiac rhythms',
      duration: 90,
      difficulty: 'Intermediate'
    }
  ];

  if (currentModule) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setCurrentModule(null)}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Back to Modules
          </button>
          
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold mb-4">{currentModule.title}</h1>
            <p className="text-gray-600 mb-6">{currentModule.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">📄 Slides</h3>
                <p className="text-gray-600">PDF presentations will be loaded here</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">🎥 Videos</h3>
                <p className="text-gray-600">Video content will be loaded here</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">🔌 Simulator</h3>
                <p className="text-gray-600">Electrode placement simulator will be here</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">📊 ECG Activity</h3>
                <p className="text-gray-600">ECG strip interpretation activity will be here</p>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => setCurrentModule(module)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
              <p className="text-gray-600 mb-4">{module.description}</p>
              
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Duration: {module.duration} min</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {module.difficulty}
                </span>
              </div>
              
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Start Module
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">🚀 Server Status: Running!</h2>
          <p className="text-gray-600">
            The ECG Training Module system is now operational. 
            Click on a module above to explore the interactive learning features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleECGTraining;



