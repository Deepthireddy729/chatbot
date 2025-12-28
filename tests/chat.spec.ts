import { test, expect } from '@playwright/test';

test.describe('Aura Chatbot E2E', () => {
    test('should load the chat interface', async ({ page }) => {
        await page.goto('http://localhost:3000');

        // Check for title
        await expect(page.locator('h1')).toContainText('Aura AI');

        // Check for welcome message
        await expect(page.locator('h2')).toContainText('Welcome to Aura');

        // Check for input field
        const input = page.locator('input[placeholder="Message Aura..."]');
        await expect(input).toBeVisible();
    });

    test('should allow typing and show message', async ({ page }) => {
        await page.goto('http://localhost:3000');

        const input = page.locator('input[placeholder="Message Aura..."]');
        await input.fill('Hello Aura, are you ready?');
        await page.keyboard.press('Enter');

        // Check if message appears in the list
        await expect(page.locator('text=Hello Aura, are you ready?')).toBeVisible();
    });

    test('should show file upload button', async ({ page }) => {
        await page.goto('http://localhost:3000');
        const uploadBtn = page.locator('button[title="Attach Files"]');
        await expect(uploadBtn).toBeVisible();
    });
});
