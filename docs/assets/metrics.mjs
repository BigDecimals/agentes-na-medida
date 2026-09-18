export function summarizeRuns(runs) {
  if (!Array.isArray(runs)) throw new TypeError('Invalid runs');
  if (runs.length === 0) return { measured: false, count: 0 };
  const total = { measured: true, count: runs.length, successes: 0,
    inputTokens: 0, outputTokens: 0, cachedInputTokens: 0, totalTokens: 0, elapsedMs: 0 };
  for (const run of runs) {
    if (run.protocolComplete === false || run.usageScope === 'incomplete_observation')
      throw new TypeError('Incomplete usage cannot support a total');
    for (const key of ['inputTokens', 'outputTokens', 'cachedInputTokens', 'elapsedMs']) {
      if (!Number.isSafeInteger(run[key]) || run[key] < 0) throw new TypeError(`Invalid ${key}`);
      total[key] += run[key];
      if (!Number.isSafeInteger(total[key])) throw new RangeError('Invalid aggregate');
    }
    if (run.cachedInputTokens > run.inputTokens) throw new RangeError('Invalid cached input');
    if (typeof run.correct !== 'boolean') throw new TypeError('Invalid correctness');
    total.successes += Number(run.correct);
  }
  total.totalTokens = total.inputTokens + total.outputTokens;
  if (!Number.isSafeInteger(total.totalTokens)) throw new RangeError('Invalid total');
  return total;
}
