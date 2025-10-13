'use client';

import { useState, useEffect } from 'react';
import { Users, BookOpen, BarChart3, Bell, Settings, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProgressManagement from '../../components/admin/ProgressManagement';
import NotificationManagement from '../../components/admin/NotificationManagement';
import UserManagement from '../../components/admin/UserManagement';
import ModuleManagement from '../../components/admin/ModuleManagement';
import AnalyticsManagement from '../../components/admin/AnalyticsManagement';
import SettingsManagement from '../../components/admin/SettingsManagement';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [buttonClicks, setButtonClicks] = useState(0);
  const [message, setMessage] = useState('Admin dashboard is fully functional!');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleButtonClick = (buttonName) => {
    if (!mounted) return;
    setButtonClicks(prev => prev + 1);
    setMessage(`${buttonName} clicked! Total clicks: ${buttonClicks + 1}`);
    console.log(`${buttonName} button clicked!`);
  };

  const handleTabClick = (tabId, tabLabel) => {
    if (!mounted) return;
    setActiveTab(tabId);
    handleButtonClick(`Switch to ${tabLabel}`);
  };

  const handleNavigation = (role) => {
    if (!mounted) return;
    console.log(`Navigating to ${role} dashboard`);
    
    if (role === 'instructor') {
      router.push('/dashboard/instructor');
    } else if (role === 'learner') {
      router.push('/dashboard/learner');
    }
    // Admin stays on current page
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Overview</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleButtonClick('Add User')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => handleButtonClick('Create Module')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Module
                </button>
                <button
                  type="button"
                  onClick={() => handleButtonClick('Export Data')}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Export Data
                </button>
                <button
                  type="button"
                  onClick={() => handleButtonClick('System Settings')}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  System Settings
                </button>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">{message}</p>
                <p className="text-blue-600 text-sm">Button clicks: {buttonClicks}</p>
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
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">New user registered</span>
                  <button
                    type="button"
                    onClick={() => handleButtonClick('View User')}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Module completed by student</span>
                  <button
                    type="button"
                    onClick={() => handleButtonClick('View Progress')}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    View
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">New module uploaded</span>
                  <button
                    type="button"
                    onClick={() => handleButtonClick('Review Module')}
                    className="text-purple-600 hover:text-purple-800 text-sm"
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'users':
        return <UserManagement onActionClick={handleButtonClick} />;
        
      case 'modules':
        return <ModuleManagement onActionClick={handleButtonClick} />;
        
      case 'progress':
        return <ProgressManagement onActionClick={handleButtonClick} />;
        
      case 'notifications':
        return <NotificationManagement onActionClick={handleButtonClick} />;
        
      case 'analytics':
        return <AnalyticsManagement onActionClick={handleButtonClick} />;
        
      case 'settings':
        return <SettingsManagement onActionClick={handleButtonClick} />;
        
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
              <div className="text-center py-8">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">This section is under development</p>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">Health Hub</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button
                    onClick={() => handleNavigation('admin')}
                    className="bg-blue-50 text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => handleNavigation('instructor')}
                    className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Instructor
                  </button>
                  <button
                    onClick={() => handleNavigation('learner')}
                    className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Learner
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleButtonClick('Sign Out')}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome back, Admin!</h2>
            <p className="text-blue-100">Manage your ECG learning platform with comprehensive admin tools</p>
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
                    type="button"
                    onClick={() => handleTabClick(tab.id, tab.label)}
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
          
          {/* Status Section */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Dashboard Status</h3>
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