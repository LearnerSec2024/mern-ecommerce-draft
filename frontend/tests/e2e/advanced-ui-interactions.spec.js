import { expect, test } from '@playwright/test';

const API_BASE_URL = `${process.env.PLAYWRIGHT_BACKEND_URL || 'http://127.0.0.1:5000'}/api`;

test.describe('Advanced ecommerce UI interactions', () => {
  test('uses search keyboard action, slider, hover wishlist, dynamic content and drag to cart', async ({
    page,
    request,
  }) => {
    const uniqueId = Date.now();

    const customer = {
      name: `Advanced UI Customer ${uniqueId}`,
      email: `advanced.ui.${uniqueId}@example.com`,
      password: 'TestPassword123!',
    };

    const catalogueResponse = await request.get(`${API_BASE_URL}/products`);
    await expect(catalogueResponse).toBeOK();

    const catalogue = await catalogueResponse.json();
    expect(catalogue.products.length).toBeGreaterThan(0);

    const firstProduct = catalogue.products[0];
    const searchTerm = firstProduct.name.split(' ')[0];

    await test.step('Create and login as a real customer through the UI', async () => {
      await page.goto('/register');

      await page.getByLabel(/^name$/i).fill(customer.name);
      await page.getByLabel(/^email$/i).fill(customer.email);
      await page.getByLabel(/^password$/i).fill(customer.password);
      await page.getByLabel(/confirm password/i).fill(customer.password);

      await expect(page.getByTestId('register-submit-button')).toBeDisabled();

      await page.getByLabel(/i accept the terms and conditions/i).check();

      await expect(page.getByTestId('register-submit-button')).toBeEnabled();

      const registerResponsePromise = page.waitForResponse(
        (response) => response.url().includes('/api/auth/register') && response.request().method() === 'POST',
      );

      await page.getByRole('button', { name: /^register$/i }).click();

      const registerResponse = await registerResponsePromise;
      const registerBody = await registerResponse.json().catch(() => ({}));

      expect(registerResponse.status(), `Register API response: ${JSON.stringify(registerBody)}`).toBe(201);

      await expect(page).toHaveURL(/\/products$/, { timeout: 10000 });
      await expect(page.getByRole('heading', { name: /^products$/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /^products$/i })).toBeVisible();
    });

    await test.step('Assert delayed dynamic promo banner appears', async () => {
      await expect(page.getByTestId('delayed-deal-banner')).toBeVisible({
        timeout: 3000,
      });
    });

    await test.step('Search products by pressing Enter', async () => {
      await page.getByTestId('product-search-input').fill(searchTerm);
      await page.getByTestId('product-search-input').press('Enter');

      await expect(page.getByTestId('active-search-term')).toContainText(searchTerm);
      await expect(page.getByTestId('product-card').first()).toBeVisible();
    });

    await test.step('Use price range slider filter', async () => {
      const slider = page.getByTestId('price-range-slider');

      await expect(slider).toBeVisible();

      const maxValue = await slider.getAttribute('max');
      const targetValue = maxValue || '100';

      await slider.fill(targetValue);
      await expect(slider).toHaveValue(targetValue);

      await expect(page.getByTestId('loaded-product-count')).toBeVisible();
    });

    await test.step('Hover product card to reveal hidden wishlist action', async () => {
      const firstCard = page.getByTestId('product-card').first();

      await firstCard.hover();

      await expect(firstCard.getByTestId('product-hover-tooltip')).toBeVisible();
      await expect(firstCard.getByTestId('wishlist-button')).toBeVisible();

      await firstCard.getByTestId('wishlist-button').click();

      await expect(page.getByTestId('wishlist-toast')).toContainText(/wishlist/i);
    });

    await test.step('Drag product card into cart drop zone', async () => {
      const firstCard = page.getByTestId('product-card').first();
      const dropZone = page.getByTestId('cart-drop-zone');

      await expect(firstCard).toBeVisible();
      await expect(dropZone).toBeVisible();

      await firstCard.scrollIntoViewIfNeeded();
      await dropZone.scrollIntoViewIfNeeded();

      await firstCard.dragTo(dropZone, {
        sourcePosition: { x: 20, y: 20 },
        targetPosition: { x: 40, y: 40 },
      });

      await expect(page.getByTestId('drag-cart-message')).toBeVisible({
        timeout: 10000,
      });

      await expect(page.getByTestId('drag-cart-message')).toContainText(/added to cart/i);
    });

    await test.step('Scroll to lazy-load/infinite-scroll sentinel', async () => {
      await page.getByTestId('infinite-scroll-sentinel').scrollIntoViewIfNeeded();
      await expect(page.getByTestId('infinite-scroll-sentinel')).toBeVisible();
    });
  });
});
