// Shared users data for the ECG learning platform

// Mock user data
const users = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@healthhub.com',
    role: 'admin',
    modules: []
  },
  {
    id: '2', 
    name: 'Instructor User',
    email: 'instructor@healthhub.com',
    role: 'instructor',
    modules: []
  },
  {
    id: '3',
    name: 'Student User', 
    email: 'student@healthhub.com',
    role: 'learner',
    modules: []
  }
];

// Get all users
export function getUsers() {
  return users;
}

// Get user by ID
export function getUserById(id) {
  return users.find(user => user.id === id);
}

// Update user
export function updateUser(id, updates) {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  }
  return null;
}

// Update user modules
export function updateUserModules(userId, moduleUpdates) {
  const user = getUserById(userId);
  if (user) {
    user.modules = moduleUpdates;
    return user;
  }
  return null;
}