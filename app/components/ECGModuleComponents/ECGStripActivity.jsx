'use client';

import React, { useState, useEffect, useRef } from 'react';

const ECGStripActivity = ({ moduleId, onProgressUpdate }) => {
  const [currentStrip, setCurrentStrip] = useState(0);
  const [userLabels, setUserLabels] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const canvasRef = useRef(null);

  // Sample ECG strips with correct labels
  const ecgStrips = [
    {
      id: 1,
      title: 'Normal Sinus Rhythm',
      image: '/api/placeholder/600/200', // Placeholder for actual ECG image
      correctLabels: {
        'P-wave': { x: 0.2, y: 0.3 },
        'QRS-complex': { x: 0.5, y: 0.5 },
        'T-wave': { x: 0.7, y: 0.4 },
        'PR-interval': { x: 0.2, y: 0.6 },
        'QT-interval': { x: 0.2, y: 0.8 }
      },
      description: 'Identify the key components of a normal ECG strip'
    },
    {
      id: 2,
      title: 'Atrial Fibrillation',
      image: '/api/placeholder/600/200',
      correctLabels: {
        'Irregular-RR': { x: 0.3, y: 0.2 },
        'No-P-wave': { x: 0.2, y: 0.3 },
        'Fibrillatory-waves': { x: 0.4, y: 0.3 },
        'QRS-complex': { x: 0.5, y: 0.5 }
      },
      description: 'Identify the characteristics of atrial fibrillation'
    },
    {
      id: 3,
      title: 'Ventricular Tachycardia',
      image: '/api/placeholder/600/200',
      correctLabels: {
        'Wide-QRS': { x: 0.4, y: 0.5 },
        'No-P-wave': { x: 0.2, y: 0.3 },
        'Regular-rhythm': { x: 0.6, y: 0.2 },
        'Rate-150-250': { x: 0.7, y: 0.8 }
      },
      description: 'Identify the features of ventricular tachycardia'
    }
  ];

  const labelOptions = [
    'P-wave', 'QRS-complex', 'T-wave', 'PR-interval', 'QT-interval',
    'Irregular-RR', 'No-P-wave', 'Fibrillatory-waves', 'Wide-QRS',
    'Regular-rhythm', 'Rate-150-250', 'ST-elevation', 'ST-depression'
  ];

  const [selectedLabel, setSelectedLabel] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    drawECGStrip();
  }, [currentStrip, userLabels]);

  const drawECGStrip = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ECG grid
    drawECGGrid(ctx, canvas.width, canvas.height);

    // Draw ECG waveform (simplified representation)
    drawECGWaveform(ctx, canvas.width, canvas.height);

    // Draw user labels
    Object.entries(userLabels).forEach(([label, position]) => {
      drawLabel(ctx, label, position.x * canvas.width, position.y * canvas.height, 'user');
    });

    // Draw correct labels (for feedback)
    if (showFeedback) {
      const currentStripData = ecgStrips[currentStrip];
      Object.entries(currentStripData.correctLabels).forEach(([label, position]) => {
        drawLabel(ctx, label, position.x * canvas.width, position.y * canvas.height, 'correct');
      });
    }
  };

  const drawECGGrid = (ctx, width, height) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Vertical lines (every 0.2 seconds at 25mm/s)
    for (let x = 0; x < width; x += width / 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines (every 1mm)
    for (let y = 0; y < height; y += height / 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawECGWaveform = (ctx, width, height) => {
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const centerY = height / 2;
    const points = [];

    // Generate a simplified ECG waveform
    for (let x = 0; x < width; x += 2) {
      let y = centerY;
      
      // P-wave
      if (x > width * 0.1 && x < width * 0.2) {
        y = centerY - Math.sin((x - width * 0.1) * Math.PI / (width * 0.1)) * 20;
      }
      // QRS complex
      else if (x > width * 0.3 && x < width * 0.4) {
        y = centerY - Math.sin((x - width * 0.3) * Math.PI / (width * 0.1)) * 40;
      }
      // T-wave
      else if (x > width * 0.5 && x < width * 0.6) {
        y = centerY - Math.sin((x - width * 0.5) * Math.PI / (width * 0.1)) * 25;
      }
      // Baseline
      else {
        y = centerY + (Math.sin(x * 0.01) * 2);
      }

      points.push({ x, y });
    }

    // Draw the waveform
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  };

  const drawLabel = (ctx, label, x, y, type) => {
    const isCorrect = type === 'correct';
    const isUser = type === 'user';
    
    // Draw label box
    ctx.fillStyle = isCorrect ? '#10b981' : isUser ? '#3b82f6' : '#6b7280';
    ctx.fillRect(x - 5, y - 15, label.length * 8 + 10, 20);
    
    // Draw label text
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + label.length * 4, y - 2);
    
    // Draw arrow to point
    ctx.strokeStyle = isCorrect ? '#10b981' : isUser ? '#3b82f6' : '#6b7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 15);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCanvasClick = (e) => {
    if (!selectedLabel) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setUserLabels(prev => ({
      ...prev,
      [selectedLabel]: { x, y }
    }));

    setSelectedLabel('');
  };

  const handleLabelSelect = (label) => {
    setSelectedLabel(label);
  };

  const checkLabels = () => {
    const currentStripData = ecgStrips[currentStrip];
    const correctLabels = currentStripData.correctLabels;
    
    let correctCount = 0;
    const tolerance = 0.1; // 10% tolerance for label placement

    Object.entries(correctLabels).forEach(([label, correctPos]) => {
      const userPos = userLabels[label];
      if (userPos) {
        const distance = Math.sqrt(
          Math.pow(userPos.x - correctPos.x, 2) + 
          Math.pow(userPos.y - correctPos.y, 2)
        );
        if (distance <= tolerance) {
          correctCount++;
        }
      }
    });

    const accuracy = (correctCount / Object.keys(correctLabels).length) * 100;
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    if (accuracy >= 80) {
      setIsCompleted(true);
      onProgressUpdate(100);
    }
  };

  const nextStrip = () => {
    if (currentStrip < ecgStrips.length - 1) {
      setCurrentStrip(prev => prev + 1);
      setUserLabels({});
      setShowFeedback(false);
      setIsCompleted(false);
    }
  };

  const resetActivity = () => {
    setUserLabels({});
    setShowFeedback(false);
    setIsCompleted(false);
    setAttempts(0);
  };

  const getFeedbackMessage = () => {
    const currentStripData = ecgStrips[currentStrip];
    const correctLabels = currentStripData.correctLabels;
    const userLabelCount = Object.keys(userLabels).length;
    const correctLabelCount = Object.keys(correctLabels).length;
    
    if (userLabelCount === 0) {
      return {
        message: 'Please place some labels on the ECG strip.',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
    } else if (userLabelCount < correctLabelCount) {
      return {
        message: `You've placed ${userLabelCount} labels. Try to identify all ${correctLabelCount} components.`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    } else {
      return {
        message: 'Great job! You\'ve identified all the components. Check your placement accuracy.',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">ECG Strip Interpretation Activity</h3>
            <p className="text-sm text-gray-600">
              Strip {currentStrip + 1} of {ecgStrips.length}: {ecgStrips[currentStrip]?.title}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={checkLabels}
              disabled={Object.keys(userLabels).length === 0}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Labels
            </button>
            <button
              onClick={resetActivity}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Label Options */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-gray-900 mb-4">ECG Components</h4>
            <div className="space-y-2">
              {labelOptions.map((label) => (
                <button
                  key={label}
                  onClick={() => handleLabelSelect(label)}
                  className={`w-full text-left p-3 border rounded-lg text-sm transition-colors ${
                    selectedLabel === label
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* ECG Strip Canvas */}
          <div className="lg:col-span-3">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold text-gray-900 mb-4 text-center">
                {ecgStrips[currentStrip]?.title}
              </h4>
              <p className="text-sm text-gray-600 mb-4 text-center">
                {ecgStrips[currentStrip]?.description}
              </p>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  onClick={handleCanvasClick}
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
            <li>• Click on a component from the left panel to select it</li>
            <li>• Click on the ECG strip to place the selected component</li>
            <li>• Identify all the key components for this ECG strip</li>
            <li>• Use "Check Labels" to verify your work</li>
          </ul>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-6 p-4 rounded-lg border ${getFeedbackMessage().bgColor} ${getFeedbackMessage().borderColor}`}>
            <div className={`font-medium ${getFeedbackMessage().color}`}>
              {getFeedbackMessage().message}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Attempts: {attempts} | Labels placed: {Object.keys(userLabels).length}
            </div>
          </div>
        )}

        {/* Completion Message */}
        {isCompleted && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">🎉 Excellent!</div>
              <p className="text-green-800 mb-4">
                You have successfully identified all ECG components!
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetActivity}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Try Again
                </button>
                {currentStrip < ecgStrips.length - 1 && (
                  <button
                    onClick={nextStrip}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Next Strip
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ECGStripActivity;


