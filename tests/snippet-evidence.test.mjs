import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyEvidence } from '../scripts/snippet-evidence.mjs';
const valid = { before:'a'.repeat(64), after:'a'.repeat(64), exitCode:0, startedAt:20, reportTime:30,
  report:'<testsuite tests="24" failures="0" errors="0" skipped="0">' };
test('stale passing report cannot certify changed untested code', () => {
  assert.throws(() => verifyEvidence({...valid, reportTime:10}), /fresh/);
});
test('source mutation during validation invalidates evidence', () => {
  assert.throws(() => verifyEvidence({...valid, after:'b'.repeat(64)}), /changed/);
});
test('only a complete passing real invocation is eligible', () => {
  assert.throws(() => verifyEvidence({...valid, exitCode:1}), /failed/);
  assert.throws(() => verifyEvidence({...valid, report:'<testsuite tests="1" failures="0" errors="0" skipped="0">'}), /full/);
});
