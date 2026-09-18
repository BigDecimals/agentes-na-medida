import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const files = ['dist/reveal.js', 'dist/reveal.css', 'dist/reset.css',
  'dist/plugin/highlight.js', 'dist/plugin/highlight/monokai.css',
  'dist/plugin/notes.js', 'LICENSE'];
const pkg = JSON.parse(await readFile(resolve(root, 'node_modules/reveal.js/package.json')));
if (pkg.version !== '6.0.2') throw new Error('Unexpected reveal.js version');
for (const file of files) {
  const target = resolve(root, 'docs/vendor/reveal', file);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(resolve(root, 'node_modules/reveal.js', file), target);
}
console.log(`Vendored reveal.js ${pkg.version}: ${files.length} files, with license.`);
