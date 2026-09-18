import { summarizeReports } from './test-report.mjs';
export function verifyEvidence({ before, after, exitCode, startedAt, reportTime, report }) {
  if (exitCode !== 0) throw new Error('Verification failed');
  if (!Number.isFinite(startedAt) || !Number.isFinite(reportTime) || reportTime < startedAt)
    throw new Error('Require fresh report from this invocation');
  if (!/^[a-f0-9]{64}$/.test(before) || before !== after) throw new Error('Sources changed during verification');
  const counts = summarizeReports([report]);
  if (counts.tests !== 24 || counts.failures || counts.errors || counts.skipped)
    throw new Error('Require the full passing 24-case suite');
  return counts;
}
