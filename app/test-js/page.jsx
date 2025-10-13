'use client';

import { useState } from 'react';

export default function JSTest() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Click the button to test JavaScript!');

  const handleClick = () => {
    setCount(prev => prev + 1);
    setMessage(`Button clicked ${count + 1} times! JavaScript is working!`);
    alert(`JavaScript is working! Count: ${count + 1}`);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">JavaScript Functionality Test</h1>
        
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold mb-4">Interactive Test</h2>
          
          <div className="space-y-6">
            {/* Button Test */}
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">Button Click Test</h3>
              <button
                onClick={handleClick}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Click Me! (Count: {count})
              </button>
              <p className="text-sm text-gray-600 mt-2">
                This button should increment the counter and show an alert.
              </p>
            </div>

            {/* Input Test */}
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">Input Field Test</h3>
              <input
                type="text"
                onChange={handleInputChange}
                placeholder="Type something here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-600 mt-2">
                Type in the input field above to see the message change below.
              </p>
            </div>

            {/* State Display */}
            <div className="border p-4 rounded-lg bg-gray-50">
              <h3 className="font-medium mb-2">Current State</h3>
              <p className="text-gray-700">
                <strong>Message:</strong> {message}
              </p>
              <p className="text-gray-700">
                <strong>Click Count:</strong> {count}
              </p>
            </div>

            {/* Multiple Button Tests */}
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">Multiple Button Tests</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setMessage('Button 1 clicked!')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Button 1
                </button>
                <button
                  onClick={() => setMessage('Button 2 clicked!')}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Button 2
                </button>
                <button
                  onClick={() => setMessage('Button 3 clicked!')}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  Button 3
                </button>
                <button
                  onClick={() => {
                    setCount(0);
                    setMessage('Reset!');
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Form Test */}
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">Form Test</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const name = formData.get('name');
                setMessage(`Form submitted with name: ${name}`);
              }}>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Submit Form
                  </button>
                </div>
              </form>
            </div>

            {/* Status Indicator */}
            <div className={`border p-4 rounded-lg ${count > 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <h3 className="font-medium mb-2">JavaScript Status</h3>
              {count > 0 ? (
                <p className="text-green-700">✅ JavaScript is working correctly!</p>
              ) : (
                <p className="text-yellow-700">⚠️ Click a button to test JavaScript functionality</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Test */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => window.location.href = '/dashboard/admin'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Admin Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/instructor'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Instructor Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/learner'}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Go to Learner Dashboard
            </button>
            <button
              onClick={() => window.location.href = '/demo-components'}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              View Component Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

