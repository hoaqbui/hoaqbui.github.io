import { test, expect } from "@playwright/test";

test.describe("M1 P0 steps", () => {
  test("first screen answers who, role and how to reach", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const top = page.locator("#top");
    const who = top.getByText("Hoa Bui").first();
    const role = top.getByText("Technical Product Manager").first();
    // Résumé, LinkedIn and email all live in the nav Contact sheet (user, 2026-10-19);
    // Résumé is still the public Doc itself, never an email draft (tester, 2026-10-16).
    const contact = page.getByRole("navigation", { name: "Sections" }).getByRole("button", { name: "Contact" });

    for (const locator of [who, role, contact]) {
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
    await expect(page.locator("button#greybox")).toHaveAttribute("aria-expanded", "true");
  });

  test("reduced motion stops every animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running").length)).toBe(0);
    // the hero shows its photograph and waits to be asked for the shot
    await expect(page.locator("[data-hero-frame]")).toHaveAttribute("data-hero-frame", "photo");
    await expect(page.getByRole("button", { name: "Play the shot" })).toBeVisible();
    const still = await page.evaluate(async () => {
      const c = document.querySelector("[data-hero-shot-scan]") as HTMLCanvasElement | null;
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
    // the hero's pixel scan runs on its own once the frame is on screen
    await expect(page.locator("[data-hero-shot-scan]")).toHaveAttribute("data-hero-shot-scan", "running");
  });

  test("no placeholder text ships", async ({ page }) => {
    await page.goto("/");
    const tiles = page.locator("#work button[aria-controls='work-story']");
    const count = await tiles.count();
    for (let i = 0; i < count; i++) {
      await tiles.nth(i).click();
      const bodyText = await page.locator("body").innerText();
      expect(bodyText).not.toContain("[ ");
    }
  });

  test("one story open at a time", async ({ page }) => {
    await page.goto("/");
    await page.locator("button#cosmetics").click();
    await page.locator("button#okr").click();
    await expect(page.locator('#work button[aria-expanded="true"]')).toHaveCount(1);
    await expect(page.locator("#work-story article")).toHaveCount(1);
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

test("structured data and search keywords are on the page", async ({ page }) => {
  await page.goto("/");
  const person = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(person["@type"]).toBe("Person");
  expect(person.knowsAbout).toContain("Agentic AI");
  await expect(page.locator('meta[name="keywords"]')).toHaveAttribute("content", /Generative video/);
});

test("the nav pill is opaque, so page text never shows through it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const alpha = await page.getByRole("navigation", { name: "Sections" }).locator(":scope > div").evaluate((el) => {
    const c = document.createElement("canvas").getContext("2d")!;
    c.fillStyle = getComputedStyle(el).backgroundColor;
    c.fillRect(0, 0, 1, 1);
    return c.getImageData(0, 0, 1, 1).data[3];
  });
  expect(alpha).toBe(255);
});

test.describe("Homepage redesign", () => {
  test("sections run Hero, Work, How I work, Now, Contact; old bands are gone", async ({ page }) => {
    await page.goto("/");
    const ids = await page
      .locator("main #top, main #work, main #how, main #now, main #contact")
      .evaluateAll((els) => els.map((e) => e.id));
    expect(ids).toEqual(["top", "work", "how", "now", "contact"]);
    await expect(page.locator("#building")).toHaveCount(0);
    await expect(page.locator("#photos")).toHaveCount(0);
  });

  test("nav lists the five sections", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Sections" });
    const links = nav.getByRole("link");
    await expect(links).toHaveText(["About", "Impact", "How I work", "Now"]);
    // Contact opens the contact sheet instead of scrolling (user, 2026-10-19)
    await expect(nav.getByRole("button", { name: "Contact" })).toHaveAttribute("aria-haspopup", "dialog");
  });

  test("hero has a headline, no stats row and no pause-motion button", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("#top h1");
    await expect(h1).toBeVisible();
    expect((await h1.innerText()).trim().length).toBeGreaterThan(0);
    await expect(page.locator('section[aria-label="Proof"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: /pause motion/i })).toHaveCount(0);
    // the Latest chip left the hero (user, 2026-10-18)
    await expect(page.locator("#top [data-latest]")).toHaveCount(0);
  });

  test("Work has four tiles; a tile opens its story, sets the hash, and closes again", async ({ page }) => {
    await page.goto("/");
    const tiles = page.locator("#work button[aria-controls='work-story']");
    await expect(tiles).toHaveCount(4);
    for (const id of ["greybox", "scripting", "okr", "cosmetics"]) {
      await expect(page.locator(`button#${id}`)).toHaveAttribute("aria-expanded", "false");
    }
    await expect(page.locator("#work-story article")).toHaveCount(0);

    const tile = page.locator("button#okr");
    await tile.click();
    await expect(tile).toHaveAttribute("aria-expanded", "true");
    const article = page.locator("#work-story article");
    await expect(article).toBeVisible();
    expect((await article.getByRole("heading", { level: 3 }).innerText()).trim().length).toBeGreaterThan(0);
    expect(await page.evaluate(() => location.hash)).toBe("#okr");

    await tile.click();
    await expect(tile).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#work-story article")).toHaveCount(0);
    expect(await page.evaluate(() => location.hash)).toBe("#work");
  });

  test("arriving at /#scripting opens the scripting story", async ({ page }) => {
    await page.goto("/#scripting");
    await expect(page.locator("button#scripting")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#work-story article")).toBeVisible();
    await expect(page.locator('#work button[aria-expanded="true"]')).toHaveCount(1);
  });

  test("a story opens right under its tile on a phone, under its row on desktop", async ({ page }) => {
    // user bug report, 2026-10-18: the story opened below all four tiles
    for (const [width, below] of [[390, ["cosmetics"]], [1280, []]] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.locator("#work button#okr").click();
      const article = page.locator("#work-story article");
      await expect(article).toBeVisible();
      const gap = await page.evaluate(() =>
        document.querySelector("#work-story article")!.getBoundingClientRect().top -
        document.getElementById("okr")!.getBoundingClientRect().bottom);
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(gap).toBeLessThan(40);
      const after = await page.evaluate(() => {
        const top = document.querySelector("#work-story article")!.getBoundingClientRect().top;
        return [...document.querySelectorAll("#work button[aria-controls]")]
          .filter((t) => t.getBoundingClientRect().top > top).map((t) => t.id);
      });
      expect(after).toEqual(below);
    }
  });

  test("How I work has three steps", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#how").getByRole("heading", { level: 2, name: "How I work" })).toBeVisible();
    await expect(page.locator("#how ol").first().locator("> li")).toHaveCount(3);
    // the career timeline under the steps (card 89): three studios, then AI
    await expect(page.locator("#how [data-career-timeline] li")).toHaveCount(4);
  });

  test("Contact shows the quote, email and links", async ({ page }) => {
    await page.goto("/");
    const quote = page.locator("#contact blockquote");
    await expect(quote).toBeVisible();
    expect((await quote.innerText()).trim().length).toBeGreaterThan(0);
    await expect(page.locator('#contact a[href^="mailto:"]')).toBeVisible();
    await expect(page.locator("#contact").getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/building/");
  });

  test("/building/ lists three projects, each with a Read the project link", async ({ page }) => {
    await page.goto("/building/");
    await expect(page.locator("main article, article")).toHaveCount(3);
    const reads = page.getByRole("link", { name: "Read the project →" });
    await expect(reads).toHaveCount(3);
    for (const href of await reads.evaluateAll((els) => els.map((e) => e.getAttribute("href")))) {
      expect(href).toMatch(/^\/building\/[^/]+\/$/);
    }
  });
});
