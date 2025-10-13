'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async (userId, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/notifications?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.stats?.unread || 0);
      } else {
        setError(data.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          read: true
        }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, readStatus: true }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async (userId) => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.readStatus);
      
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const notificationToDelete = notifications.find(notif => notif.id === notificationId);
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        
        if (notificationToDelete && !notificationToDelete.readStatus) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const addNotification = async (notificationData) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        const newNotification = await response.json();
        setNotifications(prev => [newNotification.notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error adding notification:', err);
    }
  };

  const refreshNotifications = async () => {
    const userId = notifications.length > 0 ? notifications[0].userId : null;
    if (userId) {
      await fetchNotifications(userId);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
