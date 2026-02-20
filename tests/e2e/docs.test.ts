import { test, expect } from '@playwright/test';

test('docs hub loads with Documentation heading and guide cards', async ({ page }) => {
	await page.goto('/docs/');
	await expect(page.locator('h1')).toContainText('Documentation');
	await expect(
		page.locator('[data-slot="card-title"]', { hasText: 'Dynamic rules' }).first()
	).toBeVisible();
	await expect(
		page.locator('[data-slot="card-title"]', { hasText: 'Backup system' }).first()
	).toBeVisible();
	await expect(
		page.locator('[data-slot="card-title"]', { hasText: 'Plugin development' }).first()
	).toBeVisible();
});

test('docs hub shows ADR section', async ({ page }) => {
	await page.goto('/docs/');
	await expect(page.locator('h2', { hasText: 'Architecture decision records' })).toBeVisible();
	await expect(page.locator('text=ADR-0001').first()).toBeVisible();
});

test('rules guide renders with syntax-highlighted code', async ({ page }) => {
	await page.goto('/docs/rules');
	await expect(page.locator('h1')).toContainText('Dynamic rules');
	const shikiBlocks = page.locator('pre.shiki');
	await expect(shikiBlocks.first()).toBeVisible();
	const span = shikiBlocks.first().locator('span[style*="color"]').first();
	await expect(span).toBeVisible();
});

test('backup guide renders', async ({ page }) => {
	await page.goto('/docs/backup');
	await expect(page.locator('h1')).toContainText('Backup system');
	await expect(page.locator('h2', { hasText: 'Overview' })).toBeVisible();
});

test('plugins guide renders', async ({ page }) => {
	await page.goto('/docs/plugins');
	await expect(page.locator('h1')).toContainText('Plugin development');
	await expect(page.locator('h2', { hasText: 'Protocol reference' })).toBeVisible();
});

test('sessions guide renders', async ({ page }) => {
	await page.goto('/docs/sessions');
	await expect(page.locator('h1')).toContainText('Session tracking');
	await expect(page.locator('h2', { hasText: 'Unpoisoning' })).toBeVisible();
});

test('exceptions guide renders', async ({ page }) => {
	await page.goto('/docs/exceptions');
	await expect(page.locator('h1')).toContainText('Exception workflow');
	await expect(page.locator('h2', { hasText: 'Token format' })).toBeVisible();
});

test('guide page has sidebar on desktop', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 720 });
	await page.goto('/docs/rules');
	const sidebar = page.locator('aside');
	await expect(sidebar).toBeVisible();
	await expect(sidebar.locator('a', { hasText: 'Dynamic rules' })).toBeVisible();
	await expect(sidebar.locator('a', { hasText: 'Backup system' })).toBeVisible();
});

test('ADR listing page shows ADRs with status badges', async ({ page }) => {
	await page.goto('/docs/adr/');
	await expect(page.locator('h1')).toContainText('Architecture decision records');
	await expect(page.locator('text=ADR-0001').first()).toBeVisible();
	await expect(page.locator('[data-slot="badge"]', { hasText: 'accepted' }).first()).toBeVisible();
});

test('ADR detail page renders with accepted badge', async ({ page }) => {
	await page.goto('/docs/adr/0001');
	await expect(page.locator('h1')).toContainText('ADR-0001');
	await expect(page.locator('[data-slot="badge"]', { hasText: 'accepted' })).toBeVisible();
	await expect(page.locator('h2', { hasText: 'Context' })).toBeVisible();
});

test('changelog page renders with version entries', async ({ page }) => {
	await page.goto('/docs/changelog');
	await expect(page.locator('h1')).toContainText('Changelog');
	// Changelog should have version headings (h2 elements from markdown)
	await expect(page.locator('.markdown-content h2').first()).toBeVisible();
});

test('nonexistent guide returns 404', async ({ page }) => {
	const response = await page.goto('/docs/nonexistent');
	expect(response?.status()).toBe(404);
});

test('nonexistent ADR returns 404', async ({ page }) => {
	const response = await page.goto('/docs/adr/9999');
	expect(response?.status()).toBe(404);
});

test('navbar has Docs link pointing to /docs/', async ({ page }) => {
	await page.goto('/');
	const docsLink = page.locator('nav a[href="/docs/"]');
	await expect(docsLink).toBeVisible();
	await expect(docsLink).toContainText('Docs');
});
