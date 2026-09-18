// One bounded run. No raw model events, reasoning, credentials, or command output are saved.
import { spawnSync } from 'node:child_process';
import { readFile, writeFile, mkdir, mkdtemp, copyFile, rm, readdir, stat, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash, randomUUID } from 'node:crypto';
import { parseCodexEvents } from './codex-receipt.mjs';
const root = resolve(import.meta.dirname, '..');
const [model, arm, effort = 'medium'] = process.argv.slice(2);
if (process.argv.length > 5 || !model || !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(model)
  || !['generic', 'tool', 'skill'].includes(arm) || !['low', 'medium', 'high'].includes(effort)) {
  console.error('Usage: node scripts/record-codex.mjs MODEL generic|tool|skill [low|medium|high]'); process.exit(2);
}
const auth = spawnSync('codex', ['login', 'status'], { encoding: 'utf8', timeout: 10000 });
if (auth.error || auth.status !== 0) {
  console.error('Benchmark blocked: authenticate Codex CLI with codex login. No model call was made.'); process.exit(2);
}
const java = spawnSync('java', ['-version'], { encoding: 'utf8', timeout: 10000 });
if (java.error || java.status !== 0 || !/version "(?:2[1-9]|[3-9][0-9])(?:[."])/.test(java.stderr)) {
  console.error('Benchmark requires a local JDK 21+ and the prebuilt lab JAR. Docker is used only to prepare the JAR.'); process.exit(2);
}
const jar = await readFile(resolve(root, 'examples/order-service/target/order-service.jar'));
const seed = await readFile(resolve(root, 'examples/order-service/src/main/resources/data.sql'));
const prompt = await readFile(resolve(root, 'prompts/orders.pt-BR.txt'), 'utf8');
const folder = await mkdtemp(resolve(tmpdir(), 'agentes-benchmark-'));
try {
// Folder outside repository avoids exposing its expected answer and presentation content.
await writeFile(resolve(folder, 'lab.jar'), jar, { mode: 0o600 });
await copyFile(resolve(root, 'prompts/answer.schema.json'), resolve(folder, 'answer.schema.json'));
const generic = 'Interface disponível: java -jar lab.jar schema; java -jar lab.jar list. A listagem consulta o banco sintético. Você pode filtrar e ordenar com código. Use somente essa interface; não inspecione o JAR. Valores monetários no JSON são strings decimais. Não use outro agente.';
const tool = 'Interface disponível: java -jar lab.jar search --status STATUS --limit N. Status: AWAITING_SHIPMENT, SHIPPED, CANCELLED, PENDING_PAYMENT. N: 1..10. Retorna array JSON; total é string decimal. Ordenação total DESC, id DESC. Não use outro agente.';
await writeFile(resolve(folder, 'START.md'), arm === 'generic' ? generic : tool);
if (arm === 'skill') {
  const dir = resolve(folder, '.agents/skills/consultar-pedidos');
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, 'SKILL.md'), `---
name: consultar-pedidos
description: Consultar pedidos do laboratório preservando filtros.
---
Use a interface descrita em START.md. Para aguardar envio, status AWAITING_SHIPMENT. Preserve o limite. Não amplie a busca. A ferramenta ordena por total e ID decrescentes. Não trate uma página como total. Se a restrição não existir, peça esclarecimento.
`);
}
const version = spawnSync('codex', ['--version'], { encoding: 'utf8', timeout: 10000 });
const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
const started = Date.now();
const run = spawnSync('codex', ['exec', '--ignore-user-config', '--ephemeral', '--skip-git-repo-check',
  '--disable', 'multi_agent', '--sandbox', 'read-only', '--json', '--color', 'never',
  '--model', model, '-c', `model_reasoning_effort="${effort}"`, '--cd', folder,
  '--output-schema', resolve(folder, 'answer.schema.json'),
  'Leia START.md para a interface disponível. ' + (arm === 'skill' ? 'Use a skill consultar-pedidos. ' : '') + prompt],
  { encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024 });
let receipt;
try { receipt = parseCodexEvents((run.stdout || '').split('\n')); }
catch { receipt = { protocolComplete: false, correct: false, inputTokens: null, outputTokens: null,
  cachedInputTokens: null, error: 'unrecognized_cli_protocol' }; }
if (run.status !== 0 || run.error) {
  receipt.protocolComplete = false; receipt.correct = false; receipt.usageScope = 'incomplete_observation';
}
const output = {
  schemaVersion: 1, recordedAt: new Date().toISOString(), requestedModel: model, confirmedModel: null,
  arm, reasoningEffort: effort, codexVersion: version.stdout.trim(), revision: revision.stdout.trim(),
  jarSha256: createHash('sha256').update(jar).digest('hex'), seedSha256: createHash('sha256').update(seed).digest('hex'),
  elapsedMs: Date.now() - started, exitCode: run.status, timedOut: run.error?.code === 'ETIMEDOUT',
  peakContextTokens: null, ...receipt
};
const outputDir = resolve(root, '.runs/benchmarks');
await mkdir(outputDir, { recursive: true, mode: 0o700 });
const oldReceipts = await Promise.all((await readdir(outputDir)).filter(name => /^[0-9a-f-]+\.json$/.test(name)).map(async name => ({name, time:(await stat(resolve(outputDir,name))).mtimeMs})));
oldReceipts.sort((a,b) => b.time-a.time);
for (const old of oldReceipts.slice(19)) await unlink(resolve(outputDir,old.name));
const outputFile = resolve(outputDir, `${randomUUID()}.json`);
await writeFile(outputFile, JSON.stringify(output, null, 2) + '\n', { mode: 0o600 });
console.log(JSON.stringify({ receipt: outputFile, status: output.correct ? 'correct' : 'failed_or_incomplete' }));
process.exitCode = output.correct ? 0 : 1;
} finally {
  await rm(folder, { recursive: true, force: true });
}
