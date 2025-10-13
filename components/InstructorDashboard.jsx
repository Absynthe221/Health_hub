'use client';

import React, { useState } from 'react';
import Badge from './Badge';

const InstructorDashboard = ({ modules = [] }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // overview, students, analytics

  // Mock student data - in real app, this would come from API
  const mockStudents = [
    { id: 1, name: 'John Doe', email: 'john@example.com', progress: 75, completedModules: 3 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', progress: 90, completedModules: 5 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', progress: 45, completedModules: 2 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', progress: 100, completedModules: 6 },
  ];

  const totalStudents = mockStudents.length;
  const averageProgress = mockStudents.reduce((acc, student) => acc + student.progress, 0) / totalStudents;
  const completedStudents = mockStudents.filter(student => student.progress === 100).length;

  const stats = [
    { label: 'Total Students', value: totalStudents, color: 'blue' },
    { label: 'Average Progress', value: `${Math.round(averageProgress)}%`, color: 'green' },
    { label: 'Completed Students', value: completedStudents, color: 'purple' },
    { label: 'Active Modules', value: modules.length, color: 'orange' }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'students', name: 'Students' },
            { id: 'analytics', name: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                viewMode === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {viewMode === 'overview' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <div className={`w-6 h-6 bg-${stat.color}-600 rounded-full`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Module Overview */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Module Overview</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((module, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {module.title || module.moduleName}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {module.slides?.length || 0} slides
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {module.slides?.some(slide => slide.audio) && (
                        <Badge variant="purple" size="sm">Audio</Badge>
                      )}
                      {module.slides?.some(slide => slide.subtitles) && (
                        <Badge variant="orange" size="sm">Subtitles</Badge>
                      )}
                      {module.slides?.some(slide => slide.images?.length > 0) && (
                        <Badge variant="cyan" size="sm">Images</Badge>
                      )}
                      {module.slides?.some(slide => slide.mcqs?.length > 0) && (
                        <Badge variant="red" size="sm">MCQs</Badge>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedModule(module)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Students Tab */}
      {viewMode === 'students' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Student Progress</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed Modules
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.completedModules} / {modules.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={student.progress === 100 ? 'success' : student.progress > 50 ? 'warning' : 'danger'}
                        size="sm"
                      >
                        {student.progress === 100 ? 'Completed' : student.progress > 50 ? 'In Progress' : 'Started'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Module Completion Rate</h3>
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {module.title || module.moduleName}
                    </span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round(Math.random() * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Engagement</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round(averageProgress)}%
                </div>
                <p className="text-gray-600">Average completion rate</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module Details Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedModule.title || selectedModule.moduleName}
                </h3>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">
                    {selectedModule.description || 'No description available'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Slides ({selectedModule.slides?.length || 0})</h4>
                  <div className="space-y-2">
                    {selectedModule.slides?.map((slide, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Slide {index + 1}</span>
                          <div className="flex space-x-2">
                            {slide.audio && <Badge variant="purple" size="sm">Audio</Badge>}
                            {slide.subtitles && <Badge variant="orange" size="sm">Subtitles</Badge>}
                            {slide.images?.length > 0 && <Badge variant="cyan" size="sm">Images</Badge>}
                            {slide.mcqs?.length > 0 && <Badge variant="red" size="sm">MCQs</Badge>}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {slide.text || slide.narration || 'No content'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;




