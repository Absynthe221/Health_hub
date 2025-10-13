'use client';

import { useState } from 'react';
import { Bell, Send, Plus } from 'lucide-react';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Student Registration',
      message: 'John Doe has completed Module 1',
      type: 'info',
      timestamp: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      title: 'System Maintenance',
      message: 'Scheduled maintenance completed successfully',
      type: 'success',
      timestamp: '2024-01-19T15:45:00Z'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
          <p className="text-gray-600">Manage system notifications and announcements</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>Send Notification</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(notification.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

