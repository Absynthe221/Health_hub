'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Trash2, 
  Edit, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Users,
  User,
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  Download,
  MessageSquare,
  Megaphone,
  Mail,
  Target
} from 'lucide-react';

export default function NotificationManagement({ onActionClick }) {
  const [activeView, setActiveView] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showComposer, setShowComposer] = useState(false);
  
  // Notification statistics
  const stats = {
    totalSent: 1247,
    delivered: 1189,
    read: 892,
    pending: 23,
    failed: 12,
    scheduled: 15,
    openRate: 75,
    clickRate: 42
  };

  // Notification templates
  const templates = [
    { id: 1, name: 'Module Completion', type: 'success', usage: 342 },
    { id: 2, name: 'Quiz Reminder', type: 'reminder', usage: 567 },
    { id: 3, name: 'Certificate Available', type: 'achievement', usage: 189 },
    { id: 4, name: 'Inactivity Alert', type: 'warning', usage: 78 },
    { id: 5, name: 'New Module Available', type: 'info', usage: 234 },
    { id: 6, name: 'System Update', type: 'announcement', usage: 45 }
  ];

  // Recent and scheduled notifications
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Module Completion Congratulations',
      message: 'Congratulations! You have successfully completed the ECG Basics module.',
      recipient: 'All Learners',
      recipientCount: 142,
      status: 'delivered',
      sentAt: '2025-10-08T11:30:00Z',
      readCount: 98,
      clickCount: 45,
      priority: 'normal',
      category: 'achievement'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Complete Your Module',
      message: 'You have an incomplete module: STEMI Recognition. Complete it to maintain your streak!',
      recipient: 'Inactive Students',
      recipientCount: 23,
      status: 'pending',
      scheduledFor: '2025-10-09T09:00:00Z',
      priority: 'high',
      category: 'reminder'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Certificate Ready',
      message: 'Your certificate for Advanced Arrhythmias is now available for download.',
      recipient: 'Charlie Brown',
      recipientCount: 1,
      status: 'read',
      sentAt: '2025-10-08T10:15:00Z',
      readCount: 1,
      clickCount: 1,
      priority: 'normal',
      category: 'achievement'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Low Quiz Score Alert',
      message: 'Your quiz score is below the passing threshold. Please review the material and retake.',
      recipient: 'Alice Williams',
      recipientCount: 1,
      status: 'delivered',
      sentAt: '2025-10-07T14:30:00Z',
      readCount: 0,
      clickCount: 0,
      priority: 'high',
      category: 'academic'
    },
    {
      id: 5,
      type: 'info',
      title: 'New ECG Module Available',
      message: 'A new module "Cardiac Emergency Protocols" has been added to your curriculum.',
      recipient: 'All Students',
      recipientCount: 156,
      status: 'delivered',
      sentAt: '2025-10-07T09:00:00Z',
      readCount: 134,
      clickCount: 98,
      priority: 'normal',
      category: 'announcement'
    },
    {
      id: 6,
      type: 'announcement',
      title: 'System Maintenance Scheduled',
      message: 'The platform will undergo scheduled maintenance on Oct 10, 2025 from 2:00 AM - 4:00 AM.',
      recipient: 'All Users',
      recipientCount: 200,
      status: 'scheduled',
      scheduledFor: '2025-10-10T00:00:00Z',
      priority: 'high',
      category: 'system'
    },
    {
      id: 7,
      type: 'success',
      title: 'Streak Milestone Achieved',
      message: 'Congratulations! You have maintained a 30-day learning streak!',
      recipient: 'Jane Smith',
      recipientCount: 1,
      status: 'delivered',
      sentAt: '2025-10-08T08:00:00Z',
      readCount: 1,
      clickCount: 1,
      priority: 'normal',
      category: 'achievement'
    },
    {
      id: 8,
      type: 'reminder',
      title: 'Quiz Deadline Approaching',
      message: 'Your quiz for Heart Blocks module is due in 24 hours.',
      recipient: 'Active Students',
      recipientCount: 45,
      status: 'scheduled',
      scheduledFor: '2025-10-08T18:00:00Z',
      priority: 'high',
      category: 'deadline'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
      case 'achievement':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'info':
      case 'announcement':
        return <Info className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
      case 'achievement':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reminder':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'info':
      case 'announcement':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Delivered</span>;
      case 'read':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Read</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'scheduled':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Scheduled</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Failed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMs < 0) {
      // Past date
      const absDiffMins = Math.abs(diffMins);
      const absDiffHours = Math.abs(diffHours);
      const absDiffDays = Math.abs(diffDays);
      
      if (absDiffMins < 60) return `${absDiffMins} min ago`;
      if (absDiffHours < 24) return `${absDiffHours} hours ago`;
      if (absDiffDays < 7) return `${absDiffDays} days ago`;
      return date.toLocaleDateString();
    } else {
      // Future date
      if (diffMins < 60) return `in ${diffMins} min`;
      if (diffHours < 24) return `in ${diffHours} hours`;
      if (diffDays < 7) return `in ${diffDays} days`;
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesStatus = filterStatus === 'all' || notif.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSelectNotification = (id) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(nId => nId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const handleBulkAction = (action) => {
    if (onActionClick) {
      onActionClick(`Bulk ${action}: ${selectedNotifications.length} notifications`);
    }
    setSelectedNotifications([]);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sent</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSent}</p>
              <p className="text-sm text-green-600 mt-1">+{stats.pending} pending</p>
            </div>
            <Send className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Delivery Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round((stats.delivered / stats.totalSent) * 100)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">{stats.delivered} delivered</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Open Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.openRate}%</p>
              <p className="text-sm text-gray-500 mt-1">{stats.read} opened</p>
            </div>
            <Eye className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Click Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.clickRate}%</p>
              <p className="text-sm text-green-600 mt-1">+5% this week</p>
            </div>
            <Target className="h-12 w-12 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Notification Center</h3>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowComposer(true);
                onActionClick && onActionClick('Create New Notification');
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Notification
            </button>
            
            <button
              onClick={() => onActionClick && onActionClick('Send Bulk Message')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Megaphone className="h-4 w-4 mr-2" />
              Broadcast
            </button>
            
            <button
              onClick={() => onActionClick && onActionClick('View Templates')}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Templates
            </button>
            
            <button
              onClick={() => onActionClick && onActionClick('Export Analytics')}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Templates Quick Access */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onActionClick && onActionClick(`Use Template: ${template.name}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  template.type === 'success' ? 'bg-green-100 text-green-800' :
                  template.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  template.type === 'reminder' ? 'bg-blue-100 text-blue-800' :
                  template.type === 'achievement' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {template.type}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Used {template.usage} times</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick && onActionClick(`Edit Template: ${template.name}`);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="reminder">Reminder</option>
              <option value="info">Info</option>
              <option value="achievement">Achievement</option>
              <option value="announcement">Announcement</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="delivered">Delivered</option>
              <option value="read">Read</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {selectedNotifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedNotifications.length} selected</span>
              <button
                onClick={() => handleBulkAction('Delete')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => handleBulkAction('Resend')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Resend
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications found matching your criteria</p>
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="flex items-center pb-3 border-b border-gray-200">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label className="ml-3 text-sm font-medium text-gray-700">
                  Select All ({filteredNotifications.length})
                </label>
              </div>

              {/* Notification Items */}
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-all ${
                    selectedNotifications.includes(notification.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900">{notification.title}</h4>
                            {getStatusBadge(notification.status)}
                            {notification.priority === 'high' && (
                              <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                                High Priority
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {notification.recipient} ({notification.recipientCount})
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {notification.sentAt ? formatDate(notification.sentAt) : formatDate(notification.scheduledFor)}
                            </div>
                            {notification.readCount !== undefined && (
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {notification.readCount} / {notification.recipientCount} read
                              </div>
                            )}
                            {notification.clickCount !== undefined && (
                              <div className="flex items-center">
                                <Target className="h-3 w-3 mr-1" />
                                {notification.clickCount} clicks
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => onActionClick && onActionClick(`View Notification ${notification.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onActionClick && onActionClick(`Edit Notification ${notification.id}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onActionClick && onActionClick(`Resend Notification ${notification.id}`)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                            title="Resend"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onActionClick && onActionClick(`Delete Notification ${notification.id}`)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Notification Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Notification</h3>
                <button
                  onClick={() => setShowComposer(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="info">Information</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="reminder">Reminder</option>
                  <option value="achievement">Achievement</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Users (200)</option>
                  <option value="learners">All Learners (156)</option>
                  <option value="instructors">All Instructors (12)</option>
                  <option value="admins">All Admins (4)</option>
                  <option value="active">Active Students (142)</option>
                  <option value="inactive">Inactive Students (14)</option>
                  <option value="struggling">Struggling Students (12)</option>
                  <option value="custom">Custom Selection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Notification title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="4"
                  placeholder="Notification message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="immediate">Send Immediately</option>
                    <option value="scheduled">Schedule for Later</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailNotif"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="emailNotif" className="text-sm text-gray-700">
                  Also send as email notification
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pushNotif"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="pushNotif" className="text-sm text-gray-700">
                  Send as push notification (if enabled)
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowComposer(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onActionClick && onActionClick('Send Notification');
                  setShowComposer(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="inline h-4 w-4 mr-2" />
                Send Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Delivery Performance</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Delivered</span>
                <span className="text-sm font-medium text-green-600">{stats.delivered}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-medium text-yellow-600">{stats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Failed</span>
                <span className="text-sm font-medium text-red-600">{stats.failed}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Engagement Metrics</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Open Rate</span>
                <span className="text-sm font-medium text-blue-600">{stats.openRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Click Rate</span>
                <span className="text-sm font-medium text-purple-600">{stats.clickRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Reads</span>
                <span className="text-sm font-medium text-green-600">{stats.read}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Schedule Status</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Scheduled</span>
                <span className="text-sm font-medium text-purple-600">{stats.scheduled}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Templates</span>
                <span className="text-sm font-medium text-blue-600">{templates.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Sent</span>
                <span className="text-sm font-medium text-gray-900">{stats.totalSent}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

