/**
 * Example E2E Test
 * End-to-end tests for the home page
 */

import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load and display the homepage', async ({ page }) => {
    await page.goto('/en')

    // Check if the page title is correct
    await expect(page).toHaveTitle(/Slate/)

    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: 'Slate Template' })).toBeVisible()

    // Check if features list is visible
    await expect(page.getByText(/Swappable CMS Architecture/i)).toBeVisible()
  })

  test('should have correct language attributes', async ({ page }) => {
    await page.goto('/en')

    const htmlElement = page.locator('html')
    await expect(htmlElement).toHaveAttribute('lang', 'en')
    await expect(htmlElement).toHaveAttribute('dir', 'ltr')
  })

  test('should support RTL for Arabic', async ({ page }) => {
    await page.goto('/ar')

    const htmlElement = page.locator('html')
    await expect(htmlElement).toHaveAttribute('lang', 'ar')
    await expect(htmlElement).toHaveAttribute('dir', 'rtl')
  })
})

test.describe('SEO and Metadata', () => {
  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/en')

    // Check for viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]')
    await expect(viewportMeta).toHaveAttribute('content', /width=device-width/)
  })

  test('should have sitemap and robots.txt', async ({ page }) => {
    // Check sitemap
    const sitemapResponse = await page.request.get('/sitemap.xml')
    expect(sitemapResponse.status()).toBe(200)
    expect(sitemapResponse.headers()['content-type']).toContain('xml')

    // Check robots.txt
    const robotsResponse = await page.request.get('/robots.txt')
    expect(robotsResponse.status()).toBe(200)
    expect(robotsResponse.headers()['content-type']).toContain('text/plain')
  })
})
