import { test, expect } from '@playwright/test';

test('INVALID001 returns 404', async ({ page }) => {
	const response = await page.goto('/e/INVALID001');
	expect(response?.status()).toBe(404);
});

test('random path returns 404', async ({ page }) => {
	const response = await page.goto('/random/path');
	expect(response?.status()).toBe(404);
});

test('GIT alone returns 404', async ({ page }) => {
	const response = await page.goto('/e/GIT');
	expect(response?.status()).toBe(404);
});
