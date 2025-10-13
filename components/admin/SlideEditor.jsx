'use client';

import { useState } from 'react';
import { Upload, FileText, Image, Volume2, Video, X, Plus, Save, Trash2 } from 'lucide-react';
import { showNotification } from './NotificationSystem';

export default function SlideEditor({ module, onSave, onClose }) {
  const [slides, setSlides] = useState(module?.slides || []);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [editingSlide, setEditingSlide] = useState(null);


  const handleSlideContentChange = (slideIndex, field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex] = {
      ...updatedSlides[slideIndex],
      [field]: value
    };
    setSlides(updatedSlides);
  };

  const handleMediaUpload = async (slideIndex, mediaType, file) => {
    if (!file) return;

    const slideId = slides[slideIndex].slideId || slides[slideIndex].id || `slide-${slideIndex + 1}`;
    setUploadingFiles(prev => ({ ...prev, [`${slideId}-${mediaType}`]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slideId', slideId);
      formData.append('mediaType', mediaType);
      formData.append('moduleId', module.moduleId || module.id);

      const response = await fetch('/api/slides/upload-media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const updatedSlides = [...slides];
        
        if (!updatedSlides[slideIndex].media) {
          updatedSlides[slideIndex].media = { images: [], audio: [], video: [] };
        }
        
        updatedSlides[slideIndex].media[mediaType].push(result.filePath);
        
        setSlides(updatedSlides);
        
        showNotification({
          type: 'success',
          title: 'Upload Successful',
          message: `${mediaType} uploaded successfully`
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showNotification({
        type: 'error',
        title: 'Upload Failed',
        message: `Failed to upload ${mediaType}`
      });
    } finally {
      setUploadingFiles(prev => ({ ...prev, [`${slideId}-${mediaType}`]: false }));
    }
  };

  const handleAddSlide = () => {
    const newSlide = {
      slideId: `slide-${slides.length + 1}`,
      slideNumber: slides.length + 1,
      title: `New Slide ${slides.length + 1}`,
      content: '',
      subtitle: '',
      image: '',
      audio: '',
      video: null,
      quiz: null,
      duration: 5,
      annotations: [],
      notes: ''
    };
    setSlides([...slides, newSlide]);
  };

  const handleRemoveSlide = (slideIndex) => {
    if (slides.length > 1) {
      const updatedSlides = slides.filter((_, index) => index !== slideIndex);
      setSlides(updatedSlides);
    }
  };

  const handleSave = async () => {
    try {
      const moduleId = module.moduleId || module.id;
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...module,
          slides: slides,
          slideCount: slides.length
        }),
      });

      if (response.ok) {
        showNotification({
          type: 'success',
          title: 'Module Updated',
          message: 'Slides saved successfully'
        });
        onSave({ ...module, slides: slides, slideCount: slides.length });
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      showNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save slides'
      });
    }
  };

  const handleObjectiveChange = (slideIndex, objectiveIndex, value) => {
    const updatedSlides = [...slides];
    if (!updatedSlides[slideIndex].learningObjectives) {
      updatedSlides[slideIndex].learningObjectives = [];
    }
    updatedSlides[slideIndex].learningObjectives[objectiveIndex] = value;
    setSlides(updatedSlides);
  };

  const addObjective = (slideIndex) => {
    const updatedSlides = [...slides];
    if (!updatedSlides[slideIndex].learningObjectives) {
      updatedSlides[slideIndex].learningObjectives = [];
    }
    updatedSlides[slideIndex].learningObjectives.push('');
    setSlides(updatedSlides);
  };

  const removeObjective = (slideIndex, objectiveIndex) => {
    const updatedSlides = [...slides];
    updatedSlides[slideIndex].learningObjectives.splice(objectiveIndex, 1);
    setSlides(updatedSlides);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Module: {module?.title}</h2>
            <p className="text-gray-600">Manage slides and upload media files</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-8">
            {slides.map((slide, slideIndex) => (
              <div key={slide.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Slide {slide.slideNumber || slide.id}: {slide.title}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRemoveSlide(slideIndex)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      disabled={slides.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Content */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slide Title
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleSlideContentChange(slideIndex, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={slide.content}
                        onChange={(e) => handleSlideContentChange(slideIndex, 'content', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter slide content..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Learning Objectives
                      </label>
                      <div className="space-y-2">
                        {slide.learningObjectives?.map((objective, objectiveIndex) => (
                          <div key={objectiveIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={objective}
                              onChange={(e) => handleObjectiveChange(slideIndex, objectiveIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter learning objective..."
                            />
                            <button
                              onClick={() => removeObjective(slideIndex, objectiveIndex)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addObjective(slideIndex)}
                          className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Objective
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={slide.duration}
                        onChange={(e) => handleSlideContentChange(slideIndex, 'duration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="60"
                      />
                    </div>
                  </div>

                  {/* Right Column - Media Uploads */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Media Files</h4>
                    
                    {/* Images Upload */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Image className="w-5 h-5 mr-2 text-blue-600" />
                          <span className="font-medium text-gray-900">Images</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload(slideIndex, 'images', e.target.files[0])}
                          className="hidden"
                          id={`image-upload-${slideIndex}`}
                        />
                        <label
                          htmlFor={`image-upload-${slideIndex}`}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                            uploadingFiles[`${slide.id}-images`]
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          {uploadingFiles[`${slide.id}-images`] ? 'Uploading...' : 'Upload'}
                        </label>
                      </div>
                      {slide.image && (
                        <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded mb-1">
                          {slide.image}
                        </div>
                      )}
                      {slide.media?.images?.map((image, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-100 p-2 rounded mb-1">
                          {image}
                        </div>
                      ))}
                    </div>

                    {/* Audio Upload */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Volume2 className="w-5 h-5 mr-2 text-green-600" />
                          <span className="font-medium text-gray-900">Audio</span>
                        </div>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleMediaUpload(slideIndex, 'audio', e.target.files[0])}
                          className="hidden"
                          id={`audio-upload-${slideIndex}`}
                        />
                        <label
                          htmlFor={`audio-upload-${slideIndex}`}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                            uploadingFiles[`${slide.id}-audio`]
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          {uploadingFiles[`${slide.id}-audio`] ? 'Uploading...' : 'Upload'}
                        </label>
                      </div>
                      {slide.audio && (
                        <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded mb-1">
                          {slide.audio}
                        </div>
                      )}
                      {slide.media?.audio?.map((audio, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-100 p-2 rounded mb-1">
                          {audio}
                        </div>
                      ))}
                    </div>

                    {/* Video Upload */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Video className="w-5 h-5 mr-2 text-purple-600" />
                          <span className="font-medium text-gray-900">Video</span>
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleMediaUpload(slideIndex, 'video', e.target.files[0])}
                          className="hidden"
                          id={`video-upload-${slideIndex}`}
                        />
                        <label
                          htmlFor={`video-upload-${slideIndex}`}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                            uploadingFiles[`${slide.id}-video`]
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          {uploadingFiles[`${slide.id}-video`] ? 'Uploading...' : 'Upload'}
                        </label>
                      </div>
                      {slide.video && (
                        <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded mb-1">
                          {slide.video}
                        </div>
                      )}
                      {slide.media?.video?.map((video, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-100 p-2 rounded mb-1">
                          {video}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Slide Button */}
            <div className="flex justify-center">
              <button
                onClick={handleAddSlide}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Slide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
