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
    const tryLink = scope.getByRole("link", { name: "Try Compo ↗" });
    await expect(tryLink).toHaveAttribute("href", "https://mac-m4max.eel-terrapin.ts.net/");
    await expect(tryLink).toHaveAttribute("target", "_blank");
    await expect(scope.getByRole("link", { name: "Password on request" })).toHaveAttribute(
      "href",
      /^mailto:hoaqbui@gmail\.com\?subject=Compo%20password$/,
    );
  }
  await page.goto("/building/parti/");
  await expect(page.getByRole("link", { name: "Try Compo ↗" })).toHaveCount(0);
});

test("Compo: both links share one line on a 360px phone card", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const card = page.locator("#building");
  const tryLink = card.getByRole("link", { name: "Try Compo ↗" });
  const pwLink = card.getByRole("link", { name: "Password on request" });
  await expect(tryLink).toBeVisible();
  await expect(pwLink).toBeVisible();
  const a = await tryLink.boundingBox();
  const b = await pwLink.boundingBox();
  expect(a && b && Math.abs(a.y - b.y)).toBeLessThan(2);
});

test.describe("Photos on home (card 65)", () => {
  test("band sits between Work and Contact", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("main > section[id], main section#photos, main #contact, main #work").evaluateAll((els) =>
      els.map((e) => e.id).filter((id) => ["work", "photos", "contact"].includes(id)),
    );
    expect([...new Set(ids)]).toEqual(["work", "photos", "contact"]);
    await expect(page.locator("#photos").getByRole("heading", { level: 2, name: "Photographs" })).toHaveCount(1);
  });

  test("pill Photos scrolls home to the band", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Photos" }).click();
    await expect(page.locator("#photos")).toBeInViewport();
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("home band images never load at high priority", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('#photos img[fetchpriority="high"]')).toHaveCount(0);
    await expect(page.locator("#photos img").first()).toHaveAttribute("loading", "lazy");
  });

  test("slides hold still while the band is off-screen", async ({ page }) => {
    await page.goto("/");
    const caption = page.locator("#photos [aria-label='Photo carousel'] h2").first();
    const before = await caption.textContent();
    await page.waitForTimeout(7000);
    expect(await caption.textContent()).toBe(before);
  });
});

test("pill marks Photos and goes dark on the /photos page", async ({ page }) => {
  await page.goto("/photos/");
  const nav = page.getByRole("navigation", { name: "Sections" });
  await expect(nav.locator("a[aria-current]")).toHaveText("Photos");
  await expect(nav.locator(":scope > div")).toHaveCSS("background-color", "rgba(13, 15, 16, 0.72)");
});
