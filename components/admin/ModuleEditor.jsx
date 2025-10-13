'use client';

import { useState, useEffect } from 'react';
import { Edit, Save, Eye, Trash2, Plus, Image, Volume2, FileText } from 'lucide-react';

export default function ModuleEditor({ module, onSave, onCancel }) {
  const [editedModule, setEditedModule] = useState(module);
  const [editingSlide, setEditingSlide] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setEditedModule(module);
  }, [module]);

  const handleModuleUpdate = (field, value) => {
    setEditedModule(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSlideUpdate = (slideId, field, value) => {
    setEditedModule(prev => ({
      ...prev,
      slides: prev.slides.map(slide => 
        slide.id === slideId ? { ...slide, [field]: value } : slide
      )
    }));
  };

  const addQuiz = (slideId) => {
    const newQuiz = {
      id: `quiz_${Date.now()}`,
      question: 'New question?',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0,
      explanation: 'Explanation for the correct answer'
    };

    handleSlideUpdate(slideId, 'quiz', newQuiz);
  };

  const removeQuiz = (slideId) => {
    handleSlideUpdate(slideId, 'quiz', null);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/modules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedModule)
      });

      if (response.ok) {
        onSave(editedModule);
        alert('Module updated successfully!');
      } else {
        alert('Failed to update module');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes');
    }
  };

  const handlePublish = async () => {
    try {
      const response = await fetch('/api/publish', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId: editedModule.id, status: 'published' })
      });

      if (response.ok) {
        handleModuleUpdate('status', 'published');
        alert('Module published successfully!');
      } else {
        alert('Failed to publish module');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish module');
    }
  };

  if (showPreview) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Preview: {editedModule.title}</h3>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Close Preview
          </button>
        </div>
        
        <div className="space-y-4">
          {editedModule.slides?.map((slide, index) => (
            <div key={slide.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Slide {slide.id}</h4>
                <span className="text-sm text-gray-500">Slide {index + 1}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img
                    src={slide.image}
                    alt={`Slide ${slide.id}`}
                    className="w-full h-48 object-cover rounded border"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiBzdHJva2U9IiNkMWQ1ZGIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzc0MTUxIj5TbGlkZSB7c2xpZGUuaWR9PC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <p className="text-sm text-gray-600">{slide.subtitle}</p>
                  </div>
                  
                  {slide.audio && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Audio</label>
                      <audio controls className="w-full">
                        <source src={slide.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  
                  {slide.quiz && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quiz</label>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">{slide.quiz.question}</p>
                        <ul className="mt-1 space-y-1">
                          {slide.quiz.options.map((option, idx) => (
                            <li key={idx} className={`${idx === slide.quiz.correctAnswer ? 'text-green-600 font-medium' : ''}`}>
                              {String.fromCharCode(65 + idx)}. {option}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Edit Module: {editedModule.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Module Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={editedModule.title}
              onChange={(e) => handleModuleUpdate('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={editedModule.status}
              onChange={(e) => handleModuleUpdate('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={editedModule.description}
            onChange={(e) => handleModuleUpdate('description', e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Slides */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-900">Slides ({editedModule.slides?.length || 0})</h4>
            {editedModule.status === 'draft' && (
              <button
                onClick={handlePublish}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Publish Module
              </button>
            )}
          </div>

          <div className="space-y-4">
            {editedModule.slides?.map((slide, index) => (
              <div key={slide.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium">Slide {slide.id}</h5>
                  <span className="text-sm text-gray-500">Slide {index + 1}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <div className="relative">
                      <img
                        src={slide.image}
                        alt={`Slide ${slide.id}`}
                        className="w-full h-32 object-cover rounded border"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiBzdHJva2U9IiNkMWQ1ZGIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzc0MTUxIj5TbGlkZSB7c2xpZGUuaWR9PC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        <Image className="h-3 w-3 inline mr-1" />
                        Image
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <textarea
                        value={slide.subtitle}
                        onChange={(e) => handleSlideUpdate(slide.id, 'subtitle', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Audio (optional)</label>
                      <input
                        type="text"
                        value={slide.audio || ''}
                        onChange={(e) => handleSlideUpdate(slide.id, 'audio', e.target.value)}
                        placeholder="Audio file path"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quiz</label>
                      {slide.quiz ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Quiz configured</span>
                            <button
                              onClick={() => removeQuiz(slide.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove Quiz
                            </button>
                          </div>
                          <div className="text-xs text-gray-500">
                            Question: {slide.quiz.question}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => addQuiz(slide.id)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Quiz
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
