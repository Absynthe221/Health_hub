'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="flex-shrink-0 flex items-center"
            >
              <h1 className="text-2xl font-bold text-blue-600">
                Health Hub ECG
              </h1>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-gray-700">
                  Welcome, {user.name}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                
                {user.role !== 'student' && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </button>
                )}
                
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;




