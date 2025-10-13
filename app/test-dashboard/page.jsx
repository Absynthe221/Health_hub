'use client';

import { useState } from 'react';
import { BookOpen, MessageCircle, Play, Upload, Eye } from 'lucide-react';

export default function TestDashboard() {
  const [activeDemo, setActiveDemo] = useState('instructor');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Health Hub - Dashboard Demo</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveDemo('instructor')}
                className={`px-4 py-2 rounded-lg ${
                  activeDemo === 'instructor' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Instructor View
              </button>
              <button
                onClick={() => setActiveDemo('learner')}
                className={`px-4 py-2 rounded-lg ${
                  activeDemo === 'learner' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Learner View
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {activeDemo === 'instructor' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Instructor Dashboard - Module Generation</h2>
              
              {/* Demo Card */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">PPTX to Module Generator</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Upload className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium">Upload PowerPoint File</p>
                      <p className="text-sm text-gray-600">Select a .pptx file to convert to interactive module</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Play className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium">Generate Module Structure</p>
                      <p className="text-sm text-gray-600">AI processes slides and creates interactive elements</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Eye className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="font-medium">Preview & Save</p>
                      <p className="text-sm text-gray-600">Review generated structure with slide count and quizzes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Generated Structure */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Generated Structure</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Module Title:</span> Basic ECG Interpretations
                    </div>
                    <div>
                      <span className="font-medium">Total Slides:</span> 5
                    </div>
                    <div>
                      <span className="font-medium">Interactive Slides:</span> 3
                    </div>
                    <div>
                      <span className="font-medium">Quiz Items:</span> 3
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'learner' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Learner Module View - Interactive Learning</h2>
              
              {/* Demo Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Structured Slide Display</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">Slide navigation with progress tracking</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-sm">Content display with multimedia support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                      <span className="text-sm">Interactive elements and animations</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Tutor Integration</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">Context-aware AI chat assistance</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Real-time slide-specific explanations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                      <span className="text-sm">Medical education expertise</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Demo */}
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Quiz System</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900 mb-3">Sample Quiz Question:</p>
                  <p className="text-blue-800 mb-4">Which lead provides the best view of the inferior wall of the heart?</p>
                  <div className="space-y-2">
                    {['Lead I', 'Lead II', 'Lead aVR', 'Lead V1'].map((option, index) => (
                      <div key={index} className="flex items-center p-2 bg-white rounded border">
                        <input type="radio" name="demo-quiz" className="mr-3" />
                        <span className="text-blue-800">{option}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Submit Answer
                  </button>
                </div>
              </div>

              {/* Navigation Demo */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Slide Navigation</h3>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((slide, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full text-sm font-medium ${
                        index === 2 
                          ? 'bg-blue-600 text-white' 
                          : index < 2 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {slide}
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Current: Slide 3 • Completed: 2 • Remaining: 2
                </p>
              </div>
            </div>
          )}

          {/* Live Demo Links */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Demo Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/dashboard/instructor?tab=modules"
                className="block p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <h4 className="font-medium text-green-900">Instructor Dashboard</h4>
                <p className="text-sm text-green-700">Generate modules from PPTX files</p>
              </a>
              <a
                href="/dashboard/learner/module_1"
                className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <h4 className="font-medium text-blue-900">Learner Module View</h4>
                <p className="text-sm text-blue-700">Interactive learning with AI tutor</p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

