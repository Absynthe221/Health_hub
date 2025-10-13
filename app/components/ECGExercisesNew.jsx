'use client';

import { useState, useEffect } from 'react';

export default function ECGExercisesNew() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchExercises();
  }, [selectedDifficulty, selectedCategory]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ecg/exercises');
      const data = await response.json();
      
      if (response.ok) {
        setExercises(data.exercises || []);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'rhythm_analysis': return '💓';
      case 'arrhythmia_detection': return '⚡';
      case 'life_threatening_rhythms': return '🚨';
      case 'conduction_abnormalities': return '🔄';
      case 'ischemia_infarction': return '🫀';
      case 'ectopic_beats': return '📊';
      default: return '📈';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ECG Interpretation Exercises</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="rhythm_analysis">Rhythm Analysis</option>
              <option value="arrhythmia_detection">Arrhythmia Detection</option>
              <option value="life_threatening_rhythms">Life-Threatening Rhythms</option>
              <option value="conduction_abnormalities">Conduction Abnormalities</option>
              <option value="ischemia_infarction">Ischemia & Infarction</option>
              <option value="ectopic_beats">Ectopic Beats</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getCategoryIcon(exercise.category)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{exercise.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {exercise.category.replace('_', ' ')} • {exercise.estimatedTime}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-medium text-gray-900">Learning Objectives:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {exercise.learningObjectives.slice(0, 2).map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-1">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
                {exercise.learningObjectives.length > 2 && (
                  <li className="text-gray-500">+{exercise.learningObjectives.length - 2} more...</li>
                )}
              </ul>
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Start Exercise
            </button>
          </div>
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No exercises found for the selected filters.</p>
        </div>
      )}
    </div>
  );
}
