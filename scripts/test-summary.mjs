import { spawnSync } from 'node:child_process';
import { mkdir, readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { randomUUID } from 'node:crypto';
import { summarizeReports } from './test-report.mjs';
const root = resolve(import.meta.dirname, '..');
const selector = process.argv[2];
if (process.argv.length > 3 || (selector && !/^[A-Za-z][A-Za-z0-9_]*(#[A-Za-z][A-Za-z0-9_]*)?$/.test(selector))) {
  console.error('Usage: node scripts/test-summary.mjs [TestClass#method]'); process.exit(2);
}
const logs = resolve(root, '.runs/tests');
await mkdir(logs, { recursive: true, mode: 0o700 });
const old = await Promise.all((await readdir(logs)).filter(n => /^[0-9a-f-]+\.log$/.test(n))
  .map(async name => ({ name, time: (await stat(resolve(logs, name))).mtimeMs })));
old.sort((a,b) => b.time - a.time);
for (const [i, file] of old.entries()) {
  if (i >= 9 || Date.now() - file.time > 86400000) await unlink(resolve(logs, file.name));
}
const started = Date.now();
const result = spawnSync(resolve(root, 'scripts/java-lab.sh'),
  ['test', ...(selector ? [`-Dtest=${selector}`] : [])],
  { cwd: root, encoding: 'utf8', timeout: 300000, maxBuffer: 2 * 1024 * 1024 });
const log = resolve(logs, `${randomUUID()}.log`);
await writeFile(log, `${result.stdout || ''}\n${result.stderr || ''}`.slice(-2 * 1024 * 1024), { mode: 0o600 });
const reportDir = resolve(root, 'examples/order-service/target/surefire-reports');
const xmls = [];
for (const name of await readdir(reportDir).catch(() => [])) {
  if (!name.startsWith('TEST-') || !name.endsWith('.xml')) continue;
  const file = resolve(reportDir, name);
  if ((await stat(file)).mtimeMs >= started) xmls.push(await readFile(file, 'utf8'));
}
let counts = null, reportError = null;
try { counts = summarizeReports(xmls); } catch (error) { reportError = error.message; }
const verified = !result.error && result.status === 0 && counts?.executed > 0 && counts.failures === 0 && counts.errors === 0;
const summary = { status: verified ? 'passed' : 'failed_or_incomplete', commandExitCode: result.status,
  signal: result.signal, counts, elapsedMs: Date.now() - started, log: relative(root, log) };
if (!verified) {
  summary.error = result.error?.code || reportError || 'Test failure';
  summary.diagnostics = (result.stderr || '').split('\n').filter(line =>
    /ERROR|FAILURE|Tests run:|Caused by:|Exception/.test(line)).slice(-20).join('\n').slice(-4000);
}
console.log(JSON.stringify(summary, null, 2));
process.exitCode = verified ? 0 : (result.status || 3);
