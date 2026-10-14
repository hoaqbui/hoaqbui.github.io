import { test, expect } from "@playwright/test";

test.describe("M2 route transitions", () => {
  test("transition: push-in keeps the card name across the route", async ({ page }) => {
    await page.goto("/");

    // find the Building front card's view-transition-name (card-<id>)
    const frontCard = page.locator("#building [style*='view-transition-name']").first();
    await expect(frontCard).toBeVisible();

    const cardTransitionName = await frontCard.evaluate(
      (el) => window.getComputedStyle(el).viewTransitionName
    );
    expect(cardTransitionName).toMatch(/^card-/);

    // click "Read the project →"
    const readLink = page.locator('#building a:has-text("Read the project →")');
    await readLink.click();

    // wait for URL /building/<id>/
    const id = cardTransitionName.replace(/^card-/, "");
    await page.waitForURL(`**/building/${id}/`);

    // assert the project page's diagram card has the same view-transition-name
    const diagramCard = page.locator("[data-diagram-card]").first();
    await expect(diagramCard).toBeVisible();

    const diagramTransitionName = await diagramCard.evaluate(
      (el) => window.getComputedStyle(el).viewTransitionName
    );
    expect(diagramTransitionName).toBe(cardTransitionName);

    // then go back and assert the URL is "/" (with or without #building)
    await page.goBack();
    await page.waitForURL((url) => {
      const p = url.pathname;
      return p === "/" || p === "";
    });
    const backUrl = new URL(page.url());
    expect(backUrl.pathname).toBe("/");
    expect(["", "#building"]).toContain(backUrl.hash);
  });

  test("project round trip", async ({ page }) => {
    await page.goto("/");
    const readLink = page.locator('#building a:has-text("Read the project →")');
    await readLink.click();
    await expect(page).toHaveURL(/\/building\/[^/]+\/$/);
    await expect(page.locator("h1")).toBeVisible();
    const backLink = page.getByRole("link", { name: "← Building" });
    await backLink.click();
    await expect(page).toHaveURL(/#building$/);
    await expect(page.locator("#building")).toBeInViewport();
  });

  test("photos shows 9 frames", async ({ page }) => {
    await page.goto("/photos/");
    const toggle = page.getByRole("button", { name: /^Thumbnails/ });
    const text = await toggle.innerText();
    if (text.includes("off")) {
      await toggle.click();
    }
    const thumbs = page.locator('button[aria-label^="Show "]');
    await expect(thumbs).toHaveCount(9);
    const frameImg = page.locator('[aria-label="Photo carousel"] img').first();
    await expect(frameImg).toBeVisible();
    const alt = await frameImg.getAttribute("alt");
    expect(alt).toBeTruthy();
    expect(alt!.trim().length).toBeGreaterThan(0);
  });

  test("reduced motion: nothing animates, no canvas repaints", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of ["/", "/photos/"]) {
      await page.goto(path);
      await page.waitForTimeout(500);
      const runningCount = await page.evaluate(
        () => document.getAnimations().filter((a) => a.playState === "running").length
      );
      expect(runningCount).toBe(0);

      const canvasStill = await page.evaluate(async () => {
        const canvases = Array.from(document.querySelectorAll("canvas"));
        const befores = canvases.map((c) => c.toDataURL());
        await new Promise((r) => setTimeout(r, 1000));
        const afters = canvases.map((c) => c.toDataURL());
        return canvases.map((_, i) => befores[i] === afters[i]);
      });
      for (const still of canvasStill) {
        expect(still).toBe(true);
      }
    }
  });

  test("every auto-advancing loop has a pause control", async ({ page }) => {
    await page.goto("/");
    const topPause = page.locator("#top").getByRole("button", { name: /pause motion|play motion/i });
    await expect(topPause).toBeVisible();

    await page.goto("/photos/");
    const photosPause = page.getByRole("button", { name: /pause slideshow|play slideshow/i });
    await expect(photosPause).toBeVisible();

    await page.goto("/");
    await expect(page.locator("[data-ripple-mesh]")).toHaveCount(0);
  });

  test("theme survives a reload", async ({ page }) => {
    await page.goto("/");
    const switchDark = page.getByRole("button", { name: /switch to dark theme/i }).first();
    await switchDark.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const switchLight = page.getByRole("button", { name: /switch to light theme/i }).first();
    await switchLight.click();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
  });

  test("dark mode recolors the Building chips", async ({ page }) => {
    await page.goto("/");
    const chip = page
      .locator("#building article")
      .first()
      .locator("span")
      .filter({ hasText: /ComfyUI|LTX|multi-agent|PTZ/ })
      .first();
    await expect(chip).toBeVisible();

    const lightBg = await chip.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );

    const switchDark = page
      .getByRole("button", { name: /switch to dark theme/i })
      .first();
    await switchDark.click();

    const darkBg = await chip.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );

    expect(lightBg).not.toBe(darkBg);

    const switchLight = page
      .getByRole("button", { name: /switch to light theme/i })
      .first();
    await switchLight.click();
  });
});


test("Compo: try link and password-on-request mailto on intent-to-video", async ({ page }) => {
  for (const path of ["/", "/building/intent-to-video/"]) {
    await page.goto(path);
    const scope = path === "/" ? page.locator("#building") : page.locator("body");
    const tryLink = scope.getByRole("link", { name: "Try it in Compo ↗" });
    await expect(tryLink).toHaveAttribute("href", "https://mac-m4max.eel-terrapin.ts.net/");
    await expect(tryLink).toHaveAttribute("target", "_blank");
    await expect(scope.getByRole("link", { name: "Password on request" })).toHaveAttribute(
      "href",
      /^mailto:hoaqbui@gmail\.com\?subject=Compo%20password$/,
    );
  }
  await page.goto("/building/parti/");
  await expect(page.getByRole("link", { name: "Try it in Compo ↗" })).toHaveCount(0);
});
