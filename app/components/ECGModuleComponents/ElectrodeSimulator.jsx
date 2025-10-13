'use client';

import React, { useState, useEffect, useRef } from 'react';

const ElectrodeSimulator = ({ moduleId, onProgressUpdate }) => {
  const [draggedElectrode, setDraggedElectrode] = useState(null);
  const [electrodePositions, setElectrodePositions] = useState({});
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const canvasRef = useRef(null);

  // Correct electrode positions (normalized coordinates)
  const correctPositions = {
    RA: { x: 0.15, y: 0.3 }, // Right arm
    LA: { x: 0.85, y: 0.3 }, // Left arm
    LL: { x: 0.5, y: 0.9 },  // Left leg
    RL: { x: 0.15, y: 0.9 }, // Right leg
    V1: { x: 0.2, y: 0.5 },  // V1
    V2: { x: 0.3, y: 0.5 },  // V2
    V3: { x: 0.4, y: 0.5 },  // V3
    V4: { x: 0.5, y: 0.5 },  // V4
    V5: { x: 0.6, y: 0.5 },  // V5
    V6: { x: 0.7, y: 0.5 }   // V6
  };

  const electrodes = [
    { id: 'RA', name: 'Right Arm', color: 'bg-red-500' },
    { id: 'LA', name: 'Left Arm', color: 'bg-blue-500' },
    { id: 'LL', name: 'Left Leg', color: 'bg-green-500' },
    { id: 'RL', name: 'Right Leg', color: 'bg-yellow-500' },
    { id: 'V1', name: 'V1', color: 'bg-purple-500' },
    { id: 'V2', name: 'V2', color: 'bg-pink-500' },
    { id: 'V3', name: 'V3', color: 'bg-indigo-500' },
    { id: 'V4', name: 'V4', color: 'bg-orange-500' },
    { id: 'V5', name: 'V5', color: 'bg-teal-500' },
    { id: 'V6', name: 'V6', color: 'bg-cyan-500' }
  ];

  useEffect(() => {
    drawBody();
  }, [electrodePositions]);

  const drawBody = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw body outline
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Head
    ctx.arc(canvas.width * 0.5, canvas.height * 0.15, canvas.width * 0.08, 0, 2 * Math.PI);
    
    // Torso
    ctx.rect(canvas.width * 0.2, canvas.height * 0.25, canvas.width * 0.6, canvas.height * 0.5);
    
    // Arms
    ctx.rect(canvas.width * 0.1, canvas.height * 0.3, canvas.width * 0.15, canvas.height * 0.3);
    ctx.rect(canvas.width * 0.75, canvas.height * 0.3, canvas.width * 0.15, canvas.height * 0.3);
    
    // Legs
    ctx.rect(canvas.width * 0.3, canvas.height * 0.75, canvas.width * 0.15, canvas.height * 0.2);
    ctx.rect(canvas.width * 0.55, canvas.height * 0.75, canvas.width * 0.15, canvas.height * 0.2);
    
    ctx.stroke();

    // Draw placed electrodes
    Object.entries(electrodePositions).forEach(([electrodeId, position]) => {
      const electrode = electrodes.find(e => e.id === electrodeId);
      if (electrode && position) {
        const x = position.x * canvas.width;
        const y = position.y * canvas.height;
        
        // Draw electrode circle
        ctx.fillStyle = electrode.color.replace('bg-', '#').replace('-500', '');
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw electrode label
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(electrodeId, x, y + 3);
      }
    });
  };

  const handleMouseDown = (e, electrodeId) => {
    setDraggedElectrode(electrodeId);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!draggedElectrode) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setElectrodePositions(prev => ({
      ...prev,
      [draggedElectrode]: { x, y }
    }));
  };

  const handleMouseUp = () => {
    setDraggedElectrode(null);
  };

  const checkPlacement = () => {
    let correctCount = 0;
    const tolerance = 0.08; // 8% tolerance for placement accuracy

    Object.entries(correctPositions).forEach(([electrodeId, correctPos]) => {
      const placedPos = electrodePositions[electrodeId];
      if (placedPos) {
        const distance = Math.sqrt(
          Math.pow(placedPos.x - correctPos.x, 2) + 
          Math.pow(placedPos.y - correctPos.y, 2)
        );
        if (distance <= tolerance) {
          correctCount++;
        }
      }
    });

    const accuracy = (correctCount / Object.keys(correctPositions).length) * 100;
    const isCorrectPlacement = accuracy >= 80; // 80% accuracy threshold
    
    setIsCorrect(isCorrectPlacement);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    if (isCorrectPlacement) {
      setIsCompleted(true);
      onProgressUpdate(100);
    }
  };

  const resetSimulator = () => {
    setElectrodePositions({});
    setIsCorrect(false);
    setShowFeedback(false);
    setAttempts(0);
    setIsCompleted(false);
  };

  const getFeedbackMessage = () => {
    if (isCorrect) {
      return {
        message: 'Excellent! All electrodes are placed correctly.',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else {
      return {
        message: `Good attempt! You placed ${Object.keys(electrodePositions).length} electrodes. Try to place all 10 electrodes in their correct positions.`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">ECG Electrode Placement Simulator</h3>
            <p className="text-sm text-gray-600">
              Drag and drop electrodes to their correct positions on the body
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={checkPlacement}
              disabled={Object.keys(electrodePositions).length === 0}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Placement
            </button>
            <button
              onClick={resetSimulator}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Electrode Palette */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-gray-900 mb-4">Electrodes</h4>
            <div className="space-y-2">
              {electrodes.map((electrode) => (
                <div
                  key={electrode.id}
                  draggable
                  onMouseDown={(e) => handleMouseDown(e, electrode.id)}
                  className={`flex items-center p-3 border rounded-lg cursor-move hover:shadow-md transition-shadow ${
                    electrodePositions[electrode.id] 
                      ? 'opacity-50' 
                      : 'opacity-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${electrode.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {electrode.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Body Canvas */}
          <div className="lg:col-span-3">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-4 text-center">Human Body Diagram</h4>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={600}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="border rounded-lg bg-white cursor-crosshair"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Drag electrodes from the left panel to the body diagram</li>
            <li>• Place each electrode in its anatomically correct position</li>
            <li>• Use the "Check Placement" button to verify your work</li>
            <li>• You need 80% accuracy to complete this activity</li>
          </ul>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-lg border ${getFeedbackMessage().bgColor} ${getFeedbackMessage().borderColor}`}>
            <div className={`font-medium ${getFeedbackMessage().color}`}>
              {getFeedbackMessage().message}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Attempts: {attempts} | Placed: {Object.keys(electrodePositions).length}/10 electrodes
            </div>
          </div>
        )}

        {/* Completion Message */}
        {isCompleted && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">🎉 Congratulations!</div>
              <p className="text-green-800 mb-4">
                You have successfully completed the electrode placement simulator!
              </p>
              <button
                onClick={resetSimulator}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectrodeSimulator;





