'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, AlertTriangle, CheckCircle, X } from 'lucide-react';

/**
 * Attention Tracker Component
 * ==========================
 * 
 * Monitors user attention and engagement during ECG training:
 * - Random attention verification questions
 * - Focus detection (tab visibility, mouse movement)
 * - Progress blocking until attention requirements met
 * - Real-time feedback and warnings
 */

export default function AttentionTracker({ 
  slideNumber, 
  slideContent, 
  attentionQuestions = [], 
  onAttentionVerified,
  onAttentionFailed,
  requiredAttentionScore = 80,
  timeThreshold = 30000 // 30 seconds
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [showAttentionCheck, setShowAttentionCheck] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [attentionScore, setAttentionScore] = useState(100);
  const [warnings, setWarnings] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isBlocked, setIsBlocked] = useState(false);
  const [activityTimer, setActivityTimer] = useState(null);

  // Track user activity
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
    if (attentionScore < 100 && warnings < 3) {
      setAttentionScore(prev => Math.min(100, prev + 5));
    }
  }, [attentionScore, warnings]);

  // Monitor tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
        setAttentionScore(prev => Math.max(0, prev - 20));
        setWarnings(prev => prev + 1);
      } else {
        setIsVisible(true);
        updateActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updateActivity]);

  // Monitor mouse and keyboard activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateActivity]);

  // Check for attention periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      
      if (timeSinceActivity > timeThreshold && attentionScore > requiredAttentionScore) {
        triggerAttentionCheck();
      }
      
      if (timeSinceActivity > timeThreshold * 2) {
        setAttentionScore(prev => Math.max(0, prev - 10));
        setWarnings(prev => prev + 1);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [lastActivity, attentionScore, requiredAttentionScore, timeThreshold]);

  // Handle attention score changes
  useEffect(() => {
    if (attentionScore < requiredAttentionScore && !isBlocked) {
      setIsBlocked(true);
      onAttentionFailed?.();
    } else if (attentionScore >= requiredAttentionScore && isBlocked) {
      setIsBlocked(false);
    }
  }, [attentionScore, requiredAttentionScore, isBlocked, onAttentionFailed]);

  // Trigger random attention check
  const triggerAttentionCheck = () => {
    if (attentionQuestions.length === 0) {
      return;
    }

    const randomQuestion = attentionQuestions[Math.floor(Math.random() * attentionQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setShowAttentionCheck(true);
    setUserAnswer('');
  };

  // Handle attention check submission
  const handleAttentionCheck = () => {
    if (!currentQuestion || !userAnswer.trim()) {
      return;
    }

    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    
    if (isCorrect) {
      setAttentionScore(prev => Math.min(100, prev + 15));
      setWarnings(prev => Math.max(0, prev - 1));
      onAttentionVerified?.();
    } else {
      setAttentionScore(prev => Math.max(0, prev - 25));
      setWarnings(prev => prev + 1);
    }

    setShowAttentionCheck(false);
    setCurrentQuestion(null);
    setUserAnswer('');
    updateActivity();
  };

  // Skip attention check (with penalty)
  const skipAttentionCheck = () => {
    setAttentionScore(prev => Math.max(0, prev - 30));
    setWarnings(prev => prev + 2);
    setShowAttentionCheck(false);
    setCurrentQuestion(null);
    setUserAnswer('');
  };

  // Get attention status color
  const getAttentionColor = () => {
    if (attentionScore >= 80) return 'text-green-600';
    if (attentionScore >= 60) return 'text-yellow-600';
    if (attentionScore >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get attention status icon
  const getAttentionIcon = () => {
    if (attentionScore >= 80) return <CheckCircle className="h-4 w-4" />;
    if (attentionScore >= 60) return <Eye className="h-4 w-4" />;
    return <EyeOff className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Attention Status Bar */}
      <div className={`flex items-center justify-between p-3 rounded-lg border ${
        attentionScore >= 80 ? 'bg-green-50 border-green-200' :
        attentionScore >= 60 ? 'bg-yellow-50 border-yellow-200' :
        attentionScore >= 40 ? 'bg-orange-50 border-orange-200' :
        'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center space-x-2">
          {getAttentionIcon()}
          <span className={`text-sm font-medium ${getAttentionColor()}`}>
            Attention Level: {Math.round(attentionScore)}%
          </span>
          {!isVisible && (
            <span className="text-xs text-red-600 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Tab Hidden
            </span>
          )}
        </div>
        
        {warnings > 0 && (
          <span className="text-xs text-red-600">
            Warnings: {warnings}
          </span>
        )}
      </div>

      {/* Attention Check Modal */}
      {showAttentionCheck && currentQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Attention Check
              </h3>
              <button
                onClick={skipAttentionCheck}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-4">
                {currentQuestion.question}
              </p>
              
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAttentionCheck();
                  }
                }}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleAttentionCheck}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit Answer
              </button>
              <button
                onClick={skipAttentionCheck}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Skip (Penalty)
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Answer correctly to maintain your attention score and continue learning.
            </p>
          </div>
        </div>
      )}

      {/* Blocking Overlay */}
      {isBlocked && (
        <div className="fixed inset-0 bg-red-100 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Attention Required
            </h3>
            <p className="text-gray-600 mb-6">
              Your attention level has dropped below the required threshold. 
              Please focus on the content and wait for your attention score to improve.
            </p>
            <div className="text-sm text-gray-500">
              Current Score: {Math.round(attentionScore)}% | Required: {requiredAttentionScore}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



