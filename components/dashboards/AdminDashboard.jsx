'use client';

import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import Badge from '../Badge';

const AdminDashboard = ({ modules = [] }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Unauthorized or failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        setError(String(e.message || e));
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="space-y-8">
      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Main Content */}
      {!loading && (
        <>
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded border shadow">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-semibold text-gray-900">{users.length}</div>
        </div>
        <div className="p-4 bg-white rounded border shadow">
          <div className="text-sm text-gray-600">Total Modules</div>
          <div className="text-2xl font-semibold text-gray-900">{modules.length}</div>
        </div>
        <div className="p-4 bg-white rounded border shadow">
          <div className="text-sm text-gray-600">Health</div>
          <div className="text-2xl font-semibold text-green-700">OK</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Users</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{u.name || '—'}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-2 text-sm">
                    <Badge variant={u.role === 'admin' ? 'danger' : u.role === 'instructor' ? 'warning' : 'primary'} size="sm">{u.role}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;



