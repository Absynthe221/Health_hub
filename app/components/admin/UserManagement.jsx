'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  User,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Activity,
  Shield,
  Lock,
  Unlock,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

export default function UserManagement({ onActionClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // table or cards

  // User statistics
  const stats = {
    totalUsers: 200,
    activeUsers: 178,
    inactiveUsers: 22,
    admins: 4,
    instructors: 12,
    learners: 184,
    newThisMonth: 23,
    avgEngagement: 78
  };

  // Sample user data (in production, fetch from API)
  const users = [
    {
      id: 1,
      userId: 'user_001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      role: 'learner',
      status: 'active',
      enrolledDate: '2024-01-15T00:00:00Z',
      lastActive: '2025-10-08T10:30:00Z',
      modulesCompleted: 12,
      modulesTotal: 19,
      avgScore: 85,
      certificatesEarned: 8,
      totalTimeSpent: '18.5 hours',
      loginCount: 156,
      department: 'Cardiology',
      location: 'London, UK',
      avatar: null,
      emailVerified: true,
      twoFactorEnabled: false
    },
    {
      id: 2,
      userId: 'user_002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 234-5678',
      role: 'instructor',
      status: 'active',
      enrolledDate: '2024-01-10T00:00:00Z',
      lastActive: '2025-10-08T11:00:00Z',
      modulesCreated: 8,
      studentsManaged: 142,
      avgStudentScore: 78,
      totalTimeSpent: '45.2 hours',
      loginCount: 234,
      department: 'Medical Education',
      location: 'Manchester, UK',
      avatar: null,
      emailVerified: true,
      twoFactorEnabled: true
    },
    {
      id: 3,
      userId: 'user_003',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1 (555) 345-6789',
      role: 'admin',
      status: 'active',
      enrolledDate: '2024-01-05T00:00:00Z',
      lastActive: '2025-10-08T11:45:00Z',
      totalActions: 1547,
      usersManaged: 200,
      notificationsSent: 342,
      totalTimeSpent: '82.3 hours',
      loginCount: 456,
      department: 'IT Administration',
      location: 'Birmingham, UK',
      avatar: null,
      emailVerified: true,
      twoFactorEnabled: true
    },
    {
      id: 4,
      userId: 'user_004',
      firstName: 'Alice',
      lastName: 'Williams',
      email: 'alice.williams@example.com',
      phone: '+1 (555) 456-7890',
      role: 'learner',
      status: 'active',
      enrolledDate: '2024-02-15T00:00:00Z',
      lastActive: '2025-10-05T14:20:00Z',
      modulesCompleted: 5,
      modulesTotal: 19,
      avgScore: 58,
      certificatesEarned: 2,
      totalTimeSpent: '8.2 hours',
      loginCount: 42,
      department: 'Emergency Medicine',
      location: 'Leeds, UK',
      avatar: null,
      emailVerified: true,
      twoFactorEnabled: false
    },
    {
      id: 5,
      userId: 'user_005',
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.brown@example.com',
      phone: '+1 (555) 567-8901',
      role: 'learner',
      status: 'active',
      enrolledDate: '2024-01-05T00:00:00Z',
      lastActive: '2025-10-08T11:45:00Z',
      modulesCompleted: 18,
      modulesTotal: 19,
      avgScore: 95,
      certificatesEarned: 15,
      totalTimeSpent: '28.1 hours',
      loginCount: 289,
      department: 'Cardiology',
      location: 'Liverpool, UK',
      avatar: null,
      emailVerified: true,
      twoFactorEnabled: true
    },
    {
      id: 6,
      userId: 'user_006',
      firstName: 'Diana',
      lastName: 'Prince',
      email: 'diana.prince@example.com',
      phone: '+1 (555) 678-9012',
      role: 'instructor',
      status: 'active',
      enrolledDate: '2024-02-01T00:00:00Z',
      lastActive: '2025-10-08T09:15:00Z',
      modulesCreated: 12,
      studentsManaged: 98,
      avgStudentScore: 82,
      totalTimeSpent: '52.8 hours',
      loginCount: 178,
      department: 'Clinical Training',
      location: 'Edinburgh, UK',
      avatar: null,
      emailVerified: true,
      twoFactorEnabled: true
    },
    {
      id: 7,
      userId: 'user_007',
      firstName: 'Ethan',
      lastName: 'Hunt',
      email: 'ethan.hunt@example.com',
      phone: '+1 (555) 789-0123',
      role: 'learner',
      status: 'inactive',
      enrolledDate: '2024-03-10T00:00:00Z',
      lastActive: '2025-09-15T16:00:00Z',
      modulesCompleted: 3,
      modulesTotal: 19,
      avgScore: 62,
      certificatesEarned: 1,
      totalTimeSpent: '4.5 hours',
      loginCount: 18,
      department: 'General Medicine',
      location: 'Glasgow, UK',
      avatar: null,
      emailVerified: false,
      twoFactorEnabled: false
    },
    {
      id: 8,
      userId: 'user_008',
      firstName: 'Fiona',
      lastName: 'Green',
      email: 'fiona.green@example.com',
      phone: '+1 (555) 890-1234',
      role: 'learner',
      status: 'active',
      enrolledDate: '2024-01-20T00:00:00Z',
      lastActive: '2025-10-08T08:30:00Z',
      modulesCompleted: 14,
      modulesTotal: 19,
      avgScore: 88,
      certificatesEarned: 11,
      totalTimeSpent: '21.7 hours',
      loginCount: 203,
      department: 'Intensive Care',
      location: 'Cardiff, UK',
      avatar: null,
      emailVerified: true,
      twoFactorEnabled: true
    }
  ];

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      instructor: 'bg-purple-100 text-purple-800 border-purple-200',
      learner: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return badges[role] || badges.learner;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'instructor':
        return <BookOpen className="h-4 w-4" />;
      case 'learner':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;
    return formatDate(dateString);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uId => uId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleBulkAction = (action) => {
    if (onActionClick) {
      onActionClick(`Bulk ${action}: ${selectedUsers.length} users`);
    }
    setSelectedUsers([]);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditUser(true);
    if (onActionClick) {
      onActionClick(`Edit User: ${user.firstName} ${user.lastName}`);
    }
  };

  const handleDeleteUser = (user) => {
    if (onActionClick) {
      onActionClick(`Delete User: ${user.firstName} ${user.lastName}`);
    }
  };

  const UserModal = ({ user, onClose, mode }) => {
    if (!user && mode !== 'add') return null;
    
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === 'add' ? 'Add New User' : mode === 'edit' ? 'Edit User' : 'User Details'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue={user?.firstName}
                  placeholder="John"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue={user?.lastName}
                  placeholder="Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  defaultValue={user?.phone}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Role & Access */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Role & Access</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select 
                  defaultValue={user?.role}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="learner">Learner</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  defaultValue={user?.status}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending Verification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select 
                  defaultValue={user?.department}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Emergency Medicine">Emergency Medicine</option>
                  <option value="Intensive Care">Intensive Care</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Medical Education">Medical Education</option>
                  <option value="IT Administration">IT Administration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  defaultValue={user?.location}
                  placeholder="London, UK"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Security Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">Email Verified</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={user?.emailVerified}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={user?.twoFactorEnabled}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700">Account Active</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked={user?.status === 'active'}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {mode === 'add' && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onActionClick && onActionClick(`${mode === 'add' ? 'Create' : 'Update'} User`);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {mode === 'add' ? 'Create User' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">+{stats.newThisMonth} this month</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
              <p className="text-sm text-gray-500 mt-1">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active</p>
            </div>
            <UserCheck className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Learners</p>
              <p className="text-3xl font-bold text-gray-900">{stats.learners}</p>
              <p className="text-sm text-blue-600 mt-1">{stats.instructors} instructors</p>
            </div>
            <BookOpen className="h-12 w-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Engagement</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgEngagement}%</p>
              <p className="text-sm text-green-600 mt-1">+3% this week</p>
            </div>
            <Activity className="h-12 w-12 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowAddUser(true);
                onActionClick && onActionClick('Add New User');
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </button>
            
            <button
              onClick={() => onActionClick && onActionClick('Import Users from CSV')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </button>
            
            <button
              onClick={() => onActionClick && onActionClick('Export Users to CSV')}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
            
            <button
              onClick={() => {
                setViewMode(viewMode === 'table' ? 'cards' : 'table');
                onActionClick && onActionClick(`Switch to ${viewMode === 'table' ? 'Card' : 'Table'} View`);
              }}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              {viewMode === 'table' ? 'Card View' : 'Table View'}
            </button>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution by Role</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">2% of total</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Instructors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.instructors}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">6% of total</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Learners</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.learners}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">92% of total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="instructor">Instructors</option>
              <option value="learner">Learners</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {selectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedUsers.length} selected</span>
              <button
                onClick={() => handleBulkAction('Activate')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('Deactivate')}
                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('Delete')}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>

        {/* User List - Table View */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50 ${selectedUsers.includes(user.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            {user.emailVerified ? (
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 text-gray-400 mr-1" />
                            )}
                            {user.twoFactorEnabled && <Lock className="h-3 w-3 text-blue-500 mr-1" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full border ${getRoleBadge(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1 capitalize">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        {getTimeAgo(user.lastActive)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'learner' ? (
                        <div className="text-sm">
                          <div className="flex items-center mb-1">
                            <span className="text-gray-500 text-xs mr-2">Progress:</span>
                            <span className={`text-xs font-medium ${
                              user.avgScore >= 80 ? 'text-green-600' :
                              user.avgScore >= 70 ? 'text-blue-600' :
                              user.avgScore >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {user.modulesCompleted}/{user.modulesTotal}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 text-xs mr-2">Score:</span>
                            <span className={`text-xs font-medium ${
                              user.avgScore >= 80 ? 'text-green-600' :
                              user.avgScore >= 70 ? 'text-blue-600' :
                              'text-yellow-600'
                            }`}>
                              {user.avgScore}%
                            </span>
                          </div>
                        </div>
                      ) : user.role === 'instructor' ? (
                        <div className="text-sm">
                          <div className="text-xs text-gray-500">Students: {user.studentsManaged}</div>
                          <div className="text-xs text-gray-500">Modules: {user.modulesCreated}</div>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <div className="text-xs text-gray-500">Actions: {user.totalActions}</div>
                          <div className="text-xs text-gray-500">Logins: {user.loginCount}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onActionClick && onActionClick(`View ${user.firstName} ${user.lastName} Details`)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onActionClick && onActionClick(`Send Email to ${user.firstName} ${user.lastName}`)}
                          className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                          title="Email"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found matching your criteria</p>
              </div>
            )}
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div 
                key={user.id}
                className={`border rounded-lg p-6 hover:shadow-lg transition-shadow ${
                  selectedUsers.includes(user.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h4>
                      <p className="text-xs text-gray-500">{user.userId}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-3 w-3 mr-2 text-gray-400" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-3 w-3 mr-2 text-gray-400" />
                    {user.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                    {user.location}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 inline-flex items-center text-xs font-semibold rounded-full border ${getRoleBadge(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span className="ml-1 capitalize">{user.role}</span>
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>

                {user.role === 'learner' && (
                  <div className="mb-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Progress</span>
                      <span>{user.modulesCompleted}/{user.modulesTotal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (user.modulesCompleted / user.modulesTotal) >= 0.8 ? 'bg-green-500' :
                          (user.modulesCompleted / user.modulesTotal) >= 0.6 ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${(user.modulesCompleted / user.modulesTotal) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">Avg Score: {user.avgScore}%</span>
                      <span className="text-xs text-gray-500">
                        <Award className="inline h-3 w-3 mr-1" />
                        {user.certificatesEarned}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onActionClick && onActionClick(`View ${user.firstName} ${user.lastName}`)}
                    className="flex items-center text-xs text-green-600 hover:text-green-800"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => onActionClick && onActionClick(`Email ${user.firstName} ${user.lastName}`)}
                    className="flex items-center text-xs text-purple-600 hover:text-purple-800"
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="flex items-center text-xs text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddUser && (
        <UserModal 
          user={null} 
          onClose={() => setShowAddUser(false)} 
          mode="add" 
        />
      )}

      {showEditUser && editingUser && (
        <UserModal 
          user={editingUser} 
          onClose={() => {
            setShowEditUser(false);
            setEditingUser(null);
          }} 
          mode="edit" 
        />
      )}
    </div>
  );
}
