import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL: "http://127.0.0.1:4173",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm exec serve out -l tcp://127.0.0.1:4173 --no-clipboard",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
  },
});
