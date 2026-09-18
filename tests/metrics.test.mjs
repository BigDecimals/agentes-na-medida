import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeRuns } from '../docs/assets/metrics.mjs';

test('does not manufacture statistics for an unmeasured benchmark', () => {
  assert.deepEqual(summarizeRuns([]), { measured: false, count: 0 });
});
test('sums ALL attempts, counts correctness separately and preserves cached subset', () => {
  const result = summarizeRuns([
    { inputTokens: 100, outputTokens: 20, cachedInputTokens: 40, elapsedMs: 2000, correct: true },
    { inputTokens: 50, outputTokens: 10, cachedInputTokens: 0, elapsedMs: 1000, correct: false }
  ]);
  assert.deepEqual(result, { measured: true, count: 2, successes: 1, inputTokens: 150,
    outputTokens: 30, cachedInputTokens: 40, totalTokens: 180, elapsedMs: 3000 });
});
test('rejects unknown/missing token counts instead of reporting zero', () => {
  assert.throws(() => summarizeRuns([{ correct: true }]), /Invalid/);
  const partial = { inputTokens:100, outputTokens:20, cachedInputTokens:0, elapsedMs:1, correct:false };
  assert.throws(() => summarizeRuns([{...partial,protocolComplete:false}]), /Incomplete/);
  assert.throws(() => summarizeRuns([{...partial,usageScope:'incomplete_observation'}]), /Incomplete/);
});
test('rejects invalid cached accounting', () => {
  assert.throws(() => summarizeRuns([{ inputTokens: 10, outputTokens: 2,
    cachedInputTokens: 20, elapsedMs: 1, correct: true }]), /cached/);
});
