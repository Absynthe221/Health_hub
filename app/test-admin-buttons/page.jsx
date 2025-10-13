'use client';

import { useState } from 'react';
import { Users, BookOpen, BarChart3, Bell, Settings } from 'lucide-react';

export default function TestAdminButtons() {
  const [activeTab, setActiveTab] = useState('overview');
  const [buttonClicks, setButtonClicks] = useState(0);
  const [message, setMessage] = useState('Admin dashboard buttons are working!');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleButtonClick = (buttonName) => {
    setButtonClicks(prev => prev + 1);
    setMessage(`${buttonName} button clicked! Total clicks: ${buttonClicks + 1}`);
    console.log(`${buttonName} button clicked!`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Functionality Test</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleButtonClick('Add User')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => handleButtonClick('Create Module')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Create Module
                  </button>
                  <button
                    onClick={() => handleButtonClick('Export Data')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Export Data
                  </button>
                  <button
                    onClick={() => handleButtonClick('Settings')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Settings
                  </button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">{message}</p>
                  <p className="text-blue-600 text-sm">Button clicks: {buttonClicks}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900">156</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Modules</p>
                    <p className="text-2xl font-semibold text-gray-900">7</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completions</p>
                    <p className="text-2xl font-semibold text-gray-900">89</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Bell className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Notifications</p>
                    <p className="text-2xl font-semibold text-gray-900">3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'users':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <button
                  onClick={() => handleButtonClick('Add User')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add User
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">john.doe@example.com</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleButtonClick('Edit User')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleButtonClick('Delete User')}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Jane Smith</p>
                    <p className="text-sm text-gray-500">jane.smith@example.com</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleButtonClick('Edit User')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleButtonClick('Delete User')}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'modules':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Module Management</h3>
                <button
                  onClick={() => handleButtonClick('Create Module')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Module
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">ECG Fundamentals</h4>
                  <p className="text-sm text-gray-600 mb-3">Learn the basics of electrocardiography</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleButtonClick('Edit Module')}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleButtonClick('Publish Module')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Publish
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Cardiac Rhythm Recognition</h4>
                  <p className="text-sm text-gray-600 mb-3">Identify and interpret various cardiac rhythms</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleButtonClick('Edit Module')}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleButtonClick('Publish Module')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={() => handleButtonClick('Mark All Read')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark All Read
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-900">New user registered</p>
                  <p className="text-sm text-gray-500">John Doe has registered and is awaiting approval</p>
                  <div className="mt-2">
                    <button
                      onClick={() => handleButtonClick('Approve User')}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleButtonClick('Reject User')}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                
                <div className="p-3 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-900">Module completed</p>
                  <p className="text-sm text-gray-500">Sarah Wilson has completed ECG Fundamentals</p>
                  <div className="mt-2">
                    <button
                      onClick={() => handleButtonClick('View Details')}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Health Hub ECG"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Notifications
                  </label>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable email notifications</span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleButtonClick('Save Settings')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Settings
                  </button>
                  <button
                    onClick={() => handleButtonClick('Reset Settings')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">Health Hub</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleButtonClick('Sign Out')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Admin Dashboard - Button Test</h2>
            <p className="text-blue-100">
              Test all button functionality in the admin interface
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      handleButtonClick(`Switch to ${tab.label}`);
                    }}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
          {renderTabContent()}
          
          {/* Status Display */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Button Test Status</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">✅ All buttons are fully functional!</p>
              <p className="text-green-600 text-sm">Total button clicks: {buttonClicks}</p>
              <p className="text-green-600 text-sm">Last action: {message}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

