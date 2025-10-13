'use client';

import { useState } from 'react';
import { Puzzle, Brain, Target, Award, Clock, Star } from 'lucide-react';
import ECGPuzzleGame from '../components/ECGPuzzleGame';

export default function PuzzlesPage() {
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [puzzleStats, setPuzzleStats] = useState({});

  const puzzles = [
    {
      id: 'ecg_components',
      title: 'ECG Components Puzzle',
      description: 'Learn ECG waveforms by dragging components to their correct positions',
      difficulty: 'Beginner',
      estimatedTime: '5 minutes',
      icon: '🧩',
      category: 'Anatomy',
      learningObjectives: [
        'Identify P wave, QRS complex, and T wave',
        'Understand cardiac electrical conduction',
        'Learn ECG timing and intervals'
      ]
    },
    {
      id: 'lead_placement',
      title: 'ECG Lead Placement Puzzle',
      description: 'Master proper electrode placement for accurate ECG recording',
      difficulty: 'Intermediate',
      estimatedTime: '8 minutes',
      icon: '📍',
      category: 'Technique',
      learningObjectives: [
        'Learn 12-lead ECG electrode positions',
        'Understand anatomical landmarks',
        'Practice clinical electrode placement'
      ]
    },
    {
      id: 'rhythm_identification',
      title: 'Rhythm Identification Puzzle',
      description: 'Match ECG rhythm strips to their correct diagnoses',
      difficulty: 'Advanced',
      estimatedTime: '10 minutes',
      icon: '📊',
      category: 'Diagnosis',
      learningObjectives: [
        'Recognize normal and abnormal rhythms',
        'Identify key ECG characteristics',
        'Practice clinical diagnosis skills'
      ]
    }
  ];

  const handlePuzzleComplete = ({ score, timeLeft, puzzleType }) => {
    setPuzzleStats(prev => ({
      ...prev,
      [puzzleType]: {
        score,
        timeLeft,
        completed: true,
        completedAt: new Date().toISOString()
      }
    }));
    
    // Show completion message
    alert(`🎉 Puzzle completed! Score: ${score}, Time remaining: ${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2, '0')}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Anatomy': return '🧠';
      case 'Technique': return '🛠️';
      case 'Diagnosis': return '🔍';
      default: return '📚';
    }
  };

  if (selectedPuzzle) {
    const puzzle = puzzles.find(p => p.id === selectedPuzzle);
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedPuzzle(null)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Puzzles</span>
            </button>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">{puzzle.title}</h1>
              <p className="text-gray-600">{puzzle.description}</p>
            </div>
          </div>

          {/* Puzzle Game */}
          <ECGPuzzleGame
            puzzleType={selectedPuzzle}
            onComplete={handlePuzzleComplete}
            className="mb-6"
          />

          {/* Learning Objectives */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Learning Objectives
            </h3>
            <ul className="space-y-2">
              {puzzle.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Puzzle className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">ECG Learning Puzzles</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master ECG interpretation through interactive puzzle games. Drag, drop, and learn!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Puzzles Completed</h3>
            <p className="text-3xl font-bold text-blue-600">
              {Object.values(puzzleStats).filter(stat => stat.completed).length}
            </p>
            <p className="text-gray-600">of {puzzles.length} puzzles</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Score</h3>
            <p className="text-3xl font-bold text-green-600">
              {Object.values(puzzleStats).reduce((total, stat) => total + (stat.score || 0), 0)}
            </p>
            <p className="text-gray-600">points earned</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Time</h3>
            <p className="text-3xl font-bold text-purple-600">
              {Object.values(puzzleStats).length > 0 
                ? Math.round(Object.values(puzzleStats).reduce((total, stat) => total + (stat.timeLeft || 0), 0) / Object.values(puzzleStats).length / 60)
                : 0
              }m
            </p>
            <p className="text-gray-600">time remaining</p>
          </div>
        </div>

        {/* Puzzle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {puzzles.map((puzzle) => {
            const stats = puzzleStats[puzzle.id];
            const isCompleted = stats?.completed;
            
            return (
              <div
                key={puzzle.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  isCompleted ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {/* Puzzle Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{puzzle.icon}</div>
                    {isCompleted && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Award className="w-5 h-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{puzzle.title}</h3>
                  <p className="text-gray-600 mb-4">{puzzle.description}</p>

                  {/* Difficulty and Time */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(puzzle.difficulty)}`}>
                      {puzzle.difficulty}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {puzzle.estimatedTime}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center mb-4">
                    <span className="text-lg mr-2">{getCategoryIcon(puzzle.category)}</span>
                    <span className="text-sm text-gray-600">{puzzle.category}</span>
                  </div>

                  {/* Stats */}
                  {isCompleted && (
                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Score:</span>
                        <span className="font-semibold text-green-800">{stats.score}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Time Left:</span>
                        <span className="font-semibold text-green-800">
                          {Math.floor(stats.timeLeft/60)}:{(stats.timeLeft%60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Learning Objectives Preview */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">You'll Learn:</h4>
                    <ul className="space-y-1">
                      {puzzle.learningObjectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="text-green-500 mr-1">•</span>
                          {objective}
                        </li>
                      ))}
                      {puzzle.learningObjectives.length > 2 && (
                        <li className="text-xs text-gray-500">
                          +{puzzle.learningObjectives.length - 2} more objectives
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedPuzzle(puzzle.id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isCompleted
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isCompleted ? 'Play Again' : 'Start Puzzle'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Learning Tips */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
            <Brain className="w-6 h-6 mr-2" />
            Puzzle Learning Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">🧩 How to Play</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Drag items from the bottom to the correct drop zones</li>
                <li>• Green zones indicate correct placement</li>
                <li>• Red zones show incorrect placement</li>
                <li>• Use hints when you're stuck</li>
                <li>• Complete all items to finish the puzzle</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">🎯 Learning Strategy</h3>
              <ul className="text-blue-700 space-y-1 text-sm">
                <li>• Start with beginner puzzles to build confidence</li>
                <li>• Read the learning objectives before playing</li>
                <li>• Take your time to understand each component</li>
                <li>• Use hints to learn, not just to complete</li>
                <li>• Practice regularly to reinforce learning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

