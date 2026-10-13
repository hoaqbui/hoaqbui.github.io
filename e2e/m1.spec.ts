import { test, expect } from "@playwright/test";

test.describe("M1 P0 steps", () => {
  test("first screen answers who, role and how to reach", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const top = page.locator("#top");
    const who = top.getByText("Hoa Bui").first();
    const role = top.getByText("Senior Technical Product Manager").first();
    const emailLink = top.locator('a[href="mailto:hoaqbui@gmail.com"]').first();
    const resumeLink = top.locator('a[href="/hoa-bui-resume.pdf"]').first();

    for (const locator of [who, role, emailLink, resumeLink]) {
      await expect(locator).toBeVisible();
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(844);
      }
    }
  });

  test("no horizontal scroll at 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    await page.waitForLoadState("load");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });

  test("story link opens that story", async ({ page }) => {
    await page.goto("/#greybox");
    await expect(page.locator("#greybox button[aria-expanded]").first()).toHaveAttribute("aria-expanded", "true");
  });

  test("reduced motion stops every animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length)).toBe(0);
  });

  test("motion runs when allowed", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length)).toBeGreaterThan(0);
  });

  test("no placeholder text ships", async ({ page }) => {
    await page.goto("/");
    const storyButtons = page.locator("#work article h3 button");
    const count = await storyButtons.count();
    for (let i = 0; i < count; i++) {
      await storyButtons.nth(i).click();
      const bodyText = await page.locator("body").innerText();
      expect(bodyText).not.toContain("[ ");
    }
  });

  test("one story open at a time", async ({ page }) => {
    await page.goto("/");
    await page.locator("#cosmetics h3 button").click();
    await page.locator("#okr h3 button").click();
    await expect(page.locator('#work button[aria-expanded="true"]')).toHaveCount(1);
  });
});
