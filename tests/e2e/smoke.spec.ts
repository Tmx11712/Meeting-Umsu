import { test, expect } from '@playwright/test';

test.describe('UI & UX Smoke Test', () => {
    test('halaman login dapat dimuat dan elemen form tampil', async ({ page }) => {
        await page.goto('/login');

        await expect(page).toHaveTitle(/eNotulen|Login/i);
        await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('root dan halaman terproteksi mengarahkan tamu ke halaman login', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL(/\/login$/);

        await page.goto('/dashboard');
        await expect(page).toHaveURL(/\/login$/);
    });
});

