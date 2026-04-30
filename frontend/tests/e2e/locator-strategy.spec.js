import { expect, test } from '@playwright/test';

test.describe('Locator strategy coverage', () => {
  test('uses varied locator strategies in the real ecommerce UI', async ({ page }) => {
    await page.goto('/products');

    await expect(page.getByRole('heading', { name: /^products$/i })).toBeVisible();

    await test.step('Unique IDs: use existing filter controls', async () => {
      await expect(page.locator('#product-search')).toBeVisible();
      await expect(page.locator('#category-filter')).toBeVisible();
      await expect(page.locator('#sort-filter')).toBeVisible();
      await expect(page.locator('#price-range')).toBeVisible();
    });

    await test.step('Duplicate classes: product cards share the same class', async () => {
      const productCards = page.locator('.product-card');
      const count = await productCards.count();

      expect(count).toBeGreaterThan(1);
      await expect(productCards.first()).toBeVisible();
    });

    await test.step('Dynamic IDs: product card IDs are generated from product records', async () => {
      const dynamicProductCard = page.locator('article.product-card[id^="product-"]').first();

      await expect(dynamicProductCard).toBeVisible();
      await expect(dynamicProductCard).toHaveAttribute('id', /^product-[a-f0-9]{24}$/i);
    });

    await test.step('Data attributes: use stable data-testid selectors', async () => {
      const firstCard = page.getByTestId('product-card').first();

      await expect(firstCard).toBeVisible();
      await expect(firstCard.getByTestId('product-card-title')).toBeVisible();
      await expect(firstCard.getByTestId('product-card-add-to-cart')).toBeVisible();
    });

    await test.step('Nested DOM: scope locators inside one product card', async () => {
      const firstCard = page.getByTestId('product-card').first();

      await expect(firstCard.locator('.product-image-wrap')).toBeVisible();

      await expect(
        firstCard
          .locator('.product-image-wrap img, .product-image-wrap .product-image-fallback')
          .first()
      ).toBeVisible();

      await expect(firstCard.locator('.card-body h3')).toBeVisible();
      await expect(firstCard.locator('.card-body .button').first()).toBeVisible();
    });

    await test.step('Role-based selectors: use accessible links and buttons', async () => {
      await expect(page.getByRole('link', { name: /view details/i }).first()).toBeVisible();
      await expect(
        page.getByRole('button', { name: /click to add to cart/i }).first()
      ).toBeVisible();
      await expect(page.getByRole('combobox', { name: /category/i })).toBeVisible();
    });

    await test.step('CSS selector practice: find cards by data attributes', async () => {
      const pricedProduct = page.locator('[data-testid="product-card"][data-price]').first();

      await expect(pricedProduct).toBeVisible();
      await expect(pricedProduct).toHaveAttribute('data-price', /\d/);
    });

    await test.step('XPath practice: locate a product detail link inside a product card', async () => {
      const firstDetailsLink = page.locator(
        '(//article[contains(@class, "product-card")]//a[contains(normalize-space(), "View details")])[1]'
      );

      await expect(firstDetailsLink).toBeVisible();
    });
  });
});
