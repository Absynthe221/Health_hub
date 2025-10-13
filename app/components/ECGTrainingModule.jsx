'use client';

import React, { useState, useEffect } from 'react';
import PDFViewer from './ECGModuleComponents/PDFViewer';
import VideoPlayer from './ECGModuleComponents/VideoPlayer';
import QuestionEngine from './ECGModuleComponents/QuestionEngine';
import ElectrodeSimulator from './ECGModuleComponents/ElectrodeSimulator';
import ECGStripActivity from './ECGModuleComponents/ECGStripActivity';
import CaseScenarios from './ECGModuleComponents/CaseScenarios';
import ProgressTracker from './ECGModuleComponents/ProgressTracker';

const ECGTrainingModule = ({ moduleId, userId }) => {
  const [currentSection, setCurrentSection] = useState('overview');
  const [moduleData, setModuleData] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModuleData();
    loadUserProgress();
  }, [moduleId, userId]);

  const loadModuleData = async () => {
    try {
      const response = await fetch(`/api/ecg/modules/${moduleId}`);
      const data = await response.json();
      setModuleData(data);
    } catch (error) {
      console.error('Error loading module data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const response = await fetch(`/api/ecg/progress/${userId}/${moduleId}`);
      const data = await response.json();
      setUserProgress(data);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const updateProgress = async (section, progress) => {
    try {
      await fetch(`/api/ecg/progress/${userId}/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, progress })
      });
      loadUserProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const sections = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'slides', name: 'Slides', icon: '📄' },
    { id: 'videos', name: 'Videos', icon: '🎥' },
    { id: 'simulator', name: 'Electrode Simulator', icon: '🔌' },
    { id: 'ecg-strip', name: 'ECG Strip Activity', icon: '📊' },
    { id: 'cases', name: 'Case Scenarios', icon: '🏥' },
    { id: 'pretest', name: 'Pre-Test', icon: '📝' },
    { id: 'posttest', name: 'Post-Test', icon: '✅' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Not Found</h2>
        <p className="text-gray-600">The requested module could not be loaded.</p>
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
              <h1 className="text-2xl font-bold text-gray-900">{moduleData.title}</h1>
              <p className="text-sm text-gray-600">{moduleData.description}</p>
            </div>
            <ProgressTracker 
              progress={userProgress} 
              moduleData={moduleData}
              onProgressUpdate={updateProgress}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  currentSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentSection === 'overview' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Module Overview</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">{moduleData.overview}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Learning Objectives</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {moduleData.objectives?.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Module Details</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Duration:</strong> {moduleData.duration} minutes</p>
                    <p><strong>Difficulty:</strong> {moduleData.difficulty}</p>
                    <p><strong>Prerequisites:</strong> {moduleData.prerequisites || 'None'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentSection === 'slides' && moduleData.slides && (
          <PDFViewer 
            files={moduleData.slides}
            onProgressUpdate={(progress) => updateProgress('slides', progress)}
          />
        )}

        {currentSection === 'videos' && moduleData.videos && (
          <VideoPlayer 
            videos={moduleData.videos}
            onProgressUpdate={(progress) => updateProgress('videos', progress)}
          />
        )}

        {currentSection === 'simulator' && (
          <ElectrodeSimulator 
            moduleId={moduleId}
            onProgressUpdate={(progress) => updateProgress('simulator', progress)}
          />
        )}

        {currentSection === 'ecg-strip' && (
          <ECGStripActivity 
            moduleId={moduleId}
            onProgressUpdate={(progress) => updateProgress('ecg-strip', progress)}
          />
        )}

        {currentSection === 'cases' && moduleData.cases && (
          <CaseScenarios 
            cases={moduleData.cases}
            onProgressUpdate={(progress) => updateProgress('cases', progress)}
          />
        )}

        {currentSection === 'pretest' && moduleData.pretest && (
          <QuestionEngine 
            questions={moduleData.pretest}
            type="pretest"
            moduleId={moduleId}
            userId={userId}
            onProgressUpdate={(progress) => updateProgress('pretest', progress)}
          />
        )}

        {currentSection === 'posttest' && moduleData.posttest && (
          <QuestionEngine 
            questions={moduleData.posttest}
            type="posttest"
            moduleId={moduleId}
            userId={userId}
            onProgressUpdate={(progress) => updateProgress('posttest', progress)}
          />
        )}
      </div>
    </div>
  );
};

export default ECGTrainingModule;





