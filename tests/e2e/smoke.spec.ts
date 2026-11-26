import { expect, test } from '@playwright/test';

test('homepage renders the two launch markets', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('main').getByText('Trinidad and Tobago').first()).toBeVisible();
  await expect(page.locator('main').getByText('Venezuela').first()).toBeVisible();
});

test('country page lists categories and recent listings', async ({ page }) => {
  await page.goto('/tt');
  await expect(page.getByRole('heading', { name: /Welcome to Trinidad and Tobago/ })).toBeVisible();
  await expect(page.getByText('Electronics and computers').first()).toBeVisible();
});

test('search results respond to a keyword', async ({ page }) => {
  await page.goto('/ve/search?q=Laptop');
  await expect(page.getByRole('heading', { name: 'Search listings' })).toBeVisible();
  await expect(page.locator('a[href^="/ve/l/"]').first()).toBeVisible();
});

test('new categories are browsable', async ({ page }) => {
  await page.goto('/tt/c/pets');
  await expect(page.getByRole('heading', { name: 'Pets and pet supplies' })).toBeVisible();
  await expect(page.locator('a[href^="/tt/l/"]').first()).toBeVisible();
});

test('crypto payments are clearly marked as coming soon', async ({ page }) => {
  await page.goto('/payments');
  await expect(page.getByRole('heading', { name: 'Crypto payments with Adena' })).toBeVisible();
  await expect(page.getByText('Coming soon').first()).toBeVisible();
  const connect = page.getByRole('button', { name: 'Connect Adena wallet' });
  await expect(connect).toBeDisabled();
});
