'use client';

import { useState } from 'react';
import UserManagement from '../../components/admin/UserManagement';
import ModuleManagement from '../../components/admin/ModuleManagement';
import ProgressTracking from '../../components/admin/ProgressTracking';
import NotificationCenter from '../../components/admin/NotificationCenter';
import Analytics from '../../components/admin/Analytics';
import NotificationSystem from '../../components/admin/NotificationSystem';
import CourseCreator from '../../components/instructor/CourseCreator';
import StudentProgress from '../../components/instructor/StudentProgress';
import ModuleCard from '../../components/student/ModuleCard';
import ProgressTracker from '../../components/student/ProgressTracker';
import Button from '../../components/shared/Button';
import Card from '../../components/shared/Card';
import Alert from '../../components/shared/Alert';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Modal from '../../components/shared/Modal';
import { Users, BookOpen, BarChart3, Bell, Settings, Play, Award, Eye } from 'lucide-react';

export default function ComponentDemo() {
  const [activeTab, setActiveTab] = useState('admin');
  const [showModal, setShowModal] = useState(false);

  const tabs = [
    { id: 'admin', label: 'Admin Components', icon: Settings },
    { id: 'instructor', label: 'Instructor Components', icon: Users },
    { id: 'student', label: 'Student Components', icon: BookOpen },
    { id: 'shared', label: 'Shared Components', icon: Award }
  ];

  const mockModule = {
    id: '1',
    title: 'ECG Fundamentals',
    description: 'Learn the basics of electrocardiography including heart anatomy, electrical conduction, and basic rhythm recognition.',
    difficulty: 'beginner',
    duration: 120,
    slides: [
      { id: 1, title: 'Heart Anatomy', content: 'Understanding the structure of the heart' },
      { id: 2, title: 'Electrical Conduction', content: 'How electrical signals travel through the heart' },
      { id: 3, title: 'ECG Basics', content: 'Reading and interpreting ECG waveforms' },
      { id: 4, title: 'Normal Rhythms', content: 'Identifying normal cardiac rhythms' }
    ],
    progress: 75,
    isCompleted: false,
    tags: ['anatomy', 'basics', 'fundamentals']
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'admin':
        return (
          <div className="space-y-8">
            <Alert type="info" title="Admin Components Demo">
              These are the fully functional admin management components. Click the tabs below to see each component in action.
            </Alert>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card title="User Management" subtitle="Complete user management system">
                <div className="h-96 overflow-y-auto">
                  <UserManagement />
                </div>
              </Card>
              
              <Card title="Module Management" subtitle="Module administration and statistics">
                <div className="h-96 overflow-y-auto">
                  <ModuleManagement />
                </div>
              </Card>
              
              <Card title="Analytics Dashboard" subtitle="Comprehensive platform analytics">
                <div className="h-96 overflow-y-auto">
                  <Analytics />
                </div>
              </Card>
              
              <Card title="Notification Center" subtitle="System notifications and alerts">
                <div className="h-96 overflow-y-auto">
                  <NotificationCenter />
                </div>
              </Card>
            </div>
          </div>
        );
        
      case 'instructor':
        return (
          <div className="space-y-8">
            <Alert type="success" title="Instructor Components Demo">
              These components help instructors create courses and track student progress.
            </Alert>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card title="Course Creator" subtitle="Complete course creation interface">
                <div className="h-96 overflow-y-auto">
                  <CourseCreator />
                </div>
              </Card>
              
              <Card title="Student Progress" subtitle="Monitor student learning progress">
                <div className="h-96 overflow-y-auto">
                  <StudentProgress />
                </div>
              </Card>
            </div>
          </div>
        );
        
      case 'student':
        return (
          <div className="space-y-8">
            <Alert type="warning" title="Student Components Demo">
              These components provide the learning interface for students.
            </Alert>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card title="Module Card" subtitle="Interactive module display">
                <ModuleCard 
                  module={mockModule}
                  onStart={() => alert('Starting module!')}
                  onContinue={() => alert('Continuing module!')}
                  progress={75}
                />
              </Card>
              
              <Card title="Progress Tracker" subtitle="Learning progress visualization">
                <ProgressTracker 
                  modules={[mockModule]}
                  showDetailed={true}
                />
              </Card>
            </div>
          </div>
        );
        
      case 'shared':
        return (
          <div className="space-y-8">
            <Alert type="info" title="Shared Components Demo">
              Reusable components used across the platform.
            </Alert>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card title="Buttons" subtitle="Various button styles and states">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary" icon={Play}>Primary</Button>
                    <Button variant="secondary" icon={Eye}>Secondary</Button>
                    <Button variant="success" icon={Award}>Success</Button>
                    <Button variant="danger" icon={Bell}>Danger</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </Card>
              
              <Card title="Alerts" subtitle="Notification and alert components">
                <div className="space-y-4">
                  <Alert type="success" title="Success Alert">
                    This is a success message with important information.
                  </Alert>
                  <Alert type="warning" title="Warning Alert">
                    This is a warning message that requires attention.
                  </Alert>
                  <Alert type="error" title="Error Alert">
                    This is an error message indicating something went wrong.
                  </Alert>
                  <Alert type="info" title="Info Alert">
                    This is an informational message with helpful details.
                  </Alert>
                </div>
              </Card>
              
              <Card title="Loading States" subtitle="Loading indicators and spinners">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <LoadingSpinner size="sm" color="blue" />
                    <LoadingSpinner size="md" color="green" />
                    <LoadingSpinner size="lg" color="purple" />
                  </div>
                  <LoadingSpinner size="xl" color="red" text="Loading content..." />
                </div>
              </Card>
              
              <Card title="Modal Demo" subtitle="Modal component with content">
                <div className="space-y-4">
                  <Button onClick={() => setShowModal(true)}>Open Modal</Button>
                  <p className="text-sm text-gray-600">
                    Click the button above to open a modal dialog.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        );
        
      default:
        return <div>Select a tab to view components</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Health Hub Component Demo</h1>
            <p className="text-purple-100">
              Interactive demonstration of all dashboard components
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
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
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
        </div>
      </main>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Component Demo Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is a modal component demonstration. It includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Modal header with title and close button</li>
            <li>Modal body with scrollable content</li>
            <li>Backdrop click to close</li>
            <li>Escape key to close</li>
            <li>Responsive sizing</li>
          </ul>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowModal(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

