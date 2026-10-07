import { test, expect } from "@playwright/test";

test.describe("Sreesha Elegance — Mobile Experience", () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone viewport

  test("Mobile bottom navigation bar is visible and interactive", async ({ page }) => {
    await page.goto("/");

    // 1. Mobile bottom nav should be visible
    const bottomNav = page.getByRole("navigation", { name: "Mobile Navigation" });
    await expect(bottomNav).toBeVisible();

    // 2. Explore button opens mobile drawer
    await page.getByRole("button", { name: /browse collections and categories/i }).click();
    await expect(page.getByText(/vip atelier concierge/i)).toBeVisible();
    await expect(page.getByText(/couture collections/i)).toBeVisible();

    // Close drawer
    await page.getByRole("button", { name: /close navigation/i }).click();
    await expect(page.getByText(/vip atelier concierge/i)).not.toBeVisible();

    // 3. Search button opens search modal
    await page.getByRole("button", { name: /search collection/i }).click();
    const searchInput = page.getByPlaceholder(/search pure silk sarees/i);
    await expect(searchInput).toBeVisible();

    // Type query and verify results appear
    await searchInput.fill("Kanchipuram");
    await expect(page.getByText(/pieces/i).first()).toBeVisible();

    // Close search
    await page.getByRole("button", { name: /close search/i }).click();
    await expect(searchInput).not.toBeVisible();

    // 4. Bag button opens Cart Drawer
    await page
      .getByRole("button", { name: /shopping bag/i })
      .last()
      .click();
    await expect(page.getByText(/your shopping bag/i)).toBeVisible();
    await page.getByRole("button", { name: /close cart drawer/i }).click();
    await expect(page.getByText(/your shopping bag/i)).not.toBeVisible();
  });

  test("Product Listing Page mobile features (filter drawer & grid toggle)", async ({ page }) => {
    await page.goto("/women/sarees");

    // Check heading
    await expect(page.getByRole("heading", { name: /pure handloom sarees/i })).toBeVisible();

    // 1. Mobile Filter & Sort Drawer
    const filtersBtn = page.getByRole("button", { name: /filters/i }).first();
    await expect(filtersBtn).toBeVisible();
    await filtersBtn.click();

    // Bottom sheet appears
    await expect(page.getByRole("heading", { name: /filter & sort/i })).toBeVisible();
    await expect(page.getByText(/sort collection by/i)).toBeVisible();

    // Close filter drawer
    await page.getByRole("button", { name: /close filters/i }).click();
    await expect(page.getByRole("heading", { name: /filter & sort/i })).not.toBeVisible();

    // 2. Grid switcher
    const singleColBtn = page.getByRole("button", { name: /editorial single column view/i });
    const twoColBtn = page.getByRole("button", { name: /two column grid view/i });
    await expect(singleColBtn).toBeVisible();
    await expect(twoColBtn).toBeVisible();

    // Click single column
    await singleColBtn.click();
    // Click two column
    await twoColBtn.click();
  });

  test("Product Detail Page mobile sticky action bar and quick add", async ({ page }) => {
    await page.goto("/women/sarees/kanchipuram-pure-silk-saree-emerald");

    // Title
    await expect(page.getByRole("heading", { name: /kanchipuram pure silk saree/i })).toBeVisible();

    // Sticky Bottom Action Bar should be visible
    const stickyBar = page.locator('[data-testid="pdp-sticky-bar"]');
    await expect(stickyBar).toBeVisible();

    // Should display price inside sticky bar
    await expect(stickyBar).toContainText("₹18,500");

    // WhatsApp quick stylist button
    const waBtn = stickyBar.getByRole("link", { name: /ask stylist on whatsapp/i });
    await expect(waBtn).toBeVisible();

    // Add to Bag on sticky bar
    const addToBagBtn = stickyBar.getByRole("button", { name: /add to bag/i });
    await expect(addToBagBtn).toBeVisible();
    await addToBagBtn.click();

    // Verify cart drawer opened
    await expect(page.getByText(/your shopping bag/i)).toBeVisible();
    await expect(page.getByText(/kanchipuram pure silk saree/i).first()).toBeVisible();
  });
});
