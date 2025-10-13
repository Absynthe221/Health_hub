'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Mail, AlertCircle, CheckCircle, XCircle, Settings, Trash2, Eye } from 'lucide-react';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockNotifications = [
      {
        id: '1',
        type: 'user_registration',
        title: 'New User Registration',
        message: 'John Doe has registered and is awaiting approval',
        priority: 'high',
        status: 'unread',
        timestamp: '2024-10-07T10:30:00Z',
        actionRequired: true,
        metadata: { userId: '123', userName: 'John Doe' }
      },
      {
        id: '2',
        type: 'module_completion',
        title: 'Module Completed',
        message: 'Sarah Wilson has completed "ECG Fundamentals" with a score of 92%',
        priority: 'medium',
        status: 'read',
        timestamp: '2024-10-07T09:15:00Z',
        actionRequired: false,
        metadata: { userId: '456', moduleId: '1', score: 92 }
      },
      {
        id: '3',
        type: 'system_alert',
        title: 'System Maintenance Scheduled',
        message: 'Scheduled maintenance will occur on Sunday, October 13th from 2-4 AM',
        priority: 'high',
        status: 'unread',
        timestamp: '2024-10-06T16:45:00Z',
        actionRequired: false,
        metadata: { maintenanceDate: '2024-10-13T02:00:00Z' }
      },
      {
        id: '4',
        type: 'assignment_request',
        title: 'Assignment Request',
        message: 'Dr. Johnson requests access to assign modules to students',
        priority: 'medium',
        status: 'unread',
        timestamp: '2024-10-06T14:20:00Z',
        actionRequired: true,
        metadata: { instructorId: '789', instructorName: 'Dr. Johnson' }
      },
      {
        id: '5',
        type: 'performance_alert',
        title: 'Performance Alert',
        message: 'Average completion rate has dropped below 70% for the past week',
        priority: 'high',
        status: 'read',
        timestamp: '2024-10-05T11:30:00Z',
        actionRequired: true,
        metadata: { completionRate: 68, previousWeek: 75 }
      }
    ];
    
    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.status === 'unread';
    if (filter === 'high_priority') return notification.priority === 'high';
    if (filter === 'action_required') return notification.actionRequired;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && n.status === 'unread').length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && n.status === 'unread').length;

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, status: 'read' }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, status: 'read' }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleBulkAction = (action) => {
    selectedNotifications.forEach(id => {
      if (action === 'mark_read') {
        markAsRead(id);
      } else if (action === 'delete') {
        deleteNotification(id);
      }
    });
    setSelectedNotifications([]);
  };

  const getNotificationIcon = (type, priority) => {
    const iconClass = priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-yellow-500' : 'text-blue-500';
    
    switch (type) {
      case 'user_registration':
        return <Mail className={`h-5 w-5 ${iconClass}`} />;
      case 'system_alert':
        return <AlertCircle className={`h-5 w-5 ${iconClass}`} />;
      case 'module_completion':
        return <CheckCircle className={`h-5 w-5 ${iconClass}`} />;
      default:
        return <Bell className={`h-5 w-5 ${iconClass}`} />;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
          <p className="text-gray-500">Manage system notifications and alerts</p>
        </div>
        <div className="flex space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark All Read
            </button>
          )}
          <button className="flex items-center px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Notifications</p>
              <p className="text-2xl font-semibold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unread</p>
              <p className="text-2xl font-semibold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">High Priority</p>
              <p className="text-2xl font-semibold text-gray-900">{highPriorityCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Action Required</p>
              <p className="text-2xl font-semibold text-gray-900">{actionRequiredCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4">
          {[
            { key: 'all', label: 'All Notifications' },
            { key: 'unread', label: 'Unread' },
            { key: 'high_priority', label: 'High Priority' },
            { key: 'action_required', label: 'Action Required' },
            { key: 'user_registration', label: 'User Registration' },
            { key: 'module_completion', label: 'Module Completion' },
            { key: 'system_alert', label: 'System Alerts' }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedNotifications.length} notification(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('mark_read')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mark as Read
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  notification.status === 'unread' ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedNotifications(prev => [...prev, notification.id]);
                      } else {
                        setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                      }
                    }}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-medium ${
                          notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className={getPriorityBadge(notification.priority)}>
                          {notification.priority}
                        </span>
                        {notification.actionRequired && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                            Action Required
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Mark as read"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <p className={`text-sm ${
                      notification.status === 'unread' ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    
                    {notification.actionRequired && (
                      <div className="mt-3 flex space-x-2">
                        <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                          Take Action
                        </button>
                        <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {filteredNotifications.length} of {notifications.length} notifications
      </div>
    </div>
  );
}