'use client';

import { useState, useEffect } from 'react';
import { Award, Download, CheckCircle, Clock, Star, Trophy, Certificate } from 'lucide-react';

/**
 * Certification System Component
 * =============================
 * 
 * Handles ECG training certification:
 * - Progress tracking across modules
 * - Completion requirements validation
 * - Certificate generation and download
 * - Package-based certification levels
 */

export default function CertificationSystem({ 
  userId, 
  modules, 
  progress, 
  packageLevel 
}) {
  const [certificationStatus, setCertificationStatus] = useState({
    isEligible: false,
    progress: 0,
    requirements: {},
    certificates: [],
    nextSteps: []
  });
  const [generatingCertificate, setGeneratingCertificate] = useState(false);

  // Certification requirements by package level
  const certificationRequirements = {
    BEGINNER: {
      minCompletionRate: 100,
      minQuizScore: 80,
      minTimeSpent: 0, // minutes
      requiredModules: modules.filter(m => m.packageLevel === 'BEGINNER').length,
      certificateName: 'ECG Fundamentals Certificate',
      description: 'Certification for completing all Beginner ECG modules'
    },
    INTERMEDIATE: {
      minCompletionRate: 100,
      minQuizScore: 85,
      minTimeSpent: 0,
      requiredModules: modules.filter(m => m.packageLevel === 'INTERMEDIATE').length,
      certificateName: 'ECG Intermediate Certificate',
      description: 'Certification for completing all Intermediate ECG modules',
      prerequisites: ['BEGINNER']
    },
    ADVANCED: {
      minCompletionRate: 100,
      minQuizScore: 90,
      minTimeSpent: 0,
      requiredModules: modules.filter(m => m.packageLevel === 'ADVANCED').length,
      certificateName: 'ECG Expert Certificate',
      description: 'Certification for completing all Advanced ECG modules',
      prerequisites: ['INTERMEDIATE']
    }
  };

  useEffect(() => {
    calculateCertificationStatus();
  }, [modules, progress, packageLevel]);

  const calculateCertificationStatus = () => {
    const requirements = certificationRequirements[packageLevel];
    if (!requirements) return;

    // Calculate progress metrics
    const completedModules = modules.filter(m => 
      progress.moduleProgress[m.id]?.completionRate >= 100
    );
    
    const totalQuizScores = Object.values(progress.quizScores || {});
    const averageQuizScore = totalQuizScores.length > 0 
      ? totalQuizScores.reduce((sum, score) => sum + score, 0) / totalQuizScores.length 
      : 0;

    const totalTimeSpent = Object.values(progress.moduleProgress || {})
      .reduce((sum, moduleProgress) => sum + (moduleProgress.timeSpent || 0), 0);

    // Check requirements
    const requirementsMet = {
      completionRate: completedModules.length >= requirements.requiredModules,
      quizScore: averageQuizScore >= requirements.minQuizScore,
      timeSpent: totalTimeSpent >= requirements.minTimeSpent,
      prerequisites: checkPrerequisites(requirements.prerequisites || [])
    };

    const overallProgress = Object.values(requirementsMet).filter(Boolean).length / Object.keys(requirementsMet).length * 100;
    const isEligible = overallProgress === 100;

    setCertificationStatus({
      isEligible,
      progress: overallProgress,
      requirements: requirementsMet,
      certificates: getEarnedCertificates(),
      nextSteps: getNextSteps(requirementsMet, requirements)
    });
  };

  const checkPrerequisites = (prerequisites) => {
    // This would check if user has completed prerequisite packages
    // For now, assume prerequisites are met if user is accessing this package
    return prerequisites.length === 0;
  };

  const getEarnedCertificates = () => {
    // This would fetch from API or local storage
    return [
      {
        id: 'cert-001',
        name: 'ECG Fundamentals Certificate',
        earnedDate: '2024-01-15',
        packageLevel: 'BEGINNER',
        score: 92,
        downloadUrl: '/certificates/cert-001.pdf'
      }
    ];
  };

  const getNextSteps = (requirementsMet, requirements) => {
    const steps = [];

    if (!requirementsMet.completionRate) {
      const remaining = requirements.requiredModules - Object.keys(progress.moduleProgress || {}).length;
      steps.push(`Complete ${remaining} more modules in this package`);
    }

    if (!requirementsMet.quizScore) {
      const needed = Math.ceil(requirements.minQuizScore - (Object.values(progress.quizScores || {}).reduce((sum, score) => sum + score, 0) / (Object.values(progress.quizScores || {}).length || 1)));
      steps.push(`Improve average quiz score by ${needed} points`);
    }

    if (!requirementsMet.timeSpent) {
      const needed = requirements.minTimeSpent - (Object.values(progress.moduleProgress || {}).reduce((sum, moduleProgress) => sum + (moduleProgress.timeSpent || 0), 0));
      steps.push(`Spend ${needed} more minutes on training`);
    }

    if (!requirementsMet.prerequisites) {
      steps.push('Complete prerequisite package certifications');
    }

    return steps;
  };

  const generateCertificate = async () => {
    setGeneratingCertificate(true);
    
    try {
      const response = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          packageLevel,
          certificationData: {
            completionRate: certificationStatus.progress,
            averageScore: Object.values(progress.quizScores || {}).reduce((sum, score) => sum + score, 0) / (Object.values(progress.quizScores || {}).length || 1),
            timeSpent: Object.values(progress.moduleProgress || {}).reduce((sum, moduleProgress) => sum + (moduleProgress.timeSpent || 0), 0),
            completedModules: Object.keys(progress.moduleProgress || {}).length,
            earnedDate: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        const certificateData = await response.json();
        downloadCertificate(certificateData.downloadUrl, certificateData.certificateName);
      } else {
        throw new Error('Failed to generate certificate');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setGeneratingCertificate(false);
    }
  };

  const downloadCertificate = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const requirements = certificationRequirements[packageLevel];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Certificate className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {requirements?.certificateName || 'ECG Certification'}
            </h3>
            <p className="text-sm text-gray-600">
              {requirements?.description || 'Professional ECG training certification'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {certificationStatus.progress === 100 ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Clock className="h-5 w-5 text-yellow-600" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {Math.round(certificationStatus.progress)}% Complete
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Certification Progress</span>
          <span>{Math.round(certificationStatus.progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              certificationStatus.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
            }`}
            style={{ width: `${certificationStatus.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Requirements Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Requirements Status</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Module Completion</span>
            <div className="flex items-center space-x-2">
              {certificationStatus.requirements.completionRate ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium">
                {Object.keys(progress.moduleProgress || {}).length}/{requirements?.requiredModules || 0}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Quiz Score</span>
            <div className="flex items-center space-x-2">
              {certificationStatus.requirements.quizScore ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium">
                {Math.round(Object.values(progress.quizScores || {}).reduce((sum, score) => sum + score, 0) / (Object.values(progress.quizScores || {}).length || 1))}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time Spent</span>
            <div className="flex items-center space-x-2">
              {certificationStatus.requirements.timeSpent ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium">
                {Math.round(Object.values(progress.moduleProgress || {}).reduce((sum, moduleProgress) => sum + (moduleProgress.timeSpent || 0), 0) / 60)}h
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Next Steps</h4>
          {certificationStatus.nextSteps.length > 0 ? (
            <ul className="space-y-2">
              {certificationStatus.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>All requirements completed!</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {certificationStatus.isEligible ? (
          <button
            onClick={generateCertificate}
            disabled={generatingCertificate}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingCertificate ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download Certificate</span>
              </>
            )}
          </button>
        ) : (
          <button
            disabled
            className="flex items-center space-x-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
          >
            <Clock className="h-4 w-4" />
            <span>Complete Requirements First</span>
          </button>
        )}

        <button
          onClick={() => window.location.href = '/dashboard/learner'}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Award className="h-4 w-4" />
          <span>View All Certificates</span>
        </button>
      </div>

      {/* Earned Certificates */}
      {certificationStatus.certificates.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Earned Certificates</h4>
          <div className="space-y-2">
            {certificationStatus.certificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-gray-900">{cert.name}</div>
                    <div className="text-sm text-gray-600">
                      Earned: {new Date(cert.earnedDate).toLocaleDateString()} • Score: {cert.score}%
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => downloadCertificate(cert.downloadUrl, cert.name)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



