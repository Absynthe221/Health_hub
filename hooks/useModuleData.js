'use client';

import { useState, useEffect } from 'react';
import { ecgAPI } from '../lib/api';

export const useModuleData = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const response = await ecgAPI.getModules();
        setModules(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return { modules, loading, error };
};

export const useModule = (moduleId) => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!moduleId) return;

    const fetchModule = async () => {
      try {
        setLoading(true);
        const response = await ecgAPI.getModule(moduleId);
        setModule(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching module:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  return { module, loading, error };
};

export const useProgress = (userId, moduleId) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !moduleId) return;

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await ecgAPI.getProgress(userId, moduleId);
        setProgress(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching progress:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId, moduleId]);

  const updateProgress = async (newProgress) => {
    try {
      const response = await ecgAPI.updateProgress(userId, moduleId, newProgress);
      setProgress(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating progress:', err);
      throw err;
    }
  };

  return { progress, loading, error, updateProgress };
};
