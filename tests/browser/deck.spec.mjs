import { test, expect } from '@playwright/test';

test('deck loads locally without runtime errors or third-party requests', async ({ page }) => {
  const errors = [], requests = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => requests.push(r.url()));
  await page.goto('/');
  await expect(page.locator('.reveal')).toHaveClass(/ready/);
  await expect(page).toHaveTitle(/Agentes na medida/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  expect(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(17, 21, 29)');
  expect(errors).toEqual([]);
  expect(requests.every(url => url.startsWith('http://127.0.0.1:4173/'))).toBeTruthy();
});
test('keyboard navigation and bakery reveal work', async ({ page }) => {
  await page.goto('/#/padaria');
  await expect(page.locator('#padaria')).toHaveClass(/present/);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#padaria .fragment').first()).toHaveClass(/visible/);
  await page.keyboard.press('Escape');
  await expect(page.locator('.reveal')).toHaveClass(/overview/);
});
test('benchmark shows real measured configurations with sample limits', async ({ page }) => {
  await page.goto('/#/evidencia');
  await expect(page.locator('#benchmark-status')).toContainText('12 execuções');
  await expect(page.locator('[data-benchmark-arm]')).toHaveCount(3);
  await expect(page.locator('#benchmark-reason')).toContainText('mediana');
  await expect(page.locator('#evidencia')).toContainText('n = 3');
});
test('model choice reveals task-dependent guidance without a leaderboard', async ({ page }) => {
  await page.goto('/#/modelos');
  await page.getByRole('button', { name: 'Investigar falha entre serviços' }).click();
  await expect(page.locator('#model-advice')).toContainText('mais capaz');
  await page.getByRole('button', { name: 'Traduzir pedido em filtros' }).click();
  await expect(page.locator('#model-advice')).toContainText('mais leve');
});
test('reading mode exposes all content and reduced motion disables transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?view=reading');
  await expect(page.locator('body')).toHaveClass(/reading/);
  await expect(page.locator('#fechamento')).toBeVisible();
  expect(await page.locator('.slides > section[aria-hidden="true"]').count()).toBe(0);
  expect(await page.evaluate(() => Reveal.getConfig().transition)).toBe('none');
});
test('mobile reading mode has no horizontal page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?view=reading');
  await expect(page.locator('.reveal')).toHaveClass(/ready/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});
test('print mode lays out all slides', async ({ page }) => {
  await page.goto('/?print-pdf');
  await expect(page.locator('.pdf-page')).toHaveCount(15);
});
test('every slide fits the 16:9 stage and has speaker notes', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.reveal')).toHaveClass(/ready/);
  const failures = await page.evaluate(async () => {
    const result = [];
    for (const [i, slide] of [...document.querySelectorAll('.slides > section')].entries()) {
      Reveal.slide(i); await new Promise(r => setTimeout(r, 30));
      if (!slide.querySelector('aside.notes')?.textContent.trim()) result.push(`${slide.id}: no notes`);
      if (slide.scrollHeight > slide.clientHeight + 2) result.push(`${slide.id}: vertical overflow`);
    }
    return result;
  });
  expect(failures).toEqual([]);
});
