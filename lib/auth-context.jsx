'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('healthhub_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('healthhub_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (role, name, email) => {
    // Mock user data based on role
    const mockUsers = {
      learner: {
        id: 'learner-1',
        name: name || 'Dr. Sarah Johnson',
        email: email || 'sarah.johnson@hospital.com',
        role: 'learner',
        avatar: null
      },
      instructor: {
        id: 'instructor-1',
        name: name || 'Dr. Michael Chen',
        email: email || 'michael.chen@hospital.com',
        role: 'instructor',
        avatar: null
      },
      admin: {
        id: 'admin-1',
        name: name || 'Dr. Emily Rodriguez',
        email: email || 'emily.rodriguez@hospital.com',
        role: 'admin',
        avatar: null
      }
    };

    const newUser = mockUsers[role];
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('healthhub_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthhub_user');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
