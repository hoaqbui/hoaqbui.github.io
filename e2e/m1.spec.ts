import { test, expect } from "@playwright/test";

test.describe("M1 P0 steps", () => {
  test("first screen answers who, role and how to reach", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const top = page.locator("#top");
    const who = top.getByText("Hoa Bui").first();
    const role = top.getByText("Senior Technical Product Manager").first();
    const linkedinLink = top.locator('a[href="https://www.linkedin.com/in/hoaqbui/"]').first();
    // Résumé opens an email draft that links the fresh PDF export of the public Doc.
    const resumeLink = top.locator('a[href^="mailto:"][href*="1s-OGEpBgFRViEk3mBTeSgL9CHzl-wdsOQKxoBNQtU7s"]').first();

    for (const locator of [who, role, linkedinLink, resumeLink]) {
      await expect(locator).toBeVisible();
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(844);
      }
    }
  });

  test("first proof number shows above the nav on a 390x664 phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 664 });
    await page.goto("/");
    const num = page.locator('section[aria-label="Proof"]').getByText("<1 hr").first();
    const numBox = await num.boundingBox();
    const navBox = await page.locator('nav[aria-label="Sections"]').boundingBox();
    expect(numBox).not.toBeNull();
    expect(navBox).not.toBeNull();
    if (numBox && navBox) expect(numBox.y + numBox.height).toBeLessThanOrEqual(navBox.y);
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
    const still = await page.evaluate(async () => {
      const c = document.querySelector("[data-hero-bg] canvas") as HTMLCanvasElement | null;
      if (!c) return true;
      const before = c.toDataURL();
      await new Promise((r) => setTimeout(r, 1000));
      return c.toDataURL() === before;
    });
    expect(still).toBe(true);
  });

  test("motion runs when allowed", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(600);
    const moving = await page.evaluate(async () => {
      if (document.getAnimations().some((a) => a.playState === "running")) return true;
      const c = document.querySelector("[data-hero-bg] canvas") as HTMLCanvasElement | null;
      if (!c) return false;
      const before = c.toDataURL();
      // Backgrounds drift slowly (half speed); poll for up to 2 s.
      for (let i = 0; i < 10; i++) {
        await new Promise((r) => setTimeout(r, 200));
        if (c.toDataURL() !== before) return true;
      }
      return false;
    });
    expect(moving).toBe(true);
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

  test("nav fits on a 320px phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    const nav = page.locator('nav[aria-label="Sections"]');
    await expect(nav).toBeVisible();
    const box = await nav.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(320);
    }
  });
});

test("the headline painted with the HTML is the one that stays (no remount after load)", async ({ page }) => {
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      (window as unknown as { __h1: Element | null }).__h1 = document.querySelector("h1");
    });
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const same = await page.evaluate(() => {
    const first = (window as unknown as { __h1: Element | null }).__h1;
    return !!first && first.isConnected && first === document.querySelector("h1");
  });
  expect(same).toBe(true);
});

test("industries, story tags and search data are on the page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-industries]")).toHaveText(
    "Film & VFX · Animation · Live-service games · Generative AI · Creative software",
  );
  await expect(page.locator("#work [data-story-tags]").first()).toContainText("Workflow automation");
  await expect(page.locator("#building").getByText("Generative video", { exact: true }).first()).toBeAttached();
  const person = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(person["@type"]).toBe("Person");
  expect(person.knowsAbout).toContain("Agentic AI");
  await expect(page.locator('meta[name="keywords"]')).toHaveAttribute("content", /Generative video/);
});
