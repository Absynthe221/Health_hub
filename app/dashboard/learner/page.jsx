'use client';

import { useRouter } from 'next/navigation';
import LearningManagementSystem from '../../components/learner/LearningManagementSystem';

export default function LearnerDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-purple-600">Health Hub</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button 
                    onClick={() => router.push('/dashboard/admin')}
                    className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/instructor')}
                    className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Instructor
                  </button>
                  <button className="bg-purple-50 text-purple-600 px-3 py-2 rounded-md text-sm font-medium">
                    Learner
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome back, Student!</h2>
            <p className="text-purple-100">
              Continue your ECG learning journey
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Learning Management System */}
          <LearningManagementSystem userId="student-001" />
        </div>
      </main>
    </div>
  );
}