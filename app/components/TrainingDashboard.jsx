'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrainingDashboard() {
  const [trainingData, setTrainingData] = useState(null);
  const [filteredModules, setFilteredModules] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainingData();
  }, [selectedRole, selectedType]);

  const fetchTrainingData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedRole !== 'all') params.append('role', selectedRole);
      if (selectedType !== 'all') params.append('type', selectedType);
      
      const response = await fetch(`/api/training?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTrainingData(data);
        setFilteredModules(data.trainingProgram.modules);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load training data');
      console.error('Error fetching training data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentTypeColor = (type) => {
    switch (type) {
      case 'quiz': return 'bg-blue-100 text-blue-800';
      case 'practical': return 'bg-green-100 text-green-800';
      case 'scenario': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPassMarkColor = (passMark) => {
    if (typeof passMark === 'number') {
      if (passMark >= 85) return 'text-red-600 font-semibold';
      if (passMark >= 80) return 'text-orange-600 font-semibold';
      return 'text-green-600 font-semibold';
    }
    return 'text-blue-600 font-semibold';
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading training program...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {trainingData?.trainingProgram?.title}
        </h1>
        <p className="text-gray-600 mb-4">
          {trainingData?.trainingProgram?.description}
        </p>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {trainingData?.stats?.totalModules}
            </div>
            <div className="text-sm text-blue-800">Total Modules</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {trainingData?.stats?.moduleTypes?.quiz}
            </div>
            <div className="text-sm text-green-800">Quiz Modules</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {trainingData?.stats?.moduleTypes?.practical}
            </div>
            <div className="text-sm text-purple-800">Practical Modules</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {trainingData?.stats?.mandatoryModules}
            </div>
            <div className="text-sm text-orange-800">Mandatory Modules</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Filter Training Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="childcare">Childcare</option>
              <option value="food-prep">Food Preparation</option>
              <option value="medication">Medication</option>
              <option value="dementia">Dementia Care</option>
              <option value="learning-disability">Learning Disability</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="practical">Practical</option>
              <option value="scenario">Scenario</option>
            </select>
          </div>
        </div>
      </div>

      {/* Training Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {module.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAssessmentTypeColor(module.assessment.type)}`}>
                  {module.assessment.type}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {module.description}
              </p>

              {/* Assessment Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Assessment:</span>
                  <span className="font-medium">
                    {module.assessment.type === 'quiz' && `${module.assessment.questions} questions`}
                    {module.assessment.type === 'practical' && 'Practical assessment'}
                    {module.assessment.type === 'scenario' && `${module.assessment.cases} case studies`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pass Mark:</span>
                  <span className={`font-medium ${getPassMarkColor(module.assessment.passMark)}`}>
                    {typeof module.assessment.passMark === 'number' 
                      ? `${module.assessment.passMark}%`
                      : module.assessment.passMark
                    }
                  </span>
                </div>
              </div>

              {/* Progress Bar (Mock) */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-gray-700">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-300 h-2 rounded-full w-0"></div>
                </div>
              </div>

              {/* Roles */}
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Applicable Roles:</div>
                <div className="flex flex-wrap gap-1">
                  {module.roles.map((role) => (
                    <span key={role} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {role === 'all' ? 'All Staff' : role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                Start Training
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">No training modules found for the selected filters.</div>
        </div>
      )}
    </div>
  );
}
