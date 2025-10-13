'use client';

import { useRouter } from 'next/navigation';
import InstructorManagementSystem from '../../components/instructor/InstructorManagementSystem';

export default function InstructorDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-green-600">Health Hub</span>
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
                  <button className="bg-green-50 text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                    Instructor
                  </button>
                  <button 
                    onClick={() => router.push('/dashboard/learner')}
                    className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Learner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome back, Instructor!</h2>
            <p className="text-green-100">Manage your courses and track student progress</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Instructor Management System */}
          <InstructorManagementSystem instructorId="instructor-001" />
        </div>
      </main>
    </div>
  );
}
