import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeReports } from '../scripts/test-report.mjs';
// Synthetic XML fixtures test parsing only; they are not execution evidence.
test('parses Surefire counts without treating skipped tests as execution', () => {
  assert.deepEqual(summarizeReports(['<testsuite tests="4" failures="1" errors="0" skipped="2">']),
    { tests: 4, failures: 1, errors: 0, skipped: 2, executed: 2 });
});
test('missing or malformed report is not a pass', () => {
  assert.throws(() => summarizeReports([]), /No/);
  assert.throws(() => summarizeReports(['<testsuite tests="2">']), /Invalid/);
});
test('validates count consistency', () => {
  assert.throws(() => summarizeReports(['<testsuite tests="1" failures="2" errors="0" skipped="0">']), /Invalid/);
});
