import { defineConfig, devices } from '@playwright/test';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5173';
const backendURL = process.env.PLAYWRIGHT_BACKEND_URL || 'http://127.0.0.1:5000';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: [
    {
      command: 'node ./scripts/e2e-backend.mjs',
      cwd: __dirname,
      url: `${backendURL}/api/health`,
      timeout: 120_000,
      reuseExistingServer: false
    },
    {
      command: 'node ./scripts/e2e-frontend.mjs',
      cwd: __dirname,
      url: frontendURL,
      timeout: 120_000,
      reuseExistingServer: false
    }
  ],
  use: {
    baseURL: frontendURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
