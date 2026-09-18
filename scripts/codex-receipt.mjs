const expected = [1004, 1002, 1009, 1007, 1001];
export function parseCodexEvents(lines) {
  let completedTurns = 0, commandCalls = 0, failed = false, answer = null;
  let active = false, currentAnswer = null;
  const itemTypes = new Set(['agent_message', 'reasoning', 'command_execution', 'file_change', 'mcp_tool_call', 'web_search', 'todo_list']);
  const usage = { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 };
  for (const line of lines) {
    if (!line.trim()) continue;
    let event;
    try { event = JSON.parse(line); } catch { throw new Error('Invalid event JSON'); }
    if (!event || typeof event.type !== 'string') throw new Error('Invalid event type');
    if (event.type === 'thread.started') { if (active || completedTurns) failed = true; continue; }
    if (event.type === 'turn.started') {
      if (active) failed = true;
      active = true; currentAnswer = null; continue;
    }
    if (event.type === 'error' || event.type === 'turn.failed') { failed = true; active = false; continue; }
    if (!['item.started', 'item.updated', 'item.completed', 'turn.completed'].includes(event.type)) failed = true;
    if (event.type.startsWith('item.')) {
      if (!active || !itemTypes.has(event.item?.type)) failed = true;
    }
    if (event.type === 'item.completed' && event.item?.type === 'command_execution') commandCalls++;
    if (event.type === 'item.completed' && event.item?.type === 'agent_message') {
      try { currentAnswer = JSON.parse(event.item.text); } catch { currentAnswer = null; }
    }
    if (event.type === 'turn.completed') {
      if (!active) failed = true;
      answer = currentAnswer; active = false;
      for (const [local, remote] of Object.entries({ inputTokens: 'input_tokens',
        outputTokens: 'output_tokens', cachedInputTokens: 'cached_input_tokens' })) {
        const count = event.usage?.[remote];
        if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid provider usage');
        usage[local] += count;
        if (!Number.isSafeInteger(usage[local])) throw new Error('Invalid usage sum');
      }
      if (event.usage.cached_input_tokens > event.usage.input_tokens) throw new Error('Invalid cached usage');
      completedTurns++;
    }
  }
  const protocolComplete = completedTurns > 0 && !failed && !active;
  const ids = answer && Object.keys(answer).length === 1 && Array.isArray(answer.orderIds)
    && answer.orderIds.length <= 5 && answer.orderIds.every(Number.isSafeInteger) ? answer.orderIds : null;
  return { protocolComplete, completedTurns, commandCalls,
    inputTokens: completedTurns ? usage.inputTokens : null,
    outputTokens: completedTurns ? usage.outputTokens : null,
    cachedInputTokens: completedTurns ? usage.cachedInputTokens : null,
    usageScope: protocolComplete ? 'reported_completed_turns' : 'incomplete_observation',
    orderIds: ids, correct: protocolComplete && JSON.stringify(ids) === JSON.stringify(expected) };
}
