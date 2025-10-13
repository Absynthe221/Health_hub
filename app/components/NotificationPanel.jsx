'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

/**
 * NotificationPanel
 * Reusable panel showing notifications with read/unread state and error handling.
 */
export default function NotificationPanel({
  fetchUrl = '/api/notifications',
  initialItems = null,
  onMarkRead,
  onDismiss,
  className = ''
}) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(!initialItems);
  const [error, setError] = useState(null);

  useEffect(() => {
    let didCancel = false;
    const load = async () => {
      if (initialItems) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(fetchUrl);
        const data = await res.json();
        if (!didCancel) {
          if (res.ok) setItems(Array.isArray(data.notifications) ? data.notifications : []);
          else setError(data?.error || 'Failed to load notifications');
        }
      } catch (e) {
        if (!didCancel) setError('Network error while loading notifications');
      } finally {
        if (!didCancel) setLoading(false);
      }
    };
    load();
    return () => {
      didCancel = true;
    };
  }, [fetchUrl, initialItems]);

  const unreadCount = useMemo(() => (items || []).filter(n => !n.read).length, [items]);

  const handleMarkRead = async (id) => {
    setItems((prev) => (prev || []).map(n => n.id === id ? { ...n, read: true } : n));
    if (typeof onMarkRead === 'function') onMarkRead(id);
  };

  const handleDismiss = async (id) => {
    setItems((prev) => (prev || []).filter(n => n.id !== id));
    if (typeof onDismiss === 'function') onDismiss(id);
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700">
          {unreadCount} unread
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading notifications...
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">Unable to load notifications</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (!items || items.length === 0) && (
        <div className="text-center text-gray-500 py-8">No notifications</div>
      )}

      {!loading && !error && items && items.length > 0 && (
        <ul className="divide-y divide-gray-100">
          {items.map((n) => (
            <li key={n.id} className="py-3 flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {n.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : n.type === 'error' ? (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                ) : (
                  <Bell className="w-5 h-5 text-gray-400 mt-0.5" />
                )}
                <div>
                  <p className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{n.title}</p>
                  {n.message && (
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  )}
                  {n.timestamp && (
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!n.read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => handleDismiss(n.id)}
                  className="text-xs px-2 py-1 rounded-md bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  Dismiss
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


