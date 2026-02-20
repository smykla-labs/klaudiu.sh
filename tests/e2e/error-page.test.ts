import { test, expect } from '@playwright/test';

test('GIT001 page renders error doc content', async ({ page }) => {
	await page.goto('/GIT001');
	await expect(page.locator('h1')).toContainText('GIT001');
	await expect(page.locator('text=Missing signoff flag')).toBeVisible();
});

test('git001 works (case-insensitive)', async ({ page }) => {
	await page.goto('/git001');
	await expect(page.locator('h1')).toContainText('GIT001');
});

test('SEC001 page renders', async ({ page }) => {
	await page.goto('/SEC001');
	await expect(page.locator('h1')).toContainText('SEC001');
	await expect(page.locator('text=API key detected')).toBeVisible();
});
