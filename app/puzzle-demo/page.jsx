'use client';

import { useState } from 'react';
import { Puzzle, Play, ArrowRight } from 'lucide-react';
import ECGPuzzleGame from '../components/ECGPuzzleGame';

export default function PuzzleDemo() {
  const [selectedPuzzle, setSelectedPuzzle] = useState('ecg_components');

  const puzzles = [
    {
      id: 'ecg_components',
      title: 'ECG Components Puzzle',
      description: 'Drag ECG waveforms to their correct positions',
      icon: '🧩',
      difficulty: 'Beginner'
    },
    {
      id: 'lead_placement',
      title: 'ECG Lead Placement Puzzle', 
      description: 'Position ECG electrodes on the patient',
      icon: '📍',
      difficulty: 'Intermediate'
    },
    {
      id: 'rhythm_identification',
      title: 'Rhythm Identification Puzzle',
      description: 'Match ECG rhythms to their diagnoses',
      icon: '📊',
      difficulty: 'Advanced'
    }
  ];

  const handlePuzzleComplete = (result) => {
    alert(`🎉 Puzzle completed! Score: ${result.score}, Time: ${Math.floor(result.timeLeft/60)}:${(result.timeLeft%60).toString().padStart(2, '0')}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Puzzle className="w-12 h-12 text-purple-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">ECG Puzzle Games Demo</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive puzzle games make learning ECG diagrams fun and engaging. Drag, drop, and master ECG concepts!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Puzzle Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Puzzles</h3>
              <div className="space-y-3">
                {puzzles.map((puzzle) => (
                  <button
                    key={puzzle.id}
                    onClick={() => setSelectedPuzzle(puzzle.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedPuzzle === puzzle.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{puzzle.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{puzzle.title}</h4>
                        <p className="text-sm text-gray-600">{puzzle.description}</p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                          puzzle.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          puzzle.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {puzzle.difficulty}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">How to Play:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Drag items to drop zones</li>
                  <li>• Green = correct placement</li>
                  <li>• Red = incorrect placement</li>
                  <li>• Use hints if needed</li>
                  <li>• Complete all items to win!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Puzzle Game */}
          <div className="lg:col-span-3">
            <ECGPuzzleGame
              puzzleType={selectedPuzzle}
              onComplete={handlePuzzleComplete}
              className="mb-8"
            />

            {/* Learning Benefits */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Play className="w-6 h-6 mr-2 text-green-600" />
                Why Puzzle Games Work for Learning
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🧠 Active Learning</h4>
                  <p className="text-gray-600 text-sm">
                    Instead of passive reading, students actively engage with ECG concepts through 
                    hands-on manipulation and problem-solving.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Immediate Feedback</h4>
                  <p className="text-gray-600 text-sm">
                    Instant visual feedback helps students understand correct vs incorrect 
                    placements and reinforces learning through trial and error.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🎮 Gamification</h4>
                  <p className="text-gray-600 text-sm">
                    Scoring, timers, and achievement systems make learning fun and motivate 
                    students to improve their performance.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🔄 Repetition & Practice</h4>
                  <p className="text-gray-600 text-sm">
                    Students can replay puzzles multiple times to reinforce muscle memory 
                    and improve their ECG interpretation skills.
                  </p>
                </div>
              </div>
            </div>

            {/* Integration Info */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <ArrowRight className="w-5 h-5 mr-2 text-purple-600" />
                Integrated into Learning Modules
              </h3>
              <p className="text-gray-700 mb-4">
                These puzzle games are seamlessly integrated into our ECG learning modules. 
                Students encounter them as interactive slides within their course progression.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Module 1: Introduction to ECG
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Module 7: ECG Lead System
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Module 4: Atrial Arrhythmias
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  And more...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

