import { test, expect } from "@playwright/test";

// Simulate a browser that refuses autoplay but accepts a direct user gesture.
const blockAutoPlay = (page: import("@playwright/test").Page) =>
  page.addInitScript(() => {
    const nativePlay = HTMLMediaElement.prototype.play;
    let tapped = false;
    window.addEventListener("pointerdown", () => { tapped = true; }, { capture: true });
    window.addEventListener("keydown", () => { tapped = true; }, { capture: true });
    HTMLMediaElement.prototype.play = function () {
      if (!tapped) {
        return Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
      }
      return nativePlay.call(this);
    };
  });

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

    // the project page's lead element (the diagram card, or the screenshot/clips hero on a
    // page that has them) carries the same view-transition-name
    const diagramCard = page.locator("[data-clips], [data-hero-shot], [data-diagram-card]").first();
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

  test("photos shows 15 frames", async ({ page }) => {
    await page.goto("/photos/");
    const thumbs = page.locator('button[aria-label^="Show "]');
    await expect(thumbs).toHaveCount(15);
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
  // measured with the web font: before it loads, the slightly wider fallback can wrap them
  await expect
    .poll(async () => {
      const a = await tryLink.boundingBox();
      const b = await pwLink.boundingBox();
      return a && b ? Math.abs(a.y - b.y) : 99;
    })
    .toBeLessThan(2);
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
    await page.locator("#photos").scrollIntoViewIfNeeded();
    await expect(page.locator("#photos img").first()).toBeAttached();
    await expect(page.locator('#photos img[fetchpriority="high"]')).toHaveCount(0);
    await expect(page.locator("#photos img").first()).toHaveAttribute("loading", "lazy");
  });

  test("slides hold still while the band is off-screen, play once it's in view", async ({ page }) => {
    await page.goto("/");
    const caption = page.locator("#photos [data-photo-caption] h2");
    const first = await caption.textContent();
    await page.waitForTimeout(7000);
    expect(await caption.textContent()).toBe(first);
    await page.locator("#photos").scrollIntoViewIfNeeded();
    await expect.poll(() => caption.textContent(), { timeout: 9000 }).not.toBe(first);
  });

  test("jumping to Contact doesn't shift the page", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Contact" }).click();
    // wait for the smooth scroll to finish
    let last = -1;
    await expect.poll(async () => {
      const y = await page.evaluate(() => scrollY);
      const settled = y === last;
      last = y;
      return settled;
    }, { intervals: [250] }).toBe(true);
    const top1 = await page.locator("#contact").evaluate((el) => el.getBoundingClientRect().top);
    await page.waitForTimeout(1500);
    const top2 = await page.locator("#contact").evaluate((el) => el.getBoundingClientRect().top);
    expect(Math.abs(top2 - top1)).toBeLessThan(2);
  });
});

test("pill marks Photos and goes dark on the /photos page", async ({ page }) => {
  await page.goto("/photos/");
  const nav = page.getByRole("navigation", { name: "Sections" });
  await expect(nav.locator("a[aria-current]")).toHaveText("Photos");
  await expect(nav.locator(":scope > div")).toHaveCSS("background-color", "rgb(13, 15, 16)");
});

test.describe("Page fades to black around Photos (card 66)", () => {
  test("background goes light → black → light across the band", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    // body background's red channel, read back through a canvas (computed colors come as oklab)
    const lum = () =>
      page.evaluate(() => {
        const c = document.createElement("canvas").getContext("2d")!;
        c.fillStyle = getComputedStyle(document.body).backgroundColor;
        c.fillRect(0, 0, 1, 1);
        return c.getImageData(0, 0, 1, 1).data[0];
      });
    const at = (expr: string) => page.evaluate((e) => window.scrollTo(0, eval(e)), expr);
    await at("0");
    await expect.poll(lum).toBeGreaterThan(240);
    // band's top 30% down the screen: fully dark
    await at("document.getElementById('photos').getBoundingClientRect().top + scrollY - innerHeight * 0.3");
    await expect.poll(lum).toBeLessThan(20);
    // band's top just below the middle of the screen: partway
    await at("document.getElementById('photos').getBoundingClientRect().top + scrollY - innerHeight * 0.58");
    await expect.poll(lum).toBeGreaterThan(40);
    await expect.poll(lum).toBeLessThan(220);
    // end of the page: light again
    await at("document.documentElement.scrollHeight");
    await expect.poll(lum).toBeGreaterThan(240);
  });

  test("on a tall screen the band stays dark while centered and the page ends light", async ({ page }) => {
    await page.setViewportSize({ width: 783, height: 1323 });
    await page.goto("/");
    const red = () =>
      page.evaluate(() => {
        const c = document.createElement("canvas").getContext("2d")!;
        c.fillStyle = getComputedStyle(document.body).backgroundColor;
        c.fillRect(0, 0, 1, 1);
        return c.getImageData(0, 0, 1, 1).data[0];
      });
    await page.evaluate(() => {
      const r = document.getElementById("photos")!.getBoundingClientRect();
      window.scrollTo(0, r.top + scrollY + r.height / 2 - innerHeight / 2);
    });
    await expect.poll(red).toBeLessThan(20);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(red).toBeGreaterThan(240);
  });

  test("/photos loads at full dark", async ({ page }) => {
    await page.goto("/photos/");
    const red = await page.evaluate(() => {
      const c = document.createElement("canvas").getContext("2d")!;
      c.fillStyle = getComputedStyle(document.body).backgroundColor;
      c.fillRect(0, 0, 1, 1);
      return c.getImageData(0, 0, 1, 1).data[0];
    });
    expect(red).toBeLessThan(20);
  });

  test("Work's quote stays readable through the fade", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    let worst = 21;
    for (let f = 1.25; f >= 0.35; f -= 0.05) {
      await page.evaluate((f) => window.scrollTo(0, document.getElementById("photos")!.getBoundingClientRect().top + scrollY - innerHeight * f), f);
      await page.waitForTimeout(60);
      const ratio = await page.evaluate(() => {
        const rgb = (css: string) => {
          const c = document.createElement("canvas").getContext("2d")!;
          c.fillStyle = css;
          c.fillRect(0, 0, 1, 1);
          return Array.from(c.getImageData(0, 0, 1, 1).data.slice(0, 3));
        };
        const lum = ([r, g, b]: number[]) => {
          const ch = (v: number) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
          return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
        };
        const q = document.querySelector("#work blockquote p")!;
        const a = lum(rgb(getComputedStyle(q).color));
        const b = lum(rgb(getComputedStyle(document.body).backgroundColor));
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      });
      worst = Math.min(worst, ratio);
    }
    expect(worst).toBeGreaterThan(3);
  });

  test("thumbnail strip hides its scrollbar", async ({ page }) => {
    await page.goto("/photos/");
    const strip = page.locator('button[aria-label^="Show "]').first().locator("xpath=..");
    await expect(strip).toHaveCSS("scrollbar-width", "none");
  });
});

test("clicking empty hero space swaps the background; links don't", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const bg = page.locator("[data-hero-bg]");
  await expect(bg).toBeAttached();
  await page.waitForTimeout(300);
  for (let i = 0; i < 3; i++) {
    const before = await bg.getAttribute("data-hero-bg");
    const box = (await page.locator("#top").boundingBox())!;
    await page.mouse.click(box.x + 30, box.y + box.height - 30);
    await expect(bg).not.toHaveAttribute("data-hero-bg", before!);
  }
  const before = await bg.getAttribute("data-hero-bg");
  const [popup] = await Promise.all([
    page.waitForEvent("popup").catch(() => null),
    page.locator("#top").getByRole("link", { name: /LinkedIn/ }).click(),
  ]);
  await popup?.close();
  await expect(bg).toHaveAttribute("data-hero-bg", before!);
});

test("project diagrams read at normal size on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const id of ["intent-to-video", "parti", "himmelcam"]) {
    await page.goto(`/building/${id}/`);
    const portrait = page.locator("[data-diagram-portrait] svg");
    await expect(portrait).toBeVisible();
    // smallest label rendered at ≥ 10px on screen
    const smallest = await portrait.evaluate((svg) =>
      Math.min(...[...svg.querySelectorAll("text, tspan")].map((t) => t.getBoundingClientRect().height).filter((h) => h > 0)),
    );
    expect(smallest).toBeGreaterThanOrEqual(10);
  }
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/building/parti/");
  await expect(page.locator("[data-diagram-portrait]")).toBeHidden();
  await expect(page.locator("[data-diagram-card] svg").first()).toBeVisible();
});

test.describe("Draggable thumbnail strip", () => {
  const caption = (page: import("@playwright/test").Page) =>
    page.locator("[data-photo-caption] h2");

  test("only a pause control remains", async ({ page }) => {
    await page.goto("/photos/");
    for (const name of [/^Thumbnails/, /^Motion/, "Previous photo", "Next photo"]) {
      await expect(page.getByRole("button", { name })).toHaveCount(0);
    }
    const pause = page.getByRole("button", { name: "Pause slideshow" });
    await expect(pause).toBeVisible();
    await pause.click();
    await expect(page.getByRole("button", { name: "Play slideshow" })).toBeVisible();
  });

  test("dragging the strip picks the photo in the middle, then autoplay resumes", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/photos/");
    const strip = page.locator('button[aria-label^="Show "]').first().locator("xpath=..");
    await expect(caption(page)).toBeVisible();
    const before = await caption(page).textContent();
    await strip.scrollIntoViewIfNeeded();
    const box = (await strip.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 260, box.y + box.height / 2, { steps: 12 });
    // the photo follows the strip before the drag ends
    await expect.poll(() => caption(page).textContent()).not.toBe(before);
    await page.mouse.up();
    // eases into the nearest thumbnail, then commits it
    await expect(page.locator("[data-scrub]")).toHaveCount(0, { timeout: 3000 });
    await expect.poll(() => caption(page).textContent()).not.toBe(before);
    // letting go resumes the slideshow
    await expect(page.getByRole("button", { name: "Pause slideshow" })).toBeVisible();
    const landed = await caption(page).textContent();
    await expect.poll(() => caption(page).textContent(), { timeout: 9000 }).not.toBe(landed);
    // the shown photo is the thumbnail now marked current
    const current = await page.locator('button[aria-current="true"][aria-label^="Show "]').getAttribute("aria-label");
    expect(current).toBe(`Show ${await caption(page).textContent()}`);
  });

  test("mid-drag the photo is a blend of its neighbours, under a fixed frame", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/photos/");
    const thumbs = page.locator('button[aria-label^="Show "]');
    const strip = thumbs.first().locator("xpath=..");
    await expect(caption(page)).toBeVisible();
    const pitch = await thumbs.nth(1).evaluate((b, a) => b.getBoundingClientRect().left - (a as Element).getBoundingClientRect().left, await thumbs.nth(0).elementHandle());
    const frame = page.locator("[data-strip-frame]");
    const frameX = async () => { const b = (await frame.boundingBox())!; return b.x + b.width / 2; };
    const x0 = await frameX();
    await strip.scrollIntoViewIfNeeded();
    const box = (await strip.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - pitch * 1.5, box.y + box.height / 2, { steps: 10 });
    // halfway between thumbnails 1 and 2: both photos showing, the top one partly
    await expect(page.locator("[data-scrub] img").first()).toBeAttached();
    const ops = await page.locator("[data-scrub] img").evaluateAll((els) => els.map((el) => Number(getComputedStyle(el).opacity)));
    // one layer fully shown, one part-way over it, the rest hidden
    expect(ops.filter((o) => o === 1)).toHaveLength(1);
    const partial = ops.filter((o) => o > 0 && o < 1);
    expect(partial).toHaveLength(1);
    expect(partial[0]).toBeGreaterThan(0.2);
    expect(partial[0]).toBeLessThan(0.8);
    expect(Math.abs((await frameX()) - x0)).toBeLessThan(1);
    await page.mouse.up();
    // eases into the nearest thumbnail and lands on one photo
    await expect(page.locator("[data-scrub]")).toHaveCount(0, { timeout: 3000 });
    const sl = await strip.evaluate((el) => el.scrollLeft);
    expect(Math.abs(sl / pitch - Math.round(sl / pitch))).toBeLessThan(0.02);
  });

  test("the caption sits under the photo", async ({ page }) => {
    await page.goto("/photos/");
    const frame = (await page.locator("[aria-label='Photo carousel']").boundingBox())!;
    const cap = (await caption(page).boundingBox())!;
    expect(cap.y).toBeGreaterThan(frame.y + frame.height);
  });

  test("a drag released outside the window still ends, and autoplay resumes", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/photos/");
    const strip = page.locator('button[aria-label^="Show "]').first().locator("xpath=..");
    await strip.scrollIntoViewIfNeeded();
    const box = (await strip.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 300, box.y + box.height / 2, { steps: 10 });
    // no pointerup reaches the page: the next move arrives with no button held
    await page.evaluate(() =>
      window.dispatchEvent(new PointerEvent("pointermove", { clientX: 10, clientY: 10, buttons: 0, pointerType: "mouse" })),
    );
    await expect(page.locator("[data-scrub]")).toHaveCount(0, { timeout: 3000 });
    const landed = await caption(page).textContent();
    await expect.poll(() => caption(page).textContent(), { timeout: 9000 }).not.toBe(landed);
    await page.mouse.up();
  });

  test("tapping a thumbnail shows it", async ({ page }) => {
    await page.goto("/photos/");
    await page.getByRole("button", { name: "Show Ipanema, last light" }).click();
    await expect(caption(page)).toHaveText("Ipanema, last light");
    await page.waitForTimeout(600);
    await expect(page.getByRole("button", { name: "Pause slideshow" })).toBeVisible();
  });
});

test("a nav click scrolls without starting a page transition", async ({ page }) => {
  await page.addInitScript(() => {
    const original = Document.prototype.startViewTransition;
    (window as unknown as { __vt: number }).__vt = 0;
    if (original)
      Document.prototype.startViewTransition = function (...args: Parameters<typeof original>) {
        (window as unknown as { __vt: number }).__vt++;
        return original.apply(this, args);
      };
  });
  await page.goto("/");
  await page.waitForTimeout(500);
  for (const name of ["Contact", "Building", "Photos", "About"]) {
    await page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name }).click();
    await page.waitForTimeout(400);
  }
  expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBe(0);
});

test.describe("Parti screenshots (card 69)", () => {
  test("the Parti card leads with a screenshot", async ({ page }) => {
    await page.goto("/");
    await page.locator("#building").getByText("Parti", { exact: true }).first().click();
    const img = page.locator("#building [data-shot].shot-light img").first();
    await expect(img).toBeVisible();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
  });

  test("the Parti page shows the workspace and five steps, each image loaded", async ({ page }) => {
    await page.goto("/building/parti/");
    await expect(page.locator("[data-hero-shot] .shot-light img")).toBeVisible();
    const steps = page.locator("[data-shot-steps] > li");
    await expect(steps).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      const img = steps.nth(i).locator(".shot-light img");
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }
    // tapping a shot opens it full size
    await expect(steps.first().locator("a.shot-light")).toHaveAttribute("href", "/projects/parti/step-1-light.webp");
  });

  test("dark theme swaps to the dark screenshots", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/building/parti/");
    await expect(page.locator("[data-hero-shot] .shot-dark img")).toBeVisible();
    await expect(page.locator("[data-hero-shot] .shot-light img")).toBeHidden();
  });

  test("other projects keep their text-and-diagram page", async ({ page }) => {
    await page.goto("/building/himmelcam/");
    await expect(page.locator("[data-shot]")).toHaveCount(0);
    await expect(page.locator("[data-diagram-card]")).toBeVisible();
  });
});

test.describe("Intent-to-video screenshots and clips", () => {
  test("the page plays two muted looping clips and shows four steps", async ({ page }) => {
    await page.goto("/building/intent-to-video/");
    const clips = page.locator("[data-clips] video");
    await expect(clips).toHaveCount(2);
    for (const v of await clips.all()) {
      expect(await v.evaluate((el: HTMLVideoElement) => el.muted && el.loop && el.autoplay)).toBe(true);
    }
    await expect.poll(() => clips.first().evaluate((el: HTMLVideoElement) => el.readyState)).toBeGreaterThanOrEqual(2);
    const steps = page.locator("[data-shot-steps] > li");
    await expect(steps).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const img = steps.nth(i).locator("img");
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }
  });

  test("the card leads with the Library screenshot", async ({ page }) => {
    await page.goto("/");
    const img = page.locator("#building [data-shot] img").first();
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute("src", "/projects/intent-to-video/card.webp");
  });
});

test.describe("AI section after Photos (card 72)", () => {
  // the clips are the only media this section requests
  const shotRequests = (page: import("@playwright/test").Page) => {
    const urls: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("/photos/shots/")) urls.push(r.url());
    });
    return urls;
  };
  const allPaused = (page: import("@playwright/test").Page) =>
    page.evaluate(() => [...document.querySelectorAll<HTMLVideoElement>("#in-motion video")].every((v) => v.paused));

  test("in-motion sits inside the dusk band, after photos, before contact", async ({ page }) => {
    await page.goto("/");
    const place = await page.locator("#in-motion").evaluate((el) => ({
      after: el.previousElementSibling?.id,
      inDusk: el.parentElement?.hasAttribute("data-dusk") ?? false,
      contactFollows: Boolean(el.compareDocumentPosition(document.getElementById("contact")!) & Node.DOCUMENT_POSITION_FOLLOWING),
    }));
    expect(place).toEqual({ after: "photos", inDusk: true, contactFollows: true });
  });

  test("copy, the AI label and the Intent-to-video link", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#in-motion");
    await expect(section.getByRole("heading", { level: 2, name: "AI" })).toHaveCount(1);
    await expect(section).toContainText("Six seconds after the shutter.");
    await expect(section).toContainText("LTX 2.5 · 480p → 720p · 6.1 s each · sound from the model, or scored from the frames");
    await expect(section.getByRole("link", { name: "How each shot is made → Intent-to-video" })).toHaveAttribute(
      "href",
      "/building/intent-to-video/",
    );
  });

  test("no clip is requested before the section is in view", async ({ page }) => {
    const urls = shotRequests(page);
    await page.goto("/");
    await page.waitForTimeout(1000);
    expect(urls).toEqual([]);
    await page.locator("#in-motion").scrollIntoViewIfNeeded();
    await expect.poll(() => urls.length).toBeGreaterThan(0);
  });

  test("muted looping clips play in view and stop once it leaves", async ({ page }) => {
    await page.goto("/");
    await page.locator("#in-motion").scrollIntoViewIfNeeded();
    const videos = page.locator("#in-motion video");
    await expect(videos).toHaveCount(4);
    for (const v of await videos.all()) {
      expect(await v.evaluate((el: HTMLVideoElement) => el.muted && el.loop && el.getAttribute("preload"))).toBe("none");
    }
    await expect.poll(() => videos.first().evaluate((el: HTMLVideoElement) => !el.paused)).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => allPaused(page)).toBe(true);
  });

  test("one pause control stops and restarts every clip", async ({ page }) => {
    await page.goto("/");
    await page.locator("#in-motion").scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator("#in-motion video").first().evaluate((el: HTMLVideoElement) => !el.paused)).toBe(true);
    await page.getByRole("button", { name: "Pause clips" }).click();
    await expect.poll(() => allPaused(page)).toBe(true);
    await page.getByRole("button", { name: "Play clips" }).click();
    await expect.poll(() => page.locator("#in-motion video").first().evaluate((el: HTMLVideoElement) => !el.paused)).toBe(true);
  });

  test("home clip comparison has four independent photograph and video wipes", async ({ page }) => {
    await page.goto("/");
    await page.locator("#in-motion").scrollIntoViewIfNeeded();
    const frames = page.locator("#in-motion [data-compare-frame]");
    const sliders = frames.getByRole("slider");
    await expect(frames).toHaveCount(4);
    await expect(sliders).toHaveCount(4);
    await expect(page.locator("#in-motion video")).toHaveCount(4);
    await expect(page.locator("#in-motion img")).toHaveCount(4);
    await expect(page.getByRole("button", { name: "Show the photographs" })).toHaveCount(0);
    for (const slider of await sliders.all()) await expect(slider).toHaveValue("50");
    await expect(sliders.first()).toHaveAttribute("aria-label", /Compare Night on the river photograph and video/);
    const photo = frames.first().locator("img");
    await sliders.first().fill("0");
    await expect.poll(() => photo.evaluate((el) => getComputedStyle(el).clipPath)).toBe("inset(0px 100% 0px 0px)");
    await sliders.first().fill("100");
    await expect.poll(() => photo.evaluate((el) => getComputedStyle(el).clipPath)).toBe("inset(0px 0% 0px 0px)");
    await expect(sliders.nth(1)).toHaveValue("50");
    await sliders.first().focus();
    await page.keyboard.press("ArrowLeft");
    await expect(sliders.first()).toHaveValue("99");
    await expect(frames.first()).toHaveCSS("outline-style", "solid");
    const handle = await frames.first().locator("[data-compare-handle]").boundingBox();
    expect(handle!.width).toBeGreaterThanOrEqual(44);
    expect(handle!.height).toBeGreaterThanOrEqual(44);
  });

  test("home clip comparison works by touch and leaves vertical page scrolling available", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 1 });
    await page.goto("/");
    await page.locator("#in-motion").scrollIntoViewIfNeeded();
    const slider = page.locator("#in-motion [data-compare-frame]").first().getByRole("slider");
    await expect(slider).toHaveValue("50");
    const box = (await slider.boundingBox())!;
    const x = Math.round(box.x + box.width / 2);
    const y = Math.round(box.y + box.height / 2);
    const touch = (type: "touchStart" | "touchMove" | "touchEnd", px: number, py: number) =>
      cdp.send("Input.dispatchTouchEvent", {
        type,
        touchPoints: type === "touchEnd" ? [] : [{ x: px, y: py }],
      });
    await touch("touchStart", x, y);
    for (let i = 1; i <= 8; i++) await touch("touchMove", x + i * 10, y);
    await touch("touchEnd", x + 80, y);
    await expect.poll(async () => Number(await slider.inputValue())).toBeGreaterThan(50);

    const before = await page.evaluate(() => window.scrollY);
    await touch("touchStart", x, y);
    for (let i = 1; i <= 10; i++) await touch("touchMove", x, y - i * 12);
    await touch("touchEnd", x, y - 120);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before + 20);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });

  test("home clip comparison offers tap to play when autoplay is blocked", async ({ page }) => {
    await blockAutoPlay(page);
    await page.goto("/");
    await page.evaluate(() => document.querySelector("#in-motion")?.scrollIntoView());
    const first = page.locator("#in-motion [data-compare-frame]").first();
    const play = first.getByRole("button", { name: "Play Night on the river video" });
    await expect(play).toBeVisible();
    await play.click();
    await expect.poll(() => first.locator("video").evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(0.1);
    await expect(play).toHaveCount(0);
  });

  test("reduced motion: posters only, and no clip is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const urls = shotRequests(page);
    await page.goto("/");
    await page.locator("#in-motion").scrollIntoViewIfNeeded();
    await expect(page.locator("#in-motion img")).toHaveCount(4);
    await expect(page.locator("#in-motion video")).toHaveCount(0);
    await expect(page.locator("#in-motion input[type='range']")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Pause clips" })).toHaveCount(0);
    await page.waitForTimeout(500);
    expect(urls).toEqual([]);
  });

  test("the lead take sits beside the rest on desktop and stacks on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.locator("#in-motion").scrollIntoViewIfNeeded();
    const figs = page.locator("#in-motion figure");
    await expect(figs).toHaveCount(4);
    const lead = await figs.nth(0).boundingBox();
    const next = await figs.nth(1).boundingBox();
    expect(next!.x).toBeGreaterThanOrEqual(lead!.x + lead!.width);

    await page.setViewportSize({ width: 390, height: 844 });
    const leadPhone = await figs.nth(0).boundingBox();
    const nextPhone = await figs.nth(1).boundingBox();
    expect(nextPhone!.y).toBeGreaterThanOrEqual(leadPhone!.y + leadPhone!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  });
});

test.describe("From still to shot (card 73)", () => {
  const panel = (page: import("@playwright/test").Page) => page.locator("[data-still-to-shot]");
  const wipe = (page: import("@playwright/test").Page) =>
    panel(page).getByRole("slider", { name: "Drag to compare the photograph with the shot" });
  const video = (page: import("@playwright/test").Page) => panel(page).locator("video");

  test("project comparison offers tap to play when autoplay is blocked", async ({ page }) => {
    await blockAutoPlay(page);
    await page.goto("/building/intent-to-video/");
    await page.evaluate(() => document.querySelector("[data-still-to-shot]")?.scrollIntoView());
    const play = panel(page).getByRole("button", { name: "Play video" });
    await expect(play).toBeVisible();
    await play.click();
    await expect.poll(() => video(page).evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(0.1);
    await expect(play).toHaveCount(0);
  });

  test("sits after How it runs with four picks, and 44px controls", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/building/intent-to-video/");
    await expect(panel(page)).toHaveCount(1);
    await expect(panel(page).getByRole("heading", { level: 3, name: "My photographs, directed as six-second shots." })).toBeVisible();
    const after = await page.evaluate(() => {
      const how = [...document.querySelectorAll("h2")].find((h) => h.textContent === "How it runs")!;
      return Boolean(how.compareDocumentPosition(document.querySelector("[data-still-to-shot]")!) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(after).toBe(true);

    const picks = panel(page).getByRole("group", { name: "Choose a shot" }).getByRole("button");
    await expect(picks).toHaveCount(4);
    await panel(page).scrollIntoViewIfNeeded();
    const controls = panel(page).getByRole("button");
    await expect(panel(page).getByRole("button", { name: "Turn sound on" })).toBeVisible();
    for (const b of await controls.all()) {
      expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("the range wipes from the shot (0) to the whole photograph (100)", async ({ page }) => {
    await page.goto("/building/intent-to-video/");
    const photo = panel(page).locator("img").first();
    await wipe(page).scrollIntoViewIfNeeded();
    await wipe(page).fill("0");
    await expect.poll(() => photo.evaluate((el) => getComputedStyle(el).clipPath)).toContain("100%");
    await wipe(page).fill("100");
    await expect.poll(() => photo.evaluate((el) => getComputedStyle(el).clipPath)).toBe("inset(0px 0% 0px 0px)");
  });

  test("a pick swaps the video and the prompt text", async ({ page }) => {
    await page.goto("/building/intent-to-video/");
    await panel(page).scrollIntoViewIfNeeded();
    await panel(page).getByRole("button", { name: "Small figure, big wall" }).click();
    await expect(panel(page).getByRole("button", { name: "Small figure, big wall" })).toHaveAttribute("aria-pressed", "true");
    await expect(panel(page)).toContainText("a wide shot at eye level across a cobbled street");
    await expect.poll(() => video(page).evaluate((el: HTMLVideoElement) => el.currentSrc)).toContain("/photos/shots/cz-17.webm");
  });

  test("sound is off by default, and the sound button unmutes the take", async ({ page }) => {
    await page.goto("/building/intent-to-video/");
    await panel(page).scrollIntoViewIfNeeded();
    await expect.poll(() => video(page).evaluate((el: HTMLVideoElement) => el.muted)).toBe(true);
    await panel(page).getByRole("button", { name: "Turn sound on" }).click();
    await expect.poll(() => video(page).evaluate((el: HTMLVideoElement) => el.muted)).toBe(false);
    await expect(panel(page).getByRole("button", { name: "Turn sound off" })).toBeVisible();
  });

  test("the pause control stops and restarts the take", async ({ page }) => {
    await page.goto("/building/intent-to-video/");
    await panel(page).scrollIntoViewIfNeeded();
    await expect.poll(() => video(page).evaluate((el: HTMLVideoElement) => !el.paused)).toBe(true);
    await panel(page).getByRole("button", { name: "Pause take" }).click();
    await expect.poll(() => video(page).evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
    await panel(page).getByRole("button", { name: "Play take" }).click();
    await expect.poll(() => video(page).evaluate((el: HTMLVideoElement) => !el.paused)).toBe(true);
  });

  test("no second Try Compo link, and no other project page has the panel", async ({ page }) => {
    await page.goto("/building/intent-to-video/");
    await expect(page.getByRole("link", { name: "Try Compo ↗" })).toHaveCount(1);
    for (const id of ["parti", "himmelcam"]) {
      await page.goto(`/building/${id}/`);
      await expect(page.locator("[data-still-to-shot]")).toHaveCount(0);
    }
  });
});
