import { test, expect } from '@playwright/test'

test.describe('Homepage E2E Tests', () => {
  test('homepage loads and displays main content', async ({ page }) => {
    await page.goto('/')
    
    // Check main heading
    await expect(page.getByText('Master ECG Interpretation')).toBeVisible()
    
    // Check description
    await expect(page.getByText('Comprehensive online learning platform')).toBeVisible()
    
    // Check features grid
    await expect(page.getByText('Interactive ECG Viewer')).toBeVisible()
    await expect(page.getByText('Comprehensive Curriculum')).toBeVisible()
    await expect(page.getByText('Assessment & Certification')).toBeVisible()
  })

  test('CTA buttons are clickable and navigate correctly', async ({ page }) => {
    await page.goto('/')
    
    // Wait for CTA buttons to load
    await page.waitForSelector('a:has-text("Start Learning")')
    
    // Test primary CTA
    const startLearningButton = page.getByRole('link', { name: 'Start Learning' })
    await expect(startLearningButton).toBeVisible()
    await startLearningButton.click()
    
    // Should navigate to dashboard
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('secondary CTA navigates to demo', async ({ page }) => {
    await page.goto('/')
    
    // Wait for secondary CTA to load
    await page.waitForSelector('a:has-text("View Demo")')
    
    const demoButton = page.getByRole('link', { name: 'View Demo' })
    await expect(demoButton).toBeVisible()
    await demoButton.click()
    
    // Should navigate to demo page
    await expect(page).toHaveURL(/.*demo/)
  })

  test('header navigation buttons work', async ({ page }) => {
    await page.goto('/')
    
    // Check header buttons
    await expect(page.getByRole('link', { name: 'Feedback' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible()
    
    // Test feedback link
    await page.getByRole('link', { name: 'Feedback' }).click()
    await expect(page).toHaveURL(/.*feedback/)
  })

  test('footer is present', async ({ page }) => {
    await page.goto('/')
    
    await expect(page.getByText('© 2024 Health Hub ECG. All rights reserved.')).toBeVisible()
    await expect(page.getByText('Built for healthcare professionals')).toBeVisible()
  })
})
