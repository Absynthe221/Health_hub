'use client';

import React, { useState, useEffect } from 'react';

const CaseScenarios = ({ cases, onProgressUpdate }) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [userDecisions, setUserDecisions] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const currentCase = cases?.[currentCaseIndex];

  useEffect(() => {
    if (currentCase) {
      setCurrentStep(0);
      setUserDecisions({});
      setShowFeedback(false);
      setIsCompleted(false);
    }
  }, [currentCaseIndex, currentCase]);

  const handleDecision = (stepId, decision) => {
    setUserDecisions(prev => ({
      ...prev,
      [stepId]: decision
    }));
  };

  const nextStep = () => {
    if (currentStep < currentCase?.steps?.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCaseComplete();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCaseComplete = () => {
    setShowFeedback(true);
    setIsCompleted(true);
    
    // Calculate progress based on correct decisions
    const correctDecisions = Object.values(userDecisions).filter(decision => 
      decision.isCorrect
    ).length;
    const totalDecisions = Object.keys(userDecisions).length;
    const progress = totalDecisions > 0 ? (correctDecisions / totalDecisions) * 100 : 0;
    
    onProgressUpdate(progress);
  };

  const nextCase = () => {
    if (currentCaseIndex < cases.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
    }
  };

  const resetCase = () => {
    setCurrentStep(0);
    setUserDecisions({});
    setShowFeedback(false);
    setIsCompleted(false);
  };

  const getDecisionFeedback = (decision) => {
    if (decision.isCorrect) {
      return {
        message: decision.feedback || 'Correct!',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else {
      return {
        message: decision.feedback || 'Incorrect. Consider the clinical presentation.',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  };

  if (!cases || cases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No case scenarios available for this module.</p>
      </div>
    );
  }

  const currentStepData = currentCase?.steps?.[currentStep];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Case-Based Scenarios</h3>
            <p className="text-sm text-gray-600">
              Case {currentCaseIndex + 1} of {cases.length}: {currentCase?.title}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={resetCase}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Reset Case
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {currentCase?.steps?.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentStep + 1) / currentCase?.steps?.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / currentCase?.steps?.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-6">
        {/* Case Information */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {currentCase?.title}
          </h4>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h5 className="font-medium text-gray-900 mb-2">Patient Information:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium">Age:</span> {currentCase?.patientInfo?.age}
              </div>
              <div>
                <span className="font-medium">Gender:</span> {currentCase?.patientInfo?.gender}
              </div>
              <div>
                <span className="font-medium">Chief Complaint:</span> {currentCase?.patientInfo?.chiefComplaint}
              </div>
              <div>
                <span className="font-medium">Medical History:</span> {currentCase?.patientInfo?.medicalHistory}
              </div>
            </div>
          </div>
        </div>

        {/* Current Step */}
        {currentStepData && (
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-900 mb-4">
              {currentStepData.title}
            </h5>
            
            <div className="bg-white border rounded-lg p-4 mb-4">
              <p className="text-gray-700 mb-4">{currentStepData.description}</p>
              
              {currentStepData.image && (
                <div className="mb-4">
                  <img
                    src={currentStepData.image}
                    alt="Case illustration"
                    className="max-w-full h-auto rounded-lg shadow-sm"
                  />
                </div>
              )}

              {currentStepData.ecgData && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h6 className="font-medium text-gray-900 mb-2">ECG Data:</h6>
                  <div className="text-sm text-gray-700 space-y-1">
                    {Object.entries(currentStepData.ecgData).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Decision Options */}
            <div className="space-y-3">
              <h6 className="font-medium text-gray-900">What would you do?</h6>
              {currentStepData.options?.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    userDecisions[currentStepData.id]?.id === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`step-${currentStepData.id}`}
                    value={option.id}
                    checked={userDecisions[currentStepData.id]?.id === option.id}
                    onChange={() => handleDecision(currentStepData.id, option)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 mt-1 flex items-center justify-center ${
                    userDecisions[currentStepData.id]?.id === option.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {userDecisions[currentStepData.id]?.id === option.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option.text}</div>
                    {option.description && (
                      <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousStep}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous Step
          </button>
          
          <div className="text-sm text-gray-600">
            {Object.keys(userDecisions).length} decisions made
          </div>
          
          <button
            onClick={currentStep === currentCase?.steps?.length - 1 ? handleCaseComplete : nextStep}
            disabled={!userDecisions[currentStepData?.id]}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === currentCase?.steps?.length - 1 ? 'Complete Case' : 'Next Step →'}
          </button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="mt-6 space-y-4">
            <h5 className="text-lg font-semibold text-gray-900">Case Review</h5>
            {Object.entries(userDecisions).map(([stepId, decision]) => {
              const feedback = getDecisionFeedback(decision);
              return (
                <div key={stepId} className={`p-4 rounded-lg border ${feedback.bgColor} ${feedback.borderColor}`}>
                  <div className={`font-medium ${feedback.color}`}>
                    {feedback.message}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Step {parseInt(stepId) + 1}: {decision.text}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Completion Message */}
        {isCompleted && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">🎉 Case Complete!</div>
              <p className="text-green-800 mb-4">
                You have successfully completed this case scenario.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetCase}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Review Case
                </button>
                {currentCaseIndex < cases.length - 1 && (
                  <button
                    onClick={nextCase}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Next Case
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

export default CaseScenarios;





