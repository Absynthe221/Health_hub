'use client';

import React, { useState } from 'react';
import Badge from './Badge';

const AdminDashboard = ({ modules = [] }) => {
  const [selectedModule, setSelectedModule] = useState(null);

  const totalModules = modules.length;
  const totalSlides = modules.reduce((acc, module) => acc + (module.slides?.length || 0), 0);
  const modulesWithAudio = modules.filter(module => 
    module.slides?.some(slide => slide.audio)
  ).length;
  const modulesWithSubtitles = modules.filter(module => 
    module.slides?.some(slide => slide.subtitles)
  ).length;
  const modulesWithImages = modules.filter(module => 
    module.slides?.some(slide => slide.images?.length > 0)
  ).length;
  const modulesWithMCQs = modules.filter(module => 
    module.slides?.some(slide => slide.mcqs?.length > 0)
  ).length;

  const stats = [
    { label: 'Total Modules', value: totalModules, color: 'blue' },
    { label: 'Total Slides', value: totalSlides, color: 'green' },
    { label: 'Modules with Audio', value: modulesWithAudio, color: 'purple' },
    { label: 'Modules with Subtitles', value: modulesWithSubtitles, color: 'orange' },
    { label: 'Modules with Images', value: modulesWithImages, color: 'cyan' },
    { label: 'Modules with MCQs', value: modulesWithMCQs, color: 'red' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Module Management */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Module Management</h3>
          <p className="mt-1 text-sm text-gray-600">
            Overview of all ECG training modules
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Features
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {modules.map((module, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {module.title || module.moduleName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {module.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {module.slides?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="success" size="sm">Active</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedModule(module)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View Details
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

export default AdminDashboard;




