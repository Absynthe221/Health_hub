'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Database, 
  Cpu, 
  HardDrive,
  Activity,
  RefreshCw
} from 'lucide-react';

export default function PipelineDashboard() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchPipelineStatus();
    const interval = setInterval(fetchPipelineStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPipelineStatus = async () => {
    try {
      const response = await fetch('/api/pipeline/status');
      const data = await response.json();
      setStatus(data.status);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pipeline status:', error);
      setLoading(false);
    }
  };

  const runPipeline = async () => {
    setRunning(true);
    try {
      const response = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dryRun: false,
          skipAI: false,
          skipSegmentation: false 
        })
      });
      
      const result = await response.json();
      if (result.success) {
        addLog('Pipeline started successfully', 'success');
      } else {
        addLog(`Pipeline failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`Pipeline error: ${error.message}`, 'error');
    } finally {
      setRunning(false);
    }
  };

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), { timestamp, message, type }]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pipeline Unavailable</h3>
          <p className="text-gray-600">Unable to connect to pipeline services</p>
          <button
            onClick={fetchPipelineStatus}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 inline mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Status Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Content Pipeline</h2>
          <div className="flex space-x-3">
            <button
              onClick={fetchPipelineStatus}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 inline mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={runPipeline}
              disabled={running}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {running ? (
                <>
                  <Pause className="h-4 w-4 inline mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 inline mr-2" />
                  Run Pipeline
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Modules</p>
                <p className="text-2xl font-bold text-blue-900">
                  {status.modules?.processed || 0}/{status.modules?.total || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Cpu className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">AI Services</p>
                <p className="text-2xl font-bold text-green-900">
                  {Math.round((status.ai?.successRate || 0) * 100)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Uptime</p>
                <p className="text-2xl font-bold text-purple-900">
                  {Math.floor((status.system?.uptime || 0) / 3600)}h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <HardDrive className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">Disk Usage</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {status.system?.diskUsage?.percentage || '0%'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Services Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Services Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(status.ai?.services || {}).map(([service, info]) => (
              <div
                key={service}
                className={`p-3 rounded-lg border ${
                  info.available 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center">
                  {getStatusIcon(info.available ? 'success' : 'error')}
                  <span className="ml-2 text-sm font-medium capitalize">
                    {service.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logs */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent activity</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-center text-sm">
                    {getLogIcon(log.type)}
                    <span className="ml-2 text-gray-500">{log.timestamp}</span>
                    <span className="ml-2 text-gray-900">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Processing Stages</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">PPTX Conversion</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Video Segmentation</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">AI Enhancement</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Content Validation</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Deployment</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">AI Features</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Adaptive Quiz Generation</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Case Study Creation</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Content Validation</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Learning Path Generation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

