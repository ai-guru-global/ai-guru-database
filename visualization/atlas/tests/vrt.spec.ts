import { test, expect, type Page } from "@playwright/test";

const THEME_KEY = "ai-guru-atlas-theme";

async function boot(page: Page, theme: "dark" | "light" | "auto" = "dark") {
  await page.addInitScript(
    ({ k, v }: { k: string; v: string }) => {
      window.localStorage.setItem(k, v);
    },
    { k: THEME_KEY, v: theme },
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?static=1", { waitUntil: "networkidle" });
  await page.waitForSelector(".graph__node");
  await page.waitForTimeout(250);
}

test("01-desktop-dark-default", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page, "dark");
  await expect(page).toHaveScreenshot("01-desktop-dark-default.png", { animations: "disabled" });
});

test("02-desktop-dark-tooltip-hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page, "dark");
  await page.fill("#search-input", "Transformer");
  await page.waitForTimeout(250);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(250);
  await expect(page).toHaveScreenshot("02-desktop-dark-tooltip-hover.png", { animations: "disabled" });
});

test("03-desktop-dark-selected-node", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page, "dark");
  await page.fill("#search-input", "Transformer");
  await page.waitForTimeout(200);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);
  await expect(page).toHaveScreenshot("03-desktop-dark-selected-node.png", { animations: "disabled" });
});

test("04-desktop-dark-search-results-open", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page, "dark");
  await page.fill("#search-input", "AI");
  await page.waitForTimeout(250);
  await expect(page.locator("#search-results")).toBeVisible();
  await expect(page).toHaveScreenshot("04-desktop-dark-search-results-open.png", { animations: "disabled" });
});

test("05-desktop-dark-filtered-links", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page, "dark");
  await page.click("#filter-chips button:nth-child(2)");
  await page.waitForTimeout(250);
  await page.click("#filter-chips button:nth-child(3)");
  await page.waitForTimeout(250);
  await expect(page).toHaveScreenshot("05-desktop-dark-filtered-links.png", { animations: "disabled" });
});

test("06-desktop-light-default", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page, "light");
  await expect(page).toHaveScreenshot("06-desktop-light-default.png", { animations: "disabled" });
});

test("07-desktop-light-selected-node", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page, "light");
  await page.fill("#search-input", "RAG");
  await page.waitForTimeout(200);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);
  await expect(page).toHaveScreenshot("07-desktop-light-selected-node.png", { animations: "disabled" });
});

test("08-mobile-dark-sidebar-closed", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await boot(page, "dark");
  await expect(page).toHaveScreenshot("08-mobile-dark-sidebar-closed.png", { animations: "disabled" });
});

test("09-mobile-dark-sidebar-open", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await boot(page, "dark");
  await page.click('[data-action="toggle-sidebar"]');
  await page.waitForTimeout(250);
  await expect(page).toHaveScreenshot("09-mobile-dark-sidebar-open.png", { animations: "disabled" });
});

test("10-tablet-light-sidebar-open", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 });
  await boot(page, "light");
  await page.click('[data-action="toggle-sidebar"]');
  await page.waitForTimeout(250);
  await expect(page).toHaveScreenshot("10-tablet-light-sidebar-open.png", { animations: "disabled" });
});

test("11-keyboard-focus-ring", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page, "dark");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(250);
  await expect(page).toHaveScreenshot("11-keyboard-focus-ring.png", { animations: "disabled" });
});

test("12-reset-view-state", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await boot(page, "dark");
  await page.fill("#search-input", "Transformer");
  await page.waitForTimeout(200);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);
  await page.click('[data-action="reset-view"]');
  await page.waitForTimeout(350);
  await expect(page).toHaveScreenshot("12-reset-view-state.png", { animations: "disabled" });
});
