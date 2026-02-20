import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm build && pnpm preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'tests/e2e',
	testMatch: '**/*.test.ts',
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
