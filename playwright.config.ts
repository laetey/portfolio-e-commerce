import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://automationexercise.com',
    testIdAttribute: 'data-qa',
    trace: 'retain-on-failure',
    video : 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      workers: 1,
      retries: 1,
    },
    {
      name: 'e2e',
      testMatch: '**/e2e/**/*.spec.ts',
    },
    {
      name: 'chromium',
      testMatch: '**/e2e/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    }, 
    {
      name: 'edge',
      testMatch: '**/e2e/**/*.spec.ts',
      use: { ...devices['Desktop Edge'] },
    }
  ],
});
