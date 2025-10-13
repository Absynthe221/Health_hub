'use client';

import { useState } from 'react';
import { 
  Brain, 
  FileText, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Download,
  Play,
  MessageCircle,
  BarChart3
} from 'lucide-react';

export default function AIServicesDemo() {
  const [activeDemo, setActiveDemo] = useState('overview');
  const [quizResult, setQuizResult] = useState(null);
  const [summaryResult, setSummaryResult] = useState(null);
  const [ecgResult, setEcgResult] = useState(null);

  const sampleSlideContent = {
    title: "Atrial Fibrillation Recognition",
    content: "Atrial fibrillation is characterized by an irregularly irregular rhythm, absent P waves, and fibrillatory waves. It's the most common sustained arrhythmia and carries significant risk of thromboembolism.",
    contentType: "ECG Tracing + Analysis",
    interactive: true
  };

  const sampleQuizQuestions = [
    {
      id: 1,
      question: "What is the characteristic rhythm pattern of atrial fibrillation?",
      options: [
        "Regular rhythm",
        "Irregularly irregular rhythm", 
        "Regularly irregular rhythm",
        "Sinus rhythm"
      ],
      correctAnswer: 1,
      explanation: "Atrial fibrillation is characterized by an irregularly irregular rhythm due to chaotic atrial electrical activity.",
      difficulty: "intermediate",
      category: "Atrial Arrhythmias"
    },
    {
      id: 2,
      question: "What is the most significant risk of atrial fibrillation?",
      options: [
        "Heart failure",
        "Thromboembolism",
        "Hypertension", 
        "Diabetes"
      ],
      correctAnswer: 1,
      explanation: "The most significant risk of atrial fibrillation is thromboembolism, particularly stroke.",
      difficulty: "advanced",
      category: "Clinical Complications"
    }
  ];

  const sampleSummary = {
    summary: "Atrial fibrillation is a common cardiac arrhythmia characterized by irregular rhythm, absent P waves, and significant thromboembolic risk requiring anticoagulation therapy.",
    keyPoints: [
      "Irregularly irregular rhythm pattern",
      "Absent P waves with fibrillatory waves",
      "High risk of thromboembolic complications",
      "Requires anticoagulation therapy"
    ],
    learningObjectives: [
      "Recognize atrial fibrillation on ECG",
      "Understand thromboembolic risks",
      "Apply appropriate treatment strategies"
    ],
    difficulty: "intermediate",
    estimatedReadTime: "3 minutes"
  };

  const sampleEcgAnalysis = {
    rhythm: "Atrial fibrillation",
    rate: "110 bpm",
    axis: "Normal",
    intervals: {
      PR: "Unable to measure",
      QRS: "0.08 seconds",
      QT: "0.36 seconds"
    },
    findings: [
      "Irregularly irregular rhythm",
      "Absent P waves",
      "Fibrillatory waves present"
    ],
    abnormalities: [
      "Atrial fibrillation",
      "Irregular ventricular response"
    ],
    clinicalSignificance: "Atrial fibrillation increases stroke risk and may require anticoagulation therapy.",
    recommendations: [
      "Consider anticoagulation therapy",
      "Rate control medications",
      "Cardiology consultation"
    ],
    confidence: "high"
  };

  const handleGenerateQuiz = () => {
    setQuizResult(sampleQuizQuestions);
  };

  const handleGenerateSummary = () => {
    setSummaryResult(sampleSummary);
  };

  const handleAnalyzeEcg = () => {
    setEcgResult(sampleEcgAnalysis);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">AI Services Demo</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveDemo('overview')}
                className={`px-4 py-2 rounded-lg ${
                  activeDemo === 'overview' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveDemo('quiz')}
                className={`px-4 py-2 rounded-lg ${
                  activeDemo === 'quiz' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Quiz Generator
              </button>
              <button
                onClick={() => setActiveDemo('summary')}
                className={`px-4 py-2 rounded-lg ${
                  activeDemo === 'summary' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Slide Summary
              </button>
              <button
                onClick={() => setActiveDemo('ecg')}
                className={`px-4 py-2 rounded-lg ${
                  activeDemo === 'ecg' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ECG Analysis
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {activeDemo === 'overview' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">AI Services Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">Quiz Generator</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Auto-generate 10-25 questions per module quiz slide with varying difficulty levels.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Multiple choice questions</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Difficulty scaling</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Clinical application focus</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <MessageCircle className="w-8 h-8 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">Slide Summary</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Produce concise summary text for each slide with key learning objectives.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Brief or detailed summaries</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Key points extraction</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Learning objectives</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center mb-4">
                    <Zap className="w-8 h-8 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900 ml-3">ECG Analysis</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Future-ready placeholder for visual ECG interpretation and analysis.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Rhythm analysis</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Interval measurements</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span>Clinical recommendations</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <code className="text-blue-800 font-mono">POST /api/ai/generateQuiz</code>
                    <p className="text-blue-700 mt-1">Generate quiz questions from slide content</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <code className="text-green-800 font-mono">POST /api/ai/summarizeSlide</code>
                    <p className="text-green-700 mt-1">Create slide summaries and key points</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <code className="text-purple-800 font-mono">POST /api/ai/explainECG</code>
                    <p className="text-purple-700 mt-1">Analyze ECG data and tracings</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'quiz' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quiz Generator Demo</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Slide Content</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{sampleSlideContent.title}</h4>
                    <p className="text-gray-700 text-sm">{sampleSlideContent.content}</p>
                  </div>
                  <button
                    onClick={handleGenerateQuiz}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Quiz Questions
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Quiz Questions</h3>
                  {quizResult ? (
                    <div className="space-y-4">
                      {quizResult.map((question, index) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              question.difficulty === 'basic' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {question.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{question.question}</p>
                          <div className="space-y-1">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <span className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2 flex items-center justify-center">
                                  {optIndex === question.correctAnswer && (
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                  )}
                                </span>
                                <span className="text-sm text-gray-600">{option}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-500 mt-2 italic">{question.explanation}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Click "Generate Quiz Questions" to see AI-generated content</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'summary' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Slide Summary Demo</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Slide Content</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{sampleSlideContent.title}</h4>
                    <p className="text-gray-700 text-sm">{sampleSlideContent.content}</p>
                  </div>
                  <button
                    onClick={handleGenerateSummary}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Generate Summary
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Summary</h3>
                  {summaryResult ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900 mb-2">Summary</h4>
                        <p className="text-green-800">{summaryResult.summary}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Key Points</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {summaryResult.keyPoints.map((point, index) => (
                            <li key={index} className="text-blue-800 text-sm">{point}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-900 mb-2">Learning Objectives</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {summaryResult.learningObjectives.map((objective, index) => (
                            <li key={index} className="text-purple-800 text-sm">{objective}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Difficulty: <span className="font-medium">{summaryResult.difficulty}</span></span>
                        <span>Read Time: <span className="font-medium">{summaryResult.estimatedReadTime}</span></span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Click "Generate Summary" to see AI-generated content</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'ecg' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">ECG Analysis Demo</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample ECG Data</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">ECG Tracing</h4>
                    <div className="bg-white border-2 border-gray-300 h-32 flex items-center justify-center">
                      <span className="text-gray-500">ECG Waveform Display</span>
                    </div>
                    <p className="text-gray-700 text-sm mt-2">
                      Irregular rhythm with absent P waves and fibrillatory waves visible.
                    </p>
                  </div>
                  <button
                    onClick={handleAnalyzeEcg}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze ECG
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI ECG Analysis</h3>
                  {ecgResult ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-50 p-3 rounded-lg">
                          <h4 className="font-medium text-red-900 text-sm">Rhythm</h4>
                          <p className="text-red-800 font-semibold">{ecgResult.rhythm}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium text-blue-900 text-sm">Rate</h4>
                          <p className="text-blue-800 font-semibold">{ecgResult.rate}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-medium text-green-900 text-sm">Axis</h4>
                          <p className="text-green-800 font-semibold">{ecgResult.axis}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <h4 className="font-medium text-purple-900 text-sm">Confidence</h4>
                          <p className="text-purple-800 font-semibold capitalize">{ecgResult.confidence}</p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-yellow-900 mb-2">Key Findings</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {ecgResult.findings.map((finding, index) => (
                            <li key={index} className="text-yellow-800 text-sm">{finding}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h4 className="font-medium text-orange-900 mb-2">Clinical Recommendations</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {ecgResult.recommendations.map((rec, index) => (
                            <li key={index} className="text-orange-800 text-sm">{rec}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">Clinical Significance</h4>
                        <p className="text-gray-700 text-sm">{ecgResult.clinicalSignificance}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Click "Analyze ECG" to see AI analysis results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

