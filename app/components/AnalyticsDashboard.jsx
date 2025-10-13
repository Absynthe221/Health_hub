'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, BookOpen, Award, TrendingUp, Activity, Loader2, AlertCircle } from 'lucide-react';

/**
 * AnalyticsDashboard (Learner)
 * Displays high-level learning analytics for the current learner with loading/error handling.
 */
export default function AnalyticsDashboard({ fetchUrl = '/api/analytics/overview', className = '' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let didCancel = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(fetchUrl);
        const json = await res.json();
        if (!didCancel) {
          if (res.ok) setData(json);
          else setError(json?.error || 'Failed to load analytics');
        }
      } catch (e) {
        if (!didCancel) setError('Network error while loading analytics');
      } finally {
        if (!didCancel) setLoading(false);
      }
    };
    load();
    return () => { didCancel = true; };
  }, [fetchUrl]);

  const summary = useMemo(() => {
    const fallback = { totalModules: 0, completed: 0, avgScore: 0, hours: 0 };
    if (!data) return fallback;
    return {
      totalModules: data?.modules?.total || 0,
      completed: data?.modules?.completed || 0,
      avgScore: Math.round(data?.quizzes?.averageScore || 0),
      hours: Math.round((data?.engagement?.hours || 0) * 10) / 10,
    };
  }, [data]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Your Learning Analytics</h3>
          <span className="text-xs text-gray-500">{data?.timestamp ? new Date(data.timestamp).toLocaleString() : ''}</span>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading analytics...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-medium">Unable to load analytics</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.totalModules}</p>
              <p className="text-sm text-gray-500">Total Modules</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-2">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.avgScore}%</p>
              <p className="text-sm text-gray-500">Average Score</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-2">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.hours}</p>
              <p className="text-sm text-gray-500">Hours Studied</p>
            </div>
          </div>
        )}
      </div>

      {!loading && !error && data?.trends && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Trends</h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>7-day progress</span>
              <span>{data.trends.progress7d || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>30-day engagement</span>
              <span>{data.trends.engagement30d || 0} hrs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Users, BookOpen, Award, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

/**
 * AnalyticsDashboard
 * Lightweight analytics overview without external chart libs.
 * Accepts `initialData` or fetches from `fetchUrl` (default: /api/analytics/overview).
 */
export default function AnalyticsDashboard({ fetchUrl = '/api/analytics/overview', initialData = null, className = '' }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (initialData) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(fetchUrl);
        const json = await res.json();
        if (cancelled) return;
        if (res.ok) setData(json);
        else setError(json?.error || 'Failed to load analytics');
      } catch (e) {
        if (!cancelled) setError('Network error while loading analytics');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [fetchUrl, initialData]);

  const kpis = useMemo(() => {
    const overview = data?.overview || {};
    return [
      { label: 'Active Users', value: overview.activeUsers ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
      { label: 'Courses', value: overview.courses ?? 0, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' },
      { label: 'Avg Pass Rate', value: (overview.avgPassRate ?? 0) + '%', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
      { label: 'Growth (30d)', value: (overview.growth30d ?? 0) + '%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];
  }, [data]);

  const trend = useMemo(() => {
    const arr = data?.trend?.users ?? [];
    const max = Math.max(1, ...arr.map((p) => p.value || 0));
    return { arr, max };
  }, [data]);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
      </div>

      {loading && (
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading analytics...
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">Unable to load analytics</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k, idx) => {
              const Icon = k.icon;
              return (
                <div key={idx} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${k.bg}`}>
                      <Icon className={`w-6 h-6 ${k.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{k.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{k.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Users Trend (CSS bars) */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users - 30d</h3>
            {trend.arr.length === 0 ? (
              <p className="text-gray-500">No trend data</p>
            ) : (
              <div className="h-40 flex items-end space-x-1">
                {trend.arr.map((p, i) => (
                  <div key={i} className="flex-1">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${Math.max(4, (p.value / trend.max) * 100)}%` }}
                      title={`${p.label}: ${p.value}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Courses Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Courses</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="py-2 pr-4">Course</th>
                    <th className="py-2 pr-4">Enrollments</th>
                    <th className="py-2 pr-4">Completion</th>
                    <th className="py-2 pr-4">Pass Rate</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {(data?.topCourses ?? []).map((c, idx) => (
                    <tr key={idx} className="border-t border-gray-100">
                      <td className="py-2 pr-4 text-gray-900">{c.name}</td>
                      <td className="py-2 pr-4">{c.enrollments}</td>
                      <td className="py-2 pr-4">{c.completion}%</td>
                      <td className="py-2 pr-4">{c.passRate}%</td>
                    </tr>
                  ))}
                  {(data?.topCourses ?? []).length === 0 && (
                    <tr>
                      <td className="py-2 pr-4 text-gray-500" colSpan={4}>No course data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


