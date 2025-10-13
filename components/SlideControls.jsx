'use client';

import React from 'react';

const SlideControls = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onComplete,
  canGoNext,
  canGoPrevious
}) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex items-center space-x-4">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            canGoPrevious
              ? 'bg-gray-600 text-white hover:bg-gray-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          onClick={onComplete}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Mark Complete
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Slide {currentSlide} of {totalSlides}
        </span>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            canGoNext
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
          <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SlideControls;




