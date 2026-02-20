import { test, expect } from '@playwright/test';

test('landing page loads with category cards', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toContainText('klaudiush');
	// Category card titles
	await expect(page.locator('[data-slot="card-title"]', { hasText: 'Git' }).first()).toBeVisible();
	await expect(
		page.locator('[data-slot="card-title"]', { hasText: 'File' }).first()
	).toBeVisible();
	await expect(
		page.locator('[data-slot="card-title"]', { hasText: 'Security' }).first()
	).toBeVisible();
});

test('landing page shows error code cards', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('text=GIT001').first()).toBeVisible();
	await expect(page.locator('text=SEC001').first()).toBeVisible();
	await expect(page.locator('text=FILE001').first()).toBeVisible();
});
