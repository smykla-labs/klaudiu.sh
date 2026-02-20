import { test, expect } from '@playwright/test';

test('landing page loads with category cards', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toContainText('klaudiush');
	await expect(page.locator('text=Git')).toBeVisible();
	await expect(page.locator('text=File')).toBeVisible();
	await expect(page.locator('text=Security')).toBeVisible();
});

test('landing page shows error code cards', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('text=GIT001')).toBeVisible();
	await expect(page.locator('text=SEC001')).toBeVisible();
	await expect(page.locator('text=FILE001')).toBeVisible();
});
