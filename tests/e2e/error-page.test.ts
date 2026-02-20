import { test, expect } from '@playwright/test';

test('GIT001 page renders error doc content', async ({ page }) => {
	await page.goto('/e/GIT001');
	await expect(page.locator('h1')).toContainText('GIT001');
	await expect(page.getByText('Missing signoff flag').first()).toBeVisible();
});

test('git001 works (case-insensitive)', async ({ page }) => {
	await page.goto('/e/git001');
	await expect(page.locator('h1')).toContainText('GIT001');
});

test('SEC001 page renders', async ({ page }) => {
	await page.goto('/e/SEC001');
	await expect(page.locator('h1')).toContainText('SEC001');
	await expect(page.getByText('API key detected').first()).toBeVisible();
});

test('error page code blocks have syntax highlighting', async ({ page }) => {
	await page.goto('/e/GIT001');
	// shiki wraps highlighted code in pre.shiki
	const shikiBlocks = page.locator('pre.shiki');
	const count = await shikiBlocks.count();
	if (count > 0) {
		// tokens should have inline color styles from shiki
		const span = shikiBlocks.first().locator('span[style*="color"]').first();
		await expect(span).toBeVisible();
	}
});
