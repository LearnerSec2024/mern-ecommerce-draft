import { expect, test } from '@playwright/test';

const API_BASE_URL = `${process.env.PLAYWRIGHT_BACKEND_URL || 'http://127.0.0.1:5000'}/api`;

test.describe('Customer ecommerce journey', () => {
  test('starts the app, creates an account, logs in, creates an order and submits it', async ({
    page,
    request
  }) => {
    const uniqueId = Date.now();
    const customer = {
      name: `Playwright Customer ${uniqueId}`,
      email: `playwright.customer.${uniqueId}@example.com`,
      password: 'TestPassword123!'
    };

    await test.step('Assert backend API and seeded catalogue are ready', async () => {
      const health = await request.get(`${API_BASE_URL}/health`);
      await expect(health, 'Backend health endpoint should return 200').toBeOK();
      await expect(await health.json()).toMatchObject({ status: 'ok' });

      const products = await request.get(`${API_BASE_URL}/products`);
      await expect(products, 'Products endpoint should return seeded catalogue').toBeOK();
      const productBody = await products.json();
      expect(
        productBody.products.length,
        'Seeded catalogue should have at least one product'
      ).toBeGreaterThan(0);
      expect(
        productBody.categories.length,
        'Seeded catalogue should expose categories'
      ).toBeGreaterThan(0);
    });

    await test.step('Access the home page', async () => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByRole('heading', { name: /shop smarter/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /create account/i })).toBeVisible();
    });

    await test.step('Create a new account', async () => {
      await page.getByRole('link', { name: /create account/i }).click();
      await expect(page).toHaveURL(/\/register$/);
      await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();

      await page.getByLabel(/^name$/i).fill(customer.name);
      await page.getByLabel(/^email$/i).fill(customer.email);
      await page.getByLabel(/^password$/i).fill(customer.password);
      await page.getByLabel(/confirm password/i).fill(customer.password);

      await expect(page.getByTestId('register-submit-button')).toBeDisabled();
      await page.getByLabel(/i accept the terms and conditions/i).check();
      await expect(page.getByTestId('register-submit-button')).toBeEnabled();

      await page.getByRole('button', { name: /^register$/i }).click();

      await expect(page).toHaveURL(/\/products$/);
      await expect(page.getByRole('heading', { name: /^products$/i })).toBeVisible();
      await expect(
        page.getByRole('button', { name: new RegExp(`logout ${customer.name}`, 'i') })
      ).toBeVisible();
    });

    await test.step('Logout so the new account login can be validated', async () => {
      await page.getByRole('button', { name: new RegExp(`logout ${customer.name}`, 'i') }).click();
      await expect(page.getByRole('link', { name: /^login$/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /^register$/i })).toBeVisible();
    });

    await test.step('Login with the newly created account details', async () => {
      await page.getByRole('link', { name: /^login$/i }).click();
      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole('heading', { name: /^login$/i })).toBeVisible();

      await page.getByLabel(/^email$/i).fill(customer.email);
      await page.getByLabel(/^password$/i).fill(customer.password);
      await page.getByRole('button', { name: /^login$/i }).click();

      await expect(page).toHaveURL(/\/products$/);
      await expect(page.getByRole('heading', { name: /^products$/i })).toBeVisible();
      await expect(
        page.getByRole('button', { name: new RegExp(`logout ${customer.name}`, 'i') })
      ).toBeVisible();
    });

    await test.step('Add a product to the cart', async () => {
      await expect(page.getByRole('link', { name: /view details/i }).first()).toBeVisible();
      await page
        .getByRole('link', { name: /view details/i })
        .first()
        .click();

      const productDetailsAddButton = page.getByRole('button', {
        name: /^add to cart$/i
      });

      await expect(productDetailsAddButton).toBeVisible();

      await page.getByLabel(/quantity/i).fill('1');

      await productDetailsAddButton.click();
      await expect(page.getByText(/added to cart/i)).toBeVisible();

      await page.getByRole('link', { name: /cart \(1\)/i }).click();
      await expect(page).toHaveURL(/\/cart$/);
      await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible();
      await expect(page.getByText(/subtotal:/i)).toBeVisible();
      await expect(page.getByRole('link', { name: /^checkout$/i })).toBeVisible();
    });

    await test.step('Create and submit an order', async () => {
      await page.getByRole('link', { name: /^checkout$/i }).click();
      await expect(page).toHaveURL(/\/checkout$/);
      await expect(page.getByRole('heading', { name: /^checkout$/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /order summary/i })).toBeVisible();

      await page.getByLabel(/address line 1/i).fill('123 Playwright Street');
      await page.getByLabel(/address line 2/i).fill('Unit 5');
      await page.getByLabel(/^city$/i).fill('Brisbane');
      await page.getByLabel(/^state$/i).fill('QLD');
      await page.getByLabel(/^postcode$/i).fill('4000');
      await page.getByLabel(/^country$/i).fill('Australia');
      await page.getByLabel(/payment method/i).selectOption('mock-card');

      await page.getByRole('button', { name: /place order/i }).click();

      await expect(page).toHaveURL(/\/orders$/);
      await expect(page.getByRole('heading', { name: /my orders/i })).toBeVisible();
      await expect(page.getByText(/order #/i).first()).toBeVisible();
      await expect(page.getByText(/^placed$/i).first()).toBeVisible();
      await expect(page.getByText(/^paid$/i).first()).toBeVisible();
      await expect(page.getByText(/payment: mock card/i).first()).toBeVisible();

      await page
        .getByRole('button', { name: /view order details/i })
        .first()
        .click();

      await expect(page.getByTestId('order-details').first()).toBeVisible();
      await expect(page.getByRole('heading', { name: /products ordered/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /shipping address/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /order totals/i })).toBeVisible();
      await expect(page.getByText(/order status: placed/i)).toBeVisible();
      await expect(page.getByText(/payment status: paid/i)).toBeVisible();
    });
  });
});
