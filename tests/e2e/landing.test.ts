import { test, expect } from '@playwright/test';

test('landing page loads with klaudiush heading', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toContainText('klaudiush');
});

test('landing page has link to error docs', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('a[href="/e/"]').first()).toBeVisible();
});

test('landing page has link to GitHub', async ({ page }) => {
	await page.goto('/');
	await expect(
		page.locator('a[href="https://github.com/smykla-skalski/klaudiush"]').first()
	).toBeVisible();
});
