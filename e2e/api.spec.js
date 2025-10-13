import { test, expect } from '@playwright/test'

test.describe('API Endpoints E2E Tests', () => {
  test('API endpoints return valid JSON', async ({ request }) => {
    // Test learners API
    const learnersResponse = await request.get('/api/learners')
    expect(learnersResponse.ok()).toBeTruthy()
    const learnersData = await learnersResponse.json()
    expect(learnersData.success).toBe(true)
    expect(Array.isArray(learnersData.learners)).toBe(true)

    // Test courses API
    const coursesResponse = await request.get('/api/courses')
    expect(coursesResponse.ok()).toBeTruthy()
    const coursesData = await coursesResponse.json()
    expect(coursesData.success).toBe(true)
    expect(Array.isArray(coursesData.courses)).toBe(true)

    // Test notifications API
    const notificationsResponse = await request.get('/api/notifications')
    expect(notificationsResponse.ok()).toBeTruthy()
    const notificationsData = await notificationsResponse.json()
    expect(notificationsData.success).toBe(true)
    expect(Array.isArray(notificationsData.notifications)).toBe(true)

    // Test ECG exercises API
    const exercisesResponse = await request.get('/api/ecg/exercises')
    expect(exercisesResponse.ok()).toBeTruthy()
    const exercisesData = await exercisesResponse.json()
    expect(exercisesData.success).toBe(true)
    expect(Array.isArray(exercisesData.exercises)).toBe(true)
  })

  test('API endpoints handle query parameters', async ({ request }) => {
    // Test notifications with userId parameter
    const notificationsResponse = await request.get('/api/notifications?userId=learner-1&limit=5')
    expect(notificationsResponse.ok()).toBeTruthy()
    const notificationsData = await notificationsResponse.json()
    expect(notificationsData.success).toBe(true)

    // Test ECG exercises with difficulty filter
    const exercisesResponse = await request.get('/api/ecg/exercises?difficulty=beginner')
    expect(exercisesResponse.ok()).toBeTruthy()
    const exercisesData = await exercisesResponse.json()
    expect(exercisesData.success).toBe(true)
  })

  test('API endpoints return proper error responses', async ({ request }) => {
    // Test invalid endpoint
    const invalidResponse = await request.get('/api/invalid-endpoint')
    expect(invalidResponse.status()).toBe(404)
  })

  test('POST endpoints work correctly', async ({ request }) => {
    // Test creating a notification
    const notificationData = {
      userId: 'test-user',
      type: 'test',
      message: 'Test notification',
      priority: 'medium'
    }

    const response = await request.post('/api/notifications', {
      data: notificationData
    })

    expect(response.ok()).toBeTruthy()
    const responseData = await response.json()
    expect(responseData.success).toBe(true)
    expect(responseData.notification).toHaveProperty('id')
    expect(responseData.notification.message).toBe('Test notification')
  })
})
