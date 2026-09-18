export function summarizeReports(xmls) {
  if (!Array.isArray(xmls) || xmls.length === 0) throw new Error('No fresh test report');
  const total = { tests: 0, failures: 0, errors: 0, skipped: 0, executed: 0 };
  for (const xml of xmls) {
    const tag = xml.match(/<testsuite\b[^>]*>/)?.[0];
    if (!tag) throw new Error('Invalid report');
    const counts = {};
    for (const key of ['tests', 'failures', 'errors', 'skipped']) {
      const raw = tag.match(new RegExp(`\\b${key}="([0-9]+)"`))?.[1];
      const value = Number(raw);
      if (raw === undefined || !Number.isSafeInteger(value)) throw new Error(`Invalid ${key}`);
      counts[key] = value;
      total[key] += value;
      if (!Number.isSafeInteger(total[key])) throw new Error('Invalid aggregate');
    }
    if (counts.failures + counts.errors + counts.skipped > counts.tests) throw new Error('Invalid counts');
  }
  total.executed = total.tests - total.skipped;
  return total;
}
