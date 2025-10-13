'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for real-time data management across dashboards
 * Provides automatic refresh, optimistic updates, and error handling
 */
export function useRealTimeData(endpoint, options = {}) {
  const {
    refreshInterval = 30000, // 30 seconds default
    autoRefresh = true,
    onError = null,
    onSuccess = null,
    dependencies = []
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
      setLastUpdated(new Date())
      
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (err) {
      setError(err.message)
      if (onError) {
        onError(err)
      }
    } finally {
      setLoading(false)
    }
  }, [endpoint, onError, onSuccess])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData, ...dependencies])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return

    const interval = setInterval(fetchData, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchData, refreshInterval, autoRefresh])

  // Optimistic update function
  const updateData = useCallback((updater) => {
    if (typeof updater === 'function') {
      setData(prevData => updater(prevData))
    } else {
      setData(updater)
    }
  }, [])

  // Refresh function for manual updates
  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    updateData
  }
}

/**
 * Hook for managing user progress data with real-time updates
 */
export function useUserProgress(userId, options = {}) {
  const endpoint = userId ? `/api/users/${userId}/progress` : '/api/progress'
  
  const { data, loading, error, refresh, updateData } = useRealTimeData(endpoint, {
    refreshInterval: 15000, // 15 seconds for progress
    ...options
  })

  const updateProgress = useCallback(async (moduleId, progress) => {
    // Optimistic update
    updateData(prevData => ({
      ...prevData,
      modules: prevData.modules.map(m => 
        m.moduleId === moduleId 
          ? { ...m, progress: { ...m.progress, ...progress } }
          : m
      )
    }))

    try {
      const response = await fetch(`/api/users/${userId}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, progress })
      })

      if (!response.ok) {
        // Revert optimistic update on error
        refresh()
        throw new Error('Failed to update progress')
      }
    } catch (err) {
      // Revert optimistic update on error
      refresh()
      throw err
    }
  }, [userId, updateData, refresh])

  return {
    progress: data,
    loading,
    error,
    updateProgress,
    refresh
  }
}

/**
 * Hook for managing module data with real-time updates
 */
export function useModules(options = {}) {
  const { data, loading, error, refresh, updateData } = useRealTimeData('/api/modules', {
    refreshInterval: 60000, // 1 minute for modules
    ...options
  })

  const updateModule = useCallback(async (moduleId, updates) => {
    // Optimistic update
    updateData(prevData => ({
      ...prevData,
      modules: prevData.modules.map(m => 
        m.moduleId === moduleId 
          ? { ...m, ...updates, updatedAt: new Date().toISOString() }
          : m
      )
    }))

    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        // Revert optimistic update on error
        refresh()
        throw new Error('Failed to update module')
      }
    } catch (err) {
      // Revert optimistic update on error
      refresh()
      throw err
    }
  }, [updateData, refresh])

  const createModule = useCallback(async (moduleData) => {
    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleData)
      })

      if (!response.ok) {
        throw new Error('Failed to create module')
      }

      const newModule = await response.json()
      
      // Add to data optimistically
      updateData(prevData => ({
        ...prevData,
        modules: [...prevData.modules, newModule]
      }))

      return newModule
    } catch (err) {
      refresh()
      throw err
    }
  }, [updateData, refresh])

  return {
    modules: data?.modules || [],
    loading,
    error,
    updateModule,
    createModule,
    refresh
  }
}

/**
 * Hook for managing user data with real-time updates
 */
export function useUsers(options = {}) {
  const { data, loading, error, refresh, updateData } = useRealTimeData('/api/users', {
    refreshInterval: 60000, // 1 minute for users
    ...options
  })

  const updateUser = useCallback(async (userId, updates) => {
    // Optimistic update
    updateData(prevData => ({
      ...prevData,
      users: prevData.users.map(u => 
        u.id === userId 
          ? { ...u, ...updates, updatedAt: new Date().toISOString() }
          : u
      )
    }))

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        // Revert optimistic update on error
        refresh()
        throw new Error('Failed to update user')
      }
    } catch (err) {
      // Revert optimistic update on error
      refresh()
      throw err
    }
  }, [updateData, refresh])

  const deleteUser = useCallback(async (userId) => {
    // Optimistic update
    updateData(prevData => ({
      ...prevData,
      users: prevData.users.filter(u => u.id !== userId)
    }))

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        // Revert optimistic update on error
        refresh()
        throw new Error('Failed to delete user')
      }
    } catch (err) {
      // Revert optimistic update on error
      refresh()
      throw err
    }
  }, [updateData, refresh])

  return {
    users: data?.users || [],
    loading,
    error,
    updateUser,
    deleteUser,
    refresh
  }
}

/**
 * Hook for managing notifications with real-time updates
 */
export function useNotifications(userId, options = {}) {
  const endpoint = `/api/notifications${userId ? `?userId=${userId}` : ''}`
  
  const { data, loading, error, refresh, updateData } = useRealTimeData(endpoint, {
    refreshInterval: 10000, // 10 seconds for notifications
    ...options
  })

  const markAsRead = useCallback(async (notificationId) => {
    // Optimistic update
    updateData(prevData => ({
      ...prevData,
      notifications: prevData.notifications.map(n => 
        n.id === notificationId 
          ? { ...n, read: true, readAt: new Date().toISOString() }
          : n
      )
    }))

    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      })

      if (!response.ok) {
        // Revert optimistic update on error
        refresh()
        throw new Error('Failed to mark notification as read')
      }
    } catch (err) {
      // Revert optimistic update on error
      refresh()
      throw err
    }
  }, [updateData, refresh])

  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    updateData(prevData => ({
      ...prevData,
      notifications: prevData.notifications.map(n => 
        !n.read 
          ? { ...n, read: true, readAt: new Date().toISOString() }
          : n
      )
    }))

    try {
      const response = await fetch(`/api/notifications/read-all${userId ? `?userId=${userId}` : ''}`, {
        method: 'PUT'
      })

      if (!response.ok) {
        // Revert optimistic update on error
        refresh()
        throw new Error('Failed to mark all notifications as read')
      }
    } catch (err) {
      // Revert optimistic update on error
      refresh()
      throw err
    }
  }, [updateData, refresh, userId])

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh
  }
}

/**
 * Hook for WebSocket-based real-time updates
 */
export function useWebSocket(url, options = {}) {
  const {
    onMessage = null,
    onError = null,
    onOpen = null,
    onClose = null,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5
  } = options

  const [socket, setSocket] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  useEffect(() => {
    if (!url) return

    const ws = new WebSocket(url)
    
    ws.onopen = (event) => {
      setSocket(ws)
      setConnectionStatus('connected')
      setReconnectAttempts(0)
      if (onOpen) onOpen(event)
    }

    ws.onmessage = (event) => {
      if (onMessage) {
        try {
          const data = JSON.parse(event.data)
          onMessage(data)
        } catch (err) {
          onMessage(event.data)
        }
      }
    }

    ws.onerror = (event) => {
      setConnectionStatus('error')
      if (onError) onError(event)
    }

    ws.onclose = (event) => {
      setSocket(null)
      setConnectionStatus('disconnected')
      if (onClose) onClose(event)

      // Attempt to reconnect
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          setReconnectAttempts(prev => prev + 1)
        }, reconnectInterval)
      }
    }

    return () => {
      ws.close()
    }
  }, [url, reconnectAttempts, maxReconnectAttempts, reconnectInterval, onMessage, onError, onOpen, onClose])

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(typeof message === 'string' ? message : JSON.stringify(message))
    }
  }, [socket])

  return {
    socket,
    connectionStatus,
    sendMessage,
    reconnectAttempts
  }
}

