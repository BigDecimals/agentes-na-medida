import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);

test('published Java snippet exactly matches its source hash and content', async () => {
  const context = { window: {} };
  vm.runInNewContext(await readFile(new URL('docs/data/verified-code.js', root), 'utf8'), context);
  const receipt = context.window.VERIFIED_CODE;
  const source = await readFile(new URL(receipt.source, root), 'utf8');
  assert.equal(createHash('sha256').update(source).digest('hex'), receipt.sourceSha256);
  const method = source.match(/    public List<Order> search\([\s\S]*?\n    }/)[0]
    .split('\n').map(line => line.replace(/^    /, '')).join('\n');
  assert.equal(receipt.javaSnippet, method);
  assert.equal(receipt.tests.executed, 24);
});
test('content fits 15 minutes with fifteen slides', async () => {
  const html = await readFile(new URL('docs/index.html', root), 'utf8');
  const seconds = [...html.matchAll(/data-timing="(\d+)"/g)].reduce((n, m) => n + Number(m[1]), 0);
  assert.ok(seconds > 780 && seconds <= 900);
  assert.equal([...html.matchAll(/<section id=/g)].length, 15);
});
