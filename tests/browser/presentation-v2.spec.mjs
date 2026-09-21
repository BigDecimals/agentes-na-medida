import { test, expect } from '@playwright/test';

test('second deck navigates independently with no external runtime requests', async ({ page }) => {
  const errors = [], external = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:4173/')) external.push(r.url()); });
  await page.goto('/apresentacao-2/');
  await expect(page.locator('.reveal')).toHaveClass(/ready/);
  await expect(page.locator('.slides > section')).toHaveCount(19);
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#alavancas')).toHaveClass(/present/);
  await page.goto('/apresentacao-2/#/resultado-skill');
  await expect(page.locator('#resultado-skill')).toHaveClass(/present/);
  await expect(page.locator('#resultado-skill')).toContainText('25,5% menos tokens');
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('second deck fits each slide and reading notes fit mobile', async ({ page }) => {
  await page.goto('/apresentacao-2/');
  await expect(page.locator('.reveal')).toHaveClass(/ready/);
  const failures = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.slides > section').forEach((slide, i) => {
      Reveal.slide(i);
      const source = slide.querySelector('.source').getBoundingClientRect();
      const bounds = slide.getBoundingClientRect();
      for (const child of slide.children) {
        if (child.matches('.notes,.source,.folio')) continue;
        const rect = child.getBoundingClientRect();
        if (rect.bottom > source.top - 5 || rect.left < bounds.left || rect.right > bounds.right) bad.push(slide.id);
      }
    });
    return bad;
  });
  expect(failures).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/apresentacao-2/?view=reading');
  await expect(page.locator('.notes:visible')).toHaveCount(19);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});

test('published evidence links resolve and aggregates match', async ({ page, request }) => {
  await page.goto('/apresentacao-2/evidence/');
  await expect(page).toHaveTitle('Evidências — Apresentação 2');
  for (const file of ['runs.json', 'summary.json', 'protocol.json', 'skill.txt']) {
    await expect(page.locator(`a[href="${file}"]`)).toHaveCount(1);
    const response = await request.get(`/apresentacao-2/evidence/${file}`);
    expect(response.status()).toBe(200);
  }
  const runs = await (await request.get('/apresentacao-2/evidence/runs.json')).json();
  const summary = await (await request.get('/apresentacao-2/evidence/summary.json')).json();
  expect(runs).toHaveLength(6);
  expect(runs.every(r => r.correct && r.usageComplete)).toBeTruthy();
  for (const arm of ['baseline', 'skill']) {
    const rows = runs.filter(r => r.arm === arm);
    const values = rows.map(r => r.totalTokens).sort((a, b) => a - b);
    expect(values[1]).toBe(summary.arms[arm].totalTokens.median);
    for (const r of rows) {
      expect(r.totalTokens).toBe(r.perCall.reduce((s, c) => s + c.usage.input_tokens + c.usage.output_tokens, 0));
    }
  }
});
