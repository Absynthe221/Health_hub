'use client';

import React, { useState, useEffect } from 'react';

const ProgressTracker = ({ progress, moduleData, onProgressUpdate }) => {
  const [overallProgress, setOverallProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState({});

  useEffect(() => {
    if (progress) {
      setOverallProgress(progress.overallProgress || 0);
      setSectionProgress(progress.sectionProgress || {});
    }
  }, [progress]);

  const sections = [
    { id: 'overview', name: 'Overview', weight: 5 },
    { id: 'slides', name: 'Slides', weight: 20 },
    { id: 'videos', name: 'Videos', weight: 20 },
    { id: 'simulator', name: 'Simulator', weight: 15 },
    { id: 'ecg-strip', name: 'ECG Strip', weight: 15 },
    { id: 'cases', name: 'Cases', weight: 10 },
    { id: 'pretest', name: 'Pre-Test', weight: 5 },
    { id: 'posttest', name: 'Post-Test', weight: 10 }
  ];

  const calculateOverallProgress = () => {
    let totalWeight = 0;
    let weightedProgress = 0;

    sections.forEach(section => {
      const sectionProg = sectionProgress[section.id] || 0;
      weightedProgress += (sectionProg * section.weight) / 100;
      totalWeight += section.weight;
    });

    return totalWeight > 0 ? Math.round(weightedProgress / totalWeight * 100) : 0;
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const isSectionUnlocked = (sectionId) => {
    // Simple unlocking logic - can be enhanced based on requirements
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === 0) return true; // Overview is always unlocked
    
    // Unlock next section when previous is 80% complete
    const previousSection = sections[sectionIndex - 1];
    return sectionProgress[previousSection?.id] >= 80;
  };

  const isModuleComplete = () => {
    return calculateOverallProgress() >= 80;
  };

  const canTakePostTest = () => {
    const requiredSections = ['overview', 'slides', 'videos', 'simulator', 'ecg-strip', 'cases'];
    return requiredSections.every(section => sectionProgress[section] >= 80);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Module Progress</h3>
        <div className={`text-2xl font-bold ${getProgressColor(calculateOverallProgress())}`}>
          {calculateOverallProgress()}%
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(calculateOverallProgress())}`}
            style={{ width: `${calculateOverallProgress()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Section Progress */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 mb-3">Section Progress</h4>
        {sections.map((section) => {
          const sectionProg = sectionProgress[section.id] || 0;
          const isUnlocked = isSectionUnlocked(section.id);
          const isCompleted = sectionProg >= 80;
          
          return (
            <div key={section.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isUnlocked
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? '✓' : isUnlocked ? '→' : '🔒'}
                </div>
                <span className={`text-sm font-medium ${
                  isUnlocked ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {section.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${sectionProg}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-medium w-8 text-right ${
                  isUnlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {sectionProg}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-medium text-gray-900">Module Status</h5>
            <p className="text-sm text-gray-600">
              {isModuleComplete() 
                ? 'Module completed! You can now take the post-test.'
                : canTakePostTest()
                ? 'Ready for post-test!'
                : 'Continue working through the sections above.'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {Object.values(sectionProgress).filter(p => p >= 80).length} of {sections.length} sections complete
            </div>
            {isModuleComplete() && (
              <div className="text-xs text-green-600 font-medium mt-1">
                Certificate Available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prerequisites Check */}
      {moduleData?.prerequisites && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Prerequisites</h5>
          <p className="text-sm text-blue-800">{moduleData.prerequisites}</p>
        </div>
      )}

      {/* Next Steps */}
      <div className="mt-4 p-4 bg-green-50 rounded-lg">
        <h5 className="font-medium text-green-900 mb-2">Next Steps</h5>
        <ul className="text-sm text-green-800 space-y-1">
          {!isModuleComplete() && (
            <li>• Complete all sections to unlock the post-test</li>
          )}
          {canTakePostTest() && !isModuleComplete() && (
            <li>• Take the post-test to complete the module</li>
          )}
          {isModuleComplete() && (
            <li>• Download your completion certificate</li>
          )}
          <li>• Review any sections with low scores</li>
        </ul>
      </div>
    </div>
  );
};

export default ProgressTracker;





