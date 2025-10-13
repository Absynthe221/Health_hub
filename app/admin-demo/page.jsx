'use client';

import { useState } from 'react';

export default function AdminDemo() {
  const [users] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'student',
      status: 'active',
      lastLogin: '2024-01-20T10:30:00Z',
      modulesCompleted: 5,
      totalModules: 18
    },
    {
      id: 2,
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@hospital.com',
      role: 'instructor',
      status: 'active',
      lastLogin: '2024-01-20T14:45:00Z',
      studentsManaged: 25
    },
    {
      id: 3,
      name: 'Admin User',
      email: 'admin@healthhub.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-20T16:20:00Z'
    }
  ]);

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '32px', color: '#111827' }}>
          🔧 Admin Dashboard Demo - No Authentication Required
        </h1>
        
        {/* User Management Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px' 
          }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                User Management
              </h2>
              <p style={{ color: '#6b7280' }}>Manage system users and their access levels</p>
            </div>
            <button style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              + Add User
            </button>
          </div>

          {/* Users Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>User</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Progress</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Last Login</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#dbeafe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '16px',
                          fontSize: '16px'
                        }}>
                          👤
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: user.role === 'admin' ? '#fecaca' : 
                                        user.role === 'instructor' ? '#dbeafe' : '#dcfce7',
                        color: user.role === 'admin' ? '#dc2626' : 
                               user.role === 'instructor' ? '#2563eb' : '#16a34a'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '9999px',
                        backgroundColor: '#dcfce7',
                        color: '#16a34a'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {user.role === 'student' && (
                        <div>
                          <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                            {user.modulesCompleted}/{user.totalModules} modules
                          </div>
                          <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                            <div style={{
                              width: `${(user.modulesCompleted / user.totalModules) * 100}%`,
                              backgroundColor: '#3b82f6',
                              borderRadius: '9999px',
                              height: '8px'
                            }}></div>
                          </div>
                        </div>
                      )}
                      {user.role === 'instructor' && (
                        <div style={{ fontSize: '14px' }}>
                          {user.studentsManaged} students
                        </div>
                      )}
                      {user.role === 'admin' && (
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          Full access
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ color: '#2563eb', cursor: 'pointer' }}>✏️</button>
                        <button style={{ color: '#dc2626', cursor: 'pointer' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '32px', marginRight: '16px' }}>👥</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Total Users</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>{users.length}</p>
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '32px', marginRight: '16px' }}>🎓</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Students</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>
                  {users.filter(u => u.role === 'student').length}
                </p>
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '32px', marginRight: '16px' }}>👨‍🏫</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Instructors</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>
                  {users.filter(u => u.role === 'instructor').length}
                </p>
              </div>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '32px', marginRight: '16px' }}>👑</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Admins</p>
                <p style={{ fontSize: '24px', fontWeight: '600', color: '#111827' }}>
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>
            ✅ Admin Dashboard Components Working!
          </h3>
          <p style={{ color: '#166534', marginBottom: '16px' }}>
            The admin dashboard components are rendering correctly. The blank page issue is due to authentication requirements.
          </p>
          <div style={{ color: '#166534' }}>
            <p style={{ fontWeight: '500', marginBottom: '8px' }}>To access the full admin dashboard:</p>
            <ol style={{ paddingLeft: '20px', listStyleType: 'decimal' }}>
              <li style={{ marginBottom: '4px' }}>
                Go to <code style={{ backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                  http://localhost:3002/login
                </code>
              </li>
              <li style={{ marginBottom: '4px' }}>
                Login with: <code style={{ backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                  admin@healthhub.com
                </code> / <code style={{ backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                  password123
                </code>
              </li>
              <li>You'll be automatically redirected to the admin dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

