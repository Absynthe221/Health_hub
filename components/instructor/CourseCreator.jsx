'use client';

import React, { useState } from 'react';
import { Upload, Plus, Save, Eye, Trash2, Edit, BookOpen, Clock, Users, Award } from 'lucide-react';

export default function CourseCreator() {
  const [activeTab, setActiveTab] = useState('basic');
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    duration: 0,
    tags: [],
    objectives: [],
    slides: [],
    quizzes: []
  });

  const [newTag, setNewTag] = useState('');
  const [newObjective, setNewObjective] = useState('');

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BookOpen },
    { id: 'content', label: 'Content', icon: Upload },
    { id: 'quiz', label: 'Quizzes', icon: Award },
    { id: 'preview', label: 'Preview', icon: Eye }
  ];

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddObjective = () => {
    if (newObjective.trim() && !courseData.objectives.includes(newObjective.trim())) {
      setCourseData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (objectiveToRemove) => {
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj !== objectiveToRemove)
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    // Handle file upload logic here
    console.log('Files to upload:', files);
  };

  const handleSaveCourse = () => {
    console.log('Saving course:', courseData);
    // Implement save logic
    alert('Course saved successfully!');
  };

  const handlePublishCourse = () => {
    console.log('Publishing course:', courseData);
    // Implement publish logic
    alert('Course published successfully!');
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Title *
        </label>
        <input
          type="text"
          value={courseData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter course title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={courseData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Describe what students will learn in this course"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level *
          </label>
          <select
            value={courseData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Duration (minutes) *
          </label>
          <input
            type="number"
            value={courseData.duration}
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="120"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a tag"
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {courseData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Objectives
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a learning objective"
          />
          <button
            onClick={handleAddObjective}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <ul className="space-y-2">
          {courseData.objectives.map((objective, index) => (
            <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{objective}</span>
              <button
                onClick={() => handleRemoveObjective(objective)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Upload Course Materials</h3>
        <p className="text-blue-800 text-sm mb-4">
          Upload your PowerPoint presentation, images, and other course materials. Supported formats: PPTX, PDF, JPG, PNG, MP4, MP3.
        </p>
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
          <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <input
            type="file"
            multiple
            accept=".pptx,.pdf,.jpg,.jpeg,.png,.mp4,.mp3"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose Files
          </label>
          <p className="text-sm text-blue-600 mt-2">
            Drag and drop files here, or click to browse
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Materials</h3>
        <div className="space-y-2">
          {courseData.slides.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No files uploaded yet</p>
          ) : (
            courseData.slides.map((slide, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-700">Slide {index + 1}</span>
                </div>
                <button className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Course Quizzes</h3>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Quiz
        </button>
      </div>

      <div className="space-y-4">
        {courseData.quizzes.length === 0 ? (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No quizzes created yet</p>
            <p className="text-sm text-gray-400">Add quizzes to test student knowledge</p>
          </div>
        ) : (
          courseData.quizzes.map((quiz, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                  <p className="text-sm text-gray-500">{quiz.questions.length} questions</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{courseData.title || 'Untitled Course'}</h3>
        <p className="text-gray-600 mb-4">{courseData.description || 'No description provided'}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{courseData.duration} minutes</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{courseData.slides.length} slides</span>
          </div>
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-1" />
            <span>{courseData.quizzes.length} quizzes</span>
          </div>
        </div>

        <div className="flex space-x-2 mb-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            courseData.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            courseData.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {courseData.difficulty}
          </span>
          {courseData.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {courseData.objectives.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Learning Objectives</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {courseData.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'content':
        return renderContent();
      case 'quiz':
        return renderQuiz();
      case 'preview':
        return renderPreview();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Creator</h2>
          <p className="text-gray-500">Create and manage ECG learning modules</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSaveCourse}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </button>
          <button
            onClick={handlePublishCourse}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Publish Course
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="mr-2" size={16} />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

