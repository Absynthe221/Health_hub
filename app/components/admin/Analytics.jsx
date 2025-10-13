'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';

export default function Analytics() {
  const [analyticsData] = useState({
    userEngagement: [
      { month: 'Jan', users: 120, completions: 340 },
      { month: 'Feb', users: 135, completions: 420 },
      { month: 'Mar', users: 156, completions: 580 }
    ],
    moduleStats: [
      { name: 'Module 1', completions: 89, avgScore: 87 },
      { name: 'Module 2', completions: 76, avgScore: 92 },
      { name: 'Module 3', completions: 65, avgScore: 85 }
    ]
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">System performance and learning analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">User Engagement</h3>
          <div className="space-y-4">
            {analyticsData.userEngagement.map((data) => (
              <div key={data.month} className="flex justify-between items-center">
                <span className="font-medium">{data.month}</span>
                <div className="flex space-x-4">
                  <span className="text-sm text-gray-600">{data.users} users</span>
                  <span className="text-sm text-blue-600">{data.completions} completions</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Module Performance</h3>
          <div className="space-y-4">
            {analyticsData.moduleStats.map((module) => (
              <div key={module.name} className="flex justify-between items-center">
                <span className="font-medium">{module.name}</span>
                <div className="flex space-x-4">
                  <span className="text-sm text-gray-600">{module.completions} completed</span>
                  <span className="text-sm text-green-600">{module.avgScore}% avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

