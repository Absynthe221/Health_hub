'use client';

import Link from 'next/link';
import { useAuth } from '../../lib/auth-context.jsx';
import NotificationBell from './NotificationBell';

export default function NavBar() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const getRoleSpecificLinks = () => {
    switch (user.role) {
      case 'learner':
        return [
          { href: '/dashboard/learner', label: 'My Dashboard', icon: '🏠' },
          { href: '/demo', label: 'ECG Demo', icon: '📊' },
          { href: '/feedback', label: 'Feedback', icon: '💬' }
        ];
      case 'instructor':
        return [
          { href: '/dashboard/instructor', label: 'My Dashboard', icon: '🏠' },
          { href: '/dashboard/instructor?tab=courses', label: 'My Courses', icon: '📚' },
          { href: '/dashboard/instructor?tab=learners', label: 'Learners', icon: '👥' },
          { href: '/dashboard/instructor?tab=reports', label: 'Reports', icon: '📊' }
        ];
      case 'admin':
        return [
          { href: '/dashboard/admin', label: 'Admin Panel', icon: '🏠' },
          { href: '/dashboard/admin?tab=users', label: 'User Management', icon: '👥' },
          { href: '/dashboard/admin?tab=courses', label: 'Course Management', icon: '📚' },
          { href: '/dashboard/admin?tab=analytics', label: 'Analytics', icon: '📊' }
        ];
      default:
        return [];
    }
  };

  const roleLinks = getRoleSpecificLinks();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and role-specific links */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">Health Hub ECG</span>
              </Link>
            </div>
            
            {/* Role-specific navigation links */}
            <div className="hidden md:flex space-x-6">
              {roleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationBell userId={user.id} />

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden border-t border-gray-200 py-3">
          <div className="space-y-1">
            {roleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
