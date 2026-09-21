import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
test('README links to a separate second presentation below the original link', async () => {
  const readme = await readFile(new URL('README.md', root), 'utf8');
  assert.match(readme, /\*\*\[Abrir apresentação\][^\n]*\n\n\*\*\[Apresentação 2\]\(https:\/\/bigdecimals.github.io\/agentes-na-medida\/apresentacao-2\/\)\*\*/);
  const html = await readFile(new URL('docs/apresentacao-2/index.html', root), 'utf8');
  assert.match(html, /lang="pt-BR"/);
  assert.equal([...html.matchAll(/<section id=/g)].length, 19);
  assert.match(html, /25,5% menos tokens/);
  assert.match(html, /evidence\/index.html/);
});
