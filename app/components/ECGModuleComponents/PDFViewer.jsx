'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ files, onProgressUpdate }) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentFile = files?.[currentFileIndex];

  useEffect(() => {
    if (currentFile) {
      setIsLoading(true);
      setError(null);
    }
  }, [currentFile]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setCurrentPage(1);
  };

  const onDocumentLoadError = (error) => {
    setError('Failed to load PDF');
    setIsLoading(false);
    console.error('PDF load error:', error);
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages));
  };

  const goToPrevFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(prev => prev - 1);
      onProgressUpdate((currentFileIndex / files.length) * 100);
    }
  };

  const goToNextFile = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex(prev => prev + 1);
      onProgressUpdate(((currentFileIndex + 1) / files.length) * 100);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  if (!files || files.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No PDF files available for this module.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentFile?.name || 'PDF Viewer'}
            </h3>
            <p className="text-sm text-gray-600">
              File {currentFileIndex + 1} of {files.length}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevFile}
              disabled={currentFileIndex === 0}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={goToNextFile}
              disabled={currentFileIndex === files.length - 1}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous Page
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {numPages || '...'}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === numPages}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Page →
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Zoom Out
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Zoom In
            </button>
            <button
              onClick={resetZoom}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* PDF Content */}
      <div className="p-6">
        <div className="flex justify-center">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading PDF...</span>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && currentFile && (
            <div className="border rounded-lg overflow-hidden shadow-lg">
              <Document
                file={currentFile.url}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            </div>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="border-t px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Progress: {Math.round(((currentFileIndex + 1) / files.length) * 100)}%
          </div>
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentFileIndex + 1) / files.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;





