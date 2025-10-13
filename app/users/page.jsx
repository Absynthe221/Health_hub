import Link from 'next/link';
import UserManagement from '../components/UserManagement';

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">Health Hub</h1>
              </Link>
              <span className="ml-4 text-gray-400">|</span>
              <span className="ml-4 text-lg text-gray-700">User Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/admin"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/training"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Training
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-400 hover:text-gray-500">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/dashboard/admin" className="ml-4 text-gray-400 hover:text-gray-500">
                  Admin Dashboard
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-gray-500">User Management</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            User Management
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Manage users, assign training modules, track progress, and monitor compliance 
            across your organization. View detailed analytics and user performance metrics.
          </p>
        </div>

        {/* User Management Component */}
        <UserManagement />

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900 mb-2">Add New User</h3>
              <p className="text-sm text-gray-600">Create a new user account and assign training modules</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900 mb-2">Bulk Import</h3>
              <p className="text-sm text-gray-600">Import multiple users from CSV file</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <h3 className="font-medium text-gray-900 mb-2">Generate Report</h3>
              <p className="text-sm text-gray-600">Export user progress and compliance reports</p>
            </button>
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            User Management Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-800 mb-2">User Administration</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Create, edit, and delete user accounts</li>
                <li>• Assign role-based training modules</li>
                <li>• Track individual progress and completion</li>
                <li>• Manage user status and permissions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2">Progress Monitoring</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Real-time progress tracking</li>
                <li>• Certificate management and issuance</li>
                <li>• Compliance reporting and analytics</li>
                <li>• Automated notifications and reminders</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Health Hub. All rights reserved.</p>
            <p className="mt-2 text-sm">
              User management system for healthcare training compliance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
