import { test, expect } from '@playwright/test';

// Roles we want to verify
const roles = ['learner', 'instructor', 'admin'];

roles.forEach((role) => {
  test.describe(`${role} dashboard`, () => {
    test.beforeEach(async ({ page }) => {
      // ✅ Mock login endpoint
      await page.route('**/api/login', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, role })
        });
      });

      // ✅ Mock session endpoint
      await page.route('**/api/session', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: `user-${role}`,
            name: `${role} test user`,
            role
          })
        });
      });

      // ✅ Mock dependent API data
      await page.route('**/api/courses', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            courses: [{ id: 'c1', title: 'Intro Course' }],
            totalCourses: 1
          })
        });
      });

      await page.route('**/api/reports', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            activeUsers: 150,
            roleDistribution: { learners: 100, instructors: 30, admins: 20 },
            courseCompletionRates: [{ courseId: 'c1', rate: 0.85 }],
            quizPassRates: [{ quizId: 'q1', rate: 0.92 }]
          })
        });
      });

      await page.route('**/api/learners', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            learners: [{ id: 'u1', name: 'Mock User', email: 'test@example.com' }],
            totalLearners: 1
          })
        });
      });

      await page.route('**/api/instructors', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            instructors: [{ id: 'i1', name: 'Mock Instructor', email: 'instructor@example.com' }],
            totalInstructors: 1
          })
        });
      });

      await page.route('**/api/notifications', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            notifications: [
              { id: 'n1', message: 'Test notification', readStatus: false }
            ],
            stats: { total: 1, unread: 1 }
          })
        });
      });

      await page.route('**/api/leaderboard', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            leaderboard: [
              { rank: 1, learnerId: 'u1', name: 'Top Learner', points: 1000 }
            ]
          })
        });
      });

      // ✅ Pre-set role in localStorage for app bootstrapping
      await page.addInitScript((r) => {
        window.localStorage.setItem('healthhub_user', JSON.stringify({
          id: `user-${r}`,
          name: `${r} test user`,
          email: `${r}@example.com`,
          role: r
        }));
        window.localStorage.setItem('userRole', r);
      }, role);
    });

    test(`loads dashboard with mock login for ${role}`, async ({ page }) => {
      await page.goto(`/dashboard/${role}`);
      
      // Wait for the dashboard to load
      await page.waitForLoadState('networkidle');
      
      // Check for role-specific dashboard elements
      const header = await page.textContent('h1');
      expect(header.toLowerCase()).toContain(role);
      
      // Verify dashboard container exists
      await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible();
    });

    test(`shows appropriate content for ${role}`, async ({ page }) => {
      await page.goto(`/dashboard/${role}`);
      await page.waitForLoadState('networkidle');

      if (role === 'learner') {
        await expect(page.locator('text=My Courses')).toBeVisible();
        await expect(page.locator('text=Progress')).toBeVisible();
        await expect(page.locator('text=Exercises')).toBeVisible();
        await expect(page.locator('text=Badges')).toBeVisible();
        await expect(page.locator('text=Leaderboard')).toBeVisible();
      }
      
      if (role === 'instructor') {
        await expect(page.locator('text=My Courses')).toBeVisible();
        await expect(page.locator('text=Learners')).toBeVisible();
        await expect(page.locator('text=Reports')).toBeVisible();
        await expect(page.locator('text=Achievements')).toBeVisible();
      }
      
      if (role === 'admin') {
        await expect(page.locator('text=User Management')).toBeVisible();
        await expect(page.locator('text=Course Management')).toBeVisible();
        await expect(page.locator('text=Analytics')).toBeVisible();
        await expect(page.locator('text=System Settings')).toBeVisible();
      }
    });

    test(`dashboard navigation works for ${role}`, async ({ page }) => {
      await page.goto(`/dashboard/${role}`);
      await page.waitForLoadState('networkidle');

      // Test tab navigation within dashboard
      if (role === 'learner') {
        await page.click('text=Progress');
        await expect(page.locator('text=Learning Progress')).toBeVisible();
        
        await page.click('text=Exercises');
        await expect(page.locator('text=ECG Interpretation Exercises')).toBeVisible();
        
        await page.click('text=Badges');
        await expect(page.locator('text=Earned Badges')).toBeVisible();
      }

      if (role === 'instructor') {
        await page.click('text=Learners');
        await expect(page.locator('text=Learner Management')).toBeVisible();
        
        await page.click('text=Reports');
        await expect(page.locator('text=Performance Reports')).toBeVisible();
      }

      if (role === 'admin') {
        await page.click('text=Analytics');
        await expect(page.locator('text=System Analytics')).toBeVisible();
        
        await page.click('text=System Settings');
        await expect(page.locator('text=Platform Configuration')).toBeVisible();
      }
    });

    test(`dashboard shows role-specific data for ${role}`, async ({ page }) => {
      await page.goto(`/dashboard/${role}`);
      await page.waitForLoadState('networkidle');

      // Verify that API calls were made and data is displayed
      if (role === 'learner') {
        // Check for course data
        await expect(page.locator('text=Intro Course')).toBeVisible();
        // Check for notifications
        await expect(page.locator('text=Test notification')).toBeVisible();
      }

      if (role === 'instructor') {
        // Check for course management data
        await expect(page.locator('text=Intro Course')).toBeVisible();
        // Check for learner data
        await expect(page.locator('text=Mock User')).toBeVisible();
      }

      if (role === 'admin') {
        // Check for user data
        await expect(page.locator('text=Mock User')).toBeVisible();
        // Check for instructor data
        await expect(page.locator('text=Mock Instructor')).toBeVisible();
      }
    });

    test(`dashboard handles errors gracefully for ${role}`, async ({ page }) => {
      // Mock API errors
      await page.route('**/api/courses', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      await page.goto(`/dashboard/${role}`);
      await page.waitForLoadState('networkidle');

      // Dashboard should still load even with API errors
      const header = await page.textContent('h1');
      expect(header.toLowerCase()).toContain(role);
      
      // Error handling should be visible
      await expect(page.locator('text=Error loading data')).toBeVisible();
    });

    test(`dashboard is responsive for ${role}`, async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`/dashboard/${role}`);
      await page.waitForLoadState('networkidle');

      // Dashboard should be responsive
      await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible();
      
      // Navigation should work on mobile
      if (role === 'learner') {
        await page.click('text=Progress');
        await expect(page.locator('text=Learning Progress')).toBeVisible();
      }
    });
  });
});

// Additional cross-role tests
test.describe('Dashboard Cross-Role Tests', () => {
  test('role-based redirect works correctly', async ({ page }) => {
    // Test redirect from generic dashboard to role-specific dashboard
    await page.addInitScript(() => {
      window.localStorage.setItem('healthhub_user', JSON.stringify({
        id: 'user-learner',
        name: 'Test Learner',
        role: 'learner'
      }));
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to learner dashboard
    expect(page.url()).toContain('/dashboard/learner');
  });

  test('unauthorized access is handled', async ({ page }) => {
    // Clear localStorage to simulate no auth
    await page.addInitScript(() => {
      window.localStorage.clear();
    });

    await page.goto('/dashboard/learner');
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login or show unauthorized message
    await expect(page.locator('text=Unauthorized') || page.locator('text=Login')).toBeVisible();
  });
});