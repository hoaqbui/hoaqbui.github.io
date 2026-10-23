import { test, expect, Page } from "@playwright/test";

test.use({ viewport: { width: 1440, height: 900 } });

const ALLOWED_SIZES = [56, 64, 36, 20, 17, 15, 13];

async function checkPageTypeSystem(page: Page, path: string) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(path, { waitUntil: "networkidle" });

  await page.evaluate(async () => {
    const step = 500;
    let y = 0;
    while (y < Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) {
      y += step;
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);

  const violations = await page.evaluate((allowedSizes) => {
    const elements = Array.from(document.body.querySelectorAll("*"));
    const groups: Record<string, { signature: string; count: number; examples: string[] }> = {};

    for (const el of elements) {
      if (el.closest("script, style, noscript, svg")) {
        continue;
      }

      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") {
        continue;
      }

      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) {
        continue;
      }

      const directTexts: string[] = [];
      for (const child of Array.from(el.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent) {
          const t = child.textContent.replace(/\s+/g, " ").trim();
          if (t.length > 0) {
            directTexts.push(t);
          }
        }
      }

      if (directTexts.length === 0) {
        continue;
      }

      const rawFirstFamily = style.fontFamily.split(",")[0].trim().replace(/^["']|["']$/g, "").trim();
      const hasGeist = rawFirstFamily.includes("Geist");
      const hasMono = /mono/i.test(rawFirstFamily);
      const hasSerif = /serif|monospace/i.test(rawFirstFamily);
      const isFamilyValid = hasGeist && !hasMono && !hasSerif;

      const rawSize = parseFloat(style.fontSize);
      const roundedSize = Math.round(rawSize);
      const isSizeAllowed = allowedSizes.includes(roundedSize) && Math.abs(rawSize - roundedSize) < 0.2;

      const weight = parseInt(style.fontWeight, 10);
      let isWeightAllowed = false;
      if (roundedSize === 56 || roundedSize === 64 || roundedSize === 36) {
        isWeightAllowed = weight === 600;
      } else if (roundedSize === 20) {
        isWeightAllowed = weight === 500;
      } else if (roundedSize === 17) {
        isWeightAllowed = weight === 400;
      } else if (roundedSize === 15) {
        isWeightAllowed = weight === 400 || weight === 500;
      } else if (roundedSize === 13) {
        isWeightAllowed = weight === 400 || weight === 500;
      }

      const isItalic = style.fontStyle === "italic" || style.fontStyle === "oblique";
      const isUppercase = style.textTransform === "uppercase";

      const isValid = isFamilyValid && isSizeAllowed && isWeightAllowed && !isItalic && !isUppercase;

      if (!isValid) {
        const familyPart = isFamilyValid ? "" : `${rawFirstFamily} `;
        const signature = `${familyPart}${roundedSize}px ${weight} ${style.fontStyle} ${style.textTransform}`;
        const sampleText = directTexts.join(" ").slice(0, 40);

        if (!groups[signature]) {
          groups[signature] = {
            signature,
            count: 0,
            examples: [],
          };
        }
        groups[signature].count += 1;
        if (groups[signature].examples.length < 2 && !groups[signature].examples.includes(sampleText)) {
          groups[signature].examples.push(sampleText);
        }
      }
    }

    return Object.values(groups).map((g) => {
      const examples = g.examples.map((ex) => `"${ex}"`).join(", ");
      return `${g.signature} ${examples} (×${g.count})`;
    });
  }, ALLOWED_SIZES);

  const message = violations.join("\n");
  expect(violations, message).toEqual([]);
}

test("home", async ({ page }) => {
  await checkPageTypeSystem(page, "/");
});

test("project", async ({ page }) => {
  await checkPageTypeSystem(page, "/building/parti/");
});

test("photos", async ({ page }) => {
  await checkPageTypeSystem(page, "/photos/");
});

test("prototyping", async ({ page }) => {
  await checkPageTypeSystem(page, "/prototyping/");
});
