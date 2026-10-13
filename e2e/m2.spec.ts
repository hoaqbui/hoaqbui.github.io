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
});
