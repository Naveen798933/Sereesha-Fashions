import { test, expect } from "@playwright/test";

test.describe("Sreesha Elegance — Phase 0 Smoke Tests", () => {
  test("Home page loads with brand header, announcement bar, and footer", async ({ page }) => {
    await page.goto("/");

    // Title and SEO
    await expect(page).toHaveTitle(/Sreesha Elegance/i);

    // Header landmark and brand logo
    const header = page.locator("header");
    await expect(header).toBeVisible();
    await expect(page.getByRole("link", { name: /sreesha elegance/i }).first()).toBeVisible();

    // Announcement bar
    const announcement = page.getByRole("complementary", { name: /announcement/i });
    await expect(announcement).toBeVisible();

    // Main heading
    await expect(page.getByRole("heading", { name: /wear your elegance/i })).toBeVisible();

    // Footer landmark and Hyderabad details
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Hyderabad");
    await expect(footer).toContainText("All rights reserved");
  });

  test("Design System showcase renders all components in all states", async ({ page }) => {
    await page.goto("/design-system");

    // Page title
    await expect(
      page.getByRole("heading", { name: /sreesha elegance atelier kit/i })
    ).toBeVisible();

    // Buttons
    await expect(page.getByRole("button", { name: /primary charcoal/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /processing order/i })).toBeDisabled();

    // Inputs
    await expect(page.getByLabel(/customer full name/i)).toBeVisible();

    // Modal Interaction
    await page.getByRole("button", { name: /open size guide modal/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText(/atelier size & fitting guide/i)).toBeVisible();

    // Close Modal via button or Escape
    await page.getByRole("button", { name: /close modal/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();

    // Drawer Interaction
    await page.getByRole("button", { name: /open shopping bag drawer/i }).click();
    await expect(page.getByText(/your shopping bag/i)).toBeVisible();
    await page.getByRole("button", { name: /close drawer/i }).click();

    // Toast Trigger
    await page.getByRole("button", { name: /trigger success toast/i }).click();
    await expect(page.getByText(/ensemble added to bag/i)).toBeVisible();
  });

  test("404 page renders gracefully for unknown routes", async ({ page }) => {
    const response = await page.goto("/non-existent-luxury-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /page not found/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /return to boutique/i })).toBeVisible();
  });
});
