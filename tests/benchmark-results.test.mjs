import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
const load = async path => JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
const median = values => [...values].sort((a,b)=>a-b)[1];

test('published campaign includes every planned trial and terminal usage receipt', async () => {
  const runs=await load('benchmarks/results/runs.json');
  assert.equal(runs.length,12);
  assert.equal(new Set(runs.map(r=>`${r.requestedModel}/${r.arm}/${r.trial}`)).size,12);
  for(const r of runs){
    assert.equal(r.usageComplete,true); assert.equal(r.sourcesUnchanged,true);
    assert.deepEqual(r.servedModels,[r.requestedModel]);
    assert.equal(r.apiCalls,r.perCallUsage.length); assert.equal(r.toolCalls,r.toolEvents.length);
    for(const key of ['inputTokens','outputTokens','cachedInputTokens','reasoningTokens']){
      assert.ok(Number.isSafeInteger(r[key]) && r[key]>=0);
      assert.equal(r[key],r.perCallUsage.reduce((sum,c)=>sum+c[key],0));
    }
    assert.ok(r.cachedInputTokens<=r.inputTokens); assert.ok(r.reasoningTokens<=r.outputTokens);
    assert.equal(r.correct,true); assert.deepEqual(r.orderIds,[1004,1002,1009,1007,1001]);
    if(r.arm==='skill') assert.ok(r.toolEvents.some(e=>e.name==='load_skill'));
  }
});
test('displayed medians are recomputed from all comparable runs, not invented', async () => {
  const runs=await load('benchmarks/results/runs.json');
  const groups=await load('benchmarks/results/summary.json');
  assert.equal(groups.length,4);
  for(const g of groups){
    const rs=runs.filter(r=>r.requestedModel===g.model && r.arm===g.arm);
    assert.equal(rs.length,3); assert.deepEqual(rs.map(r=>r.trial).sort(),[1,2,3]);
    assert.equal(g.medianTotalTokens,median(rs.map(r=>r.inputTokens+r.outputTokens)));
    assert.equal(g.medianInputTokens,median(rs.map(r=>r.inputTokens)));
    assert.equal(g.medianOutputTokens,median(rs.map(r=>r.outputTokens)));
    assert.equal(g.medianElapsedMs,median(rs.map(r=>r.elapsedMs)));
    assert.equal(g.sumInputTokens,rs.reduce((n,r)=>n+r.inputTokens,0));
    assert.equal(g.sumOutputTokens,rs.reduce((n,r)=>n+r.outputTokens,0));
  }
  const context={window:{}};
  vm.runInNewContext(await readFile(new URL('../docs/data/benchmark.js',import.meta.url),'utf8'),context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.BENCHMARK.groups)),groups);
  assert.equal(context.window.BENCHMARK.runCount,12);
});
test('receipts bind the published harness, prompt, skill and synthetic seed', async () => {
  const paths=['scripts/benchmark_core.py','scripts/benchmark_trial.py','scripts/record-hermes.py',
    'scripts/java-lab.sh','prompts/orders.pt-BR.txt','.agents/skills/consultar-pedidos/SKILL.md'];
  const hash=createHash('sha256');
  for(const path of paths) hash.update(path).update('\0').update(await readFile(new URL('../'+path,import.meta.url))).update('\0');
  const fingerprint=hash.digest('hex');
  const seed=createHash('sha256').update(await readFile(new URL('../examples/order-service/src/main/resources/data.sql',import.meta.url))).digest('hex');
  for(const r of await load('benchmarks/results/runs.json')) {
    assert.equal(r.harnessSha256,fingerprint); assert.equal(r.embeddedSeedSha256,seed);
  }
});
