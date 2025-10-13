'use client';

import { useState, useEffect } from 'react';

export default function NotificationListEnhanced({ 
  userId, 
  limit = 20, 
  showHeader = true,
  showFilters = true,
  className = '' 
}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, [userId, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'course': return '📚';
      case 'quiz': return '📝';
      case 'reminder': return '⏰';
      case 'announcement': return '📢';
      case 'system': return '⚙️';
      default: return '📄';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-32 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(notif => !notif.readStatus).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
      )}

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>No notifications found</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-colors ${
                notification.readStatus 
                  ? 'bg-white border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notification.readStatus ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
