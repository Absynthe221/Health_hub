'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const DashboardPage = () => {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  if (userLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (user.role === 'student') {
    router.push('/dashboard/learner');
    return null;
  }

  if (user.role === 'instructor') {
    router.push('/dashboard/instructor');
    return null;
  }

  if (user.role === 'admin') {
    router.push('/dashboard/admin');
    return null;
  }

  return null;
};

export default DashboardPage;
