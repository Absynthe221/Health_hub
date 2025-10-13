'use client';

import { useState, useEffect, useRef } from 'react';
import { RotateCcw, CheckCircle, AlertCircle, Target, Trophy } from 'lucide-react';

export default function ECGPuzzleGame({ 
  puzzleType = 'ecg_components', 
  difficulty = 'beginner',
  onComplete = () => {},
  className = '' 
}) {
  const [puzzleData, setPuzzleData] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZones, setDropZones] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameState, setGameState] = useState('playing'); // playing, completed, failed
  const [hints, setHints] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const dropZoneRefs = useRef({});

  useEffect(() => {
    initializePuzzle();
  }, [puzzleType, difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && gameState === 'playing') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('failed');
    }
  }, [timeLeft, gameState]);

  const initializePuzzle = () => {
    const puzzles = {
      ecg_components: {
        title: "ECG Components Puzzle",
        description: "Drag the ECG components to their correct positions on the diagram",
        items: [
          { id: 'p_wave', label: 'P Wave', correctZone: 'atrial_depolarization', image: '/assets/ecg-media/waveforms/p-wave.svg' },
          { id: 'qrs_complex', label: 'QRS Complex', correctZone: 'ventricular_depolarization', image: '/assets/ecg-media/waveforms/qrs-complex.svg' },
          { id: 't_wave', label: 'T Wave', correctZone: 'ventricular_repolarization', image: '/assets/ecg-media/waveforms/t-wave.svg' },
          { id: 'pr_interval', label: 'PR Interval', correctZone: 'av_conduction', image: '/assets/ecg-media/waveforms/pr-interval.svg' },
          { id: 'st_segment', label: 'ST Segment', correctZone: 'ventricular_plateau', image: '/assets/ecg-media/waveforms/st-segment.svg' }
        ],
        dropZones: [
          { id: 'atrial_depolarization', label: 'Atrial Depolarization', x: 100, y: 50, width: 120, height: 60 },
          { id: 'av_conduction', label: 'AV Conduction', x: 220, y: 80, width: 80, height: 40 },
          { id: 'ventricular_depolarization', label: 'Ventricular Depolarization', x: 300, y: 50, width: 150, height: 80 },
          { id: 'ventricular_plateau', label: 'Ventricular Plateau', x: 450, y: 80, width: 100, height: 40 },
          { id: 'ventricular_repolarization', label: 'Ventricular Repolarization', x: 550, y: 50, width: 120, height: 60 }
        ],
        backgroundImage: '/assets/ecg-media/diagrams/ecg-grid.svg',
        hints: [
          "The P wave represents atrial depolarization",
          "QRS complex shows ventricular depolarization",
          "T wave indicates ventricular repolarization",
          "PR interval measures AV conduction time",
          "ST segment represents the plateau phase"
        ]
      },
      lead_placement: {
        title: "ECG Lead Placement Puzzle",
        description: "Position the ECG electrodes correctly on the patient diagram",
        items: [
          { id: 'ra', label: 'RA (Right Arm)', correctZone: 'right_arm', image: '/assets/ecg-media/electrodes/ra.svg' },
          { id: 'la', label: 'LA (Left Arm)', correctZone: 'left_arm', image: '/assets/ecg-media/electrodes/la.svg' },
          { id: 'rl', label: 'RL (Right Leg)', correctZone: 'right_leg', image: '/assets/ecg-media/electrodes/rl.svg' },
          { id: 'll', label: 'LL (Left Leg)', correctZone: 'left_leg', image: '/assets/ecg-media/electrodes/ll.svg' },
          { id: 'v1', label: 'V1', correctZone: 'v1_position', image: '/assets/ecg-media/electrodes/v1.svg' },
          { id: 'v2', label: 'V2', correctZone: 'v2_position', image: '/assets/ecg-media/electrodes/v2.svg' },
          { id: 'v3', label: 'V3', correctZone: 'v3_position', image: '/assets/ecg-media/electrodes/v3.svg' },
          { id: 'v4', label: 'V4', correctZone: 'v4_position', image: '/assets/ecg-media/electrodes/v4.svg' },
          { id: 'v5', label: 'V5', correctZone: 'v5_position', image: '/assets/ecg-media/electrodes/v5.svg' },
          { id: 'v6', label: 'V6', correctZone: 'v6_position', image: '/assets/ecg-media/electrodes/v6.svg' }
        ],
        dropZones: [
          { id: 'right_arm', label: 'Right Arm', x: 50, y: 100, width: 60, height: 40 },
          { id: 'left_arm', label: 'Left Arm', x: 200, y: 100, width: 60, height: 40 },
          { id: 'right_leg', label: 'Right Leg', x: 50, y: 300, width: 60, height: 40 },
          { id: 'left_leg', label: 'Left Leg', x: 200, y: 300, width: 60, height: 40 },
          { id: 'v1_position', label: 'V1', x: 125, y: 180, width: 30, height: 30 },
          { id: 'v2_position', label: 'V2', x: 125, y: 200, width: 30, height: 30 },
          { id: 'v3_position', label: 'V3', x: 125, y: 220, width: 30, height: 30 },
          { id: 'v4_position', label: 'V4', x: 125, y: 240, width: 30, height: 30 },
          { id: 'v5_position', label: 'V5', x: 150, y: 250, width: 30, height: 30 },
          { id: 'v6_position', label: 'V6', x: 175, y: 250, width: 30, height: 30 }
        ],
        backgroundImage: '/assets/ecg-media/diagrams/patient-outline.svg',
        hints: [
          "RA and LA go on the arms",
          "RL and LL go on the legs",
          "V1-V4 are positioned on the chest",
          "V5-V6 are on the left lateral chest",
          "V1 is right sternal border, 4th intercostal space"
        ]
      },
      rhythm_identification: {
        title: "ECG Rhythm Identification Puzzle",
        description: "Match the ECG rhythm strips to their correct diagnoses",
        items: [
          { id: 'normal_sinus', label: 'Normal Sinus Rhythm', correctZone: 'normal_rhythm', image: '/assets/ecg-media/rhythms/normal-sinus.svg' },
          { id: 'atrial_fib', label: 'Atrial Fibrillation', correctZone: 'afib_rhythm', image: '/assets/ecg-media/rhythms/atrial-fib.svg' },
          { id: 'ventricular_tachy', label: 'Ventricular Tachycardia', correctZone: 'vtach_rhythm', image: '/assets/ecg-media/rhythms/ventricular-tachy.svg' },
          { id: 'heart_block', label: 'Heart Block', correctZone: 'block_rhythm', image: '/assets/ecg-media/rhythms/heart-block.svg' }
        ],
        dropZones: [
          { id: 'normal_rhythm', label: 'Normal Sinus Rhythm', x: 100, y: 50, width: 150, height: 80 },
          { id: 'afib_rhythm', label: 'Atrial Fibrillation', x: 100, y: 150, width: 150, height: 80 },
          { id: 'vtach_rhythm', label: 'Ventricular Tachycardia', x: 100, y: 250, width: 150, height: 80 },
          { id: 'block_rhythm', label: 'Heart Block', x: 100, y: 350, width: 150, height: 80 }
        ],
        backgroundImage: '/assets/ecg-media/diagrams/rhythm-grid.svg',
        hints: [
          "Normal sinus rhythm has regular P waves",
          "Atrial fibrillation has irregular rhythm",
          "Ventricular tachycardia has wide QRS complexes",
          "Heart block shows PR interval prolongation"
        ]
      }
    };

    const puzzle = puzzles[puzzleType] || puzzles.ecg_components;
    setPuzzleData(puzzle);
    setDropZones(puzzle.dropZones.map(zone => ({ ...zone, filled: false, correctItem: null })));
    setHints(puzzle.hints);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const zone = dropZones.find(z => z.id === zoneId);
    if (!zone || zone.filled) return;

    const isCorrect = draggedItem.correctZone === zoneId;
    
    setDropZones(prev => prev.map(z => 
      z.id === zoneId 
        ? { ...z, filled: true, correctItem: draggedItem, isCorrect }
        : z
    ));

    if (isCorrect) {
      setScore(prev => prev + 10);
      
      // Check if puzzle is complete
      const allCorrect = puzzleData.items.every(item => 
        dropZones.some(zone => zone.correctItem?.id === item.id && zone.isCorrect)
      );
      
      if (allCorrect) {
        setGameState('completed');
        onComplete({ score, timeLeft, puzzleType });
      }
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }

    setDraggedItem(null);
  };

  const resetPuzzle = () => {
    setScore(0);
    setTimeLeft(300);
    setGameState('playing');
    setDropZones(puzzleData.dropZones.map(zone => ({ ...zone, filled: false, correctItem: null })));
    setShowHint(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!puzzleData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-900 mb-2">Puzzle Complete! 🎉</h3>
        <p className="text-green-700 mb-4">
          Great job! You scored <strong>{score}</strong> points with <strong>{formatTime(timeLeft)}</strong> remaining.
        </p>
        <button
          onClick={resetPuzzle}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (gameState === 'failed') {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-red-900 mb-2">Time's Up!</h3>
        <p className="text-red-700 mb-4">
          Don't worry! ECG interpretation takes practice. You scored <strong>{score}</strong> points.
        </p>
        <button
          onClick={resetPuzzle}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{puzzleData.title}</h3>
          <p className="text-gray-600">{puzzleData.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</div>
            <div className="text-xs text-gray-500">Time</div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative bg-gray-50 rounded-lg p-4 mb-6" style={{ minHeight: '400px' }}>
        {/* Background Image */}
        {puzzleData.backgroundImage && (
          <div 
            className="absolute inset-4 bg-contain bg-no-repeat bg-center opacity-30"
            style={{ backgroundImage: `url(${puzzleData.backgroundImage})` }}
          />
        )}

        {/* Drop Zones */}
        {dropZones.map((zone) => (
          <div
            key={zone.id}
            ref={el => dropZoneRefs.current[zone.id] = el}
            className={`absolute border-2 border-dashed rounded-lg p-2 transition-all ${
              zone.filled 
                ? zone.isCorrect 
                  ? 'border-green-500 bg-green-100' 
                  : 'border-red-500 bg-red-100'
                : 'border-gray-300 hover:border-blue-400'
            }`}
            style={{
              left: zone.x,
              top: zone.y,
              width: zone.width,
              height: zone.height
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, zone.id)}
          >
            {zone.filled ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-xs font-medium text-center">{zone.correctItem.label}</div>
                {zone.isCorrect ? (
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 mt-1" />
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-center">{zone.label}</div>
            )}
          </div>
        ))}
      </div>

      {/* Draggable Items */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {puzzleData.items.map((item) => {
          const isUsed = dropZones.some(zone => zone.correctItem?.id === item.id);
          
          return (
            <div
              key={item.id}
              className={`p-4 border-2 rounded-lg cursor-move transition-all ${
                isUsed 
                  ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed' 
                  : 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
              }`}
              draggable={!isUsed}
              onDragStart={(e) => !isUsed && handleDragStart(e, item)}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-white rounded border flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.label} className="w-8 h-8" />
                  ) : (
                    <Target className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="text-sm font-medium text-gray-700">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={resetPuzzle}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        <button
          onClick={() => setShowHint(!showHint)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showHint ? 'Hide' : 'Show'} Hint
        </button>
      </div>

      {/* Hints */}
      {showHint && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Hints:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {hints.map((hint, index) => (
              <li key={index}>• {hint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

