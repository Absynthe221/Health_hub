'use client';

import React, { useState } from 'react';
import { Bell, Settings, Save, Plus, Trash2, Edit } from 'lucide-react';

export default function NotificationSystem() {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    weeklyDigest: true,
    monthlyReport: true,
    systemAlerts: true,
    userRegistration: true,
    moduleCompletion: false,
    performanceAlerts: true
  });

  const [notificationTemplates, setNotificationTemplates] = useState([
    {
      id: '1',
      name: 'Welcome Email',
      type: 'email',
      subject: 'Welcome to Health Hub ECG Platform',
      content: 'Welcome to our ECG learning platform! Get started with your first module.',
      enabled: true
    },
    {
      id: '2',
      name: 'Module Completion',
      type: 'email',
      subject: 'Module Completed Successfully',
      content: 'Congratulations! You have successfully completed the module.',
      enabled: true
    },
    {
      id: '3',
      name: 'System Maintenance',
      type: 'system',
      subject: 'Scheduled Maintenance Notice',
      content: 'System maintenance is scheduled for the specified time.',
      enabled: true
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'email',
    subject: '',
    content: '',
    enabled: true
  });

  const [showAddTemplate, setShowAddTemplate] = useState(false);

  const handleSettingChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSaveSettings = () => {
    // Implement save functionality
    console.log('Saving notification settings:', notificationSettings);
    // Show success message
    alert('Notification settings saved successfully!');
  };

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.subject && newTemplate.content) {
      const template = {
        ...newTemplate,
        id: Date.now().toString()
      };
      setNotificationTemplates(prev => [...prev, template]);
      setNewTemplate({
        name: '',
        type: 'email',
        subject: '',
        content: '',
        enabled: true
      });
      setShowAddTemplate(false);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    setNotificationTemplates(prev => prev.filter(template => template.id !== templateId));
  };

  const handleToggleTemplate = (templateId) => {
    setNotificationTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? { ...template, enabled: !template.enabled }
          : template
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification System</h2>
          <p className="text-gray-500">Configure notification preferences and templates</p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Methods</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={() => handleSettingChange('emailNotifications')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushNotifications}
                    onChange={() => handleSettingChange('pushNotifications')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Push Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={() => handleSettingChange('smsNotifications')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">SMS Notifications</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Types</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.userRegistration}
                    onChange={() => handleSettingChange('userRegistration')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">User Registration</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.moduleCompletion}
                    onChange={() => handleSettingChange('moduleCompletion')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Module Completion</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.performanceAlerts}
                    onChange={() => handleSettingChange('performanceAlerts')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Performance Alerts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notificationSettings.systemAlerts}
                    onChange={() => handleSettingChange('systemAlerts')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">System Alerts</span>
                </label>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Periodic Reports</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.weeklyDigest}
                  onChange={() => handleSettingChange('weeklyDigest')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Weekly Digest</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.monthlyReport}
                  onChange={() => handleSettingChange('monthlyReport')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Monthly Report</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Templates */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Notification Templates</h3>
          <button
            onClick={() => setShowAddTemplate(true)}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </button>
        </div>

        {notificationTemplates.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notification templates configured</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notificationTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        template.enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {template.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Subject:</strong> {template.subject}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Content:</strong> {template.content}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleTemplate(template.id)}
                      className={`p-2 rounded ${
                        template.enabled 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={template.enabled ? 'Disable' : 'Enable'}
                    >
                      <Bell className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Template Modal */}
      {showAddTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Notification Template</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template Type
                  </label>
                  <select
                    value={newTemplate.type}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter notification subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter notification content"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.enabled}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable this template</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddTemplate(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTemplate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Add Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}