import fs from "node:fs";
import { test, expect } from "@playwright/test";

test.describe("/prototyping/ page", () => {
  // Test 1: For widths 390×844, 768×1024, 1440×900 and color schemes light and dark:
  // no horizontal scroll, no console errors or page errors.
  const viewports = [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ];
  const colorSchemes = ["light", "dark"] as const;

  for (const { width, height } of viewports) {
    for (const scheme of colorSchemes) {
      test(`no horizontal scroll, console errors or page errors at ${width}x${height} (${scheme})`, async ({
        page,
      }) => {
        const errors: string[] = [];
        page.on("console", (msg) => {
          if (msg.type() === "error") {
            errors.push(`Console error: ${msg.text()}`);
          }
        });
        page.on("pageerror", (err) => {
          errors.push(`Page error: ${err.message}`);
        });

        if (scheme === "dark") {
          await page.addInitScript(() => localStorage.setItem("theme", "dark"));
        }

        await page.setViewportSize({ width, height });
        const res = await page.goto("/prototyping/");
        expect(res?.status()).toBe(200);

        const h1 = page.locator("h1");
        await expect(h1).toHaveCount(1);
        await expect(h1).toHaveText("How I prototype");

        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const innerWidth = await page.evaluate(() => window.innerWidth);
        expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
        expect(errors).toEqual([]);
      });
    }
  }

  // Test 2: At 390×844, without scrolling: h1, [data-thesis], img[data-hero] and [data-count] are within viewport.
  test("at 390x844 without scrolling: h1, [data-thesis], img[data-hero] and [data-count] are within viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const res = await page.goto("/prototyping/");
    expect(res?.status()).toBe(200);

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("How I prototype");

    const thesis = page.locator("[data-thesis]");
    const heroImg = page.locator("img[data-hero]");
    const count = page.locator("[data-count]");

    for (const locator of [h1, thesis, heroImg, count]) {
      await expect(locator).toBeVisible();
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.y + box.height).toBeLessThanOrEqual(844);
      }
    }
  });

  // Test 3: Every img in main has non-empty alt.
  test("every img in main has non-empty alt", async ({ page }) => {
    const res = await page.goto("/prototyping/");
    expect(res?.status()).toBe(200);

    const main = page.locator("main");
    await expect(main).toBeVisible();
    const images = main.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt!.trim().length).toBeGreaterThan(0);
    }
  });

  // Test 4: Every [data-row] has >= 2 [data-frame]; every [data-row-type="round"] has exactly one [data-mark="kept"];
  // every [data-mark="cut"] frame has a non-empty [data-why].
  test("row and frame invariants: frames per row, kept mark in round rows, why in cut frames", async ({
    page,
  }) => {
    const res = await page.goto("/prototyping/");
    expect(res?.status()).toBe(200);

    const rows = page.locator("[data-row]");
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const frames = row.locator("[data-frame]");
      expect(await frames.count()).toBeGreaterThanOrEqual(2);

      const rowType = await row.getAttribute("data-row-type");
      if (rowType === "round") {
        const keptMarks = row.locator('[data-mark="kept"]');
        await expect(keptMarks).toHaveCount(1);
      }
    }

    const cutMarks = page.locator('[data-mark="cut"]');
    const cutCount = await cutMarks.count();
    expect(cutCount).toBeGreaterThan(0);

    for (let i = 0; i < cutCount; i++) {
      const mark = cutMarks.nth(i);
      const frame = mark.locator("xpath=ancestor-or-self::*[@data-frame]").first();
      const why = frame.locator("[data-why]");
      await expect(why).toBeVisible();
      const text = await why.innerText();
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });

  // Test 5: Word count of main innerText <= 900 (count /[\w’'-]+/g matches).
  test("word count of main innerText is <= 900", async ({ page }) => {
    const res = await page.goto("/prototyping/");
    expect(res?.status()).toBe(200);

    const main = page.locator("main");
    await expect(main).toBeVisible();
    const text = await main.innerText();
    const words = text.match(/[\w’'-]+/g) || [];
    expect(words.length).toBeGreaterThan(0);
    expect(words.length).toBeLessThanOrEqual(900);
  });

  // Test 6: meta[property="og:title"], meta[property="og:image"] present; meta[property="og:url"] content is https://hoa.flamme.us/prototyping/.
  test("Open Graph meta tags are present with correct og:url", async ({ page }) => {
    const res = await page.goto("/prototyping/");
    expect(res?.status()).toBe(200);

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveCount(1);
    const titleContent = await ogTitle.getAttribute("content");
    expect(titleContent).toBeTruthy();
    expect(titleContent!.trim().length).toBeGreaterThan(0);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveCount(1);
    const imageContent = await ogImage.getAttribute("content");
    expect(imageContent).toBeTruthy();
    expect(imageContent!.trim().length).toBeGreaterThan(0);

    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveCount(1);
    await expect(ogUrl).toHaveAttribute("content", "https://hoa.flamme.us/prototyping/");
  });

  // Test 7: With reducedMotion: 'reduce' (browser context option), after load and scrolling to bottom and back,
  // document.getAnimations().filter(a => a.playState === 'running').length === 0.
  test.describe("reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("no running animations after load and scrolling to bottom and back", async ({ page }) => {
      const res = await page.goto("/prototyping/");
      expect(res?.status()).toBe(200);
      await page.waitForLoadState("load");

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);

      const runningCount = await page.evaluate(
        () => document.getAnimations().filter((a) => a.playState === "running").length
      );
      expect(runningCount).toBe(0);
    });
  });

  // Test 8: If ../design/prototyping/work/deny.txt exists (path relative to the site folder; use fs.existsSync),
  // no line of it (case-insensitive) appears in main innerText; if absent, test.skip with a reason.
  test("no denied terms appear in main innerText", async ({ page }) => {
    const denyPath = "../design/prototyping/work/deny.txt";
    if (!fs.existsSync(denyPath)) {
      test.skip(true, "CI has no deny file");
      return;
    }

    const res = await page.goto("/prototyping/");
    expect(res?.status()).toBe(200);

    const main = page.locator("main");
    await expect(main).toBeVisible();
    const text = (await main.innerText()).toLowerCase();

    const denyLines = fs
      .readFileSync(denyPath, "utf-8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    for (const line of denyLines) {
      expect(text).not.toContain(line.toLowerCase());
    }
  });

  // Test 9: From /, the link with href="/prototyping/" inside #how navigates to /prototyping/ and the h1 is visible.
  test("from /, the link with href='/prototyping/' inside #how navigates to /prototyping/ and h1 is visible", async ({
    page,
  }) => {
    await page.goto("/");
    const link = page.locator('#how a[href="/prototyping/"]');
    await expect(link).toBeVisible();
    await link.click();
    await page.waitForURL("**/prototyping/");
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText("How I prototype");
  });

  // Test 10: Throttled 4G at 390×844: use page.context().newCDPSession(page), Network.enable,
  // Network.emulateNetworkConditions {offline:false, downloadThroughput: 1.6e6/8, uploadThroughput: 750e3/8, latency: 150};
  // sum encodedDataLength from Network.loadingFinished until the load event; expect total <= 1_000_000 bytes and load time <= 3000 ms.
  test("throttled 4G at 390x844: transfer <= 1MB and load time <= 3000ms", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: 1.6e6 / 8,
      uploadThroughput: 750e3 / 8,
      latency: 150,
    });

    let totalBytes = 0;
    let pageLoaded = false;
    page.once("load", () => {
      pageLoaded = true;
    });

    cdp.on("Network.loadingFinished", (event: { encodedDataLength: number }) => {
      if (!pageLoaded) {
        totalBytes += event.encodedDataLength;
      }
    });

    const start = Date.now();
    const res = await page.goto("/prototyping/", { waitUntil: "load" });
    pageLoaded = true;
    const duration = Date.now() - start;

    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("How I prototype");

    expect(totalBytes).toBeLessThanOrEqual(1_000_000);
    expect(duration).toBeLessThanOrEqual(3000);
  });
});
