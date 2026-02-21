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

test('landing page code blocks have syntax highlighting', async ({ page }) => {
	await page.goto('/');
	// shiki wraps highlighted code in pre.shiki
	const shikiBlocks = page.locator('pre.shiki');
	await expect(shikiBlocks).toHaveCount(3);
	// tokens should have inline color styles from shiki
	const span = shikiBlocks.first().locator('span[style*="color"]').first();
	await expect(span).toBeVisible();
});
